import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link to="/shop" className="bg-[#1B4332] text-white px-6 py-3 rounded-lg font-bold">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedVariant}`} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.selectedVariant} kg/L</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.selectedVariant, item.quantity - 1)} className="p-2 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedVariant, item.quantity + 1)} className="p-2 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                      </div>
                      <span className="font-bold text-[#1B4332]">
                        ₹{(Number(item.price) * (item.selectedVariant / (item.variants[0] || 1)) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.selectedVariant)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 my-4"></div>
              <div className="flex justify-between mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-[#1B4332]">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="block w-full text-center bg-[#86B841] text-white font-bold py-3 rounded-lg hover:bg-[#729c36] transition-colors flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
