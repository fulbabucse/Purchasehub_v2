import React, { useState } from 'react';
import { Eye, AlertCircle, Check, Tag, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types/database';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    getLocalized, 
    language, 
    t, 
    navigateToProduct, 
    brands, 
    categories, 
    getWhatsAppOrderUrl,
    openPlaceOrder,
    addToCart
  } = useApp();

  const [imgError, setImgError] = useState(false);

  const brand = brands.find(b => b.id === product.brand_id);
  const category = categories.find(c => c.id === product.category_id);

  const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0];
  const imageSrc = primaryImage?.storage_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg';

  const name = getLocalized(product.name_en, product.name_bn);
  const altText = primaryImage ? getLocalized(primaryImage.alt_text_en, primaryImage.alt_text_bn) : name;

  const hasDiscount = product.sale_price !== null && 
                      product.sale_price !== undefined && 
                      product.sale_price < product.price;

  const currentPrice = hasDiscount ? product.sale_price! : product.price;
  const originalPrice = product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  // Stock status determination
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D97793]/40">
      
      {/* Product Image Frame */}
      <div 
        onClick={() => navigateToProduct(product.id)}
        className="relative aspect-4/3 w-full bg-[#FAF5F6] overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={imageSrc}
            alt={altText || name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#FAF5F6] text-[#A0AEC0]">
            <span className="text-xs font-mono uppercase tracking-wider">{product.sku}</span>
            <span className="text-sm font-medium mt-1 text-[#4A5568]">{name}</span>
          </div>
        )}

        {/* Quiet Discount Badge (if applicable) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#1E232A] text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
            -{discountPercentage}% {t('discount_off')}
          </div>
        )}

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToProduct(product.id);
            }}
            className="px-3.5 py-2 bg-white text-[#1E232A] hover:bg-[#FAF8F7] text-xs font-medium rounded-lg shadow-md flex items-center gap-1.5 transition-transform transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('view_details')}</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Metadata: Brand & Category (Zero-Pill: unboxed text with typographic separator) */}
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[#B76E79]">
              {brand ? brand.name : 'Purchase Hub'}
            </span>
            {category && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{getLocalized(category.name_en, category.name_bn)}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => navigateToProduct(product.id)}
            className="text-sm sm:text-base font-semibold text-[#1E232A] group-hover:text-[#B76E79] transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={name}
          >
            {name}
          </h3>

          {/* Net Content Specification (if provided) */}
          {product.net_content && (
            <p className="text-xs text-[#A0AEC0] mt-1 font-mono">
              {product.net_content}
            </p>
          )}

          {/* Price Container */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#1E232A] tabular-nums">
              ৳ {currentPrice.toLocaleString('en-US')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#A0AEC0] line-through tabular-nums">
                ৳ {originalPrice.toLocaleString('en-US')}
              </span>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {isOutOfStock ? (
              <span className="text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t('out_of_stock')}</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t('low_stock')} ({product.stock_quantity})</span>
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{t('in_stock')}</span>
              </span>
            )}
          </div>

        </div>

          {/* Action Buttons: Order Now & Add to Bag */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                if (isOutOfStock) return;
                addToCart(product, 1);
              }}
              className="w-full py-2 px-2 bg-[#FAF8F7] hover:bg-[#F3E8EB] text-[#1E232A] text-xs font-semibold rounded-xl transition-colors border border-[#E8D4D9] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Add to Bag</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                if (isOutOfStock) return;
                openPlaceOrder([
                  {
                    productId: product.id,
                    sku: product.sku,
                    name_en: product.name_en,
                    name_bn: product.name_bn,
                    price: currentPrice,
                    quantity: 1,
                    image: imageSrc
                  }
                ]);
              }}
              className={`w-full py-2 px-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1E232A] hover:bg-[#B76E79] text-white active:scale-98 cursor-pointer'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>{isOutOfStock ? t('out_of_stock') : 'Order Now'}</span>
            </button>
          </div>

        </div>

      </div>
  );
};
