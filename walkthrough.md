# Rangkuman & Panduan: Aplikasi EKRAF PURWOKERTO (PWA & Vercel Ready)

Aplikasi **EKRAF PURWOKERTO** telah selesai dibangun secara lengkap sesuai visi dokumen [EKRAF PURWOKERTO.pdf](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/EKRAF%20PURWOKERTO.pdf) dengan spesifikasi yang diminta:
1. **Desain Elegan Diagonal Style**: Memakai geometri sudut dinamis (*angled polygon clip-paths*, *diagonal accent ribbons*, dan kartu beraksen *parallelogram*).
2. **Tema Terang Bercahaya (Bright Luminous Theme)**: Nuansa putih bersih, aksen *Purwokerto Teratai Gold* (`#F59E0B`), *Royal Sapphire Blue* (`#2563EB`), serta *Emerald Green* dengan kontras tajam dan tipografi Google Fonts (*Outfit* & *Plus Jakarta Sans*).
3. **Tombol Berikon**: Setiap tombol dan navigasi dilengkapi ikon modern (SVG), efek *shimmering magic sweep*, dan respon sentuhan/hover yang halus.
4. **Effect Magic**:
   - ✨ *Magic Sparkle Particle Trail* yang mengikuti kursor kustom.
   - 🌟 Refleksi 3D Card Tilt & Specular Shine saat kartu disentuh/di-hover.
   - 🔔 Synthesizer audio chime instan (Web Audio API).
   - 🎉 Burst partikel selebrasi saat menyimpan/menerbitkan data baru.
5. **Dua Mode Terintegrasi**:
   - **Portal Publik**: Menampilkan 17 Subsektor Ekraf, direktori UMKM Banyumas (Mendoan Sawangan, Batik Hadipriyanto, Getuk Goreng Tohirin, Kopi Limpakuwus), katalog produk, kalender festival Menara Teratai 2026, destinasi wisata, artikel warta, dan formulir pendaftaran UMKM mandiri.
   - **Dashboard CMS (Hostinger/Blogspot Style)**: Panel pengelolaan data tanpa koding (metrik live, grafik analitik, CRUD UMKM lengkap sesuai hal. 7 PDF, editor artikel Blogspot dengan bilah format sesuai hal. 5 PDF, dan Modul App Store switch sesuai hal. 7-8 PDF).

---

## 📱 Apakah Bisa Dibuat Jadi App HP dan Dideploy ke Vercel?

**JAWABANNYA: SANGAT BISA!** Bahkan sistemnya sudah **100% PWA-Ready** (Progressive Web App) dan **Vercel-Ready**.

### 1. Cara Deploy ke Vercel (Online dalam 1 Menit)

File konfigurasi [vercel.json](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/vercel.json) dan [package.json](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/package.json) sudah disiapkan di folder proyek.

#### Opsi A: Lewat Vercel CLI (Paling Cepat)
Buka terminal PowerShell di folder proyek ini:
```powershell
npx vercel
```
1. Masuk/Login akun Vercel (bisa via GitHub / Google / Email).
2. Tekan Enter untuk konfirmasi default project settings.
3. Dalam hitungan detik, link website publik Anda akan langsung aktif (contoh: `https://ekraf-purwokerto.vercel.app`).

#### Opsi B: Lewat GitHub ke Vercel Dashboard
1. Buat repository baru di GitHub (misal: `EKRAF_PURWOKERTO`).
2. Push kodingan ini ke GitHub:
   ```powershell
   git add .
   git commit -m "feat: Aplikasi EKRAF Purwokerto PWA & CMS"
   git push origin main
   ```
3. Buka [vercel.com](https://vercel.com) -> Klik **Add New Project** -> Pilih repo GitHub `EKRAF_PURWOKERTO` -> Klik **Deploy**. Selesai!

---

### 2. Cara Menjadikannya Aplikasi di HP (Android & iOS)

Aplikasi ini sudah dilengkapi [manifest.json](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/manifest.json), [sw.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/sw.js), icon Menara Pandang Teratai resolusi tinggi, dan **Mobile Bottom Navigation Bar**:

1. **Di HP Android (Chrome/Edge)**:
   - Buka link Vercel Anda di Chrome HP.
   - Akan muncul tombol hijau **"📱 Pasang di HP"** di bagian atas, atau tap menu titik tiga (⋮) di Chrome lalu pilih **"Tambahkan ke Layar Utama" / "Install Aplikasi"**.
   - Icon Menara Pandang Teratai akan otomatis muncul di layar utama HP Anda dan dapat dibuka fullscreen layaknya aplikasi native dari Google Play Store!
2. **Di iPhone / iPad (Safari iOS)**:
   - Buka link di browser Safari.
   - Tap tombol **Bagikan (Share)** di bagian bawah.
   - Pilih **"Tambah ke Layar Utama" (Add to Home Screen)**.
3. **Jika Ingin Menjadi File `.apk` untuk Play Store**:
   - Anda dapat menggunakan platform gratis seperti [PWABuilder.com](https://www.pwabuilder.com/): Cukup masukkan URL Vercel Anda, klik **Generate APK**, dan file `.apk` siap diinstall langsung di Android!

---

## Struktur Berkas Utama

- [index.html](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/index.html): Halaman utama (Portal Publik + Dashboard CMS + Mobile Bottom Bar).
- [css/style.css](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/css/style.css): Desain sistem tema terang, diagonal geometry, magic effect, dan mobile app experience.
- [js/data.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/data.js): Database lokal komprehensif 17 subsektor ekraf Banyumas & LocalStorage CRUD.
- [js/magic.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/magic.js): Engine efek partikel magic, 3D tilt, dan chime audio.
- [js/app.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/app.js): Logika portal publik, filter 17 subsektor, WhatsApp direct order.
- [js/cms.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/js/cms.js): Logika Dashboard CMS Hostinger/Blogspot style.
- [manifest.json](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/manifest.json) & [sw.js](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/sw.js): Dukungan Progressive Web App & Offline Caching.
- [vercel.json](file:///c:/Users/kiyer/OneDrive/Documents/Project%20Bintang/EKRAF_PURWOKERTO/vercel.json): Konfigurasi instant deployment ke platform cloud Vercel.
