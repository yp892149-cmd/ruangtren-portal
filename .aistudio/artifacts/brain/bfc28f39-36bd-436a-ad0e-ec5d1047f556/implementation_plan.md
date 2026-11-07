# RUANGTREN — Portal Berita Digital Siap Monetisasi Google AdSense & CMS Mandiri

Portal berita digital modern berstandar media nasional (Kompas.com & CNN Indonesia) dengan sistem pengelolaan konten mandiri dan **arsitektur khusus yang dirancang 100% siap untuk disetujui (*AdSense Approval*) dan menghasilkan pendapatan dari Google AdSense**: dilengkapi 5 slot iklan berpenghasilan tinggi (*high-CTR*), penyajian otomatis file `ads.txt`, kepatuhan halaman hukum & pers (*Privacy Policy, Disclaimer, Pedoman Siber*), serta dashboard manajemen monetisasi praktis bagi Anda sebagai pemilik tunggal.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Fokus Utama: Kesiapan Mendapatkan Penghasilan dari Google AdSense**:
> - **Kepatuhan Mutlak Persyaratan Google AdSense**: Portal dilengkapi seluruh halaman wajib kelayakan AdSense (Kebijakan Privasi, Disclaimer, Pedoman Media Siber, Tentang Kami, Susunan Redaksi, Kontak), navigasi yang jelas tanpa jebakan klik (*no invalid traffic*), konten artikel orisinal dengan halaman unik, serta rasio konten terhadap iklan yang seimbang sesuai *Better Ads Standards*.
> - **Integrasi Otomatis Skrip & File `ads.txt`**: Server menyajikan `ads.txt` langsung di root domain (`/ads.txt`) yang dapat diedit langsung dari dashboard admin, serta menginjeksi kode script AdSense resmi Google (`ca-pub-xxxxxxxxxx`) ke dalam `<head>`.
> - **5 Titik Penempatan Iklan Berpenghasilan Tinggi**:
>   1. *Header Leaderboard Ad* (banner atas responsif 728x90)
>   2. *Sidebar Sticky Ad* (300x250 / 300x600 display banner)
>   3. *In-Article Native Ad* (iklan di tengah paragraf artikel pembaca)
>   4. *Bottom Article Multiplex Ad* (iklan rekomendasi di akhir bacaan)
>   5. *Between-Feed Ad* (iklan selingan di antara daftar berita terbaru)
> - **Panel Kontrol Monetisasi di Dashboard**: Anda dapat memasukkan Publisher ID Anda, mengaktifkan/menonaktifkan masing-masing slot iklan, mengaktifkan Google Auto Ads (Iklan Otomatis), serta melihat panduan langkah demi langkah pendaftaran AdSense dalam Bahasa Indonesia.
> - **Autentikasi Admin & Kendali Mandiri**: Login eksklusif via Google untuk `yp892149@gmail.com` dan `rullganteng987@gmail.com` dengan kemampuan mengatur identitas web, menu, artikel tanpa batas, dan ekspor database ke Cloudflare D1.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Portal Berita Publik (RUANGTREN)**: Menghadirkan berita terpercaya dengan tampilan bersih, cepat (*Core Web Vitals* optimal), dan teroptimasi untuk menarik kunjungan organik dari Google Search. Setiap pengunjung yang membaca artikel akan melihat tayangan iklan Google AdSense yang relevan sehingga menghasilkan pendapatan (*Ad Revenue*) bagi Anda.
  2. **Mesin Monetisasi AdSense Terintegrasi**:
     - Sistem penyajian unit iklan Google AdSense responsif yang menyesuaikan ukuran layar (ponsel pintar, tablet, laptop).
     - Rute khusus `/ads.txt` yang langsung aktif untuk mencegah peringatan *"Earnings at risk"* dari Google AdSense.
     - Pratinjau slot iklan (*Ad Preview Mode*) di dashboard sehingga Anda dapat memastikan penempatan iklan terlihat rapi dan elegan sebelum disetujui Google.
  3. **Pusat Kendali Admin Mandiri (CMS Studio)**:
     - Kelola artikel berita tanpa batasan jumlah dengan URL mandiri (`/berita/slug-artikel`).
     - Editor Visual (Blogger style) & Editor HTML untuk penulisan artikel berkualitas tinggi (syarat utama disetujui Google AdSense).
     - Modul pengaturan mandiri: Ganti nama, tagline, breaking news, menu navigasi, halaman redaksi, dan kelola slot iklan.
- **Target Audience / Persona**:
  - Anda sebagai pemilik media digital yang ingin membangun aset portal berita profesional dan memperoleh penghasilan pasif berkelanjutan dari Google AdSense.
  - Pembaca berita Indonesia yang menginginkan portal berita cepat, kredibel, dan nyaman dibaca tanpa iklan pop-up yang mengganggu.
- **Key Value**: Memberikan seluruh infrastruktur teknis yang dipersyaratkan Google AdSense secara siap pakai, sehingga peluang persetujuan (*approval*) akun dan situs Anda menjadi maksimal.

