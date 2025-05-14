import { getProduct } from '@/lib/db/actions/products'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

export const revalidate = 60 // Revalidate every minute

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) {
    notFound()
  }


  // Serialize the product to handle Decimal
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    nutritionalInfo: product.nutritionalInfo as Record<string, string | number>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 pt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetail product={serializedProduct} />
      </div>
    </div>
  )
} 