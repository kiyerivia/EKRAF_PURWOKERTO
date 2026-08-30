/**
 * EKRAF PURWOKERTO - Data Engine & Local Storage Repository
 * Menyimpan data ekosistem ekonomi kreatif Purwokerto & Banyumas
 */

const STORAGE_KEYS = {
  UMKM: 'ekraf_pwt_umkm_v1',
  PRODUCTS: 'ekraf_pwt_products_v1',
  EVENTS: 'ekraf_pwt_events_v1',
  DESTINATIONS: 'ekraf_pwt_destinations_v1',
  NEWS: 'ekraf_pwt_news_v1',
  MODULES: 'ekraf_pwt_modules_v1',
  USER_ROLE: 'ekraf_pwt_role_v1'
};

// 17 Subsektor Ekonomi Kreatif Kemenparekraf
const EKRAF_CATEGORIES = [
  { id: 'kuliner', name: 'Kuliner Banyumasan', icon: 'utensils', desc: 'Mendoan, Getuk Goreng, Soto Sokaraja & Kuliner Khas' },
  { id: 'kriya', name: 'Kriya & Kerajinan', icon: 'scissors', desc: 'Anyaman Bambu, Sandal Bandol, Ukir Kayu' },
  { id: 'fashion', name: 'Fashion & Batik', icon: 'shirt', desc: 'Batik Banyumasan, Pakaian Etnik & Distro Lokal' },
  { id: 'seni-pertunjukan', name: 'Seni Pertunjukan', icon: 'sparkles', desc: 'Kenthongan, Tari Tradisional Ebeg, Teater' },
  { id: 'musik', name: 'Musik & Audio', icon: 'music', desc: 'Gamelan Banyumasan, Band Lokal, Audio Studio' },
  { id: 'dkv', name: 'Desain Komunikasi Visual', icon: 'palette', desc: 'Branding, Ilustrasi, Desain Grafis' },
  { id: 'fotografi', name: 'Fotografi', icon: 'camera', desc: 'Foto Produk, Event, Dokumentasi Seni' },
  { id: 'film-animasi', name: 'Film & Animasi', icon: 'video', desc: 'Animasi Satria, Sinema Banyumas, Video Komersial' },
  { id: 'arsitektur', name: 'Arsitektur', icon: 'building', desc: 'Desain Rumah Adat Banyumas & Bangunan Modern' },
  { id: 'desain-produk', name: 'Desain Produk', icon: 'box', desc: 'Kemasan Makanan Lokal, Alat Kreatif' },
  { id: 'aplikasi-game', name: 'Aplikasi & Game', icon: 'laptop', desc: 'Startup Digital, Game Satria Purwokerto' },
  { id: 'penerbitan', name: 'Penerbitan & Literasi', icon: 'book-open', desc: 'Buku Dialek Banyumasan, Majalah Kreatif' },
  { id: 'seni-rupa', name: 'Seni Rupa', icon: 'brush', desc: 'Lukisan Alam Slamet, Patung & Instalasi' },
  { id: 'periklanan', name: 'Periklanan', icon: 'megaphone', desc: 'Pemasaran Digital, Agency Kreatif Purwokerto' },
  { id: 'desain-interior', name: 'Desain Interior', icon: 'home', desc: 'Interior Nuansa Bambu & Kafe Kreatif' },
  { id: 'tv-radio', name: 'Televisi & Radio', icon: 'radio', desc: 'Broadcasting Budaya Banyumasan & Podcast' },
  { id: 'ekraf-unggulan', name: 'Sektor Unggulan Kota', icon: 'award', desc: 'Kombinasi Wisata & Sentra Kreatif Menara Teratai' }
];