---

### 2. User Experience & Visual Design

#### Tata Letak Strategis Slot Iklan Google AdSense (Publik)
1. **Halaman Depan (Homepage)**:
   - *Top Leaderboard Slot*: Terletak tepat di bawah navigasi utama sebelum Headline Berita. Menangkap impresi pertama pengunjung.
   - *Between-Feed Slot*: Terletak secara natural di antara kartu berita terbaru kolom utama.
   - *Sidebar Half-Page Slot*: Terletak di sisi kanan kolom Berita Populer.
2. **Halaman Artikel Tunggal (`/berita/:slug`)**:
   - *Top Article Slot*: Di bawah judul dan metadata penulis sebelum gambar utama.
   - *In-Article Native Unit*: Menyatu di tengah konten bacaan (setelah paragraf ke-3), memberikan rasio klik (*Click-Through Rate / CTR*) tertinggi tanpa merusak pengalaman membaca.
   - *Bottom Article Multiplex*: Muncul setelah akhir artikel sebelum kolom rekomendasi berita terkait.
3. **Desain Ramah Pembaca & Kebijakan Google**:
   - Setiap slot iklan memiliki label resmi penanda iklan yang tenang: *"Advertisements"* atau *"Iklan"*.
   - Tidak ada pop-up agresif, tidak ada redirect otomatis, dan tidak menutupi tombol navigasi (100% mematuhi Google AdSense Publisher Policies).

#### Panel Kontrol Monetisasi AdSense di Dashboard Admin
- **Status Integrasi AdSense**: Indikator status apakah Publisher ID telah aktif dan file `ads.txt` valid.
- **Form Publisher ID**: Cukup masukkan kode `ca-pub-xxxxxxxxxxxxxxxxx` milik Anda, dan skrip resmi Google akan otomatis tertanam di seluruh halaman.
- **Sakelar Slot Iklan**: Switch On/Off independen untuk kelima lokasi iklan (Header, Sidebar, In-Article, Bottom-Article, Feed).
- **Editor `ads.txt`**: Kolom teks untuk memasukkan baris resmi `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
- **Panduan Sukses AdSense**: Panduan interaktif cara mendaftarkan domain ke Google AdSense, tips agar cepat di-ACC, dan panduan pin verifikasi alamat.

#### Visual Identity & Theme (Gaya Media Nasional)
- **Palette Warna (60-30-10 Rule)**:
  - 60% Putih Bersih (`#FFFFFF`) dan Soft Gray (`#F8FAFC`) untuk latar baca jernih.
  - 30% Tinta Hitam (`#0F172A`) untuk judul berita tajam dan Slate (`#334155`) untuk teks isi.
  - 10% RUANGTREN Navy Blue (`#1E3A8A`) sebagai warna brand wibawa, serta aksen Merah Berita (`#DC2626`) untuk Breaking News.
- **Tipografi**: `Plus Jakarta Sans` berbobot tebal untuk judul headline dengan `text-wrap: balance`, serta ukuran 16px–17px untuk kenyamanan membaca artikel panjang. Format metadata tanpa pill boxes (*zero-pill discipline*).

---

### 3. Key Product Decisions & Trade-Offs

- **Arsitektur Halaman Kepatuhan Hukum & Pers (Google Policy Requirements)**:
  - *Pendekatan*: Secara bawaan menyediakan 6 halaman legalitas lengkap: *Tentang Kami*, *Susunan Redaksi*, *Pedoman Pemberitaan Media Siber*, *Kebijakan Privasi (Privacy Policy)*, *Disclaimer*, dan *Kontak Redaksi*.
  - *Alasan*: Alasan paling sering Google AdSense menolak website baru adalah *"Low Value Content"* atau ketiadaan halaman kebijakan privasi & kontak yang jelas. Penyediaan halaman ini sejak awal memaksimalkan peluang diterimanya website Anda di AdSense.
- **Penyajian Endpoint `/ads.txt` Langsung dari Server**:
  - *Pendekatan*: Express menyajikan respon teks murni berkecepatan tinggi pada URL `https://domain-anda/ads.txt`.
  - *Alasan*: AdSense crawler secara berkala memeriksa file ini. Ketiadaan `ads.txt` menyebabkan penahanan pembayaran atau penurunan pendapatan.
- **Full-Stack Express + SQLite Persisten**:
  - *Pendekatan*: Menyimpan seluruh artikel, kategori, pengaturan situs, dan konfigurasi AdSense di SQLite server lokal, didukung tombol ekspor SQL untuk migrasi Cloudflare D1.
  - *Alasan*: Data tidak hilang, proses rendering sangat cepat (meningkatkan skor kecepatan Google yang disukai pengiklan), dan siap di-deploy ke Cloudflare kapan pun Anda mau.
