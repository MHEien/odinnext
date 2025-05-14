import { getCollections } from '@/lib/db/actions/collections'
import { FeaturedCollections } from '@/components/collections/FeaturedCollections'
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans'
import { HeroSection } from '@/components/home/HeroSection'
import { CallToAction } from '@/components/home/CallToAction'

export default async function HomePage() {
  // Get collections with their products included
  const [featuredCollections, subscriptionCollections] = await Promise.all([
    getCollections({ featured: true }),
    getCollections({ active: true })
  ])

  return (
    <div className="min-h-screen">
      <HeroSection />
      {featuredCollections.length > 0 && (
        <FeaturedCollections collections={featuredCollections} />
      )}
      {subscriptionCollections.length > 0 && (
        <SubscriptionPlans collections={subscriptionCollections} />
      )}
      <CallToAction />
    </div>
  )
}
