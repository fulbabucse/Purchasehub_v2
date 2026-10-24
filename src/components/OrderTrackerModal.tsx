import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Phone, 
  Mail, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  MessageCircle, 
  MapPin,
  Calendar,
  CreditCard,
  History
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types/database';

export const OrderTrackerModal: React.FC = () => {
  const { 
    isTrackingModalOpen, 
    setIsTrackingModalOpen, 
    trackingQuery, 
    setTrackingQuery, 
    filterOrdersByPhoneOrEmail,
    orders,
    settings
  } = useApp();

  const [inputVal, setInputVal] = useState(trackingQuery || '');
  const [activeSearch, setActiveSearch] = useState(trackingQuery.trim());
  const [showAllRecent, setShowAllRecent] = useState(false);

  // Sync internal search when trackingQuery changes externally
  React.useEffect(() => {
    if (trackingQuery) {
      setInputVal(trackingQuery);
      setActiveSearch(trackingQuery.trim());
    }
  }, [trackingQuery]);

  // Prevent body scroll when tracker modal is open
  React.useEffect(() => {
    if (isTrackingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTrackingModalOpen]);

  if (!isTrackingModalOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputVal.trim();
    setActiveSearch(q);
    setTrackingQuery(q);
    setShowAllRecent(false);
  };

  const handleQuickSearch = (query: string) => {
    setInputVal(query);
    setActiveSearch(query);
    setTrackingQuery(query);
    setShowAllRecent(false);
  };

  const handleClear = () => {
    setInputVal('');
    setActiveSearch('');
    setTrackingQuery('');
    setShowAllRecent(false);
  };

  // Determine which orders to display
  let displayedOrders: Order[] = [];
  if (showAllRecent) {
    displayedOrders = orders;
  } else if (activeSearch) {
    displayedOrders = filterOrdersByPhoneOrEmail(activeSearch);
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Approved & Confirmed',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          step: 2,
          icon: CheckCircle2
        };
      case 'processing':
        return {
          label: 'Processing & Packaging',
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          step: 3,
          icon: Clock
        };
      case 'shipped':
        return {
          label: 'Shipped (On The Way)',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          step: 4,
          icon: Truck
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          step: 5,
          icon: CheckCircle2
        };
      case 'cancelled':
      case 'rejected':
        return {
          label: 'Not Approved / Cancelled',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          step: 0,
          icon: AlertCircle
        };
      case 'pending':
      default:
        return {
          label: 'Received (Awaiting Approval)',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          step: 1,
          icon: Clock
        };
    }
  };

  const stepsList = [
    { step: 1, name: 'Placed' },
    { step: 2, name: 'Approved' },
    { step: 3, name: 'Processing' },
    { step: 4, name: 'Shipped' },
    { step: 5, name: 'Delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-[#EDE2E5] overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F0E4E7] flex items-center justify-between bg-[#FAF8F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F6] text-[#B76E79] flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury font-bold text-base sm:text-lg text-[#1E232A]">
                Track & Check Your Order
              </h2>
              <p className="text-[11px] text-[#718096]">
                Look up order progress by Order ID, Phone Number, or Email
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Filtering Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-[#4A5568] flex items-center justify-between">
              <span>Search By Phone, Email, or Order ID:</span>
              {(activeSearch || showAllRecent) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] text-[#B76E79] hover:underline font-medium"
                >
                  Clear search
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. 01705776631, PH-10291, or purchasehub16@gmail.com"
                  className="w-full pl-9 pr-4 py-3 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                Track Order
              </button>
            </div>
            <p className="text-[10px] text-gray-500">
              Tip: Enter your order ID (e.g. 10291) or your mobile number to view shipping updates and dispatch status.
            </p>
          </form>

          {/* Quick Filter Suggestion Pills */}
          {!activeSearch && !showAllRecent && (
            <div className="p-5 bg-[#FAF8F7] rounded-2xl border border-[#EDE2E5] space-y-3 text-center py-6">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-[#718096]">
                Enter your details above to check current order delivery status, or choose a quick option below:
              </p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllRecent(true)}
                    className="px-3 py-1.5 bg-[#B76E79] text-white rounded-xl text-xs font-semibold hover:bg-[#A35C67] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>View All Recent Orders ({orders.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleQuickSearch('01705776631')}
                  className="px-3 py-1.5 bg-white border border-[#E5D5DA] rounded-xl text-xs text-gray-700 hover:text-[#B76E79] hover:border-[#B76E79] transition-colors font-mono"
                >
                  Phone: 01705776631
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSearch('PH-10291')}
                  className="px-3 py-1.5 bg-white border border-[#E5D5DA] rounded-xl text-xs text-gray-700 hover:text-[#B76E79] hover:border-[#B76E79] transition-colors font-mono"
                >
                  Order: #PH-10291
                </button>
              </div>
            </div>
          )}

          {/* RESULTS LIST */}
          {(activeSearch || showAllRecent) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#718096] pb-2 border-b border-[#F0E4E7]">
                <span>
                  Found <strong className="text-[#1E232A]">{displayedOrders.length}</strong> matching {displayedOrders.length === 1 ? 'order' : 'orders'}:
                </span>
                {activeSearch && (
                  <span className="font-mono text-[#B76E79] font-semibold">"{activeSearch}"</span>
                )}
              </div>

              {displayedOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F7] rounded-2xl border border-[#EDE2E5] space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-xs sm:text-sm font-semibold text-[#1E232A]">
                    No orders found matching "{activeSearch}"
                  </p>
                  <p className="text-xs text-[#718096] max-w-sm mx-auto">
                    Please verify that the phone number or order ID was entered correctly, or call our customer service hotline.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAllRecent(true)}
                      className="px-4 py-2 bg-white border border-[#E5D5DA] text-xs font-semibold rounded-xl text-gray-700 hover:text-[#B76E79]"
                    >
                      Browse Recent Orders
                    </button>
                    <a
                      href={`tel:${settings.phone_number || '01705776631'}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E232A] text-white text-xs font-semibold rounded-xl hover:bg-[#2D3748]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Hotline: {settings.phone_number || '01705776631'}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    const StatusIcon = badge.icon;
                    const dateFormatted = new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div 
                        key={order.id} 
                        className="bg-white rounded-2xl border border-[#EDE2E5] p-4 sm:p-5 shadow-xs space-y-4 hover:border-[#B76E79]/40 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0E4E7]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm sm:text-base text-[#1E232A]">
                                #{order.id}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                                <StatusIcon className="w-3 h-3" />
                                <span>{badge.label}</span>
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>{dateFormatted}</span>
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-base sm:text-lg font-bold font-mono text-[#B76E79] tabular-nums block">
                              ৳ {order.total.toLocaleString('en-US')}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                              {' · '}
                              <span className={order.paymentStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                                {order.paymentStatus.toUpperCase()}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Visual Progress Stepper for Active Tracking */}
                        {badge.step > 0 && (
                          <div className="p-3 bg-[#FAF8F7] rounded-xl border border-[#EDE2E5]">
                            <div className="flex items-center justify-between relative">
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                              <div 
                                className="absolute top-1/2 left-0 h-1 bg-[#B76E79] -translate-y-1/2 z-0 transition-all duration-500" 
                                style={{ width: `${((badge.step - 1) / (stepsList.length - 1)) * 100}%` }}
                              />
                              {stepsList.map((s) => {
                                const isPassed = badge.step >= s.step;
                                const isCurrent = badge.step === s.step;
                                return (
                                  <div key={s.step} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                      isPassed 
                                        ? 'bg-[#B76E79] text-white ring-2 ring-white' 
                                        : 'bg-gray-200 text-gray-500'
                                    } ${isCurrent ? 'scale-110 shadow-sm' : ''}`}>
                                      {isPassed ? '✓' : s.step}
                                    </div>
                                    <span className={`text-[10px] mt-1 whitespace-nowrap font-medium ${
                                      isCurrent ? 'text-[#B76E79] font-bold' : 'text-gray-500'
                                    }`}>
                                      {s.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#FAF8F7] p-3 rounded-xl border border-[#F0E4E7]">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Customer Details</span>
                            <span className="font-semibold text-[#1E232A]">{order.customerName}</span>
                            <div className="text-gray-600 flex items-center gap-1 text-[11px] mt-0.5">
                              <Phone className="w-3 h-3 text-[#B76E79]" />
                              <span>{order.customerPhone}</span>
                            </div>
                            {order.customerEmail && (
                              <div className="text-gray-600 flex items-center gap-1 text-[11px]">
                                <Mail className="w-3 h-3 text-sky-600" />
                                <span className="truncate">{order.customerEmail}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Delivery Address</span>
                            <p className="text-gray-700 leading-snug line-clamp-2">
                              {order.customerAddress}
                            </p>
                            <span className="text-[10px] font-medium text-[#B76E79] mt-1 block">
                              Zone: {order.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'} (৳{order.deliveryCharge})
                            </span>
                          </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096] block">
                            Ordered Items:
                          </span>
                          <div className="space-y-1.5 divide-y divide-[#F3E8EB]">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs pt-1.5 first:pt-0">
                                <div className="flex items-center gap-2 truncate">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name_en}
                                      referrerPolicy="no-referrer"
                                      className="w-8 h-8 rounded-md object-cover bg-gray-100 shrink-0 border border-gray-200" 
                                    />
                                  )}
                                  <div className="truncate">
                                    <span className="font-medium text-[#1E232A] block truncate">
                                      {item.name_en}
                                    </span>
                                    <span className="text-gray-400 text-[10px] font-mono">
                                      SKU: {item.sku}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0 pl-2">
                                  <span className="text-gray-400 font-mono text-[11px] block">
                                    {item.quantity} × ৳{item.price.toLocaleString('en-US')}
                                  </span>
                                  <span className="font-mono font-semibold text-gray-800">
                                    ৳ {(item.price * item.quantity).toLocaleString('en-US')}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Query & Support Link */}
                        <div className="pt-2 border-t border-[#F0E4E7] flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[#718096] truncate">
                            {order.note ? `Note: "${order.note}"` : 'Need assistance with this order?'}
                          </span>
                          <a
                            href={`https://wa.me/8801705776631?text=${encodeURIComponent(
                              `Hello Purchase Hub, I need an update regarding order #${order.id} (Name: ${order.customerName}, Phone: ${order.customerPhone})`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors shrink-0"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Query</span>
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
