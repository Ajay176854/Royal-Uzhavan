import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, Info } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedVariant, setSelectedVariant] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();
  const { isLiked, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        const fetchedProduct = data.product;
        setProduct(fetchedProduct);
        setSelectedVariant(fetchedProduct.variants[0] || 1);

        // Fetch related products
        const relatedRes = await fetch(`${API_URL}/products?category=${encodeURIComponent(fetchedProduct.category)}&limit=5`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          // Exclude current product
          setRelatedProducts((relatedData.products || []).filter((p: Product) => p.id !== fetchedProduct.id).slice(0, 4));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4D26]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="bg-[#1B4332] text-white px-6 py-3 rounded-lg font-bold">Return to Shop</Link>
      </div>
    );
  }

  const variantMultiplier = selectedVariant;
  const currentPrice = Number(product.price) * (variantMultiplier / (product.variants[0] || 1));
  const currentOriginalPrice = product.original_price 
    ? Number(product.original_price) * (variantMultiplier / (product.variants[0] || 1)) 
    : undefined;

  const liked = isLiked(product.id);

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
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                  SKU: RU-{product.id.split('-')[0].toUpperCase()}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                  <span className="text-sm font-bold text-gray-700">{Number(product.rating).toFixed(1)}</span>
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
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Select Quantity/Size</h3>
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
                    {v} kg/L
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 sm:px-0 border border-gray-300 rounded-lg h-14 bg-white shrink-0">
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

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {product.in_stock ? (
                  <>
                    <button 
                      onClick={() => addToCart(product, quantity, selectedVariant)}
                      className="flex-1 bg-[#0B4D26] hover:bg-[#07361a] text-white rounded-lg h-14 font-bold text-lg shadow-sm transition-colors"
                    >
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
            </div>

            <div className="flex items-center gap-6 mb-8">
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={cn("flex items-center gap-2 font-medium transition-colors", liked ? "text-red-500" : "text-gray-500 hover:text-red-500")}
              >
                <Heart className={cn("w-5 h-5", liked && "fill-red-500")} /> 
                {liked ? 'Saved to Wishlist' : 'Add to Wishlist'}
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
          {['description', 'storage_guide', 'ingredients', 'reviews'].map((tab) => (
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
                Our {product.name} is {product.description || 'formulated specifically for optimal health. We source the finest natural ingredients from local Tamil Nadu farms, ensuring a chemical-free, nutrient-dense diet.'}
              </p>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>100% natural, free from synthetic chemicals.</li>
                <li>Fortified with essential vitamins and minerals.</li>
                <li>Highly digestible formulation for maximum absorption.</li>
                <li>Manufactured in our state-of-the-art hygienic facility.</li>
              </ul>
            </div>
          )}
          {activeTab === 'storage_guide' && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Storage Recommendations</h4>
              <p className="text-gray-700 mb-4">Store in a cool, dry place away from direct sunlight.</p>
              <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#0B4D26] text-white">
                  <tr>
                    <th className="p-3 font-medium">Condition</th>
                    <th className="p-3 font-medium">Shelf Life</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b"><td className="p-3">Room Temperature</td><td className="p-3">6 Months</td></tr>
                  <tr className="border-b bg-gray-50"><td className="p-3">Refrigerated (Oils/Ghee)</td><td className="p-3">12 Months</td></tr>
                </tbody>
              </table>
            </div>
          )}
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
            Every product from Royal Uzhavan carries a unique batch code. Enter your code to trace the farm origin, harvesting date, and quality certifications.
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
