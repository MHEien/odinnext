import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus, SubscriptionStatus } from '@prisma/client';

// TypeScript interfaces for webhook data
interface WebhookPayload {
  event: string;
  data: PaymentData | SubscriptionData;
}

interface PaymentData {
  reference: string;
  status?: string;
  amount?: number;
  currency?: string;
  timestamp?: string;
}

interface SubscriptionData {
  reference: string;
  status?: string;
  agreementId?: string;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate webhook signature if Vipps provides one
    // This would involve checking headers, etc.
    
    const body = await request.json() as WebhookPayload;
    console.log('Vipps webhook received:', body);
    
    // Extract event type and data
    const { event, data } = body;
    
    if (!event || !data) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }
    
    // Handle different webhook event types
    switch (event) {
      case 'payment.created':
      case 'payment.updated':
        await handlePaymentUpdate(data as PaymentData);
        break;
        
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionUpdate(data as SubscriptionData);
        break;
        
      case 'payment.cancelled':
        await handlePaymentCancellation(data as PaymentData);
        break;
        
      case 'subscription.cancelled':
        await handleSubscriptionCancellation(data as SubscriptionData);
        break;
        
      default:
        console.log(`Unhandled Vipps webhook event: ${event}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vipps webhook error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions to handle different event types

async function handlePaymentUpdate(data: PaymentData) {
  const { reference, status } = data;
  
  if (!reference) return;
  
  let orderStatus: OrderStatus = OrderStatus.PENDING;
  
  if (status === 'AUTHORIZED' || status === 'PAID') {
    orderStatus = OrderStatus.PROCESSING;
  } else if (status === 'DELIVERED') {
    orderStatus = OrderStatus.DELIVERED;
  } else if (status === 'CANCELLED') {
    orderStatus = OrderStatus.CANCELLED;
  }
  
  await prisma.order.update({
    where: { id: reference },
    data: {
      status: orderStatus,
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionUpdate(data: SubscriptionData) {
  const { reference, status } = data;
  
  if (!reference) return;
  
  let subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;
  
  if (status === 'PAUSED') {
    subscriptionStatus = SubscriptionStatus.PAUSED;
  } else if (status === 'CANCELLED') {
    subscriptionStatus = SubscriptionStatus.CANCELLED;
  }
  
  await prisma.subscription.update({
    where: { id: reference },
    data: {
      status: subscriptionStatus,
      updatedAt: new Date()
    }
  });
}

async function handlePaymentCancellation(data: PaymentData) {
  const { reference } = data;
  
  if (!reference) return;
  
  await prisma.order.update({
    where: { id: reference },
    data: {
      status: OrderStatus.CANCELLED,
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionCancellation(data: SubscriptionData) {
  const { reference } = data;
  
  if (!reference) return;
  
  await prisma.subscription.update({
    where: { id: reference },
    data: {
      status: SubscriptionStatus.CANCELLED,
      updatedAt: new Date()
    }
  });
}
