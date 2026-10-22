import React from 'react';
import { Home, ArrowLeft, PackageSearch } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const { language, setCurrentView } = useApp();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F7] px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#EDE2E5] text-center space-y-6 shadow-sm">
        
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5F6] flex items-center justify-center text-[#B76E79]">
          <PackageSearch className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-bold font-serif-luxury text-[#1E232A]">404</span>
          <h1 className="text-lg sm:text-xl font-bold text-[#1E232A]">
            {language === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] leading-relaxed">
            {language === 'bn' 
              ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা মুছে ফেলা হয়েছে।' 
              : 'The page or product catalog link you requested does not exist or has been moved.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2.5 px-4 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোম পেজে ফিরুন' : 'Back to Home'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('all-products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2.5 px-4 bg-[#FAF8F7] hover:bg-[#F0E4E7] text-[#1E232A] rounded-xl text-xs font-semibold border border-[#E5D5DA] transition-colors"
          >
            <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'Explore Catalog'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
