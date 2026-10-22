# PURCHASE HUB — Deployment Guide

This guide explains how to deploy **Purchase Hub** to **Vercel**, **Netlify**, or **Cloudflare Pages**, and connect it with your Supabase backend.

---

## 1. Deploying to Vercel (Recommended)

### Method A: Via Git / GitHub (Simplest)
1. Push your project code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New…** > **Project**.
4. Import your **Purchase Hub** repository.
5. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Expand **Environment Variables** and add your Supabase credentials:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-public-key`
   - *(Optional)* `VITE_DEFAULT_WHATSAPP`: `+8801711000000`
   - *(Optional)* `VITE_DEFAULT_PHONE`: `+8801811000000`
7. Click **Deploy**.
8. Your site will be live within ~1 minute with an automatic HTTPS URL (e.g., `https://purchase-hub.vercel.app`).

> **Note on Routing:** A `vercel.json` file is already included in the root directory to handle SPA rewrites (`/(.*) -> /index.html`), preventing 404 errors when refreshing inner pages.

---

### Method B: Via Vercel CLI
If you prefer deploying directly from your terminal:
```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy preview
vercel

# 4. Deploy to production
vercel --prod
```

---

## 2. Deploying to Netlify

1. Push your repository to GitHub.
2. Sign in to [netlify.com](https://netlify.com) and click **Add new site** > **Import an existing project**.
3. Select your repository.
4. Netlify will read the included `netlify.toml` automatically:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Under **Environment variables**, click **Add a variable**:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-public-key`
6. Click **Deploy Purchase Hub**.

---

## 3. Deploying to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository.
3. In **Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. In **Environment variables**:
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Click **Save and Deploy**.

---

## 4. Connecting Your Backend (Supabase Setup)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20261021_init_schema.sql` from this codebase, paste it in, and click **Run**.
4. Open `supabase/seed.sql`, paste it in, and click **Run** to load initial products, brands, and banners.
5. In **Storage**, verify that a public bucket named `product-media` is created.
6. In **Project Settings** > **API**, copy:
   - **Project URL** $\to$ `VITE_SUPABASE_URL`
   - **Project API Anon Key** $\to$ `VITE_SUPABASE_ANON_KEY`
7. Add these keys to your hosting platform's Environment Variables settings.

---

## 5. Custom Domain Configuration (e.g., purchasehub.com.bd)

1. In Vercel, navigate to **Project Settings** > **Domains**.
2. Enter your custom domain (e.g., `purchasehub.com.bd` or `www.purchasehub.com.bd`).
3. Set up the DNS records at your domain registrar:
   - **A Record**: `76.76.21.21`
   - **CNAME Record**: `cname.vercel-dns.com`
4. Vercel automatically generates an SSL/TLS certificate.
