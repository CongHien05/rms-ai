import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tiêu đề Task phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tiêu đề Task không được để trống.' })
  title: string;
}
