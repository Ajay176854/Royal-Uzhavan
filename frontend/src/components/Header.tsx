import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, MessageCircle, ChevronDown, Menu, Leaf, X, User, LogOut, Truck, Wheat, Droplet } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/images/001.jpg';
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobilePoliciesOpen, setIsMobilePoliciesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, logout, setIsAuthOpen } = useAuth();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handleCloseMenu = () => setIsMobileMenuOpen(false);
    window.addEventListener('close-mobile-menu', handleCloseMenu);
    return () => window.removeEventListener('close-mobile-menu', handleCloseMenu);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm flex flex-col w-full border-b border-gray-100">
      {/* Tier 1: Top Announcement Bar */}
      <div className="bg-[#1B4332] text-white text-[11px] py-2.5 hidden md:flex justify-between items-center px-4 xl:px-12 font-bold tracking-wider">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" /> Free Shipping
        </div>
        <div className="flex items-center gap-2">
          <Wheat className="w-4 h-4" /> Direct From Tamilnadu Farmers
        </div>
        <div className="flex items-center gap-2">
          <Droplet className="w-4 h-4" /> Wood Cold-Pressed Oils Available
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
            <span className="text-[#C9A227] text-lg sm:text-xl md:text-2xl lg:text-[26px] font-serif font-bold tracking-tight leading-[0.85]">உழவன்</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] text-[#5c8a2b] font-black tracking-[0.2em] uppercase mt-1 md:mt-1.5 flex items-center gap-1">
              <span className="w-2.5 sm:w-3 md:w-4 h-[2px] bg-[#86B841]/40 rounded-full"></span>
              Feed The Future Grow With Nature <Wheat className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Visible on lg screens and up) */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-1 xl:gap-3 text-[10px] xl:text-xs font-bold uppercase tracking-wider text-gray-700 whitespace-nowrap">

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
                  {/* Col 1 */}
                  <div className="flex flex-col gap-5 lg:border-r lg:border-dashed lg:border-gray-200 lg:pr-8">
                    <Link to={`/shop?category=${encodeURIComponent('Royal Cattle Feed')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Royal Cattle Feed</span>
                        <span className="text-xs text-[#86B841] font-semibold">பசு தீவனம்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to={`/shop?category=${encodeURIComponent('Royal Hen Feed / Royal Kozhi Theevanam*')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Royal Hen Feed</span>
                        <span className="text-xs text-[#86B841] font-semibold">கோழி தீவனம்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to={`/shop?category=${encodeURIComponent('Royal Birds Food')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Royal Birds Food</span>
                        <span className="text-xs text-[#86B841] font-semibold">பறவைகள் உணவு</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                  {/* Col 2 */}
                  <div className="flex flex-col gap-5 lg:border-r lg:border-dashed lg:border-gray-200 lg:pr-8">
                    <Link to={`/shop?category=${encodeURIComponent('Royal oil-cake(Punnaku)')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Oil Cakes (Punnaku)</span>
                        <span className="text-xs text-[#86B841] font-semibold">புண்ணாக்கு வகைகள்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to={`/shop?category=${encodeURIComponent('Uzhavan Thavitu Vagaigal - nutrition')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Thavitu Vagaigal (Bran)</span>
                        <span className="text-xs text-[#86B841] font-semibold">தவிடு வகைகள்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                  {/* Col 3 */}
                  <div className="flex flex-col gap-5 lg:border-r lg:border-dashed lg:border-gray-200 lg:pr-8">
                    <Link to={`/shop?category=${encodeURIComponent('Cereals and Grains Category')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Cereals and Grains</span>
                        <span className="text-xs text-[#86B841] font-semibold">தானிய வகைகள்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to={`/shop?category=${encodeURIComponent('Uzhavan Thusi Vagaigal')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Uzhavan Thusi Vagaigal</span>
                        <span className="text-xs text-[#86B841] font-semibold">தூசி கழிவு வகைகள்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>

                  {/* Col 4 */}
                  <div className="flex flex-col gap-5">
                    <Link to={`/shop?category=${encodeURIComponent('Uzhavan Vittha Mattum Theevana Vagaigal')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Specialized Seed Feeds</span>
                        <span className="text-xs text-[#86B841] font-semibold">விதை தீவனம்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link to={`/shop?category=${encodeURIComponent('Hen and Pigeon Supplements')}`} className="flex justify-between items-start group/item">
                      <div>
                        <span className="text-sm font-bold text-gray-800 group-hover/item:text-[#86B841] leading-tight block">Hen & Pigeon Supplements</span>
                        <span className="text-xs text-[#86B841] font-semibold">சத்து மருந்துகள்</span>
                      </div>
                      <Leaf className="w-3.5 h-3.5 text-[#86B841] shrink-0 mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity" />
                    </Link>

                    {/* Quick Animal Landing Pages */}
                    <div className="pt-3 mt-1 border-t border-dashed border-gray-200">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#86B841] block mb-2.5">
                        Shop By Need (Specialized Care):
                      </span>
                      <div className="flex flex-col gap-2 pl-0.5">
                        <Link to="/cow" className="text-xs font-bold text-gray-700 hover:text-[#1B4332] flex items-center justify-between group/sub">
                          <span className="flex items-center gap-1.5">🐄 Cow & Cattle Feeds (பசு)</span>
                          <span className="text-[10px] text-[#86B841] font-semibold group-hover/sub:translate-x-0.5 transition-transform">→</span>
                        </Link>
                        <Link to="/pigeon" className="text-xs font-bold text-gray-700 hover:text-[#1B4332] flex items-center justify-between group/sub">
                          <span className="flex items-center gap-1.5">🕊️ Pigeon & Bird Mix (புறா)</span>
                          <span className="text-[10px] text-[#86B841] font-semibold group-hover/sub:translate-x-0.5 transition-transform">→</span>
                        </Link>
                        <Link to="/hen" className="text-xs font-bold text-gray-700 hover:text-[#1B4332] flex items-center justify-between group/sub">
                          <span className="flex items-center gap-1.5">🐔 Hen & Kozhi Feed (கோழி)</span>
                          <span className="text-[10px] text-[#86B841] font-semibold group-hover/sub:translate-x-0.5 transition-transform">→</span>
                        </Link>
                        <Link to="/pig" className="text-xs font-bold text-gray-700 hover:text-[#1B4332] flex items-center justify-between group/sub">
                          <span className="flex items-center gap-1.5">🐖 Pig & Swine Growth (பன்றி)</span>
                          <span className="text-[10px] text-[#86B841] font-semibold group-hover/sub:translate-x-0.5 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
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
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">

          {/* User Account Dropdown (Desktop) */}
          <div className="relative hidden lg:flex items-center group">
            {isLoggedIn ? (
              <>
                <button
                  className="flex items-center gap-1 text-gray-800 hover:text-[#86B841] transition-colors py-2 text-[10px] xl:text-xs font-bold uppercase tracking-wider cursor-default"
                >
                  <User className="w-4 h-4 text-[#86B841] mr-0.5" />
                  {user?.role === 'admin' ? 'ADMIN PANEL' : 'MY ACCOUNT'} <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#86B841]" strokeWidth={2.5} />
                </button>

                {/* Hover Bridge & Dropdown Menu */}
                <div className="absolute top-[100%] right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white shadow-xl border border-gray-100 rounded-xl py-2 min-w-[160px] translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Signed in as</span>
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                    </div>
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/account'}
                      className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] transition-colors"
                    >
                      {user?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                    </Link>
                    <button
                      onClick={() => { logout(); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1 text-gray-800 hover:text-[#86B841] transition-colors py-2 text-[10px] xl:text-xs font-bold uppercase tracking-wider"
              >
                <User className="w-4 h-4 text-gray-500" /> LOGIN / REGISTER
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (!isSearchOpen) setSearchQuery('');
              setIsSearchOpen(!isSearchOpen);
            }}
            className="text-gray-800 hover:text-[#86B841] transition-colors p-1.5 rounded-full hover:bg-gray-100"
            title="Search Products"
          >
            <Search className="w-5 h-5" strokeWidth={2} />
          </button>

          <Link to="/account" className="relative flex text-gray-800 hover:text-[#86B841] transition-colors p-1.5 rounded-full hover:bg-gray-100" title="Wishlist">
            <Heart className="w-5 h-5" strokeWidth={2} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#1B4332] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex bg-[#86B841] text-white w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center hover:bg-[#729c36] transition-colors shadow-sm shrink-0"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 bg-[#1B4332] text-white text-[9px] md:text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border border-white">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-800 p-1.5 hover:text-[#1B4332] rounded-full hover:bg-gray-100 transition-colors ml-0.5" title="Menu">
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[380px] bg-white shadow-2xl z-[100] flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-full border border-white shadow-xs" />
            <span className="font-serif font-bold text-[#1B4332] text-lg">Royal உழவன்</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Bar in Mobile Drawer */}
        <div className="bg-[#1B4332] text-white px-5 py-3 flex items-center justify-between">
          {isLoggedIn ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#86B841] flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight truncate max-w-[150px]">{user?.name || 'User'}</p>
                  <Link 
                    to={user?.role === 'admin' ? '/admin' : '/account'} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[10px] text-[#86B841] hover:underline font-semibold"
                  >
                    {user?.role === 'admin' ? 'Admin Dashboard →' : 'My Account →'}
                  </Link>
                </div>
              </div>
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-gray-200 font-medium">Welcome to Royal Uzhavan</span>
              <button
                onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                className="bg-[#86B841] hover:bg-[#729c36] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <User className="w-3.5 h-3.5" /> Login / Register
              </button>
            </div>
          )}
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2 flex flex-col">

          {/* Quick Animal Landing Shortcuts */}
          <div className="p-3 mx-3 my-2 bg-emerald-50/60 rounded-xl border border-emerald-100/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1B4332] block mb-2">Shop By Animal Feeds</span>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <Link to="/cow" onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-2 rounded-lg border border-emerald-100 hover:border-[#86B841] transition-all flex flex-col items-center">
                <span className="text-base">🐄</span>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">Cattle</span>
              </Link>
              <Link to="/pigeon" onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-2 rounded-lg border border-emerald-100 hover:border-[#86B841] transition-all flex flex-col items-center">
                <span className="text-base">🕊️</span>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">Pigeon</span>
              </Link>
              <Link to="/hen" onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-2 rounded-lg border border-emerald-100 hover:border-[#86B841] transition-all flex flex-col items-center">
                <span className="text-base">🐔</span>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">Hen</span>
              </Link>
              <Link to="/pig" onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-2 rounded-lg border border-emerald-100 hover:border-[#86B841] transition-all flex flex-col items-center">
                <span className="text-base">🐖</span>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">Swine</span>
              </Link>
            </div>
          </div>

          {/* Products Accordion */}
          <div>
            <button
              onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
              className="w-full px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#86B841]" /> Shop Products
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`bg-gray-50/60 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
              <div className="py-2 flex flex-col border-b border-gray-100">
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-bold text-[#1B4332] hover:text-[#86B841] flex items-center justify-between">
                  <span>View All Categories (அனைத்தும்)</span>
                  <span>→</span>
                </Link>
                <div className="my-1 border-t border-gray-200/50"></div>
                <Link to={`/shop?category=${encodeURIComponent('Royal Cattle Feed')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Royal Cattle Feed</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">பசு தீவனம்</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Royal Hen Feed / Royal Kozhi Theevanam*')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Royal Hen Feed</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">கோழி தீவனம்</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Royal Birds Food')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Royal Birds Food</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">பறவைகள் உணவு</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Royal oil-cake(Punnaku)')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Oil Cakes (Punnaku)</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">புண்ணாக்கு வகைகள்</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Uzhavan Thavitu Vagaigal - nutrition')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Thavitu Vagaigal (Bran)</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">தவிடு வகைகள்</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Cereals and Grains Category')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Cereals & Grains</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">தானிய வகைகள்</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Uzhavan Thusi Vagaigal')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Uzhavan Thusi Vagaigal</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">தூசி கழிவு வகைகள்</span>
                </Link>
                <Link to={`/shop?category=${encodeURIComponent('Hen and Pigeon Supplements')}`} onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841] flex justify-between items-center">
                  <span>Hen & Pigeon Supplements</span>
                  <span className="text-[11px] text-[#86B841] font-semibold">சத்து மருந்துகள்</span>
                </Link>
              </div>
            </div>
          </div>

          <Link to="/our-farms" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">About Us</Link>

          {/* Policies Accordion */}
          <div>
            <button
              onClick={() => setIsMobilePoliciesOpen(!isMobilePoliciesOpen)}
              className="w-full px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span>Policies</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobilePoliciesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`bg-gray-50/60 overflow-hidden transition-all duration-300 ${isMobilePoliciesOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
              <div className="py-2 flex flex-col border-b border-gray-100">
                <Link to="/refund-policy" onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841]">Refund Policy</Link>
                <Link to="/terms-of-service" onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841]">Terms of Service</Link>
                <Link to="/privacy-policy" onClick={() => setIsMobileMenuOpen(false)} className="px-7 py-2 text-xs font-medium text-gray-700 hover:text-[#86B841]">Privacy Policy</Link>
              </div>
            </div>
          </div>

          <Link to="/policies?tab=shipping" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Shipping & Bulk Orders</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Blog</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-50 hover:bg-gray-50 transition-colors">Contact Us</Link>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span>Need Help?</span>
          <a href="https://wa.me/918072864890" target="_blank" rel="noopener noreferrer" className="text-[#1B4332] font-bold flex items-center gap-1 hover:underline">
            <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Support
          </a>
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
                autoComplete="off"
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841] text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
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
