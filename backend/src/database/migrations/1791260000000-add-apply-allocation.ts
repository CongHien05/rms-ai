import type { MigrationInterface, QueryRunner } from 'typeorm';

const uuid = 'VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin';
const exact = 'VARCHAR(672) CHARACTER SET ascii COLLATE ascii_bin NOT NULL';
const errors = "'DECISION_NOT_ACCEPTED','LEGACY_DECISION','STALE_ALLOCATION','AVAILABILITY_MISSING','INSUFFICIENT_AVAILABILITY','AVAILABILITY_OVER_ALLOCATED'";
const exactPattern = '^[1-9]([0-9]*[1-9])?e(0|-?[1-9][0-9]{0,2})$';

type Parent = { name: string; type: string; charset: string; collation: string; engine: string };

export class AddApplyAllocation1791260000000 implements MigrationInterface {
  transaction = false;

  async up(runner: QueryRunner): Promise<void> {
    const [target] = await runner.query('SELECT DATABASE() AS db, VERSION() AS version') as
      { db: string | null; version: string }[];
    if (!target?.db || !target.version.includes('MariaDB')) throw new Error('Apply Allocation requires MariaDB.');
    const parents = await runner.query(
      `SELECT c.TABLE_NAME AS name, c.COLUMN_TYPE AS type, c.CHARACTER_SET_NAME AS charset,
        c.COLLATION_NAME AS collation, t.ENGINE AS engine
       FROM information_schema.COLUMNS c JOIN information_schema.TABLES t USING (TABLE_SCHEMA, TABLE_NAME)
       WHERE c.TABLE_SCHEMA = DATABASE() AND c.COLUMN_NAME = 'id'
       AND c.TABLE_NAME IN ('projects','employees','skills','pm_decisions','user_accounts')`,
    ) as Parent[];
    const parentId = (name: string) => {
      const parent = parents.find((row) => row.name === name);
      const identifier = /^[a-z0-9_]+$/i;
      if (!parent || parent.type !== 'varchar(36)' || parent.engine !== 'InnoDB' ||
          !identifier.test(parent.charset ?? '') || !identifier.test(parent.collation ?? '')) {
        throw new Error(`Unexpected parent schema for ${name}.`);
      }
      return `VARCHAR(36) CHARACTER SET ${parent.charset} COLLATE ${parent.collation}`;
    };
    const decisionId = parentId('pm_decisions');
    const accountId = parentId('user_accounts');
    const projectId = parentId('projects');
    const employeeId = parentId('employees');
    const skillId = parentId('skills');
    await runner.query(`CREATE TABLE IF NOT EXISTS decision_availability_evidence (
      decisionId ${decisionId} NOT NULL PRIMARY KEY,
      semantics VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      availableHoursExact ${exact},
      supportHoursExact ${exact},
      CONSTRAINT FK_dae_decision FOREIGN KEY (decisionId) REFERENCES pm_decisions(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT CK_dae_semantics CHECK (semantics = 'remaining-v1'),
      CONSTRAINT CK_dae_hours CHECK ((availableHoursExact = '0' OR availableHoursExact REGEXP '${exactPattern}') AND supportHoursExact REGEXP '${exactPattern}')
    ) ENGINE=InnoDB`);
    await runner.query(`CREATE TABLE IF NOT EXISTS project_allocations (
      id ${uuid} NOT NULL PRIMARY KEY,
      decisionId ${decisionId} NOT NULL,
      projectId ${projectId} NOT NULL,
      employeeId ${employeeId} NOT NULL,
      skillId ${skillId} NOT NULL,
      weekStart DATE NOT NULL,
      hoursExact ${exact},
      appliedByAccountId ${accountId} NOT NULL,
      appliedAt DATETIME(3) NOT NULL,
      UNIQUE KEY UQ_alloc_decision (decisionId),
      KEY IDX_alloc_employee_week (employeeId, weekStart),
      CONSTRAINT FK_alloc_decision FOREIGN KEY (decisionId) REFERENCES pm_decisions(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_alloc_project FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_alloc_employee FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_alloc_skill FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_alloc_actor FOREIGN KEY (appliedByAccountId) REFERENCES user_accounts(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT CK_alloc_hours CHECK (hoursExact REGEXP '${exactPattern}'),
      CONSTRAINT CK_alloc_week CHECK (WEEKDAY(weekStart) = 0)
    ) ENGINE=InnoDB`);
    await runner.query(`CREATE TABLE IF NOT EXISTS application_results (
      id ${uuid} NOT NULL PRIMARY KEY,
      decisionId ${decisionId} NOT NULL,
      actorAccountId ${accountId} NOT NULL,
      allocationId ${uuid} NULL,
      outcome ENUM('APPLIED','FAILED') CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      code VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin NULL,
      occurredAt DATETIME(3) NOT NULL,
      UNIQUE KEY UQ_app_result_allocation (allocationId),
      KEY IDX_app_result_decision_time (decisionId, occurredAt, id),
      CONSTRAINT FK_app_result_decision FOREIGN KEY (decisionId) REFERENCES pm_decisions(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_app_result_actor FOREIGN KEY (actorAccountId) REFERENCES user_accounts(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_app_result_allocation FOREIGN KEY (allocationId) REFERENCES project_allocations(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT CK_app_result_outcome CHECK ((outcome = 'APPLIED' AND allocationId IS NOT NULL AND code IS NULL)
        OR (outcome = 'FAILED' AND allocationId IS NULL AND code IS NOT NULL AND code IN (${errors})))
    ) ENGINE=InnoDB`);
    await this.verify(runner, 'decision_availability_evidence', 'decisionId', 4,
      { decisionId: 'pm_decisions' }, ['CK_dae_semantics', 'CK_dae_hours'], []);
    await this.verify(runner, 'project_allocations', 'id', 9,
      { decisionId: 'pm_decisions', projectId: 'projects', employeeId: 'employees',
        skillId: 'skills', appliedByAccountId: 'user_accounts' },
      ['CK_alloc_hours', 'CK_alloc_week'], [['UQ_alloc_decision', 'decisionId', true], ['IDX_alloc_employee_week', 'employeeId,weekStart', false]]);
    await this.verify(runner, 'application_results', 'id', 7,
      { decisionId: 'pm_decisions', actorAccountId: 'user_accounts', allocationId: 'project_allocations' },
      ['CK_app_result_outcome'], [['UQ_app_result_allocation', 'allocationId', true],
        ['IDX_app_result_decision_time', 'decisionId,occurredAt,id', false]]);
  }

