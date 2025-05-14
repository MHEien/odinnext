export interface Address {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  
  export interface PaymentMethod {
    type: 'card'
    cardBrand: string
    last4: string
    expiryMonth: number
    expiryYear: number
  }
  
  export interface CheckoutData {
    items: {
      productId: string
      quantity: number
      price: number
    }[]
    total: number
    shippingAddress: Address
    billingAddress: Address
    paymentMethod: PaymentMethod
  }