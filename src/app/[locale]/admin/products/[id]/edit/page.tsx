import { getProduct, getCategories } from '@/lib/db/actions/products'
import { notFound } from 'next/navigation'
import { ProductForm } from './ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories()
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl mb-2">Edit Product</h1>
          <p className="text-stone-600">Update product information.</p>
        </div>

        <ProductForm 
          product={product} 
          categories={categories} 
        />
      </div>
    </div>
  )
} 