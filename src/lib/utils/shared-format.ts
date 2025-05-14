import { Frequency, SubscriptionStatus } from "@prisma/client"

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
export function formatStatus(status: SubscriptionStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export function getFrequencyLabel(frequency: Frequency) {
  switch (frequency) {
    case 'WEEKLY': return 'Weekly'
    case 'BIWEEKLY': return 'Bi-weekly'
    case 'MONTHLY': return 'Monthly'
    default: return frequency
  }
} 