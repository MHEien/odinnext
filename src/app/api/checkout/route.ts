import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, createSubscriptionCheckout, getCheckout } from '@/lib/vipps';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    const { products, isSubscription } = await request.json();


    const orderId = uuidv4();

    if (!products) {
        return NextResponse.json({ error: 'Products are required' }, { status: 400 });
    }

    if (isSubscription) {
        const checkout = await createSubscriptionCheckout({ products, orderId });
        return NextResponse.json(checkout);
    }

    const checkout = await createCheckout({ products, orderId });
    console.log('checkout', JSON.stringify(checkout, null, 2));
    return NextResponse.json(checkout);
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

