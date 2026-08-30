-- ===================================================================
-- SKEMA DATABASE SUPABASE: EKRAF PURWOKERTO
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda
-- (https://app.supabase.com -> Project -> SQL Editor -> New Query)
-- ===================================================================

-- 1. TABEL UMKM & PELAKU EKRAF
CREATE TABLE IF NOT EXISTS public.umkm (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    category TEXT NOT NULL,
    category_name TEXT,
    description TEXT,
    address TEXT,
    maps_url TEXT,
    whatsapp TEXT,
    instagram TEXT,
    website TEXT,
    image TEXT,
    opening_hours TEXT DEFAULT '08:00 - 20:00 WIB',
    status TEXT DEFAULT 'Terverifikasi',
    rating NUMERIC DEFAULT 4.9,
    reviews_count INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PRODUK UNGGULAN
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    umkm_id TEXT REFERENCES public.umkm(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INT NOT NULL DEFAULT 0,
    category TEXT,
    image TEXT,
    description TEXT,
    stock INT DEFAULT 50,
    sold INT DEFAULT 0,
    unit TEXT DEFAULT 'pcs',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL EVENT & FESTIVAL KOTA
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    date_iso DATE,
    time TEXT,
    location TEXT,
    category TEXT,
    image TEXT,
    description TEXT,
    organizer TEXT,
    price TEXT DEFAULT 'Gratis',
    status TEXT DEFAULT 'Mendatang',
    quota INT DEFAULT 1000,
    registered INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL DESTINASI & WISATA KREATIF
CREATE TABLE IF NOT EXISTS public.destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    image TEXT,
    description TEXT,
    highlights TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL WARTA & BERITA EKRAF (BLOG)
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT DEFAULT 'Admin Ekraf Purwokerto',
    category TEXT,
    image TEXT,
    summary TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL MODUL APP STORE
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS
-- ===================================================================
ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Publik dapat membaca data (SELECT) secara bebas
CREATE POLICY "Public read umkm" ON public.umkm FOR SELECT USING (true);
CREATE POLICY "Public insert umkm" ON public.umkm FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update umkm" ON public.umkm FOR UPDATE USING (true);
CREATE POLICY "Public delete umkm" ON public.umkm FOR DELETE USING (true);

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public all products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public all events" ON public.events FOR ALL USING (true);

CREATE POLICY "Public read destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Public all destinations" ON public.destinations FOR ALL USING (true);

CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public all news" ON public.news FOR ALL USING (true);

CREATE POLICY "Public read modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Public all modules" ON public.modules FOR ALL USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.umkm;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
