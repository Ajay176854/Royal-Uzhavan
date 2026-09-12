'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Filter, ChevronDown, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';
import { localApi } from '../services/localApi';

export default function Shop() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams?.get('category');
  const searchQuery = searchParams?.get('search'); // Use 'search' as per header query string

  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState('created_at');

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await localApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 200 };
        if (activeCategory !== 'All') params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;

        const data = await localApi.getProducts(params);
        
        // Client-side sorting
        let sorted = [...data];
        if (sortOption === 'created_at') {
          sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        setProducts(sorted);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, searchQuery, sortOption]);

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
                    onClick={() => {
                      setActiveCategory('All');
                      router.push(pathname || '/shop')
                    }}
                    className={cn("flex items-center gap-2 text-sm transition-colors", activeCategory === 'All' ? "font-bold text-[#0B4D26]" : "text-gray-600 hover:text-[#0B4D26]")}
                  >
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center", activeCategory === 'All' ? "border-[#0B4D26] bg-[#0B4D26]" : "border-gray-300")}>
                      {activeCategory === 'All' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    All Products
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => {
                        setActiveCategory(cat.name);
                        router.push(pathname || '/shop') // optional, but good for resetting search if they click a category manually
                      }}
                      className={cn("flex items-center gap-2 text-sm transition-colors text-left", activeCategory === cat.name ? "font-bold text-[#0B4D26]" : "text-gray-600 hover:text-[#0B4D26]")}
                    >
                      <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", activeCategory === cat.name ? "border-[#0B4D26] bg-[#0B4D26]" : "border-gray-300")}>
                        {activeCategory === cat.name && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {cat.name}
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
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border-gray-200 rounded-md text-sm py-1.5 pl-3 pr-8 focus:border-[#0B4D26] focus:ring-[#0B4D26] bg-gray-50 font-medium"
                >
                  <option value="popular">Popularity</option>
                  <option value="created_at">Newest First</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <p className="text-gray-500 font-medium">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {products.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query.</p>
                    <button 
                      onClick={() => {
                        setActiveCategory('All'); 
                        router.push(pathname || '/shop')
                      }} 
                      className="mt-6 text-[#0B4D26] font-bold underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





