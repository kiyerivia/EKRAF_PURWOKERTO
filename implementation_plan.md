# Implementasi Aplikasi EKRAF PURWOKERTO (Elegan Diagonal Style • Magic Effect • Light Theme)

Aplikasi ini dirancang dan dibangun berdasarkan visi komprehensif dari dokumen [EKRAF PURWOKERTO.pdf](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/EKRAF%20PURWOKERTO.pdf). Sistem ini menggabungkan **Portal Publik Ekonomi Kreatif Purwokerto** untuk masyarakat/wisatawan dan **Dashboard CMS Hostinger-Style** untuk admin serta pelaku UMKM tanpa perlu koding.

## Konsep & Spesifikasi Desain

1. **Gaya Desain: Elegan Diagonal Style**
   - Menggunakan potongan sudut diagonal dinamis (*angled polygon clip-paths*, `polygon(0 0, 100% 0, 100% 92%, 0 100%)`).
   - Badge & label beraksen parallelogram miring (*skewed accents* `-10deg`).
   - Kartu-kartu dengan aksen garis diagonal bercahaya (*diagonal golden light beams*).
2. **Palet Warna: Terang & Mewah (Luminous Light Theme)**
   - Latar belakang: *Pure Porcelain & Bright Cloud* (`#F8FAFC`, `#FFFFFF`, `#F1F5F9`).
   - Warna Utama: *Purwokerto Teratai Gold* (`#F59E0B`, `#D97706`), *Royal Sapphire Blue* (`#2563EB`, `#0284C7`), dan *Emerald Harmony* (`#10B981`).
   - Tipografi modern: Google Fonts `Plus Jakarta Sans` & `Outfit`.
3. **Tombol Berikon & Interaktif**
   - Seluruh tombol dilengkapi ikon modern (SVG crisp & clean).
   - Tombol utama dengan efek *shimmering magic*, *glow*, dan *ripple*.
4. **Effect Magic**
   - ✨ *Magic Sparkle Particle Trail* yang mengikuti pergerakan kursor pengguna.
   - 🌟 *Magic Glow Border & Card Tilt 3D* dengan refleksi cahaya saat disentuh/di-hover.
   - 🎇 *Floating Celestial Glow Orbs* di latar belakang yang lembut dan elegan.
   - 🎉 Efek konfeti/sparkle saat aksi CMS berhasil dilakukan.

---

## Arsitektur Fitur

### 1. Mode Switcher & Role Access (Hostinger/CMS vs Public Portal)
- Floating / Top Navigation Bar untuk beralih instan antara **Portal Publik EKRAF** dan **Dashboard CMS EKRAF**.
- Pilihan Role Pengguna: `Admin Utama EKRAF`, `Pelaku UMKM (Bintang)`, dan `Warga / Pengunjung`.

### 2. Portal Publik EKRAF
- **Diagonal Hero Section**:
  - Menampilkan Logo Resmi Menara Pandang Teratai (dari PDF halaman 10) & panorama megah Menara Teratai Purwokerto berlatar Gunung Slamet.
  - Slogan: *"KREATIF • INOVATIF • BERDAYA SAING"*.
  - Metrik live: Pelaku Ekraf (1.245+), Produk (328+), Event Aktif (42+).
  - Quick Search & 17 Subsektor Ekraf filter (Kuliner, Kriya, Musik, Seni Pertunjukan, Fashion, Desain, Fotografi, dll).
- **Katalog UMKM & Pelaku Ekraf**:
  - Kartu UMKM Banyumas interaktif (Mendoan Sawangan, Batik Hadipriyanto, Getuk Goreng H. Tohirin, Kopi Banyumas, Sanggar Seni Ebeg, dll).
  - Tombol aksi: Hubungi WhatsApp langsung, Buka Lokasi Google Maps, Lihat Detail Produk.
- **Produk Unggulan Purwokerto**:
  - Galeri produk dengan harga, deskripsi, status ketersediaan, dan direct order.
- **Kalender Event & Festival Ekraf Purwokerto 2026**:
  - Festival Ekonomi Kreatif di Menara Teratai, Banyumas Extravaganza, dll dengan countdown & registrasi.
- **Destinasi & Wisata Kreatif**:
  - Menara Pandang Teratai, Lokawisata Baturraden, Kawasan Kota Lama Banyumas.
