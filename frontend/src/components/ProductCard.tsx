'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
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
  product_detail?: string;
}

interface ProductCardProps {
  product: Product | any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

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



  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 ease-out flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image & Badges */}
        <div className="relative overflow-hidden bg-white m-2 sm:m-3 rounded-lg sm:rounded-xl">
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="block relative aspect-square cursor-pointer">
            <img 
              src={product.image} 
              alt={product.name}
              className={cn(
                "absolute inset-0 w-full h-full object-contain sepia-[0.05] contrast-[0.95] transition-transform duration-700 ease-out",
                isHovered && "scale-105"
              )}
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {product.discount > 0 && (
              <span className="bg-[var(--color-wabi-gold)] text-white text-[9px] sm:text-[10px] uppercase tracking-widest font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm">
                {product.discount}% OFF
              </span>
            )}
            {product.tags && product.tags.filter((tag: string) => tag.includes('Royal Uzhavan')).map((tag: string) => (
              <span key={tag} className={cn(
                "text-white text-[7px] sm:text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-sm shadow-sm opacity-90",
                tag === "Royal Uzhavan Favourites" ? "bg-[var(--color-wabi-green)]" : "bg-[var(--color-wabi-earth)]"
              )}>
                {tag}
              </span>
            ))}
          </div>

          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <span className="bg-gray-900 text-white font-bold px-2 py-1 sm:px-4 sm:py-2 rounded shadow-lg uppercase tracking-wider text-[11px] sm:text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-5 md:pb-5 flex flex-col flex-1">

          {/* Title & Description */}
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="block mb-2 sm:mb-3 cursor-pointer">
            <h3 className="font-bold text-[14px] sm:text-base text-gray-900 group-hover:text-[var(--color-wabi-green)] transition-colors leading-tight line-clamp-2">
              {product.name}
            </h3>
            {product.name_tamil && (
              <span className="text-[11px] sm:text-[12px] font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-1.5 py-0.5 sm:px-2 inline-block rounded-md mt-1.5">{product.name_tamil}</span>
            )}
          </Link>

          <div className="mt-auto">
            {/* Action */}
            <div className="mt-2 sm:mt-3 flex flex-col gap-1.5 sm:gap-2">
              <button
                onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                className="w-full flex justify-center items-center py-2 sm:py-2.5 rounded-md sm:rounded-lg font-bold transition-all duration-300 bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm hover:shadow-md text-[10px] sm:text-xs uppercase tracking-wider"
              >
                Detail
              </button>
              <div className="flex flex-row items-stretch justify-between gap-1.5 sm:gap-2">
                <button
                  onClick={handleCallEnquiry}
                  className="flex-1 flex justify-center items-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-2 rounded-md sm:rounded-lg font-bold transition-all duration-300 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm hover:shadow-md text-[10px] sm:text-xs uppercase tracking-wider"
                >
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Call
                </button>
                <button
                  onClick={handleWhatsAppEnquiry}
                  className="flex-1 flex justify-center items-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-2 rounded-md sm:rounded-lg font-bold transition-all duration-300 bg-[var(--color-wabi-green)] hover:bg-[#1a3818] text-white shadow-sm hover:shadow-md text-[10px] sm:text-xs uppercase tracking-wider"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* Modal Image */}
            <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-50 md:rounded-l-2xl sm:rounded-t-2xl md:rounded-tr-none">
              <img src={product.image} alt={product.name} className="w-full h-auto max-h-[300px] object-contain drop-shadow-lg mix-blend-multiply" />
            </div>
            
            {/* Modal Content */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--color-wabi-green)] mb-2">{product.category}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h2>
              {product.name_tamil && (
                <span className="text-xs sm:text-sm font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2.5 py-1 inline-block rounded-md mb-4 w-fit">{product.name_tamil}</span>
              )}
              
              <div className="h-px w-full bg-gray-100 my-4"></div>
              
              {product.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Price</h4>
                  <p className="text-sm font-bold text-[var(--color-wabi-green)] leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {product.product_detail && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Product Detail</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{product.product_detail}</p>
                </div>
              )}

              <div className="mt-auto pt-4 flex flex-col gap-2.5">
                <button
                  onClick={handleCallEnquiry}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </button>
                <button
                  onClick={handleWhatsAppEnquiry}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 bg-[var(--color-wabi-green)] hover:bg-[#1a3818] text-white shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;


