'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Product, Category } from '@prisma/client';

interface ProductOverviewProps {
  product: Omit<Product, 'price'> & {
    price: number;
    category: Category;
  };
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  const t = useTranslations('Admin.Products');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-xl font-display mb-6">{t('details.overview')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-100">
          <Image
            src={product.images[0] || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-stone-500">{t('productName')}</label>
            <p className="font-medium">{product.name}</p>
          </div>

          <div>
            <label className="text-sm text-stone-500">{t('category')}</label>
            <p className="font-medium">{product.category.name}</p>
          </div>

          <div>
            <label className="text-sm text-stone-500">{t('price')}</label>
            <p className="font-medium">
              {new Intl.NumberFormat('no-NO', {
                style: 'currency',
                currency: 'NOK'
              }).format(product.price)} kr
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">{t('stock')}</label>
            <p className="font-medium">{product.stock}</p>
          </div>

          <div>
            <label className="text-sm text-stone-500">{t('details.status.title')}</label>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                !product.inStock
                  ? 'bg-red-500'
                  : product.stock > 0
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`} />
              <span className="font-medium">
                {!product.inStock
                  ? t('details.status.inactive')
                  : product.stock > 0
                  ? t('details.status.active')
                  : t('details.status.outOfStock')}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-stone-500">{t('details.lastUpdated')}</label>
            <p className="font-medium">
              {new Date(product.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <label className="text-sm text-stone-500">{t('shortDescription')}</label>
        <p className="mt-2">{product.description}</p>
      </div>

      {/* Long Description */}
      <div className="mt-8">
        <label className="text-sm text-stone-500">{t('fullDescription')}</label>
        <p className="mt-2 whitespace-pre-wrap">{product.longDescription}</p>
      </div>

      {/* Ingredients */}
      <div className="mt-8">
        <label className="text-sm text-stone-500">{t('ingredients')}</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-stone-100 rounded-full text-sm"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {/* Allergens */}
      <div className="mt-8">
        <label className="text-sm text-stone-500">{t('allergens')}</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.allergens.map((allergen, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
            >
              {allergen}
            </span>
          ))}
        </div>
      </div>

      {/* Nutritional Info */}
      <div className="mt-8">
        <label className="text-sm text-stone-500">{t('nutritionalInfo')}</label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(product.nutritionalInfo as Record<string, number>).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-stone-50 rounded-lg">
              <p className="text-sm text-stone-500">{t(key.toLowerCase())}</p>
              <p className="font-medium mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 