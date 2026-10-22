import React from 'react';
import { ShieldCheck, Lock, EyeOff, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { language, t, settings } = useApp();

  return (
    <div className="bg-[#FAF8F7] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FCE7EC] text-[#B76E79] text-xs font-semibold rounded-full uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'তথ্য সুরক্ষা' : 'DATA PRIVACY'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1E232A]">
            {t('policy_privacy')}
          </h1>
          <p className="text-sm text-[#64748B]">
            {language === 'bn' 
              ? 'Purchase Hub এ আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা সংক্রান্ত নীতিমালা' 
              : 'Our commitment to protecting your personal information and delivery details'}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EDE2E5] space-y-6 text-sm text-[#4A5568] leading-relaxed shadow-xs">
          
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? '১. সংগৃহীত তথ্য' : '1. Collected Information'}</span>
            </h2>
            <p>
              {language === 'bn'
                ? 'আমরা শুধুমাত্র পণ্য ডেলিভারি সম্পন্ন করার জন্য প্রয়োজনীয় প্রাথমিক তথ্য (যেমন: আপনার নাম, মোবাইল নম্বর এবং ডেলিভারি ঠিকানা) সংগ্রহ করি যা আপনি নিজে হোয়াটসঅ্যাপ বা ফোনের মাধ্যমে প্রদান করেন।'
                : 'We collect only the essential details necessary to fulfill courier dispatch—specifically your name, delivery address, and telephone number provided directly during WhatsApp or phone interactions.'}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base sm:text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#B76E79]" />
              <span>{language === 'bn' ? '২. কোনো অনলাইন আর্থিক তথ্য সংরক্ষণ নয়' : '2. No Sensitive Payment Stored'}</span>
            </h2>
            <p>
              {language === 'bn'
                ? 'Purchase Hub ওয়েবসাইট কোনো ব্যাংক কার্ড, ক্রেডিট কার্ড বা গোপন পিন তথ্য চায় না বা সংরক্ষণ করে না। সমস্ত লেনদেন পণ্য প্রাপ্তির পর ক্যাশ অন ডেলিভারি (Cash on Delivery) পদ্ধতিতে সম্পন্ন হয়।'
                : 'Purchase Hub is a catalog website. We never prompt for, handle, or store debit/credit card numbers or banking secrets. Payment is settled via direct Cash on Delivery (COD) upon inspection.'}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base sm:text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <span>{language === 'bn' ? '৩. তৃতীয় পক্ষের সাথে তথ্য আদান-প্রদান নয়' : '3. Non-Disclosure Commitment'}</span>
            </h2>
            <p>
              {language === 'bn'
                ? 'আপনার ফোন নম্বর বা ব্যক্তিগত তথ্য কোনো অবস্থাতেই তৃতীয় কোনো বাণিজ্যিক প্রতিষ্ঠান বা বিপণন এজেন্সির কাছে বিক্রি বা হস্তান্তর করা হয় না।'
                : 'Your contact details are strictly restricted to shipping logistics and order confirmation. We never sell or distribute user information to external third parties.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
