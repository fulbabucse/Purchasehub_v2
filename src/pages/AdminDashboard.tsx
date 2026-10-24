import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Package, 
  FolderTree, 
  Tag, 
  Sliders, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  AlertCircle,
  Check, 
  Eye, 
  EyeOff, 
  Search, 
  Database, 
  Image as ImageIcon, 
  X, 
  XCircle,
  Save, 
  LogOut, 
  Lock,
  RefreshCw,
  Sparkles,
  Copy,
  ExternalLink,
  ShoppingBag,
  Phone,
  Mail,
  Truck,
  FileText,
  CheckCircle2,
  Clock,
  MessageCircle,
  Upload,
  Users,
  UserPlus,
  Key,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductImage, Category, Brand, Banner, WarrantyStatus, Order, OrderStatus, AdminUser } from '../types/database';
import { isSupabaseConfigured } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    categories, 
    brands, 
    banners, 
    settings, 
    isAdminLoggedIn, 
    currentAdminUser,
    adminUsers,
    loginAdmin, 
    logoutAdmin,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    addCategory,
    updateCategory,
    deleteCategory,
    addBrand,
    updateBrand,
    deleteBrand,
    addBanner,
    updateBanner,
    deleteBanner,
    updateSettings,
    showToast,
    setCurrentView,
    orders,
    updateOrderStatus,
    approveOrder,
    rejectOrder,
    deleteOrder
  } = useApp();

  // Login form state
  const [adminUserIdInput, setAdminUserIdInput] = useState('shawon_admin@purchase-hub.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Active tab state
  type AdminTab = 'orders' | 'products' | 'categories' | 'brands' | 'banners' | 'admins' | 'settings' | 'supabase';
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Product Search / Filter
  const [productSearch, setProductSearch] = useState('');

  // Orders Search / Filter (Phone or Email or Order ID)
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Order Approval / Rejection Modal State
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReasonSelection, setRejectReasonSelection] = useState<string>('phone_unreachable');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');

  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Category modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Brand modal
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);

  // Banner modal
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);

  // Admin User modal
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [deleteConfirmAdminId, setDeleteConfirmAdminId] = useState<string | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  // Handle Login
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF8F7] px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#EDE2E5] shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5F6] flex items-center justify-center text-[#B76E79]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold text-[#1E232A]">
              Store Administrator Login
            </h1>
            <p className="text-xs text-[#718096]">
              Authenticate with your Admin User ID & Password to manage store orders, products, and administrators.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(adminUserIdInput, adminPasswordInput);
            }} 
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1.5">
                Admin User ID / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminUserIdInput}
                  onChange={(e) => setAdminUserIdInput(e.target.value)}
                  placeholder="e.g. shawon_admin@purchase-hub.com"
                  className="w-full p-3 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="pt-2 border-t border-[#F0E4E7] text-center">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#718096] hover:underline cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Metrics
  const totalProductsCount = products.length;
  const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length;
  const outOfStockCount = products.filter(p => p.stock_quantity <= 0).length;
  const totalCategoriesCount = categories.length;

  // Filtered products in admin
  const adminFilteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name_en?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  });

  // Filtered orders in admin (by Customer Mobile Phone, Email Account, or Order ID)
  const adminFilteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
      return false;
    }
    if (!orderSearch.trim()) return true;
    const q = orderSearch.trim().toLowerCase();
    const cleanPhone = (o.customerPhone || '').replace(/[\s-]/g, '').toLowerCase();
    const cleanEmail = (o.customerEmail || '').trim().toLowerCase();
    const cleanId = (o.id || '').toLowerCase();
    const cleanName = (o.customerName || '').toLowerCase();
    return (
      cleanPhone.includes(q.replace(/[\s-]/g, '')) || 
      cleanEmail.includes(q) || 
      cleanId.includes(q) || 
      cleanName.includes(q)
    );
  });

  return (
    <div className="bg-[#FAF8F7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EEDDE1]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1E232A]">
                Purchase Hub Admin Control Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#718096] mt-1">
              Store operations, customer orders, product photography & administrator accounts
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Logged in: <strong>{currentAdminUser?.name || 'Shawon (Super Admin)'}</strong></span>
                <span className="font-mono text-[11px] text-gray-500">({currentAdminUser?.email || 'shawon_admin@purchase-hub.com'})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 bg-white border border-[#E5D5DA] rounded-xl text-xs font-semibold text-[#1E232A] hover:bg-[#FAF8F7] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#718096]" />
              <span>Live Storefront</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#718096] text-xs font-medium">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#B76E79]" />
            </div>
            <div className="text-2xl font-bold text-[#1E232A] tabular-nums">
              {orders.length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#718096] text-xs font-medium">
              <span>Total Products</span>
              <Package className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-[#1E232A] tabular-nums">
              {totalProductsCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
              <span>Low Stock Items</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700 tabular-nums">
              {lowStockCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
              <span>Out of Stock</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-rose-700 tabular-nums">
              {outOfStockCount}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EEDDE1]">
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Products', icon: Package, count: totalProductsCount },
            { id: 'categories', label: 'Categories', icon: FolderTree },
            { id: 'brands', label: 'Brands', icon: Tag },
            { id: 'banners', label: 'Hero Banners', icon: ImageIcon },
            { id: 'admins', label: 'Admin Accounts', icon: Users, count: adminUsers.length },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'supabase', label: 'Database', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#1E232A] text-white shadow-xs' 
                    : 'bg-white text-[#4A5568] hover:bg-[#FAF5F6] border border-[#EDE2E5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F0E4E7]">
              <div>
                <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
                  <span>Orders Management & Customer Filtering</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF5F6] text-[#B76E79] font-bold">
                    {adminFilteredOrders.length}
                  </span>
                </h2>
                <p className="text-xs text-[#718096] mt-0.5">
                  Filter orders instantly by customer phone number, email address, or order ID
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Orders', count: orders.length },
                  { id: 'pending', label: 'Pending Approval', count: orders.filter(o => o.status === 'pending').length, isPending: true },
                  { id: 'confirmed', label: 'Approved', count: orders.filter(o => o.status === 'confirmed').length },
                  { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
                  { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                  { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                  { id: 'cancelled', label: 'Not Approved', count: orders.filter(o => o.status === 'cancelled' || o.status === 'rejected').length }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      orderStatusFilter === st.id 
                        ? 'bg-[#1E232A] text-white shadow-2xs' 
                        : st.isPending && st.count > 0
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold'
                        : 'bg-[#FAF8F7] hover:bg-[#F3E8EB] text-[#4A5568] border border-[#E8D4D9]'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      orderStatusFilter === st.id 
                        ? 'bg-white/20 text-white' 
                        : st.isPending && st.count > 0
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar specifically highlighting phone and email filtering */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Customer Phone (e.g. 01705776631), Email, or Order ID..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              {orderSearch && (
                <button
                  type="button"
                  onClick={() => setOrderSearch('')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Orders List / Cards */}
            {adminFilteredOrders.length === 0 ? (
              <div className="py-12 text-center bg-[#FAF8F7] rounded-2xl border border-dashed border-[#E5D5DA]">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1E232A]">
                  No matching orders found
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try checking different phone digits, email address, or clear status filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminFilteredOrders.map(order => (
                  <div
                    key={order.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      order.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                        : order.status === 'confirmed'
                        ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-400'
                        : order.status === 'cancelled' || order.status === 'rejected'
                        ? 'bg-rose-50/30 border-rose-200 hover:border-rose-400 opacity-90'
                        : 'bg-[#FAF8F7] border-[#EDE2E5] hover:border-[#B76E79]/40'
                    }`}
                  >
                    {/* Top Row: Order ID, Date, Approval Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E4E7]">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#1E232A] bg-white px-3 py-1 rounded-lg border border-[#E5D5DA] shadow-2xs">
                          #{order.id}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(order.created_at).toLocaleString('en-US')}</span>
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : order.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : order.status === 'processing'
                            ? 'bg-sky-100 text-sky-800 border-sky-300'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : order.status === 'delivered'
                            ? 'bg-teal-100 text-teal-800 border-teal-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {order.status === 'pending' && <Clock className="w-3 h-3 animate-spin" />}
                          {order.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {order.status === 'cancelled' && <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>
                            {order.status === 'pending'
                              ? 'Awaiting Approval'
                              : order.status === 'confirmed'
                              ? 'Approved'
                              : order.status === 'processing'
                              ? 'Processing'
                              : order.status === 'shipped'
                              ? 'Shipped'
                              : order.status === 'delivered'
                              ? 'Delivered'
                              : 'Not Approved'}
                          </span>
                        </span>
                      </div>

                      {/* Approval Quick Actions & Status Workflow */}
                      <div className="flex flex-wrap items-center gap-2">
                        
                        {/* 1. Pending Order Quick Approve / Reject Buttons */}
                        {order.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => approveOrder(order.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95 cursor-pointer"
                              title="Approve this order"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve Order</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectingOrder(order);
                                setRejectReasonSelection('phone_unreachable');
                                setCustomRejectReason('');
                              }}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95 cursor-pointer"
                              title="Reject this order"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Not Approve</span>
                            </button>
                          </div>
                        )}

                        {/* 2. Re-approve button for Cancelled/Rejected Orders */}
                        {(order.status === 'cancelled' || order.status === 'rejected') && (
                          <button
                            type="button"
                            onClick={() => approveOrder(order.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Re-Approve Order</span>
                          </button>
                        )}

                        {/* 3. Status Selector for advanced phase transition */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-semibold text-gray-500 uppercase hidden sm:inline">
                            Status:
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newSt = e.target.value as OrderStatus;
                              if (newSt === 'cancelled' || newSt === 'rejected') {
                                setRejectingOrder(order);
                                setRejectReasonSelection('customer_cancelled');
                              } else if (newSt === 'confirmed') {
                                approveOrder(order.id);
                              } else {
                                updateOrderStatus(order.id, newSt);
                              }
                            }}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border bg-white focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Approved</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Not Approved</option>
                          </select>
                        </div>

                        {/* Delete Order Action */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Prominent Status Notification Callout */}
                    {order.status === 'pending' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-semibold">
                            New order waiting for review. Check customer contact details & stock before approving or rejecting.
                          </span>
                        </div>
                      </div>
                    )}

                    {order.status === 'confirmed' && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold">
                            Order approved & confirmed.
                            {order.approved_at && (
                              <span className="font-normal opacity-75 font-mono ml-1">
                                ({new Date(order.approved_at).toLocaleString('en-US')})
                              </span>
                            )}
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${order.customerName}, your Purchase Hub Order #${order.id} (BDT ${order.total}) has been APPROVED and is being prepared for dispatch!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Send WhatsApp Confirmation</span>
                        </a>
                      </div>
                    )}

                    {(order.status === 'cancelled' || order.status === 'rejected') && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-rose-700">
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Order Not Approved / Cancelled</span>
                        </div>
                        {order.rejectionReason && (
                          <p className="text-gray-700 pl-6 text-[11px]">
                            <span className="font-semibold text-rose-800">Reason: </span>
                            {order.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Middle Row: Customer Details & Contact Affordances */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-[#EDE2E5]">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Customer & Phone
                        </span>
                        <div className="font-semibold text-sm text-[#1E232A]">
                          {order.customerName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="font-mono text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{order.customerPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${order.customerName}, regarding your Purchase Hub Order #${order.id}:`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Email Account (Filterable)
                        </span>
                        <a
                          href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(`Purchase Hub Order #${order.id}`)}`}
                          className="font-mono text-indigo-700 hover:underline flex items-center gap-1 break-all"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{order.customerEmail}</span>
                        </a>
                        <div className="mt-1 text-[11px] text-gray-500">
                          Payment: 
                          <span className="font-semibold uppercase text-[#1E232A] ml-1">{order.paymentMethod}</span>
                          {' · '}
                          <span className={order.paymentStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-medium'}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Delivery Address & Zone
                        </span>
                        <p className="text-gray-700 leading-snug line-clamp-2" title={order.customerAddress}>
                          {order.customerAddress}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#FAF5F6] text-[#B76E79] rounded text-[10px] font-bold uppercase">
                          {order.deliveryZone === 'inside_dhaka' 
                            ? 'Inside Dhaka (৳60)' 
                            : 'Outside Dhaka (৳120)'}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="bg-white rounded-xl border border-[#EDE2E5] overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F7] text-gray-500 uppercase text-[10px] font-bold border-b border-[#EDE2E5]">
                          <tr>
                            <th className="py-2 px-3">Item</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Price</th>
                            <th className="py-2 px-3 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3E8EB]">
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[#FAF8F7]/50">
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt="Product"
                                      referrerPolicy="no-referrer"
                                      className="w-8 h-8 rounded object-cover border border-[#EDE2E5] bg-gray-50 shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="font-semibold text-[#1E232A]">
                                      {item.name_en}
                                    </div>
                                    <span className="font-mono text-[10px] text-gray-400">{item.sku}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center font-mono font-bold">
                                {item.quantity}
                              </td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums text-gray-600">
                                ৳ {item.price.toLocaleString('en-US')}
                              </td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-[#1E232A]">
                                ৳ {(item.price * item.quantity).toLocaleString('en-US')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-[#FAF8F7] text-xs font-semibold border-t border-[#EDE2E5]">
                          <tr>
                            <td colSpan={3} className="py-2 px-3 text-right text-gray-500">
                              Subtotal + Delivery:
                            </td>
                            <td className="py-2 px-3 text-right font-mono tabular-nums text-gray-700">
                              ৳ {order.subtotal.toLocaleString('en-US')} + ৳ {order.deliveryCharge}
                            </td>
                          </tr>
                          <tr className="border-t border-[#EDE2E5]">
                            <td colSpan={3} className="py-2 px-3 text-right text-sm font-bold text-[#1E232A]">
                              Grand Total Due:
                            </td>
                            <td className="py-2 px-3 text-right font-mono tabular-nums text-base font-bold text-[#B76E79]">
                              ৳ {order.total.toLocaleString('en-US')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Customer Delivery Note if provided */}
                    {order.note && (
                      <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        <span className="font-bold">Delivery Note: </span>
                        <span>{order.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by name or SKU..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                />
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#4A5568]">
                <thead className="bg-[#FAF8F7] text-[#718096] uppercase font-semibold border-b border-[#EEDDE1]">
                  <tr>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E8EB]">
                  {adminFilteredProducts.map((p) => {
                    const cat = categories.find(c => c.id === p.category_id);
                    const primaryImg = p.images?.find(i => i.is_primary) || p.images?.[0];
                    const imgUrl = primaryImg?.storage_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg';

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF8F7] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={imgUrl}
                              alt="Item"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            />
                            <div>
                              <div className="font-semibold text-[#1E232A] line-clamp-1">
                                {p.name_en}
                              </div>
                              <span className="font-mono text-[11px] text-gray-400">
                                {p.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium">
                          {cat ? cat.name_en : '—'}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-[#1E232A]">
                          ৳ {p.sale_price ?? p.price}
                          {p.sale_price && (
                            <span className="text-[10px] text-gray-400 line-through block">৳ {p.price}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          {p.stock_quantity <= 0 ? (
                            <span className="text-rose-600 font-semibold">Out of Stock (0)</span>
                          ) : p.stock_quantity <= p.low_stock_threshold ? (
                            <span className="text-amber-600 font-semibold">{p.stock_quantity} (Low Stock)</span>
                          ) : (
                            <span className="text-emerald-700">{p.stock_quantity}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleProductActive(p.id)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                              p.is_active 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{p.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-gray-600 hover:text-[#B76E79] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E7]">
              <div>
                <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                  Categories
                </h2>
                <p className="text-xs text-[#718096]">
                  Create and organize database-driven categories
                </p>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-[#EDE2E5] bg-[#FAF8F7] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#1E232A]">
                      {c.name_en}
                    </h4>
                    <span className="font-mono text-xs text-gray-400">/{c.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCategory(c)}
                      className="p-1.5 hover:bg-white rounded-lg text-gray-600 hover:text-[#B76E79]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BRANDS */}
        {activeTab === 'brands' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E7]">
              <div>
                <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                  Brands
                </h2>
                <p className="text-xs text-[#718096]">
                  Manage cosmetic and perfume brands
                </p>
              </div>
              <button
                onClick={() => setIsAddBrandOpen(true)}
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Brand</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brands.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border border-[#EDE2E5] bg-[#FAF8F7] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#1E232A]">{b.name}</h4>
                    <span className="font-mono text-xs text-gray-400">{b.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingBrand(b)}
                      className="p-1.5 hover:bg-white rounded-lg text-gray-600 hover:text-[#B76E79]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBrand(b.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HERO BANNERS */}
        {activeTab === 'banners' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E7]">
              <div>
                <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                  Hero Banners
                </h2>
                <p className="text-xs text-[#718096]">
                  Manage slides in the hero banner slider
                </p>
              </div>
              <button
                onClick={() => setIsAddBannerOpen(true)}
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner</span>
              </button>
            </div>

            <div className="space-y-4">
              {banners.map((b, idx) => (
                <div key={b.id} className="p-4 rounded-2xl border border-[#EDE2E5] bg-[#FAF8F7] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={b.image_path}
                      alt="Banner"
                      referrerPolicy="no-referrer"
                      className="w-24 h-14 rounded-lg object-cover bg-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-sm text-[#1E232A]">
                        {b.title_en}
                      </div>
                      <p className="text-xs text-[#718096] line-clamp-1">{b.subtitle_en}</p>
                      <span className="text-[11px] font-mono text-gray-400">Order: {b.sort_order} · Link: {b.destination_url}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingBanner(b)}
                      className="p-2 hover:bg-white rounded-lg text-gray-600 hover:text-[#B76E79]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBanner(b.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ADMINISTRATOR ACCOUNTS */}
        {activeTab === 'admins' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 sm:p-8 space-y-6 shadow-xs max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E4E7]">
              <div>
                <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury flex items-center gap-2">
                  <span>Administrator Accounts & Permissions</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF5F6] text-[#B76E79] font-bold">
                    {adminUsers.length}
                  </span>
                </h2>
                <p className="text-xs text-[#718096] mt-0.5">
                  Create someone admin, assign role privileges, and manage admin credentials
                </p>
              </div>

              <button
                onClick={() => setIsAddAdminOpen(true)}
                className="px-4 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Admin</span>
              </button>
            </div>

            {/* Base Admin Notice */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-900 space-y-0.5">
                <span className="font-bold text-sm block">Base Super Administrator Account</span>
                <p>
                  User ID: <span className="font-mono font-bold">shawon_admin@purchase-hub.com</span> · Role: <span className="font-semibold text-purple-700">Super Admin (Protected)</span>
                </p>
                <p className="text-purple-700 text-[11px]">
                  This primary super administrator account is protected and cannot be deleted. Any additional administrators you create below can sign in using their own credentials.
                </p>
              </div>
            </div>

            {/* Admins Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#4A5568]">
                <thead className="bg-[#FAF8F7] text-[#718096] uppercase font-semibold border-b border-[#EEDDE1]">
                  <tr>
                    <th className="py-3 px-4">Administrator</th>
                    <th className="py-3 px-4">User ID / Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E8EB]">
                  {adminUsers.map((admin) => {
                    const isBaseAdmin = admin.email.toLowerCase() === 'shawon_admin@purchase-hub.com';

                    return (
                      <tr key={admin.id} className="hover:bg-[#FAF8F7] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#D97793] flex items-center justify-center text-white font-bold text-xs">
                              {admin.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-[#1E232A] flex items-center gap-1.5">
                                <span>{admin.name}</span>
                                {isBaseAdmin && (
                                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">
                                    Base Super Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-gray-700">
                          {admin.email}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            admin.role === 'super_admin' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : admin.role === 'admin' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}>
                            {admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Administrator' : 'Order Manager'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            admin.is_active 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${admin.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{admin.is_active ? 'Active' : 'Inactive'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingAdmin(admin)}
                              className="p-1.5 text-gray-600 hover:text-[#B76E79] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Details / Password"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {!isBaseAdmin && (
                              <>
                                <button
                                  onClick={() => updateAdminUser(admin.id, { is_active: !admin.is_active })}
                                  className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                  title={admin.is_active ? 'Deactivate Account' : 'Activate Account'}
                                >
                                  {admin.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to remove admin account ${admin.name} (${admin.email})?`)) {
                                      deleteAdminUser(admin.id);
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
            <div className="pb-4 border-b border-[#F0E4E7]">
              <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                Store Settings
              </h2>
              <p className="text-xs text-[#718096]">
                Configure WhatsApp hotline, store contact details and delivery charges
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSettings(settingsForm);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                    WhatsApp Hotline Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsapp_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm font-mono text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.phone_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone_number: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm font-mono text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settingsForm.low_stock_threshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, low_stock_threshold: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                    Delivery Charge (Inside Dhaka) - BDT
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.delivery_charge_inside_dhaka}
                    onChange={(e) => setSettingsForm({ ...settingsForm, delivery_charge_inside_dhaka: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                    Delivery Charge (Outside Dhaka) - BDT
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.delivery_charge_outside_dhaka}
                    onChange={(e) => setSettingsForm({ ...settingsForm, delivery_charge_outside_dhaka: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                  Store Address
                </label>
                <input
                  type="text"
                  value={settingsForm.address_en}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address_en: e.target.value, address_bn: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                  placeholder="House/Plot, Road, Area, Thana, District"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: SUPABASE ARCHITECTURE & MIGRATION HELPER */}
        {activeTab === 'supabase' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
            <div className="pb-4 border-b border-[#F0E4E7]">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                  Supabase PostgreSQL & Security RLS
                </h2>
              </div>
              <p className="text-xs text-[#718096] mt-1">
                Status: {isSupabaseConfigured 
                  ? <span className="text-emerald-600 font-semibold">Connected to live Supabase project</span> 
                  : <span className="text-amber-600 font-semibold">Running in hybrid local persistent mode (Ready to connect)</span>}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#4A5568]">
              <p>
                This application is fully architected for Supabase PostgreSQL, Auth, Storage, and Row Level Security (RLS). You can inspect and copy the initial migration below.
              </p>

              <div className="p-4 bg-[#1E232A] text-white rounded-2xl font-mono text-xs overflow-x-auto max-h-60">
                <pre>{`-- Run in Supabase SQL Editor:
-- 1. profiles table with role ('admin' | 'user')
-- 2. categories (hierarchical, bilingual)
-- 3. brands
-- 4. products (check constraints: price >= 0, sale_price < price, stock >= 0)
-- 5. product_images
-- 6. banners
-- 7. site_settings
-- 8. Row Level Security: public read active, admin CRUD`}</pre>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`See /supabase/migrations/20261021_init_schema.sql`);
                    showToast('Migration path copied', 'success');
                  }}
                  className="px-4 py-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F3E8EB] cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>Copy SQL Migration File Location</span>
                </button>

                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1E232A] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Supabase Dashboard</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {(isAddProductOpen || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          brands={brands}
          onClose={() => {
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (data) => {
            if (editingProduct) {
              await updateProduct(editingProduct.id, data);
            } else {
              await addProduct(data);
            }
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* CATEGORY ADD / EDIT MODAL */}
      {(isAddCategoryOpen || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setIsAddCategoryOpen(false);
            setEditingCategory(null);
          }}
          onSave={async (data) => {
            if (editingCategory) {
              await updateCategory(editingCategory.id, data);
            } else {
              await addCategory(data);
            }
            setIsAddCategoryOpen(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* BRAND ADD / EDIT MODAL */}
      {(isAddBrandOpen || editingBrand) && (
        <BrandFormModal
          brand={editingBrand}
          onClose={() => {
            setIsAddBrandOpen(false);
            setEditingBrand(null);
          }}
          onSave={async (data) => {
            if (editingBrand) {
              await updateBrand(editingBrand.id, data);
            } else {
              await addBrand(data);
            }
            setIsAddBrandOpen(false);
            setEditingBrand(null);
          }}
        />
      )}

      {/* BANNER ADD / EDIT MODAL */}
      {(isAddBannerOpen || editingBanner) && (
        <BannerFormModal
          banner={editingBanner}
          onClose={() => {
            setIsAddBannerOpen(false);
            setEditingBanner(null);
          }}
          onSave={async (data) => {
            if (editingBanner) {
              await updateBanner(editingBanner.id, data);
            } else {
              await addBanner(data);
            }
            setIsAddBannerOpen(false);
            setEditingBanner(null);
          }}
        />
      )}

      {/* ADMIN USER ADD / EDIT MODAL */}
      {(isAddAdminOpen || editingAdmin) && (
        <AdminFormModal
          admin={editingAdmin}
          onClose={() => {
            setIsAddAdminOpen(false);
            setEditingAdmin(null);
          }}
          onSave={async (data) => {
            if (editingAdmin) {
              await updateAdminUser(editingAdmin.id, data);
            } else {
              await addAdminUser(data);
            }
            setIsAddAdminOpen(false);
            setEditingAdmin(null);
          }}
        />
      )}

      {/* ORDER REJECTION / NOT APPROVE MODAL */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E7]">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <XCircle className="w-5 h-5 shrink-0" />
                <span className="font-serif-luxury text-base text-[#1E232A]">
                  Reject Order #{rejectingOrder.id}
                </span>
              </div>
              <button 
                onClick={() => setRejectingOrder(null)} 
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-gray-600">
                Select why this order cannot be approved (customer will see this in their tracker):
              </p>

              <div className="space-y-2">
                {[
                  { id: 'phone_unreachable', label: 'Customer phone unreachable / not received' },
                  { id: 'invalid_address', label: 'Invalid or incomplete delivery address' },
                  { id: 'out_of_stock', label: 'Out of stock / damaged stock' },
                  { id: 'customer_cancelled', label: 'Customer requested cancellation' },
                  { id: 'duplicate_suspicious', label: 'Duplicate or suspicious order' },
                  { id: 'other', label: 'Other specific reason' }
                ].map(r => (
                  <label key={r.id} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    rejectReasonSelection === r.id 
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold' 
                      : 'bg-[#FAF8F7] hover:bg-[#F3E8EB]/50 border-[#EDE2E5] text-gray-800'
                  }`}>
                    <input
                      type="radio"
                      name="reject_reason_choice"
                      value={r.id}
                      checked={rejectReasonSelection === r.id}
                      onChange={() => setRejectReasonSelection(r.id)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>

              {rejectReasonSelection === 'other' && (
                <div className="pt-1">
                  <label className="font-semibold text-gray-700 block mb-1">
                    Write custom rejection reason:
                  </label>
                  <textarea
                    rows={2}
                    value={customRejectReason}
                    onChange={(e) => setCustomRejectReason(e.target.value)}
                    placeholder="e.g. Customer prefers another shade or item variant..."
                    className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs text-[#1E232A] focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-[#F0E4E7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  className="px-4 py-2.5 border border-[#E5D5DA] text-gray-700 hover:bg-gray-50 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const reasonMap: Record<string, string> = {
                      phone_unreachable: 'Customer phone unreachable / not received',
                      invalid_address: 'Invalid or incomplete delivery address',
                      out_of_stock: 'Out of stock / damaged stock',
                      customer_cancelled: 'Customer requested cancellation',
                      duplicate_suspicious: 'Duplicate or suspicious order',
                      other: customRejectReason.trim() || 'Rejected by administrator'
                    };
                    const finalReason = reasonMap[rejectReasonSelection] || customRejectReason.trim() || 'Rejected by administrator';
                    await rejectOrder(rejectingOrder.id, finalReason);
                    setRejectingOrder(null);
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1E232A]">
              Are you sure you want to delete this product?
            </h3>
            <p className="text-xs text-gray-500">
              This action cannot be undone and will permanently remove this item from your catalog.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-[#E5D5DA] rounded-xl text-xs font-semibold text-[#718096] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ==============================================================================
// MODAL: PRODUCT FORM MODAL (8 Mandatory Sections)
// ==============================================================================
interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  brands,
  onClose,
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    sku: product?.sku || `SKU-${Date.now().toString().slice(-6)}`,
    slug: product?.slug || `product-${Date.now().toString().slice(-6)}`,
    name_en: product?.name_en || '',
    name_bn: product?.name_bn || '',
    description_en: product?.description_en || '',
    description_bn: product?.description_bn || '',
    usage_instructions_en: product?.usage_instructions_en || '',
    usage_instructions_bn: product?.usage_instructions_bn || '',
    brand_id: product?.brand_id || brands[0]?.id || '',
    category_id: product?.category_id || categories[0]?.id || '',
    price: product?.price ?? 1000,
    sale_price: product?.sale_price ?? null,
    stock_quantity: product?.stock_quantity ?? 10,
    low_stock_threshold: product?.low_stock_threshold ?? 5,
    warranty_status: product?.warranty_status || 'not_applicable',
    warranty_duration: product?.warranty_duration || '',
    warranty_terms_en: product?.warranty_terms_en || '',
    warranty_terms_bn: product?.warranty_terms_bn || '',
    expiry_date: product?.expiry_date || '',
    batch_number: product?.batch_number || '',
    net_content: product?.net_content || '',
    ingredients_en: product?.ingredients_en || '',
    ingredients_bn: product?.ingredients_bn || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    is_new_arrival: product?.is_new_arrival ?? true,
    is_best_seller: product?.is_best_seller ?? false,
    images: product?.images || []
  });

  // State for all product images
  const [productImages, setProductImages] = useState<ProductImage[]>(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    return [
      {
        id: 'img-' + Date.now(),
        product_id: product?.id || 'new',
        storage_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
        alt_text_en: product?.name_en || '',
        alt_text_bn: product?.name_bn || '',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ];
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');

  // High-performance canvas-based image downscaler to keep localStorage healthy
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Invalid image file format'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsCompressing(true);

    try {
      const newImages: ProductImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressedBase64 = await compressImageFile(file);
        newImages.push({
          id: 'img-' + Date.now() + '-' + i,
          product_id: product?.id || 'new',
          storage_path: compressedBase64,
          alt_text_en: formData.name_en || file.name,
          alt_text_bn: formData.name_bn || '',
          sort_order: productImages.length + i + 1,
          is_primary: productImages.length === 0 && i === 0,
          created_at: new Date().toISOString()
        });
      }

      if (newImages.length > 0) {
        setProductImages(prev => {
          const combined = [...prev, ...newImages];
          if (!combined.some(img => img.is_primary)) {
            combined[0].is_primary = true;
          }
          return combined;
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error processing uploaded images');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = (id: string) => {
    setProductImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === id
    })));
  };

  const handleDeleteImage = (id: string) => {
    setProductImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    const newImg: ProductImage = {
      id: 'img-' + Date.now(),
      product_id: product?.id || 'new',
      storage_path: manualUrlInput.trim(),
      alt_text_en: formData.name_en || '',
      alt_text_bn: formData.name_bn || '',
      sort_order: productImages.length + 1,
      is_primary: productImages.length === 0,
      created_at: new Date().toISOString()
    };
    setProductImages(prev => [...prev, newImg]);
    setManualUrlInput('');
    setShowUrlInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sale_price && Number(formData.sale_price) >= Number(formData.price)) {
      alert('Sale price must be strictly less than the regular price!');
      return;
    }

    if (productImages.length === 0) {
      alert('Please upload or provide at least one product photography image!');
      return;
    }

    onSave({ ...formData, images: productImages });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full max-h-[92vh] rounded-3xl overflow-y-auto border border-[#EDE2E5] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F0E4E7] px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-base text-[#1E232A] font-serif-luxury">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              1. Basic Information & Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">SKU *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name_en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Brand *</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl cursor-pointer"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Product Name & Description (English Only) */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              2. Product Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value, name_bn: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                  placeholder="e.g. Aurélia Botanical Facial Serum"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value, description_bn: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                  placeholder="Detailed description of ingredients, benefits, and routine application..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Price & Discounts */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              3. Pricing & Discounts (BDT)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Regular Price (৳) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Sale Price (৳) - Optional</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sale_price ?? ''}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? Number(e.target.value) : null })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono tabular-nums"
                  placeholder="Must be less than regular price"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Stock & Threshold */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              4. Inventory & Stock Quantities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Low Stock Warning Threshold</label>
                <input
                  type="number"
                  min="1"
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Warranty & Expiry */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              5. Warranty, Expiry Date & Net Content
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Warranty Status</label>
                <select
                  value={formData.warranty_status}
                  onChange={(e) => setFormData({ ...formData, warranty_status: e.target.value as WarrantyStatus })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                >
                  <option value="not_applicable">Not Applicable</option>
                  <option value="yes">Yes (Under Warranty)</option>
                  <option value="no">No Warranty</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Warranty Duration (if yes)</label>
                <input
                  type="text"
                  value={formData.warranty_duration || ''}
                  onChange={(e) => setFormData({ ...formData, warranty_duration: e.target.value })}
                  placeholder="e.g. 6 Months"
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Net Content</label>
                <input
                  type="text"
                  value={formData.net_content || ''}
                  onChange={(e) => setFormData({ ...formData, net_content: e.target.value })}
                  placeholder="e.g. 50ml / 3.4 oz"
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Batch Number</label>
                <input
                  type="text"
                  value={formData.batch_number || ''}
                  onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  placeholder="e.g. BATCH-2026-X"
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiry_date || ''}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Image Media / Product Photography Upload System */}
          <div className="space-y-4 pb-4 border-b border-[#F0E4E7]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>6. Product Photography / File Upload System</span>
                </h4>
                <p className="text-[11px] text-[#718096] mt-0.5">
                  Upload actual photography pictures from your device (disk/phone). Supports multiple pictures with automatic web-optimization.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-semibold text-[#B76E79] hover:underline cursor-pointer"
              >
                {showUrlInput ? 'Hide URL Input' : '+ Or Paste Image URL'}
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
              className="hidden"
            />

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging 
                  ? 'border-[#B76E79] bg-[#FAF5F6]' 
                  : 'border-[#E5D5DA] bg-[#FAF8F7] hover:border-[#B76E79] hover:bg-[#FAF5F6]/60'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white text-[#B76E79] flex items-center justify-center shadow-2xs border border-[#EDE2E5]">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="font-bold text-xs sm:text-sm text-[#1E232A]">
                  {isCompressing 
                    ? 'Processing & optimizing photos...' 
                    : 'Click to select pictures from device or drag & drop here'}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Supports JPG, PNG, WEBP (Multiple pictures allowed · Max 1200px auto-optimized)
                </p>
              </div>

              <button
                type="button"
                disabled={isCompressing}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-1 px-4 py-2 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Browse Images from Device
              </button>
            </div>

            {/* Optional Manual URL Input Fallback */}
            {showUrlInput && (
              <div className="p-3 bg-white border border-[#E5D5DA] rounded-xl flex items-center gap-2">
                <input
                  type="text"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  placeholder="https://example.com/product-photo.jpg or /src/assets/..."
                  className="flex-1 p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-lg text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="px-3 py-2 bg-[#B76E79] text-white rounded-lg text-xs font-semibold hover:bg-[#A35C67] whitespace-nowrap cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            )}

            {/* Uploaded Photography Gallery Cards */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">
                Product Gallery Photos ({productImages.length})
              </span>

              {productImages.length === 0 ? (
                <div className="p-4 bg-[#FAF8F7] border border-dashed border-[#E5D5DA] rounded-xl text-center text-xs text-gray-500">
                  No images uploaded yet. Click above to upload the first photo!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {productImages.map((img, idx) => (
                    <div 
                      key={img.id || idx}
                      className={`relative p-2.5 rounded-2xl border transition-all bg-white flex flex-col justify-between gap-2 shadow-2xs ${
                        img.is_primary ? 'border-[#B76E79] ring-2 ring-[#B76E79]/20' : 'border-[#EDE2E5]'
                      }`}
                    >
                      <div className="relative aspect-4/3 w-full bg-[#FAF5F6] rounded-xl overflow-hidden border border-[#F0E4E7]">
                        <img
                          src={img.storage_path}
                          alt="Product photography"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {img.is_primary && (
                          <div className="absolute top-2 left-2 bg-[#1E232A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Primary Cover
                          </div>
                        )}
                        <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        {!img.is_primary ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img.id)}
                            className="text-[11px] font-semibold text-[#B76E79] hover:underline cursor-pointer"
                          >
                            Set as Cover
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Cover Photo
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove this photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Storage type indicator */}
                      <div className="text-[10px] text-gray-400 truncate font-mono">
                        {img.storage_path.startsWith('data:image') 
                          ? 'Device Upload (Optimized Base64)' 
                          : img.storage_path.slice(0, 30) + '...'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 7: Publishing & Merchandising Flags */}
          <div className="space-y-3 pb-4">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              7. Publishing Flags
            </h4>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-[#B76E79] focus:ring-[#B76E79]"
                />
                <span>Active (Visible on Website)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#B76E79] focus:ring-[#B76E79]"
                />
                <span>Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_new_arrival}
                  onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                  className="rounded text-[#B76E79] focus:ring-[#B76E79]"
                />
                <span>New Arrival</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_best_seller}
                  onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                  className="rounded text-[#B76E79] focus:ring-[#B76E79]"
                />
                <span>Best Seller</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#F0E4E7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#E5D5DA] rounded-xl text-xs font-semibold text-[#718096] hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className="px-6 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save Product & Photos
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// ==============================================================================
// MODAL: CATEGORY FORM MODAL
// ==============================================================================
interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<void>;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, onClose, onSave }) => {
  const [nameEn, setNameEn] = useState(category?.name_en || '');
  const [slug, setSlug] = useState(category?.slug || '');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0E4E7]">
          <h3 className="font-bold text-sm text-[#1E232A]">
            {category ? 'Edit Category' : 'Add Category'}
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ name_en: nameEn, name_bn: nameEn, slug: slug.toLowerCase().replace(/\s+/g, '-') });
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Category Name *</label>
            <input 
              required 
              value={nameEn} 
              onChange={(e) => {
                setNameEn(e.target.value);
                if (!category) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }} 
              className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" 
              placeholder="e.g. Electric & Gadgets"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Slug *</label>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-gray-600">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#B76E79] text-white rounded-xl font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==============================================================================
// MODAL: BRAND FORM MODAL
// ==============================================================================
interface BrandFormModalProps {
  brand: Brand | null;
  onClose: () => void;
  onSave: (data: Partial<Brand>) => Promise<void>;
}

const BrandFormModal: React.FC<BrandFormModalProps> = ({ brand, onClose, onSave }) => {
  const [name, setName] = useState(brand?.name || '');
  const [slug, setSlug] = useState(brand?.slug || '');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0E4E7]">
          <h3 className="font-bold text-sm text-[#1E232A]">
            {brand ? 'Edit Brand' : 'Add Brand'}
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, slug: slug.toLowerCase().replace(/\s+/g, '-') });
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Brand Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Slug *</label>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-gray-600">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#B76E79] text-white rounded-xl font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==============================================================================
// MODAL: BANNER FORM MODAL
// ==============================================================================
interface BannerFormModalProps {
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: Partial<Banner>) => Promise<void>;
}

const BannerFormModal: React.FC<BannerFormModalProps> = ({ banner, onClose, onSave }) => {
  const [titleEn, setTitleEn] = useState(banner?.title_en || '');
  const [subtitleEn, setSubtitleEn] = useState(banner?.subtitle_en || '');
  const [imagePath, setImagePath] = useState(banner?.image_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg');
  const [buttonTextEn, setButtonTextEn] = useState(banner?.button_text_en || 'Shop Now');
  const [destinationUrl, setDestinationUrl] = useState(banner?.destination_url || '#products');
  const [sortOrder, setSortOrder] = useState(banner?.sort_order ?? 1);
  const [isUploading, setIsUploading] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setImagePath(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          setImagePath(event.target?.result as string);
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0E4E7]">
          <h3 className="font-bold text-sm text-[#1E232A]">
            {banner ? 'Edit Hero Slide' : 'Add Hero Slide'}
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({
            title_en: titleEn,
            title_bn: titleEn,
            subtitle_en: subtitleEn,
            subtitle_bn: subtitleEn,
            image_path: imagePath,
            button_text_en: buttonTextEn,
            button_text_bn: buttonTextEn,
            destination_url: destinationUrl,
            sort_order: sortOrder
          });
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Slide Title *</label>
            <input required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. Authentic Luxury Beauty & Grooming" className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Slide Subtitle *</label>
            <textarea required rows={2} value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} placeholder="Short persuasive description..." className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          
          {/* Banner Photo Upload */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Banner Image / Photography *</label>
            
            <input
              type="file"
              ref={bannerFileInputRef}
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />

            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => bannerFileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3.5 py-2 bg-[#FAF8F7] hover:bg-[#F3E8EB] border border-[#E5D5DA] rounded-xl font-semibold text-[#1E232A] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>{isUploading ? 'Compressing...' : 'Upload Picture from Device'}</span>
              </button>
              <span className="text-gray-400 text-[11px]">or paste link below</span>
            </div>

            <input
              required
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="https://... or uploaded image"
              className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono text-[11px]"
            />

            {imagePath && (
              <div className="mt-2 relative rounded-xl overflow-hidden border border-[#EDE2E5] max-h-36 bg-gray-100">
                <img
                  src={imagePath}
                  alt="Banner preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Button Label</label>
              <input value={buttonTextEn} onChange={(e) => setButtonTextEn(e.target.value)} placeholder="e.g. Shop Now" className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
            </div>
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Destination URL</label>
              <input value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono" />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-gray-600">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#B76E79] text-white rounded-xl font-semibold">Save Slide</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==============================================================================
// MODAL: ADMIN USER FORM MODAL
// ==============================================================================
interface AdminFormModalProps {
  admin: AdminUser | null;
  onClose: () => void;
  onSave: (data: Omit<AdminUser, 'id' | 'created_at'>) => Promise<void>;
}

const AdminFormModal: React.FC<AdminFormModalProps> = ({ admin, onClose, onSave }) => {
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [password, setPassword] = useState(admin?.password || '');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'manager'>(admin?.role || 'admin');
  const [isActive, setIsActive] = useState(admin ? admin.is_active : true);
  const [showPassword, setShowPassword] = useState(false);

  const isBaseAdmin = admin?.email.toLowerCase() === 'shawon_admin@purchase-hub.com';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0E4E7]">
          <h3 className="font-bold text-sm text-[#1E232A]">
            {admin ? 'Edit Administrator Account' : 'Add New Administrator'}
          </h3>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({
            name,
            email,
            password,
            role,
            is_active: isActive
          });
        }} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Full Name *</label>
            <input 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Asif Mahmud"
              className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]" 
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">User ID / Email Address *</label>
            <input 
              required 
              type="email"
              value={email} 
              disabled={isBaseAdmin}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. asif@purchase-hub.com"
              className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono text-xs sm:text-sm text-[#1E232A] disabled:opacity-60" 
            />
            {isBaseAdmin && (
              <span className="text-[10px] text-purple-700 mt-1 block font-medium">Base Super Admin User ID is locked</span>
            )}
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Login Password *</label>
            <div className="relative">
              <input 
                required 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter login password"
                className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono text-xs sm:text-sm text-[#1E232A] pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Administrative Role *</label>
            <select
              value={role}
              disabled={isBaseAdmin}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A] disabled:opacity-60"
            >
              <option value="super_admin">Super Admin (All Privileges)</option>
              <option value="admin">Administrator (Orders, Products, Catalog)</option>
              <option value="manager">Order Manager (Order Approval & Shipping)</option>
            </select>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                disabled={isBaseAdmin}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[#B76E79] focus:ring-[#B76E79]"
              />
              <span>Account Active (Allowed to log into admin dashboard)</span>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#F0E4E7]">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-gray-600 cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl font-semibold cursor-pointer">
              Save Admin Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

