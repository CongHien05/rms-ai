import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên hiển thị của Employee phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tên hiển thị của Employee không được để trống.' })
  displayName: string;
}
