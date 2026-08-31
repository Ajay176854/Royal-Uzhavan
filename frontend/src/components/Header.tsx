import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, MessageCircle, ChevronDown, Menu, Leaf } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm flex flex-col w-full border-b border-gray-100">
      {/* Tier 1: Top Announcement Bar */}
      <div className="bg-[#1B4332] text-white text-[11px] py-2.5 hidden md:flex justify-between items-center px-4 xl:px-12 font-bold tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-sm">🌿</span> Free Shipping
        </div>
        <div className="flex items-center gap-2 text-[#C9A227]">
          <span className="text-sm">🌾</span> Direct From TamilNadu Farmers
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🥥</span> Wood Cold-Pressed Oils Available
        </div>
      </div>

      {/* Tier 2: Main Header (Single Line Context) */}
      <div className="container mx-auto px-4 xl:px-8 py-3 md:py-4 flex items-center justify-between gap-6">
        
        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-800 p-1">
          <Menu className="w-6 h-6" strokeWidth={1.5} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <div className="flex flex-col text-left ml-2">
            <span className="text-[#1B4332] text-xl md:text-[22px] font-black tracking-tight uppercase leading-[0.9]">Royal</span>
            <span className="text-[#C9A227] text-xl md:text-[22px] font-black tracking-tight uppercase leading-[0.9]">Uzhavan</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-4 xl:gap-8 text-[9px] md:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-gray-700 whitespace-nowrap">
          <Link to="/our-farms" className="hover:text-[#1B4332] transition-colors px-1 lg:px-2 py-2">About Us</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 bg-[#86B841] text-white px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full transition-colors shadow-sm">
              Products <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            {/* Mega Menu Dropdown */}
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-100 rounded-2xl p-6 min-w-[700px] xl:min-w-[850px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex gap-6 mt-2">
              
              {/* Col 1 */}
              <div className="flex-1 flex flex-col gap-5 border-r border-dashed border-gray-200 pr-6">
                <Link to="/shop?category=Traditional%20Rice" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Traditional Rice</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Ready%20to%20Cook" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Ready to Cook & Flour</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Combo%20Offer" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Combo Offer</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
              </div>

              {/* Col 2 */}
              <div className="flex-1 flex flex-col gap-5 border-r border-dashed border-gray-200 pr-6">
                <Link to="/shop?category=Millets" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Millets</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Health%20Mix" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Health Mix & Malt</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Noodles" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Noodles & Vermicelli</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Grocery" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Grocery & Pulses</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Vadagam" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Vadagam & Vathal</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
              </div>

              {/* Col 3 */}
              <div className="flex-1 flex flex-col gap-5 border-r border-dashed border-gray-200 pr-6">
                <Link to="/shop?category=Sweet" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Sweet & Snacks</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
                <Link to="/shop?category=Sugar" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Traditional Sugar</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
              </div>

              {/* Col 4 */}
              <div className="flex-1 flex flex-col gap-5">
                <Link to="/shop?category=Oils%20%26%20Ghee" className="flex justify-between items-start group/item">
                  <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Oils & Ghee</span>
                  <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100" />
                </Link>
              </div>
              
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[#1B4332] transition-colors py-2">
              Policy <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-lg py-3 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 translate-y-1 group-hover:translate-y-0">
              <Link to="/policies?tab=refund" className="block px-6 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B4332]">Refund Policy</Link>
              <Link to="/policies?tab=terms" className="block px-6 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B4332]">Terms of Service</Link>
              <Link to="/policies?tab=privacy" className="block px-6 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B4332]">Privacy Policy</Link>
            </div>
          </div>

          <Link to="/shop?offers=true" className="hover:text-[#1B4332] transition-colors py-2">Offers</Link>
          <Link to="/policies" className="hover:text-[#1B4332] transition-colors py-2">Shipping & Bulk Orders</Link>
          <Link to="/blog" className="hover:text-[#1B4332] transition-colors py-2">Blog</Link>
          <Link to="/contact" className="hover:text-[#1B4332] transition-colors py-2">Contact Us</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 lg:gap-5 shrink-0 ml-auto md:ml-0">
          
          <Link to="/account" className="hidden lg:block text-[11px] font-bold text-gray-800 tracking-wider hover:text-[#1B4332] transition-colors uppercase">
            Login / Register
          </Link>
          
          <button className="text-gray-800 hover:text-[#1B4332] transition-colors">
            <Search className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
          </button>

          <Link to="/account" className="hidden sm:block text-gray-800 hover:text-[#1B4332] transition-colors">
            <Heart className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
          </Link>

          <Link to="/cart" className="relative bg-[#86B841] text-white w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center hover:bg-[#729c36] transition-colors shadow-sm">
            <ShoppingCart className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 bg-white text-[#86B841] text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-md border border-gray-100">0</span>
          </Link>

          {/* WhatsApp Icon */}
          <a href="https://wa.me/918072864890" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-gray-200 bg-gray-50 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-gray-600 transition-all shadow-sm">
            <MessageCircle className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
          </a>
          
        </div>
      </div>
    </header>
  );
}