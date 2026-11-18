import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTaskPlanningFields1791220000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('tasks', [
      new TableColumn({
        name: 'dueDate',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'estimatedHours',
        type: 'double',
        isNullable: true,
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tasks', 'estimatedHours');
    await queryRunner.dropColumn('tasks', 'dueDate');
  }
}
