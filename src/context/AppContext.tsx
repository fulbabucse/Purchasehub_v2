import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  Product, 
  Category, 
  Brand, 
  Banner, 
  StoreSettings 
} from '../types/database';
import { translations, TranslationKey } from '../locales/translations';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_BANNERS, 
  INITIAL_SETTINGS,
  isSupabaseConfigured,
  supabase
} from '../lib/supabase';

export type PageView = 
  | 'home'
  | 'all-products'
  | 'mens-collection'
  | 'womens-collection'
  | 'beauty-skincare'
  | 'makeup'
  | 'perfume-fragrance'
  | 'hair-care'
  | 'personal-care-grooming'
  | 'lifestyle-accessories'
  | 'product-details'
  | 'about-us'
  | 'contact-us'
  | 'privacy-policy'
  | 'return-policy'
  | 'delivery-info'
  | 'not-found'
  | 'admin';

export type SortOption = 'featured' | 'newest' | 'price_low_high' | 'price_high_low' | 'best_sellers';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  getLocalized: (enVal?: string | null, bnVal?: string | null) => string;
  
  // Navigation
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  selectedProductId: string | null;
  navigateToProduct: (productId: string) => void;
  
  // Data
  products: Product[];
  categories: Category[];
  brands: Brand[];
  banners: Banner[];
  settings: StoreSettings;
  isLoading: boolean;
  
  // Filtering & Sorting
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedBrandId: string | null;
  setSelectedBrandId: (brandId: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  clearFilters: () => void;
  
  // Ordering Affordances
  getWhatsAppOrderUrl: (product: Product, quantity?: number) => string;
  getCallOrderUrl: () => string;
  
  // Admin Operations
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Partial<Product>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductActive: (id: string) => Promise<boolean>;
  addCategory: (category: Partial<Category>) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  addBrand: (brand: Partial<Brand>) => Promise<boolean>;
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<boolean>;
  addBanner: (banner: Partial<Banner>) => Promise<boolean>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language State (Default: Bengali)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('purchase_hub_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('purchase_hub_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 2. Navigation State
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Store Data State with persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('purchase_hub_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('purchase_hub_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CATEGORIES;
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('purchase_hub_brands');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BRANDS;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('purchase_hub_banners');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BANNERS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('purchase_hub_settings');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // If saved settings still contain the old dummy phone, Banani address, or old email, update with new details
        if (
          parsed.phone_number === '+8801811000000' || 
          parsed.phone_number === '01711000000' || 
          parsed.address_en?.includes('Banani') ||
          parsed.email?.includes('purchasehub.com.bd')
        ) {
          return { ...parsed, ...INITIAL_SETTINGS, email: 'purchasehub16@gmail.com' };
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('purchase_hub_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('purchase_hub_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('purchase_hub_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('purchase_hub_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('purchase_hub_settings', JSON.stringify(settings));
  }, [settings]);

  // Load from Supabase if configured
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const loadSupabaseData = async () => {
      setIsLoading(true);
      try {
        const { data: dbProducts } = await client
          .from('products')
          .select('*, product_images(*)')
          .eq('is_active', true);
        
        if (dbProducts && dbProducts.length > 0) {
          const formatted = dbProducts.map((p: any) => ({
            ...p,
            images: p.product_images || []
          }));
          setProducts(formatted);
        }

        const { data: dbCategories } = await client
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);

        const { data: dbBrands } = await client
          .from('brands')
          .select('*')
          .eq('is_active', true);
        if (dbBrands && dbBrands.length > 0) setBrands(dbBrands);

        const { data: dbBanners } = await client
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (dbBanners && dbBanners.length > 0) setBanners(dbBanners);

      } catch (err) {
        console.warn('Supabase fetch error, maintaining local state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupabaseData();
  }, []);

  // 4. Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('featured');

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategorySlug(null);
    setSelectedBrandId(null);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setSortOption('featured');
  };

  // 5. Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('purchase_hub_admin_logged_in') === 'true';
  });

  const loginAdmin = (password: string): boolean => {
    // Protected admin authentication
    if (password === 'Purch@#$_&-+()/0') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('purchase_hub_admin_logged_in', 'true');
      showToast(language === 'bn' ? 'অ্যাডমিন হিসেবে লগইন সম্পন্ন হয়েছে' : 'Successfully logged in as administrator', 'success');
      return true;
    }
    showToast(language === 'bn' ? 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন' : 'Invalid admin password. Try again.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('purchase_hub_admin_logged_in');
    showToast(language === 'bn' ? 'লগআউট সম্পন্ন হয়েছে' : 'Logged out successfully', 'info');
  };

  // 6. Toasts State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 7. Localization Helper
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.bn;
    let text: string = dict[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  const getLocalized = (enVal?: string | null, bnVal?: string | null): string => {
    if (language === 'bn') {
      return (bnVal && bnVal.trim()) ? bnVal : (enVal || '');
    }
    return (enVal && enVal.trim()) ? enVal : (bnVal || '');
  };

  // 8. WhatsApp & Call Order Generators
  const getWhatsAppOrderUrl = (product: Product, quantity = 1): string => {
    // Normalize phone number (strip whitespace, hyphens, and leading + for wa.me)
    const rawNumber = settings.whatsapp_number || '+8801576924003';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    const productName = getLocalized(product.name_en, product.name_bn);
    const activePrice = product.sale_price !== null && product.sale_price !== undefined 
      ? product.sale_price 
      : product.price;

    const pageUrl = window.location.origin + `/#product/${product.id}`;

    const rawTemplate = language === 'bn' 
      ? translations.bn.whatsapp_msg_template 
      : translations.en.whatsapp_msg_template;

    const message = rawTemplate
      .replace('{product_name}', productName)
      .replace('{sku}', product.sku)
      .replace('{price}', activePrice.toLocaleString('en-US'))
      .replace('{quantity}', quantity.toString())
      .replace('{url}', pageUrl);

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const getCallOrderUrl = (): string => {
    const raw = settings.phone_number || '01576-924003';
    return `tel:${raw.replace(/[\s-]+/g, '')}`;
  };

  // 9. Admin CRUD Operations
  const addProduct = async (productData: Partial<Product>): Promise<boolean> => {
    const newId = 'p-' + Date.now();
    const newProduct: Product = {
      id: newId,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-5)}`,
      slug: productData.slug || `product-${Date.now()}`,
      name_en: productData.name_en || 'New Product',
      name_bn: productData.name_bn || 'নতুন পণ্য',
      description_en: productData.description_en || '',
      description_bn: productData.description_bn || '',
      usage_instructions_en: productData.usage_instructions_en,
      usage_instructions_bn: productData.usage_instructions_bn,
      brand_id: productData.brand_id || brands[0]?.id || '',
      category_id: productData.category_id || categories[0]?.id || '',
      price: Number(productData.price) || 0,
      sale_price: productData.sale_price ? Number(productData.sale_price) : null,
      stock_quantity: Number(productData.stock_quantity) || 0,
      low_stock_threshold: Number(productData.low_stock_threshold) || 5,
      warranty_status: productData.warranty_status || 'not_applicable',
      warranty_duration: productData.warranty_duration,
      warranty_terms_en: productData.warranty_terms_en,
      warranty_terms_bn: productData.warranty_terms_bn,
      expiry_date: productData.expiry_date || null,
      batch_number: productData.batch_number || null,
      net_content: productData.net_content || '',
      ingredients_en: productData.ingredients_en,
      ingredients_bn: productData.ingredients_bn,
      specifications: productData.specifications || {},
      is_active: productData.is_active ?? true,
      is_featured: productData.is_featured ?? false,
      is_new_arrival: productData.is_new_arrival ?? true,
      is_best_seller: productData.is_best_seller ?? false,
      seo_title_en: productData.seo_title_en,
      seo_title_bn: productData.seo_title_bn,
      seo_description_en: productData.seo_description_en,
      seo_description_bn: productData.seo_description_bn,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: productData.images || []
    };

    setProducts(prev => [newProduct, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').insert([newProduct]);
      } catch (err) {
        console.error('Supabase product insert error:', err);
      }
    }

    showToast(language === 'bn' ? 'পণ্য সফলভাবে যুক্ত হয়েছে' : 'Product successfully added', 'success');
    return true;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates, updated_at: new Date().toISOString() };
      }
      return p;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update(updates).eq('id', id);
      } catch (err) {
        console.error('Supabase product update error:', err);
      }
    }

    showToast(language === 'bn' ? 'পণ্য হালনাগাদ করা হয়েছে' : 'Product updated successfully', 'success');
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase product delete error:', err);
      }
    }

    showToast(language === 'bn' ? 'পণ্য মুছে ফেলা হয়েছে' : 'Product deleted successfully', 'info');
    return true;
  };

  const toggleProductActive = async (id: string): Promise<boolean> => {
    const item = products.find(p => p.id === id);
    if (!item) return false;
    const nextState = !item.is_active;
    return updateProduct(id, { is_active: nextState });
  };

  const addCategory = async (catData: Partial<Category>): Promise<boolean> => {
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name_en: catData.name_en || 'New Category',
      name_bn: catData.name_bn || 'নতুন ক্যাটাগরি',
      slug: catData.slug || `category-${Date.now()}`,
      parent_id: catData.parent_id || null,
      image_url: catData.image_url || null,
      is_active: catData.is_active ?? true,
      sort_order: catData.sort_order ?? categories.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCat]);
    showToast(language === 'bn' ? 'ক্যাটাগরি যুক্ত করা হয়েছে' : 'Category added successfully', 'success');
    return true;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
    showToast(language === 'bn' ? 'ক্যাটাগরি সংরক্ষিত হয়েছে' : 'Category updated', 'success');
    return true;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(language === 'bn' ? 'ক্যাটাগরি মুছে ফেলা হয়েছে' : 'Category deleted', 'info');
    return true;
  };

  const addBrand = async (brandData: Partial<Brand>): Promise<boolean> => {
    const newBrand: Brand = {
      id: 'b-' + Date.now(),
      name: brandData.name || 'New Brand',
      slug: brandData.slug || `brand-${Date.now()}`,
      logo_url: brandData.logo_url || null,
      is_active: brandData.is_active ?? true
    };
    setBrands(prev => [...prev, newBrand]);
    showToast(language === 'bn' ? 'ব্র্যান্ড যুক্ত হয়েছে' : 'Brand added successfully', 'success');
    return true;
  };

  const updateBrand = async (id: string, updates: Partial<Brand>): Promise<boolean> => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast(language === 'bn' ? 'ব্র্যান্ড সংরক্ষিত হয়েছে' : 'Brand updated', 'success');
    return true;
  };

  const deleteBrand = async (id: string): Promise<boolean> => {
    setBrands(prev => prev.filter(b => b.id !== id));
    showToast(language === 'bn' ? 'ব্র্যান্ড মুছে ফেলা হয়েছে' : 'Brand deleted', 'info');
    return true;
  };

  const addBanner = async (bannerData: Partial<Banner>): Promise<boolean> => {
    const newBanner: Banner = {
      id: 'ban-' + Date.now(),
      title_en: bannerData.title_en || 'New Banner Title',
      title_bn: bannerData.title_bn || 'নতুন ব্যানার শিরোনাম',
      subtitle_en: bannerData.subtitle_en || '',
      subtitle_bn: bannerData.subtitle_bn || '',
      image_path: bannerData.image_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
      button_text_en: bannerData.button_text_en || 'Shop Now',
      button_text_bn: bannerData.button_text_bn || 'এখনই দেখুন',
      destination_url: bannerData.destination_url || '#products',
      sort_order: bannerData.sort_order ?? banners.length + 1,
      is_active: bannerData.is_active ?? true
    };
    setBanners(prev => [...prev, newBanner]);
    showToast(language === 'bn' ? 'ব্যানার যুক্ত হয়েছে' : 'Banner added successfully', 'success');
    return true;
  };

  const updateBanner = async (id: string, updates: Partial<Banner>): Promise<boolean> => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast(language === 'bn' ? 'ব্যানার সংরক্ষিত হয়েছে' : 'Banner updated', 'success');
    return true;
  };

  const deleteBanner = async (id: string): Promise<boolean> => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast(language === 'bn' ? 'ব্যানার মুছে ফেলা হয়েছে' : 'Banner deleted', 'info');
    return true;
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast(language === 'bn' ? 'দোকানের সেটিংস সংরক্ষিত হয়েছে' : 'Store settings updated successfully', 'success');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getLocalized,
        currentView,
        setCurrentView,
        selectedProductId,
        navigateToProduct,
        products,
        categories,
        brands,
        banners,
        settings,
        isLoading,
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
        clearFilters,
        getWhatsAppOrderUrl,
        getCallOrderUrl,
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
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
