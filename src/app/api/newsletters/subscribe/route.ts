import { NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/services/newsletter'
import { AppLocale, defaultLocale } from '@/i18n/config'

export async function POST(req: Request) {
  try {
    const { email, locale = defaultLocale } = await req.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    await subscribeToNewsletter(email, locale as AppLocale)

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { message: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    await subscribeToNewsletter(email, defaultLocale)

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter unsubscription error:', error)
    return NextResponse.json(
      { message: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
} 