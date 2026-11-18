import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEmployeeAvailability1791230000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('employees', [
      new TableColumn({
        name: 'availabilityWeekStart',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'availableHours',
        type: 'double',
        isNullable: true,
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('employees', 'availableHours');
    await queryRunner.dropColumn('employees', 'availabilityWeekStart');
  }
}
