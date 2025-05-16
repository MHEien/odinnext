import { Suspense } from 'react'
import { getCollections } from '@/lib/db/actions/collections'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ChevronRight } from 'lucide-react'

export default async function CollectionsPage() {
  const collections = await getCollections({ active: true })
  const t = await getTranslations('Collections')
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-norse text-5xl text-stone-100 mb-4">{t('title') || 'Our Collections'}</h1>
          <p className="text-stone-400 max-w-2xl mx-auto">
            {t('subtitle') || 'Discover our carefully curated chocolate collections, each designed to take you on a unique flavor journey.'}
          </p>
        </div>

        {/* Collections Grid */}
        <Suspense fallback={<CollectionsLoading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div 
                key={collection.id}
                className="group bg-stone-800/50 rounded-lg overflow-hidden border border-stone-700 
                  hover:border-amber-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={collection.image || '/images/hero-bg.png'}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {collection.featured && (
                    <div className="absolute top-4 right-4 bg-amber-900/70 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                      {t('featured') || 'Featured'}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-norse text-2xl text-stone-100 mb-2">{collection.name}</h2>
                  <p className="text-stone-400 mb-6 line-clamp-2">
                    {collection.description}
                  </p>
                  
                  {/* Product Previews */}
                  <div className="flex items-center space-x-2 mb-6">
                    {collection.products.slice(0, 3).map(({ product }) => (
                      <div key={product.id} className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-600">
                        <Image
                          src={product.images[0] || '/images/placeholder.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {collection.products.length > 3 && (
                      <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center text-stone-400 text-xs">
                        +{collection.products.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-amber-500 text-lg font-medium">
                        kr {Number(collection.price).toFixed(2)}
                      </span>
                      <span className="text-stone-500 text-sm ml-2">{t('perDelivery') || 'per delivery'}</span>
                    </div>
                    <Link 
                      href={`/collections/${collection.id}`}
                      className="flex items-center text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      <span className="mr-1">{t('viewDetails') || 'View details'}</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Suspense>
        
        {collections.length === 0 && (
          <div className="text-center py-20 bg-stone-800/30 rounded-lg border border-stone-700">
            <h3 className="text-stone-300 text-xl mb-2">{t('noCollections') || 'No collections available'}</h3>
            <p className="text-stone-500">{t('checkBackLater') || 'Please check back later for new collections'}</p>
          </div>
        )}
        
        {/*
        <div className="mt-20 bg-gradient-to-r from-amber-900/50 to-stone-800 rounded-lg p-8 border border-amber-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-norse text-3xl text-stone-100 mb-2">{t('subscriptionCTA.title') || 'Subscribe & Save'}</h3>
              <p className="text-stone-400 md:max-w-md">
                {t('subscriptionCTA.description') || 'Enjoy regular deliveries of your favorite collections at a discounted price.'}
              </p>
            </div>
            <Link
              href="/subscriptions"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 
                text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('subscriptionCTA.button') || 'Explore Subscriptions'}
            </Link>
          </div>
        </div>
        */}
      </div>
    </div>
  )
}

function CollectionsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-stone-800/50 rounded-lg overflow-hidden border border-stone-700 animate-pulse">
          <div className="aspect-video bg-stone-700/50"></div>
          <div className="p-6 space-y-4">
            <div className="h-7 bg-stone-700/70 rounded w-3/4"></div>
            <div className="h-4 bg-stone-700/70 rounded w-full"></div>
            <div className="h-4 bg-stone-700/70 rounded w-2/3"></div>
            <div className="flex items-center space-x-2 my-6">
              <div className="w-10 h-10 rounded-full bg-stone-700/70"></div>
              <div className="w-10 h-10 rounded-full bg-stone-700/70"></div>
              <div className="w-10 h-10 rounded-full bg-stone-700/70"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 bg-stone-700/70 rounded w-1/4"></div>
              <div className="h-5 bg-stone-700/70 rounded w-1/5"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 