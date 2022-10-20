export function sortingCoins(coins, isLong) {
  return coins.sort((c1, c2) => {
    if (isLong) return c1.longPoints.distanceEntry - c2.longPoints.distanceEntry
    return c1.shortPoints.distanceEntry - c2.shortPoints.distanceEntry
  })
}
