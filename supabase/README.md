# PURCHASE HUB — Supabase & Database Architecture Guide

This guide details how to configure Supabase PostgreSQL, Authentication, Storage, Row Level Security (RLS), and Environment Variables for **PURCHASE HUB**.

---

## 1. Environment Configuration

Create a `.env` file at the project root based on `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```

> **Security Note:** Never put `service_role` secrets in browser code or `VITE_` variables. The frontend client only uses `VITE_SUPABASE_ANON_KEY`, which is protected by Row Level Security (RLS).

---

## 2. Database Migration & Schema

Execute the SQL script in your Supabase project's **SQL Editor**:

1. Open `supabase/migrations/20261021_init_schema.sql` and run it. This creates:
   - `profiles` (with role validation)
   - `categories` (with hierarchical parent-child relationships and bilingual names)
   - `brands`
   - `products` (with check constraints: `price >= 0`, `sale_price < price`, `stock_quantity >= 0`, unique `sku` and `slug`)
   - `product_images` (with cascade delete and primary image flags)
   - `banners` (with time-window filtering)
   - `site_settings` (for WhatsApp numbers, phone numbers, addresses, and delivery rates)
   - Search & filtering indexes
   - Row Level Security (RLS) policies for all tables
   - `is_admin()` security definer function

2. Open `supabase/seed.sql` and run it to populate initial high-end bilingual cosmetics, skincare, perfumes, men's grooming sets, hero banners, and store contact settings.

---

## 3. Storage Bucket Setup

1. In the Supabase Dashboard, navigate to **Storage** -> **Create New Bucket**.
2. Name the bucket: `product-media`
3. Toggle **Public Bucket** to **ON** (allows public reading of product images and banner slides).
4. Run the storage policies in the SQL Editor:

```sql
-- Allow anyone to view images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-media');

-- Allow only authenticated administrators to upload product media
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-media' AND public.is_admin());

-- Allow only authenticated administrators to delete product media
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-media' AND public.is_admin());
```

---

## 4. Bootstrapping the Initial Administrator

1. In Supabase Dashboard, navigate to **Authentication** -> **Users** -> **Add User** (Create User with Email & Password).
2. Once the user is created, copy the user's `UID` (UUID).
3. In the SQL Editor, grant the admin role:

```sql
INSERT INTO public.profiles (id, role, full_name)
VALUES ('<PASTE-USER-UID-HERE>', 'admin', 'Store Administrator')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Only users with `role = 'admin'` in `public.profiles` can insert, update, archive, or delete products, categories, banners, and settings.

---

## 5. Security & Row Level Security (RLS) Verification

- **Anonymous Public Visitors**:
  - Can only `SELECT` products where `is_active = true`.
  - Can only `SELECT` categories and brands where `is_active = true`.
  - Can only `SELECT` banners where `is_active = true` and within current timestamp boundaries.
  - Can read public site settings.
  - **Cannot** insert, update, or delete any record.
  - **Cannot** view archived/hidden products or administrative logs.

- **Authenticated Administrators**:
  - Full CRUD access to all tables.
  - Image upload and deletion in the `product-media` storage bucket.

---

## 6. Vercel Deployment Instructions

1. Push the repository to GitHub.
2. In Vercel, import the repository.
3. In **Settings -> Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your-anon-key>`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.
