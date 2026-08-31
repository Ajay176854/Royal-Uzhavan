import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Product } from '../data';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || 1);
  const [isHovered, setIsHovered] = useState(false);

  // Simple pricing logic for mock data based on variant size
  const variantMultiplier = selectedVariant;
  const currentPrice = product.price * (variantMultiplier / (product.variants[0] || 1));
  const currentOriginalPrice = product.originalPrice 
    ? product.originalPrice * (variantMultiplier / (product.variants[0] || 1)) 
    : undefined;

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 ease-out flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Badges */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-wabi-bg)] m-3 rounded-xl">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className={cn(
              "w-full h-full object-cover sepia-[0.05] contrast-[0.95] transition-transform duration-700 ease-out",
              isHovered && "scale-105"
            )}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && (
            <span className="bg-[var(--color-wabi-gold)] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.tags.map(tag => (
            <span key={tag} className={cn(
              "text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm",
              tag === "Royal Uzhavan Favourites" ? "bg-[var(--color-wabi-green)]" : "bg-[var(--color-wabi-earth)]"
            )}>
              {tag}
            </span>
          ))}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm transition-all">
          <Heart className="w-4 h-4" />
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white font-bold px-4 py-2 rounded shadow-lg uppercase tracking-wider text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-[var(--color-wabi-gold)] text-[var(--color-wabi-gold)]" />
          <span className="text-xs font-bold text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block mb-3 mt-1">
          <h3 className="font-serif text-[var(--color-wabi-green)] text-lg leading-tight line-clamp-2 hover:text-[var(--color-wabi-earth)] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          {/* Variant Selector */}
          <select 
            className="w-full text-xs font-bold uppercase tracking-wider border-b border-gray-200 bg-transparent py-2 px-1 focus:outline-none focus:border-[var(--color-wabi-green)] cursor-pointer text-gray-600"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(Number(e.target.value))}
          >
            {product.variants.map(v => (
              <option key={v} value={v}>{v} kg / {v} Ltr</option>
            ))}
          </select>

          {/* Price & Action */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-[var(--color-wabi-green)]">₹{currentPrice.toLocaleString('en-IN')}</span>
              {currentOriginalPrice && (
                <span className="text-xs text-gray-400 line-through">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            {product.inStock ? (
              <button className="bg-[var(--color-wabi-bg)] hover:bg-[var(--color-wabi-green)] text-[var(--color-wabi-green)] hover:text-white border border-[var(--color-wabi-green)]/20 hover:border-[var(--color-wabi-green)] px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all">
                Add
              </button>
            ) : (
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors">
                Notify
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
