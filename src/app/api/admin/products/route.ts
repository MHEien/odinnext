import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';


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

export async function POST(request: Request) {
  try {
    // Check authentication and admin status
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });

    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        longDescription: validatedData.longDescription,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        ingredients: validatedData.ingredients,
        allergens: validatedData.allergens,
        weight: validatedData.weight,
        images: validatedData.images,
        inStock: validatedData.inStock,
        featured: validatedData.featured,
        stock: validatedData.stock,
        nutritionalInfo: validatedData.nutritionalInfo,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ message: 'Invalid request data', errors: error.errors }), {
        status: 400,
      });
    }

    console.error('Error creating product:', error);
    return new NextResponse(
      JSON.stringify({ message: 'An error occurred while creating the product' }),
      { status: 500 }
    );
  }
} 