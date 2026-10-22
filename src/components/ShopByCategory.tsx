import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopByCategory: React.FC = () => {
  const { categories, getLocalized, setSelectedCategorySlug, setCurrentView, t } = useApp();

  const activeCategories = categories.filter(c => c.is_active);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('all-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-18 bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#EEDDE1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B76E79] tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1E232A]">
              {t('section_categories')}
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              {t('section_categories_sub')}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('all-products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-[#B76E79] hover:text-[#9C5560] transition-colors"
          >
            <span>{t('section_view_all')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeCategories.map((cat) => {
            const displayName = getLocalized(cat.name_en, cat.name_bn);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="group relative overflow-hidden rounded-2xl bg-white border border-[#EFE5E7] p-5 text-left transition-all duration-300 hover:shadow-md hover:border-[#D97793]/40 hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
              >
                {/* Visual Category Backdrop or Subtle Accent */}
                {cat.image_url ? (
                  <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition-opacity">
                    <img 
                      src={cat.image_url} 
                      alt={displayName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FCE7EC] to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform" />
                )}

                {/* Content */}
                <div className="relative z-10">
                  <span className="text-xs font-mono text-[#A0AEC0] uppercase tracking-wider block mb-1">
                    {cat.slug.replace('-', ' ')}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-[#1E232A] group-hover:text-[#B76E79] transition-colors line-clamp-2">
                    {displayName}
                  </h3>
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-medium text-[#718096]">
                  <span>{t('explore_collection')}</span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F7] group-hover:bg-[#B76E79] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
