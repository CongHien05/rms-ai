import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEmployeeSkillFoundation1791123398274 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'displayName',
            type: 'text',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'skills',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'text',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'employee_skills',
        columns: [
          {
            name: 'employeeId',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'skillId',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'employee_skills',
      new TableForeignKey({
        name: 'FK_employee_skills_employeeId_employees_id',
        columnNames: ['employeeId'],
        referencedTableName: 'employees',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'employee_skills',
      new TableForeignKey({
        name: 'FK_employee_skills_skillId_skills_id',
        columnNames: ['skillId'],
        referencedTableName: 'skills',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('employee_skills');
    await queryRunner.dropTable('skills');
    await queryRunner.dropTable('employees');
  }
}
