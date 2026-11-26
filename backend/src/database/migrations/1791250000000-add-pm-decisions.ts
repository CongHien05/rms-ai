import type { MigrationInterface, QueryRunner } from 'typeorm';

interface ParentColumn {
  name: string;
  type: string;
  charset: string;
  collation: string;
  engine: string;
}

export class AddPMDecisions1791250000000 implements MigrationInterface {
  transaction = false;

  async up(runner: QueryRunner): Promise<void> {
    const [target] = await runner.query('SELECT DATABASE() AS db, VERSION() AS version') as
      { db: string | null; version: string }[];
    if (!target?.db || !target.version.includes('MariaDB')) {
      throw new Error('The PM Decision migration requires a selected MariaDB database.');
    }
    const parents = await runner.query(
      `SELECT c.TABLE_NAME AS name, c.COLUMN_TYPE AS type, c.CHARACTER_SET_NAME AS charset,
         c.COLLATION_NAME AS collation, t.ENGINE AS engine
       FROM information_schema.COLUMNS c JOIN information_schema.TABLES t USING (TABLE_SCHEMA, TABLE_NAME)
       WHERE c.TABLE_SCHEMA = DATABASE() AND c.TABLE_NAME IN ('projects', 'user_accounts') AND c.COLUMN_NAME = 'id'`,
    ) as ParentColumn[];
    const project = parents.find(({ name }) => name === 'projects');
    const account = parents.find(({ name }) => name === 'user_accounts');
    const sqlName = /^[a-z0-9_]+$/i;
    if (!project || !account || parents.some((p) => p.type !== 'varchar(36)' || p.engine !== 'InnoDB') ||
        !sqlName.test(project.charset ?? '') || !sqlName.test(project.collation ?? '') ||
        account.charset !== 'ascii' || account.collation !== 'ascii_bin') {
      throw new Error('Unexpected parent schema for PM Decision.');
    }
    await runner.query(`CREATE TABLE IF NOT EXISTS pm_decisions (
      id VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      simulationId VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      projectId VARCHAR(36) CHARACTER SET ${project.charset} COLLATE ${project.collation} NOT NULL,
      pmAccountId VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      decision ENUM('ACCEPT','REJECT') CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      decidedAt DATETIME(3) NOT NULL,
      snapshot JSON NOT NULL,
      expectedImpact JSON NOT NULL,
      referenceDigest CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY UQ_pm_decisions_simulation (simulationId),
      KEY IDX_pm_decisions_history (projectId, decidedAt, id),
      CONSTRAINT CK_pm_decisions_choice CHECK (decision IN ('ACCEPT','REJECT')),
      CONSTRAINT FK_pm_decisions_project FOREIGN KEY (projectId)
        REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT FK_pm_decisions_account FOREIGN KEY (pmAccountId)
        REFERENCES user_accounts(id) ON DELETE RESTRICT ON UPDATE RESTRICT
    ) ENGINE=InnoDB`);
    const table = await runner.getTable('pm_decisions');
    const columnNames = ['id', 'simulationId', 'projectId', 'pmAccountId',
      'decision', 'decidedAt', 'snapshot', 'expectedImpact', 'referenceDigest'];
    const columns = await runner.query(
      `SELECT c.COLUMN_NAME AS name, c.COLUMN_TYPE AS type, c.CHARACTER_SET_NAME AS charset,
         c.COLLATION_NAME AS collation, t.ENGINE AS engine
       FROM information_schema.COLUMNS c JOIN information_schema.TABLES t USING (TABLE_SCHEMA, TABLE_NAME)
       WHERE c.TABLE_SCHEMA = DATABASE() AND c.TABLE_NAME = 'pm_decisions'`,
    ) as ParentColumn[];
    const matches = (name: string, type: string, charset?: string, collation?: string) =>
      columns.some((column) => column.name === name && column.engine === 'InnoDB' && column.type === type &&
        (charset === undefined || (column.charset === charset && column.collation === collation)));
    const [definition] = await runner.query('SHOW CREATE TABLE pm_decisions') as { 'Create Table': string }[];
    const ddl = definition['Create Table'].toLowerCase();
    const validJson = ['snapshot', 'expectedImpact']
      .every((name) => matches(name, 'longtext', 'utf8mb4', 'utf8mb4_bin') &&
        ddl.includes(`json_valid(\`${name.toLowerCase()}\`)`));
    const hasIndex = (name: string, columns: string, unique: boolean) =>
      table?.indices.some((index) => index.name === name &&
        index.columnNames.join(',') === columns && index.isUnique === unique);
    if (!table || table.columns.length !== columnNames.length ||
        !columnNames.every((name) => table.columns.some((column) => column.name === name && !column.isNullable)) ||
        table.primaryColumns.map((column) => column.name).join() !== 'id' ||
        !['id', 'simulationId', 'pmAccountId'].every((name) => matches(name, 'varchar(36)', 'ascii', 'ascii_bin')) ||
        !matches('projectId', 'varchar(36)', project.charset, project.collation) ||
        !matches('referenceDigest', 'char(64)', 'ascii', 'ascii_bin') ||
        !matches('decidedAt', 'datetime(3)') || !matches('decision', "enum('ACCEPT','REJECT')", 'ascii', 'ascii_bin') ||
        !ddl.includes('constraint `ck_pm_decisions_choice`') || !validJson ||
        !hasIndex('UQ_pm_decisions_simulation', 'simulationId', true) ||
        !hasIndex('IDX_pm_decisions_history', 'projectId,decidedAt,id', false) ||
        ![['projectId', 'projects'], ['pmAccountId', 'user_accounts']].every(([column, parent]) =>
          table.foreignKeys.some((key) => key.columnNames.join() === column &&
            key.referencedTableName === parent && key.referencedColumnNames.join() === 'id' &&
            key.onDelete === 'RESTRICT' && key.onUpdate === 'RESTRICT'))) {
      throw new Error('Existing pm_decisions schema does not match the migration.');
    }
  }

  async down(): Promise<void> {
    throw new Error('PM Decision migration is forward-only. Preserve decision records during recovery.');
  }
}
