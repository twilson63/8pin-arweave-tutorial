// converts USD Amount to AR
export function calc(amount = 1, AR = 1) {
  return Math.round((amount / AR + Number.EPSILON) * 1000) / 1000
}