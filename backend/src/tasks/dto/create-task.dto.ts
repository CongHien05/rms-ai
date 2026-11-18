import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateTaskDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tiêu đề Task phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tiêu đề Task không được để trống.' })
  title: string;

  @IsOptional()
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

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Số giờ ước tính phải là số hữu hạn.' },
  )
  @IsPositive({ message: 'Số giờ ước tính phải lớn hơn 0.' })
  estimatedHours?: number | null;
}