// Data Awal (Seed Data)
const INITIAL_UMKM = [
  {
    id: 'umkm-1',
    name: 'Sentra Mendoan Asli Sawangan No. 1',
    owner: 'H. Sudiro & Keluarga',
    category: 'kuliner',
    categoryName: 'Kuliner Banyumasan',
    description: 'Pelopor mendoan hangat khas Purwokerto dengan kedelai pilihan, daun bawang segar, dan sambal kecap pedas gurih legendaris sejak tahun 1978. Melayani oleh-oleh mentah siap goreng.',
    address: 'Jl. Mayjen Sutoyo No. 21, Sawangan, Purwokerto Barat, Banyumas',
    mapsUrl: 'https://maps.google.com/?q=Sawangan+Purwokerto',
    whatsapp: '6281226789001',
    instagram: '@mendoan_sawangan_pwt',
    website: 'https://mendoansawangan.id',
    image: 'assets/images/mendoan_asli.jpg',
    openingHours: '07:00 - 22:00 WIB',
    status: 'Terverifikasi',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 1420
  },
  {
    id: 'umkm-2',
    name: 'Batik Tulis Banyumasan Hadipriyanto',
    owner: 'Ki Hadipriyanto',
    category: 'fashion',
    categoryName: 'Fashion & Batik',
    description: 'Pusat pelestarian batik tulis otentik Banyumas dengan motif ikonik Jahe Srimpang, Lumbon, Sekar Bakung, dan Jonasan. Menggunakan pewarna alami ramah lingkungan dengan sentuhan modern.',
    address: 'Jl. Mruyung No. 46, Sudagaran, Banyumas (Kawasan Kota Lama)',
    mapsUrl: 'https://maps.google.com/?q=Batik+Hadipriyanto+Banyumas',
    whatsapp: '6281327112233',
    instagram: '@batik_hadipriyanto',
    website: 'https://batikbanyumasan.com',
    image: 'assets/images/purwokerto_batik.jpg',
    openingHours: '08:00 - 17:00 WIB',
    status: 'Terverifikasi',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 860
  },
  {
    id: 'umkm-3',
    name: 'Getuk Goreng Asli H. Tohirin Sokaraja',
    owner: 'Hj. Warsiti Tohirin',
    category: 'kuliner',
    categoryName: 'Kuliner Banyumasan',
    description: 'Getuk goreng singkong asli gula kelapa murni khas Sokaraja dengan cita rasa legit, manis alami, dan wangi khas besek bambu. Oleh-oleh wajib pelancong Purwokerto.',
    address: 'Jl. Jenderal Soedirman No. 151, Sokaraja Tengah, Banyumas',
    mapsUrl: 'https://maps.google.com/?q=Getuk+Goreng+H+Tohirin+Sokaraja',
    whatsapp: '628112610998',
    instagram: '@getukgoreng_tohirin_asli',
    website: 'https://getuktohirin.co.id',
    image: 'assets/images/getuk_goreng_asli.jpg',
    openingHours: '06:30 - 21:30 WIB',
    status: 'Terverifikasi',
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 2310
  },
  {
    id: 'umkm-4',
    name: 'Kopi Robusta Lereng Slamet Limpakuwus',
    owner: 'Bintang & Kelompok Tani Limpakuwus',
    category: 'kuliner',
    categoryName: 'Kuliner Banyumasan',
    description: 'Biji kopi robusta dan arabika pilihan hasil budidaya petani lokal kaki Gunung Slamet ketinggian 800-1100 mdpl dengan profil rasa earthy, caramel hints, dan aroma sejuk pinus.',
    address: 'Kawasan Hutan Pinus Limpakuwus, Sumbang, Baturraden, Banyumas',
    mapsUrl: 'https://maps.google.com/?q=Limpakuwus+Baturraden',
    whatsapp: '6285741889922',
    instagram: '@kopisatria_limpakuwus',
    website: 'https://kopisatria.id',
    image: 'assets/images/kopi_limpakuwus.jpg',
    openingHours: '09:00 - 18:00 WIB',
    status: 'Terverifikasi',
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 512
  },
  {
    id: 'umkm-5',
    name: 'Sanggar Seni Kenthongan Satria Piningit',
    owner: 'Kang Warsito S.Sn',
    category: 'seni-pertunjukan',
    categoryName: 'Seni Pertunjukan',
    description: 'Paguyuban musisi tradisional dan pengrajin alat musik kenthongan bambu wulung serta tari Ebeg Banyumasan. Menyediakan pertunjukan budaya, les tabuh kenthongan, serta penjualan instrumen.',
    address: 'Jl. Gerilya Barat No. 88, Tanjung, Purwokerto Selatan',
    mapsUrl: 'https://maps.google.com/?q=Purwokerto+Selatan',
    whatsapp: '6282245678901',
    instagram: '@kenthongan_satria_banyumas',
    website: 'https://kenthonganbanyumas.org',
    image: 'assets/images/kenthongan_ebeg.jpg',
    openingHours: '10:00 - 21:00 WIB',
    status: 'Terverifikasi',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 340
  },
  {
    id: 'umkm-6',
    name: 'Sandal Bandol (Ban Bodol) Kreatif Karangklesem',
    owner: 'Pak Sukirno',
    category: 'kriya',
    categoryName: 'Kriya & Kerajinan',
    description: 'Sentra kerajinan daur ulang ban bekas menjadi sandal kasual, sepatu santai, dan pot tanaman berdaya tahan puluhan tahun. Produk ramah lingkungan khas Banyumas.',
    address: 'Jl. Yos Sudarso No. 42, Karangklesem, Purwokerto Selatan',
    mapsUrl: 'https://maps.google.com/?q=Karangklesem+Purwokerto',
    whatsapp: '6285890123456',
    instagram: '@sandalbandol_pwt',
    website: '',
    image: 'assets/images/sandal_bandol.jpg',
    openingHours: '08:00 - 17:00 WIB',
    status: 'Terverifikasi',
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 215
  },
  {
    id: 'umkm-7',
    name: 'Studio Animasi & Ilustrasi Raden Mas Creative',
    owner: 'Dimas Satrio (Creative Lead)',
    category: 'film-animasi',
    categoryName: 'Film & Animasi',
    description: 'Studio digital pembuat intellectual property karakter satria lokal Banyumas, komik strip dialek Banyumasan, dan jasa animasi komersial 2D/3D untuk brand nasional.',
    address: 'Creative Hub Menara Teratai Lt. 2, Jl. Bung Karno, Purwokerto',
    mapsUrl: 'https://maps.google.com/?q=Menara+Pandang+Teratai+Purwokerto',
    whatsapp: '6281399887766',
    instagram: '@radenmas_studio',
    website: 'https://radenmascreative.com',
    image: 'assets/images/studio_animasi.jpg',
    openingHours: '09:00 - 18:00 WIB',
    status: 'Terverifikasi',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 180
  },
  {
    id: 'umkm-8',
    name: 'Dablongan Clothing Banyumasan',
    owner: 'Agus & Komunitas Kreatif Kaos Banyumas',
    category: 'fashion',
    categoryName: 'Fashion & Batik',
    description: 'Distro fesyen lokal dengan tema kata-kata unik dialek "Ngapak" Banyumas yang jenaka, cerdas, dan membanggakan identitas wong Banyumas.',
    address: 'Jl. Supriyadi No. 12, Purwokerto Wetan',
    mapsUrl: 'https://maps.google.com/?q=Purwokerto+Wetan',
    whatsapp: '6281234567899',
    instagram: '@dablongan_clothing_pwt',
    website: 'https://dablongan.com',
    image: 'assets/images/dablongan_kaos.jpg',
    openingHours: '09:30 - 21:00 WIB',
    status: 'Terverifikasi',
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 640
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    umkmId: 'umkm-1',
    name: 'Paket Mendoan Mentah & Sambal Kecap Pedas (Isi 15 Lembar)',
    price: 35000,
    category: 'Kuliner',
    image: 'assets/images/mendoan_asli.jpg',
    description: 'Tempe mendoan kedelai lembaran tipis khusus lengkap dengan racikan tepung bumbu dan sambal kecap manis cabe rawit asli.',
    stock: 120,
    sold: 1450,
    unit: 'Paket'
  },
  {
    id: 'prod-2',
    umkmId: 'umkm-2',
    name: 'Kain Batik Tulis Klasik Motif Lumbon Banyumas (2x1.15m)',
    price: 475000,
    category: 'Fashion & Kriya',
    image: 'assets/images/purwokerto_batik.jpg',
    description: 'Batik tulis premium katun primissima dengan filosofi kesuburan daun lumbu/keladi khas masyarakat lembah Serayu.',
    stock: 15,
    sold: 89,
    unit: 'Lembar'
  },
  {
    id: 'prod-3',
    umkmId: 'umkm-3',
    name: 'Getuk Goreng Asli H. Tohirin Box Besek Bambu 1 Kg',
    price: 45000,
    category: 'Kuliner',
    image: 'assets/images/getuk_goreng_asli.jpg',
    description: 'Getuk singkong legit digoreng renyah di luar lembut di dalam dengan kemasan tradisional besek bambu harum.',
    stock: 90,
    sold: 3100,
    unit: 'Kotak'
  },
  {
    id: 'prod-4',
    umkmId: 'umkm-4',
    name: 'Kopi Robusta Limpakuwus Baturraden 250g (Fine Roast)',
    price: 65000,
    category: 'Kuliner',
    image: 'assets/images/kopi_limpakuwus.jpg',
    description: 'Bubuk / biji kopi single origin lereng gunung Slamet dengan notes cokelat pekat dan aroma rempah kayu manis.',
    stock: 45,
    sold: 430,
    unit: 'Pouch'
  },
  {
    id: 'prod-5',
    umkmId: 'umkm-5',
    name: 'Miniatur Kenthongan Bambu Wulung Ukir Satria',
    price: 85000,
    category: 'Kriya & Musik',
    image: 'assets/images/kenthongan_ebeg.jpg',
    description: 'Kerajinan kenthongan kayu bambu wulung fungsional dengan suara nyaring bernada pentatonis Banyumasan.',
    stock: 30,
    sold: 175,
    unit: 'Pcs'
  },
  {
    id: 'prod-6',
    umkmId: 'umkm-6',
    name: 'Sandal Bandol Gunung Edisi Satria Banyumas',
    price: 60000,
    category: 'Fashion & Kriya',
    image: 'assets/images/sandal_bandol.jpg',
    description: 'Sandal outdoor sol ban truk bekas kuat anti selip, nyaman untuk tracking Baturraden dan jalan santai harian.',
    stock: 60,
    sold: 520,
    unit: 'Pasang'
  },
  {
    id: 'prod-7',
    umkmId: 'umkm-8',
    name: 'Kaos Distro Dablongan "Asli Ngapak Wong Banyumas"',
    price: 95000,
    category: 'Fashion & Batik',
    image: 'assets/images/dablongan_kaos.jpg',
    description: 'Kaos katun combed 30s premium dengan sablon plastisol grafis maskot Satria Banyumas dan slogan bahasa Ngapak.',
    stock: 75,
    sold: 840,
    unit: 'Pcs'
  }
];

