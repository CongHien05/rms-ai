import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên Project phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tên Project không được để trống.' })
  name: string;
}
