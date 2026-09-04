import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories once
  useEffect(() => {
    fetch(`${API_URL}/products/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/products?`;
        if (activeCategory !== 'All') url += `category=${encodeURIComponent(activeCategory)}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        
        // Sorting mapping
        if (sortOrder === 'price_asc') url += `sort=price_asc&`;
        if (sortOrder === 'price_desc') url += `sort=price_desc&`;
        if (sortOrder === 'popular') url += `sort=popular&`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, searchQuery, sortOrder]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#0B4D26] mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All Products'}
          </h1>
          <p className="text-gray-500 text-sm">Showing {products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={cn(
            "lg:w-64 shrink-0 space-y-8 bg-white p-6 border border-gray-200 h-fit",
            isMobileFiltersOpen ? "block fixed inset-0 z-50 overflow-y-auto m-0 border-none" : "hidden lg:block"
          )}>
            {isMobileFiltersOpen && (
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-500 font-bold">Close</button>
              </div>
            )}

            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center justify-between">
                Categories <ChevronDown className="w-4 h-4" />
              </h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleCategoryChange('All')}
                    className={cn("flex items-center gap-2 text-sm transition-colors", activeCategory === 'All' ? "font-bold text-[#0B4D26]" : "text-gray-600 hover:text-[#0B4D26]")}
                  >
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center", activeCategory === 'All' ? "border-[#0B4D26] bg-[#0B4D26]" : "border-gray-300")}>
                      {activeCategory === 'All' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    All Products
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.name}>
                    <button 
                      onClick={() => handleCategoryChange(cat.name)}
                      className={cn("flex items-center gap-2 text-sm transition-colors", activeCategory === cat.name ? "font-bold text-[#0B4D26]" : "text-gray-600 hover:text-[#0B4D26]")}
                    >
                      <div className={cn("w-4 h-4 rounded border flex items-center justify-center", activeCategory === cat.name ? "border-[#0B4D26] bg-[#0B4D26]" : "border-gray-300")}>
                        {activeCategory === cat.name && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {cat.name} {cat.product_count !== undefined && <span className="text-xs text-gray-400">({cat.product_count})</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {isMobileFiltersOpen && (
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-[#0B4D26] text-white py-3 rounded-lg font-bold mt-8"
              >
                Apply Filters
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 mb-6">
              <button 
                className="lg:hidden flex items-center gap-2 font-bold text-gray-700"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
              
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" /> Filtered by: <span className="font-bold text-gray-900">{activeCategory}</span>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <label className="text-sm text-gray-500 font-medium hidden sm:block">Sort by:</label>
                <select 
                  className="border-gray-200 rounded-md text-sm py-1.5 pl-3 pr-8 focus:border-[#0B4D26] focus:ring-[#0B4D26] bg-gray-50 font-medium"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="popular">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                <button onClick={() => {
                  setActiveCategory('All'); 
                  searchParams.delete('category'); 
                  searchParams.delete('search'); 
                  setSearchParams(searchParams);
                }} className="mt-6 text-[#0B4D26] font-bold underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
