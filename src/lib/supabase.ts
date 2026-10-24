import { createClient } from '@supabase/supabase-js';
import { Product, Category, Brand, Banner, StoreSettings } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial mock & fallback seed data so the catalog runs interactively and reliably
export const INITIAL_BRANDS: Brand[] = [
  { id: 'b1111111-1111-1111-1111-111111111111', name: "L'Amour Paris", slug: 'lamour-paris', is_active: true },
  { id: 'b2222222-2222-2222-2222-222222222222', name: 'Aurélia Botanicals', slug: 'aurelia-botanicals', is_active: true },
  { id: 'b3333333-3333-3333-3333-333333333333', name: 'Blackwood Grooming Co.', slug: 'blackwood-grooming', is_active: true },
  { id: 'b4444444-4444-4444-4444-444444444444', name: 'Velvet Radiance', slug: 'velvet-radiance', is_active: true },
  { id: 'b5555555-5555-5555-5555-555555555555', name: 'Silk & Jade Lifestyle', slug: 'silk-jade-lifestyle', is_active: true },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name_en: 'Beauty & Skincare',
    name_bn: 'স্কিনকেয়ার ও রূপচর্চা',
    slug: 'beauty-skincare',
    image_url: '/src/assets/images/product_hydrating_serum_1792601571425.jpg',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name_en: 'Perfume & Fragrance',
    name_bn: 'পারফিউম ও সুগন্ধি',
    slug: 'perfume-fragrance',
    image_url: '/src/assets/images/product_luxury_perfume_1792601572027.jpg',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name_en: "Men's Collection",
    name_bn: 'পুরুষদের কালেকশন',
    slug: 'mens-collection',
    image_url: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name_en: 'Makeup & Cosmetics',
    name_bn: 'মেকআপ ও কসমেটিক্স',
    slug: 'makeup',
    image_url: '/src/assets/images/product_velvet_lipstick_1792601573045.jpg',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name_en: "Women's Collection",
    name_bn: 'নারীদের কালেকশন',
    slug: 'womens-collection',
    image_url: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    name_en: 'Hair Care',
    name_bn: 'হেয়ার কেয়ার ও যত্ন',
    slug: 'hair-care',
    image_url: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c7777777-7777-7777-7777-777777777777',
    name_en: 'Personal Care & Grooming',
    name_bn: 'পার্সোনাল কেয়ার ও গ্রুমিং',
    slug: 'personal-care-grooming',
    image_url: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
    is_active: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c8888888-8888-8888-8888-888888888888',
    name_en: 'Lifestyle & Accessories',
    name_bn: 'Lifestyle & Accessories',
    slug: 'lifestyle-accessories',
    image_url: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
    is_active: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c9999999-9999-9999-9999-999999999999',
    name_en: 'Electric & Gadgets',
    name_bn: 'Electric & Gadgets',
    slug: 'electric-gadgets',
    image_url: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
    is_active: true,
    sort_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title_en: 'Authentic Luxury Beauty & Grooming',
    title_bn: '১০০% অরিজিনাল বিউটি ও প্রিমিয়াম গ্রুমিং',
    subtitle_en: 'Curated luxury perfumes, gentle organic skincare, and classic grooming essentials imported and delivered across Bangladesh.',
    subtitle_bn: 'আন্তর্জাতিক মানের আসল পারফিউম, অরগানিক স্কিনকেয়ার ও পুরুষদের প্রিমিয়াম গ্রুমিং সম্ভার। ঢাকা ও সমগ্র বাংলাদেশে দ্রুত ডেলিভারি।',
    image_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
    button_text_en: 'Explore Collection',
    button_text_bn: 'কালেকশন দেখুন',
    destination_url: '#products',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title_en: 'Signature French Eau De Parfum',
    title_bn: 'এক্সক্লুসিভ ফ্রেঞ্চ পারফিউম কালেকশন',
    subtitle_en: 'Discover long-lasting luxury niche fragrances formulated with pure Damask Rose and rare oud wood.',
    subtitle_bn: 'সারাদিন স্থায়ী মনমাতানো সুবাস। অরিজিনাল অউদ ও দামাস্ক গোলাপের রাজকীয় নির্যাস।',
    image_path: '/src/assets/images/product_luxury_perfume_1792601572027.jpg',
    button_text_en: 'Shop Fragrance',
    button_text_bn: 'পারফিউম দেখুন',
    destination_url: '#category-perfume-fragrance',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title_en: "Gentlemen's Essential Grooming Kit",
    title_bn: 'পুরুষদের প্রিমিয়াম গ্রুমিং কিট',
    subtitle_en: 'Pure cold-pressed cedarwood beard oils, styling balms, and handcrafted accessories.',
    subtitle_bn: 'ন্যাচারাল উপাদান দিয়ে তৈরি পিওর সিডারউড বিয়ার্ড অয়েল ও স্টাইলিং বাম। স্বাস্থ্যোজ্জ্বল দাড়ি ও চুলের যত্ন।',
    image_path: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
    button_text_en: "Explore Men's",
    button_text_bn: 'গ্রুমিং কালেকশন',
    destination_url: '#category-mens-collection',
    sort_order: 3,
    is_active: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    sku: 'SKIN-RS-001',
    slug: 'aurelia-rosewater-hydrating-serum',
    name_en: 'Aurélia Damask Rosewater Facial Serum',
    name_bn: 'অরেলিয়া দামাস্ক রোজওয়াটার ফেসিয়াল সিরাম',
    description_en: 'An ultra-hydrating, featherweight facial serum infused with organic Damask rose petals, triple-molecular hyaluronic acid, and niacinamide. Plumps fine dehydration lines and restores natural luminosity without any tacky residue.',
    description_bn: 'অরগানিক দামাস্ক গোলাপের নির্যাস, ট্রিপল হায়ালুরোনিক অ্যাসিড ও নিয়াসিনামাইড সমৃদ্ধ আল্ট্রা-হাইড্রেটিং ফেসিয়াল সিরাম। এটি ত্বকের গভীরে আর্দ্রতা পৌঁছে দেয়, শুষ্কতা দূর করে এবং প্রাকৃতিক উজ্জ্বলতা ফিরিয়ে আনে। চিটচিটে ভাব মুক্ত হালকা ফর্মুলা।',
    usage_instructions_en: 'Apply 3-4 drops morning and evening onto cleansed, slightly damp facial skin. Gently pat with fingertips until fully absorbed before applying moisturizer.',
    usage_instructions_bn: 'সকাল ও রাতে ত্বক ভালোভাবে পরিষ্কার করে ভেজা ত্বকে ৩-৪ ফোঁটা সিরাম নিন। আঙুলের ডগা দিয়ে আলতোভাবে ত্বকে মিশিয়ে দিন এবং ময়েশ্চারাইজার ব্যবহার করুন।',
    brand_id: 'b2222222-2222-2222-2222-222222222222',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    price: 1850.00,
    sale_price: 1650.00,
    stock_quantity: 18,
    low_stock_threshold: 5,
    warranty_status: 'not_applicable',
    expiry_date: '2028-06-30',
    batch_number: 'AR-2026-B81',
    net_content: '30 ml / 1.0 fl oz',
    ingredients_en: 'Aqua (Water), Rosa Damascena Flower Water, Sodium Hyaluronate, Niacinamide (Vitamin B3), Glycerin, Phenoxyethanol, Ethylhexylglycerin.',
    ingredients_bn: 'একোয়া (পানি), রোজা দামাস্কিনা ফ্লাওয়ার ওয়াটার, সোডিয়াম হায়ালুরোনেট, নিয়াসিনামাইড (ভিটামিন বি৩), গ্লিসারিন, ফেনোক্সিইথানল।',
    specifications: {
      'Skin Type': 'All Skin Types, Sensitive & Dry',
      'Origin': 'France',
      'Cruelty Free': 'Certified Leaping Bunny',
      'Formulation': 'Lightweight Liquid Gel'
    },
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    seo_title_en: 'Aurélia Damask Rosewater Facial Serum - Purchase Hub Bangladesh',
    seo_title_bn: 'অরেলিয়া রোজওয়াটার ফেসিয়াল সিরাম - পারচেজ হাব বাংলাদেশ',
    seo_description_en: 'Buy authentic Aurélia Rosewater Hydrating Serum in Bangladesh. Best price, genuine quality, and nationwide delivery.',
    seo_description_bn: 'বাংলাদেশে ১০০% অরিজিনাল অরেলিয়া রোজওয়াটার সিরাম কিনুন সেরা মূল্যে পারচেজ হাব থেকে।',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-1',
        product_id: 'p1111111-1111-1111-1111-111111111111',
        storage_path: '/src/assets/images/product_hydrating_serum_1792601571425.jpg',
        alt_text_en: 'Aurélia Damask Rosewater Dropper Bottle',
        alt_text_bn: 'অরেলিয়া রোজওয়াটার সিরাম বোতল',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'img-1b',
        product_id: 'p1111111-1111-1111-1111-111111111111',
        storage_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
        alt_text_en: 'Aurélia Rosewater Skincare Collection',
        alt_text_bn: 'অরেলিয়া স্কিনকেয়ার কালেকশন',
        sort_order: 2,
        is_primary: false,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    sku: 'PERF-LR-002',
    slug: 'lamour-de-rose-eau-de-parfum',
    name_en: "L'Amour de Rose Eau de Parfum (50ml)",
    name_bn: 'লামুর দ্য রোজ ও দ্য পারফিউম (৫০ মি.লি.)',
    description_en: 'An intoxicating and refined oriental floral fragrance opening with crisp sparkling bergamot and pink pepper, flowing into a heart of velvety French rose and Moroccan jasmine, resting on a warm sensual base of Madagascar vanilla and golden amber.',
    description_bn: 'একটি অবিস্মরণীয় এবং অভিজাত প্রাচ্য ফ্লোরাল পারফিউম। বারগামোট ও পিঙ্ক পেপারের ফ্রেশ সুবাস দিয়ে শুরু হয়ে ফ্রেঞ্চ ভেলভেট রোজ ও জুঁই ফুলের হৃদয়ে রূপ নেয় এবং মাদাগাস্কার ভ্যানিলা ও গোল্ডেন অ্যাম্বারের উষ্ণ ছোঁয়ায় সারাদিন দীর্ঘস্থায়ী থাকে।',
    usage_instructions_en: 'Spray onto pulse points including wrists, inner elbows, base of neck, and behind ears for lingering all-day projection.',
    usage_instructions_bn: 'কবজি, গলার দুপাশে এবং কানের পেছনের পালস পয়েন্টে হালকাভাবে স্প্রে করুন যাতে সুবাস দীর্ঘস্থায়ী হয়।',
    brand_id: 'b1111111-1111-1111-1111-111111111111',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    price: 4200.00,
    sale_price: 3800.00,
    stock_quantity: 8,
    low_stock_threshold: 4,
    warranty_status: 'not_applicable',
    expiry_date: '2029-12-31',
    batch_number: 'LR-EDP-704',
    net_content: '50 ml / 1.7 fl oz',
    ingredients_en: 'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Benzyl Benzoate.',
    ingredients_bn: 'অ্যালকোহল ডিনাট, পারফিউম ফ্র্যাগ্রেন্স, একোয়া, লিমোনিন, লিনালুল, সিট্রোনেলোল, জেরানিওল।',
    specifications: {
      'Concentration': 'Eau de Parfum (EDP)',
      'Longevity': '8-12 Hours Projection',
      'Country of Origin': 'Grasse, France',
      'Season': 'All Season Evening & Signature'
    },
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    seo_title_en: "L'Amour de Rose Eau de Parfum 50ml - Purchase Hub BD",
    seo_title_bn: 'লামুর দ্য রোজ ও দ্য পারফিউম ৫০ মিলি - পারচেজ হাব',
    seo_description_en: "Order original L'Amour de Rose French EDP in Bangladesh with WhatsApp direct order.",
    seo_description_bn: 'আসল ফরাসি পারফিউম লামুর দ্য রোজ কিনুন পারচেজ হাব থেকে।',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-2',
        product_id: 'p2222222-2222-2222-2222-222222222222',
        storage_path: '/src/assets/images/product_luxury_perfume_1792601572027.jpg',
        alt_text_en: "L'Amour de Rose Crystal Flacon with Rose Gold Cap",
        alt_text_bn: 'লামুর দ্য রোজ পারফিউম ক্রিস্টাল বোতল',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    sku: 'MENS-BW-003',
    slug: 'blackwood-cedarwood-beard-oil-balm',
    name_en: 'Blackwood Premium Cedarwood Beard Oil & Balm Set',
    name_bn: 'ব্ল্যাকউড প্রিমিয়াম সিডারউড বিয়ার্ড অয়েল ও বাম সেট',
    description_en: 'A dual grooming therapy set crafted specifically for modern men. Formulated with cold-pressed Moroccan argan oil, golden jojoba, and Virginia cedarwood essential oil to soften coarse facial hair, eliminate itchiness, and promote thick, healthy beard growth.',
    description_bn: 'আধুনিক পুরুষদের দাড়ির যত্নে বিশেষ গ্রুমিং সেট। কোল্ড-প্রেসড আরগান অয়েল, জোজোবা তেল ও ভার্জিনিয়া সিডারউড অয়েল দিয়ে তৈরি। এটি রুক্ষ দাড়িকে করে নরম, ত্বকের চুলকানি দূর করে এবং স্বাস্থ্যকর দাড়ির বৃদ্ধিতে সহায়তা করে।',
    usage_instructions_en: 'Dispense 3-5 drops of beard oil onto palms, rub together and massage deep into beard and skin. Follow with a dime-sized amount of beard balm to sculpt and hold shape.',
    usage_instructions_bn: 'হাতের তালুতে ৩-৫ ফোঁটা তেল নিয়ে দাড়ি এবং ত্বকের মূলে ভালোভাবে মালিশ করুন। এরপর হালকা পরিমাণ বাম নিয়ে দাড়ি আঁচড়ে পছন্দের শেইপ দিন।',
    brand_id: 'b3333333-3333-3333-3333-333333333333',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    price: 1650.00,
    sale_price: 1450.00,
    stock_quantity: 12,
    low_stock_threshold: 5,
    warranty_status: 'not_applicable',
    expiry_date: '2028-04-15',
    batch_number: 'BW-BEARD-99',
    net_content: '50ml Oil + 60g Balm',
    ingredients_en: 'Simmondsia Chinensis (Jojoba) Seed Oil, Argania Spinosa (Argan) Kernel Oil, Cedrus Atlantica (Cedarwood) Bark Oil, Cera Alba (Beeswax), Butyrospermum Parkii (Shea Butter).',
    ingredients_bn: 'জোজোবা সিড অয়েল, আরগান কার্নেল অয়েল, সিডারউড বার্ক অয়েল, প্রাকৃতিক বিওয়াক্স, শিয়া বাটার।',
    specifications: {
      'Set Contains': 'Beard Nourishing Oil (50ml) + Sculpting Balm (60g)',
      'Scent Profile': 'Smoky Cedarwood & Warm Amber Oak',
      'Organic Ingredients': '100% Certified Plant Oils'
    },
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    seo_title_en: 'Blackwood Cedarwood Beard Oil & Balm Duo - Purchase Hub',
    seo_title_bn: 'ব্ল্যাকউড সিডারউড বিয়ার্ড অয়েল ও বাম ডুও - পারচেজ হাব',
    seo_description_en: 'Shop authentic Blackwood Beard Grooming kit in Bangladesh. Fast home delivery.',
    seo_description_bn: 'বাংলাদেশে ব্ল্যাকউড বিয়ার্ড অয়েল ও বাম কিনুন সুলভ মূল্যে।',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-3',
        product_id: 'p3333333-3333-3333-3333-333333333333',
        storage_path: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
        alt_text_en: 'Blackwood Beard Oil and Conditioning Balm on Slate',
        alt_text_bn: 'ব্ল্যাকউড সিডারউড বিয়ার্ড অয়েল ও বাম সেট',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p4444444-4444-4444-4444-444444444444',
    sku: 'MAKE-VR-004',
    slug: 'velvet-radiance-matte-lipstick-blush',
    name_en: 'Velvet Radiance Matte Lipstick & Powder Blush Duo',
    name_bn: 'ভেলভেট রেডিয়ান্স ম্যাট লিপস্টিক ও ব্লাশ ডুও',
    description_en: 'Featuring a luxurious rose-gold fluted case, this silky weightless matte lipstick delivers saturated berry color in a single glide. Paired with a finely milled petal powder blush with micro-pearls for an effortless, sun-kissed flush.',
    description_bn: 'আভিজাত্যপূর্ণ রোজ-গোল্ড কেসে মোড়ানো এই মসৃণ ম্যাট লিপস্টিক এক টানেই দেয় দারুণ বেরি রঙের ফিনিশ। সাথে থাকা কোমল পাউডার ব্লাশ আপনার গালে এনে দেবে স্বাভাবিক ও দীপ্তিময় গোলাপি আভা। এটি দীর্ঘস্থায়ী ও ট্রান্সফার-প্রুফ।',
    usage_instructions_en: 'Glide lipstick directly onto lips starting from center to corners. Lightly sweep powder blush along cheekbones using a fluffy brush.',
    usage_instructions_bn: 'ঠোঁটের মাঝখান থেকে শুরু করে দুই কোণে সমানভাবে লিপস্টিক লাগান। নরম ব্রাশ দিয়ে গালের হাড়ে ব্লাশ ছড়িয়ে দিন।',
    brand_id: 'b4444444-4444-4444-4444-444444444444',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    price: 1950.00,
    sale_price: 1750.00,
    stock_quantity: 4, // low stock testing (<5)
    low_stock_threshold: 5,
    warranty_status: 'not_applicable',
    expiry_date: '2028-11-20',
    batch_number: 'VR-LIP-303',
    net_content: '3.8g Lipstick + 5g Blush',
    ingredients_en: 'Dimethicone, Synthetic Wax, Mica, Tocopheryl Acetate (Vitamin E), Jojoba Esters, Iron Oxides (CI 77491, CI 77492, CI 77499), Red 7 Lake.',
    ingredients_bn: 'ডাইমেথিকোন, সিন্থেটিক মোম, মাইকা, ভিটামিন ই, জোজোবা এস্টার, আয়রন অক্সাইড।',
    specifications: {
      'Lipstick Finish': 'Cashmere Velvet Matte',
      'Wear Longevity': 'Up to 10 Hours Non-Drying',
      'Packaging': 'Solid Rose Gold Brass Fluted Case',
      'Skin Compatibility': 'Hypoallergenic & Non-Comedogenic'
    },
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    seo_title_en: 'Velvet Radiance Matte Lipstick & Blush Duo - Purchase Hub',
    seo_title_bn: 'ভেলভেট রেডিয়ান্স ম্যাট লিপস্টিক ও ব্লাশ ডুও - পারচেজ হাব',
    seo_description_en: 'Premium cosmetics in Bangladesh. Buy authentic Velvet Radiance lipstick and blush.',
    seo_description_bn: 'অরিজিনাল ভেলভেট রেডিয়ান্স লিপস্টিক ও ব্লাশ কম্বো কিনুন পারচেজ হাব থেকে।',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-4',
        product_id: 'p4444444-4444-4444-4444-444444444444',
        storage_path: '/src/assets/images/product_velvet_lipstick_1792601573045.jpg',
        alt_text_en: 'Velvet Radiance Rose Gold Lipstick and Powder Blush Compact',
        alt_text_bn: 'ভেলভেট রেডিয়ান্স লিপস্টিক ও ব্লাশ কম্প্যাক্ট',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p5555555-5555-5555-5555-555555555555',
    sku: 'ACC-SJ-005',
    slug: 'natural-rose-quartz-face-roller-guasha',
    name_en: 'Natural Rose Quartz Facial Roller & Gua Sha Set',
    name_bn: 'ন্যাচারাল রোজ কোয়ার্টজ ফেসিয়াল রোলার ও গুয়া শা সেট',
    description_en: 'Hand-carved from 100% natural Grade-A Brazilian rose quartz stone. Helps improve micro-circulation, relieve facial muscle tension, reduce puffiness around eyes, and facilitate deeper absorption of serums and face oils.',
    description_bn: '১০০% আসল ব্রাজিলিয়ান রোজ কোয়ার্টজ পাথর দিয়ে তৈরি প্রিমিয়াম ফেসিয়াল রোলার ও গুয়া শা সেট। এটি মুখের রক্ত সঞ্চালন বৃদ্ধি করে, ফোলাভাব কমায়, মুখের ত্বকের টানটান ভাব বজায় রাখে এবং সিরাম শোষণে সাহায্য করে।',
    usage_instructions_en: 'Use upward strokes from chin to cheekbones and forehead for 5-10 minutes daily. Can be refrigerated 15 minutes before use for an invigorating depuffing sensation.',
    usage_instructions_bn: 'প্রতিদিন ৫-১০ মিনিট থুতনি থেকে শুরু করে গাল ও কপালের উপরের দিকে রোলার ব্যবহার করুন। ব্যবহারের আগে ১৫ মিনিট ফ্রিজে রেখে নিলে চমৎকার রিফ্রেশিং অনুভূতি পাওয়া যায়।',
    brand_id: 'b5555555-5555-5555-5555-555555555555',
    category_id: 'c8888888-8888-8888-8888-888888888888',
    price: 1250.00,
    sale_price: 990.00,
    stock_quantity: 0, // out of stock testing
    low_stock_threshold: 3,
    warranty_status: 'yes',
    warranty_duration: '6 Months Replacement Warranty for Stone Integrity',
    warranty_terms_en: 'Covers manufacturer craftsmanship defects and stone detachment under standard usage.',
    warranty_terms_bn: 'সাধারণ ব্যবহারে কোনো ত্রুটি বা পাথর খুলে যাওয়ার ক্ষেত্রে ৬ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি প্রযোজ্য।',
    expiry_date: null,
    batch_number: 'SJ-RQ-2026',
    net_content: 'Set of 2 Pieces with Velvet Pouch',
    specifications: {
      'Material': '100% Authentic Natural Rose Quartz',
      'Frame': 'Sturdy Rose Gold Zinc Alloy (Rust Proof)',
      'Includes': 'Dual-End Roller, Gua Sha Sculptor, Silk Pouch'
    },
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    seo_title_en: 'Natural Rose Quartz Roller & Gua Sha Set - Purchase Hub BD',
    seo_title_bn: 'রোজ কোয়ার্টজ ফেস রোলার ও গুয়া শা - পারচেজ হাব',
    seo_description_en: 'Authentic Brazilian Rose Quartz Facial Roller set in Bangladesh. Safe payment on delivery.',
    seo_description_bn: 'আসল ব্রাজিলিয়ান রোজ কোয়ার্টজ ফেস রোলার কিনুন পারচেজ হাব থেকে।',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-5',
        product_id: 'p5555555-5555-5555-5555-555555555555',
        storage_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
        alt_text_en: 'Natural Rose Quartz Facial Roller with Rose Gold Frame',
        alt_text_bn: 'Natural Rose Quartz Facial Roller with Rose Gold Frame',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p6666666-6666-6666-6666-666666666666',
    sku: 'ELEC-SC-006',
    slug: 'sonic-facial-cleansing-massager-device',
    name_en: 'Ultra-Sonic Silicone Facial Cleansing & Firming Massager',
    name_bn: 'Ultra-Sonic Silicone Facial Cleansing & Firming Massager',
    description_en: 'IPX7 waterproof ultra-hygienic silicone electric cleansing brush with 8 adjustable T-Sonic vibration speeds. Deeply cleanses clogged pores, removes 99.5% of dirt, sebum, and makeup residue, and promotes youthful elasticity.',
    description_bn: 'Ultra-Sonic Silicone Facial Cleansing & Firming Massager',
    usage_instructions_en: 'Apply cleanser, wet device, and glide gently in circular motions across face for 1-2 minutes. Rinse and pat dry.',
    usage_instructions_bn: 'Apply cleanser, wet device, and glide gently in circular motions across face for 1-2 minutes.',
    brand_id: 'b5555555-5555-5555-5555-555555555555',
    category_id: 'c9999999-9999-9999-9999-999999999999',
    price: 1850.00,
    sale_price: 1550.00,
    stock_quantity: 18,
    low_stock_threshold: 4,
    warranty_status: 'yes',
    warranty_duration: '1 Year Full Replacement Warranty',
    warranty_terms_en: 'Covers battery, motor, and electronic manufacturing defects.',
    warranty_terms_bn: 'Covers battery, motor, and electronic manufacturing defects.',
    expiry_date: null,
    batch_number: 'EG-SONIC-2026',
    net_content: '1 Device with USB Magnetic Fast Charger',
    specifications: {
      'Battery': 'Rechargeable Li-ion (Up to 300 uses per charge)',
      'Waterproof': 'IPX7 Fully Submersible',
      'Material': 'Food-Grade Antibacterial Silicone'
    },
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    seo_title_en: 'Sonic Facial Cleansing Device - Purchase Hub BD',
    seo_title_bn: 'Sonic Facial Cleansing Device - Purchase Hub BD',
    seo_description_en: 'Buy Ultra-Sonic Silicone Facial Cleansing brush in Bangladesh with fast nationwide delivery.',
    seo_description_bn: 'Buy Ultra-Sonic Silicone Facial Cleansing brush in Bangladesh.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-6',
        product_id: 'p6666666-6666-6666-6666-666666666666',
        storage_path: '/src/assets/images/hero_cosmetics_luxury_1792601571677.jpg',
        alt_text_en: 'Ultra-Sonic Silicone Facial Cleansing Device',
        alt_text_bn: 'Ultra-Sonic Silicone Facial Cleansing Device',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p7777777-7777-7777-7777-777777777777',
    sku: 'ELEC-TRIM-007',
    slug: 'precision-cordless-electric-grooming-trimmer',
    name_en: 'Precision Cordless Electric Beard & Body Grooming Trimmer',
    name_bn: 'Precision Cordless Electric Beard & Body Grooming Trimmer',
    description_en: 'Heavy-duty cordless grooming trimmer featuring self-sharpening titanium ceramic blades, LED power display, and ultra-quiet motor. Perfect for edging, detailing, and complete facial styling.',
    description_bn: 'Precision Cordless Electric Beard & Body Grooming Trimmer',
    usage_instructions_en: 'Select comb attachment (1mm, 2mm, 3mm) or use zero-gap bare blade for sharp lines. Rinse head under running water after use.',
    usage_instructions_bn: 'Select comb attachment or use zero-gap bare blade for sharp lines.',
    brand_id: 'b3333333-3333-3333-3333-333333333333',
    category_id: 'c9999999-9999-9999-9999-999999999999',
    price: 2150.00,
    sale_price: 1850.00,
    stock_quantity: 14,
    low_stock_threshold: 3,
    warranty_status: 'yes',
    warranty_duration: '1 Year Warranty',
    warranty_terms_en: 'Covers internal motor mechanism and electrical components.',
    warranty_terms_bn: 'Covers internal motor mechanism and electrical components.',
    expiry_date: null,
    batch_number: 'EG-TRIM-2026',
    net_content: 'Trimmer, 4 Guide Combs, USB-C Cable, Cleaning Brush & Oil',
    specifications: {
      'Blade': 'Titanium Ceramic Self-Sharpening',
      'Runtime': '120 Minutes on 1.5H USB-C Quick Charge',
      'Motor': '6500 RPM High Torque Silent Motor'
    },
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    seo_title_en: 'Precision Electric Grooming Trimmer - Purchase Hub BD',
    seo_title_bn: 'Precision Electric Grooming Trimmer - Purchase Hub BD',
    seo_description_en: 'Buy professional electric beard trimmer in Bangladesh at Purchase Hub.',
    seo_description_bn: 'Buy professional electric beard trimmer in Bangladesh.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-7',
        product_id: 'p7777777-7777-7777-7777-777777777777',
        storage_path: '/src/assets/images/product_mens_grooming_1792601572987.jpg',
        alt_text_en: 'Precision Cordless Electric Grooming Trimmer',
        alt_text_bn: 'Precision Cordless Electric Grooming Trimmer',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  shop_name: 'PURCHASE HUB',
  tagline_en: 'Beauty, Grooming & Lifestyle',
  tagline_bn: 'Beauty, Grooming & Lifestyle',
  whatsapp_number: '01705776631',
  phone_number: '01705776631',
  email: 'purchasehub16@gmail.com',
  address_en: 'Nilachal, 408/2, North Kazipara, Mirpur, Dhaka-1216, Bangladesh',
  address_bn: 'Nilachal, 408/2, North Kazipara, Mirpur, Dhaka-1216, Bangladesh',
  opening_hours_en: 'Everyday: 10:00 AM – 10:00 PM',
  opening_hours_bn: 'Everyday: 10:00 AM – 10:00 PM',
  low_stock_threshold: 5,
  delivery_charge_inside_dhaka: 70,
  delivery_charge_outside_dhaka: 130
};