- **Berita & Pengumuman Ekraf Terkini**:
  - Artikel kurasi & pengumuman program bantuan/pelatihan pelaku usaha.
- **Formulir Pendaftaran UMKM Mandiri**:
  - Fitur *"Daftar → Isi Profil → Upload → Submit"* seperti yang dibahas di PDF halaman 8.

### 3. Dashboard CMS EKRAF (Ala Hostinger / WordPress Sesuai PDF)
- **Sidebar Menu Lengkap**:
  - 📊 *Dashboard*: Ringkasan analitik, grafik kunjungan mingguan, log aktivitas terbaru.
  - 👥 *Pelaku Ekraf & 🏪 UMKM*: Tabel data dengan fitur CRUD penuh (Tambah, Edit, Hapus, Filter Status Verifikasi). Form modal lengkap mencakup semua input dari halaman 7 PDF (Nama usaha, Pemilik, Kategori, Deskripsi, Alamat, Maps, WA, Instagram, Website, Foto, Jam Buka).
  - 🛍 *Produk*: Manajemen katalog produk UMKM.
  - 📰 *Berita & Artikel*: Editor artikel ala Blogspot/WordPress (sesuai halaman 5 PDF) dengan toolbar [B] [I] [🔗] [📷] [🎥], kategori, status Draft/Publish.
  - 📅 *Event*: Manajemen festival dan kalender kegiatan kota.
  - 📍 *Destinasi*: Manajemen titik wisata kreatif.
  - 🧩 *Modul EKRAF ("App Store" Kecil sesuai halaman 7-8)*: Pengaturan modul Aktif/Nonaktif (Direktori UMKM, Berita, Event, Destinasi, Marketplace, Tiket Event, Pembayaran, Statistik).
  - ⚙ *Pengaturan & Data*: Ekspor/Impor data JSON, reset data bawaan Purwokerto.
- **Real-Time Data Persistence (LocalStorage)**:
  - Setiap perubahan di CMS (tambah UMKM, edit event, publikasi berita baru) langsung tersinkronisasi dan tampil di Portal Publik secara real-time.

---

## Rencana File & Komponen

- [NEW] [index.html](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/index.html): Halaman utama terstruktur dengan semantik SEO, navigasi dual-portal, modal sistem, dan container CMS.
- [NEW] [css/style.css](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/css/style.css): Desain sistem elegan diagonal style, tema terang luminous, efek magic glow/shimmer, typography Outfit & Plus Jakarta Sans.
- [NEW] [js/data.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/data.js): Database lokal komprehensif (UMKM, Produk, Event, Destinasi, Berita, Modul) dengan mekanisme seeding dan LocalStorage CRUD handler.
- [NEW] [js/magic.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/magic.js): Engine efek magic (sparkle cursor particle trail, tilt reflection, floating ethereal orbs, ripple & celebration sparks).
- [NEW] [js/app.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/app.js): Logika navigasi portal publik, filter 17 subsektor ekraf, pencarian dinamis, integrasi WhatsApp & Google Maps, modal viewer.
- [NEW] [js/cms.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/cms.js): Logika dashboard CMS Hostinger-style (CRUD UMKM, Blogspot-style rich article editor, modul switcher toggle, grafik analitik).

---

## Rencana Verifikasi

1. **Uji Tampilan & Tema Terang**:
   - Memastikan nuansa terang, bersih, modern, dan tidak silau dengan kontras teks dan kartu yang sempurna.
   - Memastikan aksen diagonal polygon tampil presisi dan rapi di semua ukuran layar (responsive).
2. **Uji Efek Magic & Ikon Tombol**:
   - Menjalankan cursor sparkle trail dan interaksi hover card glow.
   - Memastikan setiap tombol memiliki ikon yang relevan dan efek feedback klik.
3. **Uji Alur CRUD CMS & Sinkronisasi**:
   - Menambah satu UMKM baru melalui Dashboard CMS -> memeriksa apakah langsung muncul di Direktori Publik.
   - Menambah berita baru via Blogspot-style editor -> memeriksa tampil di feed publik.
   - Mengubah toggle Modul EKRAF -> memastikan visibilitas modul di portal publik berubah sesuai setelan.
4. **Validasi Peramban (Browser Subagent)**:
   - Membuka halaman secara lokal dengan server browser untuk melihat visual, animasi, dan fungsionalitasnya.
