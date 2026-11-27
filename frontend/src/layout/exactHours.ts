const canonical = /^(-?)([1-9](?:[0-9]*[1-9])?)e(0|-?[1-9][0-9]{0,2})$/

export function exactHoursInput(value: string): string {
  if (value === '0') return '0'
  const match = canonical.exec(value)
  if (!match || match[0] !== value || value.length > 672) return ''
  const [, sign, digits, rawExponent] = match
  const exponent = Number(rawExponent)
  if (exponent < -324 || exponent > 999) return ''
  const point = digits.length + exponent
  if (point <= 0) return `${sign}0.${'0'.repeat(-point)}${digits}`
  if (point >= digits.length) return sign + digits + '0'.repeat(exponent)
  return `${sign}${digits.slice(0, point)}.${digits.slice(point)}`
}

export function displayExactHours(value: string): string {
  return exactHoursInput(value).replace('.', ',') || '—'
}

export function parseHoursInput(value: string): string | undefined {
  if (value.length > 672) return
  const match = /^([0-9]*)(?:\.([0-9]*))?(?:e([+-]?[0-9]{1,3}))?$/i.exec(value)
  if (!match || match[0] !== value) return
  const [, integer, fraction = '', power = '0'] = match
  let digits = (integer + fraction).replace(/^0+/, '')
  if (!digits) return
  const trailing = digits.match(/0+$/)?.[0].length ?? 0
  const exponent = Number(power) - fraction.length + trailing
  if (exponent < -324 || exponent > 308) return
  if (trailing) digits = digits.slice(0, -trailing)
  const exact = `${digits}e${exponent}`
  return exact.length <= 672 && Number.isFinite(Number(exact)) ? exact : undefined
}
