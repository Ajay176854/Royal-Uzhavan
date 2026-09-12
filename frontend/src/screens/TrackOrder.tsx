'use client';
import React, { useState } from 'react';
import { Package, Search, MapPin, CheckCircle2, Circle, Truck } from 'lucide-react';

export default function TrackOrder() {
  const [isSearched, setIsSearched] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID and phone number to see the current status of your delivery.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 mb-12">
          <form 
            className="flex flex-col md:flex-row gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSearched(true);
            }}
          >
            <input 
              type="text" 
              placeholder="Order ID (e.g. RU-12345)" 
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]"
              required
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]"
              required
            />
            <button 
              type="submit" 
              className="bg-[#0B4D26] hover:bg-[#07361a] text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" /> Track
            </button>
          </form>
        </div>

        {isSearched && (
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-1">Order #RU-98242</h3>
                <p className="text-gray-500">Estimated Delivery: Aug 18, 2026</p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
                  In Transit
                </span>
              </div>
            </div>

            <div className="relative pl-8 space-y-10 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500 before:via-gray-200 before:to-gray-200">
              
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 -ml-4 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="font-bold text-gray-900">Order Placed</h4>
                  <p className="text-sm text-gray-500">Aug 15, 2026 - 10:30 AM</p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-6 md:flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 -ml-4 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="md:w-1/2 md:pl-12 text-left">
                  <h4 className="font-bold text-gray-900">Processing & Packed</h4>
                  <p className="text-sm text-gray-500">Aug 16, 2026 - 02:15 PM</p>
                  <p className="text-sm text-gray-600 mt-1">Quality check passed and packed at Thanjavur Facility.</p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-6">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 -ml-4 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="font-bold text-gray-900">In Transit</h4>
                  <p className="text-sm text-gray-500">Aug 17, 2026 - 08:45 AM</p>
                  <p className="text-sm text-gray-600 mt-1">Dispatched from regional hub. Heading to your location.</p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-6 md:flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center shrink-0 -ml-4 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="md:w-1/2 md:pl-12 text-left">
                  <h4 className="font-bold text-gray-400">Out for Delivery</h4>
                  <p className="text-sm text-gray-400">Pending</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