const INITIAL_EVENTS = [
  {
    id: 'event-1',
    title: 'Festival Ekonomi Kreatif Purwokerto 2026',
    date: '20 - 22 September 2026',
    dateISO: '2026-09-20',
    time: '09:00 - 22:00 WIB',
    location: 'Plaza & Menara Pandang Teratai, Jl. Bung Karno, Purwokerto',
    category: 'Festival & Expo Ekraf',
    image: 'assets/images/purwokerto_festival.jpg',
    description: 'Pesta akbar pelaku kreatif se-Banyumas Raya! Menghadirkan pameran 100+ booth UMKM inovatif, pertunjukan musik kenthongan kontemporer, workshop DKV, parade busana batik banyumasan, dan kompetisi startup.',
    organizer: 'Dinas Pemuda, Olahraga, Kebudayaan & Pariwisata Kab. Banyumas',
    price: 'Gratis untuk Umum',
    status: 'Mendatang',
    quota: 5000,
    registered: 3120
  },
  {
    id: 'event-2',
    title: 'Banyumas Extravaganza & Parade Kenthongan Akbar 2026',
    date: '14 Oktober 2026',
    dateISO: '2026-10-14',
    time: '19:00 - 23:30 WIB',
    location: 'Rute Jl. Jend. Soedirman menuju Alun-Alun Purwokerto',
    category: 'Seni Pertunjukan',
    image: 'assets/images/kenthongan_ebeg.jpg',
    description: 'Karnaval budaya spektakuler malam hari menampilkan 27 grup kenthongan terbaik dengan kostum cahaya artistik, tarian ebeg massal, dan mobil hias kreatif.',
    organizer: 'Komunitas Seni Satria Banyumas',
    price: 'Gratis',
    status: 'Mendatang',
    quota: 10000,
    registered: 7400
  },
  {
    id: 'event-3',
    title: 'Purwokerto Creative Talkshow & Business Matching UMKM',
    date: '05 November 2026',
    dateISO: '2026-11-05',
    time: '08:30 - 16:00 WIB',
    location: 'Auditorium Sasana Krida GOR Satria Purwokerto',
    category: 'Workshop & Bisnis',
    image: 'assets/images/studio_animasi.jpg',
    description: 'Pertemuan pelaku ekonomi kreatif dengan investor, perbankan, dan kurator marketplace nasional. Sesi pendampingan legalitas NIB, HKI Merek, dan strategi ekspor.',
    organizer: 'Forum Ekraf Banyumas & Bank Indonesia Purwokerto',
    price: 'Registrasi Online (Free Snack & E-Sertifikat)',
    status: 'Mendatang',
    quota: 400,
    registered: 365
  }
];

