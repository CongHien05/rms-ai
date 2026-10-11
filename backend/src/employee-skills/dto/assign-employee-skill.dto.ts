import { IsUUID } from 'class-validator';

export class AssignEmployeeSkillDto {
  @IsUUID(undefined, { message: 'skillId phải là UUID hợp lệ.' })
  skillId: string;
}
