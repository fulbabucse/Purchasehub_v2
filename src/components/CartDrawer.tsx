import React, { useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    openPlaceOrder, 
    language, 
    t, 
    getLocalized,
    settings
  } = useApp();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    openPlaceOrder(cart);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#F0E4E7] flex items-center justify-between bg-[#FAF8F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F6] text-[#B76E79] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury font-bold text-base sm:text-lg text-[#1E232A]">
                {t('cart_title')}
              </h2>
              <span className="text-xs text-[#718096]">
                {totalItemsCount} {language === 'bn' ? 'টি আইটেম' : 'items'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
                title={language === 'bn' ? 'সব পণ্য ব্যাগ থেকে মুছুন' : 'Remove all items from bag'}
              >
                {language === 'bn' ? 'খালি করুন' : 'Clear Bag'}
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF5F6] text-[#B76E79] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif-luxury font-bold text-base text-[#1E232A]">
                {t('cart_empty')}
              </p>
              <p className="text-xs text-[#718096] max-w-xs">
                {language === 'bn' 
                  ? 'আপনার পছন্দের প্রিমিয়াম স্কিনকেয়ার, কসমেটিক্স বা পারফিউম ব্যাগটিতে যুক্ত করুন।' 
                  : 'Add premium cosmetics, perfumes or skincare items to start shopping.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'ক্যাটালগ দেখুন' : 'Explore Catalog'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.productId}
                  className="flex items-center gap-3 p-3 bg-[#FAF8F7] rounded-2xl border border-[#EDE2E5] transition-all hover:border-[#D97793]/40"
                >
                  {/* Image */}
                  <img
                    src={item.image || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg'}
                    alt={item.name_en}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-white border border-[#E5D5DA] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-[#1E232A] truncate">
                      {getLocalized(item.name_en, item.name_bn)}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      {item.sku}
                    </span>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm font-mono text-[#B76E79] tabular-nums">
                        ৳ {(item.price * item.quantity).toLocaleString('en-US')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white border border-[#E5D5DA] rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-[#FAF5F6] text-gray-600 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold font-mono text-[#1E232A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-[#FAF5F6] text-gray-600 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#F0E4E7] bg-[#FAF8F7] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#718096]">
                <span>{t('cart_subtotal')}:</span>
                <span className="font-mono font-semibold text-[#1E232A]">
                  ৳ {subtotal.toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>{t('cart_delivery_charge')}:</span>
                </span>
                <span className="font-mono text-gray-500">
                  {language === 'bn' ? 'চেকআউটে নির্ধারিত' : 'Calculated at checkout'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#B76E79] hover:bg-[#A35C67] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer transform active:scale-98"
            >
              <span>{t('cart_checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#718096] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারিতে নিরাপদ কেনাকাটা' : 'Safe Cash on Delivery Available'}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
