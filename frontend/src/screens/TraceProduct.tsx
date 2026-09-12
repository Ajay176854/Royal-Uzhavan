'use client';
import React from 'react';
import { CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';

export default function TraceProduct() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">Trace Your Product</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparency is at the heart of Royal Uzhavan. Enter your batch code to see exactly where your feed came from, when it was milled, and its quality journey.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-center mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0B4D26] to-[#C9A227]" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Batch Code</h2>
          <form className="max-w-md mx-auto flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert("Tracing not active in demo mode."); }}>
            <input 
              type="text" 
              placeholder="e.g. RU-2026-A14" 
              className="w-full text-center text-xl tracking-widest px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0B4D26] focus:ring-0 uppercase font-medium"
            />
            <button type="submit" className="w-full bg-[#0B4D26] hover:bg-[#07361a] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md">
              Trace Origin
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4">You can find the 10-digit batch code on the back of the bag.</p>
        </div>

        {/* Demo Result (Static for now to show layout) */}
        <div className="opacity-50 pointer-events-none">
          <h3 className="text-center text-gray-500 font-bold tracking-widest uppercase mb-8">Example Trace Result</h3>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 bg-gray-100 rounded-xl aspect-square overflow-hidden">
                <img src="https://images.unsplash.com/photo-1596733430284-f74372763f03?auto=format&fit=crop&q=80" alt="Farm" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-1">Thanjavur Delta Farm</h3>
                  <p className="text-[#0B4D26] font-medium">Batch: RU-2026-A14 • Premium Dairy Feed</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm text-gray-500 mb-1">Harvest Date</span>
                    <span className="font-bold text-gray-900">12 August 2026</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm text-gray-500 mb-1">Milled Date</span>
                    <span className="font-bold text-gray-900">15 August 2026</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Quality Checks Passed</h4>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" /> <span>Aflatoxin Free</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <ShieldCheck className="w-5 h-5" /> <span>Nutrient Profile Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <Leaf className="w-5 h-5" /> <span>100% Organic Ingredients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

