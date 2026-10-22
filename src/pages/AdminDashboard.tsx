import React, { useState } from 'react';
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
  Check, 
  Eye, 
  EyeOff, 
  Search, 
  Database, 
  Image as ImageIcon, 
  X, 
  Save, 
  LogOut, 
  Lock,
  RefreshCw,
  Sparkles,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Category, Brand, Banner, WarrantyStatus } from '../types/database';
import { isSupabaseConfigured } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { 
    language, 
    t, 
    products, 
    categories, 
    brands, 
    banners, 
    settings, 
    getLocalized, 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin,
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
    setCurrentView
  } = useApp();

  // Login form state
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Active tab state
  type AdminTab = 'products' | 'categories' | 'brands' | 'banners' | 'settings' | 'supabase';
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  // Product Search / Filter
  const [productSearch, setProductSearch] = useState('');

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
              {t('admin_login_title')}
            </h1>
            <p className="text-xs text-[#718096]">
              {language === 'bn' 
                ? 'Purchase Hub এর ক্যাটালগ ও সেটিংস ব্যবস্থাপনায় প্রবেশ করুন' 
                : 'Authenticate to manage store catalog, banners and settings'}
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(adminPasswordInput);
            }} 
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1.5">
                {language === 'bn' ? 'অ্যাডমিন সিক্রেট বা পাসওয়ার্ড' : 'Administrator Key / Password'}
              </label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-sm focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
            >
              {t('admin_login_btn')}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#718096] hover:underline"
            >
              {language === 'bn' ? 'হোম পেজে ফিরুন' : 'Back to Storefront'}
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
      p.name_bn?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
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
                {t('admin_title')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#718096] mt-1">
              {t('admin_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 bg-white border border-[#E5D5DA] rounded-xl text-xs font-semibold text-[#1E232A] hover:bg-[#FAF8F7] flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-[#718096]" />
              <span>{language === 'bn' ? 'ওয়েবসাইট দেখুন' : 'Live Storefront'}</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('admin_logout_btn')}</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#718096] text-xs font-medium">
              <span>{t('admin_total_products')}</span>
              <Package className="w-4 h-4 text-[#B76E79]" />
            </div>
            <div className="text-2xl font-bold text-[#1E232A] tabular-nums">
              {totalProductsCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#718096] text-xs font-medium">
              <span>{t('admin_categories_count')}</span>
              <FolderTree className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-[#1E232A] tabular-nums">
              {totalCategoriesCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
              <span>{t('admin_low_stock_count')}</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700 tabular-nums">
              {lowStockCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE2E5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
              <span>{t('admin_out_stock_count')}</span>
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
            { id: 'products', label: t('admin_tab_products'), icon: Package },
            { id: 'categories', label: t('admin_tab_categories'), icon: FolderTree },
            { id: 'brands', label: t('admin_tab_brands'), icon: Tag },
            { id: 'banners', label: t('admin_tab_banners'), icon: ImageIcon },
            { id: 'settings', label: t('admin_tab_settings'), icon: Settings },
            { id: 'supabase', label: t('admin_tab_database'), icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#1E232A] text-white shadow-xs' 
                    : 'bg-white text-[#4A5568] hover:bg-[#FAF5F6] border border-[#EDE2E5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

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
                  placeholder={language === 'bn' ? 'পণ্য নাম বা SKU দিয়ে খুঁজুন...' : 'Search by name or SKU...'}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                />
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin_add_product')}</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#4A5568]">
                <thead className="bg-[#FAF8F7] text-[#718096] uppercase font-semibold border-b border-[#EEDDE1]">
                  <tr>
                    <th className="py-3 px-4">{language === 'bn' ? 'ছবি ও পণ্য' : 'Item & SKU'}</th>
                    <th className="py-3 px-4">{t('filter_category')}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'মূল্য' : 'Price'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'স্টক' : 'Stock'}</th>
                    <th className="py-3 px-4">{t('admin_status')}</th>
                    <th className="py-3 px-4 text-right">{t('admin_actions')}</th>
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
                                {getLocalized(p.name_en, p.name_bn)}
                              </div>
                              <span className="font-mono text-[11px] text-gray-400">
                                {p.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium">
                          {cat ? getLocalized(cat.name_en, cat.name_bn) : '—'}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-[#1E232A]">
                          ৳ {p.sale_price ?? p.price}
                          {p.sale_price && (
                            <span className="text-[10px] text-gray-400 line-through block">৳ {p.price}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          {p.stock_quantity <= 0 ? (
                            <span className="text-rose-600 font-semibold">{t('out_of_stock')} (0)</span>
                          ) : p.stock_quantity <= p.low_stock_threshold ? (
                            <span className="text-amber-600 font-semibold">{p.stock_quantity} ({t('low_stock')})</span>
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
                            <span>{p.is_active ? t('admin_active') : t('admin_inactive')}</span>
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
                  {t('admin_tab_categories')}
                </h2>
                <p className="text-xs text-[#718096]">
                  {language === 'bn' ? 'ক্যাটাগরি তৈরি ও সাজানো' : 'Create and organize database-driven categories'}
                </p>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন ক্যাটাগরি' : 'Add Category'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-[#EDE2E5] bg-[#FAF8F7] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#1E232A]">
                      {c.name_bn} / {c.name_en}
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
                  {t('admin_tab_brands')}
                </h2>
                <p className="text-xs text-[#718096]">
                  {language === 'bn' ? 'পণ্য ব্র্যান্ডসমূহ' : 'Manage cosmetic and perfume brands'}
                </p>
              </div>
              <button
                onClick={() => setIsAddBrandOpen(true)}
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন ব্র্যান্ড' : 'Add Brand'}</span>
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
                  {t('admin_tab_banners')}
                </h2>
                <p className="text-xs text-[#718096]">
                  {language === 'bn' ? 'হোমপেজ ব্যানার স্লাইডার কনফিগারেশন' : 'Manage slides in the hero banner slider'}
                </p>
              </div>
              <button
                onClick={() => setIsAddBannerOpen(true)}
                className="px-4 py-2 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন ব্যানার স্লাইড' : 'Add Banner'}</span>
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
                        {b.title_bn} / {b.title_en}
                      </div>
                      <p className="text-xs text-[#718096] line-clamp-1">{b.subtitle_bn}</p>
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

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-[#EDE2E5] p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
            <div className="pb-4 border-b border-[#F0E4E7]">
              <h2 className="text-lg font-bold text-[#1E232A] font-serif-luxury">
                {t('admin_tab_settings')}
              </h2>
              <p className="text-xs text-[#718096]">
                {language === 'bn' ? 'হোয়াটসঅ্যাপ নম্বর, ফোন নম্বর ও স্টোরের ঠিকানা কনফিগার করুন' : 'Configure WhatsApp hotline, store contact details and delivery charges'}
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
                  Store Address (Bengali)
                </label>
                <input
                  type="text"
                  value={settingsForm.address_bn}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address_bn: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">
                  Store Address (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.address_en}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address_en: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs sm:text-sm text-[#1E232A]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E232A] hover:bg-[#2D3748] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('admin_save')}</span>
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
                {language === 'bn'
                  ? 'এই অ্যাপ্লিকেশনটি সম্পূর্ণ Supabase PostgreSQL ডাটাবেস, Auth, Storage এবং Row Level Security (RLS) সমর্থন করে। নিচে আপনার Supabase SQL এডিটরে রান করার জন্য মাইগ্রেশন ফাইল প্রস্তুত রয়েছে।'
                  : 'This application is fully architected for Supabase PostgreSQL, Auth, Storage, and Row Level Security (RLS). You can inspect and copy the initial migration below.'}
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
                    showToast(language === 'bn' ? 'মাইগ্রেশন লোকেশন কপি করা হয়েছে' : 'Migration path copied', 'success');
                  }}
                  className="px-4 py-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F3E8EB]"
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

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-[#EDE2E5] space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1E232A]">
              {t('admin_delete_confirm')}
            </h3>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-[#E5D5DA] rounded-xl text-xs font-semibold text-[#718096]"
              >
                {t('admin_cancel')}
              </button>
              <button
                onClick={async () => {
                  await deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
              >
                {t('admin_delete')}
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
    images: product?.images || [
      {
        id: 'img-' + Date.now(),
        product_id: product?.id || 'new',
        storage_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
        alt_text_en: '',
        alt_text_bn: '',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  });

  const [imageUrlInput, setImageUrlInput] = useState(
    formData.images?.[0]?.storage_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sale_price && Number(formData.sale_price) >= Number(formData.price)) {
      alert('Sale price must be strictly less than the regular price!');
      return;
    }

    const updatedImages = [
      {
        id: formData.images?.[0]?.id || 'img-' + Date.now(),
        product_id: product?.id || 'new',
        storage_path: imageUrlInput,
        alt_text_en: formData.name_en,
        alt_text_bn: formData.name_bn,
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ];

    onSave({ ...formData, images: updatedImages });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full max-h-[90vh] rounded-3xl overflow-y-auto border border-[#EDE2E5] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F0E4E7] px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-base text-[#1E232A] font-serif-luxury">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600">
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
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name_en} ({c.name_bn})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Brand *</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Bilingual Content */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              2. Bilingual Product Names & Descriptions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Name (Bengali) *</label>
                <input
                  type="text"
                  required
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                  placeholder="যেমন: অরেলিয়া ফেসিয়াল সিরাম"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                  placeholder="e.g. Aurélia Facial Serum"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Description (Bengali) *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description_bn}
                  onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Description (English) *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl"
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

          {/* Section 6: Image Media */}
          <div className="space-y-3 pb-4 border-b border-[#F0E4E7]">
            <h4 className="font-bold text-xs uppercase text-[#B76E79] tracking-wider">
              6. Product Photography / Storage Path
            </h4>
            <div>
              <label className="text-xs font-semibold text-[#718096] uppercase block mb-1">Primary Image Path / URL *</label>
              <input
                type="text"
                required
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono"
              />
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
              className="px-5 py-2.5 border border-[#E5D5DA] rounded-xl text-xs font-semibold text-[#718096]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B76E79] hover:bg-[#A35C67] text-white rounded-xl text-xs font-semibold"
            >
              Save Product
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
  const [nameBn, setNameBn] = useState(category?.name_bn || '');
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
          onSave({ name_en: nameEn, name_bn: nameBn, slug: slug.toLowerCase().replace(/\s+/g, '-') });
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Name (Bengali) *</label>
            <input required value={nameBn} onChange={(e) => setNameBn(e.target.value)} className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Name (English) *</label>
            <input required value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full p-2.5 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
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
  const [titleBn, setTitleBn] = useState(banner?.title_bn || '');
  const [subtitleEn, setSubtitleEn] = useState(banner?.subtitle_en || '');
  const [subtitleBn, setSubtitleBn] = useState(banner?.subtitle_bn || '');
  const [imagePath, setImagePath] = useState(banner?.image_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg');
  const [buttonTextEn, setButtonTextEn] = useState(banner?.button_text_en || 'Shop Now');
  const [buttonTextBn, setButtonTextBn] = useState(banner?.button_text_bn || 'এখনই দেখুন');
  const [destinationUrl, setDestinationUrl] = useState(banner?.destination_url || '#products');
  const [sortOrder, setSortOrder] = useState(banner?.sort_order ?? 1);

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
            title_bn: titleBn,
            subtitle_en: subtitleEn,
            subtitle_bn: subtitleBn,
            image_path: imagePath,
            button_text_en: buttonTextEn,
            button_text_bn: buttonTextBn,
            destination_url: destinationUrl,
            sort_order: sortOrder
          });
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Title (Bengali) *</label>
            <input required value={titleBn} onChange={(e) => setTitleBn(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Title (English) *</label>
            <input required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Subtitle (Bengali) *</label>
            <textarea required rows={2} value={subtitleBn} onChange={(e) => setSubtitleBn(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Subtitle (English) *</label>
            <textarea required rows={2} value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Image Storage Path / URL *</label>
            <input required value={imagePath} onChange={(e) => setImagePath(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Button (Bengali)</label>
              <input value={buttonTextBn} onChange={(e) => setButtonTextBn(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
            </div>
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Button (English)</label>
              <input value={buttonTextEn} onChange={(e) => setButtonTextEn(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl" />
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Destination URL</label>
            <input value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} className="w-full p-2 bg-[#FAF8F7] border border-[#E5D5DA] rounded-xl font-mono" />
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
