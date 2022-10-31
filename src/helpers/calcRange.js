export function calcRange(price, type) {
  let external = 1
  if (type === 'external') {
    if (price >= 1000) return 100
    if (price >= 500) return 50
    if (price >= 100) return 10
    if (price >= 10) return 1
    if (price >= 1) return 0.1
    if (price >= 0.1) return 0.01
    if (price >= 0.01) return 0.001
    if (price >= 0.001) return 0.0001
    if (price >= 0.0001) return 0.00001
  }

  if (type === 'internal') {
    if (price === 100) return 50
    if (price === 50) return 10
    //TODO: error en el rango price < 0.001
    return price / 10
  }

  return 1
}
