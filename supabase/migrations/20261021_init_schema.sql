-- ==============================================================================
-- PURCHASE HUB — Bilingual Cosmetics, Skincare & Grooming Catalog
-- Initial PostgreSQL Migration & Row Level Security (RLS) Specification
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Auth Role Management)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories Table (Hierarchical & Bilingual)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Products Table (Strict constraints for prices, stock, and bilingual content)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    usage_instructions_en TEXT,
    usage_instructions_bn TEXT,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price < price)),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    warranty_status VARCHAR(20) NOT NULL DEFAULT 'not_applicable' CHECK (warranty_status IN ('yes', 'no', 'not_applicable')),
    warranty_duration VARCHAR(100),
    warranty_terms_en TEXT,
    warranty_terms_bn TEXT,
    expiry_date DATE,
    batch_number VARCHAR(100),
    net_content VARCHAR(100),
    ingredients_en TEXT,
    ingredients_bn TEXT,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    seo_title_en VARCHAR(255),
    seo_title_bn VARCHAR(255),
    seo_description_en TEXT,
    seo_description_bn TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text_en VARCHAR(255),
    alt_text_bn VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Banners Table (Hero Carousel)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    subtitle_en TEXT NOT NULL,
    subtitle_bn TEXT NOT NULL,
    image_path TEXT NOT NULL,
    button_text_en VARCHAR(100) NOT NULL,
    button_text_bn VARCHAR(100) NOT NULL,
    destination_url VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Site Settings Table (Key-Value Store)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON public.products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON public.products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view and manage all profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- 2. Categories RLS (Public read active, Admin write)
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full access to categories" ON public.categories
    FOR ALL USING (public.is_admin());

-- 3. Brands RLS (Public read active, Admin write)
CREATE POLICY "Public can view active brands" ON public.brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full access to brands" ON public.brands
    FOR ALL USING (public.is_admin());

-- 4. Products RLS (Public read active, Admin write)
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full access to products" ON public.products
    FOR ALL USING (public.is_admin());

-- 5. Product Images RLS (Public read for active products, Admin write)
CREATE POLICY "Public can view images of active products" ON public.product_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_id AND p.is_active = true
        )
    );

CREATE POLICY "Admins have full access to product images" ON public.product_images
    FOR ALL USING (public.is_admin());

-- 6. Banners RLS (Public read active and within time window, Admin write)
CREATE POLICY "Public can view active banners" ON public.banners
    FOR SELECT USING (
        is_active = true AND
        (starts_at IS NULL OR starts_at <= NOW()) AND
        (ends_at IS NULL OR ends_at >= NOW())
    );

CREATE POLICY "Admins have full access to banners" ON public.banners
    FOR ALL USING (public.is_admin());

-- 7. Site Settings RLS (Public read, Admin write)
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to site settings" ON public.site_settings
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- STORAGE CONFIGURATION (Buckets & Policies)
-- ==============================================================================
-- In Supabase dashboard or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true);

-- Storage Policies:
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-media');
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-media' AND public.is_admin());
-- CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-media' AND public.is_admin());
