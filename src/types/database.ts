export type Language = 'en' | 'bn';

export type WarrantyStatus = 'yes' | 'no' | 'not_applicable';

export interface Profile {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string; // used as User ID / Email for login
  password: string; // admin credential
  role: 'super_admin' | 'admin' | 'manager';
  is_active: boolean;
  created_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';
export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface OrderItem {
  productId: string;
  sku: string;
  name_en: string;
  name_bn: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // e.g. PH-10924
  customerName: string;
  customerPhone: string; // for filtering
  customerEmail: string; // for filtering
  customerAddress: string;
  deliveryZone: DeliveryZone;
  deliveryCharge: number;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  note?: string;
  rejectionReason?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  parent_id?: string | null;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text_en?: string;
  alt_text_bn?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  usage_instructions_en?: string;
  usage_instructions_bn?: string;
  brand_id: string;
  category_id: string;
  price: number;
  sale_price?: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  warranty_status: WarrantyStatus;
  warranty_duration?: string;
  warranty_terms_en?: string;
  warranty_terms_bn?: string;
  expiry_date?: string | null;
  batch_number?: string | null;
  net_content?: string;
  ingredients_en?: string;
  ingredients_bn?: string;
  specifications?: Record<string, string>;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  seo_title_en?: string;
  seo_title_bn?: string;
  seo_description_en?: string;
  seo_description_bn?: string;
  created_at: string;
  updated_at: string;
  
  // Joined or resolved fields
  images?: ProductImage[];
  brand?: Brand;
  category?: Category;
}

export interface Banner {
  id: string;
  title_en: string;
  title_bn: string;
  subtitle_en: string;
  subtitle_bn: string;
  image_path: string;
  button_text_en: string;
  button_text_bn: string;
  destination_url: string;
  sort_order: number;
  is_active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

export interface StoreSettings {
  shop_name: string;
  tagline_en: string;
  tagline_bn: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address_en: string;
  address_bn: string;
  opening_hours_en: string;
  opening_hours_bn: string;
  low_stock_threshold: number;
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
}
