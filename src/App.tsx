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
import { CartDrawer } from './components/CartDrawer';
import { PlaceOrderModal } from './components/PlaceOrderModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
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
    getLocalized,
    setSelectedCategorySlug
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

            {/* 6. Dedicated Personal Beauty Advisor Section */}
            <section className="py-16 bg-gradient-to-b from-[#181C22] to-[#1F252E] text-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-[#E0A9B0] border border-white/10 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#E0A9B0]" />
                    <span>PERSONAL BEAUTY ADVISOR</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-bold text-white">
                    Personalized Skincare & Beauty Routine Consultation
                  </h2>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    Unsure which formulation or shade matches your skin profile? Explore our specialist-curated routines designed for authentic, lasting results.
                  </p>
                </div>

                {/* 3 Advisor Routine Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#B76E79]/50 transition-all space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#B76E79]/20 text-[#E0A9B0] flex items-center justify-center font-bold text-sm">
                        01
                      </div>
                      <h3 className="text-base font-semibold text-white font-serif-luxury">
                        Skin Type & Barrier Care
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Formulations for deep hydration, active brightening, gentle oil balance, and moisture barrier rejuvenation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategorySlug('beauty-skincare');
                        setCurrentView('beauty-skincare');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-[#B76E79] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Explore Skincare Regimen
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#B76E79]/50 transition-all space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#B76E79]/20 text-[#E0A9B0] flex items-center justify-center font-bold text-sm">
                        02
                      </div>
                      <h3 className="text-base font-semibold text-white font-serif-luxury">
                        Lady's Cosmetics & Glow
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Curated shades, hydrating lip serums, and weightless mineral cosmetics that blend seamlessly for every occasion.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategorySlug('womens-collection');
                        setCurrentView('womens-collection');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-[#B76E79] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Browse Lady's Collection
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#B76E79]/50 transition-all space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#B76E79]/20 text-[#E0A9B0] flex items-center justify-center font-bold text-sm">
                        03
                      </div>
                      <h3 className="text-base font-semibold text-white font-serif-luxury">
                        Gent's Grooming & Beard Care
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Targeted solutions for coarse beard conditioning, clean shave soothing, electric trimming, and energizing hygiene.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategorySlug('mens-collection');
                        setCurrentView('mens-collection');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-[#B76E79] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Explore Gent's Regimen
                    </button>
                  </div>

                </div>

                {/* Direct Consultation Hotline */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Need Live Beauty Routine Advice?
                      </h4>
                      <p className="text-xs text-gray-400">
                        Speak directly with our in-house cosmetic advisor during store hours
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${settings.phone_number || '01705776631'}`}
                    className="px-5 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Advisor: {settings.phone_number || '01705776631'}</span>
                  </a>
                </div>

              </div>
            </section>
          </>
        );

      case 'all-products':
        return <ProductGrid title="Shop - All Collections" />;

      case 'beauty-skincare':
        return <ProductGrid title="Beauty & Skincare" categoryFilterOverride="beauty-skincare" />;

      case 'womens-collection':
        return <ProductGrid title="Lady's Collection" categoryFilterOverride="womens-collection" />;

      case 'mens-collection':
        return <ProductGrid title="Gent's Collection" categoryFilterOverride="mens-collection" />;

      case 'electric-gadgets':
        return <ProductGrid title="Electric & Gadgets" categoryFilterOverride="electric-gadgets" />;

      case 'perfume-fragrance':
        return <ProductGrid title="Fragrances" categoryFilterOverride="perfume-fragrance" />;

      case 'makeup':
        return <ProductGrid title="Makeup & Cosmetics" categoryFilterOverride="makeup" />;

      case 'hair-care':
        return <ProductGrid title="Hair Care" categoryFilterOverride="hair-care" />;

      case 'personal-care-grooming':
        return <ProductGrid title="Personal Care & Grooming" categoryFilterOverride="personal-care-grooming" />;

      case 'lifestyle-accessories':
        return <ProductGrid title="Lifestyle & Accessories" categoryFilterOverride="lifestyle-accessories" />;

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

        {/* WhatsApp Quick Chat Floating Pill (Hidden on home page per user request) */}
        {currentView !== 'home' && (
          <a
            href={`https://wa.me/${(settings.whatsapp_number || '01705776631').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-105"
            title="Direct WhatsApp Support: 01705776631"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
              Order on WhatsApp
            </span>
          </a>
        )}

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

      {/* Shopping Bag / Cart Drawer */}
      <CartDrawer />

      {/* Place Order Checkout Modal */}
      <PlaceOrderModal />

      {/* Order Tracker Modal (Filtered by Mobile Phone or Email Account) */}
      <OrderTrackerModal />

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
