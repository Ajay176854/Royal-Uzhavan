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
                {cartItems.map((item, index) => {
                  const variantMultiplier = item.selectedVariant;
                  const currentPrice = item.price * (variantMultiplier / (item.variants[0] || 1));
                  const total = currentPrice * item.quantity;

                  return (
                    <div key={index} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center gap-4 w-full">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-[#0B4D26]"><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                          <p className="text-sm text-gray-500 mt-1">Bag Size: {item.selectedVariant}kg</p>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center hidden md:block font-medium">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </div>
                      
                      <div className="col-span-2 flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-gray-300 rounded-lg h-10 w-32 bg-white">
                          <button className="px-3 h-full text-gray-500 hover:text-[#0B4D26]"><Minus className="w-4 h-4" /></button>
                          <span className="flex-1 text-center font-bold text-gray-900">{item.quantity}</span>
                          <button className="px-3 h-full text-gray-500 hover:text-[#0B4D26]"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                        <div className="md:hidden font-bold">Total:</div>
                        <div className="font-bold text-lg text-[#0B4D26]">₹{total.toLocaleString('en-IN')}</div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
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
