import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  Product, 
  Category, 
  Brand, 
  Banner, 
  StoreSettings,
  Order,
  OrderItem,
  OrderStatus,
  AdminUser
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
  | 'electric-gadgets'
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
  
  // Place Order & Cart System
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => Promise<boolean>;
  approveOrder: (orderId: string) => Promise<boolean>;
  rejectOrder: (orderId: string, reason?: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  filterOrdersByPhoneOrEmail: (query: string) => Order[];
  
  // Place Order Modal
  isPlaceOrderOpen: boolean;
  setIsPlaceOrderOpen: (open: boolean) => void;
  checkoutItems: OrderItem[];
  openPlaceOrder: (items?: OrderItem[]) => void;
  closePlaceOrder: () => void;

  // Order Tracking Modal
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackingQuery: string;
  setTrackingQuery: (query: string) => void;

  // Shopping Bag / Cart
  cart: OrderItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Admin Operations & Multi-Admin System
  isAdminLoggedIn: boolean;
  currentAdminUser: AdminUser | null;
  adminUsers: AdminUser[];
  loginAdmin: (identifier: string, password?: string) => boolean;
  logoutAdmin: () => void;
  addAdminUser: (adminData: Omit<AdminUser, 'id' | 'created_at'>) => Promise<boolean>;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => Promise<boolean>;
  deleteAdminUser: (id: string) => Promise<boolean>;
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
  // 1. Language State (English-Only Mode as requested)
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (_lang: Language) => {
    // English is enforced
    setLanguageState('en');
    localStorage.setItem('purchase_hub_lang', 'en');
    document.documentElement.lang = 'en';
  };

  useEffect(() => {
    localStorage.setItem('purchase_hub_lang', 'en');
    document.documentElement.lang = 'en';
  }, []);

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
        // Migrate any previous phone numbers to the official requested 01705776631
        if (
          !parsed.phone_number ||
          parsed.phone_number.includes('01576') || 
          parsed.phone_number.includes('01811') ||
          parsed.phone_number.includes('01711') ||
          parsed.whatsapp_number?.includes('01576')
        ) {
          return { 
            ...parsed, 
            ...INITIAL_SETTINGS,
            phone_number: '01705776631',
            whatsapp_number: '01705776631'
          };
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

  // 5. Admin Authentication & Multi-Admin State
  const BASE_ADMIN: AdminUser = {
    id: 'admin-shawon',
    name: 'Shawon (Super Admin)',
    email: 'shawon_admin@purchase-hub.com',
    password: 'Purch@seHub02122023',
    role: 'super_admin',
    is_active: true,
    created_at: '2023-12-02T00:00:00.000Z'
  };

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('purchase_hub_admin_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasShawon = parsed.some(u => u.email.toLowerCase() === 'shawon_admin@purchase-hub.com');
          if (!hasShawon) {
            return [BASE_ADMIN, ...parsed];
          }
          return parsed.map(u => {
            if (u.email.toLowerCase() === 'shawon_admin@purchase-hub.com') {
              return { 
                ...u, 
                password: 'Purch@seHub02122023', 
                role: 'super_admin', 
                is_active: true,
                name: u.name || 'Shawon (Super Admin)'
              };
            }
            return u;
          });
        }
      } catch (e) { /* fallback */ }
    }
    return [BASE_ADMIN];
  });

  useEffect(() => {
    localStorage.setItem('purchase_hub_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('purchase_hub_current_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('purchase_hub_admin_logged_in') === 'true';
  });

  const loginAdmin = (identifier: string, password?: string): boolean => {
    const inputId = password !== undefined ? identifier.trim().toLowerCase() : '';
    const inputPass = password !== undefined ? password : identifier;

    // Check base admin account
    if (
      (inputId === 'shawon_admin@purchase-hub.com' || !inputId) && 
      inputPass === 'Purch@seHub02122023'
    ) {
      setIsAdminLoggedIn(true);
      setCurrentAdminUser(BASE_ADMIN);
      localStorage.setItem('purchase_hub_admin_logged_in', 'true');
      localStorage.setItem('purchase_hub_current_admin', JSON.stringify(BASE_ADMIN));
      showToast('Successfully logged in as Shawon (Super Admin)', 'success');
      return true;
    }

    // Check any active admin in adminUsers
    const matched = adminUsers.find(u => {
      const emailMatches = !inputId || u.email.toLowerCase() === inputId;
      return emailMatches && u.password === inputPass && u.is_active;
    });

    if (matched) {
      setIsAdminLoggedIn(true);
      setCurrentAdminUser(matched);
      localStorage.setItem('purchase_hub_admin_logged_in', 'true');
      localStorage.setItem('purchase_hub_current_admin', JSON.stringify(matched));
      showToast(`Successfully logged in as ${matched.name}`, 'success');
      return true;
    }

    showToast('Invalid User ID or Password! Please verify credentials.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
    localStorage.removeItem('purchase_hub_admin_logged_in');
    localStorage.removeItem('purchase_hub_current_admin');
    showToast('Logged out of admin panel', 'info');
  };

  const addAdminUser = async (adminData: Omit<AdminUser, 'id' | 'created_at'>): Promise<boolean> => {
    const exists = adminUsers.some(u => u.email.toLowerCase() === adminData.email.trim().toLowerCase());
    if (exists) {
      showToast('An admin with this User ID / Email already exists!', 'error');
      return false;
    }
    const newAdmin: AdminUser = {
      ...adminData,
      id: 'admin-' + Date.now(),
      email: adminData.email.trim().toLowerCase(),
      created_at: new Date().toISOString()
    };
    setAdminUsers(prev => [...prev, newAdmin]);
    showToast(`Admin user "${newAdmin.name}" added successfully!`, 'success');
    return true;
  };

  const updateAdminUser = async (id: string, updates: Partial<AdminUser>): Promise<boolean> => {
    setAdminUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          ...updates,
          email: updates.email ? updates.email.trim().toLowerCase() : u.email
        };
      }
      return u;
    }));
    showToast('Admin account details updated', 'success');
    return true;
  };

  const deleteAdminUser = async (id: string): Promise<boolean> => {
    const target = adminUsers.find(u => u.id === id);
    if (target?.email.toLowerCase() === 'shawon_admin@purchase-hub.com') {
      showToast('The base admin account (shawon_admin@purchase-hub.com) cannot be deleted!', 'error');
      return false;
    }
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    showToast('Admin account removed', 'info');
    return true;
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

  // 7. Orders State & Persistence (with Initial Demo Orders)
  const INITIAL_ORDERS: Order[] = [
    {
      id: 'PH-10291',
      customerName: 'Sadia Islam',
      customerPhone: '01705776631',
      customerEmail: 'purchasehub16@gmail.com',
      customerAddress: 'Nilachal, 408/2, North Kazipara, Mirpur, Dhaka-1216',
      deliveryZone: 'inside_dhaka',
      deliveryCharge: 60,
      items: [
        {
          productId: 'p-1',
          sku: 'SKU-LUM-01',
          name_en: 'Luminous Glow Hydrating Serum',
          name_bn: 'লুমিনাস গ্লো হাইড্রেটিং সিরাম',
          price: 2450,
          quantity: 1,
          image: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg'
        }
      ],
      subtotal: 2450,
      total: 2510,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'confirmed',
      note: 'Please call before delivery',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    {
      id: 'PH-10292',
      customerName: 'তানভীর আহমেদ',
      customerPhone: '01712345678',
      customerEmail: 'tanvir@gmail.com',
      customerAddress: 'House 12, Road 4, Sector 7, Uttara, Dhaka',
      deliveryZone: 'inside_dhaka',
      deliveryCharge: 60,
      items: [
        {
          productId: 'p-4',
          sku: 'SKU-OUD-04',
          name_en: 'Velvet Oud Eau De Parfum 100ml',
          name_bn: 'ভেলভেট উদ পারফিউম ১০০ মিলি',
          price: 4950,
          quantity: 1,
          image: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg'
        }
      ],
      subtotal: 4950,
      total: 5010,
      paymentMethod: 'bkash',
      paymentStatus: 'paid',
      status: 'shipped',
      note: 'Urgent delivery requested',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ];

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('purchase_hub_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('purchase_hub_orders', JSON.stringify(orders));
  }, [orders]);

  // 8. Shopping Bag / Cart State
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('purchase_hub_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('purchase_hub_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    const primaryImg = product.images?.find(i => i.is_primary) || product.images?.[0];
    const itemPrice = product.sale_price !== null && product.sale_price !== undefined 
      ? product.sale_price 
      : product.price;

    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => 
          i.productId === product.id 
            ? { ...i, quantity: Math.min(product.stock_quantity, i.quantity + quantity) } 
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          sku: product.sku,
          name_en: product.name_en,
          name_bn: product.name_bn,
          image: primaryImg?.storage_path || '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
          price: itemPrice,
          quantity: Math.min(product.stock_quantity, quantity)
        }
      ];
    });

    showToast(
      language === 'bn' 
        ? `${product.name_bn || product.name_en} ব্যাগে যুক্ত করা হয়েছে` 
        : `Added ${product.name_en} to bag`, 
      'success'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
    showToast(language === 'bn' ? 'ব্যাগ থেকে সরানো হয়েছে' : 'Removed from bag', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    const maxStock = product ? product.stock_quantity : 99;
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: Math.min(maxStock, quantity) } : i));
  };

  const clearCart = () => {
    setCart([]);
  };

  // 9. Place Order Modal State
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);

  const openPlaceOrder = (items?: OrderItem[]) => {
    if (items && items.length > 0) {
      setCheckoutItems(items);
    } else if (cart.length > 0) {
      setCheckoutItems(cart);
    } else {
      showToast(language === 'bn' ? 'অর্ডার করার জন্য কোনো পণ্য নির্বাচন করা হয়নি' : 'No items selected for order', 'error');
      return;
    }
    setIsPlaceOrderOpen(true);
  };

  const closePlaceOrder = () => {
    setIsPlaceOrderOpen(false);
  };

  // 10. Order Tracking Modal State
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');

  // 11. Order Actions & Mobile/Email Filter
  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `PH-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update stock quantity for ordered products
    newOrder.items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          const newStock = Math.max(0, p.stock_quantity - item.quantity);
          return { ...p, stock_quantity: newStock };
        }
        return p;
      }));
    });

    setOrders(prev => [newOrder, ...prev]);

    // Optional Supabase insertion
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert([newOrder]);
      } catch (e) {
        /* local state maintained */
      }
    }

    showToast(
      language === 'bn' 
        ? `অর্ডার #${orderId} সফলভাবে গৃহীত হয়েছে!` 
        : `Order #${orderId} placed successfully!`, 
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, reason?: string): Promise<boolean> => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Automatically convert paymentStatus to 'paid' when shipped or delivered as requested
        const paymentStatus = (status === 'shipped' || status === 'delivered') ? 'paid' : o.paymentStatus;
        return {
          ...o,
          status,
          paymentStatus,
          rejectionReason: reason || (status === 'cancelled' || status === 'rejected' ? o.rejectionReason : undefined),
          approved_at: (status === 'confirmed' || status === 'processing' || status === 'shipped' || status === 'delivered') ? (o.approved_at || new Date().toISOString()) : o.approved_at,
          updated_at: new Date().toISOString()
        };
      }
      return o;
    }));
    showToast(
      `Order #${orderId} status updated to ${status}${status === 'shipped' || status === 'delivered' ? ' (Payment status converted to Paid)' : ''}`, 
      'success'
    );
    return true;
  };

  const approveOrder = async (orderId: string): Promise<boolean> => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'confirmed',
          rejectionReason: undefined,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return o;
    }));
    showToast(`Order #${orderId} approved and confirmed successfully!`, 'success');
    return true;
  };

  const rejectOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled',
          rejectionReason: reason || 'Rejected by administrator',
          updated_at: new Date().toISOString()
        };
      }
      return o;
    }));
    showToast(`Order #${orderId} marked as not approved / rejected`, 'info');
    return true;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} deleted successfully`, 'info');
    return true;
  };

  // Helper to normalize Bengali digits to English digits
  const toEnDigits = (str: string): string => {
    const bnNums = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return str.replace(/[০-৯]/g, d => String(bnNums.indexOf(d)));
  };

  // Filtering by Customer Mobile Number, Email, Order ID, or Name
  const filterOrdersByPhoneOrEmail = (query: string): Order[] => {
    if (!query || !query.trim()) return [];
    const normalizedQ = toEnDigits(query.trim().toLowerCase());
    const digitsOnlyQ = normalizedQ.replace(/[^0-9]/g, '');
    const cleanAlphaNumQ = normalizedQ.replace(/[^a-z0-9]/gi, '');
    const cleanQ = normalizedQ.replace(/[\s-]/g, '');

    return orders.filter(o => {
      // 1. Order ID match (e.g. PH-10291, 10291, #10291)
      const cleanId = (o.id || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
      const idMatch = cleanAlphaNumQ.length >= 2 && (cleanId.includes(cleanAlphaNumQ) || cleanAlphaNumQ.includes(cleanId));

      // 2. Phone match (supports 017..., +88017..., partial 4-11 digits)
      const orderPhoneNormalized = toEnDigits((o.customerPhone || '').toLowerCase());
      const orderPhoneDigits = orderPhoneNormalized.replace(/[^0-9]/g, '');
      let phoneMatch = false;
      if (digitsOnlyQ.length >= 3) {
        phoneMatch = 
          orderPhoneDigits.includes(digitsOnlyQ) || 
          digitsOnlyQ.includes(orderPhoneDigits) ||
          (orderPhoneDigits.startsWith('880') && orderPhoneDigits.slice(3).includes(digitsOnlyQ)) ||
          (orderPhoneDigits.startsWith('0') && orderPhoneDigits.slice(1).includes(digitsOnlyQ));
      }

      // 3. Email match
      const cleanEmail = (o.customerEmail || '').trim().toLowerCase();
      const emailMatch = cleanEmail.length >= 3 && (cleanEmail.includes(cleanQ) || cleanQ.includes(cleanEmail));

      // 4. Customer Name match
      const cleanName = (o.customerName || '').trim().toLowerCase();
      const nameMatch = cleanName.length >= 3 && cleanName.includes(normalizedQ);

      return idMatch || phoneMatch || emailMatch || nameMatch;
    });
  };

  // 12. English-First Localization Helper
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations.en;
    let text: string = dict[key] || translations.bn[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  const getLocalized = (enVal?: string | null, bnVal?: string | null): string => {
    return (enVal && enVal.trim()) ? enVal : (bnVal || '');
  };

  // 8. WhatsApp & Call Order Generators
  const getWhatsAppOrderUrl = (product: Product, quantity = 1): string => {
    const rawNumber = settings.whatsapp_number || '01705776631';
    let cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.startsWith('01')) {
      cleanNumber = '88' + cleanNumber;
    }

    const productName = getLocalized(product.name_en, product.name_bn);
    const activePrice = product.sale_price !== null && product.sale_price !== undefined 
      ? product.sale_price 
      : product.price;

    const pageUrl = window.location.origin + `/#product/${product.id}`;
    const rawTemplate = translations.en.whatsapp_msg_template;

    const message = rawTemplate
      .replace('{product_name}', productName)
      .replace('{sku}', product.sku)
      .replace('{price}', activePrice.toLocaleString('en-US'))
      .replace('{quantity}', quantity.toString())
      .replace('{url}', pageUrl);

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const getCallOrderUrl = (): string => {
    const raw = settings.phone_number || '01705776631';
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
        orders,
        createOrder,
        updateOrderStatus,
        approveOrder,
        rejectOrder,
        deleteOrder,
        filterOrdersByPhoneOrEmail,
        isPlaceOrderOpen,
        setIsPlaceOrderOpen,
        checkoutItems,
        openPlaceOrder,
        closePlaceOrder,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingQuery,
        setTrackingQuery,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
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
