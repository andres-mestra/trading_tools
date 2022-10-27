export function calcBounces(bounces, distance) {
  return distance >= 0 && distance <= 0.000001 ? bounces + 1 : bounces
}
