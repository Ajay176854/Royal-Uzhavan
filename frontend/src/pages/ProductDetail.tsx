import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, Info } from 'lucide-react';
import { PRODUCTS } from '../data';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0]; // Fallback for demo
  
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || 1);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const variantMultiplier = selectedVariant;
  const currentPrice = product.price * (variantMultiplier / (product.variants[0] || 1));
  const currentOriginalPrice = product.originalPrice 
    ? product.originalPrice * (variantMultiplier / (product.variants[0] || 1)) 
    : undefined;

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#0B4D26]">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#0B4D26]">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-[#0B4D26]">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-[#C9A227] text-white text-sm font-bold px-3 py-1.5 rounded-sm shadow-md">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            {/* Thumbnail placeholder */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn("w-20 h-20 rounded-lg border-2 shrink-0 cursor-pointer overflow-hidden", i === 1 ? "border-[#0B4D26]" : "border-transparent opacity-60 hover:opacity-100")}>
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                  SKU: RU-{product.id.toUpperCase()}-26
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                  <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                  <span className="text-sm text-gray-500 underline cursor-pointer">({product.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-bold text-[#0B4D26]">₹{currentPrice.toLocaleString('en-IN')}</span>
                {currentOriginalPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
                )}
                <span className="text-sm text-gray-500 mb-1 ml-2">(Incl. of all taxes)</span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />

            {/* Bag Size Variant Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Select Bag Size</h3>
                <span className="text-[#0B4D26] text-sm font-medium">Size Guide</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product.variants.map(v => (
                  <button 
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "py-3 border rounded-lg text-center font-bold transition-all",
                      selectedVariant === v 
                        ? "border-[#0B4D26] bg-[#0B4D26]/5 text-[#0B4D26]" 
                        : "border-gray-200 text-gray-600 hover:border-[#0B4D26]/50"
                    )}
                  >
                    {v} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Pricing Widget */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
                <Info className="w-4 h-4" /> Bulk/Wholesale Savings
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center border border-amber-100">
                  <span className="block font-bold text-gray-900">10+ Bags</span>
                  <span className="text-amber-600 font-medium">-5% Off</span>
                </div>
                <div className="bg-white p-2 rounded text-center border border-amber-100">
                  <span className="block font-bold text-gray-900">25+ Bags</span>
                  <span className="text-amber-600 font-medium">-8% Off</span>
                </div>
                <div className="bg-white p-2 rounded text-center border border-amber-100">
                  <span className="block font-bold text-gray-900">50+ Bags</span>
                  <span className="text-amber-600 font-medium">-12% Off</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-lg h-14 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-gray-500 hover:text-[#0B4D26] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 h-full text-gray-500 hover:text-[#0B4D26] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {product.inStock ? (
                <>
                  <button className="flex-1 bg-[#0B4D26] hover:bg-[#07361a] text-white rounded-lg h-14 font-bold text-lg shadow-sm transition-colors">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 rounded-lg h-14 font-bold text-lg shadow-sm transition-colors">
                    Buy Now
                  </button>
                </>
              ) : (
                <button className="flex-1 bg-gray-200 text-gray-800 rounded-lg h-14 font-bold text-lg border border-gray-300">
                  Notify Me When Available
                </button>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8">
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium transition-colors">
                <Heart className="w-5 h-5" /> Add to Wishlist
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 font-medium transition-colors">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-[#0B4D26]/10 p-2 rounded-full text-[#0B4D26]">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <span className="block font-bold text-gray-900">Free Delivery</span>
                  <span className="text-gray-500">Across Tamil Nadu</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#0B4D26]/10 p-2 rounded-full text-[#0B4D26]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <span className="block font-bold text-gray-900">Traceable</span>
                  <span className="text-gray-500">Direct from mill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="container mx-auto px-4 py-12">
        <div className="border-b border-gray-200 flex gap-8 overflow-x-auto">
          {['description', 'feeding_guide', 'ingredients', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 font-bold uppercase tracking-wider text-sm whitespace-nowrap transition-colors",
                activeTab === tab ? "border-b-2 border-[#0B4D26] text-[#0B4D26]" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <div className="py-8 max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our {product.name} is formulated specifically for optimal health and yield. We source the finest natural ingredients from local Tamil Nadu farms, ensuring a chemical-free, nutrient-dense diet for your livestock.
              </p>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>100% natural, free from synthetic growth promoters.</li>
                <li>Fortified with essential vitamins and minerals.</li>
                <li>Highly digestible formulation for maximum absorption.</li>
                <li>Manufactured in our state-of-the-art hygienic milling facility.</li>
              </ul>
            </div>
          )}
          {activeTab === 'feeding_guide' && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Recommended Dosage</h4>
              <p className="text-gray-700 mb-4">Mix with regular forage or serve directly. Ensure fresh water is always available.</p>
              <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#0B4D26] text-white">
                  <tr>
                    <th className="p-3 font-medium">Animal Stage</th>
                    <th className="p-3 font-medium">Daily Quantity</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b"><td className="p-3">Growing Phase</td><td className="p-3">1 - 1.5 kg per day</td></tr>
                  <tr className="border-b bg-gray-50"><td className="p-3">Adult Maintenance</td><td className="p-3">2 - 3 kg per day</td></tr>
                  <tr><td className="p-3">High Yield / Lactating</td><td className="p-3">3.5 - 5 kg per day</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {/* ... other tabs would be similarly structured ... */}
          {(activeTab === 'ingredients' || activeTab === 'reviews') && (
            <p className="text-gray-500 italic">Content for {activeTab} will be displayed here.</p>
          )}
        </div>
      </div>

      {/* Trace Widget */}
      <div className="bg-[#0B4D26] text-white py-12 border-y-4 border-[#C9A227]">
        <div className="container mx-auto px-4 text-center">
          <ShieldCheck className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
          <h2 className="text-2xl font-playfair font-bold mb-4">Trace This Product</h2>
          <p className="text-green-100 max-w-2xl mx-auto mb-8">
            Every bag of Royal Uzhavan feed carries a unique batch code. Enter your code to trace the farm origin, milling date, and quality certifications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <input type="text" placeholder="Enter Batch Code (e.g. RU-24A)" className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C9A227] flex-1" />
            <button className="bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 font-bold px-6 py-3 rounded-lg">Trace Now</button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