const INITIAL_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Menara Pandang Teratai Purwokerto',
    category: 'Landmark & Ruang Kreatif',
    location: 'Kawasan Jl. Bung Karno, Purwokerto Selatan',
    image: 'assets/images/purwokerto_hero_bg.jpg',
    description: 'Menara observasi setinggi 117 meter dengan mahkota bunga teratai bercahaya. Memiliki jembatan kaca di ketinggian, amphiteater terbuka, dan pusat kreatif terpadu.',
    highlights: ['Jembatan Kaca 360 Derajat', 'Sentra Kuliner Ekraf', 'Spot Sunset Gunung Slamet', 'Area Terbuka Hijau']
  },
  {
    id: 'dest-2',
    name: 'Lokawisata Baturraden & Taman Botani',
    category: 'Wisata Alam & Kesejukan',
    location: 'Lereng Gunung Slamet, Kec. Baturraden, Banyumas',
    image: 'assets/images/baturraden_asli.jpg',
    description: 'Destinasi ikonik pegunungan dengan hawa sejuk, air terjun alami, kolam air panas belerang, dan sentra kuliner sate kelinci & mendoan hangat.',
    highlights: ['Pemandangan Lembah Hijau', 'Pemandian Air Panas', 'Kuliner Lereng Slamet', 'Spot Foto Instagramable']
  },
  {
    id: 'dest-3',
    name: 'Kawasan Kota Lama Banyumas & Desa Wisata Sudagaran',
    category: 'Heritage & Sentra Batik Tulis',
    location: 'Kecamatan Banyumas, Kab. Banyumas',
    image: 'assets/images/kotalama_banyumas.jpg',
    description: 'Pusat sejarah Banyumas tempo doeloe dengan arsitektur kolonial, kelenteng kuno Boen Tek Bio, dan sentra perajin batik tulis Banyumasan tradisional.',
    highlights: ['Rumah Pusaka Kolonial', 'Workshop Membatik Tulis', 'Wisata Kuliner Tradisional', 'Sejarah Kadipaten Banyumas']
  },
  {
    id: 'dest-4',
    name: 'Taman Rekreasi Andhang Pangrenan Purwokerto',
    category: 'Taman Kota & Panggung Seni',
    location: 'Jl. Gerilya, Karangklesem, Purwokerto Selatan',
    image: 'assets/images/andhang_pangrenan.jpg',
    description: 'Taman rekreasi ruang terbuka hijau perkotaan dengan amfiteater kreatif, taman bunga asri, jogging track, dan panggung pertunjukan seni komunitas rakyat.',
    highlights: ['Panggung Amfiteater Terbuka', 'Taman Bunga Asri', 'Wahana Ramah Anak', 'Latar Pemandangan Gunung Slamet']
  }
];

