import React, { useState } from 'react';
import { User, Package, MapPin, Repeat, LogOut, Heart, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';

export default function Account() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('wishlist');
  
  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
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
                {isLoggedIn && user ? (
                  <>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    <p className="text-green-100 text-sm">{user.email}</p>
                  </>
                ) : (
                  <>
                    <h2 className="font-bold text-lg">Guest User</h2>
                    <p className="text-green-100 text-sm">Not logged in</p>
                  </>
                )}
              </div>
              <nav className="flex flex-col p-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'orders' ? 'bg-gray-50 text-[#0B4D26] font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B4D26]'}`}
                >
                  <Package className="w-5 h-5" /> Order History
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'wishlist' ? 'bg-gray-50 text-[#0B4D26] font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B4D26]'}`}
                >
                  <Heart className="w-5 h-5" /> Wishlist ({wishlist.length})
                </button>
                <div className="my-2 border-t border-gray-100"></div>
                {isLoggedIn ? (
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors w-full text-left">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                ) : (
                  <button onClick={login} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#0B4D26] hover:bg-gray-50 font-medium transition-colors w-full text-left">
                    <LogIn className="w-5 h-5" /> Login (Mock)
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              
              {activeTab === 'orders' && (
                <>
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
                </>
              )}

              {activeTab === 'wishlist' && (
                <>
                  <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">My Wishlist</h2>
                  {!isLoggedIn && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
                      <strong>Note:</strong> You are browsing as a guest. Your wishlist is temporary and will be lost if you refresh the page. Please login to save your wishlist permanently.
                    </div>
                  )}
                  {wishlistProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                      <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p>Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
