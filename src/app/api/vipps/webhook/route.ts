import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

// TypeScript interfaces for webhook data based on actual Vipps payload
interface VippsWebhookPayload {
  msn: string;
  reference: string;
  pspReference: string;
  name: string;
  amount: {
    currency: string;
    value: number;
  };
  timestamp: string;
  idempotencyKey: string;
  success: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook data
    const body = await request.json() as VippsWebhookPayload;
    console.log('Vipps webhook received:', body);
    
    if (!body.reference) {
      return NextResponse.json({ error: 'Invalid webhook payload: missing reference' }, { status: 400 });
    }
    
    // Handle different webhook event types based on the 'name' field
    switch (body.name) {
      case 'CREATED':
        await handleOrderCreated(body);
        break;
        
      case 'AUTHORIZED':
      case 'PAID':
        await handleOrderPayment(body);
        break;
        
      case 'CANCELLED':
        await handleOrderCancellation(body);
        break;
        
      default:
        console.log(`Unhandled Vipps webhook event: ${body.name}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vipps webhook error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions to handle different event types

async function handleOrderCreated(data: VippsWebhookPayload) {
  const { reference } = data;
  
  try {
    // Check if order already exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: reference }
    });

    if (existingOrder) {
      // Update existing order if found
      await prisma.order.update({
        where: { id: reference },
        data: {
          status: OrderStatus.PENDING,
          updatedAt: new Date()
        }
      });
    } else {
      // Order doesn't exist yet - log this for debugging
      console.log(`Order ${reference} not found in database. Waiting for order creation.`);
    }
  } catch (error) {
    console.error('Error handling order creation:', error);
  }
}

async function handleOrderPayment(data: VippsWebhookPayload) {
  const { reference } = data;
  
  try {
    await prisma.order.update({
      where: { id: reference },
      data: {
        status: OrderStatus.PROCESSING,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating order payment status:', error);
  }
}

async function handleOrderCancellation(data: VippsWebhookPayload) {
  const { reference } = data;
  
  try {
    await prisma.order.update({
      where: { id: reference },
      data: {
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
  }
}