const INITIAL_NEWS = [
  {
    id: 'news-1',
    title: 'Menara Pandang Teratai Jadi Episentrum Kebangkitan Ekonomi Kreatif Banyumas 2026',
    date: '28 Agustus 2026',
    author: 'Tim Redaksi Ekraf Purwokerto',
    category: 'Ekraf News',
    image: 'assets/images/purwokerto_hero_bg.jpg',
    summary: 'Kawasan Jl. Bung Karno dan Menara Teratai Purwokerto kini resmi bertransformasi menjadi koridor ekonomi kreatif terpadu yang memadukan pariwisata modern dengan 17 subsektor ekraf.',
    content: `
      <p>Kawasan Jalan Bung Karno kini menjadi magnet baru bagi warga Purwokerto dan wisatawan mancanegara. Berdirinya Menara Pandang Teratai setinggi 117 meter bukan sekadar ikon visual kota, melainkan pusat inkubasi karya anak muda Banyumas.</p>
      <h4>Dukungan Ruang Kreatif Terpadu</h4>
      <p>Pemerintah Daerah bersama Komunitas Kreatif telah menyiapkan plaza pertunjukan seni, pameran berkala kriya dan batik, hingga stan khusus kuliner mendoan dan kopi robusta lereng Slamet.</p>
      <blockquote>"Purwokerto memiliki talenta kreatif yang luar biasa. Dengan adanya wadah terintegrasi ini, pelaku UMKM tidak lagi jalan sendiri-sendiri, melainkan saling menopang dalam ekosistem digital yang kokoh," ujar Bintang, Koordinator Tim Pengembang Ekraf Purwokerto.</blockquote>
      <p>Diharapkan pada gelaran Festival Ekonomi Kreatif mendatang, lebih dari 500 pelaku usaha mikro dapat terhubung dengan akses permodalan dan pasar ekspor.</p>
    `
  },
  {
    id: 'news-2',
    title: 'Digitalisasi UMKM Banyumas: Akses Mudah Lewat Dashboard CMS Terpadu Tanpa Perlu Coding',
    date: '25 Agustus 2026',
    author: 'Bintang (Inovator Digital)',
    category: 'Teknologi & UMKM',
    image: 'assets/images/studio_animasi.jpg',
    summary: 'Sistem CMS mutakhir diluncurkan khusus bagi para pengelola dan pelaku usaha Purwokerto agar bisa mandiri memperbarui katalog produk, berita, dan jadwal event semudah mengoperasikan blog.',
    content: `
      <p>Sering kali pelaku UMKM terkendala teknologi ketika ingin memperbarui data produk atau promo mereka di aplikasi publik. Mengadopsi filosofi kesederhanaan seperti platform Blogspot dan Hostinger, aplikasi EKRAF Purwokerto memperkenalkan sistem manajemen konten mandiri.</p>
      <h4>Keuntungan Sistem Mandiri</h4>
      <ul>
        <li><strong>Tanpa Sentuh Koding:</strong> Pemilik toko cukup mengisi form sederhana dari smartphone atau laptop.</li>
        <li><strong>Sinkronisasi Real-Time:</strong> Data baru otomatis tampil di hadapan ribuan calon pembeli.</li>
        <li><strong>Dukungan Modul Interaktif:</strong> Modul tiket, berita, hingga katalog dapat diaktifkan sesuai kesiapan usaha.</li>
      </ul>
      <p>Dengan terobosan ini, ratusan pelaku usaha dari Sokaraja hingga Baturraden siap bersaing di era digital modern.</p>
    `
  },
  {
    id: 'news-3',
    title: 'Geliat Batik Tulis Banyumasan: Eksplorasi Motif Jahe Srimpang di Kancah Nasional',
    date: '20 Agustus 2026',
    author: 'Siti Rahmawati (Kurator Kriya)',
    category: 'Kriya & Budaya',
    image: 'assets/images/purwokerto_batik.jpg',
    summary: 'Kekhasan warna soga gelap dan goresan tegas motif lumbon dan jahe srimpang kembali mencuri perhatian desainer kenamaan ibu kota dalam parade busana etnik nusantara.',
    content: `
      <p>Batik Banyumasan memiliki kepribadian yang jujur, tegas, dan bersahaja sebagaimana watak orang Banyumas (Banyumasan cablaka). Tidak seperti motif pesisiran yang penuh warna cerah mentereng, batik Banyumas mempertahankan keanggunan warna tanah, hitam, dan indigo alami.</p>
      <p>Sentra batik di Desa Sudagaran kini terus membina generasi muda pembatik agar tradisi canting ini tidak punah, dipadukan dengan teknik pemasaran digital modern lewat direktori EKRAF Purwokerto.</p>
    `
  },
  {
    id: 'news-4',
    title: 'Legit Manisnya Getuk Goreng Sokaraja: Cita Rasa Asli Warisan Nenek Moyang di Dalam Besek Bambu',
    date: '18 Agustus 2026',
    author: 'Ahmad Fauzi (Jurnalis Kuliner)',
    category: 'Kuliner Tradisional',
    image: 'assets/images/getuk_goreng_asli.jpg',
    summary: 'Dari singkong pilihan dan gula kelapa murni, Getuk Goreng H. Tohirin Sokaraja membuktikan daya pikat kuliner otentik Banyumas tak lekang oleh zaman.',
    content: `
      <p>Aroma manis legit langsung tercium saat membuka kemasan besek bambu khas getuk goreng Sokaraja. Kudapan yang lahir sejak era 1918 ini mulanya adalah getuk basah biasa yang kemudian digoreng agar lebih tahan lama, hingga menjelma menjadi ikon kuliner terpopuler di Banyumas Raya.</p>
      <p>Kini dengan kehadiran portal EKRAF Purwokerto, wisatawan dapat langsung memesan paket getuk goreng fresh dari wajan penggorengan langsung ke hotel penginapan atau dikirim ke luar kota.</p>
    `
  },
  {
    id: 'news-5',
    title: 'Sensasi Menikmati Kopi Robusta Lereng Slamet di Tengah Keasrian Hutan Pinus Limpakuwus',
    date: '15 Agustus 2026',
    author: 'Indra Gunawan',
    category: 'Kuliner & Wisata',
    image: 'assets/images/kopi_limpakuwus.jpg',
    summary: 'Kafe kopi berkonsep alam terbuka di Baturraden menghadirkan seduhan biji kopi lokal hasil panen petani Gunung Slamet yang nikmat berpadu hawa pegunungan.',
    content: `
      <p>Menyeruput secangkir kopi robusta hangat di bawah rimbunnya pohon pinus Limpakuwus Baturraden memberikan ketenangan tersendiri bagi penikmat kopi. Dikelola oleh pemuda kreatif bersama kelompok tani lokal, kedai ini membuktikan potensi subsektor kuliner dan pariwisata Purwokerto dapat tumbuh beriringan.</p>
    `
  }
];

