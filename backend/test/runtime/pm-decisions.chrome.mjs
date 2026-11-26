import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, open } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

async function waitUntil(check, label) {
  for (let index = 0; index < 100; index += 1) {
    if (await check()) return;
    await delay(125);
  }
  throw new Error(`Chrome runtime timeout: ${label}`);
}

async function stop(child) {
  if (!child.pid || child.exitCode !== null || child.signalCode) return;
  const finished = once(child, 'exit');
  child.kill();
  await Promise.race([finished, delay(3000, undefined, { ref: false })]);
}

async function openCDP(debug) {
  let target;
  await waitUntil(async () => {
    const reply = await fetch(debug + '/json/version').catch(() => null);
    if (reply?.ok) target = await reply.json();
    return target;
  }, 'CDP');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await Promise.race([
    once(socket, 'open'),
    once(socket, 'error').then(() => { throw new Error('Chrome CDP WebSocket failed.'); }),
    delay(5000, undefined, { ref: false }).then(() => { throw new Error('Chrome CDP WebSocket timeout.'); }),
  ]);
  const pending = new Map();
  let lastId = 0;
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    if (message.error) handler.reject(new Error(message.error.message));
    else handler.resolve(message.result);
  });
  return {
    close: () => socket.close(),
    send(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const id = ++lastId;
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Chrome CDP timeout: ${method}`));
        }, 5000);
        pending.set(id, {
          resolve: value => { clearTimeout(timer); resolve(value); },
          reject: error => { clearTimeout(timer); reject(error); },
        });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
      });
    },
  };
}

export async function chromeWorkflow({ origin, backend, fixture, expireSession }) {
  const chromePath = process.env.PM003_CHROME_PATH;
  const attached = process.env.PM003_TEST_CHROME_PORT;
  assert.ok(chromePath || attached, 'Cần PM003_CHROME_PATH hoặc cổng Chrome nghiệm thu.');
  if (attached) assert.match(attached, /^\d{4,5}$/);
  const cdpPort = attached ?? '9237';
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5193', '--strictPort'], {
    cwd: resolve('../frontend'), env: { ...process.env, BACKEND_URL: backend }, stdio: 'ignore', windowsHide: true,
  });
  let chrome;
  if (!attached) {
    const profile = await mkdtemp(resolve('../.local/pm-decision003/chrome-'));
    const log = await open(join(profile, 'chrome.err'), 'w');
    chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--in-process-gpu', '--disable-software-rasterizer',
      '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${join(profile, 'profile')}`, 'about:blank'], {
      stdio: ['ignore', 'ignore', log.fd], windowsHide: true,
    });
    await log.close();
  }
  let cdp;
  let context;
  try {
    await waitUntil(async () => (await fetch(origin).catch(() => null))?.ok, 'Vite');
    cdp = await openCDP(`http://127.0.0.1:${cdpPort}`);
    const { browserContextId } = await cdp.send('Target.createBrowserContext', { disposeOnDetach: true });
    context = browserContextId;
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const page = (method, params) => cdp.send(method, params, sessionId);
    await page('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    async function evaluate(fn, ...args) {
      const result = await page('Runtime.evaluate', {
        expression: `(${fn})(...${JSON.stringify(args)})`, awaitPromise: true, returnByValue: true,
      });
      if (result.exceptionDetails) throw new Error('Chrome runtime evaluation failed.');
      return result.result.value;
    }
    const has = (copy) => waitUntil(() => evaluate(text =>
      document.body?.innerText.includes(text), copy), copy);
    const click = (copy) => waitUntil(() => evaluate(text => {
      const button = [...document.querySelectorAll('button')].find(node => node.textContent.trim() === text && !node.disabled);
      if (!button) return false;
      button.click();
      return true;
    }, copy), copy);
    const field = (selector, value) => waitUntil(() => evaluate((key, next) => {
      const control = document.querySelector(key);
      if (!control) return false;
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(control), 'value').set.call(control, next);
      control.dispatchEvent(new Event(control instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
      return control.value === next;
    }, selector, value), selector);
    async function login() {
      await has('Đăng nhập');
      await field('input[name=email]', fixture.accounts[0].email);
      await field('input[name=password]', fixture.accounts[0].password);
      await click('Đăng nhập');
    }
    async function prepare() {
      await click('Đề xuất nhân sự');
      await field('.project-recommendations__form select', fixture.skill);
      await field('.project-recommendations__form input[type=date]', fixture.weekStart);
      await field('.project-recommendations__form input[type=number]', '0.3');
      await click('Xem đề xuất');
      await click('Mô phỏng với Fixture PM003');
      await click('Xác nhận và mô phỏng');
      await has('Giờ trống giả định còn lại');
    }
    async function delayDecisionResponse() {
      await evaluate(() => {
        const original = window.fetch;
        window.pm003Held = false;
        window.fetch = async (path, init) => {
          if (init?.method === 'POST' && String(path).endsWith('/decisions')) {
            window.fetch = original;
            const response = await original(path, init);
            if (response.status !== 201) return response;
            window.pm003Held = true;
            return new Promise(resolve => { window.pm003Release = () => resolve(response); });
          }
          return original(path, init);
        };
      });
    }
    const held = () => waitUntil(() => evaluate(() => window.pm003Held), 'response committed and held');
    const release = () => evaluate(() => { window.pm003Release(); return true; });
    const projectUrl = `${origin}/#project/${fixture.project}`;
    await page('Page.navigate', { url: projectUrl });
    await login();
    await has('PM003 workflow');
    // Wait for the protected Project page before submitting a simulated choice.
    await evaluate(url => { location.hash = new URL(url).hash; return true; }, projectUrl);
    await prepare();
    await field('form:not(.project-recommendations__form) input[type=number][step=any]', '0.1');
    await has('Phương án đã thay đổi.');
    assert.equal(await evaluate(() => [...document.querySelectorAll('button')]
      .some(node => node.textContent.trim() === 'Chấp nhận')), false);
    await click('Xác nhận và mô phỏng');
    await delayDecisionResponse();
    await click('Chấp nhận');
    await has('Đang lưu quyết định');
    await held();
    assert.equal(await evaluate(() => document.body.innerText.includes('Đã lưu quyết định')), false);
    await has('Chưa xác nhận được quyết định.');
    await click('Thử lại quyết định');
    await has('Đã lưu quyết định chấp nhận.');
    await release();
    await click('Xác nhận và mô phỏng');
    await click('Từ chối');
    await has('Đã lưu quyết định từ chối.');
    await page('Page.reload');
    await has('PM003 workflow');
    await click('Xem lịch sử quyết định');
    await has('Lịch sử quyết định');
    await waitUntil(() => evaluate(() => {
      const entries = [...document.querySelectorAll('[aria-label="Lịch sử quyết định"] summary')];
      return entries.length === 2 && entries[0].textContent.includes('Từ chối') &&
        entries[1].textContent.includes('Chấp nhận');
    }), '2 quyết định được tải lại');
    await prepare();
    await delayDecisionResponse();
    await click('Chấp nhận');
    await held();
    await click('Danh sách dự án');
    const openProject = (name) => waitUntil(() => evaluate(title => {
      const button = document.querySelector(`button[aria-label="Mở dự án ${title}"]`);
      if (!button) return false;
      button.click();
      return true;
    }, name), name);
    await openProject('PM003 khác');
    await has('PM003 khác');
    await release();
    await evaluate(() => {
      const original = window.fetch;
      window.pm003RestoreHistory = () => { window.fetch = original; };
      window.fetch = async (path, init) => {
        if (String(path).includes('/decisions') && init?.method !== 'POST') {
          window.pm003HistoryFailure = true;
          return Response.json({}, { status: 503 });
        }
        return original(path, init);
      };
    });
    await click('Xem lịch sử quyết định');
    await waitUntil(() => evaluate(() => window.pm003HistoryFailure), 'history response failed');
    await has('Chưa tải được lịch sử.');
    await evaluate(() => { window.pm003RestoreHistory(); return true; });
    await click('Thử lại lịch sử');
    await has('Chưa có quyết định trên trang này.');
    assert.equal(await evaluate(() => document.body.innerText.includes('Đã lưu quyết định')), false);
    await click('Danh sách dự án');
    await openProject('PM003 workflow');
    await has('PM003 workflow');
    await prepare();
    await delayDecisionResponse();
    await click('Từ chối');
    await held();
    await click('Đăng xuất');
    await has('Đăng nhập');
    await release();
    assert.equal(await evaluate(() => document.body.innerText.includes('Đã lưu quyết định')), false);
    await page('Page.navigate', { url: projectUrl });
    await login();
    await has('PM003 workflow');
    await prepare();
    await expireSession();
    await click('Từ chối');
    await has('Đăng nhập');
    console.log(JSON.stringify({
      runtime: 'Chrome/Vite/NestJS/MariaDB', choices: 2, reload: true, staleInput: true,
      lostResponseRetry: true, lateResponseAfterProjectChange: true, lateResponseAfterLogout: true,
      historyRetry: true, expiredSession: true,
    }));
  } finally {
    if (context) await cdp.send('Target.disposeBrowserContext', { browserContextId: context }).catch(() => undefined);
    cdp?.close();
    await Promise.all([chrome && stop(chrome), stop(vite)]);
  }
}
