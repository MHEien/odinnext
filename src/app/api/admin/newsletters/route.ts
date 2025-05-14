import { NextResponse } from 'next/server'
import { getNewsletters, createNewsletter } from '@/lib/services/newsletter'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Check admin authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Access check (admin only)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const newsletters = await getNewsletters()
    
    return NextResponse.json(
      { newsletters },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching newsletters:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // Check admin authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Access check (admin only)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }

    const data = await req.json()
    
    // Validate required fields
    if (!data.titleEn || !data.titleNo || !data.contentEn || !data.contentNo) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newsletter = await createNewsletter({
      titleEn: data.titleEn,
      titleNo: data.titleNo,
      contentEn: data.contentEn,
      contentNo: data.contentNo,
      isTranslatedAI: data.isTranslatedAI || false,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined
    })
    
    return NextResponse.json(
      { message: 'Newsletter created successfully', newsletter },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating newsletter:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 