import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProjectSprintTaskFoundation1791120736172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'projects',
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
        name: 'sprints',
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
            name: 'projectId',
            type: 'varchar',
            length: '36',
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
        name: 'tasks',
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
            name: 'sprintId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'title',
            type: 'text',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'sprints',
      new TableForeignKey({
        name: 'FK_sprints_projectId_projects_id',
        columnNames: ['projectId'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        name: 'FK_tasks_sprintId_sprints_id',
        columnNames: ['sprintId'],
        referencedTableName: 'sprints',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
    await queryRunner.dropTable('sprints');
    await queryRunner.dropTable('projects');
  }
}
