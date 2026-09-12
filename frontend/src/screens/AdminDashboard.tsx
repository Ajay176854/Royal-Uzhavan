'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { localApi } from '../services/localApi';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Users,
  Clock,
  Plus,
  Edit,
  Trash2,
  X,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories'>('dashboard');

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(
    (typeof window !== 'undefined' ? sessionStorage.getItem('adminAuth') : 'false') === 'true'
  );
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (formData.get('username') === 'admin' && formData.get('password') === 'admin123') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedCustomerOrder, setSelectedCustomerOrder] = useState<any | null>(null);

  // Search State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSearchResults, setOrderSearchResults] = useState<any[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
  
  // Product State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [isFetching, setIsFetching] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab: string) => {
    setIsFetching(true);
    try {
      if (tab === 'dashboard') {
        const statsData = await localApi.getAdminStats();
        setStats(statsData);
      } else if (tab === 'orders') {
        const ordersData = await localApi.getOrders({ limit: 50 });
        setOrders(ordersData);
      } else if (tab === 'products') {
        const [prodData, catData] = await Promise.all([
          localApi.getProducts({ limit: 1000 }),
          localApi.getCategories()
        ]);
        setProducts(prodData);
        setCategories(catData);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearchOrders = async () => {
    const cleanQuery = orderSearchQuery.replace(/^#/, '').trim();
    if (!cleanQuery) {
      setOrderSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsSearchingOrders(true);
    setHasSearched(true);
    try {
      const data = await localApi.getOrders({ search: cleanQuery, limit: 20 });
      setOrderSearchResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearchingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await localApi.updateOrderStatus(orderId, status);
      fetchData('orders');
      alert(`Order ${orderId.split('-')[0].toUpperCase()} updated to ${status}`);
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
    // Parse complex fields
    const payload = {
      ...productData,
      image: imagePreview || editingProduct?.image || '', // use the base64 or existing
      in_stock: productData.in_stock === 'true',
    };

    try {
      if (editingProduct) {
        await localApi.updateProduct(editingProduct.id, payload);
      } else {
        await localApi.addProduct(payload);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchData('products');
    } catch (err: any) {
      console.error(err);
      alert(`Error saving product: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await localApi.deleteProduct(id);
      fetchData('products');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCategory(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryData = Object.fromEntries(formData.entries());
    
    try {
      await localApi.addCategory({
        name: categoryData.name,
        image: imagePreview || ''
      });
      setIsCategoryModalOpen(false);
      setImagePreview('');
      fetchData('categories');
    } catch (err: any) {
      console.error(err);
      alert(`Error saving category: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await localApi.deleteCategory(name);
      fetchData('categories');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete category');
    }
  };



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

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold text-[#0B4D26] mb-2">Admin Login</h1>
            <p className="text-gray-500 text-sm">Sign in to manage products and orders.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">{loginError}</div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input name="username" required autoFocus className="w-full px-4 py-3 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" placeholder="admin" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input type="password" name="password" required className="w-full px-4 py-3 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-[#0B4D26] hover:bg-[#07361a] text-white font-bold py-3 rounded-lg transition-colors mt-4">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={() => {
              sessionStorage.removeItem('adminAuth');
              setIsAuthenticated(false);
            }} 
            className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-[#C9A227] text-gray-900">
                <h2 className="font-bold text-lg">Admin Panel</h2>
              </div>
              <nav className="flex flex-col p-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'dashboard' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <LayoutDashboard className="w-5 h-5" /> Overview
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'products' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package className="w-5 h-5" /> Products Management
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors w-full text-left ${activeTab === 'categories' ? 'bg-[#0B4D26]/10 text-[#0B4D26]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package className="w-5 h-5" /> Categories Management
                </button>
                <div className="my-2 border-t border-gray-100"></div>
      
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-4 mb-4 text-blue-800">
                        <Package className="w-8 h-8" />
                        <h3 className="font-bold text-lg">Total Products</h3>
                      </div>
                      <p className="text-3xl font-black text-blue-900">{stats?.totalProducts || products.length || 0}</p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'products' ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      Products Management
                      <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{products.length} items</span>
                    </h2>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setImagePreview('');
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
                          <th className="px-6 py-4">Tamil Name</th>
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
                            <td className="px-6 py-4 font-bold text-gray-900">
                              {product.name_tamil || '-'}
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
                                    setImagePreview(product.image || '');
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
              ) : activeTab === 'categories' ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      Categories Management
                      <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{categories.length} items</span>
                    </h2>
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setIsCategoryModalOpen(true);
                      }}
                      className="bg-[#0B4D26] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm hover:bg-[#083a1c] transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-lg w-16">Image</th>
                          <th className="px-6 py-4">Category Name</th>
                          <th className="px-6 py-4 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <img src={cat.image || '/images/placeholder.png'} alt={cat.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{cat.name}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => handleDeleteCategory(cat.name)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Category"
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
              ) : null}
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tamil Name</label>
                  <input name="name_tamil" defaultValue={editingProduct?.name_tamil || ''} required className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <input 
                    name="category" 
                    defaultValue={editingProduct?.category || ''} 
                    list="categories-list"
                    placeholder="Select or type new category..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" 
                  />
                  <datalist id="categories-list">
                    {categories.map(c => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Upload Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0B4D26]/10 file:text-[#0B4D26] hover:file:bg-[#0B4D26]/20" 
                  />
                  {imagePreview && (
                    <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImagePreview('')}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea name="description" defaultValue={editingProduct?.description || ''} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
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


      {/* Customer Details Modal */}
      {selectedCustomerOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCustomerOrder(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0B4D26]" />
                Customer Details
              </h3>
              <button 
                onClick={() => setSelectedCustomerOrder(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-bold text-gray-900">{selectedCustomerOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{selectedCustomerOrder.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{selectedCustomerOrder.customer_email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Location</h4>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                      {(() => {
                        try {
                          const address = typeof selectedCustomerOrder.shipping_address === 'string' 
                            ? JSON.parse(selectedCustomerOrder.shipping_address)
                            : selectedCustomerOrder.shipping_address;
                          
                          if (address && typeof address === 'object') {
                            return `${address.address}\n${address.city}, ${address.state}\n${address.pincode}`;
                          }
                          return selectedCustomerOrder.shipping_address || 'No shipping address provided.';
                        } catch (e) {
                          return selectedCustomerOrder.shipping_address || 'No shipping address provided.';
                        }
                      })()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ordered Items</h4>
                  <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
                    {(() => {
                      try {
                        const items = typeof selectedCustomerOrder.items === 'string'
                          ? JSON.parse(selectedCustomerOrder.items)
                          : selectedCustomerOrder.items;
                        
                        if (!Array.isArray(items) || items.length === 0) return <p className="p-4 text-sm text-gray-500">No items found.</p>;

                        return items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-4">
                            <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                              <img src={item.image || '/images/cattle-food.png'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#0B4D26] text-sm">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ));
                      } catch (e) {
                        return <p className="p-4 text-sm text-gray-500">Failed to load items.</p>;
                      }
                    })()}
                  </div>
                </div>


                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h4>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-mono font-bold text-gray-900">#{selectedCustomerOrder.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Value</p>
                      <p className="font-bold text-[#0B4D26]">₹{Number(selectedCustomerOrder.total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCategory} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name <span className="text-red-500">*</span></label>
                <input required name="name" className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26]" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-[#0B4D26] focus:border-[#0B4D26] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0B4D26]/10 file:text-[#0B4D26] hover:file:bg-[#0B4D26]/20" 
                />
                {imagePreview && (
                  <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingCategory} className="px-6 py-2.5 rounded-lg font-bold bg-[#0B4D26] text-white hover:bg-[#083a1c] transition-colors disabled:opacity-50">
                  {isSavingCategory ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}





