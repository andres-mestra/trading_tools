import { Decimal } from 'decimal.js'
Decimal.set({ precision: 7 })

export function useDecimal() {
  function plus(...args) {
    let current = 0

    args.forEach((n) => {
      const x = new Decimal(current)
      const y = new Decimal(n)
      current = x.plus(y).toNumber()
    })

    return current
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

  function abs(n) {
    return new Decimal(n).abs().toNumber()
  }

  function asNumber(a) {
    return new Decimal(a).toNumber()
  }

  return {
    abs,
    div,
    sub,
    mul,
    plus,
    asNumber,
    Decimal,
  }
}
