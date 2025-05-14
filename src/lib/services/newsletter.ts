import { prisma } from '@/lib/db'
import { AppLocale } from '@/i18n/config'

// Newsletter subscription management
export async function subscribeToNewsletter(email: string, locale: AppLocale = 'no') {
  // Check if this email is already subscribed
  const existingSubscription = await prisma.newsletterSubscription.findUnique({
    where: { email }
  })

  if (existingSubscription) {
    // If it exists but was inactive, reactivate it
    if (!existingSubscription.isActive) {
      return prisma.newsletterSubscription.update({
        where: { id: existingSubscription.id },
        data: { 
          isActive: true,
          locale 
        }
      })
    }
    // Already active, just update locale if needed
    if (existingSubscription.locale !== locale) {
      return prisma.newsletterSubscription.update({
        where: { id: existingSubscription.id },
        data: { locale }
      })
    }
    // Already subscribed with the same locale
    return existingSubscription
  }

  // Check if the email belongs to a registered user
  const user = await prisma.user.findFirst({
    where: { email }
  })

  // Create new subscription
  return prisma.newsletterSubscription.create({
    data: {
      email,
      locale,
      isActive: true,
      userId: user?.id // Link to user if one exists
    }
  })
}

export async function unsubscribeFromNewsletter(email: string) {
  const subscription = await prisma.newsletterSubscription.findUnique({
    where: { email }
  })

  if (!subscription) {
    throw new Error('Subscription not found')
  }

  return prisma.newsletterSubscription.update({
    where: { id: subscription.id },
    data: { isActive: false }
  })
}

export async function updateSubscriptionLocale(email: string, locale: AppLocale) {
  const subscription = await prisma.newsletterSubscription.findUnique({
    where: { email }
  })

  if (!subscription) {
    throw new Error('Subscription not found')
  }

  return prisma.newsletterSubscription.update({
    where: { id: subscription.id },
    data: { locale }
  })
}

// Newsletter management for admins
export async function createNewsletter(data: {
  titleEn: string
  titleNo: string
  contentEn: string
  contentNo: string
  htmlTemplateEn?: string
  htmlTemplateNo?: string
  isTranslatedAI?: boolean
  scheduledFor?: Date
}) {
  return prisma.newsletter.create({
    data: {
      ...data,
      isTranslatedAI: data.isTranslatedAI || false,
      status: data.scheduledFor ? 'SCHEDULED' : 'DRAFT'
    }
  })
}

export async function updateNewsletter(
  id: string,
  data: {
    titleEn?: string
    titleNo?: string
    contentEn?: string
    contentNo?: string
    isTranslatedAI?: boolean
    status?: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'CANCELLED'
    scheduledFor?: Date | null
  }
) {
  return prisma.newsletter.update({
    where: { id },
    data
  })
}

export async function deleteNewsletter(id: string) {
  return prisma.newsletter.delete({
    where: { id }
  })
}

export async function getNewsletters(includeSubscribers = false) {
  return prisma.newsletter.findMany({
    include: {
      subscribers: includeSubscribers
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getNewsletter(id: string, includeSubscribers = false) {
  return prisma.newsletter.findUnique({
    where: { id },
    include: {
      subscribers: includeSubscribers
    }
  })
}

export async function getActiveSubscribers(locale?: AppLocale) {
  return prisma.newsletterSubscription.findMany({
    where: {
      isActive: true,
      ...(locale ? { locale } : {})
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  })
} 