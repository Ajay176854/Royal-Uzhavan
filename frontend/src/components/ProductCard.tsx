import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWishlist } from '../contexts/WishlistContext';
interface Product {
  id: string;
  name: string;
  category: string;
  animalType: string;
  name_tamil?: string;

  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  variants: number[];
  in_stock: boolean; // Note: backend returns in_stock
  description: string;
}

interface ProductCardProps {
  product: Product | any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isLiked } = useWishlist();

  const liked = isLiked(product.id);

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const waNumber = '918072864890';
    const message = `Hello, I would like to enquire about the product: ${product.name}.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCallEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('tel:+918072864890', '_self');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 ease-out flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Badges */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-wabi-bg)] m-3 rounded-xl">
        <div className="block cursor-default">
          <img 
            src={product.image} 
            alt={product.name}
            className={cn(
              "w-full h-full object-cover sepia-[0.05] contrast-[0.95] transition-transform duration-700 ease-out",
              isHovered && "scale-105"
            )}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="bg-[var(--color-wabi-gold)] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.tags && product.tags.map((tag: string) => (
            <span key={tag} className={cn(
              "text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm",
              tag === "Royal Uzhavan Favourites" ? "bg-[var(--color-wabi-green)]" : "bg-[var(--color-wabi-earth)]"
            )}>
              {tag}
            </span>
          ))}
        </div>

        {/* Wishlist */}
        <button 
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all",
            liked 
              ? "bg-red-50 text-red-500 hover:bg-red-100" 
              : "bg-white/80 hover:bg-white text-gray-500 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-red-500")} />
        </button>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <span className="bg-gray-900 text-white font-bold px-4 py-2 rounded shadow-lg uppercase tracking-wider text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">


        {/* Title */}
        <div className="block mb-3 mt-1 cursor-default">
          <h3 className="font-bold text-gray-900 transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.name_tamil && (
            <span className="text-[13px] font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2 py-0.5 inline-block rounded-md mt-1.5">{product.name_tamil}</span>
          )}
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-4">


          {/* Action */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch justify-between gap-2">
            <button
              onClick={handleCallEnquiry}
              className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-2 rounded-lg font-bold transition-all duration-300 bg-[var(--color-wabi-green)] hover:bg-[#1a3818] text-white shadow-sm hover:shadow-md text-[10px] sm:text-xs uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </button>
            <button
              onClick={handleWhatsAppEnquiry}
              className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-2 rounded-lg font-bold transition-all duration-300 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm hover:shadow-md text-[10px] sm:text-xs uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" /> Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
