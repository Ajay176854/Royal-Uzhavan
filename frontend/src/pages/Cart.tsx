import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  const subtotal = cartTotal;

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">Your Cart</h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="bg-[#0B4D26] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#07361a] transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 font-bold text-sm uppercase tracking-wider text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => {
                  const total = item.price * item.quantity;

                  return (
                    <div key={`${item.productId}-${item.selectedVariant}`} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center gap-4 w-full">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-[#0B4D26]"><Link to={`/product/${item.productId}`}>{item.name}</Link></h3>
                          <p className="text-sm text-gray-500 mt-1">Bag Size: {item.selectedVariant}</p>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center hidden md:block font-medium">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                      
                      <div className="col-span-2 flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-gray-300 rounded-lg h-10 w-32 bg-white">
                          <button onClick={() => updateQuantity(item.productId, item.selectedVariant, item.quantity - 1)} className="px-3 h-full text-gray-500 hover:text-[#0B4D26]"><Minus className="w-4 h-4" /></button>
                          <span className="flex-1 text-center font-bold text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.selectedVariant, item.quantity + 1)} className="px-3 h-full text-gray-500 hover:text-[#0B4D26]"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                        <div className="md:hidden font-bold">Total:</div>
                        <div className="font-bold text-lg text-[#0B4D26]">₹{total.toLocaleString('en-IN')}</div>
                        <button onClick={() => removeFromCart(item.productId, item.selectedVariant)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (Estimated)</span>
                  <span className="font-medium text-gray-900">₹{(subtotal * 0.05).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#0B4D26]">₹{(subtotal * 1.05).toLocaleString('en-IN')}</span>
              </div>

              <Link to="/checkout" className="w-full bg-[#0B4D26] hover:bg-[#07361a] text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors shadow-md mb-4">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <ShieldCheck className="w-4 h-4" /> Secure checkout powered by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
