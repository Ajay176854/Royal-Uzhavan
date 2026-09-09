import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface CartItem {
  cartItemId: string;      // DB cart_items.id — used for PUT/DELETE
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant: number;
  originalPrice?: number;
  variants?: number[];
  in_stock?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, setIsAuthOpen } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  // Fetch cart from backend when user logs in
  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: CartItem[] = data.items.map((item: any) => ({
          cartItemId: item.cart_item_id,
          productId: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          image: item.image,
          quantity: item.quantity,
          selectedVariant: item.selected_variant,
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          variants: item.variants,
          in_stock: item.in_stock,
        }));
        setItems(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync cart when auth state changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isLoggedIn, fetchCart]);

  const addToCart = async (newItem: Omit<CartItem, 'cartItemId'>) => {
    // If not logged in, open auth drawer
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: newItem.productId,
          quantity: newItem.quantity,
          selectedVariant: newItem.selectedVariant,
        }),
      });

      if (res.ok) {
        // Refetch full cart to get accurate state
        await fetchCart();
        setIsCartOpen(true);
      } else {
        const data = await res.json();
        console.error('Failed to add to cart:', data.error);
      }
    } catch (err) {
      console.error('Cart add error:', err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const token = getToken();
    if (!token) return;

    // Optimistic update
    const prevItems = [...items];
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));

    try {
      const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove');
    } catch (err) {
      console.error('Cart remove error:', err);
      setItems(prevItems); // Revert
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const token = getToken();
    if (!token) return;

    // Optimistic update
    const prevItems = [...items];
    setItems(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ));

    try {
      const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      console.error('Cart update error:', err);
      setItems(prevItems); // Revert
    }
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    const prevItems = [...items];
    setItems([]);

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to clear');
    } catch (err) {
      console.error('Cart clear error:', err);
      setItems(prevItems);
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => {
    const variantMultiplier = item.selectedVariant;
    const baseVariant = item.variants?.[0] || 1;
    const effectivePrice = item.price * (variantMultiplier / baseVariant);
    return sum + effectivePrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal, isCartOpen, setIsCartOpen, isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