  private async verify(
    runner: QueryRunner, name: string, primary: string, columns: number,
    parents: Record<string, string>, checks: string[], indexes: [string, string, boolean][],
  ) {
    const table = await runner.getTable(name);
    const [metadata] = await runner.query(
      'SELECT ENGINE AS engine FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', [name],
    ) as { engine: string }[];
    const constraints = await runner.query(
      'SELECT CONSTRAINT_NAME AS name FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_TYPE = ?', [name, 'CHECK'],
    ) as { name: string }[];
    if (!table || metadata?.engine !== 'InnoDB' || table.columns.length !== columns ||
        table.primaryColumns.map((column) => column.name).join() !== primary ||
        !checks.every((check) => constraints.some((item) => item.name === check)) ||
        !indexes.every(([indexName, fields, unique]) => table.indices.some((index) =>
          index.name === indexName && index.columnNames.join() === fields && index.isUnique === unique)) ||
        !Object.entries(parents).every(([field, parent]) => table.foreignKeys.some((key) =>
          key.columnNames.join() === field && key.referencedTableName === parent &&
          key.referencedColumnNames.join() === 'id' && key.onDelete === 'RESTRICT' && key.onUpdate === 'RESTRICT'))) {
      throw new Error(`Existing ${name} does not match the 006 migration.`);
    }
  }

  async down(): Promise<void> {
    throw new Error('Apply Allocation migration is forward-only. Preserve committed allocations.');
  }
}
