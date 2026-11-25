import { readFile } from 'node:fs/promises';
import { emitKeypressEvents } from 'node:readline';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import dataSource from '../database/data-source.js';
import { AccountOperations, OperationError } from './account-operations.service.js';
import { mapProjects } from './project-mapping.service.js';

function hiddenPrompt(label: string): Promise<string> {
  if (!stdin.isTTY || !stdout.isTTY) throw new OperationError('Nhập mật khẩu cần terminal TTY.');
  stdout.write(label);
  emitKeypressEvents(stdin);
  const previous = stdin.isRaw;
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let characters: string[] = [];
    function finish() {
      stdin.off('keypress', handle);
      stdin.setRawMode(previous);
      stdin.pause();
      stdout.write('\n');
    }
    function handle(character: string | undefined, key: { name?: string; ctrl?: boolean; meta?: boolean }) {
      if (key.ctrl && key.name === 'c') {
        characters = [];
        finish();
        reject(new OperationError('Đã hủy thao tác.'));
      } else if (key.name === 'return' || key.name === 'enter') {
        const value = characters.join('');
        characters = [];
        finish();
        resolve(value);
      } else if (key.name === 'backspace') characters.pop();
      else if (!key.ctrl && !key.meta && character && !/[\p{Cc}]/u.test(character) && characters.length < 129) {
        characters.push(character);
      }
    }
    stdin.on('keypress', handle);
  });
}

async function prompts(labels: string[]) {
  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    const values: string[] = [];
    for (const label of labels) values.push(await terminal.question(label));
    return values;
  } finally {
    terminal.close();
  }
}

async function newPassword() {
  const password = await hiddenPrompt('Mật khẩu mới: ');
  if (password !== await hiddenPrompt('Xác nhận mật khẩu: ')) throw new OperationError('Mật khẩu xác nhận không khớp.');
  return password;
}

async function main() {
  const [command, flag, file, ...extra] = process.argv.slice(2);
  if (extra.length || (command === 'map-projects'
    ? flag !== '--file' || !file
    : Boolean(flag || file) || !['issue', 'disable', 'reset-password', 'prune-expired'].includes(command))) {
    throw new OperationError('Dùng issue, disable, reset-password, prune-expired hoặc map-projects --file <danh-sách>.');
  }
  const db = await dataSource.initialize();
  try {
    const accounts = new AccountOperations(db);
    if (command === 'issue') {
      const [email, role, employeeId] = await prompts(['Email: ', 'Vai trò PM/HR/DEV: ', 'Employee UUID (DEV): ']);
      const id = await accounts.issue({
        email, role: role.trim(), employeeId: employeeId.trim() || null, password: await newPassword(),
      });
      console.log('Đã cấp Account UUID:', id);
    } else if (command === 'disable' || command === 'reset-password') {
      const [email] = await prompts(['Email: ']);
      if (command === 'disable') await accounts.disable(email);
      else await accounts.resetPassword(email, await newPassword());
      console.log('Đã cập nhật tài khoản và thu hồi các phiên.');
    } else if (command === 'map-projects') {
      let input: unknown;
      try { input = JSON.parse(await readFile(file, 'utf8')); }
      catch { throw new OperationError('Không đọc được JSON ánh xạ đã duyệt.'); }
      console.log('Số Project được ánh xạ:', await mapProjects(db, input));
    } else {
      console.log('Số phiên hết hạn đã dọn (một lô):', await accounts.pruneExpired());
    }
  } finally {
    await db.destroy();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof OperationError ? error.message : 'Thao tác Auth thất bại. Kiểm tra cấu hình và tính toàn vẹn dữ liệu.');
  process.exitCode = 1;
});
