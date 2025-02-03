import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database IDs
export const DATABASES = {
  MAIN: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
};

// Collection IDs
export const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  USERS: 'users',
  SUBSCRIPTIONS: 'subscriptions',
};

// Bucket IDs
export const BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
};

export { ID, Query } from 'appwrite'; 