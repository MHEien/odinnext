'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Schema for product creation
const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  ingredients: z.array(z.string()),
  allergens: z.array(z.string()),
  weight: z.number().positive(),
  images: z.array(z.string()),
  inStock: z.boolean(),
  featured: z.boolean(),
  stock: z.number().int().min(0),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    fat: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export async function createProduct(data: CreateProductInput) {
  try {
    // Check authentication and admin status
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validatedData = createProductSchema.parse(data);


    // Create product in database
    const product = await prisma.product.create({
      data: validatedData,
    });

    // Revalidate products pages
    revalidatePath('/[locale]/admin/products');
    revalidatePath('/[locale]/(shop)/products');

    return { success: true, data: product };
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid data',
        validationErrors: error.errors,
      };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An error occurred while creating the product' };
  }
} 