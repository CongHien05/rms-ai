export type DecimalHours = { coefficient: bigint; exponent: number };
export const exactHoursMaxLength = 672;
const canonical = /^(-?[1-9](?:[0-9]*[1-9])?)e(0|-?[1-9][0-9]{0,2})$/;
const zero: DecimalHours = { coefficient: 0n, exponent: 0 };

function normalize(coefficient: bigint, exponent: number): DecimalHours {
  if (coefficient === 0n) return zero;
  while (coefficient % 10n === 0n) {
    coefficient /= 10n;
    exponent++;
  }
  return { coefficient, exponent };
}

export function decimalFromNumber(value: number): DecimalHours {
  if (!Number.isFinite(value)) throw new RangeError('Hours must be finite.');
  const [mantissa, exponent = '0'] = value.toString().split('e');
  const [whole, fraction = ''] = mantissa.split('.');
  return normalize(BigInt(whole + fraction), Number(exponent) - fraction.length);
}

export function decimalText(value: DecimalHours): string {
  return value.coefficient === 0n ? '0' : `${value.coefficient}e${value.exponent}`;
}

export function parseDecimalHours(text: unknown): DecimalHours | null {
  if (text === '0') return zero;
  if (typeof text !== 'string' || text.length > exactHoursMaxLength) return null;
  const match = canonical.exec(text);
  if (!match || match[0] !== text) return null;
  const exponent = Number(match[2]);
  if (exponent < -324 || exponent > 308) return null;
  return { coefficient: BigInt(match[1]), exponent };
}

function align(left: DecimalHours, right: DecimalHours) {
  const exponent = Math.min(left.exponent, right.exponent);
  const a = left.coefficient * 10n ** BigInt(left.exponent - exponent);
  const b = right.coefficient * 10n ** BigInt(right.exponent - exponent);
  return { a, b, exponent };
}

export function addHours(left: DecimalHours, right: DecimalHours): DecimalHours {
  const { a, b, exponent } = align(left, right);
  return normalize(a + b, exponent);
}

export function subtractHours(left: DecimalHours, right: DecimalHours): DecimalHours {
  const { a, b, exponent } = align(left, right);
  return normalize(a - b, exponent);
}

export function compareHours(left: DecimalHours, right: DecimalHours): number {
  const { a, b } = align(left, right);
  return a < b ? -1 : a > b ? 1 : 0;
}

const maximum = decimalFromNumber(Number.MAX_VALUE);

export function parsePositiveSupport(text: unknown): DecimalHours | null {
  const amount = parseDecimalHours(text);
  return amount && amount.coefficient > 0n && compareHours(amount, maximum) <= 0
    ? amount : null;
}

export function projectHoursNumber(value: DecimalHours, allowUnderflow = false): number {
  const projected = Number(decimalText(value));
  if (!Number.isFinite(projected) || (!allowUnderflow && projected === 0 && value.coefficient !== 0n)) {
    throw new RangeError('Exact hours cannot be represented as a number.');
  }
  return projected;
}
