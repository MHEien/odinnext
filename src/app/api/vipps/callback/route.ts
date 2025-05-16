import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCheckout } from '@/lib/vipps';
import { OrderStatus, SubscriptionStatus, Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, transactionInfo } = body;
    
    if (!reference) {
      return NextResponse.json({ error: 'Reference (orderId) is required' }, { status: 400 });
    }

    // Get detailed checkout info from Vipps
    const checkoutResponse = await getCheckout(reference);
    
    if (!checkoutResponse.ok) {
      return NextResponse.json({ error: 'Failed to get checkout information' }, { status: 500 });
    }

    // Extract the data based on Vipps SDK response structure
    const checkoutData = checkoutResponse.ok ? checkoutResponse.data : null;
    
    // Map Vipps status to our status enums
    let orderStatus: OrderStatus = OrderStatus.PENDING;
    let subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;
    
    // Safely extract status from response using type guards
    const paymentStatus = 
      // Try to extract from checkoutData as a record with string keys
      (checkoutData && typeof checkoutData === 'object' && checkoutData !== null) 
        ? (
            // Try common status field names
            'state' in checkoutData ? String(checkoutData.state) :
            'status' in checkoutData ? String(checkoutData.status) :
            transactionInfo?.status || 'UNKNOWN'
          )
        : (transactionInfo?.status || 'UNKNOWN');
                          
    if (paymentStatus === 'AUTHORIZED' || paymentStatus === 'PAID') {
      orderStatus = OrderStatus.PROCESSING;
      subscriptionStatus = SubscriptionStatus.ACTIVE;
    } else if (paymentStatus === 'CANCELLED') {
      orderStatus = OrderStatus.CANCELLED;
      subscriptionStatus = SubscriptionStatus.CANCELLED;
    }
    
    // Determine if it's a subscription based on available data
    const isSubscription = 
      body.type === 'SUBSCRIPTION' || 
      (checkoutData && typeof checkoutData === 'object' && checkoutData !== null && 
       'subscription' in checkoutData);

    // Extract shipping and billing details if available
    const shippingDetails = checkoutData?.shippingDetails;
    const billingDetails = checkoutData?.billingDetails;

    // Update order or subscription status in database
    if (isSubscription) {
      await prisma.subscription.update({
        where: { id: reference },
        data: {
          status: subscriptionStatus,
          updatedAt: new Date()
        }
      });
    } else {
      // Create and connect address records if provided
      const updateData: Prisma.OrderUpdateInput = {
        status: orderStatus,
        updatedAt: new Date()
      };

      // Create shipping address if provided
      if (shippingDetails) {
        try {
          const shippingAddress = await prisma.address.create({
            data: {
              firstName: shippingDetails.firstName || "",
              lastName: shippingDetails.lastName || "",
              email: shippingDetails.email || "",
              phone: shippingDetails.phoneNumber || "",
              street: shippingDetails.streetAddress || "",
              city: shippingDetails.city || "",
              state: "", // Vipps doesn't provide state
              postalCode: shippingDetails.postalCode || "",
              country: shippingDetails.country || "",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          updateData.shippingAddress = { connect: { id: shippingAddress.id } };
        } catch (error) {
          console.error('Failed to create shipping address:', error);
        }
      }

      // Create billing address if provided
      if (billingDetails) {
        try {
          const billingAddress = await prisma.address.create({
            data: {
              firstName: billingDetails.firstName || "",
              lastName: billingDetails.lastName || "",
              email: billingDetails.email || "",
              phone: billingDetails.phoneNumber || "",
              street: billingDetails.streetAddress || "",
              city: billingDetails.city || "",
              state: "", // Vipps doesn't provide state
              postalCode: billingDetails.postalCode || "",
              country: billingDetails.country || "",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          updateData.billingAddress = { connect: { id: billingAddress.id } };
        } catch (error) {
          console.error('Failed to create billing address:', error);
        }
      }

      // Update order with status and newly created address IDs
      await prisma.order.update({
        where: { id: reference },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vipps callback error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also support GET for polling and testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  
  if (!reference) {
    return NextResponse.json({ error: 'Reference parameter is required' }, { status: 400 });
  }
  
  try {
    const checkoutResponse = await getCheckout(reference);
    if (checkoutResponse.ok) {
      return NextResponse.json({ status: 'success', data: checkoutResponse.data });
    } else {
      return NextResponse.json(
        { status: 'error', message: 'Failed to get checkout information' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error getting checkout:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to get checkout information' }, { status: 500 });
  }
}
