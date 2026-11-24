import type { SimulationImpact } from './dto/resource-simulation.dto.js';

function decimalParts(value: number) {
  const [mantissa, exponent = '0'] = value.toString().split('e');
  const [whole, fraction = ''] = mantissa.split('.');
  return {
    coefficient: BigInt(whole + fraction),
    scale: fraction.length - Number(exponent),
  };
}

export function calculateSimulationImpact(
  requiredHours: number,
  supportHours: number,
  availableHours: number,
): SimulationImpact | null {
  const [required, support, available] = [
    requiredHours,
    supportHours,
    availableHours,
  ].map(decimalParts);
  const scale = Math.max(required.scale, support.scale, available.scale);
  const align = (value: ReturnType<typeof decimalParts>) =>
    value.coefficient * 10n ** BigInt(scale - value.scale);
  const offered = align(support);
  const remaining = align(available) - offered;
  if (remaining < 0n) return null;

  const shortfall = align(required) - offered;
  const serialize = (value: bigint) => Number(`${value}e${-scale}`);
  return {
    hypotheticalSupportHours: supportHours,
    remainingRequiredHours: serialize(shortfall > 0n ? shortfall : 0n),
    remainingAvailableHours: serialize(remaining),
  };
}
