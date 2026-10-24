import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Package,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    currentView, 
    setCurrentView, 
    searchQuery, 
    setSearchQuery,
    settings,
    getCallOrderUrl,
    isAdminLoggedIn,
    setSelectedCategorySlug,
    cart,
    setIsCartOpen,
    setIsTrackingModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: t('nav_home'), view: 'home' as const },
    { id: 'all-products', label: t('nav_all_products'), view: 'all-products' as const },
    { id: 'beauty-skincare', label: t('nav_beauty_skincare'), view: 'beauty-skincare' as const },
    { id: 'perfume-fragrance', label: t('nav_perfume_fragrance'), view: 'perfume-fragrance' as const },
    { id: 'mens-collection', label: t('nav_mens'), view: 'mens-collection' as const },
  ];

  const handleNav = (view: any, categorySlug?: string) => {
    if (categorySlug !== undefined) {
      setSelectedCategorySlug(categorySlug);
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('all-products');
      setSearchOpen(false);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F7] border-b border-[#F0E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        
        {/* Top Notice Bar */}
        <div className="bg-[#1E232A] text-[#F3E8EB] text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-medium tracking-wide truncate">
                Nationwide Delivery in Bangladesh | 100% Authentic Products
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px] sm:text-xs">
              <a 
                href={`https://wa.me/8801705776631`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsapp_number || '01705776631'}</span>
              </a>
              <a 
                href={getCallOrderUrl()} 
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-300" />
                <span>Call: {settings.phone_number || '01705776631'}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Main Navbar: Responsive 3-Zone Contract with Laptop & Desktop Polish */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 lg:gap-4 xl:gap-6">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => handleNav('home')} 
            className="text-left group whitespace-nowrap shrink-0 flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#D97793] flex items-center justify-center text-white font-serif-luxury font-bold text-sm shadow-sm shrink-0">
              P
            </div>
            <span className="font-serif-luxury text-lg sm:text-xl lg:text-xl xl:text-2xl font-bold tracking-tight text-[#1E232A] group-hover:text-[#B76E79] transition-colors truncate">
              PURCHASE HUB
            </span>
          </button>

          {/* Zone 2: Navigation Links (Desktop & Laptop) */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6 text-xs xl:text-sm font-medium text-[#4A5568]">
            <button
              onClick={() => handleNav('home')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'home' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('all-products')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'all-products' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNav('beauty-skincare', 'beauty-skincare')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'beauty-skincare' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              Beauty & Skincare
            </button>
            <button
              onClick={() => handleNav('womens-collection', 'womens-collection')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'womens-collection' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              Lady's
            </button>
            <button
              onClick={() => handleNav('mens-collection', 'mens-collection')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'mens-collection' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              Gent's
            </button>
            <button
              onClick={() => handleNav('electric-gadgets', 'electric-gadgets')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'electric-gadgets' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              Electric & Gadgets
            </button>
            <button
              onClick={() => handleNav('about-us')}
              className={`whitespace-nowrap transition-colors py-1 px-1 cursor-pointer ${
                currentView === 'about-us' ? 'text-[#B76E79] font-bold border-b-2 border-[#B76E79]' : 'hover:text-[#1E232A]'
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4A5568] hover:text-[#1E232A] hover:bg-[#F3E8EB]/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Search Catalog"
              title="Search Catalog"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Track Order Button */}
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1E232A] hover:text-[#B76E79] bg-white hover:bg-[#FDF2F4] border border-[#E8D4D9] rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="Track Order by Phone or Email"
            >
              <Package className="w-3.5 h-3.5 text-[#B76E79] shrink-0" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Shopping Bag / Cart Drawer Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1E232A] hover:text-[#B76E79] bg-white hover:bg-[#FDF2F4] border border-[#E8D4D9] rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#B76E79] shrink-0" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartItems > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* WhatsApp CTA (Visible on desktop & laptop) */}
            <a
              href={`https://wa.me/8801705776631`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shadow-xs"
              title="Chat on WhatsApp: 01705776631"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#1E232A] hover:bg-[#F3E8EB]/60 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

          </div>
        </div>

        {/* Expandable Search Input Bar (Dropdown below header) */}
        {searchOpen && (
          <div className="bg-[#FAF8F7] border-t border-[#F0E4E7] py-3 px-4 shadow-sm animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'খুঁজুন' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </header>

      {/* FULL-SCREEN MOBILE DRAWER (Rendered outside header to avoid backdrop-filter clipping bug) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Menu */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#F0E4E7] flex items-center justify-between bg-[#FAF8F7]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#D97793] flex items-center justify-center text-white font-serif-luxury font-bold text-sm shadow-sm">
                  P
                </div>
                <span className="font-serif-luxury font-bold text-base text-[#1E232A]">
                  PURCHASE HUB
                </span>
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* In-Drawer Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </form>

              {/* Order Tracking & Cart in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTrackingModalOpen(true);
                  }}
                  className="p-3 bg-white rounded-xl border border-[#EDE2E5] hover:border-[#B76E79] text-left transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-[#B76E79]" />
                    <span className="font-bold text-xs text-[#1E232A] group-hover:text-[#B76E79]">
                      Track Order
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    By Phone or Email
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="p-3 bg-white rounded-xl border border-[#EDE2E5] hover:border-[#B76E79] text-left transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#B76E79]" />
                      <span className="font-bold text-xs text-[#1E232A] group-hover:text-[#B76E79]">
                        Shopping Bag
                      </span>
                    </div>
                    {totalCartItems > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold">
                        {totalCartItems}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500">
                    {totalCartItems > 0 
                      ? `${totalCartItems} items`
                      : 'Bag empty'}
                  </p>
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0AEC0] block mb-2 px-2">
                  Catalog Menu
                </span>

                {[
                  { label: 'Home', view: 'home' },
                  { label: 'Shop', view: 'all-products' },
                  { label: 'Beauty & Skincare', view: 'beauty-skincare', slug: 'beauty-skincare' },
                  { label: "Lady's", view: 'womens-collection', slug: 'womens-collection' },
                  { label: "Gent's", view: 'mens-collection', slug: 'mens-collection' },
                  { label: 'Electric & Gadgets', view: 'electric-gadgets', slug: 'electric-gadgets' },
                  { label: 'About', view: 'about-us' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.view, (item as any).slug)}
                    className={`w-full text-left py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      currentView === item.view 
                        ? 'bg-[#FDF2F4] text-[#B76E79]' 
                        : 'text-[#2D3748] hover:bg-[#FAF8F7]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Information & Policies */}
              <div className="pt-3 border-t border-[#F0E4E7] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0AEC0] block mb-1 px-2">
                  Customer Care & Policies
                </span>
                {[
                  { label: t('nav_about'), view: 'about-us' },
                  { label: t('nav_contact'), view: 'contact-us' },
                  { label: t('policy_delivery'), view: 'delivery-info' },
                  { label: t('policy_returns'), view: 'return-policy' },
                  { label: t('policy_privacy'), view: 'privacy-policy' },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => handleNav(item.view)}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#4A5568] hover:bg-[#FAF8F7] hover:text-[#1E232A] flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                ))}
              </div>

            </div>

            {/* Drawer Footer Actions (WhatsApp & Call) */}
            <div className="p-4 border-t border-[#F0E4E7] bg-[#FAF8F7] space-y-2">
              <a
                href={`https://wa.me/8801705776631`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {settings.whatsapp_number || '01705776631'}</span>
              </a>
              <a
                href={getCallOrderUrl()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-xs font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-300" />
                <span>Call to Order: {settings.phone_number || '01705776631'}</span>
              </a>
            </div>

          </div>

        </div>
      )}
    </>
  );
};
