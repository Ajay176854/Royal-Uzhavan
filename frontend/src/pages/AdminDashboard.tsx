import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  MessageCircle,
  LogOut,
  TrendingUp,
  Users,
  AlertCircle,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'feedbacks'>('dashboard');

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || user?.role !== 'admin') {
        navigate('/');
      } else {
        fetchData(activeTab);
      }
    }
  }, [isLoading, isLoggedIn, user, navigate, activeTab]);

  const fetchData = async (tab: string) => {
    setIsFetching(true);
    const token = localStorage.getItem('token');
    try {
      if (tab === 'dashboard') {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setStats((await res.json()).stats);
      } else if (tab === 'orders') {
        const res = await fetch(`${API_URL}/admin/orders?limit=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setOrders((await res.json()).orders);
      } else if (tab === 'feedbacks') {
        const res = await fetch(`${API_URL}/admin/feedbacks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setFeedbacks((await res.json()).feedbacks);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsFetching(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData('orders');
        alert(`Order ${orderId.split('-')[0].toUpperCase()} updated to ${status}`);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert('Failed to update status');
    }
  };

  const markFeedbackAsRead = async (feedbackId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/feedbacks/${feedbackId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData('feedbacks');
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  if (isLoading || !isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-[#C9A227] text-gray-900">
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-gray-800 text-sm">{user.email}</p>
              </div>
              <nav className="flex flex-col p-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'dashboard' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <LayoutDashboard className="w-5 h-5" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'orders' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package className="w-5 h-5" /> Orders Management
                </button>
                <button
                  onClick={() => setActiveTab('feedbacks')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'feedbacks' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <MessageCircle className="w-5 h-5" /> Contact Messages
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm min-h-[500px]">
              
              {isFetching ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
                </div>
              ) : activeTab === 'dashboard' ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-4 mb-4 text-green-800">
                        <TrendingUp className="w-8 h-8" />
                        <h3 className="font-bold text-lg">Total Revenue</h3>
                      </div>
                      <p className="text-3xl font-black text-green-900">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-4 mb-4 text-blue-800">
                        <Package className="w-8 h-8" />
                        <h3 className="font-bold text-lg">Total Orders</h3>
                      </div>
                      <p className="text-3xl font-black text-blue-900">{stats?.totalOrders || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                      <div className="flex items-center gap-4 mb-4 text-orange-800">
                        <Clock className="w-8 h-8" />
                        <h3 className="font-bold text-lg">Pending Orders</h3>
                      </div>
                      <p className="text-3xl font-black text-orange-900">{stats?.pendingOrders || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-4 mb-4 text-purple-800">
                        <Users className="w-8 h-8" />
                        <h3 className="font-bold text-lg">Total Users</h3>
                      </div>
                      <p className="text-3xl font-black text-purple-900">{stats?.totalUsers || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                      <div className="flex items-center gap-4 mb-4 text-red-800">
                        <MessageCircle className="w-8 h-8" />
                        <h3 className="font-bold text-lg">Unread Messages</h3>
                      </div>
                      <p className="text-3xl font-black text-red-900">{stats?.unreadFeedbacks || 0}</p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'orders' ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-center">
                    Recent Orders
                    <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{orders.length} orders</span>
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-lg">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 rounded-tr-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono font-medium text-gray-900">
                              #{order.id.split('-')[0].toUpperCase()}
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{order.customer_name}</p>
                              <p className="text-xs text-gray-500">{order.customer_phone}</p>
                            </td>
                            <td className="px-6 py-4 font-bold text-[#0B4D26]">
                              ₹{Number(order.total).toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                className="bg-white border border-gray-200 text-gray-900 text-xs rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26] block w-full p-2"
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>
                  <div className="space-y-4">
                    {feedbacks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No messages to display.</p>
                      </div>
                    ) : (
                      feedbacks.map((fb) => (
                        <div key={fb.id} className={`p-5 rounded-xl border ${fb.is_read ? 'bg-white border-gray-100' : 'bg-green-50 border-green-100'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{fb.name} <span className="text-sm font-normal text-gray-500">({fb.email})</span></h4>
                              <p className="text-sm font-bold text-[#0B4D26]">{fb.subject}</p>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(fb.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-gray-700 text-sm mt-3 bg-white p-4 rounded-lg border border-gray-100">{fb.message}</p>
                          
                          {!fb.is_read && (
                            <button 
                              onClick={() => markFeedbackAsRead(fb.id)}
                              className="mt-4 text-sm font-bold text-[#C9A227] hover:text-[#b08d20]"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
