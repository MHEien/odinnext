import { redirect } from 'next/navigation'
import { getCollectionById } from '@/lib/db/actions/collections'
import { getTranslations } from 'next-intl/server'
import CollectionContent from '@/components/collections/CollectionContent'

export default async function CollectionPage({
  params
}: {
  params: { id: string }
}) {
  const collection = await getCollectionById(params.id)
  if (!collection) {
    redirect('/404')
  }

  const t = await getTranslations('Collections')

  const translations = {
    loading: t('loading'),
    includedProducts: t('includedProducts'),
    quantity: t('quantity'),
    perDelivery: t('perDelivery'),
    subscription: {
      toggle: t('subscription.toggle'),
      savingsLabel: t('subscription.savingsLabel'),
      frequency: t('subscription.frequency'),
      weekly: t('subscription.weekly'),
      biweekly: t('subscription.biweekly'),
      monthly: t('subscription.monthly')
    },
    addToCart: {
      button: t('addToCart.button'),
      loading: t('addToCart.loading'),
      error: t('addToCart.error')
    }
  }

  return <CollectionContent collection={collection} translations={translations} />
} 