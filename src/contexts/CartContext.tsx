import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem } from '../types/pizzeria';

export type CartDrawerTab = 'order' | 'schedule';

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalCents: number;
  isCartOpen: boolean;
  activeTab: CartDrawerTab;
  setActiveTab: (tab: CartDrawerTab) => void;
  setIsCartOpen: (open: boolean) => void;
  openCart: (tab?: CartDrawerTab) => void;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  replaceItem: (cartItemId: string, updated: Omit<CartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  restaurantSlug,
  children,
}: {
  restaurantSlug: string;
  children: React.ReactNode;
}) {
  const storageKey = `forneria_cart_${restaurantSlug || 'default'}`;

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CartDrawerTab>('order');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [items, storageKey]);

  const openCart = useCallback((tab: CartDrawerTab = 'order') => {
    setActiveTab(tab);
    setIsCartOpen(true);
  }, []);

  const addItem = useCallback((newItem: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev, { ...newItem, cartItemId }]);
  }, []);

  const replaceItem = useCallback(
    (cartItemId: string, updated: Omit<CartItem, 'cartItemId'>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...updated, cartItemId } : item
        )
      );
    },
    []
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalCents,
        isCartOpen,
        activeTab,
        setActiveTab,
        setIsCartOpen,
        openCart,
        addItem,
        replaceItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
