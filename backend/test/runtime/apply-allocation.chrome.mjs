import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

async function until(check, label) {
  for (let tries = 0; tries < 150; tries++) {
    if (await check()) return;
    await sleep(125);
  }
  throw new Error(`Chrome timeout: ${label}`);
}

async function stop(process) {
  if (!process?.pid || process.exitCode !== null || process.signalCode) return;
  const stopped = once(process, 'exit');
  process.kill();
  await Promise.race([stopped, sleep(3000)]);
}

export async function runChrome(fixture, origin, backendUrl) {
  const chromePath = process.env.PM006_CHROME_PATH;
  assert.ok(chromePath, 'PM006_CHROME_PATH required.');
  const profile = await mkdtemp(resolve('../.local/pm-allocation006/chrome-'));
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5196', '--strictPort'], {
    cwd: resolve('../frontend'), env: { ...process.env, BACKEND_URL: backendUrl }, stdio: 'ignore', windowsHide: true,
  });
  const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--in-process-gpu', '--disable-software-rasterizer',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=9238',
    `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
  let socket;
  try {
    let cdp;
    await until(async () => {
      const response = await fetch('http://127.0.0.1:9238/json/version').catch(() => null);
      if (response?.ok) cdp = await response.json();
      return cdp?.webSocketDebuggerUrl;
    }, 'CDP');
    await until(async () => (await fetch(origin).catch(() => null))?.ok, 'Vite');
    socket = new WebSocket(cdp.webSocketDebuggerUrl);
    await Promise.race([once(socket, 'open'), sleep(5000).then(() => { throw new Error('CDP connection timeout.'); })]);
    let sequence = 0;
    const pending = new Map();
    socket.addEventListener('message', ({ data }) => {
      const value = JSON.parse(data);
      pending.get(value.id)?.(value);
    });
    const send = (method, params = {}, sessionId) => new Promise((done, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 8000);
      pending.set(id, value => {
        pending.delete(id);
        clearTimeout(timer);
        if (value.error) reject(new Error(value.error.message));
        else done(value.result);
      });
      socket.send(JSON.stringify({ id,method,params,sessionId }));
    });
    const { browserContextId } = await send('Target.createBrowserContext', { disposeOnDetach: true });
    const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const page = (method, params) => send(method, params, sessionId);
    async function evaluate(fn, ...args) {
      const result = await page('Runtime.evaluate', { expression: `(${fn})(...${JSON.stringify(args)})`,
        awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error('Browser evaluation failed.');
      return result.result.value;
    }
    const has = text => until(() => evaluate(value => document.body?.innerText.includes(value), text), text);
    const click = text => until(() => evaluate(value => {
      const button = [...document.querySelectorAll('button')].find(node =>
        node.textContent.trim() === value && !node.disabled && node.getClientRects().length);
      if (!button) return false;
      button.click();
      return true;
    }, text), text);
    const field = (selector, input) => until(() => evaluate((key, value) => {
      const element = document.querySelector(key);
      if (!element) return false;
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set.call(element, value);
      element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
      return element.value === value;
    }, selector, input), selector);
    async function login(account) {
      await has('Đăng nhập');
      await field('input[name=email]', account.email);
      await field('input[name=password]', account.password);
      await click('Đăng nhập');
    }
    const projectUrl = `${origin}/#project/${fixture.projects[0]}`;
    await page('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await page('Page.navigate', { url: projectUrl });
    await login(fixture.accounts[0]);
    await has('Allocate 006 A');
    await click('Đề xuất nhân sự');
    await field('.project-recommendations__form select', fixture.skill);
    await field('.project-recommendations__form input[type=date]', fixture.week);
    await field('.project-recommendations__form input[type=number]', '0.1');
    await click('Xem đề xuất');
    await click('Mô phỏng với Fixture 006');
    await click('Xác nhận và mô phỏng');
    await has('Giờ trống giả định còn lại');
    await click('Chấp nhận');
    await has('Đã lưu quyết định chấp nhận.');
    await click('Xem lịch sử quyết định');
    await until(() => evaluate(() => {
      const result = document.querySelector('[aria-label="Lịch sử quyết định"] details');
      if (!result) return false;
      result.open = true;
      return true;
    }), 'Chi tiết quyết định');
    await evaluate(() => {
      const original = window.fetch;
      window.fetch = async (path, init) => {
        if (init?.method === 'POST' && String(path).endsWith('/apply')) {
          window.fetch = original;
          const response = await original(path, init);
          if (response.status === 201) {
            await new Promise(resolve => setTimeout(resolve, 400));
            return Response.json({ code: 'APPLICATION_UNCONFIRMED' }, { status: 503 });
          }
          return response;
        }
        return original(path, init);
      };
    });
    await click('Áp dụng phân bổ');
    await has('Đang xử lý phân bổ');
    await has('Chưa xác nhận được kết quả');
    await click('Đối chiếu phân bổ');
    await has('Đã áp dụng 0,1 giờ');
    await page('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    await page('Page.reload');
    await has('Allocate 006 A');
    await click('Xem lịch sử áp dụng');
    await has('Đã áp dụng 0,1 giờ');
    assert.equal(await evaluate(() => document.documentElement.scrollWidth <= 391), true);
    await click('Danh sách dự án');
    await until(() => evaluate(() => {
      const button = document.querySelector('button[aria-label="Mở dự án Allocate 006 B"]');
      if (!button) return false;
      button.click();
      return true;
    }), 'Mở Project khác');
    await has('Allocate 006 B');
    await click('Xem lịch sử áp dụng');
    await has('Chưa có kết quả áp dụng trên trang này.');
    assert.equal(await evaluate(() => document.body.innerText.includes('Đã áp dụng 0,1 giờ')), false);
    await click('Đăng xuất');
    await has('Đăng nhập');
    await page('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await login(fixture.accounts[2]);
    await click('Nhân sự');
    await has('Đã phân bổ 0,1 giờ');
    await has('Còn lại 0,2 giờ');
    assert.equal(await evaluate(() => document.body.innerText.includes('Allocate 006 A')), false);
    await click('Đăng xuất');
    await login(fixture.accounts[3]);
    await click('Công việc');
    await has('Chưa có ngữ cảnh công việc được cấp cho bạn.');
    assert.equal(await evaluate(() => document.body.innerText.includes('Allocate 006 A')), false);
    console.log(JSON.stringify({ runtime: 'Chrome', desktop: 1280, mobile: 390, applied: true,
      reload: true, projectSwitch: true, logout: true, hrCapacity: true, devScope: true, reconcile: true }));
  } finally {
    socket?.close();
    await Promise.all([stop(chrome), stop(vite)]);
  }
}
