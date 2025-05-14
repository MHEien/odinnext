import { NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth/service'
import { AppLocale, defaultLocale, locales } from '@/i18n/config'
import { parse } from 'accept-language-parser'

function detectLocale(acceptLanguageHeader?: string): AppLocale {
  if (!acceptLanguageHeader) return defaultLocale

  const languages = parse(acceptLanguageHeader)
  if (!languages || languages.length === 0) return defaultLocale

  // Check if any of the accepted languages match our supported locales
  for (const lang of languages) {
    const code = lang.code.toLowerCase()
    if (locales.includes(code as AppLocale)) {
      return code as AppLocale
    }
    // Handle Norwegian variants (nb, nn) -> map to 'no'
    if ((code === 'nb' || code === 'nn') && locales.includes('no')) {
      return 'no'
    }
  }

  return defaultLocale
}

export async function POST(req: Request) {
  try {
    const { email, password, name, newsletterSubscription, marketingConsent } = await req.json()
    
    // Access the Accept-Language header from the request
    const acceptLanguage = req.headers.get('accept-language') || ''
    const locale = detectLocale(acceptLanguage)

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    const user = await createUser(email, password, name, {
      newsletterSubscription,
      marketingConsent,
      locale
    })

    return NextResponse.json(
      { message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 