# PANDUAN DEPLOYMENT & INTEGRASI RUANGTREN

Dokumentasi resmi untuk pemilik portal berita **RUANGTREN** (*Berita Terkini, Informasi Terpercaya*).

---

## 1. PANDUAN AUTENTIKASI GOOGLE OAUTH 2.0 ADMIN

Sistem login admin RUANGTREN menggunakan proteksi ganda:
1. Verifikasi akun Google resmi.
2. Pengecekan whitelist email di sisi server (`ADMIN_EMAILS`).

### Menghubungkan Google Cloud Console:
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru bernama **RUANGTREN Portal**.
3. Masuk ke menu **APIs & Services** > **OAuth consent screen**.
   - Pilih User Type: **External**.
   - Isi App name: `RUANGTREN`.
   - Masukkan User support email: `yp892149@gmail.com` atau `rullganteng987@gmail.com`.
4. Masuk ke menu **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `RUANGTREN Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (untuk pengujian)
     - `https://domain-anda.com` (domain produksi)
   - **Authorized redirect URIs**:
     - `http://localhost:3000`
     - `https://domain-anda.com`
5. Salin **Client ID** yang dihasilkan dan pasang di konfigurasi aplikasi Anda.
6. Server RUANGTREN secara ketat hanya mengizinkan alamat yang terdaftar di `ADMIN_EMAILS` (secara default: `yp892149@gmail.com` dan `rullganteng987@gmail.com`).

---

## 2. PANDUAN GOOGLE SEARCH CONSOLE & SEO

RUANGTREN telah dilengkapi seluruh arsitektur teknis agar setiap berita langsung dirayapi (*crawled*) dan diindeks oleh Google:
- **Dynamic XML Sitemap**: `https://domain-anda.com/sitemap.xml` (otomatis memperbarui tautan setiap ada berita baru).
- **Robots.txt**: `https://domain-anda.com/robots.txt`
- **RSS Feed 2.0**: `https://domain-anda.com/feed.xml`
- **Schema.org NewsArticle**: Otomatis tertanam dalam format JSON-LD di setiap artikel.

### Cara Mendaftarkan ke Google Search Console:
1. Buka [Google Search Console](https://search.google.com/search-console).
2. Tambahkan properti dengan memasukkan alamat domain Anda (misal: `https://ruangtren.com`).
3. Pilih metode verifikasi (melalui DNS TXT record atau file HTML).
4. Setelah diverifikasi, klik menu **Peta Situs (Sitemaps)** pada bilah kiri.
5. Masukkan URL: `sitemap.xml` lalu klik **Kirim**.
6. Google Search akan mulai merayapi seluruh artikel berita yang Anda terbitkan.

---

## 3. PANDUAN MONETISASI GOOGLE ADSENSE

RUANGTREN dirancang khusus agar lolos tinjauan Google AdSense:
- **Halaman Regulasi Wajib**:
  - *Pedoman Pemberitaan Media Siber* (`/halaman/pedoman-media-siber`)
  - *Kebijakan Privasi (Privacy Policy)* (`/halaman/kebijakan-privasi`)
  - *Sanggahan (Disclaimer)* (`/halaman/disclaimer`)
  - *Tentang Kami* (`/halaman/tentang-kami`)
  - *Susunan Dewan Redaksi* (`/halaman/susunan-redaksi`)
  - *Kontak & Hak Jawab* (`/halaman/kontak`)
- **Penyajian ads.txt Otomatis**: Diakses di `https://domain-anda.com/ads.txt`.

### Langkah Pengajuan AdSense:
1. Terbitkan minimal 15–20 berita orisinal melalui Dashboard Admin.
2. Buka [Google AdSense](https://adsense.google.com/) dan daftarkan situs Anda.
3. Buka tab **Google AdSense** di Dashboard CMS RUANGTREN.
4. Masukkan **Publisher ID** Anda (contoh: `ca-pub-1234567890123456`).
5. Perbarui baris kode `ads.txt` sesuai instruksi Google AdSense.
6. Klik **Simpan AdSense**. Seluruh 5 unit iklan strategis akan langsung aktif.

---

## 4. PANDUAN DEPLOYMENT KE CLOUDFLARE (D1 & PAGES)

Website ini dapat dipindahkan dan di-deploy ke Cloudflare secara penuh:

### Langkah 1: Siapkan Cloudflare Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### Langkah 2: Buat Database Cloudflare D1
```bash
npx wrangler d1 create ruangtren-db
```
Catat `database_id` yang ditampilkan, lalu masukkan ke file `wrangler.toml`.

### Langkah 3: Eksekusi Migrasi Database D1
Anda dapat mengunduh file `.sql` langsung dari tombol **"Unduh .SQL D1"** di Dashboard Admin RUANGTREN, lalu jalankan:
```bash
npx wrangler d1 execute ruangtren-db --file=ruangtren_cloudflare_d1_backup.sql
```

### Langkah 4: Build & Deploy
```bash
npm run build
npx wrangler deploy
```

---

## 5. FITUR UTAMA KENDALI MANDIRI ADMIN

Sebagai pemilik RUANGTREN, Anda dapat:
- Menulis artikel berita tanpa batasan kuota.
- Menggunakan Visual Editor (seperti Blogger) atau beralih ke HTML Source Editor.
- Mengunggah foto dan menyematkan video YouTube.
- Mengubah Nama Portal, Tagline, dan Teks Berita Berjalan (*Breaking News*).
- Menambah dan menghapus kategori berita.
- Mengaktifkan dan menonaktifkan slot iklan Google AdSense sewaktu-waktu.
- Menambahkan alamat email administrator tambahan sesuai kebutuhan.
