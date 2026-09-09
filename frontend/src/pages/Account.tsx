import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, LogOut, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Account() {
  const { user, isLoggedIn, logout, isLoading, setIsAuthOpen } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const navigate = useNavigate();

  // Dynamic Data State
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return;
      setIsFetchingData(true);
      
      const token = localStorage.getItem('token');
      
      try {
        // Fetch Orders
        const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }

        // Fetch Wishlist Products
        if (wishlist.length > 0) {
          const productPromises = wishlist.map(id => 
            fetch(`${API_URL}/products/${id}`).then(res => res.ok ? res.json() : null)
          );
          const results = await Promise.all(productPromises);
          const validProducts = results
            .filter(r => r && r.product)
            .map(r => r.product);
          setWishlistProducts(validProducts);
        } else {
          setWishlistProducts([]);
        }

      } catch (err) {
        console.error("Failed to fetch account data", err);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isLoggedIn, wishlist]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/');
      setIsAuthOpen(true);
    }
  }, [isLoading, isLoggedIn, navigate, setIsAuthOpen]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
      </div>
    );
  }

  // Not logged in -> handled by useEffect redirect
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-[#1B4332] text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h2 className="font-bold text-lg">{user?.name}</h2>
                <p className="text-green-100/80 text-sm truncate">{user?.email}</p>
                {user?.phone && <p className="text-green-100/60 text-xs mt-1">{user.phone}</p>}
              </div>
              <nav className="flex flex-col p-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'orders' ? 'bg-green-50 text-[#1B4332]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1B4332]'}`}
                >
                  <Package className="w-5 h-5" /> Order History
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'wishlist' ? 'bg-green-50 text-[#1B4332]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1B4332]'}`}
                >
                  <Heart className="w-5 h-5" /> Wishlist ({wishlist.length})
                </button>
                <div className="my-2 border-t border-gray-100"></div>
                <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-bold transition-colors w-full text-left">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              
              {isFetchingData ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
                </div>
              ) : activeTab === 'orders' ? (
                <>
                  <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Recent Orders</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p>You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order: any) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <span className="block text-sm text-gray-500 mb-1">Order {order.order_number || `#${order.id.split('-')[0].toUpperCase()}`}</span>
                              <span className="font-bold text-gray-900">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="block text-sm text-gray-500 mb-1">Total</span>
                              <span className="font-bold text-[#1B4332]">₹{Number(order.total).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div>
                                <h4 className="font-bold text-gray-900 capitalize text-sm mb-2 text-[#0B4D26] bg-[#0B4D26]/10 px-3 py-1 rounded inline-block">
                                  {order.status}
                                </h4>
                                <p className="text-gray-500 text-sm">Payment: {order.payment_method.toUpperCase()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">My Wishlist</h2>
                  {wishlistProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
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
