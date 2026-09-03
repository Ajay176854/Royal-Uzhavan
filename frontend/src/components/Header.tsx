import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, MessageCircle, ChevronDown, Menu, Leaf, X, User, LogOut } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/images/001.jpg';
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobilePoliciesOpen, setIsMobilePoliciesOpen] = useState(false);
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, logout, setIsAuthOpen } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm flex flex-col w-full border-b border-gray-100">
      {/* Tier 1: Top Announcement Bar */}
      <div className="bg-[#1B4332] text-white text-[11px] py-2.5 hidden md:flex justify-between items-center px-4 xl:px-12 font-bold tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-sm">🌿</span> Free Shipping
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌾</span> Direct From Tamilnadu Farmers
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🥥</span> Wood Cold-Pressed Oils Available
        </div>
      </div>

      {/* Tier 2: Main Header (Single Line Context) */}
      <div className="container mx-auto px-4 xl:px-8 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-6">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 md:gap-3 group">
          <div className="relative">
            <img src={logoImg} alt="Royal Uzhavan Logo" className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-cover rounded-full shadow-md border-[2px] border-white group-hover:shadow-lg transition-all duration-300 shrink-0" />
            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 md:p-1 shadow-sm border border-gray-100">
              <Leaf className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#86B841]" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col text-left justify-center mt-0.5">
            <span className="text-[#1B4332] text-lg sm:text-xl md:text-2xl lg:text-[26px] font-serif font-bold tracking-tight leading-[0.85]">Royal</span>
            <span className="text-[#C9A227] text-lg sm:text-xl md:text-2xl lg:text-[26px] font-serif font-bold tracking-tight leading-[0.85]">Uzhavan</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] text-[#5c8a2b] font-black tracking-[0.2em] uppercase mt-1 md:mt-1.5 flex items-center gap-1">
              <span className="w-2.5 sm:w-3 md:w-4 h-[2px] bg-[#86B841]/40 rounded-full"></span>
              Traditional Farms 🌾
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-start items-center gap-3 lg:gap-4 xl:gap-6 text-[10px] lg:text-[11px] xl:text-xs font-bold uppercase tracking-wider text-gray-700 whitespace-nowrap">

          <Link to="/our-farms" className="hover:bg-[#86B841] hover:text-white rounded-full transition-colors py-2 px-3">ABOUT US</Link>

          <div className="group">
            <button className="flex items-center gap-1 group-hover:bg-[#86B841] group-hover:text-white rounded-full transition-colors py-2 px-3">
              PRODUCTS <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" strokeWidth={2.5} />
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

          <div className="relative group">
            <button className="flex items-center gap-1 group-hover:bg-[#86B841] group-hover:text-white rounded-full transition-colors py-2 px-3">
              POLICY <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" strokeWidth={2.5} />
            </button>
            {/* Dropdown with hover bridge */}
            <div className="absolute top-full left-0 pt-4 -mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-white shadow-xl border border-gray-100 rounded-lg py-3 min-w-[180px] translate-y-2 group-hover:translate-y-0 transition-transform duration-300 normal-case tracking-normal">
                <Link to="/refund-policy" className="block px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#86B841] transition-colors">Refund Policy</Link>
                <Link to="/terms-of-service" className="block px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#86B841] transition-colors">Terms of Service</Link>
                <Link to="/privacy-policy" className="block px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#86B841] transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
          <Link to="/policies?tab=shipping" className="hover:bg-[#86B841] hover:text-white rounded-full transition-colors py-2 px-3">SHIPPING & BULK ORDERS</Link>
          <Link to="/blog" className="hover:bg-[#86B841] hover:text-white rounded-full transition-colors py-2 px-3">BLOG</Link>
          <Link to="/contact" className="hover:bg-[#86B841] hover:text-white rounded-full transition-colors py-2 px-3">CONTACT US</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 lg:gap-5 shrink-0 ml-auto md:ml-0">

          {/* User Account Dropdown */}
          <div className="relative hidden lg:flex items-center group">
            {isLoggedIn ? (
              <>
                <button
                  className="flex items-center gap-1 text-gray-800 hover:text-[#86B841] transition-colors py-2 text-[10px] xl:text-xs font-bold uppercase tracking-wider cursor-default"
                >
                  MY ACCOUNT <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#86B841]" strokeWidth={2.5} />
                </button>
                
                {/* Hover Bridge & Dropdown Menu */}
                <div className="absolute top-[100%] right-0 pt-4 -mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white shadow-xl border border-gray-100 rounded-lg py-2 min-w-[150px] translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <span className="text-xs text-gray-500 font-medium">Hello,</span>
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => { logout(); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="text-gray-800 hover:text-[#86B841] transition-colors py-2 text-[10px] xl:text-xs font-bold uppercase tracking-wider"
              >
                LOGIN / REGISTER
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="text-gray-800 hover:text-[#86B841] transition-colors p-1"
          >
            <Search className="w-5 h-5" strokeWidth={2} />
          </button>

          <Link to="/account" className="relative hidden sm:block text-gray-800 hover:text-[#86B841] transition-colors">
            <Heart className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1B4332] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hidden md:flex bg-[#86B841] text-white w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center hover:bg-[#729c36] transition-colors shadow-sm"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 bg-white text-[#86B841] text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-md border border-gray-100">
              {cartCount}
            </span>
          </button>

         
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
      <div className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-[100] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
          
          {/* Products Accordion */}
          <div>
            <button 
              onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)} 
              className="w-full px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              Shop Products 
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`bg-gray-50/50 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="py-2 flex flex-col border-b border-gray-50">
                <Link to="/shop?category=Traditional%20Rice" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Traditional Rice</Link>
                <Link to="/shop?category=Millets" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Millets</Link>
                <Link to="/shop?category=Ready%20to%20Cook" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Ready to Cook & Flour</Link>
                <Link to="/shop?category=Health%20Mix" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Health Mix & Malt</Link>
                <Link to="/shop?category=Combo%20Offer" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Combo Offer</Link>
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-bold text-[#1B4332] hover:text-[#86B841] border-t border-gray-100/50 mt-2">View All Products</Link>
              </div>
            </div>
          </div>

          <Link to="/our-farms" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">About Us</Link>
          
          {/* Policies Accordion */}
          <div>
            <button 
              onClick={() => setIsMobilePoliciesOpen(!isMobilePoliciesOpen)} 
              className="w-full px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              Policies 
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobilePoliciesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`bg-gray-50/50 overflow-hidden transition-all duration-300 ${isMobilePoliciesOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
              <div className="py-2 flex flex-col border-b border-gray-50">
                <Link to="/refund-policy" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Refund Policy</Link>
                <Link to="/terms-of-service" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Terms of Service</Link>
                <Link to="/privacy-policy" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 text-xs font-medium text-gray-600 hover:text-[#86B841]">Privacy Policy</Link>
                
              </div>
            </div>
          </div>

          <Link to="/git branchpolicies?tab=shipping" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Shipping & Bulk Orders</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Blog</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Contact Us</Link>
        </div>

        
      </div>

      {/* Search Dropdown */}
      <div 
        className={`absolute top-full left-0 w-full bg-white shadow-md border-b border-gray-100 transition-all duration-300 overflow-hidden z-40 ${isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="container mx-auto px-4 xl:px-8 py-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841] text-sm"
              />
            </div>
            <button 
              type="button" 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}