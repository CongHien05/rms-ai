import { IsIn, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { maxDecisionTokenLength } from '../../decision-context.js';
import { decisionChoices, type DecisionChoice } from '../pm-decision.entity.js';

export class ProjectDecisionDto {
  @IsUUID('4')
  simulationId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(maxDecisionTokenLength)
  simulationToken: string;

  @IsIn(decisionChoices)
  decision: DecisionChoice;
}
