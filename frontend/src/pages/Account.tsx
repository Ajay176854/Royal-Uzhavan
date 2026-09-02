import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, LogOut, Heart, Mail, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Account() {
  const { user, isLoggedIn, login, logout, isLoading } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const navigate = useNavigate();
  
  // Auth Form State
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const endpoint = isLoginView ? '/auth/login' : '/auth/signup';
      const body = isLoginView 
        ? { email, password }
        : { name, email, password, phone };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
      </div>
    );
  }

  // Not logged in -> Show Login/Signup Form
  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 text-center bg-[#1B4332] text-white">
            <h1 className="text-3xl font-playfair font-bold mb-2">
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-green-100/80 text-sm">
              {isLoginView ? 'Sign in to access your orders and wishlist.' : 'Join Royal Uzhavan today!'}
            </p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginView && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                    placeholder="••••••••"
                  />
                </div>
                {!isLoginView && (
                  <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters.</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#86B841] text-white font-bold py-3 rounded-lg hover:bg-[#729c36] transition-colors mt-6 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Please wait...' : (isLoginView ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-gray-600 text-sm">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLoginView(!isLoginView)}
                  className="ml-2 text-[#1B4332] font-bold hover:underline"
                >
                  {isLoginView ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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
                              <span className="block text-sm text-gray-500 mb-1">Order #{order.id.split('-')[0].toUpperCase()}</span>
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
                            <div className="flex items-center gap-3 w-full md:w-auto">
                              <button className="flex-1 md:flex-none border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-50">Track</button>
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
