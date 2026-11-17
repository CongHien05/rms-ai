import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToTasks1791130000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tasks',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '20',
        default: "'TODO'",
        isNullable: false,
      }),
    );

    await queryRunner.query(
      "UPDATE tasks SET status = 'TODO' WHERE status IS NULL OR status = ''",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tasks', 'status');
  }
}
