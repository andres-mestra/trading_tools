export function sortingCoins(coins, isLong) {
  return coins.sort((c1, c2) => {
    if (isLong) return c1.distanceEntry - c2.distanceEntry
    return c1.distanceEntry - c2.distanceEntry
  })
}