// Data Modul Aplikasi (ala "App Store" kecil sesuai PDF Halaman 7-8)
const INITIAL_MODULES = [
  { id: 'direktori_umkm', name: 'Direktori & Profil UMKM', desc: 'Katalog pelaku usaha kreatif dan peta lokasi', active: true, required: true },
  { id: 'berita', name: 'Ruang Berita & Pengumuman', desc: 'Sistem publikasi artikel dan info resmi Ekraf', active: true, required: false },
  { id: 'event', name: 'Kalender Event & Festival', desc: 'Agenda kegiatan seni budaya dan pameran kota', active: true, required: false },
  { id: 'destinasi', name: 'Destinasi & Wisata Kreatif', desc: 'Panduan landmark dan sentra kerajinan Purwokerto', active: true, required: false },
  { id: 'marketplace', name: 'Katalog Produk & WA Order', desc: 'Pajangan etalase produk dengan tombol pesan langsung', active: true, required: false },
  { id: 'tiket_event', name: 'Sistem Tiket Event Online', desc: 'Registrasi peserta dan tiket elektronik kegiatan', active: false, required: false },
  { id: 'pembayaran', name: 'Gerbang Pembayaran Digital (QRIS)', desc: 'Integrasi transaksi daring UMKM', active: false, required: false },
  { id: 'statistik', name: 'Statistik & Analitik Kunjungan', desc: 'Laporan visual traffic pengunjung dan prospek usaha', active: true, required: false }
];

