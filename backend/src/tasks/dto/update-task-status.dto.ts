import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-status.enum.js';

export class UpdateTaskStatusDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Trạng thái Task không được để trống.' })
  @IsEnum(TaskStatus, {
    message:
      'Trạng thái Task không hợp lệ. Phải là TODO, IN_PROGRESS, BLOCKED hoặc DONE.',
  })
  status: TaskStatus;
}
