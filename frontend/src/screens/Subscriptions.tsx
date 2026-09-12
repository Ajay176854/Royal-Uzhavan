'use client';
import React from 'react';
import { Check, Repeat, Truck, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Subscriptions() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0B4D26] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 leading-tight">
            Never Run Out of Feed Again
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-10">
            Join the Royal Uzhavan Subscription program. Get premium feed delivered directly to your farm on your schedule, and save on every order.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 font-bold px-8 py-4 rounded-full transition-transform hover:scale-105">
              Browse Subscribable Products
            </Link>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-16 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#0B4D26]/10 rounded-full flex items-center justify-center text-[#0B4D26] mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">1. Select Your Feed</h3>
              <p className="text-gray-600">Choose the specific feed and bag sizes your livestock needs from our shop.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#0B4D26]/10 rounded-full flex items-center justify-center text-[#0B4D26] mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">2. Set the Schedule</h3>
              <p className="text-gray-600">Choose delivery every 1, 2, 3, or 4 weeks depending on your farm's consumption rate.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#0B4D26]/10 rounded-full flex items-center justify-center text-[#0B4D26] mb-6">
                <Repeat className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">3. Relax & Save</h3>
              <p className="text-gray-600">Enjoy automated deliveries and an automatic 10% discount on all subscription orders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 border-b md:border-b-0 md:border-r border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">One-Time Purchase</h3>
                <p className="text-gray-500 mb-8">For occasional needs.</p>
                <div className="text-4xl font-bold text-gray-900 mb-8">Standard Price</div>
                <ul className="space-y-4 mb-8 text-gray-700">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400" /> Standard Delivery</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400" /> Manual reordering</li>
                </ul>
              </div>
              <div className="p-10 bg-[#0B4D26] text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#C9A227] text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Recommended
                </div>
                <h3 className="text-2xl font-bold mb-2">Subscribe & Save</h3>
                <p className="text-green-100 mb-8">For serious farmers.</p>
                <div className="text-4xl font-bold text-[#C9A227] mb-8">10% Off Every Order</div>
                <ul className="space-y-4 mb-8 text-white">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#C9A227]" /> 10% discount locked in</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#C9A227]" /> Priority stock allocation</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#C9A227]" /> Cancel or pause anytime</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#C9A227]" /> Dedicated farm support</li>
                </ul>
                <Link href="/shop" className="block w-full bg-white text-[#0B4D26] text-center font-bold py-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Start Subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


