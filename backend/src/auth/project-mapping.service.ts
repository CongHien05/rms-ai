import { isUUID } from 'class-validator';
import { DataSource, IsNull } from 'typeorm';
import { Project } from '../projects/project.entity.js';
import { OperationError } from './account-operations.service.js';
import { UserAccount } from './user-account.entity.js';

export function parseProjectMapping(input: unknown) {
  if (!Array.isArray(input) || input.length === 0) throw new OperationError('Danh sách ánh xạ phải có ít nhất một cặp.');
  const projectIds = new Set<string>();
  return input.map((row: unknown) => {
    if (!row || typeof row !== 'object' || Object.keys(row).length !== 2 ||
        !('projectId' in row) || !('pmAccountId' in row) ||
        typeof row.projectId !== 'string' || typeof row.pmAccountId !== 'string' ||
        !isUUID(row.projectId) || !isUUID(row.pmAccountId)) {
      throw new OperationError('Mỗi dòng ánh xạ cần đúng Project UUID và PM Account UUID.');
    }
    const projectId = row.projectId.toLowerCase();
    if (projectIds.has(projectId)) throw new OperationError('Danh sách ánh xạ trùng Project.');
    projectIds.add(projectId);
    return { projectId, pmAccountId: row.pmAccountId.toLowerCase() };
  });
}

export async function mapProjects(db: DataSource, input: unknown): Promise<number> {
  const mapping = parseProjectMapping(input).sort((a, b) => a.projectId.localeCompare(b.projectId));
  const accountIds = [...new Set(mapping.map((row) => row.pmAccountId))].sort();
  return db.transaction(async (manager) => {
    const accounts = manager.getRepository(UserAccount);
    for (const id of accountIds) {
      const account = await accounts.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });
      if (account?.role !== 'PM' || account.disabledAt) throw new OperationError('Ánh xạ cần tài khoản PM đang hoạt động.');
    }
    const projects = manager.getRepository(Project);
    const pending: typeof mapping = [];
    for (const row of mapping) {
      const project = await projects.findOne({
        where: { id: row.projectId }, lock: { mode: 'pessimistic_write' },
      });
      if (!project || (project.pmAccountId && project.pmAccountId !== row.pmAccountId)) {
        throw new OperationError('Project không tồn tại hoặc đã có người phụ trách khác.');
      }
      if (!project.pmAccountId) pending.push(row);
    }
    for (const row of pending) {
      const result = await projects.update({ id: row.projectId, pmAccountId: IsNull() }, { pmAccountId: row.pmAccountId });
      if (result.affected !== 1) throw new OperationError('Project vừa thay đổi quyền. Toàn bộ lô được hủy.');
    }
    return pending.length;
  });
}
