import { Prisma } from '@prisma/client'

/**
 * Serializes Prisma Decimal values to numbers for client-side use
 * This prevents issues with JSON serialization of Decimal objects
 */
export function serializeDecimal<T>(data: T): T {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data === 'object') {
    if (data instanceof Prisma.Decimal) {
      return Number(data) as unknown as T
    }

    if (Array.isArray(data)) {
      return data.map(serializeDecimal) as unknown as T
    }

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializeDecimal(value)])
    ) as unknown as T
  }

  return data
}

/**
 * Helper to recursively convert all Decimal values in an object or array to Numbers
 * Use this when returning Prisma models to client components
 */
export function serializeModel<T>(model: T): T {
  return serializeDecimal(model)
} 