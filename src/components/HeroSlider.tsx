import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroSlider: React.FC = () => {
  const { banners, language, getLocalized, setCurrentView, setSelectedCategorySlug } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeBanners = banners.filter(b => b.is_active);

  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentSlide] || activeBanners[0];

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  };

  const handleActionClick = (url: string) => {
    if (url.startsWith('#category-')) {
      const slug = url.replace('#category-', '');
      setSelectedCategorySlug(slug);
      setCurrentView('all-products');
    } else if (url.startsWith('#products')) {
      setCurrentView('all-products');
    } else {
      setCurrentView('all-products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      className="relative overflow-hidden bg-[#1E232A] text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide Container */}
      <div className="relative min-h-[460px] md:min-h-[540px] lg:min-h-[600px] flex items-center">
        
        {/* Background Image with High-Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={current.image_path}
            alt={getLocalized(current.title_en, current.title_bn)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100"
          />
          {/* Measured gradient scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#121518]/90 via-[#1E232A]/70 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Tagline / Subtitle */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-[#E0A9B0] border border-white/15">
              <span>PURCHASE HUB BANGLADESH</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'bn' ? 'অরিজিনাল কালেকশন' : 'Authentic Collection'}</span>
            </div>

            {/* Title with Balanced Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight text-white leading-[1.15] text-balance">
              {getLocalized(current.title_en, current.title_bn)}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-sans max-w-xl">
              {getLocalized(current.subtitle_en, current.subtitle_bn)}
            </p>

            {/* Action CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleActionClick(current.destination_url)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#B76E79] to-[#D97793] hover:from-[#A85F6B] hover:to-[#C76882] text-white text-sm font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{getLocalized(current.button_text_en, current.button_text_bn)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('all-products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-xs border border-white/20 transition-colors"
              >
                <span>{language === 'bn' ? 'সব পণ্য ব্রাউজ করুন' : 'Browse All Products'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Manual Arrow Controls */}
        {activeBanners.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between z-20 pointer-events-none">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="pointer-events-auto p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs border border-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="pointer-events-auto p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs border border-white/20 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pagination Dot Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 bg-[#E0A9B0]' 
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
