import { NextResponse } from 'next/server'
import { getNewsletter, updateNewsletter, deleteNewsletter } from '@/lib/services/newsletter'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

interface Params {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: Params) {
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

    const newsletter = await getNewsletter(params.id, true)
    
    if (!newsletter) {
      return NextResponse.json(
        { message: 'Newsletter not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { newsletter },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching newsletter:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, { params }: Params) {
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
    
    const newsletter = await updateNewsletter(params.id, {
      ...data,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined
    })
    
    return NextResponse.json(
      { message: 'Newsletter updated successfully', newsletter },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating newsletter:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: Params) {
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

    await deleteNewsletter(params.id)
    
    return NextResponse.json(
      { message: 'Newsletter deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting newsletter:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 