import { getProducts } from '@/lib/db/actions/products'
import ProductGrid from '@/components/ProductGrid'
import ProductHero from '@/components/ProductHero'

export const revalidate = 60 // Revalidate every minute

export default async function ProductsPage() {
  const products = await getProducts()

  // Serialize the products to handle Decimal
  const serializedProducts = products.map(product => ({
    ...product,
    price: Number(product.price)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 pt-16">
      <ProductHero />
      <ProductGrid products={serializedProducts} />
    </div>
  )
} 