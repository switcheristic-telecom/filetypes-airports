export function unmix(from: number, to: number, value: number) {
  return (value - from) / (to - from);
}

export function mix(from: number, to: number, value: number) {
  return from + (to - from) * value;
}

export function remap(
  from1: number,
  to1: number,
  from2: number,
  to2: number,
  value: number,
) {
  return mix(from2, to2, unmix(from1, to1, value));
}

export function clamp(x: number, lower: number, upper: number) {
  return Math.max(lower, Math.min(upper, x));
}
