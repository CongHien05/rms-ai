import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class ResourceRecommendationDto {
  @IsUUID(undefined, { message: 'Kỹ năng phải có mã UUID hợp lệ.' })
  skillId: string;

  @IsString({ message: 'Ngày bắt đầu tuần phải là chuỗi YYYY-MM-DD.' })
  weekStart: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Số giờ cần hỗ trợ phải là số hữu hạn.' },
  )
  @IsPositive({ message: 'Số giờ cần hỗ trợ phải lớn hơn 0.' })
  requiredHours: number;
}
