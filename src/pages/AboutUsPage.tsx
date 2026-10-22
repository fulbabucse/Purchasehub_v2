import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Sparkles, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutUsPage: React.FC = () => {
  const { language, t, settings, getLocalized, setCurrentView } = useApp();

  return (
    <div className="bg-[#FAF8F7] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FCE7EC] text-[#B76E79] text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PURCHASE HUB BANGLADESH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1E232A]">
            {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Purchase Hub'}
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            {getLocalized(settings.tagline_en, settings.tagline_bn)}
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EDE2E5] space-y-6 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1E232A]">
            {language === 'bn' ? 'আমাদের লক্ষ্য ও প্রতিশ্রুতি' : 'Our Mission & Commitment'}
          </h2>
          
          <div className="space-y-4 text-sm sm:text-base text-[#4A5568] leading-relaxed">
            <p>
              {language === 'bn' 
                ? 'Purchase Hub হলো বাংলাদেশে আসল এবং আন্তর্জাতিক মানের সৌন্দর্য, স্কিনকেয়ার ও পার্সোনাল গ্রুমিং পণ্যের একটি নির্ভরযোগ্য অনলাইন ক্যাটালগ। আমাদের পথচলার মূল লক্ষ্য হলো নকল ও নিম্নমানের পণ্যের ভিড়ে বাংলাদেশের সচেতন গ্রাহকদের কাছে শতভাগ আসল প্রসাধনী পৌঁছে দেওয়া।'
                : 'Purchase Hub is a premium bilingual product catalog serving discerning customers in Bangladesh with 100% authentic international skincare, luxury fragrances, makeup, and gentlemen’s grooming products.'}
            </p>
            <p>
              {language === 'bn'
                ? 'আমরা ফ্র্যান্স, যুক্তরাজ্য, যুক্তরাষ্ট্র এবং এশিয়ার বিশ্বস্ত ব্র্যান্ড ও তাদের অনুমোদিত ডিস্ট্রিবিউটরদের থেকে পণ্য সংগ্রহ করি। প্রতিটি পণ্যের ব্যাচ নম্বর, মেয়াদ এবং সঠিক উপাদান নিশ্চিত করেই আমরা আমাদের ক্যাটালগে অন্তর্ভুক্ত করি।'
                : 'We source directly through licensed channels and authorized brand partners to ensure uncompromised quality, correct batch traceability, and verified freshness.'}
            </p>
            <p>
              {language === 'bn'
                ? 'আমাদের ওয়েবসাইটে গ্রাহকরা পণ্য দেখে সরাসরি হোয়াটসঅ্যাপ বা ফোনের মাধ্যমে আমাদের দক্ষ প্রতিনিধিদের সাথে আলোচনা করে অর্ডার করতে পারেন। এর ফলে সঠিক স্কিনটাইপ অনুযায়ী পণ্য নির্বাচন এবং নিরাপদ ডেলিভারি নিশ্চিত হয়।'
                : 'Through direct phone and WhatsApp consultations, our beauty advisors help you pick ideal formulations for your skin type, ensuring zero guesswork and dependable customer support.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#F0E4E7]">
            <div className="p-4 bg-[#FAF8F7] rounded-xl border border-[#EDE2E5] space-y-2">
              <Award className="w-6 h-6 text-[#B76E79]" />
              <h3 className="font-semibold text-sm text-[#1E232A]">
                {language === 'bn' ? '১০০% আসল পণ্যের গ্যারান্টি' : '100% Genuine Guaranteed'}
              </h3>
              <p className="text-xs text-[#718096]">
                {language === 'bn' ? 'কোনোরূপ নকল বা গ্রে-মার্কেট পণ্য আমরা বিক্রি করি না।' : 'Strict zero-tolerance policy against counterfeit or grey-market replicas.'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F7] rounded-xl border border-[#EDE2E5] space-y-2">
              <HeartHandshake className="w-6 h-6 text-[#B76E79]" />
              <h3 className="font-semibold text-sm text-[#1E232A]">
                {language === 'bn' ? 'ব্যক্তিগত পরামর্শ' : 'Personal Consultation'}
              </h3>
              <p className="text-xs text-[#718096]">
                {language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি কথা বলে ত্বকের উপযুক্ত পণ্য বেছে নিন।' : 'Direct guidance via WhatsApp on shade matching and skin suitability.'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F7] rounded-xl border border-[#EDE2E5] space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#B76E79]" />
              <h3 className="font-semibold text-sm text-[#1E232A]">
                {language === 'bn' ? 'নিরাপদ ক্যাশ অন ডেলিভারি' : 'Reliable COD Service'}
              </h3>
              <p className="text-xs text-[#718096]">
                {language === 'bn' ? 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করার সুবিধা।' : 'Inspect package upon arrival and pay cash at your doorstep.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-[#1E232A] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold font-serif-luxury">
              {language === 'bn' ? 'যেকোনো জিজ্ঞাসায় আমাদের সাথে যোগাযোগ করুন' : 'Have a Question or Need Recommendations?'}
            </h3>
            <p className="text-xs text-[#A0AEC0]">
              {language === 'bn' ? 'আমাদের প্রতিনিধিরা আপনাকে সহায়তা করার জন্য প্রস্তুত।' : 'Our consultation team is available every day.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '+8801576924003').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setCurrentView('contact-us')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20"
            >
              {t('nav_contact')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
