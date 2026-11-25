import type { MigrationInterface, QueryRunner } from 'typeorm';

type ColumnMetadata = {
  type: string;
  charset: string | null;
  collation: string | null;
  engine: string;
};

function identifier(name: string | null): string {
  if (!name || !/^[a-z0-9_]+$/i.test(name)) throw new Error('Unexpected MariaDB charset or collation.');
  return name;
}

async function column(runner: QueryRunner, table: string, name: string): Promise<ColumnMetadata | undefined> {
  const rows = await runner.query(
    `SELECT c.COLUMN_TYPE AS type, c.CHARACTER_SET_NAME AS charset,
       c.COLLATION_NAME AS collation, t.ENGINE AS engine
     FROM information_schema.COLUMNS c
     JOIN information_schema.TABLES t USING (TABLE_SCHEMA, TABLE_NAME)
     WHERE c.TABLE_SCHEMA = DATABASE() AND c.TABLE_NAME = ? AND c.COLUMN_NAME = ?`,
    [table, name],
  ) as ColumnMetadata[];
  return rows[0];
}

async function verifyConstraints(runner: QueryRunner, table: string, names: readonly string[]) {
  const rows = await runner.query(
    'SELECT CONSTRAINT_NAME AS name FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
    [table],
  ) as { name: string }[];
  if (!names.every((name) => rows.some((row) => row.name === name))) {
    throw new Error(`Existing schema for ${table} does not match the Auth migration.`);
  }
}

async function verifyIndex(runner: QueryRunner, table: string, name: string, indexColumn: string) {
  const rows = await runner.query(
    `SELECT COLUMN_NAME AS name, NON_UNIQUE AS nonUnique
     FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, name],
  ) as { name: string; nonUnique: number | string }[];
  if (rows.length !== 1 || rows[0].name !== indexColumn || Number(rows[0].nonUnique) !== 1) {
    throw new Error(`Existing index for ${table} does not match the Auth migration.`);
  }
}

export class AddAuthAndProjectOwner1791240000000 implements MigrationInterface {
  transaction = false;

  async up(runner: QueryRunner): Promise<void> {
    const [target] = await runner.query('SELECT DATABASE() AS db, VERSION() AS version') as { db: string | null; version: string }[];
    if (!target?.db || !target.version.includes('MariaDB')) {
      throw new Error('The Auth migration requires a selected MariaDB database.');
    }
    const project = await column(runner, 'projects', 'id');
    const employee = await column(runner, 'employees', 'id');
    for (const parent of [project, employee]) {
      if (!parent || parent.type !== 'varchar(36)' || parent.engine !== 'InnoDB') {
        throw new Error('The Auth migration requires InnoDB and varchar(36) baseline IDs.');
      }
    }

    const employeeCharset = identifier(employee!.charset);
    const employeeCollation = identifier(employee!.collation);
    await runner.query(`CREATE TABLE IF NOT EXISTS user_accounts (
      id VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      email VARCHAR(254) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      passwordHash VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      role ENUM('PM','HR','DEV') CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      employeeId VARCHAR(36) CHARACTER SET ${employeeCharset} COLLATE ${employeeCollation} NULL,
      disabledAt DATETIME(3) NULL,
      PRIMARY KEY (id),
      UNIQUE KEY UQ_user_accounts_email (email),
      UNIQUE KEY UQ_user_accounts_employeeId (employeeId),
      CONSTRAINT CK_user_accounts_role CHECK (role IN ('PM','HR','DEV')),
      CONSTRAINT CK_user_accounts_dev_employee CHECK (
        (role = 'DEV' AND employeeId IS NOT NULL) OR
        (role IN ('PM','HR') AND employeeId IS NULL)
      ),
      CONSTRAINT FK_user_accounts_employee FOREIGN KEY (employeeId)
        REFERENCES employees(id) ON UPDATE RESTRICT ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    await verifyConstraints(runner, 'user_accounts', [
      'PRIMARY', 'UQ_user_accounts_email', 'UQ_user_accounts_employeeId',
      'CK_user_accounts_role', 'CK_user_accounts_dev_employee', 'FK_user_accounts_employee',
    ]);

    await runner.query(`CREATE TABLE IF NOT EXISTS auth_sessions (
      tokenDigest CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      accountId VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      expiresAt DATETIME(3) NOT NULL,
      PRIMARY KEY (tokenDigest),
      KEY IDX_auth_sessions_accountId (accountId),
      KEY IDX_auth_sessions_expiresAt (expiresAt),
      CONSTRAINT FK_auth_sessions_account FOREIGN KEY (accountId)
        REFERENCES user_accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    await verifyConstraints(runner, 'auth_sessions', ['PRIMARY', 'FK_auth_sessions_account']);
    await verifyIndex(runner, 'auth_sessions', 'IDX_auth_sessions_accountId', 'accountId');
    await verifyIndex(runner, 'auth_sessions', 'IDX_auth_sessions_expiresAt', 'expiresAt');

    const projectOwner = await column(runner, 'projects', 'pmAccountId');
    if (!projectOwner) {
      await runner.query(`ALTER TABLE projects
        ADD COLUMN pmAccountId VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
        ADD INDEX IDX_projects_pmAccountId (pmAccountId),
        ADD CONSTRAINT FK_projects_pm_account FOREIGN KEY (pmAccountId)
          REFERENCES user_accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT`);
    } else if (projectOwner.type !== 'varchar(36)' || projectOwner.collation !== 'ascii_bin') {
      throw new Error('Existing Project owner column does not match the Auth migration.');
    }
    await verifyConstraints(runner, 'projects', ['FK_projects_pm_account']);
    await verifyIndex(runner, 'projects', 'IDX_projects_pmAccountId', 'pmAccountId');
  }

  async down(): Promise<void> {
    throw new Error('Auth migration is forward-only. Close ingress and follow the recovery plan.');
  }
}
