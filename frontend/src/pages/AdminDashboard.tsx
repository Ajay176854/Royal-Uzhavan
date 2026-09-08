import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  LogOut,
  TrendingUp,
  Users,
  Clock,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Product State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

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
      } else if (tab === 'products') {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/products?limit=1000`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/products/categories`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (prodRes.ok) setProducts((await prodRes.json()).products);
        if (catRes.ok) setCategories((await catRes.json()).categories);
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const productData = Object.fromEntries(formData.entries());
    
    // Parse complex fields
    const payload = {
      ...productData,
      price: parseFloat(productData.price as string),
      original_price: productData.original_price ? parseFloat(productData.original_price as string) : null,
      discount: parseInt(productData.discount as string) || 0,
      tags: (productData.tags as string).split(',').map(s => s.trim()).filter(Boolean),
      variants: (productData.variants as string).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
      in_stock: productData.in_stock === 'true',
    };

    const token = localStorage.getItem('token');
    const url = editingProduct 
      ? `${API_URL}/admin/products/${editingProduct.id}`
      : `${API_URL}/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchData('products');
      } else {
        const errorData = await res.json();
        alert(`Error saving product: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData('products');
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
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
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'products' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package className="w-5 h-5" /> Products Management
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
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      Products Management
                      <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{products.length} items</span>
                    </h2>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsProductModalOpen(true);
                      }}
                      className="bg-[#0B4D26] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm hover:bg-[#083a1c] transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-lg w-16">Image</th>
                          <th className="px-6 py-4">Product Info</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock Status</th>
                          <th className="px-6 py-4 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <img src={product.image || '/images/placeholder.png'} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-500 font-mono mt-1">{product.slug}</p>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {product.category || '-'}
                            </td>
                            <td className="px-6 py-4 font-bold text-[#0B4D26]">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4">
                              {product.in_stock ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-bold uppercase tracking-wide">In Stock</span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-bold uppercase tracking-wide">Out of Stock</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit Product"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                  <input required name="name" defaultValue={editingProduct?.name || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL string) <span className="text-red-500">*</span></label>
                  <input required name="slug" defaultValue={editingProduct?.slug || ''} placeholder="e.g. fresh-cow-milk" className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select name="category_name" defaultValue={editingProduct?.category || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]">
                    <option value="">Select Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Animal Type</label>
                  <select name="animal_type" defaultValue={editingProduct?.animal_type || 'Livestock'} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]">
                    <option value="Cattle">Cattle</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Birds">Birds</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Human">Human</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Price (₹) <span className="text-red-500">*</span></label>
                  <input required type="number" step="0.01" name="price" defaultValue={editingProduct?.price || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (₹)</label>
                  <input type="number" step="0.01" name="original_price" defaultValue={editingProduct?.original_price || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                  <input name="image" defaultValue={editingProduct?.image || ''} placeholder="/images/example.png" className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount %</label>
                  <input type="number" name="discount" defaultValue={editingProduct?.discount || '0'} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tags (Comma Separated)</label>
                  <input name="tags" defaultValue={editingProduct?.tags?.join(', ') || ''} placeholder="Fresh, Farm, Quality" className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Size Variants (Comma Separated)</label>
                  <input name="variants" defaultValue={editingProduct?.variants?.join(', ') || '1, 5, 25'} placeholder="1, 5, 25" className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea name="description" rows={3} defaultValue={editingProduct?.description || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]"></textarea>
                </div>
                
                <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <input type="checkbox" id="in_stock" name="in_stock" value="true" defaultChecked={editingProduct ? editingProduct.in_stock : true} className="w-5 h-5 text-[#0B4D26] rounded focus:ring-[#0B4D26]" />
                  <label htmlFor="in_stock" className="font-bold text-gray-700 cursor-pointer">Product is In Stock</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingProduct}
                  className="px-6 py-2 bg-[#0B4D26] text-white rounded-lg font-bold hover:bg-[#083a1c] disabled:opacity-50"
                >
                  {isSavingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
