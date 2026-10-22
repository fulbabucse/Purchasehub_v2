import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DeliveryInfoPage: React.FC = () => {
  const { language, t, settings } = useApp();

  return (
    <div className="bg-[#FAF8F7] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FCE7EC] text-[#B76E79] text-xs font-semibold rounded-full uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডেলিভারি তথ্য ও চার্জ' : 'SHIPPING & LOGISTICS'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1E232A]">
            {t('policy_delivery')}
          </h1>
          <p className="text-sm text-[#64748B]">
            {language === 'bn' 
              ? 'ঢাকা সিটি ও সমগ্র বাংলাদেশে আমাদের পণ্য সরবরাহ প্রক্রিয়া' 
              : 'Our nationwide courier timelines, packaging safety, and delivery rates across Bangladesh'}
          </p>
        </div>

        {/* Rates & Timelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E7]">
              <h2 className="font-bold text-base text-[#1E232A] font-serif-luxury">
                {language === 'bn' ? 'ঢাকা সিটির ভেতরে ডেলিভারি' : 'Inside Dhaka City'}
              </h2>
              <span className="text-sm font-bold text-[#B76E79] tabular-nums">
                ৳ {settings.delivery_charge_inside_dhaka}
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#4A5568]">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B76E79]" />
                <span>{language === 'bn' ? 'সময়: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে' : 'Estimated Time: 24 to 48 Hours'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য' : 'Home Delivery with Cash on Delivery (COD)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? 'ডেলিভারি পার্টনার: নির্ভরযোগ্য প্রিমিয়াম কুরিয়ার' : 'Fulfilled via dedicated city express courier'}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E7]">
              <h2 className="font-bold text-base text-[#1E232A] font-serif-luxury">
                {language === 'bn' ? 'ঢাকা সিটির বাইরে সমগ্র বাংলাদেশ' : 'Outside Dhaka (All Districts)'}
              </h2>
              <span className="text-sm font-bold text-[#B76E79] tabular-nums">
                ৳ {settings.delivery_charge_outside_dhaka}
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#4A5568]">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B76E79]" />
                <span>{language === 'bn' ? 'সময়: ২ থেকে ৩ কার্যদিবস' : 'Estimated Time: 2 to 3 Business Days'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'সরাসরি থানা ও জেলা সদরে হোম ডেলিভারি' : 'Direct Doorstep Delivery to District & Thana Hubs'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? 'স্টেডফাস্ট ও সুন্দরবন কুরিয়ার নেটওয়ার্ক' : 'Steadfast & Sundarban Courier Logistics'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Detailed Shipping Policy Points */}
        <div className="bg-white p-8 rounded-3xl border border-[#EDE2E5] space-y-6 text-sm text-[#4A5568] leading-relaxed shadow-xs">
          <h3 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
            {language === 'bn' ? 'প্যাকেজিং ও ডেলিভারি নির্দেশিকা' : 'Fragile Packaging & Delivery Standards'}
          </h3>

          <div className="space-y-4">
            <p>
              {language === 'bn'
                ? '১. পারফিউম এবং কাঁচের সিরাম বোতল অত্যন্ত সংবেদনশীল হওয়ায় প্রতিটি পণ্য মাল্টি-লেয়ার বাবল র্যাপ এবং শক্ত কার্টনে নিরাপদে প্যাকিং করা হয় যাতে পরিবহনের সময় কোনো ক্ষতি না হয়।'
                : '1. Fragrances and cosmetic glass serum bottles are securely packed in multi-layered impact-resistant bubble cushions and corrugated boxes to ensure transit integrity.'}
            </p>
            <p>
              {language === 'bn'
                ? '২. ডেলিভারি রাইডার আপনার ঠিকানায় পৌঁছানোর পূর্বে ফোনে যোগাযোগ করবেন। অনুগ্রহ করে আপনার প্রদানকৃত মোবাইল নম্বর সচল রাখুন।'
                : '2. Courier riders will call your contact number before arriving. Please keep your registered contact phone active.'}
            </p>
            <p>
              {language === 'bn'
                ? '৩. রাইডারের সামনে পার্সেলের বাহ্যিক অক্ষত অবস্থা যাচাই করে নিন। কোনো দৃশ্যমান ক্ষতি পরিলক্ষিত হলে সাথে সাথে আমাদের হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করুন।'
                : '3. Inspect the outer carton before accepting the package. In the unlikely event of visible outer damage, report immediately to our WhatsApp support.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
