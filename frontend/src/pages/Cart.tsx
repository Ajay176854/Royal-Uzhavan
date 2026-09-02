import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data';

export default function Cart() {
  // Mock cart items
  const cartItems = [
    { ...PRODUCTS[0], quantity: 2, selectedVariant: 50 },
    { ...PRODUCTS[3], quantity: 1, selectedVariant: 5 },
  ];

  const subtotal = cartItems.reduce((acc, item) => {
    const variantMultiplier = item.selectedVariant;
    const currentPrice = item.price * (variantMultiplier / (item.variants[0] || 1));
    return acc + (currentPrice * item.quantity);
  }, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">Your Cart</h1>
        
        
      </div>
    </div>
  );
}
