import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const { 
            orderId,
            shippingDetails,
            billingDetails
        } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const updateData: Prisma.OrderUpdateInput = {};

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
                        country: shippingDetails.country || ""
                    }
                });
                updateData.shippingAddress = { connect: { id: shippingAddress.id } };
            } catch (error) {
                console.error('Failed to create shipping address:', error);
                return NextResponse.json({ 
                    error: 'Failed to create shipping address',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }, { status: 500 });
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
                        country: billingDetails.country || ""
                    }
                });
                updateData.billingAddress = { connect: { id: billingAddress.id } };
            } catch (error) {
                console.error('Failed to create billing address:', error);
                return NextResponse.json({ 
                    error: 'Failed to create billing address',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }, { status: 500 });
            }
        }

        // Update order with address connections
        if (Object.keys(updateData).length > 0) {
            await prisma.order.update({
                where: { id: orderId },
                data: updateData
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Order addresses updated successfully' 
        });
    } catch (error) {
        console.error('Update address error:', error instanceof Error ? error.message : error);
        return NextResponse.json({ 
            error: 'Failed to update order addresses',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 