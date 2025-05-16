import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'edge';

async function checkOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    return order;
  } catch (error) {
    console.error('Error checking order:', error);
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id;

  if (!orderId) {
    return new Response('Order ID is required', { status: 400 });
  }

  // Set up Server-Sent Events headers
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  try {
    // Initial order check
    let order = await checkOrder(orderId);
    
    if (order) {
      // Order exists, send it immediately
      const data = `data: ${JSON.stringify({ type: 'order_update', data: order })}\n\n`;
      await writer.write(encoder.encode(data));
    } else {
      // Order doesn't exist yet, send waiting status
      const data = `data: ${JSON.stringify({ type: 'waiting_for_order' })}\n\n`;
      await writer.write(encoder.encode(data));
    }

    // Poll for order creation/updates every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const updatedOrder = await checkOrder(orderId);
        
        if (updatedOrder) {
          // If this is the first time we found the order, or if the order status has changed
          if (!order || order.status !== updatedOrder.status) {
            const data = `data: ${JSON.stringify({ type: 'order_update', data: updatedOrder })}\n\n`;
            await writer.write(encoder.encode(data));
            order = updatedOrder;
          }
        }
      } catch (error) {
        console.error('Order polling error:', error);
      }
    }, 2000);

    // Keep connection alive with periodic pings
    const pingInterval = setInterval(async () => {
      try {
        const data = `data: ${JSON.stringify({ type: 'ping' })}\n\n`;
        await writer.write(encoder.encode(data));
      } catch (error) {
        console.error('Order status stream error:', error);
        clearInterval(pingInterval);
      }
    }, 30000);

    // Clean up on connection close
    request.signal.addEventListener('abort', () => {
      clearInterval(pollInterval);
      clearInterval(pingInterval);
      writer.close();
    });

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Order status stream error:', error);
    return new Response('Failed to stream order status', { status: 500 });
  }
} 