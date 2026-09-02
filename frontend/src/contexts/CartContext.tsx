import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data';

export interface CartItem extends Product {
  quantity: number;
  selectedVariant: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity: number, variant: number) => void;
  removeFromCart: (productId: string, variant: number) => void;
  updateQuantity: (productId: string, variant: number, quantity: number) => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, quantity: number, variant: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.selectedVariant === variant);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedVariant: variant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variant: number) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedVariant === variant)));
  };

  const updateQuantity = (productId: string, variant: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === productId && item.selectedVariant === variant
        ? { ...item, quantity }
        : item
    ));
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((total, item) => {
    const variantMultiplier = item.selectedVariant;
    const currentPrice = item.price * (variantMultiplier / (item.variants[0] || 1));
    return total + currentPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      cartCount, 
      cartSubtotal,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
