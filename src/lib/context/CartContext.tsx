"use client"

import { createContext, useContext, useReducer, useEffect } from 'react'
import { Product } from '@prisma/client'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  isSubscription: boolean
  frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
  collectionId?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: { id: string; isSubscription: boolean; frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' } }
  | { type: 'CLEAR_CART' }

interface CartContextType {
  state: CartState
  addItem: (product: Product, quantity: number, isSubscription?: boolean, frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY', collectionId?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateSubscription: (id: string, isSubscription: boolean, frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY') => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.productId === action.payload.productId && 
        item.isSubscription === action.payload.isSubscription &&
        item.frequency === action.payload.frequency &&
        item.collectionId === action.payload.collectionId
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId &&
            item.isSubscription === action.payload.isSubscription &&
            item.frequency === action.payload.frequency &&
            item.collectionId === action.payload.collectionId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity * (action.payload.isSubscription ? 0.9 : 1))
        }
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + (action.payload.price * action.payload.quantity * (action.payload.isSubscription ? 0.9 : 1))
      }
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return state
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity * (item.isSubscription ? 0.9 : 1))
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return state
      
      const quantityDiff = action.payload.quantity - item.quantity
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff * (item.isSubscription ? 0.9 : 1))
      }
    }

    case 'UPDATE_SUBSCRIPTION': {
      const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return state

      const oldTotal = item.price * item.quantity * (item.isSubscription ? 0.9 : 1)
      const newTotal = item.price * item.quantity * (action.payload.isSubscription ? 0.9 : 1)

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, isSubscription: action.payload.isSubscription, frequency: action.payload.frequency }
            : item
        ),
        total: state.total - oldTotal + newTotal
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      }
    
    default:
      return state
  }
}

const CART_STORAGE_KEY = 'odinnext_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      const { items } = JSON.parse(savedCart)
      dispatch({ type: 'CLEAR_CART' })
      items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item })
      })
    }
  }, [])

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = (
    product: Product, 
    quantity: number, 
    isSubscription: boolean = false, 
    frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
    collectionId?: string
  ) => {
    const cartItem: CartItem = {
      id: `${product.id}_${Date.now()}`, // Unique ID for cart item
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.images[0],
      isSubscription,
      frequency,
      collectionId
    }
    dispatch({ type: 'ADD_ITEM', payload: cartItem })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const updateSubscription = (id: string, isSubscription: boolean, frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY') => {
    dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: { id, isSubscription, frequency } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateSubscription,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 