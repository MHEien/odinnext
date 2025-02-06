export function formatLargeNumber(num: number) {
  return new Intl.NumberFormat('no-NO').format(num)
}

export function formatRevenue(amount: number) {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: 'NOK'
  }).format(amount)
}

export function formatCurrency(amount: number) {
  return `${formatLargeNumber(amount)} kr`
} 