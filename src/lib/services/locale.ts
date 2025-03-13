"use server"
import {cookies} from 'next/headers';
import {defaultLocale, locales, hasLocale} from '@/i18n/config';
import type {AppLocale} from '@/i18n/config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const candidate = cookieStore.get(COOKIE_NAME)?.value;
  return hasLocale(locales, candidate) ? candidate : defaultLocale;
}

export async function setUserLocale(locale: AppLocale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale);
} 