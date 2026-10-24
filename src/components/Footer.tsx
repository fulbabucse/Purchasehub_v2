import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { 
    t, 
    language, 
    setCurrentView, 
    settings, 
    getLocalized, 
    setSelectedCategorySlug 
  } = useApp();

  const handleNav = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryNav = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('all-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181C22] text-[#E2E8F0] border-t border-[#2A313C]">
      
      {/* 3 Value Pillars */}
      <div className="border-b border-[#2A313C] py-10 bg-[#14171C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#252C37] flex items-center justify-center text-[#E0A9B0] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {t('trust_authentic')}
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t('trust_authentic_sub')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#252C37] flex items-center justify-center text-[#E0A9B0] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {t('trust_delivery')}
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t('trust_delivery_sub')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#252C37] flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {t('trust_support')}
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t('trust_support_sub')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#D97793] flex items-center justify-center text-white font-serif-luxury font-bold text-base shadow-sm">
                P
              </div>
              <span className="font-serif-luxury text-xl font-bold tracking-tight text-white">
                PURCHASE HUB
              </span>
            </div>
            
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {getLocalized(settings.tagline_en, settings.tagline_bn)}
            </p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {language === 'bn' 
                ? 'আসল আন্তর্জাতিক কসমেটিকস, স্কিনকেয়ার ও সুগন্ধি পণ্য সহজে বাংলাদেশের গ্রাহকদের কাছে পৌঁছে দেওয়াই আমাদের লক্ষ্য।'
                : 'Your trusted destination for 100% genuine cosmetics, niche perfumes, and gentleman grooming in Bangladesh.'}
            </p>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#2A313C] pb-2">
              {language === 'bn' ? 'কালেকশনসমূহ' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button 
                  onClick={() => handleCategoryNav('beauty-skincare')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_beauty_skincare')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('perfume-fragrance')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_perfume_fragrance')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('mens-collection')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_mens')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('makeup')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_makeup')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('hair-care')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_haircare')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('lifestyle-accessories')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_lifestyle')}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#2A313C] pb-2">
              {t('footer_customer_service')}
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button 
                  onClick={() => handleNav('delivery-info')}
                  className="hover:text-white transition-colors"
                >
                  {t('policy_delivery')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('return-policy')}
                  className="hover:text-white transition-colors"
                >
                  {t('policy_returns')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('privacy-policy')}
                  className="hover:text-white transition-colors"
                >
                  {t('policy_privacy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('about-us')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact-us')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav_contact')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('admin')}
                  className="hover:text-[#E0A9B0] transition-colors"
                >
                  {t('nav_admin')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Order Hotlines */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#2A313C] pb-2">
              {t('footer_contact_info')}
            </h4>
            <div className="space-y-3 text-xs text-[#94A3B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                <span>{getLocalized(settings.address_en, settings.address_bn)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${(settings.whatsapp_number || '01705776631').replace(/[^0-9]/g, '').startsWith('01') ? '88' + (settings.whatsapp_number || '01705776631').replace(/[^0-9]/g, '') : (settings.whatsapp_number || '01705776631').replace(/[^0-9]/g, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-mono"
                >
                  {settings.whatsapp_number || '01705776631'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E0A9B0] shrink-0" />
                <a href={`tel:${settings.phone_number}`} className="hover:text-white font-mono">
                  {settings.phone_number}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#718096] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#718096] shrink-0 mt-0.5" />
                <span>{getLocalized(settings.opening_hours_en, settings.opening_hours_bn)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Information */}
      <div className="border-t border-[#2A313C] py-6 bg-[#111418] text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PURCHASE HUB. {t('rights_reserved')}</p>
          <div className="flex items-center gap-3">
            <span>{language === 'bn' ? 'অর্ডার প্রক্রিয়া: হোয়াটসঅ্যাপ ও সরাসরি ফোন কল' : 'Ordering: WhatsApp & Direct Phone Support'}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি প্রযোজ্য' : 'Cash on Delivery Available'}</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
