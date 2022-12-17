import { Decimal } from 'decimal.js'
Decimal.set({ precision: 7 })

export function useDecimal() {
  function plus(a, b) {
    const x = new Decimal(a)
    const y = new Decimal(b)

    return x.plus(y).toNumber()
  }

  function sub(a, b) {
    const x = new Decimal(a)
    const y = new Decimal(b)

    return x.minus(y).toNumber()
  }

  function mul(a, b) {
    const x = new Decimal(a)
    const y = new Decimal(b)

    return x.times(y).toNumber()
  }

  function div(numerator, divider) {
    const x = new Decimal(numerator)
    const y = new Decimal(divider)

    return x.dividedBy(y).toNumber()
  }

  function asNumber(a) {
    return new Decimal(a).toNumber()
  }

  return {
    div,
    sub,
    mul,
    plus,
    asNumber,
    Decimal,
  }
}
