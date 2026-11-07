import fs from 'fs';
import path from 'path';
import { Article, Category, StaticPage, SiteSettings, AdsConfig, TrendingTopic } from '../types/index.ts';

interface DatabaseSchema {
  articles: Article[];
  categories: Category[];
  pages: StaticPage[];
  settings: SiteSettings;
  adsConfig: AdsConfig;
  trendingTopics: TrendingTopic[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ruangtren_db.json');

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Nasional', slug: 'nasional', description: 'Berita seputar peristiwa dan kebijakan nasional Indonesia', sortOrder: 1 },
  { id: 'cat-2', name: 'Internasional', slug: 'internasional', description: 'Kabar dan dinamika peristiwa mancanegara terkini', sortOrder: 2 },
  { id: 'cat-3', name: 'Daerah', slug: 'daerah', description: 'Warta nusantara dan peristiwa penting berbagai daerah Indonesia', sortOrder: 3 },
  { id: 'cat-4', name: 'Politik', slug: 'politik', description: 'Dinamika politik, pemilu, parlemen, dan kepemimpinan', sortOrder: 4 },
  { id: 'cat-5', name: 'Ekonomi', slug: 'ekonomi', description: 'Analisis makroekonomi, fiskal, perbankan, dan pasar modal', sortOrder: 5 },
  { id: 'cat-6', name: 'Bisnis', slug: 'bisnis', description: 'Peluang usaha, industri, korporasi, dan UMKM Indonesia', sortOrder: 6 },
  { id: 'cat-7', name: 'Teknologi', slug: 'teknologi', description: 'Inovasi digital, AI, gadget, aplikasi, dan keamanan siber', sortOrder: 7 },
  { id: 'cat-8', name: 'Pendidikan', slug: 'pendidikan', description: 'Dunia kampus, sekolah, beasiswa, dan kurikulum edukasi', sortOrder: 8 },
  { id: 'cat-9', name: 'Olahraga', slug: 'olahraga', description: 'Sepak bola Liga Indonesia, kompetisi dunia, bulutangkis, dan balap', sortOrder: 9 },
  { id: 'cat-10', name: 'Hiburan', slug: 'hiburan', description: 'Sinema, musik, selebritas, budaya populer, dan seni', sortOrder: 10 },
  { id: 'cat-11', name: 'Lifestyle', slug: 'lifestyle', description: 'Kesehatan, gaya hidup, kuliner nusantara, dan wisata', sortOrder: 11 },
  { id: 'cat-12', name: 'Viral', slug: 'viral', description: 'Topik trending di media sosial dan pembicaraan warganet', sortOrder: 12 },
];

const INITIAL_PAGES: StaticPage[] = [
  {
    id: 'page-pedoman-siber',
    slug: 'pedoman-media-siber',
    title: 'Pedoman Pemberitaan Media Siber',
    content: `<h3>Pedoman Pemberitaan Media Siber RUANGTREN</h3>
<p>Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. RUANGTREN mengadopsi Pedoman Pemberitaan Media Siber yang ditetapkan Dewan Pers Indonesia.</p>
<h4>1. Ruang Lingkup</h4>
<p>Media Siber adalah segala bentuk media yang menggunakan wahana internet dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Pokok Pers.</p>
<h4>2. Verifikasi dan Keberimbangan Berita</h4>
<p>Pada prinsipnya setiap berita harus melalui verifikasi. Berita yang dapat merugikan pihak lain memerlukan verifikasi pada berita yang sama untuk memenuhi prinsip akurasi dan keberimbangan.</p>
<h4>3. Ralat, Koreksi, dan Hak Jawab</h4>
<p>Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan Pers.</p>
<h4>4. Pencabutan Berita</h4>
<p>Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran dari pihak luar redaksi, kecuali terkait masalah SARA, kesusilaan, masa depan anak, atau putusan pengadilan.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-kebijakan-privasi',
    slug: 'kebijakan-privasi',
    title: 'Kebijakan Privasi (Privacy Policy)',
    content: `<h3>Kebijakan Privasi RUANGTREN</h3>
<p>Privasi pengunjung ruangtren.com sangat penting bagi kami. Dokumen Kebijakan Privasi ini menjelaskan jenis informasi pribadi yang diterima dan dikumpulkan oleh RUANGTREN dan bagaimana informasi tersebut digunakan sesuai kepatuhan hukum dan Google AdSense.</p>
<h4>File Log & Cookie</h4>
<p>Seperti kebanyakan situs web standar, RUANGTREN menggunakan file log. Informasi dalam file log mencakup alamat protokol internet (IP), jenis browser, Penyedia Layanan Internet (ISP), tanggal/waktu, halaman rujukan/keluar, dan jumlah klik untuk menganalisis tren serta mengelola situs.</p>
<h4>Cookie Google AdSense & DoubleClick DART</h4>
<p>Google, sebagai vendor pihak ketiga, menggunakan cookie untuk menayangkan iklan di RUANGTREN. Penggunaan cookie DART oleh Google memungkinkannya menampilkan iklan kepada pengguna kami berdasarkan kunjungan mereka ke situs kami dan situs lain di Internet. Pengguna dapat memilih untuk tidak menggunakan cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google.</p>
<h4>Pihak Ketiga & Mitra Iklan</h4>
<p>Mitra iklan kami seperti Google AdSense dapat menggunakan cookie dan web beacon di situs kami. Mitra pihak ketiga ini secara otomatis menerima alamat IP Anda ketika hal ini terjadi guna mengukur efektivitas iklan mereka.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-disclaimer',
    slug: 'disclaimer',
    title: 'Disclaimer (Sanggahan)',
    content: `<h3>Sanggahan (Disclaimer) RUANGTREN</h3>
<p>Seluruh materi informasi, artikel, foto, dan video yang disajikan di portal berita RUANGTREN adalah untuk tujuan informasi umum dan edukasi publik yang berlandaskan prinsip jurnalistik berimbang.</p>
<p>RUANGTREN tidak bertanggung jawab atas kerugian atau kerusakan langsung maupun tidak langsung yang timbul dari penggunaan atau ketergantungan pada materi yang dimuat di situs ini. Pembaca disarankan melakukan verifikasi independen atas keputusan penting yang menyangkut keuangan, kesehatan, atau hukum.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-tentang-kami',
    slug: 'tentang-kami',
    title: 'Tentang Kami',
    content: `<h3>Tentang Portal Berita RUANGTREN</h3>
<p><strong>RUANGTREN</strong> (<em>Berita Terkini, Informasi Terpercaya</em>) adalah media siber independen nasional yang didirikan untuk menyajikan berita akurat, faktual, mendalam, dan berimbang kepada masyarakat Indonesia.</p>
<p>Dengan memegang teguh Kode Etik Jurnalistik dan Undang-Undang No. 40 Tahun 1999 tentang Pers, kami berdedikasi menjadi ruang pertukaran ide, verifikasi fakta di tengah maraknya disinformasi, dan sumber wawasan terdepan bagi kemajuan bangsa.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-susunan-redaksi',
    slug: 'susunan-redaksi',
    title: 'Susunan Dewan Redaksi',
    content: `<h3>Struktur Redaksi RUANGTREN</h3>
<p><strong>Penerbit:</strong> PT Ruang Tren Media Digital Nusantara</p>
<p><strong>Pemimpin Umum / Penanggung Jawab:</strong> Redaksi Utama RUANGTREN</p>
<p><strong>Pemimpin Redaksi:</strong> Tim Editor Senior</p>
<p><strong>Redaktur Pelaksana:</strong> Divisi Berita Nasional & Investigasi</p>
<p><strong>Redaktur Bidang:</strong> Politik, Ekonomi Bisnis, Sains & Teknologi, Olahraga, Gaya Hidup</p>
<p><strong>Sekretariat Redaksi & IT Portal:</strong> Divisi Digital Infrastructure & Security</p>
<p><strong>Alamat Kantor Redaksi:</strong> Gedung Pers Nasional, Lantai 4, Jakarta Pusat 10110</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-kontak',
    slug: 'kontak',
    title: 'Kontak Kami',
    content: `<h3>Hubungi Redaksi RUANGTREN</h3>
<p>Kami menyambut tanggapan, siaran pers, hak jawab, kritik konstruktif, serta kerjasama publikasi dari seluruh pembaca.</p>
<p><strong>Email Redaksi:</strong> redaksi@ruangtren.com</p>
<p><strong>Email Iklan & Kerjasama:</strong> ads@ruangtren.com</p>
<p><strong>WhatsApp Hotspot Berita:</strong> +62 812-3456-7890</p>
<p><strong>Alamat Fisik:</strong> Gedung Pers Nasional Lt. 4, Jl. Kebon Sirih No. 34, Gambir, Jakarta Pusat 10110</p>`,
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'RUANGTREN',
  tagline: 'Berita Terkini, Informasi Terpercaya',
  description: 'Portal berita digital profesional menyajikan berita nasional, internasional, politik, ekonomi, teknologi, dan kabar viral terkini dan terpercaya.',
  logoUrl: '',
  announcementText: 'Selamat Datang di RUANGTREN — Portal Berita Digital Independen dan Terpercaya',
  announcementActive: true,
  contactEmail: 'redaksi@ruangtren.com',
  contactPhone: '+62 812-3456-7890',
  contactAddress: 'Gedung Pers Nasional Lt. 4, Jl. Kebon Sirih No. 34, Jakarta Pusat 10110',
  adminEmails: ['yp892149@gmail.com', 'rullganteng987@gmail.com'],
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
  },
  navMenu: [
    { label: 'Home', href: '/' },
    { label: 'Nasional', href: '/kategori/nasional' },
    { label: 'Internasional', href: '/kategori/internasional' },
    { label: 'Politik', href: '/kategori/politik' },
    { label: 'Ekonomi', href: '/kategori/ekonomi' },
    { label: 'Teknologi', href: '/kategori/teknologi' },
    { label: 'Olahraga', href: '/kategori/olahraga' },
    { label: 'Viral', href: '/kategori/viral' },
  ],
};

const INITIAL_ADS_CONFIG: AdsConfig = {
  publisherId: 'ca-pub-9988776655443322',
  autoAdsEnabled: true,
  headerActive: true,
  sidebarActive: true,
  inArticleActive: true,
  bottomArticleActive: true,
  feedActive: true,
  adsTxtContent: 'google.com, pub-9988776655443322, DIRECT, f08c47fec0942fa0',
};

const INITIAL_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'tr-1',
    topic: 'Perkembangan Pembangunan IKN Nusantara Tahap 2',
    category: 'Nasional',
    searchVolume: '45.000+ pencarian/hari',
    trendScore: 98,
    summary: 'Progres fasilitas pemerintahan dan akses tol IKN menunjukkan peningkatan pesat jelang akhir kuartal.',
    referenceUrl: 'https://ikn.go.id',
    sourceName: 'Otorita IKN / Sekretariat Negara',
    publishedDate: new Date().toLocaleDateString('id-ID'),
    editorNotes: 'Fokuskan liputan pada kesiapan infrastruktur publik dan investasi swasta nasional.',
  },
  {
    id: 'tr-2',
    topic: 'Kecerdasan Buatan (AI) di Sekolah Menengah Indonesia',
    category: 'Teknologi',
    searchVolume: '32.000+ pencarian/hari',
    trendScore: 92,
    summary: 'Kementerian Pendidikan mengkaji integrasi literasi AI dalam kurikulum merdeka untuk SMA dan SMK.',
    referenceUrl: 'https://kemdikbud.go.id',
    sourceName: 'Kemendikbudristek',
    publishedDate: new Date().toLocaleDateString('id-ID'),
    editorNotes: 'Bagus untuk diangkat dari perspektif kesiapan guru dan dampak etika bagi siswa.',
  },
  {
    id: 'tr-3',
    topic: 'Peningkatan Nilai Tukar Rupiah Terhadap Dolar AS',
    category: 'Ekonomi',
    searchVolume: '28.000+ pencarian/hari',
    trendScore: 89,
    summary: 'Bank Indonesia melaporkan arus modal masuk (capital inflow) memperkuat cadangan devisa dan menstabilkan mata uang.',
    referenceUrl: 'https://bi.go.id',
    sourceName: 'Bank Indonesia',
    publishedDate: new Date().toLocaleDateString('id-ID'),
    editorNotes: 'Kaitkan dengan dampaknya terhadap harga barang impor dan daya beli masyarakat.',
  },
  {
    id: 'tr-4',
    topic: 'Piala Asia dan Kualifikasi Timnas Indonesia',
    category: 'Olahraga',
    searchVolume: '60.000+ pencarian/hari',
    trendScore: 99,
    summary: 'Skuad Garuda mempersiapkan strategi formasi baru menghadapi pertandingan penentuan grup.',
    referenceUrl: 'https://pssi.org',
    sourceName: 'PSSI Official',
    publishedDate: new Date().toLocaleDateString('id-ID'),
    editorNotes: 'Buat ulasan taktik dan analisis pemain kunci yang sedang on-fire.',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          articles: Array.isArray(parsed.articles) ? parsed.articles : [],
          categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
          pages: Array.isArray(parsed.pages) && parsed.pages.length > 0 ? parsed.pages : INITIAL_PAGES,
          settings: parsed.settings ? { ...INITIAL_SETTINGS, ...parsed.settings } : INITIAL_SETTINGS,
          adsConfig: parsed.adsConfig ? { ...INITIAL_ADS_CONFIG, ...parsed.adsConfig } : INITIAL_ADS_CONFIG,
          trendingTopics: Array.isArray(parsed.trendingTopics) ? parsed.trendingTopics : INITIAL_TRENDING_TOPICS,
        };
      } catch (err) {
        console.error('Error reading database file, initializing defaults:', err);
      }
    }

    const defaultData: DatabaseSchema = {
      articles: [],
      categories: INITIAL_CATEGORIES,
      pages: INITIAL_PAGES,
      settings: INITIAL_SETTINGS,
      adsConfig: INITIAL_ADS_CONFIG,
      trendingTopics: INITIAL_TRENDING_TOPICS,
    };
    this.saveDataDirect(defaultData);
    return defaultData;
  }

  private saveDataDirect(data: DatabaseSchema) {
    this.ensureDataDir();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  // --- Article Operations ---
  public getArticles(filter?: {
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { articles: Article[]; total: number } {
    let result = [...this.data.articles];

    if (filter?.status) {
      result = result.filter(a => a.status === filter.status);
    }
    if (filter?.category && filter.category !== 'all') {
      const catLower = filter.category.toLowerCase();
      result = result.filter(a => a.category.toLowerCase() === catLower || a.category.toLowerCase().replace(/\s+/g, '-') === catLower);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }

    // Sort by publishedAt descending
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = result.length;
    const offset = filter?.offset || 0;
    const limit = filter?.limit || result.length;
    return { articles: result.slice(offset, offset + limit), total };
  }

  public getArticleBySlug(slug: string): Article | undefined {
    return this.data.articles.find(a => a.slug === slug);
  }

  public getArticleById(id: string): Article | undefined {
    return this.data.articles.find(a => a.id === id);
  }

  public createArticle(articleData: Partial<Article>): Article {
    const title = articleData.title?.trim() || 'Berita Tanpa Judul';
    let baseSlug = (articleData.slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    if (!baseSlug) baseSlug = `berita-${Date.now()}`;

    // Ensure unique slug
    let finalSlug = baseSlug;
    let counter = 1;
    while (this.data.articles.some(a => a.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const now = new Date().toISOString();
    const newArticle: Article = {
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      slug: finalSlug,
      summary: articleData.summary || title,
      content: articleData.content || '',
      imageUrl: articleData.imageUrl || '/src/assets/images/ruangtren_editorial_press_1794078379752.jpg',
      thumbnailUrl: articleData.thumbnailUrl || articleData.imageUrl || '/src/assets/images/ruangtren_editorial_press_1794078379752.jpg',
      category: articleData.category || 'Nasional',
      tags: Array.isArray(articleData.tags) ? articleData.tags : [],
      author: articleData.author || 'Redaksi RUANGTREN',
      status: articleData.status || 'published',
      views: 0,
      publishedAt: articleData.publishedAt || now,
      updatedAt: now,
      seoTitle: articleData.seoTitle || title,
      metaDescription: articleData.metaDescription || articleData.summary || title,
      focusKeywords: articleData.focusKeywords || '',
      isHeadline: Boolean(articleData.isHeadline),
      isEditorsPick: Boolean(articleData.isEditorsPick),
      isTrending: Boolean(articleData.isTrending),
      isPopular: Boolean(articleData.isPopular),
    };

    this.data.articles.unshift(newArticle);
    this.save();
    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<Article>): Article | null {
    const idx = this.data.articles.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const existing = this.data.articles[idx];
    let slug = existing.slug;
    if (updates.slug && updates.slug !== existing.slug) {
      let baseSlug = updates.slug
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      let finalSlug = baseSlug;
      let counter = 1;
      while (this.data.articles.some(a => a.slug === finalSlug && a.id !== id)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      slug = finalSlug;
    }

    const updated: Article = {
      ...existing,
      ...updates,
      id: existing.id,
      slug,
      updatedAt: new Date().toISOString(),
    };

    this.data.articles[idx] = updated;
    this.save();
    return updated;
  }

  public deleteArticle(id: string): boolean {
    const initialLen = this.data.articles.length;
    this.data.articles = this.data.articles.filter(a => a.id !== id);
    if (this.data.articles.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public incrementViews(slug: string): void {
    const article = this.data.articles.find(a => a.slug === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.save();
    }
  }

  // --- Category Operations ---
  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public saveCategory(category: Category): Category {
    const idx = this.data.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = category;
    } else {
      this.data.categories.push(category);
    }
    this.save();
    return category;
  }

  public deleteCategory(id: string): boolean {
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.save();
    return true;
  }

  // --- Pages Operations ---
  public getPages(): StaticPage[] {
    return this.data.pages;
  }

  public getPageBySlug(slug: string): StaticPage | undefined {
    return this.data.pages.find(p => p.slug === slug);
  }

  public savePage(page: StaticPage): StaticPage {
    const idx = this.data.pages.findIndex(p => p.id === page.id || p.slug === page.slug);
    page.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.data.pages[idx] = page;
    } else {
      this.data.pages.push(page);
    }
    this.save();
    return page;
  }

  // --- Settings & Ads ---
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
    };
    this.save();
    return this.data.settings;
  }

  public getAdsConfig(): AdsConfig {
    return this.data.adsConfig;
  }

  public updateAdsConfig(newConfig: Partial<AdsConfig>): AdsConfig {
    this.data.adsConfig = {
      ...this.data.adsConfig,
      ...newConfig,
    };
    this.save();
    return this.data.adsConfig;
  }

  // --- Trending Topics ---
  public getTrendingTopics(): TrendingTopic[] {
    return this.data.trendingTopics;
  }

  public saveTrendingTopic(topic: TrendingTopic): TrendingTopic {
    const idx = this.data.trendingTopics.findIndex(t => t.id === topic.id);
    if (idx >= 0) {
      this.data.trendingTopics[idx] = topic;
    } else {
      this.data.trendingTopics.unshift(topic);
    }
    this.save();
    return topic;
  }

  public deleteTrendingTopic(id: string): boolean {
    this.data.trendingTopics = this.data.trendingTopics.filter(t => t.id !== id);
    this.save();
    return true;
  }

  // --- Statistics ---
  public getStats() {
    const totalArticles = this.data.articles.length;
    const published = this.data.articles.filter(a => a.status === 'published').length;
    const drafts = this.data.articles.filter(a => a.status === 'draft').length;
    const scheduled = this.data.articles.filter(a => a.status === 'scheduled').length;
    const totalViews = this.data.articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const categoryCounts: Record<string, number> = {};
    for (const a of this.data.articles) {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    }

    return {
      totalArticles,
      published,
      drafts,
      scheduled,
      totalViews,
      categoryCounts,
    };
  }

  // Export raw database state
  public getFullSnapshot(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }
}

export const db = new Database();
