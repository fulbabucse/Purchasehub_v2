import React, { useEffect, useState } from 'react';
import { AppProvider, useApp, PageView } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { ShopByCategory } from './components/ShopByCategory';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { DeliveryInfoPage } from './pages/DeliveryInfoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MessageCircle, Phone, ArrowUp, Sparkles, Check, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    navigateToProduct, 
    language, 
    t, 
    settings, 
    toasts, 
    removeToast,
    products,
    selectedProductId,
    getLocalized
  } = useApp();

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle URL hash changes for deep linking (e.g. #admin, #product/xyz)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product/')) {
        const prodId = hash.replace('product/', '');
        navigateToProduct(prodId);
      } else if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'about-us') {
        setCurrentView('about-us');
      } else if (hash === 'contact-us') {
        setCurrentView('contact-us');
      } else if (hash === 'privacy-policy') {
        setCurrentView('privacy-policy');
      } else if (hash === 'return-policy') {
        setCurrentView('return-policy');
      } else if (hash === 'delivery-info') {
        setCurrentView('delivery-info');
      } else if (hash === 'all-products' || hash === 'products') {
        setCurrentView('all-products');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on mount

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sync Schema.org JSON-LD structured data for SEO
  useEffect(() => {
    const selectedProd = products.find(p => p.id === selectedProductId);
    let schemaData: any;

    if (currentView === 'product-details' && selectedProd) {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: selectedProd.name_en,
        description: selectedProd.description_en,
        sku: selectedProd.sku,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BDT',
          price: selectedProd.sale_price ?? selectedProd.price,
          availability: selectedProd.stock_quantity > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Purchase Hub'
          }
        }
      };
    } else {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Purchase Hub',
        description: 'Bilingual cosmetics, skincare, luxury perfume, men\'s grooming, and lifestyle accessories catalog in Bangladesh.',
        telephone: settings.phone_number,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Nilachal, 408/2, North Kazipara, Mirpur',
          addressLocality: 'Dhaka',
          postalCode: '1216',
          addressCountry: 'BD'
        },
        priceRange: '৳৳'
      };
    }

    const scriptId = 'json-ld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [currentView, selectedProductId, products, settings]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render view router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {/* 1. Hero Banner Slider */}
            <HeroSlider />

            {/* 2. Shop by Category */}
            <ShopByCategory />

            {/* 3. Featured Products */}
            <div id="featured" className="py-8 bg-white border-y border-[#EDE2E5]">
              <ProductGrid 
                title={t('section_featured')} 
                onlyFeatured={true}
              />
            </div>

            {/* 4. New Arrivals Showcase */}
            <div className="py-8 bg-[#FAF8F7]">
              <ProductGrid 
                title={t('section_new_arrivals')} 
                onlyNewArrivals={true}
              />
            </div>

            {/* 5. Best Sellers */}
            <div className="py-8 bg-white border-t border-[#EDE2E5]">
              <ProductGrid 
                title={t('section_best_sellers')} 
                onlyBestSellers={true}
              />
            </div>

            {/* 6. WhatsApp Concierge VIP Section */}
            <section className="py-16 bg-[#181C22] text-white">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-[#E0A9B0] border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ব্যক্তিগত পরামর্শ ও অর্ডার' : 'PERSONAL BEAUTY ADVISOR'}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-bold text-white max-w-2xl mx-auto">
                  {language === 'bn' 
                    ? 'আপনার ত্বকের জন্য কোনটি উপযুক্ত? কথা বলুন আমাদের সাথে' 
                    : 'Unsure which product fits your skin routine? Chat with our specialist'}
                </h2>

                <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'হোয়াটসঅ্যাপে সরাসরি চ্যাট করে পছন্দের শেড, ইনগ্রিডিয়েন্টস বা ব্যবহারবিধি সম্পর্কে বিস্তারিত জানুন।'
                    : 'Receive expert shade matching and cosmetic recommendations instantly on WhatsApp.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2.5 shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp: {settings.whatsapp_number}</span>
                  </a>

                  <a
                    href={`tel:${settings.phone_number}`}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl flex items-center gap-2 border border-white/20 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-rose-300" />
                    <span>{settings.phone_number}</span>
                  </a>
                </div>
              </div>
            </section>
          </>
        );

      case 'all-products':
        return <ProductGrid title={t('nav_all_products')} />;

      case 'beauty-skincare':
        return <ProductGrid title={t('nav_beauty_skincare')} categoryFilterOverride="beauty-skincare" />;

      case 'perfume-fragrance':
        return <ProductGrid title={t('nav_perfume_fragrance')} categoryFilterOverride="perfume-fragrance" />;

      case 'mens-collection':
        return <ProductGrid title={t('nav_mens')} categoryFilterOverride="mens-collection" />;

      case 'womens-collection':
        return <ProductGrid title={t('nav_womens')} categoryFilterOverride="womens-collection" />;

      case 'makeup':
        return <ProductGrid title={t('nav_makeup')} categoryFilterOverride="makeup" />;

      case 'hair-care':
        return <ProductGrid title={t('nav_haircare')} categoryFilterOverride="hair-care" />;

      case 'personal-care-grooming':
        return <ProductGrid title={t('nav_grooming')} categoryFilterOverride="personal-care-grooming" />;

      case 'lifestyle-accessories':
        return <ProductGrid title={t('nav_lifestyle')} categoryFilterOverride="lifestyle-accessories" />;

      case 'product-details':
        return <ProductDetailsPage />;

      case 'about-us':
        return <AboutUsPage />;

      case 'contact-us':
        return <ContactUsPage />;

      case 'privacy-policy':
        return <PrivacyPolicyPage />;

      case 'return-policy':
        return <ReturnPolicyPage />;

      case 'delivery-info':
        return <DeliveryInfoPage />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1E232A] bg-[#FAF8F7] selection:bg-[#E89BAE]/30">
      
      {/* 1. Header (Top Bar Contract) */}
      <Header />

      {/* 2. Main Page Content View */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* 3. Footer */}
      {currentView !== 'admin' && <Footer />}

      {/* Floating Action Button: WhatsApp Order & Help Desk */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        
        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-10 h-10 rounded-full bg-white text-[#1E232A] border border-[#E5D5DA] shadow-md flex items-center justify-center hover:bg-[#FAF8F7] transition-all"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* WhatsApp Quick Chat Floating Pill */}
        <a
          href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-105"
          title="Direct WhatsApp Support"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
            {language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'Order on WhatsApp'}
          </span>
        </a>

      </div>

      {/* Global Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-lg border text-xs sm:text-sm font-medium flex items-center justify-between gap-3 transition-all ${
                toast.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                  : toast.type === 'info'
                  ? 'bg-sky-50 text-sky-900 border-sky-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'error' ? (
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
