import type { SimulationImpact } from './dto/resource-simulation.dto.js';
import {
  decimalFromNumber, decimalText, projectHoursNumber, subtractHours, type DecimalHours,
} from '../employees/decimal-hours.js';

export function calculateExactImpact(required: DecimalHours, support: DecimalHours, available: DecimalHours) {
  const remaining = subtractHours(available, support);
  if (remaining.coefficient < 0n) return null;
  const shortfall = subtractHours(required, support);
  const missing = shortfall.coefficient > 0n ? shortfall : decimalFromNumber(0);
  return {
    numeric: {
      hypotheticalSupportHours: projectHoursNumber(support, true),
      remainingRequiredHours: projectHoursNumber(missing, true),
      remainingAvailableHours: projectHoursNumber(remaining, true),
    },
    exact: {
      hypotheticalSupportHours: decimalText(support),
      remainingRequiredHours: decimalText(missing),
      remainingAvailableHours: decimalText(remaining),
    },
  };
}

export function calculateSimulationImpact(
  requiredHours: number,
  supportHours: number,
  availableHours: number,
): SimulationImpact | null {
  return calculateExactImpact(
    decimalFromNumber(requiredHours), decimalFromNumber(supportHours), decimalFromNumber(availableHours),
  )?.numeric ?? null;
}
