import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProducts } from '@/lib/db/actions/products'
import { ProductList } from '@/components/admin/products/ProductList'
import { AddProductButton } from './add-product'
import { getTranslations } from 'next-intl/server'

export default async function AdminProducts() {
  const session = await auth()

  const t = await getTranslations('Admin')
  const navt = await getTranslations('Navigation')
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const products = await getProducts()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-norse text-4xl mb-2">{navt('products')}</h1>
            <p className="text-stone-600">{t('Products.manage')}</p>
          </div>
          <AddProductButton />
        </div>


        <ProductList products={products} />
      </div>
    </div>
  )
} 