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
  ShoppingBag
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
    setSelectedCategorySlug
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
                {language === 'bn' 
                  ? 'সারা বাংলাদেশে হোম ডেলিভারি | ১০০% আসল পণ্য' 
                  : 'Nationwide Delivery in Bangladesh | 100% Authentic'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px] sm:text-xs">
              <a 
                href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsapp_number}</span>
              </a>
              <a 
                href={getCallOrderUrl()} 
                className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-300" />
                <span>{settings.phone_number}</span>
              </a>
              <button 
                onClick={() => handleNav('admin')}
                className="inline-flex items-center gap-1 text-[#E0A9B0] hover:text-white transition-colors font-medium cursor-pointer"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? (language === 'bn' ? 'অ্যাডমিন' : 'Admin') : (language === 'bn' ? 'অ্যাডমিন' : 'Admin')}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Navbar: Responsive 3-Zone Contract */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          
          {/* Zone 1: Single Brand Wordmark */}
          <button 
            onClick={() => handleNav('home')} 
            className="text-left group whitespace-nowrap shrink-0 flex items-center gap-2 min-w-0 cursor-pointer"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#D97793] flex items-center justify-center text-white font-serif-luxury font-bold text-sm sm:text-base shadow-sm shrink-0">
              P
            </div>
            <span className="font-serif-luxury text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-[#1E232A] group-hover:text-[#B76E79] transition-colors truncate">
              PURCHASE HUB
            </span>
          </button>

          {/* Zone 2: 4-5 Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-[#4A5568]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.view)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  currentView === item.view 
                    ? 'text-[#B76E79] font-semibold' 
                    : 'hover:text-[#1E232A]'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B76E79] rounded-full" />
                )}
              </button>
            ))}
            <button
              onClick={() => handleNav('about-us')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentView === 'about-us' ? 'text-[#B76E79] font-semibold' : 'hover:text-[#1E232A]'
              }`}
            >
              {t('nav_about')}
            </button>
            <button
              onClick={() => handleNav('contact-us')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentView === 'contact-us' ? 'text-[#B76E79] font-semibold' : 'hover:text-[#1E232A]'
              }`}
            >
              {t('nav_contact')}
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Quick Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4A5568] hover:text-[#1E232A] hover:bg-[#F3E8EB]/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Language Switcher Button (Bengali / English) */}
            <div className="flex items-center bg-[#F3E8EB] p-0.5 rounded-lg border border-[#E8D4D9]">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  language === 'bn' 
                    ? 'bg-white text-[#1E232A] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#1E232A]'
                }`}
                title="বাংলা ভাষা"
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  language === 'en' 
                    ? 'bg-white text-[#1E232A] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#1E232A]'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* WhatsApp CTA (Desktop) */}
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#1E232A] hover:bg-[#2D3748] rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('whatsapp_order_header')}</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#1E232A] hover:bg-[#F3E8EB]/60 rounded-xl transition-colors cursor-pointer"
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

              {/* Language Switcher in Drawer */}
              <div className="flex items-center justify-between p-2.5 bg-[#FAF8F7] rounded-xl border border-[#EDE2E5]">
                <span className="text-xs font-semibold text-[#718096]">
                  {language === 'bn' ? 'ভাষা পরিবর্তন করুন' : 'Select Language'}:
                </span>
                <div className="flex items-center bg-[#EDE2E5] p-0.5 rounded-lg">
                  <button
                    onClick={() => setLanguage('bn')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      language === 'bn' ? 'bg-white text-[#1E232A] shadow-xs' : 'text-[#718096]'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      language === 'en' ? 'bg-white text-[#1E232A] shadow-xs' : 'text-[#718096]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0AEC0] block mb-2 px-2">
                  {language === 'bn' ? 'ক্যাটালগ মেনু' : 'Navigation Menu'}
                </span>

                {[
                  { label: t('nav_home'), view: 'home' },
                  { label: t('nav_all_products'), view: 'all-products' },
                  { label: t('nav_beauty_skincare'), view: 'beauty-skincare', slug: 'beauty-skincare' },
                  { label: t('nav_perfume'), view: 'perfume-fragrance', slug: 'perfume-fragrance' },
                  { label: t('nav_mens'), view: 'mens-collection', slug: 'mens-collection' },
                  { label: t('nav_womens'), view: 'womens-collection', slug: 'womens-collection' },
                  { label: t('nav_makeup'), view: 'makeup', slug: 'makeup' },
                  { label: t('nav_haircare'), view: 'hair-care', slug: 'hair-care' },
                  { label: t('nav_grooming'), view: 'personal-care-grooming', slug: 'personal-care-grooming' },
                  { label: t('nav_lifestyle'), view: 'lifestyle-accessories', slug: 'lifestyle-accessories' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.view, item.slug)}
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
                  {language === 'bn' ? 'তথ্য ও পলিসি' : 'Information & Policies'}
                </span>
                {[
                  { label: t('nav_about'), view: 'about-us' },
                  { label: t('nav_contact'), view: 'contact-us' },
                  { label: t('policy_delivery'), view: 'delivery-info' },
                  { label: t('policy_returns'), view: 'return-policy' },
                  { label: t('policy_privacy'), view: 'privacy-policy' },
                  { label: t('nav_admin'), view: 'admin' },
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
                href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {settings.whatsapp_number}</span>
              </a>
              <a
                href={getCallOrderUrl()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-xs font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-300" />
                <span>{language === 'bn' ? 'সরাসরি কল করুন' : 'Call to Order'}: {settings.phone_number}</span>
              </a>
            </div>

          </div>

        </div>
      )}
    </>
  );
};
