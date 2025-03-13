export const locales = ['en', 'no'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale = 'no';

export function hasLocale(locales: readonly string[], locale: string | undefined): locale is AppLocale {
  return !!locale && locales.includes(locale);
} 