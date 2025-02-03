export type ProductCategory = 'dark' | 'milk' | 'white' | 'mixed';

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: ProductCategory;
  ingredients: string[];
  allergens: string[];
  weight: number; // in grams
  featured: boolean;
  inStock: boolean;
  nutritionalInfo: NutritionalInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: ProductCategory;
  ingredients: string[];
  allergens: string[];
  weight: number;
  featured?: boolean;
  inStock?: boolean;
  nutritionalInfo: NutritionalInfo;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  featured?: boolean;
  inStock?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: 'thor-thunder',
    name: "Thor's Thunder",
    description: 'Dark chocolate with sea salt and popping candy.',
    longDescription: 'Experience the power of Thor in every bite with this premium dark chocolate bar. The combination of crunchy sea salt and explosive popping candy creates a thunderous sensation that would make the God of Thunder himself proud.',
    price: 12.99,
    image: '/images/thor-thunder.jpg',
    category: 'dark',
    ingredients: ['Dark Chocolate', 'Sea Salt', 'Popping Candy'],
    allergens: ['Milk', 'Soy'],
    weight: 100,
    featured: true,
    inStock: true,
    nutritionalInfo: {
      calories: 500,
      protein: 10,
      carbohydrates: 50,
      fat: 30,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'freya-delight',
    name: "Freya's Delight",
    description: 'Milk chocolate with honey and lavender.',
    longDescription: 'A delicate blend inspired by the Norse goddess of love and beauty. This milk chocolate bar is infused with sweet honey and calming lavender, creating a harmonious balance that would please Freya herself.',
    price: 14.99,
    image: '/images/freya-delight.jpg',
    category: 'milk',
    ingredients: ['Milk Chocolate', 'Honey', 'Lavender'],
    allergens: ['Milk', 'Soy'],
    weight: 100,
    featured: false,
    inStock: true,
    nutritionalInfo: {
      calories: 520,
      protein: 8,
      carbohydrates: 55,
      fat: 32,
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'loki-twist',
    name: "Loki's Twist",
    description: 'White chocolate with dark swirls and chili.',
    longDescription: 'As unpredictable as the trickster god himself, this white chocolate bar features dramatic dark chocolate swirls and a surprising hint of chili. Each bite brings a new adventure of flavors.',
    price: 13.99,
    image: '/images/loki-twist.jpg',
    category: 'white',
    ingredients: ['White Chocolate', 'Dark Chocolate', 'Chili'],
    allergens: ['Milk', 'Soy'],
    weight: 100,
    featured: true,
    inStock: true,
    nutritionalInfo: {
      calories: 530,
      protein: 7,
      carbohydrates: 58,
      fat: 31,
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// Helper functions
export async function getAllProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts.find((product) => product.id === id) || null;
}

export async function getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return mockProducts.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false;
    }

    if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
      return false;
    }

    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.ingredients.some((i) => i.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const now = new Date().toISOString();
  const newProduct: Product = {
    id: generateProductId(data.name),
    ...data,
    featured: data.featured ?? false,
    inStock: data.inStock ?? true,
    createdAt: now,
    updatedAt: now,
  };

  mockProducts.push(newProduct);
  return newProduct;
}

export async function updateProduct(data: UpdateProductData): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = mockProducts.findIndex((p) => p.id === data.id);
  if (index === -1) throw new Error('Product not found');

  const updatedProduct = {
    ...mockProducts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockProducts[index] = updatedProduct;
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found');

  mockProducts.splice(index, 1);
}

// Utility functions
function generateProductId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export const categories: { value: ProductCategory; label: string }[] = [
  { value: 'dark', label: 'Dark Chocolate' },
  { value: 'milk', label: 'Milk Chocolate' },
  { value: 'white', label: 'White Chocolate' },
  { value: 'mixed', label: 'Mixed Chocolate' },
]; 