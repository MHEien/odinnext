export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: 'dark' | 'milk' | 'white' | 'mixed';
  ingredients: string[];
  allergens: string[];
  weight: string;
  nutritionalInfo: {
    servingSize: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
  featured: boolean;
  inStock: boolean;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: "Thor's Thunder Chocolate",
    description: 'A powerful dark chocolate infused with sea salt and popping candy.',
    longDescription: `Experience the might of Thor in every bite with this premium dark chocolate bar. 
    The combination of crunchy sea salt and explosive popping candy creates a thunderous sensation that 
    would make the God of Thunder himself proud. Made with 70% cocoa sourced from the finest beans.`,
    price: 29.99,
    image: '/products/thors-thunder.jpg',
    category: 'dark',
    ingredients: ['Dark Chocolate', 'Sea Salt', 'Popping Candy'],
    allergens: ['May contain milk', 'Contains soy'],
    weight: '100g',
    nutritionalInfo: {
      servingSize: '25g',
      calories: 135,
      fat: 9,
      carbs: 12,
      protein: 2,
    },
    featured: true,
    inStock: true,
  },
  {
    id: 'prod_2',
    name: "Freya's Delight",
    description: 'Smooth milk chocolate with honey and lavender notes.',
    longDescription: `A delicate blend inspired by the Norse goddess of love and beauty. This milk chocolate 
    bar is infused with sweet honey and calming lavender, creating a harmonious balance that would please 
    Freya herself. Each piece is a testament to the finer pleasures in life.`,
    price: 27.99,
    image: '/products/freyas-delight.jpg',
    category: 'milk',
    ingredients: ['Milk Chocolate', 'Honey', 'Lavender'],
    allergens: ['Contains milk', 'Contains soy'],
    weight: '90g',
    nutritionalInfo: {
      servingSize: '30g',
      calories: 165,
      fat: 10,
      carbs: 15,
      protein: 3,
    },
    featured: true,
    inStock: true,
  },
  {
    id: 'prod_3',
    name: "Loki's Trick",
    description: 'White chocolate with unexpected bursts of flavor.',
    longDescription: `Just like its namesake, this white chocolate bar is full of surprises. Hidden within 
    its creamy exterior are pockets of tangy raspberry and spicy ginger, creating an unpredictable yet 
    delightful experience that embodies the trickster god's playful nature.`,
    price: 24.99,
    image: '/products/lokis-trick.jpg',
    category: 'white',
    ingredients: ['White Chocolate', 'Raspberry', 'Ginger'],
    allergens: ['Contains milk', 'Contains soy'],
    weight: '85g',
    nutritionalInfo: {
      servingSize: '28g',
      calories: 155,
      fat: 9,
      carbs: 16,
      protein: 2,
    },
    featured: false,
    inStock: true,
  },
  {
    id: 'prod_4',
    name: "Odin's Wisdom",
    description: 'Dark chocolate with coffee and hazelnut.',
    longDescription: `A sophisticated blend that pays homage to the Allfather's wisdom. This dark chocolate 
    bar combines rich coffee and roasted hazelnuts, creating a deep, complex flavor profile that reveals 
    new nuances with each tasting. Perfect for contemplative moments.`,
    price: 32.99,
    image: '/products/odins-wisdom.jpg',
    category: 'dark',
    ingredients: ['Dark Chocolate', 'Coffee', 'Hazelnuts'],
    allergens: ['Contains nuts', 'May contain milk', 'Contains soy'],
    weight: '100g',
    nutritionalInfo: {
      servingSize: '25g',
      calories: 145,
      fat: 11,
      carbs: 10,
      protein: 3,
    },
    featured: true,
    inStock: true,
  },
  {
    id: 'prod_5',
    name: "Valkyrie's Choice",
    description: 'Mixed chocolate selection with Nordic berries.',
    longDescription: `A curated selection worthy of Valhalla itself. This mixed chocolate box features 
    dark, milk, and white chocolates filled with traditional Nordic berries like lingonberry, cloudberry, 
    and bilberry. Each piece is a celebration of Scandinavian flavors.`,
    price: 39.99,
    image: '/products/valkyries-choice.jpg',
    category: 'mixed',
    ingredients: [
      'Dark Chocolate',
      'Milk Chocolate',
      'White Chocolate',
      'Nordic Berries',
    ],
    allergens: ['Contains milk', 'Contains soy'],
    weight: '120g',
    nutritionalInfo: {
      servingSize: '30g',
      calories: 160,
      fat: 9,
      carbs: 18,
      protein: 2,
    },
    featured: true,
    inStock: true,
  },
];

// API functions
export async function getAllProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts.find((product) => product.id === id) || null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockProducts.filter((product) => ids.includes(product.id));
}

export interface ProductFilters {
  category?: 'dark' | 'milk' | 'white' | 'mixed';
  featured?: boolean;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export async function getFilteredProducts(
  filters: ProductFilters
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filteredProducts = [...mockProducts];

  // Apply filters
  if (filters.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === filters.category
    );
  }

  if (filters.featured !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => product.featured === filters.featured
    );
  }

  if (filters.inStock !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => product.inStock === filters.inStock
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    filteredProducts.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filteredProducts;
} 