- **Login Admin Google OAuth Eksklusif**:
  - *Pendekatan*: Validasi ketat untuk `yp892149@gmail.com` dan `rullganteng987@gmail.com` di sisi server.
  - *Alasan*: Menjamin hanya Anda yang dapat menerbitkan berita dan mengelola pendapatan iklan web Anda.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│             RUANGTREN — SISTEM MONETISASI GOOGLE ADSENSE               │
└────────────────────────────────────────────────────────────────────────┘

  [ Google AdSense Crawler / Bot ]             [ Pengunjung Pembaca ]
                 │                                       │
                 ▼                                       ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │                 EXPRESS FULL-STACK SERVER (Port 3000)                │
  │                                                                      │
  │  [ Endpoint Khusus AdSense & SEO ]    [ Halaman Konten & Slot ]      │
  │  • /ads.txt (Disediakan otomatis)     • / (Header & Feed Ad)         │
  │  • /sitemap.xml (Indeks Google)       • /berita/:slug (In-Article    │
  │  • /robots.txt                        │   & Sidebar Ad Units)        │
  │  • /feed.xml (RSS 2.0)                • Halaman Privacy Policy       │
  ├──────────────────────────────────────────────────────────────────────┤
  │                 DASHBOARD ADMIN: KONTROL MONETISASI                  │
  │                                                                      │
  │  • Publisher ID (ca-pub-xxx)          • Slot On/Off Toggles          │
  │  • Live ads.txt Manager               • Panduan Sukses Approval      │
  │  • Kontrol Pengaturan Web Mandiri     • Tulis Berita Tanpa Batas     │
  │  • Ekspor Cloudflare D1 SQL           • Kelola Menu & Kategori       │
  ├──────────────────────────────────────────────────────────────────────┤
  │                 DATABASE PERSISTEN RELASIONAL (SQLite)               │
  │                                                                      │
  │  • ads_config : publisher_id, header_active, sidebar_active,         │
  │                 in_article_active, feed_active, ads_txt_content      │
  │  • articles   : Berita tanpa batas dengan slug & halaman unik        │
  │  • settings   : Identitas web, logo, kontak, menu navigasi           │
  │  • pages      : Kebijakan Privasi, Disclaimer, Pedoman Siber         │
  └──────────────────────────────────────────────────────────────────────┘
```

#### Komponen Monetisasi & Kepatuhan AdSense yang Akan Dibangun:
1. **AdSense Script Injector**: Menambahkan script resmi Google AdSense ke dalam `<head>` saat Publisher ID diisi.
2. **AdSense Slot Component Responsif**:
   - Menampilkan unit iklan responsif asli Google AdSense di 5 posisi strategis.
   - Menyediakan tampilan pratinjau yang rapi (*Ad placeholder/preview*) jika iklan sedang menunggu persetujuan dari Google.
3. **Endpoint Root `/ads.txt`**: Dapat diakses publik dengan HTTP 200 untuk verifikasi Google.
4. **Halaman Kepatuhan Hukum (Policy Pages)**:
   - *Kebijakan Privasi*: Memuat klausul standar cookie periklanan pihak ketiga Google, DART cookie, dan hak pengunjung (wajib Google).
   - *Disclaimer*: Pernyataan pelepasan tanggung jawab konten berita.
   - *Pedoman Media Siber*: Sesuai standar Dewan Pers Indonesia.
   - *Tentang Kami & Kontak*: Alamat redaksi, email kontak, dan susunan tim.
5. **Panel Edukasi & Pengaturan AdSense di Dashboard**:
   - Form input kode AdSense yang mudah dipahami.
   - Panduan cara mengajukan akun AdSense untuk portal berita baru.

---

### Verification Plan

1. **Uji Slot Iklan Google AdSense**:
   - Memasukkan ID AdSense di Dashboard Admin -> Simpan.
   - Memeriksa apakah script AdSense dan elemen slot iklan muncul di Homepage dan Halaman Artikel (`/berita/:slug`).
   - Menguji toggle nonaktifkan slot tertentu dan memverifikasi iklan di slot tersebut menghilang.
2. **Uji Endpoint `/ads.txt`**:
   - Mengakses langsung `http://localhost:3000/ads.txt` di browser.
   - Memastikan baris data penayang AdSense tercetak dengan status HTTP 200.
3. **Uji Kepatuhan Halaman Kebijakan (AdSense Compliance)**:
   - Membuka halaman Kebijakan Privasi, Disclaimer, Pedoman Media Siber, dan Kontak melalui tautan di footer.
   - Memastikan isi halaman lengkap dan siap untuk audit pendaftaran Google AdSense.
4. **Uji Alur Kerja Berita Tanpa Batas**:
   - Menerbitkan artikel berita baru melalui Visual/HTML Editor.
   - Membuka artikel melalui URL mandiri dan memastikan slot iklan in-article berada di posisi yang tepat tanpa mengganggu teks.
5. **Uji Login Google Admin**:
   - Memastikan verifikasi eksklusif untuk akun Anda (`yp892149@gmail.com` / `rullganteng987@gmail.com`).
