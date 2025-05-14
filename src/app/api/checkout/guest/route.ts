import { NextResponse } from 'next/server'
import { processCheckout } from '@/lib/db/actions/checkout'
import { createCheckout, createSubscriptionCheckout } from '@/lib/vipps'
import { CheckoutData } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Check if we're handling a Vipps payment flow
    if (data.products && (data.isVipps || data.isSubscription)) {
      const orderId = uuidv4()
      
      if (data.isSubscription) {
        const checkout = await createSubscriptionCheckout({ 
          products: data.products, 
          orderId,
          customer: data.customer // Pass customer info if available
        })
        
        // Return Vipps response without modification to preserve structure
        return NextResponse.json(checkout)
      } else {
        const checkout = await createCheckout({ 
          products: data.products, 
          orderId,
          customer: data.customer // Pass customer info if available
        })
        
        // Return Vipps response without modification to preserve structure
        return NextResponse.json(checkout)
      }
    } 
    
    // Handle direct checkout (non-Vipps)
    const order = await processCheckout(data as CheckoutData)
    
    return NextResponse.json({
      success: true,
      orderId: order.id
    })
  } catch (error) {
    console.error('Guest checkout failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Checkout failed' 
      },
      { status: 500 }
    )
  }
} 