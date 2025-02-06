import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    shippingStreet: string | null;
    shippingCity: string | null;
    shippingState: string | null;
    shippingPostalCode: string | null;
    shippingCountry: string | null;
    marketingConsent: boolean;
    notifications: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    shippingStreet?: string | null;
    shippingCity?: string | null;
    shippingState?: string | null;
    shippingPostalCode?: string | null;
    shippingCountry?: string | null;
    marketingConsent?: boolean;
    notifications?: boolean;
  }
} 