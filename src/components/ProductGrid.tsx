import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ChevronDown, 
  PackageOpen,
  Filter
} from 'lucide-react';
import { useApp, SortOption } from '../context/AppContext';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  title?: string;
  categoryFilterOverride?: string | null;
  onlyNewArrivals?: boolean;
  onlyFeatured?: boolean;
  onlyBestSellers?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  categoryFilterOverride,
  onlyNewArrivals,
  onlyFeatured,
  onlyBestSellers
}) => {
  const {
    products,
    categories,
    brands,
    getLocalized,
    t,
    language,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedCategorySlug,
    selectedBrandId,
    setSelectedBrandId,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    sortOption,
    setSortOption,
    clearFilters
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Active Category resolution
  const effectiveCategorySlug = categoryFilterOverride !== undefined 
    ? categoryFilterOverride 
    : selectedCategorySlug;

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active
      if (!p.is_active) return false;

      // Filter flags if specified
      if (onlyNewArrivals && !p.is_new_arrival) return false;
      if (onlyFeatured && !p.is_featured) return false;
      if (onlyBestSellers && !p.is_best_seller) return false;

      // Category filter
      if (effectiveCategorySlug) {
        const cat = categories.find(c => c.slug === effectiveCategorySlug);
        if (cat && p.category_id !== cat.id) {
          // If category has children, check if p.category_id matches subcategory
          const subcats = categories.filter(c => c.parent_id === cat.id);
          const subcatIds = subcats.map(s => s.id);
          if (!subcatIds.includes(p.category_id)) {
            return false;
          }
        }
      }

      // Brand filter
      if (selectedBrandId && p.brand_id !== selectedBrandId) {
        return false;
      }

      // Stock filter
      if (inStockOnly && p.stock_quantity <= 0) {
        return false;
      }

      // Price filter
      const effectivePrice = p.sale_price !== null && p.sale_price !== undefined ? p.sale_price : p.price;
      if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1]) {
        return false;
      }

      // Search Query filter (matches name EN, name BN, brand, or SKU)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const brand = brands.find(b => b.id === p.brand_id);
        const matchNameEn = p.name_en?.toLowerCase().includes(q);
        const matchNameBn = p.name_bn?.toLowerCase().includes(q);
        const matchSku = p.sku?.toLowerCase().includes(q);
        const matchBrand = brand?.name?.toLowerCase().includes(q);

        if (!matchNameEn && !matchNameBn && !matchSku && !matchBrand) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price ?? a.price;
      const priceB = b.sale_price ?? b.price;

      switch (sortOption) {
        case 'price_low_high':
          return priceA - priceB;
        case 'price_high_low':
          return priceB - priceA;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'best_sellers':
          return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
        case 'featured':
        default:
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
    });
  }, [
    products, 
    categories, 
    brands, 
    effectiveCategorySlug, 
    selectedBrandId, 
    inStockOnly, 
    priceRange, 
    searchQuery, 
    sortOption,
    onlyNewArrivals,
    onlyFeatured,
    onlyBestSellers
  ]);

  // Pagination logic
  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(0, currentPage * itemsPerPage);
  const hasMore = paginatedProducts.length < totalItems;

  const handlePriceChange = (index: 0 | 1, val: number) => {
    const updated: [number, number] = [...priceRange];
    updated[index] = Math.max(0, val);
    setPriceRange(updated);
  };

  const hasActiveFilters = Boolean(
    searchQuery || 
    selectedCategorySlug || 
    selectedBrandId || 
    inStockOnly || 
    priceRange[0] > 0 || 
    priceRange[1] < 10000
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#EEDDE1]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1E232A]">
            {title || t('nav_all_products')}
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            {t('showing_results')}: <span className="font-semibold text-[#1E232A] tabular-nums">{totalItems}</span>
          </p>
        </div>

        {/* Search, Sort, and Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Quick Search in Grid */}
          <div className="relative min-w-[220px] sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5D5DA] rounded-lg text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5D5DA] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
            <span className="text-[#718096] hidden sm:inline">{t('sort_by')}:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent font-medium text-[#1E232A] focus:outline-none cursor-pointer"
            >
              <option value="featured">{t('sort_featured')}</option>
              <option value="newest">{t('sort_newest')}</option>
              <option value="price_low_high">{t('sort_price_low_high')}</option>
              <option value="price_high_low">{t('sort_price_high_low')}</option>
              <option value="best_sellers">{t('sort_best_sellers')}</option>
            </select>
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5D5DA] rounded-lg text-xs sm:text-sm font-medium text-[#1E232A]"
          >
            <Filter className="w-4 h-4 text-[#B76E79]" />
            <span>{t('filter_title')}</span>
          </button>

          {/* Clear Filters (if active) */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#B76E79] hover:bg-[#FCE7EC] rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('filter_clear_all')}</span>
            </button>
          )}

        </div>
      </div>

      {/* Main Grid Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-[#EDE2E5] h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E7]">
            <h3 className="font-semibold text-[#1E232A] flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#B76E79]" />
              <span>{t('filter_title')}</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#B76E79] hover:underline"
              >
                {t('filter_clear_all')}
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-2">
              {t('filter_category')}
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !selectedCategorySlug 
                    ? 'bg-[#FDF2F4] text-[#B76E79] font-semibold' 
                    : 'text-[#4A5568] hover:bg-[#FAF8F7]'
                }`}
              >
                {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
              </button>
              {categories.filter(c => c.is_active).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategorySlug === cat.slug 
                      ? 'bg-[#FDF2F4] text-[#B76E79] font-semibold' 
                      : 'text-[#4A5568] hover:bg-[#FAF8F7]'
                  }`}
                >
                  {getLocalized(cat.name_en, cat.name_bn)}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-[#F0E4E7]">
            <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-2">
              {t('filter_brand')}
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrandId(null)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !selectedBrandId 
                    ? 'bg-[#FDF2F4] text-[#B76E79] font-semibold' 
                    : 'text-[#4A5568] hover:bg-[#FAF8F7]'
                }`}
              >
                {language === 'bn' ? 'সকল ব্র্যান্ড' : 'All Brands'}
              </button>
              {brands.filter(b => b.is_active).map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrandId(brand.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedBrandId === brand.id 
                      ? 'bg-[#FDF2F4] text-[#B76E79] font-semibold' 
                      : 'text-[#4A5568] hover:bg-[#FAF8F7]'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-[#F0E4E7]">
            <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-2">
              {t('filter_price_range')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                placeholder={t('filter_min_price')}
                className="w-1/2 p-2 border border-[#E5D5DA] rounded-lg text-xs tabular-nums text-[#1E232A]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min="0"
                max="15000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                placeholder={t('filter_max_price')}
                className="w-1/2 p-2 border border-[#E5D5DA] rounded-lg text-xs tabular-nums text-[#1E232A]"
              />
            </div>
          </div>

          {/* In-Stock Only Toggle */}
          <div className="pt-4 border-t border-[#F0E4E7]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#2D3748]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#E5D5DA] text-[#B76E79] focus:ring-[#B76E79] h-4 w-4"
              />
              <span>{t('filter_in_stock_only')}</span>
            </label>
          </div>

        </aside>

        {/* Products Grid View */}
        <main className="lg:col-span-3">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-6 py-2.5 bg-white border border-[#E2D4D8] hover:border-[#B76E79] text-[#1E232A] hover:text-[#B76E79] rounded-xl text-sm font-semibold transition-all shadow-xs"
                  >
                    {language === 'bn' ? 'আরও পণ্য দেখুন' : 'Load More Products'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#EDE2E5] p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5F6] flex items-center justify-center text-[#B76E79]">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E232A]">
                {t('no_products_found')}
              </h3>
              <p className="text-sm text-[#718096] max-w-md mx-auto">
                {t('no_products_found_sub')}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B76E79] text-white text-xs font-semibold rounded-lg hover:bg-[#A35C67] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('filter_clear_all')}</span>
                </button>
              )}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E7]">
              <h3 className="font-semibold text-base text-[#1E232A] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B76E79]" />
                <span>{t('filter_title')}</span>
              </h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-2">
                {t('filter_category')}
              </label>
              <select
                value={selectedCategorySlug || ''}
                onChange={(e) => setSelectedCategorySlug(e.target.value || null)}
                className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-lg text-sm text-[#1E232A]"
              >
                <option value="">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                {categories.filter(c => c.is_active).map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {getLocalized(cat.name_en, cat.name_bn)}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-2">
                {t('filter_brand')}
              </label>
              <select
                value={selectedBrandId || ''}
                onChange={(e) => setSelectedBrandId(e.target.value || null)}
                className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-lg text-sm text-[#1E232A]"
              >
                <option value="">{language === 'bn' ? 'সকল ব্র্যান্ড' : 'All Brands'}</option>
                {brands.filter(b => b.is_active).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-2">
                {t('filter_price_range')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-[#E5D5DA] rounded-lg text-xs"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-[#E5D5DA] rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Stock */}
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#2D3748]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#E5D5DA] text-[#B76E79] focus:ring-[#B76E79] h-4 w-4"
              />
              <span>{t('filter_in_stock_only')}</span>
            </label>

            <div className="pt-3 border-t border-[#F0E4E7] flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 border border-[#E5D5DA] rounded-lg text-xs font-semibold text-[#718096]"
              >
                {t('filter_clear_all')}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#B76E79] text-white rounded-lg text-xs font-semibold"
              >
                {language === 'bn' ? 'প্রয়োগ করুন' : 'Apply Filters'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
