import React from 'react';
import { User, Package, MapPin, Repeat, LogOut, Heart } from 'lucide-react';

export default function Account() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-[#0B4D26] text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="font-bold text-lg">Karthik R.</h2>
                <p className="text-green-100 text-sm">karthik@example.com</p>
              </div>
              <nav className="flex flex-col p-2">
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 text-[#0B4D26] font-bold">
                  <Package className="w-5 h-5" /> Order History
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#0B4D26] font-medium transition-colors">
                  <Repeat className="w-5 h-5" /> Subscriptions
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#0B4D26] font-medium transition-colors">
                  <MapPin className="w-5 h-5" /> Saved Addresses
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#0B4D26] font-medium transition-colors">
                  <Heart className="w-5 h-5" /> Wishlist
                </a>
                <div className="my-2 border-t border-gray-100"></div>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Recent Orders</h2>
              
              <div className="space-y-6">
                {[1, 2].map(order => (
                  <div key={order} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="block text-sm text-gray-500 mb-1">Order #RU-9824{order}</span>
                        <span className="font-bold text-gray-900">Placed on 15 Aug 2026</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="block text-sm text-gray-500 mb-1">Total</span>
                        <span className="font-bold text-[#0B4D26]">₹4,250</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0"></div>
                        <div>
                          <h4 className="font-bold text-gray-900">Premium Dairy Cattle Feed</h4>
                          <p className="text-gray-500 text-sm">Qty: 2 • 50kg Bags</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-50">Track</button>
                        <button className="flex-1 md:flex-none bg-[#0B4D26] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#07361a]">Reorder</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
