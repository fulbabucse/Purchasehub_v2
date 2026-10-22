import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactUsPage: React.FC = () => {
  const { language, t, settings, getLocalized, getCallOrderUrl, showToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleCustomWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;

    const rawNumber = settings.whatsapp_number || '+8801576924003';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    const greeting = language === 'bn' 
      ? `আসসালামু আলাইকুম Purchase Hub,\nনাম: ${contactName || 'গ্রাহক'}\nফোন: ${contactPhone || 'প্রযোজ্য নয়'}\nবার্তা: ${contactMsg}`
      : `Hello Purchase Hub,\nName: ${contactName || 'Customer'}\nPhone: ${contactPhone || 'N/A'}\nMessage: ${contactMsg}`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট চালু হচ্ছে...' : 'Opening WhatsApp conversation...', 'info');
  };

  return (
    <div className="bg-[#FAF8F7] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FCE7EC] text-[#B76E79] text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'গ্রাহক সেবা ও যোগাযোগ' : 'CUSTOMER CONCIERGE'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1E232A]">
            {t('nav_contact')}
          </h1>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto">
            {language === 'bn' 
              ? 'পণ্য সম্পর্কে জানতে, স্টক চেক করতে বা অর্ডার করতে সরাসরি আমাদের সাথে যোগাযোগ করুন।' 
              : 'Reach out to our beauty advisors directly via phone, WhatsApp, or email.'}
          </p>
        </div>

        {/* 2-Column Contact Info + Direct WhatsApp Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Official Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE2E5] space-y-6 shadow-xs">
            <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury border-b border-[#F0E4E7] pb-3">
              {language === 'bn' ? 'দোকানের ঠিকানা ও হটলাইন' : 'Storefront & Contact Channels'}
            </h2>

            <div className="space-y-5 text-sm text-[#4A5568]">
              
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5F6] flex items-center justify-center text-[#B76E79] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0] block">
                    {t('footer_address')}
                  </span>
                  <span className="font-medium text-[#1E232A] leading-relaxed">
                    {getLocalized(settings.address_en, settings.address_bn)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0] block">
                    {t('footer_whatsapp')}
                  </span>
                  <a 
                    href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1E232A] hover:text-emerald-600 font-mono"
                  >
                    {settings.whatsapp_number}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FCE7EC] flex items-center justify-center text-[#B76E79] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0] block">
                    {t('footer_phone')}
                  </span>
                  <a 
                    href={getCallOrderUrl()}
                    className="font-medium text-[#1E232A] hover:text-[#B76E79] font-mono"
                  >
                    {settings.phone_number}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5F6] flex items-center justify-center text-[#718096] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0] block">
                    {t('footer_email')}
                  </span>
                  <a href={`mailto:${settings.email}`} className="font-medium text-[#1E232A] hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5F6] flex items-center justify-center text-[#718096] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0] block">
                    {t('footer_hours')}
                  </span>
                  <span className="font-medium text-[#1E232A]">
                    {getLocalized(settings.opening_hours_en, settings.opening_hours_bn)}
                  </span>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#F0E4E7]">
              <a
                href={getCallOrderUrl()}
                className="w-full py-3 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-rose-300" />
                <span>{language === 'bn' ? 'সরাসরি ফোন করুন' : 'Call Store Manager'}</span>
              </a>
            </div>

          </div>

          {/* Card 2: Interactive WhatsApp Message Composer */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE2E5] space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                {language === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপে বার্তা পাঠান' : 'Send Direct WhatsApp Inquiry'}
              </h2>
              <p className="text-xs text-[#718096] mt-1">
                {language === 'bn' 
                  ? 'আপনার পছন্দসই পণ্য বা ত্বকের ধরন সম্পর্কে লিখে পাঠালে আমাদের বিউটি এক্সপার্ট পরামর্শ দেবেন।'
                  : 'Compose your query or shade inquiry to start chatting on WhatsApp instantly.'}
              </p>
            </div>

            <form onSubmit={handleCustomWhatsAppSend} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1">
                  {language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: আহমেদ খান' : 'e.g. Ahmed Khan'}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1">
                  {language === 'bn' ? 'আপনার জিজ্ঞাসা বা বার্তা' : 'Your Inquiry or Message'} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder={language === 'bn' ? 'আমি এই পারফিউম/স্কিনকেয়ার পণ্যের স্টক সম্পর্কে জানতে চাই...' : 'I would like to inquire about product stock, ingredients, or order details...'}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send via WhatsApp'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
