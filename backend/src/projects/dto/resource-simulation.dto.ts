import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  IsUUID,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ResourceRecommendationDto } from './resource-recommendation.dto.js';
import type { DecisionEvidence } from '../decision-context.js';
import { exactHoursMaxLength } from '../../employees/decimal-hours.js';
import {
  recommendationProofPattern,
  type RecommendationContext,
} from '../recommendation-context.js';

class ScenarioDto extends ResourceRecommendationDto {
  @IsUUID()
  employeeId: string;

  @IsNumber()
  supportHours: number;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  @MaxLength(exactHoursMaxLength)
  supportHoursExact?: string;

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

export type SimulationSnapshotExact = { availableHoursExact: string; supportHoursExact: string };

export interface ResourceSimulationResponseDto {
  outcome: 'available';
  scenarioReference: string;
  runId: string;
  snapshot: RecommendationContext & {
    supportHours: number;
    availableHours: number;
  };
  expectedImpact: SimulationImpact;
  decisionEvidence?: DecisionEvidence;
  snapshotExact: SimulationSnapshotExact;
  expectedImpactExact: Record<keyof SimulationImpact, string>;
}
