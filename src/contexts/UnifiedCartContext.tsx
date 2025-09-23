'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Merchandise types (from existing context)
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

export interface MerchandiseCartItem extends MerchandiseItem {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  cartItemId: string;
  type: 'merchandise';
}

// Ticket types
export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  total: number;
  description: string;
}

export interface TicketCartItem {
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  seats: string[];
  eventId: string;
  eventName: string;
  cartItemId: string;
  type: 'ticket';
}

// Unified cart item type
export type UnifiedCartItem = MerchandiseCartItem | TicketCartItem;

interface UnifiedCartContextType {
  // Cart items
  cartItems: UnifiedCartItem[];

  // Merchandise methods
  addMerchandiseToCart: (item: MerchandiseItem, quantity: number, size?: string, color?: string) => void;

  // Ticket methods
  addTicketToCart: (ticketType: TicketType, quantity: number, eventId: string, eventName: string, seats?: string[]) => void;

  // Unified methods
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  clearMerchandiseCart: () => void;
  clearTicketCart: () => void;

  // Getters
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getMerchandiseItems: () => MerchandiseCartItem[];
  getTicketItems: () => TicketCartItem[];
  getMerchandiseTotal: () => number;
  getTicketTotal: () => number;
  getMerchandiseCount: () => number;
  getTicketCount: () => number;
}

const UnifiedCartContext = createContext<UnifiedCartContextType | undefined>(undefined);

export function UnifiedCartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<UnifiedCartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('giveback-unified-cart');
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
    localStorage.setItem('giveback-unified-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addMerchandiseToCart = (item: MerchandiseItem, quantity: number, size?: string, color?: string) => {
    const cartItemId = `merch_${item.id}_${size || 'no-size'}_${color || 'no-color'}_${Date.now()}`;

    const cartItem: MerchandiseCartItem = {
      ...item,
      quantity,
      selectedSize: size,
      selectedColor: color,
      cartItemId,
      type: 'merchandise',
    };

    setCartItems(prev => [...prev, cartItem]);
  };

  const addTicketToCart = (ticketType: TicketType, quantity: number, eventId: string, eventName: string, seats: string[] = []) => {
    const cartItemId = `ticket_${ticketType.id}_${eventId}_${Date.now()}`;

    const cartItem: TicketCartItem = {
      ticketTypeId: ticketType.id,
      ticketTypeName: ticketType.name,
      price: ticketType.price,
      quantity,
      seats,
      eventId,
      eventName,
      cartItemId,
      type: 'ticket',
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

  const clearMerchandiseCart = () => {
    setCartItems(prev => prev.filter(item => item.type !== 'merchandise'));
  };

  const clearTicketCart = () => {
    setCartItems(prev => prev.filter(item => item.type !== 'ticket'));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getMerchandiseItems = (): MerchandiseCartItem[] => {
    return cartItems.filter(item => item.type === 'merchandise') as MerchandiseCartItem[];
  };

  const getTicketItems = (): TicketCartItem[] => {
    return cartItems.filter(item => item.type === 'ticket') as TicketCartItem[];
  };

  const getMerchandiseTotal = () => {
    return getMerchandiseItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTicketTotal = () => {
    return getTicketItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getMerchandiseCount = () => {
    return getMerchandiseItems().reduce((count, item) => count + item.quantity, 0);
  };

  const getTicketCount = () => {
    return getTicketItems().reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <UnifiedCartContext.Provider
      value={{
        cartItems,
        addMerchandiseToCart,
        addTicketToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearMerchandiseCart,
        clearTicketCart,
        getCartTotal,
        getCartItemCount,
        getMerchandiseItems,
        getTicketItems,
        getMerchandiseTotal,
        getTicketTotal,
        getMerchandiseCount,
        getTicketCount,
      }}
    >
      {children}
    </UnifiedCartContext.Provider>
  );
}

export function useUnifiedCart() {
  const context = useContext(UnifiedCartContext);
  if (context === undefined) {
    throw new Error('useUnifiedCart must be used within a UnifiedCartProvider');
  }
  return context;
}