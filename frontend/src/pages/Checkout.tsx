import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Checkout() {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex flex-col items-center">
              <span className="text-[#C9A227] font-playfair font-bold text-sm tracking-widest leading-none mb-1">ROYAL</span>
              <div className="bg-[#0B4D26] text-white px-3 py-1 rounded-sm">
                <span className="font-bold text-2xl leading-none">உழவன்</span>
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Step 1: Address */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 1 ? 'border-[#0B4D26] ring-1 ring-[#0B4D26]' : 'border-gray-100'} p-6 md:p-8`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 1 ? 'bg-[#0B4D26] text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
                  Delivery Address
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-[#0B4D26] font-bold text-sm">Edit</button>
                )}
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <input type="text" placeholder="Flat, House no., Building, Company, Apartment" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <input type="text" placeholder="Area, Street, Sector, Village" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Town/City" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="text" placeholder="PIN Code" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-[#0B4D26] text-white font-bold py-4 rounded-xl mt-4"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 2 ? 'border-[#0B4D26] ring-1 ring-[#0B4D26]' : 'border-gray-100'} p-6 md:p-8`}>
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-[#0B4D26] text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
                Payment Method
              </h2>
              
              {step === 2 && (
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="text-[#0B4D26] focus:ring-[#0B4D26]" defaultChecked />
                      <span className="font-medium text-gray-900">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="text-[#0B4D26] focus:ring-[#0B4D26]" />
                      <span className="font-medium text-gray-900">Credit / Debit Card</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="text-[#0B4D26] focus:ring-[#0B4D26]" />
                      <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                    </div>
                  </label>
                  
                  <button 
                    className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Lock className="w-5 h-5" /> Place Order • ₹8,200
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="w-full lg:w-96 shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0"></div>
                    <div>
                      <h4 className="font-bold">Premium Dairy Cattle Feed</h4>
                      <p className="text-gray-500">50kg × 2</p>
                    </div>
                    <div className="ml-auto font-bold">₹7,250</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0"></div>
                    <div>
                      <h4 className="font-bold">Mineral Block Supplement</h4>
                      <p className="text-gray-500">5kg × 1</p>
                    </div>
                    <div className="ml-auto font-bold">₹2,250</div>
                  </div>
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">₹9,500</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-green-600">Free</span></div>
                </div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0B4D26]">₹9,500</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
