import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Maximize2, 
  X,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { 
    selectedProductId, 
    setCurrentView, 
    products, 
    categories, 
    brands, 
    getLocalized, 
    t, 
    language,
    getWhatsAppOrderUrl,
    getCallOrderUrl,
    showToast 
  } = useApp();

  const product = products.find(p => p.id === selectedProductId);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[#1E232A]">
          {language === 'bn' ? 'পণ্যটি খুঁজে পাওয়া যায়নি' : 'Product Not Found'}
        </h2>
        <button
          onClick={() => setCurrentView('all-products')}
          className="mt-4 px-4 py-2 bg-[#B76E79] text-white rounded-lg text-sm"
        >
          {language === 'bn' ? 'সকল পণ্যে ফিরে যান' : 'Back to Catalog'}
        </button>
      </div>
    );
  }

  const brand = brands.find(b => b.id === product.brand_id);
  const category = categories.find(c => c.id === product.category_id);

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [{
        id: 'fallback-img',
        product_id: product.id,
        storage_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
        alt_text_en: product.name_en,
        alt_text_bn: product.name_bn,
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }];

  const activeImage = images[activeImageIndex] || images[0];

  const hasDiscount = product.sale_price !== null && 
                      product.sale_price !== undefined && 
                      product.sale_price < product.price;

  const currentPrice = hasDiscount ? product.sale_price! : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  // Stock status
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category_id === product.category_id && p.is_active)
    .slice(0, 3);

  // Share handler
  const handleShare = async () => {
    const url = window.location.href;
    const title = getLocalized(product.name_en, product.name_bn);

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${title} on Purchase Hub`,
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast(t('link_copied'), 'success');
    } catch (e) {
      showToast('URL: ' + url, 'info');
    }
  };

  return (
    <div className="bg-[#FAF8F7] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#718096] mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-[#1E232A] transition-colors"
          >
            {t('nav_home')}
          </button>
          <span>/</span>
          <button
            onClick={() => setCurrentView('all-products')}
            className="hover:text-[#1E232A] transition-colors"
          >
            {t('nav_all_products')}
          </button>
          {category && (
            <>
              <span>/</span>
              <span className="text-[#B76E79] font-medium">
                {getLocalized(category.name_en, category.name_bn)}
              </span>
            </>
          )}
        </div>

        {/* Back Link */}
        <button
          onClick={() => setCurrentView('all-products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#B76E79] hover:text-[#974E5A] mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'সকল পণ্যে ফিরে যান' : 'Back to Catalog'}</span>
        </button>

        {/* Main Product Display: 2-Column Contiguous Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-[#EDE2E5] shadow-sm">
          
          {/* Column 1: Image Gallery & Lightbox (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary Image Viewport */}
            <div className="relative aspect-4/3 w-full bg-[#FAF5F6] rounded-2xl overflow-hidden border border-[#F0E4E7] group">
              <img
                src={activeImage.storage_path}
                alt={getLocalized(activeImage.alt_text_en, activeImage.alt_text_bn) || product.name_en}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-[#1E232A] text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                  -{discountPercent}% {t('discount_off')}
                </div>
              )}

              {/* Zoom Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-[#1E232A] rounded-xl shadow-md transition-all"
                title="Expand View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-[#B76E79] ring-2 ring-[#B76E79]/20 shadow-xs' 
                        : 'border-[#EDE2E5] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.storage_path}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Assurance trust strip */}
            <div className="p-4 bg-[#FAF8F7] rounded-xl border border-[#F0E4E7] space-y-2 text-xs text-[#718096]">
              <div className="flex items-center gap-2 text-[#1E232A] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('trust_authentic')}</span>
              </div>
              <p>{t('trust_authentic_sub')}</p>
            </div>

          </div>

          {/* Column 2: Contiguous Purchase & Specification Module (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Brand, Category & SKU (Zero-Pill: unboxed clean text) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#718096]">
                <span className="font-bold uppercase tracking-wider text-[#B76E79] text-sm">
                  {brand ? brand.name : 'Purchase Hub'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{category ? getLocalized(category.name_en, category.name_bn) : 'Beauty'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-gray-400">{t('sku_label')} {product.sku}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#1E232A] leading-tight">
                {getLocalized(product.name_en, product.name_bn)}
              </h1>

              {/* Net Content Specification */}
              {product.net_content && (
                <div className="text-xs font-mono text-[#718096]">
                  {t('net_content')}: <span className="font-semibold text-[#1E232A]">{product.net_content}</span>
                </div>
              )}

              {/* Price & Discount Banner */}
              <div className="pt-2 pb-3 border-y border-[#F3E8EB] flex items-baseline gap-4">
                <span className="text-3xl font-bold text-[#1E232A] tabular-nums">
                  ৳ {currentPrice.toLocaleString('en-US')}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#A0AEC0] line-through tabular-nums">
                      ৳ {originalPrice.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t('save_amount')} ৳ {(originalPrice - currentPrice).toLocaleString('en-US')}
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Availability */}
              <div className="flex items-center gap-2 text-sm font-medium">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('out_of_stock')}</span>
                  </div>
                ) : isLowStock ? (
                  <div className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('low_stock')} - {language === 'bn' ? `মাত্র ${product.stock_quantity}টি বাকি` : `Only ${product.stock_quantity} left`}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('in_stock')} ({language === 'bn' ? `মজুদ: ${product.stock_quantity}টি` : `${product.stock_quantity} in stock`})</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3 pt-2">
                  <label className="text-xs font-semibold text-[#718096] uppercase">
                    {t('quantity')}:
                  </label>
                  <div className="flex items-center border border-[#E5D5DA] rounded-lg overflow-hidden bg-[#FAF8F7]">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-[#EDE2E5] text-[#1E232A] font-semibold transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold tabular-nums text-[#1E232A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      className="px-3 py-1.5 hover:bg-[#EDE2E5] text-[#1E232A] font-semibold transition-colors"
                      disabled={quantity >= product.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons: WhatsApp Order & Direct Call */}
              <div className="pt-3 space-y-3">
                <a
                  href={getWhatsAppOrderUrl(product, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md transition-all transform active:scale-98 ${
                    isOutOfStock 
                      ? 'bg-gray-400 text-white cursor-not-allowed pointer-events-none' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('whatsapp_order_btn')}</span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getCallOrderUrl()}
                    className="py-3 px-4 rounded-xl border border-[#1E232A] text-[#1E232A] hover:bg-[#1E232A] hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#B76E79]" />
                    <span>{t('call_order_btn')}</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="py-3 px-4 rounded-xl border border-[#E5D5DA] bg-[#FAF8F7] hover:bg-[#EDE2E5] text-[#1E232A] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#718096]" />
                    <span>{t('share_product')}</span>
                  </button>
                </div>

                {/* Clear Order Notice */}
                <div className="p-3 bg-[#FAF8F7] border border-[#F0E4E7] rounded-xl flex items-start gap-2.5 text-xs text-[#718096]">
                  <Info className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                  <p>{t('order_disclaimer')}</p>
                </div>
              </div>

            </div>

            {/* Detailed Descriptions, Usage & Specifications Tabs */}
            <div className="pt-6 border-t border-[#F0E4E7] space-y-6">
              
              {/* Product Description */}
              <div>
                <h3 className="text-base font-bold text-[#1E232A] mb-2 font-serif-luxury">
                  {t('product_details_title')}
                </h3>
                <p className="text-sm text-[#4A5568] leading-relaxed whitespace-pre-line">
                  {getLocalized(product.description_en, product.description_bn)}
                </p>
              </div>

              {/* Usage Instructions (if provided) */}
              {(product.usage_instructions_en || product.usage_instructions_bn) && (
                <div className="bg-[#FAF8F7] p-4 rounded-xl border border-[#F0E4E7]">
                  <h4 className="text-xs font-bold text-[#B76E79] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('usage_instructions')}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                    {getLocalized(product.usage_instructions_en, product.usage_instructions_bn)}
                  </p>
                </div>
              )}

              {/* Key Ingredients (if provided) */}
              {(product.ingredients_en || product.ingredients_bn) && (
                <div>
                  <h4 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
                    {t('ingredients')}
                  </h4>
                  <p className="text-xs text-[#718096] leading-relaxed font-mono bg-white p-3 rounded-lg border border-[#EDE2E5]">
                    {getLocalized(product.ingredients_en, product.ingredients_bn)}
                  </p>
                </div>
              )}

              {/* Structured Specifications & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* Batch & Expiry where applicable */}
                {product.batch_number && (
                  <div className="p-3 bg-[#FAF8F7] rounded-lg border border-[#EDE2E5] text-xs">
                    <span className="text-[#A0AEC0] block">{t('batch_no')}</span>
                    <span className="font-semibold text-[#1E232A] font-mono">{product.batch_number}</span>
                  </div>
                )}

                {product.expiry_date && (
                  <div className="p-3 bg-[#FAF8F7] rounded-lg border border-[#EDE2E5] text-xs">
                    <span className="text-[#A0AEC0] block">{t('expiry_date')}</span>
                    <span className="font-semibold text-[#1E232A]">{product.expiry_date}</span>
                  </div>
                )}

                {/* Warranty Information */}
                <div className="p-3 bg-[#FAF8F7] rounded-lg border border-[#EDE2E5] text-xs sm:col-span-2">
                  <span className="text-[#A0AEC0] block mb-1">{t('warranty_info')}</span>
                  {product.warranty_status === 'yes' ? (
                    <div>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('warranty_available')}: {product.warranty_duration}</span>
                      </span>
                      {product.warranty_terms_en && (
                        <p className="text-[#718096] mt-1">
                          {getLocalized(product.warranty_terms_en, product.warranty_terms_bn)}
                        </p>
                      )}
                    </div>
                  ) : product.warranty_status === 'no' ? (
                    <span className="text-[#718096]">{t('warranty_none')}</span>
                  ) : (
                    <span className="text-[#718096]">{t('warranty_na')}</span>
                  )}
                </div>

                {/* Additional structured specifications */}
                {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="p-3 bg-[#FAF8F7] rounded-lg border border-[#EDE2E5] text-xs">
                    <span className="text-[#A0AEC0] block">{key}</span>
                    <span className="font-semibold text-[#1E232A]">{val}</span>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#EDE2E5]">
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1E232A] mb-6">
              {t('related_products')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] relative flex items-center justify-center">
            <img
              src={activeImage.storage_path}
              alt="Zoomed View"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}
                  className="absolute left-2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                  className="absolute right-2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
