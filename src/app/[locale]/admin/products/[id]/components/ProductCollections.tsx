'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Collection } from '@prisma/client';

interface ProductCollectionsProps {
  collections: {
    collection: Collection;
    quantity: number;
  }[];
}

export default function ProductCollections({ collections }: ProductCollectionsProps) {
  const t = useTranslations('Admin.Products');

  if (collections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-display mb-6">{t('details.collections')}</h2>
        <p className="text-stone-500">{t('details.noCollections')}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-xl font-display mb-6">{t('details.collections')}</h2>

      <div className="space-y-4">
        {collections.map(({ collection, quantity }) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg"
          >
            {/* Collection Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
              <Image
                src={collection.image || '/images/placeholder-collection.jpg'}
                alt={collection.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Collection Info */}
            <div className="flex-grow">
              <h3 className="font-medium">{collection.name}</h3>
              <p className="text-sm text-stone-500 line-clamp-1">
                {collection.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="text-right">
              <p className="text-sm text-stone-500">{t('Orders.details.quantity')}</p>
              <p className="font-medium">{quantity}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 