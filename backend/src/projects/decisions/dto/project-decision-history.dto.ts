import { Transform, type TransformFnParams } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

function integerQuery({ value }: TransformFnParams): unknown {
  return typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : Number.NaN;
}

export class ProjectDecisionHistoryDto {
  @Transform(integerQuery)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @Transform(integerQuery)
  @IsInt()
  @Min(0)
  @Max(2_147_483_647)
  offset = 0;
}
