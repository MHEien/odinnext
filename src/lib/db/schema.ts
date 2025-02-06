export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
} 