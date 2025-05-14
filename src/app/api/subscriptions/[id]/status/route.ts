import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { SubscriptionStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!Object.values(SubscriptionStatus).includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Verify the subscription belongs to the user
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!subscription) {
      return new NextResponse('Subscription not found', { status: 404 });
    }

    if (subscription.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the subscription status
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: { 
        status: status as SubscriptionStatus,
        // If reactivating, set next delivery date
        ...(status === 'ACTIVE' && {
          nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        })
      }
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('[SUBSCRIPTION_STATUS_UPDATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 