import { Product } from '@prisma/client';
import { Client } from '@vippsmobilepay/sdk';
import pkg from '../../package.json';
const merchantSerialNumber = process.env.VIPPS_MERCHANT_SERIAL_NUMBER!;
const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY!;
const clientId = process.env.VIPPS_CLIENT_ID!;
const clientSecret = process.env.VIPPS_CLIENT_SECRET!;
const isDevelopment = process.env.NODE_ENV === 'development';

const projectVersion = pkg.version;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

const pluginVersion = "1.0.0";

// Create a client
const client = Client({
    merchantSerialNumber,
    subscriptionKey,
    useTestMode: isDevelopment,
    retryRequests: false,
    pluginName: "Odin Chocolate",
    pluginVersion: pluginVersion,
    systemName: "Odin Chocolate",
    systemVersion: projectVersion,
});

async function getAccessToken() {
    const token = await client.auth.getToken(clientId, clientSecret);
    if (token.ok) {
        return token.data.access_token;
    }
    throw new Error('Failed to get access token');
}

// Helper function to safely get a number from price
function getPriceValue(price: number | { toNumber: () => number } | unknown): number {
    if (typeof price === 'number') {
        return price;
    }
    
    // Check if it has a toNumber method
    if (price !== null && 
        typeof price === 'object' && 
        'toNumber' in (price as object) && 
        typeof (price as { toNumber: unknown }).toNumber === 'function') {
        return (price as { toNumber: () => number }).toNumber();
    }
    
    return Number(price);
}

export async function createCheckout({
    products,
    isShipping = false,
    orderId,
    userFlow = 'WEB_REDIRECT',
    customer
}: {
    products: Product[]
    isShipping?: boolean
    orderId: string
    userFlow?: 'WEB_REDIRECT' | 'NATIVE_REDIRECT'
    customer?: {
        email: string
        firstName: string
        lastName: string
        phoneNumber: string
    }
}) {

    const accessToken = await getAccessToken();
    const totalAmount = products.reduce((acc, product) => acc + getPriceValue(product.price), 0);
    const taxRate = 0.15;

    // Create request object compatible with the expected type
    const checkout = await client.checkout.create(
        clientId,
        clientSecret, 
        {
            merchantInfo: {
                callbackUrl: `${baseUrl}/api/vipps/callback`,
                returnUrl: `${baseUrl}/order/${orderId}/success`,
                callbackAuthorizationToken: accessToken,
            },
            configuration: {
                userFlow: userFlow,
                showOrderSummary: true,
                requireUserInfo: true,
            },
            prefillCustomer: {
                email: customer?.email,
                firstName: customer?.firstName,
                lastName: customer?.lastName,
                phoneNumber: customer?.phoneNumber,
            },
            logistics: {
                fixedOptions: [
                    {
                        brand: 'POSTNORD',
                        id: 'POSTNORD',
                        isDefault: true,
                        priority: 1,
                        title: 'PostNord',
                        amount: {
                            currency: 'NOK',
                            value: 111,
                        },
                        description: 'PostNord',
                    }
                ]
            },
            transaction: {
                reference: orderId,
                amount: {
                    currency: 'NOK',
                    value: Math.round(totalAmount), // Ensure this is an integer
                },
                orderSummary: {
                    orderLines: products.map((product) => {
                        const price = Math.round(getPriceValue(product.price));
                        // Make sure these values are integers
                        const priceExcludingTax = Math.round(price / (1 + taxRate));
                        const taxAmount = price - priceExcludingTax;
                        
                        return {
                            id: product.id,
                            name: product.name,
                            taxRate: Math.round(taxRate * 100), // Convert to percentage as integer
                            totalAmount: price,
                            totalAmountExcludingTax: priceExcludingTax, 
                            totalTaxAmount: taxAmount,
                            productUrl: `${baseUrl}/product/${product.id}`,
                            isShipping: isShipping,
                            unitInfo: {
                                quantity: '1',
                                quantityUnit: 'PCS',
                                unitPrice: price,
                            }
                        };
                    }),
                    orderBottomLine: {
                        currency: 'NOK',
                    }
                },
                paymentDescription: 'Betaling for varer',
            },
            type: 'PAYMENT' as const // Use const assertion to ensure it's of the literal type
        }
    );
    
    return checkout;
}

export async function createSubscriptionCheckout({
    products,
    isShipping = false,
    interval = 'MONTH',
    intervalCount = 1,
    orderId,
    userFlow = 'WEB_REDIRECT',
    customer
}: {
    products: Product[]
    isShipping?: boolean
    interval?: 'MONTH' | 'YEAR'
    intervalCount?: number
    orderId: string
    userFlow?: 'WEB_REDIRECT' | 'NATIVE_REDIRECT'
    customer?: {
        email: string
        firstName: string
        lastName: string
        phoneNumber: string
    }
}) {

    const accessToken = await getAccessToken();
    const totalAmount = Math.round(products.reduce((acc, product) => acc + getPriceValue(product.price), 0));
    const taxRate = 0.15;

    const checkout = await client.checkout.create(
        clientId,
        clientSecret, 
        {
            configuration: {
                userFlow: userFlow,
                showOrderSummary: true,
                requireUserInfo: true,
            },
            prefillCustomer: {
                email: customer?.email,
                firstName: customer?.firstName,
                lastName: customer?.lastName,
                phoneNumber: customer?.phoneNumber,
            },
            subscription: {
                merchantAgreementUrl: `${baseUrl}/account/subscriptions`,
                productName: 'Abonnement',
                campaign: {
                    type: 'EVENT',
                    end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                    eventDate: new Date().toISOString(),
                    eventText: 'Første betaling',
                    period: {
                        count: intervalCount,
                        unit: interval
                    },
                    price: totalAmount,
                },
                amount: {
                    currency: 'NOK',
                    value: totalAmount,
                },
                interval: {
                    count: intervalCount,
                    unit: interval,
                }
            },
            merchantInfo: {
                callbackUrl: `${baseUrl}/api/vipps/callback`,
                returnUrl: `${baseUrl}/order/${orderId}/success`,
                callbackAuthorizationToken: accessToken,
            },
            transaction: {
                reference: orderId,
                amount: {
                    currency: 'NOK',
                    value: totalAmount,
                },
                orderSummary: {
                    orderLines: products.map((product) => {
                        const price = Math.round(getPriceValue(product.price));
                        // Make sure these values are integers
                        const priceExcludingTax = Math.round(price / (1 + taxRate));
                        const taxAmount = price - priceExcludingTax;
                        
                        return {
                            id: product.id,
                            name: product.name,
                            taxRate: Math.round(taxRate * 100),
                            totalAmount: price,
                            totalAmountExcludingTax: priceExcludingTax,
                            totalTaxAmount: taxAmount,
                            productUrl: `${baseUrl}/product/${product.id}`,
                            isShipping: isShipping,
                            unitInfo: {
                                quantity: '1',
                                quantityUnit: 'PCS',
                                unitPrice: price,
                            }
                        };
                    }),
                    orderBottomLine: {
                        currency: 'NOK',
                    }
                },
                paymentDescription: 'Betaling for varer',
            },
            type: 'SUBSCRIPTION' as const // Use const assertion
        }
    );
    return checkout;
}

export async function getCheckout(orderId: string) {
    const checkout = await client.checkout.info(clientId, clientSecret, orderId);
    return checkout;
}