// Repository Manager Helper
class EkrafDataStore {
  constructor() {
    this.init();
  }

  init() {
    const DATA_VERSION = 'v2_real_purwokerto_images';
    if (!localStorage.getItem(STORAGE_KEYS.UMKM) || localStorage.getItem('ekraf_data_version') !== DATA_VERSION) {
      this.resetToDefaults();
      localStorage.setItem('ekraf_data_version', DATA_VERSION);
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(INITIAL_UMKM));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_DESTINATIONS));
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'admin'); // default admin for initial review
    localStorage.setItem('ekraf_data_version', 'v2_real_purwokerto_images');
    this.triggerUpdate('all');
  }

  triggerUpdate(type) {
    window.dispatchEvent(new CustomEvent('ekraf_data_changed', { detail: { type } }));
  }

  // UMKM CRUD
  getUMKM() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.UMKM)) || INITIAL_UMKM;
    } catch (e) {
      return INITIAL_UMKM;
    }
  }

  saveUMKM(data) {
    const list = this.getUMKM();
    if (data.id) {
      const idx = list.findIndex(item => item.id === data.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
      } else {
        list.unshift(data);
      }
    } else {
      data.id = 'umkm-' + Date.now();
      list.unshift(data);
    }
    localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(list));
    this.triggerUpdate('umkm');

    // Cloud sync to Supabase if connected
    if (window.EkrafSupabase && window.EkrafSupabase.isConnected) {
      window.EkrafSupabase.saveUMKMToCloud(data);
    }

    return data;
  }

  deleteUMKM(id) {
    let list = this.getUMKM();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(list));
    this.triggerUpdate('umkm');

    // Cloud sync delete to Supabase
    if (window.EkrafSupabase && window.EkrafSupabase.isConnected) {
      window.EkrafSupabase.deleteUMKMFromCloud(id);
    }
  }

  // Products CRUD
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  }

  saveProduct(data) {
    const list = this.getProducts();
    if (data.id) {
      const idx = list.findIndex(p => p.id === data.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
      else list.unshift(data);
    } else {
      data.id = 'prod-' + Date.now();
      list.unshift(data);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    this.triggerUpdate('products');
    return data;
  }

  deleteProduct(id) {
    let list = this.getProducts();
    list = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    this.triggerUpdate('products');
  }

  // Events CRUD
  getEvents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)) || INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  }

  saveEvent(data) {
    const list = this.getEvents();
    if (data.id) {
      const idx = list.findIndex(e => e.id === data.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
      else list.unshift(data);
    } else {
      data.id = 'event-' + Date.now();
      list.unshift(data);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    this.triggerUpdate('events');
    return data;
  }

  deleteEvent(id) {
    let list = this.getEvents();
    list = list.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    this.triggerUpdate('events');
  }

  // News CRUD
  getNews() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWS)) || INITIAL_NEWS;
    } catch (e) {
      return INITIAL_NEWS;
    }
  }

  saveNews(data) {
    const list = this.getNews();
    if (data.id) {
      const idx = list.findIndex(n => n.id === data.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
      else list.unshift(data);
    } else {
      data.id = 'news-' + Date.now();
      list.unshift(data);
    }
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(list));
    this.triggerUpdate('news');

    if (window.EkrafSupabase && window.EkrafSupabase.isConnected) {
      window.EkrafSupabase.saveNewsToCloud(data);
    }

    return data;
  }

  deleteNews(id) {
    let list = this.getNews();
    list = list.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(list));
    this.triggerUpdate('news');

    if (window.EkrafSupabase && window.EkrafSupabase.isConnected) {
      window.EkrafSupabase.deleteNewsFromCloud(id);
    }
  }

  // Destinations CRUD
  getDestinations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) || INITIAL_DESTINATIONS;
    } catch (e) {
      return INITIAL_DESTINATIONS;
    }
  }

  saveDestination(data) {
    const list = this.getDestinations();
    if (data.id) {
      const idx = list.findIndex(d => d.id === data.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
      else list.unshift(data);
    } else {
      data.id = 'dest-' + Date.now();
      list.unshift(data);
    }
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(list));
    this.triggerUpdate('destinations');
    return data;
  }

  deleteDestination(id) {
    let list = this.getDestinations();
    list = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(list));
    this.triggerUpdate('destinations');
  }

  // Modules Config
  getModules() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES)) || INITIAL_MODULES;
    } catch (e) {
      return INITIAL_MODULES;
    }
  }

  toggleModule(id, activeState) {
    const list = this.getModules();
    const target = list.find(m => m.id === id);
    if (target && !target.required) {
      target.active = activeState !== undefined ? activeState : !target.active;
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(list));
      this.triggerUpdate('modules');
    }
    return list;
  }

  // Role Management
  getRole() {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'admin';
  }

  setRole(role) {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    this.triggerUpdate('role');
  }

  // Export Data as JSON
  exportJSON() {
    const backup = {
      umkm: this.getUMKM(),
      products: this.getProducts(),
      events: this.getEvents(),
      destinations: this.getDestinations(),
      news: this.getNews(),
      modules: this.getModules(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.umkm) localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(data.umkm));
      if (data.products) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (data.events) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
      if (data.destinations) localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(data.destinations));
      if (data.news) localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(data.news));
      if (data.modules) localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(data.modules));
      this.triggerUpdate('all');
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  }
}

// Global instance
window.EkrafStore = new EkrafDataStore();
window.EKRAF_CATEGORIES = EKRAF_CATEGORIES;
