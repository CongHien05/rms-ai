import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
  ValidateIf,
} from 'class-validator';
import { TaskStatus } from '../task-status.enum.js';

export class UpdateTaskDto {
  @ValidateIf((_object, value) => value !== undefined)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Trạng thái Task không được để trống.' })
  @IsEnum(TaskStatus, {
    message:
      'Trạng thái Task không hợp lệ. Phải là TODO, IN_PROGRESS, BLOCKED hoặc DONE.',
  })
  status?: TaskStatus;

  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Hạn hoàn thành phải có định dạng YYYY-MM-DD.',
  })
  @IsDateString(
    { strict: true, strictSeparator: true },
    {
      message: 'Hạn hoàn thành phải là ngày hợp lệ.',
    },
  )
  dueDate?: string | null;

  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Số giờ ước tính phải là số hữu hạn.' },
  )
  @IsPositive({ message: 'Số giờ ước tính phải lớn hơn 0.' })
  estimatedHours?: number | null;
}
