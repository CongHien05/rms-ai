import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsPositive,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ResourceRecommendationDto } from './resource-recommendation.dto.js';
import {
  recommendationProofPattern,
  type RecommendationContext,
} from '../recommendation-context.js';

class ScenarioDto extends ResourceRecommendationDto {
  @IsUUID()
  employeeId: string;

  @IsNumber()
  @IsPositive()
  supportHours: number;

  @Matches(recommendationProofPattern)
  recommendationContext: string;
}

export class ResourceSimulationDto {
  @IsUUID()
  runId: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ScenarioDto)
  scenario: ScenarioDto;
}

export interface SimulationImpact {
  hypotheticalSupportHours: number;
  remainingRequiredHours: number;
  remainingAvailableHours: number;
}

export interface ResourceSimulationResponseDto {
  outcome: 'available';
  scenarioReference: string;
  runId: string;
  snapshot: RecommendationContext & {
    supportHours: number;
    availableHours: number;
  };
  expectedImpact: SimulationImpact;
}
