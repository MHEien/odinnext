import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'no'],
 
  // Used when no locale matches
  defaultLocale: 'no'
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

// Helper function to get current locale from path
function getCurrentLocaleFromPath(path: string): string {
  // Check if path starts with a locale
  for (const locale of routing.locales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return locale;
    }
  }
  return routing.defaultLocale;
}

// Enhanced redirect that automatically includes the current locale
export function redirectWithLocale(href: string, options?: { locale?: string }): never {
  // First, try to use the provided locale option if available
  if (options?.locale) {
    return redirect({
      href,
      locale: options.locale
    });
  }
  
  // If no locale provided, we'll use the default
  // We can't easily get the current locale from headers in a synchronous function
  // but we can pass it explicitly or rely on the default
  return redirect({
    href,
    locale: routing.defaultLocale
  });
}

// Use this in Server Components where you have access to params
export function redirectWithLocaleFromParams(
  href: string, 
  params: { locale?: string },
  options?: { locale?: string }
): never {
  const locale = options?.locale || params.locale || routing.defaultLocale;
  return redirect({
    href,
    locale
  });
}

// Custom hook for Client Components that provides a redirect function with current locale
export function useRedirectWithLocale() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract current locale from pathname
  const currentLocale = getCurrentLocaleFromPath(pathname);
  
  // Return a redirect function that uses the current locale
  return (href: string, options?: { locale?: string }) => {
    router.push(href, { locale: options?.locale || currentLocale });
  };
}