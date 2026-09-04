import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, MessageCircle, ChevronDown, Menu, Leaf, X } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import logoImg from '../assets/images/001.jpg';
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();

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
          <span className="text-sm">🌾</span> Direct From Tamilnadu Farmers
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🥥</span> Wood Cold-Pressed Oils Available
        </div>
      </div>

      {/* Tier 2: Main Header (Single Line Context) */}
      <div className="container mx-auto px-4 xl:px-8 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-6">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3 md:gap-4 group">
          <div className="relative">
            <img src={logoImg} alt="Royal Uzhavan Logo" className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-cover rounded-full shadow-md border-[3px] border-white group-hover:shadow-lg transition-all duration-300 shrink-0" />
            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <Leaf className="w-3 h-3 md:w-4 md:h-4 text-[#86B841]" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col text-left justify-center mt-1">
            <span className="text-[#1B4332] text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-serif font-bold tracking-tight leading-[0.85]">Royal</span>
            <span className="text-[#C9A227] text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-serif font-bold tracking-tight leading-[0.85]">Uzhavan</span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-[#5c8a2b] font-black tracking-[0.2em] uppercase mt-1.5 md:mt-2 flex items-center gap-1.5">
              <span className="w-3 sm:w-4 md:w-6 h-[2px] bg-[#86B841]/40 rounded-full"></span>
              Traditional Farms 🌾
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-4 xl:gap-6 text-[9px] lg:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-gray-700 whitespace-nowrap">

          <div className="group">
            <button className="flex items-center gap-1 bg-[#86B841] text-white px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full transition-colors shadow-sm hover:bg-[#729c36] hover:shadow-md">
              Products <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            {/* Full-width Mega Menu Wrapper with hover bridge */}
            <div className="absolute top-[100%] left-0 w-full pt-4 -mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 cursor-default">
              <div className="bg-white shadow-2xl border-t border-gray-100">
                <div className="container mx-auto px-4 xl:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 normal-case tracking-normal">

                  {/* Col 1 */}
                  <div className="flex flex-col gap-5 lg:border-r lg:border-dashed lg:border-gray-200 lg:pr-8">
                    <Link to="/shop?category=Traditional%20Rice" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Traditional Rice</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Ready%20to%20Cook" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Ready to Cook & Flour</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Combo%20Offer" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Combo Offer</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                  {/* Col 2 */}
                  <div className="flex flex-col gap-5 lg:border-r lg:border-dashed lg:border-gray-200 lg:pr-8">
                    <Link to="/shop?category=Millets" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Millets</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Health%20Mix" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Health Mix & Malt</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Noodles" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Noodles & Vermicelli</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Grocery" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Grocery & Pulses</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Vadagam" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Vadagam & Vathal</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                  {/* Col 3 */}
                  <div className="flex flex-col gap-5 lg:border-r lg:border-dashed lg:border-gray-200 lg:pr-8">
                    <Link to="/shop?category=Sweet" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Sweet & Snacks</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/shop?category=Sugar" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Traditional Sugar</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                  {/* Col 4 */}
                  <div className="flex flex-col gap-5">
                    <Link to="/shop?category=Oils%20%26%20Ghee" className="flex justify-between items-start group/item">
                      <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#1B4332] leading-tight pr-2 capitalize">Oils & Ghee</span>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <Link to="/our-farms" className="relative hover:text-[#1B4332] transition-colors py-2 px-1 after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0 after:h-[2px] after:bg-[#1B4332] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">About Us</Link>
          <Link to="/policies?tab=shipping" className="relative hover:text-[#1B4332] transition-colors py-2 px-1 after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0 after:h-[2px] after:bg-[#1B4332] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Shipping & Bulk Orders</Link>

          <div className="relative group">
            <button className="relative flex items-center gap-1 hover:text-[#1B4332] transition-colors py-2 px-1 after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0 after:h-[2px] after:bg-[#1B4332] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
              Policies <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            {/* Dropdown with hover bridge */}
            <div className="absolute top-full left-0 pt-4 -mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-white shadow-xl border border-gray-100 rounded-lg py-3 min-w-[180px] translate-y-2 group-hover:translate-y-0 transition-transform duration-300 normal-case tracking-normal">
                <Link to="/policies?tab=refund" className="block px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B4332] transition-colors">Refund Policy</Link>
                <Link to="/policies?tab=terms" className="block px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B4332] transition-colors">Terms of Service</Link>
                <Link to="/policies?tab=privacy" className="block px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B4332] transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>

          <Link to="/blog" className="relative hover:text-[#1B4332] transition-colors py-2 px-1 after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0 after:h-[2px] after:bg-[#1B4332] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Blog</Link>
          <Link to="/contact" className="relative hover:text-[#1B4332] transition-colors py-2 px-1 after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0 after:h-[2px] after:bg-[#1B4332] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Contact Us</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 lg:gap-5 shrink-0 ml-auto md:ml-0">

          <Link to="/account" className="hidden lg:block text-[11px] font-bold text-gray-800 tracking-wider hover:text-[#1B4332] transition-colors uppercase">
            Login / Register
          </Link>

          <button className="hidden md:block text-gray-800 hover:text-[#1B4332] transition-colors">
            <Search className="w-5 h-5" strokeWidth={2} />
          </button>

          <Link to="/account" className="relative hidden sm:block text-gray-800 hover:text-[#1B4332] transition-colors">
            <Heart className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1B4332] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-[#86B841] text-white w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center hover:bg-[#729c36] transition-colors shadow-sm"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 bg-white text-[#86B841] text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-md border border-gray-100">
              {cartCount}
            </span>
          </button>

          {/* WhatsApp Icon */}
          <a href="https://wa.me/918072864890" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-gray-200 bg-gray-50 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-gray-600 transition-all shadow-sm">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
          </a>

          {/* Mobile Menu Toggle (Moved to Right) */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-800 p-1 hover:text-[#1B4332] transition-colors">
            <Menu className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[320px] bg-white shadow-2xl z-[100] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-playfair font-bold text-[#1B4332]">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 flex flex-col">
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors">
            Shop Products <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
          </Link>
          <Link to="/our-farms" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">About Us</Link>
          <Link to="/policies?tab=shipping" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Shipping & Bulk Orders</Link>
          <Link to="/policies?tab=refund" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Policies</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Blog</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Contact Us</Link>
          
          <div className="mt-auto p-6">
            <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 rounded-xl font-black text-white uppercase tracking-wider text-xs bg-[#1B4332] hover:bg-[#0f271d] transition-colors text-center shadow-md">
              Login / Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}