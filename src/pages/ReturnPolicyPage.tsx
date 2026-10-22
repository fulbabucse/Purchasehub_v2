import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReturnPolicyPage: React.FC = () => {
  const { language, t, settings } = useApp();

  return (
    <div className="bg-[#FAF8F7] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FCE7EC] text-[#B76E79] text-xs font-semibold rounded-full uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'গ্রাহক অধিকার ও নীতি' : 'CUSTOMER PROTECTION'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1E232A]">
            {t('policy_returns')}
          </h1>
          <p className="text-sm text-[#64748B]">
            {language === 'bn' 
              ? 'আমাদের রিটার্ন, এক্সচেঞ্জ এবং রিফান্ড সংক্রান্ত স্বচ্ছ নীতিমালা' 
              : 'Our clear guidelines for product verification, replacement, and customer satisfaction'}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EDE2E5] space-y-8 text-sm text-[#4A5568] leading-relaxed shadow-xs">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? '১. কখন রিটার্ন বা এক্সচেঞ্জ প্রযোজ্য?' : '1. Eligibility for Return & Replacement'}</span>
            </h2>
            <ul className="space-y-2 list-disc list-inside pl-2">
              <li>
                {language === 'bn'
                  ? 'ডেলিভারির সময় পণ্যটি ভাঙা, ত্রুটিপূর্ণ বা ক্ষতিগ্রস্ত অবস্থায় পাওয়া গেলে।'
                  : 'If the item is received broken, leaking, or damaged during transit.'}
              </li>
              <li>
                {language === 'bn'
                  ? 'অর্ডারকৃত পণ্যের পরিবর্তে ভুল কোনো পণ্য ডেলিভারি হলে।'
                  : 'If you receive an incorrect product or different variant than ordered.'}
              </li>
              <li>
                {language === 'bn'
                  ? 'পণ্যের মেয়াদ উত্তীর্ণ থাকলে (যা আমাদের ক্ষেত্রে কঠোরভাবে পরীক্ষা করে রোধ করা হয়)।'
                  : 'In the rare event that an expired batch code is delivered.'}
              </li>
            </ul>
          </div>

          {/* Section 2: Non-returnable */}
          <div className="space-y-3 pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base sm:text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{language === 'bn' ? '২. স্বাস্থ্যবিধি ও অপরিবর্তনযোগ্য শর্ত' : '2. Hygiene & Non-Returnable Conditions'}</span>
            </h2>
            <p>
              {language === 'bn'
                ? 'স্কিনকেয়ার, কসমেটিকস ও পারফিউম স্পর্শকাতর ব্যক্তিগত স্বাস্থ্যসামগ্রী হওয়ায় একবার সীল বা প্যাকেজিং খোলা হলে বা ব্যবহার করা হলে স্বাস্থ্যবিধি রক্ষার্থে তা আর ফেরত বা বদল করা সম্ভব নয়।'
                : 'Due to international cosmetic hygiene and health preservation standards, products with broken seals, opened packaging, or evidence of usage cannot be accepted for return or exchange.'}
            </p>
          </div>

          {/* Section 3: Process */}
          <div className="space-y-3 pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base sm:text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#B76E79]" />
              <span>{language === 'bn' ? '৩. রিটার্ন করার পদ্ধতি' : '3. How to Initiate a Claim'}</span>
            </h2>
            <p>
              {language === 'bn'
                ? `ডেলিভারি গ্রহণের সর্বোচ্চ ২৪ ঘণ্টার মধ্যে ক্ষতিগ্রস্ত পণ্যের ছবি বা আনবক্সিং ভিডিও সহ আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নম্বরে (${settings.whatsapp_number}) বার্তা পাঠান। আমাদের টিম ৪৮ ঘণ্টার মধ্যে যাচাই করে বিনামূল্যে নতুন পণ্য রিপ্লেসমেন্টের ব্যবস্থা করবে।`
                : `Within 24 hours of package delivery, share an unboxing photo/video along with your order details to our WhatsApp hotline (${settings.whatsapp_number}). Our team will verify and arrange a fast replacement without additional delivery fees.`}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
