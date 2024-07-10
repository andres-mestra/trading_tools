export const useFormatterCurrency = (locales, currency) => {
  const formatter = (value) => {
    const nValue = typeof value === 'string' ? Number(value) : value
    return new Intl.NumberFormat(locales, {
      style: 'currency',
      currency: currency,
    }).format(nValue)
  }

  return formatter
}
