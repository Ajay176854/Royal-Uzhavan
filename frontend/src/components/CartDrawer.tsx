import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-[100] flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-playfair font-bold text-gray-900">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>Your cart is currently empty.</p>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }} 
                className="mt-6 bg-[#0B4D26] text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#07361a] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const total = item.price * item.quantity;

              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight hover:text-[#0B4D26]">
                        <Link to={`/product/${item.productId}`} onClick={() => setIsCartOpen(false)}>
                          {item.name}
                        </Link>
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">Variant: {item.selectedVariant}kg/L</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg h-8 w-24 bg-white">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.selectedVariant, item.quantity - 1)}
                          className="px-2 h-full text-gray-500 hover:text-[#0B4D26]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.selectedVariant, item.quantity + 1)}
                          className="px-2 h-full text-gray-500 hover:text-[#0B4D26]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="font-bold text-[#0B4D26]">
                        ₹{total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-[#0B4D26]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">Taxes and shipping calculated at checkout.</p>
            
            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/cart');
              }}
              className="w-full bg-[#0B4D26] hover:bg-[#07361a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              Go To Cart <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
