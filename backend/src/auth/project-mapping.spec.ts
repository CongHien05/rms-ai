import type { DataSource } from 'typeorm';
import { Project } from '../projects/project.entity.js';
import { mapProjects, parseProjectMapping } from './project-mapping.service.js';

const account = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const first = '11111111-1111-4111-8111-111111111111';
const second = '22222222-2222-4222-8222-222222222222';
const mapping = [first, second].map(projectId => ({ projectId, pmAccountId: account }));

function fixture(conflict: boolean) {
  const projectRows = new Map([[first, null], [second, conflict ? 'other-owner' : null]] as [string, string | null][]);
  const update = vi.fn(async ({ id }, values: { pmAccountId: string }) => {
    projectRows.set(id, values.pmAccountId);
    return { affected: 1 };
  });
  const db = {
    transaction: (callback: (manager: unknown) => unknown) => callback({
      getRepository: (entity: unknown) => entity === Project ? {
        findOne: async ({ where: { id } }: { where: { id: string } }) => ({ pmAccountId: projectRows.get(id) }),
        update,
      } : { findOne: async () => ({ role: 'PM', disabledAt: null }) },
    }),
  } as unknown as DataSource;
  return { projectRows, update, db };
}

it('rejects duplicate Projects before writes', () => {
  expect(() => parseProjectMapping([mapping[0], mapping[0]])).toThrow('trùng Project');
});

it('preflights a conflicting batch before mapping an earlier Project', async () => {
  const { db, update } = fixture(true);
  await expect(mapProjects(db, mapping)).rejects.toThrow('đã có người phụ trách');
  expect(update).not.toHaveBeenCalled();
});

it('maps explicit Projects and repeats the same mapping as a no-op', async () => {
  const { db, update } = fixture(false);
  await expect(mapProjects(db, mapping)).resolves.toBe(2);
  await expect(mapProjects(db, mapping)).resolves.toBe(0);
  expect(update).toHaveBeenCalledTimes(2);
});
