'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'apparel' | 'accessories' | 'collectibles';
  sizes?: string[];
  colors?: string[];
}

export interface CartItem extends MerchandiseItem {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  cartItemId: string; // Unique ID for cart item (different from product ID)
}

interface MerchandiseContextType {
  cartItems: CartItem[];
  addToCart: (item: MerchandiseItem, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const MerchandiseContext = createContext<MerchandiseContextType | undefined>(undefined);

export function MerchandiseProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('giveback-merchandise-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('giveback-merchandise-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MerchandiseItem, quantity: number, size?: string, color?: string) => {
    const cartItemId = `${item.id}_${size || 'no-size'}_${color || 'no-color'}_${Date.now()}`;

    const cartItem: CartItem = {
      ...item,
      quantity,
      selectedSize: size,
      selectedColor: color,
      cartItemId,
    };

    setCartItems(prev => [...prev, cartItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <MerchandiseContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </MerchandiseContext.Provider>
  );
}

export function useMerchandise() {
  const context = useContext(MerchandiseContext);
  if (context === undefined) {
    throw new Error('useMerchandise must be used within a MerchandiseProvider');
  }
  return context;
}