import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  FileText, 
  MessageCircle, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Copy,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem, PaymentMethod, DeliveryZone } from '../types/database';

export const PlaceOrderModal: React.FC = () => {
  const { 
    isPlaceOrderOpen, 
    closePlaceOrder, 
    checkoutItems, 
    settings, 
    language, 
    t, 
    getLocalized, 
    createOrder,
    setIsTrackingModalOpen,
    setTrackingQuery,
    showToast,
    cart,
    removeFromCart,
    clearCart
  } = useApp();

  // Local state for items in this checkout session
  const [itemsInCheckout, setItemsInCheckout] = useState<OrderItem[]>([]);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  // Sync checkout items when modal opens
  useEffect(() => {
    if (isPlaceOrderOpen) {
      setItemsInCheckout(checkoutItems && checkoutItems.length > 0 ? [...checkoutItems] : []);
    }
  }, [isPlaceOrderOpen, checkoutItems]);

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (isPlaceOrderOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlaceOrderOpen]);

  if (!isPlaceOrderOpen) return null;

  // Bengali numerals to English conversion
  const toEnDigits = (str: string): string => {
    const bnNums = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return str.replace(/[০-৯]/g, d => String(bnNums.indexOf(d)));
  };

  const deliveryCharge = deliveryZone === 'inside_dhaka'
    ? (settings.delivery_charge_inside_dhaka ?? 60)
    : (settings.delivery_charge_outside_dhaka ?? 120);

  const subtotal = itemsInCheckout.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const grandTotal = subtotal + deliveryCharge;

  // Modify quantity directly in checkout
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setItemsInCheckout(prev => prev.map(item => {
      if (item.productId === productId) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  // Remove item from checkout preview
  const handleRemoveItem = (productId: string) => {
    setItemsInCheckout(prev => prev.filter(item => item.productId !== productId));
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast(language === 'bn' ? 'অর্ডার আইডি কপি করা হয়েছে!' : 'Order ID copied to clipboard!', 'success');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!customerName.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please provide your full name', 'error');
      return;
    }

    const normalizedPhone = toEnDigits(customerPhone.trim()).replace(/[\s-]/g, '');
    const cleanDigits = normalizedPhone.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 11) {
      showToast(
        language === 'bn' 
          ? 'অনুগ্রহ করে সঠিক মোবাইল নম্বর দিন (কমপক্ষে ১১ ডিজিট, যেমন 017...)' 
          : 'Please provide a valid 11-digit mobile number', 
        'error'
      );
      return;
    }

    const emailTrimmed = customerEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      showToast(
        language === 'bn' 
          ? 'অনুগ্রহ করে সঠিক ইমেইল অ্যাকাউন্ট দিন (ফিল্টারিং ও রসিদের জন্য)' 
          : 'Please provide a valid email account for order filtering & receipts', 
        'error'
      );
      return;
    }

    if (!customerAddress.trim() || customerAddress.trim().length < 6) {
      showToast(
        language === 'bn' 
          ? 'অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা দিন' 
          : 'Please provide your complete delivery address', 
        'error'
      );
      return;
    }

    if (itemsInCheckout.length === 0) {
      showToast(language === 'bn' ? 'অর্ডার করার জন্য কোনো পণ্য নেই' : 'No items to order', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createOrder({
        customerName: customerName.trim(),
        customerPhone: normalizedPhone,
        customerEmail: emailTrimmed,
        customerAddress: customerAddress.trim(),
        deliveryZone,
        deliveryCharge,
        items: itemsInCheckout,
        subtotal,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        status: 'pending',
        note: orderNote.trim() || undefined
      });

      setCompletedOrderId(created.id);

      // Smart Cart Sync: If user ordered items that were in their bag, remove them
      const orderedIds = new Set(itemsInCheckout.map(i => i.productId));
      const remainingCart = cart.filter(c => !orderedIds.has(c.productId));
      if (remainingCart.length === 0) {
        clearCart();
      } else {
        itemsInCheckout.forEach(i => removeFromCart(i.productId));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackCreatedOrder = () => {
    const q = customerPhone || customerEmail || completedOrderId || '';
    resetAndClose();
    setTrackingQuery(q);
    setIsTrackingModalOpen(true);
  };

  const resetAndClose = () => {
    setCompletedOrderId(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerAddress('');
    setOrderNote('');
    closePlaceOrder();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-[#EDE2E5] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#F0E4E7] flex items-center justify-between bg-[#FAF8F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F6] text-[#B76E79] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury font-bold text-base sm:text-lg text-[#1E232A]">
                {completedOrderId ? t('order_success_title') : t('place_order_title')}
              </h2>
              <p className="text-[11px] text-[#718096]">
                {completedOrderId ? t('order_success_subtitle') : t('place_order_subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* SUCCESS SCREEN */}
          {completedOrderId ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">
                  {t('order_id_label')}
                </span>
                <div className="inline-flex items-center gap-2 bg-[#FAF5F6] px-4 py-2 rounded-2xl border border-[#EDE2E5]">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#B76E79] tracking-wider">
                    #{completedOrderId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyOrderId(completedOrderId)}
                    className="p-1 text-gray-500 hover:text-[#B76E79] transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#4A5568] max-w-md mx-auto pt-2 leading-relaxed">
                  {language === 'bn' 
                    ? `ধন্যবাদ ${customerName}! আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে। অ্যাডমিন প্যানেল থেকে অর্ডারটি অনুমোদিত হওয়ার পর ডেলিভারি কার্যক্রম শুরু হবে। পরবর্তীতে আপনার মোবাইল (${customerPhone}) অথবা ইমেইল (${customerEmail}) দিয়ে এই অর্ডারটি ট্র্যাক করতে পারবেন।`
                    : `Thank you, ${customerName}! Your order has been registered. You can track this order anytime using your mobile (${customerPhone}) or email (${customerEmail}).`}
                </p>
              </div>

              {/* Order Invoice Summary Box */}
              <div className="bg-[#FAF8F7] p-4 rounded-2xl border border-[#EDE2E5] text-left space-y-3 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0E4E7] text-xs font-semibold text-[#718096]">
                  <span>{language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}</span>
                  <span className="text-[#1E232A] font-bold">
                    ৳ {grandTotal.toLocaleString('en-US')} ({paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()})
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {itemsInCheckout.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="truncate flex-1 pr-2">
                        <span className="font-semibold text-[#1E232A]">
                          {getLocalized(item.name_en, item.name_bn)}
                        </span>
                        <span className="text-gray-400 block text-[10px]">
                          Qty: {item.quantity} × ৳{item.price}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-[#1E232A] shrink-0">
                        ৳ {(item.price * item.quantity).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F0E4E7] flex justify-between text-xs text-[#718096]">
                  <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}:</span>
                  <span className="text-[#1E232A] font-medium text-right max-w-[65%] truncate">
                    {customerAddress}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTrackCreatedOrder}
                  className="w-full sm:w-auto px-6 py-3 bg-[#B76E79] hover:bg-[#A35C67] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>{t('order_track_btn')}</span>
                </button>

                <a
                  href={`https://wa.me/8801705776631?text=${encodeURIComponent(
                    `Hello Purchase Hub, I just placed order #${completedOrderId} (Name: ${customerName}, Total: BDT ${grandTotal}). Please confirm approval!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-5 py-3 bg-white border border-[#E5D5DA] hover:bg-[#FAF8F7] text-[#1E232A] font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {t('order_continue_shopping')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Items in Checkout Preview with Quantity Editing & Deletion */}
              <div className="bg-[#FAF8F7] p-3.5 sm:p-4 rounded-2xl border border-[#EDE2E5] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#718096] pb-2 border-b border-[#F0E4E7]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                    <span>{language === 'bn' ? 'নির্বাচিত পণ্যসমূহ' : 'Selected Item(s)'} ({itemsInCheckout.length})</span>
                  </span>
                  <span className="font-mono text-gray-500 font-bold">
                    {t('currency')}{subtotal.toLocaleString('en-US')}
                  </span>
                </div>

                {itemsInCheckout.length === 0 ? (
                  <div className="py-6 text-center text-gray-500">
                    <p className="text-xs">{language === 'bn' ? 'কোনো পণ্য নির্বাচিত নেই।' : 'No items selected.'}</p>
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="mt-2 text-xs font-semibold text-[#B76E79] hover:underline"
                    >
                      {language === 'bn' ? 'ক্যাটালগ থেকে পণ্য যোগ করুন' : 'Choose items from store'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {itemsInCheckout.map((item) => (
                      <div 
                        key={item.productId} 
                        className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-[#EDE2E5]"
                      >
                        <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name_en} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover border border-[#E5D5DA] shrink-0"
                            />
                          )}
                          <div className="truncate min-w-0">
                            <p className="font-semibold text-[#1E232A] text-xs truncate">
                              {getLocalized(item.name_en, item.name_bn)}
                            </p>
                            <span className="text-[10px] font-mono text-gray-400">
                              ৳{item.price.toLocaleString('en-US')} each
                            </span>
                          </div>
                        </div>

                        {/* Inline quantity adjuster inside checkout */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-[#FAF8F7] border border-[#E5D5DA] rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.productId, -1)}
                              className="p-1 hover:bg-[#FAF5F6] text-gray-600 transition-colors"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold font-mono text-[#1E232A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.productId, 1)}
                              className="p-1 hover:bg-[#FAF5F6] text-gray-600 transition-colors"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono font-bold text-xs text-[#B76E79] min-w-[55px] text-right">
                            ৳ {(item.price * item.quantity).toLocaleString('en-US')}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Contact & Filtering Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B76E79]" />
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1E232A]">
                    {language === 'bn' ? 'গ্রাহকের তথ্য (অর্ডার ফিল্টারিং ও ট্র্যাকিং)' : 'Customer Details (Order Filtering & Tracking)'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>{t('order_customer_name')}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('order_customer_name_placeholder')}
                      className="w-full p-2.5 bg-white border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]"
                    />
                  </div>

                  {/* Mobile Phone (REQUIRED for filtering) */}
                  <div>
                    <label className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={t('order_customer_phone_placeholder')}
                      className="w-full p-2.5 bg-white border border-[#E5D5DA] rounded-xl text-xs sm:text-sm font-mono text-[#1E232A] focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]"
                    />
                    <p className="text-[10px] text-[#718096] mt-1">
                      {t('order_customer_phone_hint')}
                    </p>
                  </div>

                  {/* Email Account (REQUIRED for filtering) */}
                  <div>
                    <label className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Account'}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder={t('order_customer_email_placeholder')}
                      className="w-full p-2.5 bg-white border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]"
                    />
                    <p className="text-[10px] text-[#718096] mt-1">
                      {t('order_customer_email_hint')}
                    </p>
                  </div>

                </div>
              </div>

              {/* Delivery Address & Zone */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1E232A]">
                    {language === 'bn' ? 'ডেলিভারি এলাকা ও ঠিকানা' : 'Delivery Area & Address'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{t('order_delivery_address')}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder={t('order_delivery_address_placeholder')}
                      className="w-full p-2.5 bg-white border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]"
                    />
                  </div>

                  {/* Delivery Zone Selection */}
                  <div>
                    <label className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5 mb-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>{t('order_delivery_zone')}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label 
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          deliveryZone === 'inside_dhaka'
                            ? 'bg-[#FDF2F4] border-[#B76E79] text-[#1E232A]'
                            : 'bg-white border-[#E5D5DA] text-gray-700 hover:bg-[#FAF8F7]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery_zone"
                            value="inside_dhaka"
                            checked={deliveryZone === 'inside_dhaka'}
                            onChange={() => setDeliveryZone('inside_dhaka')}
                            className="text-[#B76E79] focus:ring-[#B76E79]"
                          />
                          <span className="font-medium text-xs">
                            {t('order_zone_inside_dhaka')}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xs text-[#B76E79]">
                          ৳{settings.delivery_charge_inside_dhaka ?? 60}
                        </span>
                      </label>

                      <label 
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          deliveryZone === 'outside_dhaka'
                            ? 'bg-[#FDF2F4] border-[#B76E79] text-[#1E232A]'
                            : 'bg-white border-[#E5D5DA] text-gray-700 hover:bg-[#FAF8F7]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery_zone"
                            value="outside_dhaka"
                            checked={deliveryZone === 'outside_dhaka'}
                            onChange={() => setDeliveryZone('outside_dhaka')}
                            className="text-[#B76E79] focus:ring-[#B76E79]"
                          />
                          <span className="font-medium text-xs">
                            {t('order_zone_outside_dhaka')}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xs text-[#B76E79]">
                          ৳{settings.delivery_charge_outside_dhaka ?? 120}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1E232A]">
                    {t('order_payment_method')}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cod' as const, label: 'Cash on Delivery', sub: 'COD' },
                    { id: 'bkash' as const, label: 'bKash Mobile', sub: 'bKash' },
                    { id: 'nagad' as const, label: 'Nagad Mobile', sub: 'Nagad' },
                    { id: 'rocket' as const, label: 'Rocket Mobile', sub: 'Rocket' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === method.id 
                          ? 'bg-[#1E232A] text-white border-[#1E232A] shadow-xs' 
                          : 'bg-white text-gray-700 border-[#E5D5DA] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{method.sub}</div>
                      <div className="text-[10px] opacity-80 truncate">{method.label}</div>
                    </button>
                  ))}
                </div>

                {/* Helpful note for mobile banking */}
                {paymentMethod !== 'cod' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {paymentMethod.toUpperCase()} Payment Instructions:
                      </p>
                      <p className="text-[11px] mt-0.5">
                        You can send payment to hotline/merchant number: <strong>{settings.whatsapp_number || '01705776631'}</strong> or pay directly to the delivery courier upon arrival.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Order Note */}
              <div>
                <label className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-[#718096]" />
                  <span>{t('order_note')}</span>
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder={t('order_note_placeholder')}
                  className="w-full p-2.5 bg-white border border-[#E5D5DA] rounded-xl text-xs text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* Price Calculation Summary Bar */}
              <div className="p-4 bg-[#FAF8F7] rounded-2xl border border-[#EDE2E5] space-y-2">
                <div className="flex justify-between text-xs text-[#718096]">
                  <span>{t('cart_subtotal')}:</span>
                  <span className="font-mono">৳ {subtotal.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#718096]">
                  <span>{t('cart_delivery_charge')}:</span>
                  <span className="font-mono">৳ {deliveryCharge.toLocaleString('en-US')}</span>
                </div>
                <div className="pt-2 border-t border-[#F0E4E7] flex justify-between text-sm sm:text-base font-bold text-[#1E232A]">
                  <span>{t('cart_total')}:</span>
                  <span className="font-mono text-[#B76E79] text-lg font-bold">
                    ৳ {grandTotal.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || itemsInCheckout.length === 0}
                className="w-full py-4 bg-[#B76E79] hover:bg-[#A35C67] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform active:scale-99"
              >
                {isSubmitting ? (
                  <span>{language === 'bn' ? 'অর্ডার প্রক্রিয়াধীন...' : 'Processing Order...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t('order_submit_btn')} (৳{grandTotal.toLocaleString('en-US')})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#718096]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? '১০০% নিরাপদ কেনাকাটা ও দ্রুত হোম ডেলিভারি' : '100% Safe Checkout & Reliable Delivery'}</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
