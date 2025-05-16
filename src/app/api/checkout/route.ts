import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, createSubscriptionCheckout, getCheckout } from '@/lib/vipps';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus, SubscriptionStatus, Frequency, SubscriptionType } from '@prisma/client';

// Define types for the checkout process
interface ProductItem {
    id: string;
    price: number | string;
    quantity: number;
}

export async function POST(request: NextRequest) {
    try {
        const { 
            products, 
            isSubscription, 
            userId, 
            frequency = 'MONTHLY',
            collectionId = null
        } = await request.json();

        if (!products || products.length === 0) {
            return NextResponse.json({ error: 'Products are required' }, { status: 400 });
        }

        // Generate a unique ID for the order/subscription
        const orderId = uuidv4();
        
        // Calculate total amount
        const total = products.reduce(
            (sum: number, item: ProductItem) => sum + (Number(item.price) * item.quantity), 
            0
        );

        if (isSubscription) {
            // Create subscription record in database
            const subscription = await prisma.subscription.create({
                data: {
                    id: orderId,
                    userId,
                    status: SubscriptionStatus.ACTIVE,
                    frequency: frequency as Frequency,
                    nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    type: collectionId ? SubscriptionType.COLLECTION : SubscriptionType.CUSTOM,
                    collectionId,
                    items: {
                        create: products.map((product: ProductItem) => ({
                            productId: product.id,
                            quantity: product.quantity
                        }))
                    }
                }
            });
            
            // Initialize Vipps subscription checkout
            const checkout = await createSubscriptionCheckout({ products, orderId });
            return NextResponse.json({
                ...checkout,
                subscriptionId: subscription.id
            });
        } else {
            // Create payment method record
            const paymentMethod = await prisma.paymentMethod.create({
                data: {
                    type: 'vipps'
                }
            });

            // Create order record in database without addresses
            // Addresses will be added when we get the data from Vipps
            const order = await prisma.order.create({
                data: {
                    id: orderId,
                    userId,
                    status: OrderStatus.PENDING,
                    total: new Decimal(total),
                    paymentMethodId: paymentMethod.id,
                    items: {
                        create: products.map((product: ProductItem) => ({
                            productId: product.id,
                            quantity: product.quantity,
                            price: new Decimal(product.price)
                        }))
                    }
                }
            });
            
            // Initialize Vipps checkout
            const checkout = await createCheckout({ products, orderId });
            
            return NextResponse.json({
                ...checkout,
                orderId: order.id
            });
        }
    } catch (error) {
        console.error('Checkout error:', error instanceof Error ? error.message : error);
        return NextResponse.json({ 
            error: 'Failed to process checkout',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    const checkout = await getCheckout(orderId);
    return NextResponse.json(checkout);
}

