import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { ArticleCard } from './components/ArticleCard.tsx';
import { ArticleDetail } from './components/ArticleDetail.tsx';
import { StaticPageView } from './components/StaticPage.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AdSenseSlot } from './components/AdSenseSlot.tsx';
import { Article, Category, SiteSettings, AdsConfig, StaticPage, AdminUser } from './types/index.ts';
import { Flame, TrendingUp, Sparkles, PlusCircle, Newspaper, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation / View State
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category' | 'page' | 'admin'>('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  // App Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
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
    socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '', tiktok: '' },
    navMenu: [],
  });

  const [adsConfig, setAdsConfig] = useState<AdsConfig>({
    publisherId: 'ca-pub-9988776655443322',
    autoAdsEnabled: true,
    headerActive: true,
    sidebarActive: true,
    inArticleActive: true,
    bottomArticleActive: true,
    feedActive: true,
    adsTxtContent: 'google.com, pub-9988776655443322, DIRECT, f08c47fec0942fa0',
  });

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Route from window.location
  const handleUrlRouting = () => {
    const path = window.location.pathname;
    if (path.startsWith('/berita/')) {
      const slug = path.replace('/berita/', '').split('/')[0];
      if (slug) {
        setSelectedArticleSlug(slug);
        setCurrentView('article');
        return;
      }
    } else if (path.startsWith('/kategori/')) {
      const cat = path.replace('/kategori/', '').split('/')[0];
      if (cat) {
        setSelectedCategorySlug(cat);
        setCurrentView('category');
        return;
      }
    } else if (path.startsWith('/halaman/')) {
      const pageSlug = path.replace('/halaman/', '').split('/')[0];
      if (pageSlug) {
        setSelectedPageSlug(pageSlug);
        setCurrentView('page');
        return;
      }
    } else if (path === '/admin') {
      setCurrentView('admin');
      return;
    }

    setCurrentView('home');
  };

  // Fetch Public Data
  const fetchData = async () => {
    try {
      const [artRes, catRes, setRes, adsRes, pageRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/categories'),
        fetch('/api/settings'),
        fetch('/api/ads'),
        fetch('/api/pages'),
      ]);

      const artData = await artRes.json();
      if (artData.success) setArticles(artData.articles || []);

      const catData = await catRes.json();
      if (catData.success) setCategories(catData.categories || []);

      const setData = await setRes.json();
      if (setData.success) setSettings(setData.settings);

      const adsData = await adsRes.json();
      if (adsData.success) setAdsConfig(adsData.ads);

      const pageData = await pageRes.json();
      if (pageData.success) setPages(pageData.pages || []);
    } catch (err) {
      console.error('Error fetching public portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check persisted admin session
  useEffect(() => {
    const savedToken = localStorage.getItem('ruangtren_admin_token');
    const savedUser = localStorage.getItem('ruangtren_admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ruangtren_admin_token');
        localStorage.removeItem('ruangtren_admin_user');
      }
    }

    fetchData();
    handleUrlRouting();

    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  // Navigation handlers with HTML5 History API
  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setSelectedArticleSlug(null);
    setSelectedCategorySlug('all');
    setSelectedPageSlug(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (slug: string) => {
    window.history.pushState({}, '', `/berita/${slug}`);
    setSelectedArticleSlug(slug);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catSlug: string) => {
    if (catSlug === 'all') {
      navigateToHome();
      return;
    }
    window.history.pushState({}, '', `/kategori/${catSlug}`);
    setSelectedCategorySlug(catSlug);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (slug: string) => {
    window.history.pushState({}, '', `/halaman/${slug}`);
    setSelectedPageSlug(slug);
    setCurrentView('page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    if (adminUser && adminToken) {
      window.history.pushState({}, '', '/admin');
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Login & Logout Handlers
  const handleLoginSuccess = (user: AdminUser, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin');
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('ruangtren_admin_token');
    localStorage.removeItem('ruangtren_admin_user');
    setAdminUser(null);
    setAdminToken('');
    navigateToHome();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedCategorySlug('all');
    setCurrentView('category');
  };

  // Filter articles based on active category / search
  const visibleArticles = articles.filter((art) => {
    if (selectedCategorySlug !== 'all') {
      if (art.category.toLowerCase() !== selectedCategorySlug.toLowerCase()) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Selected Article Detail
  const selectedArticle = articles.find((a) => a.slug === selectedArticleSlug);
  const relatedArticles = selectedArticle
    ? articles.filter((a) => a.id !== selectedArticle.id && a.category === selectedArticle.category)
    : [];

  // Selected Page Detail
  const selectedPage = pages.find((p) => p.slug === selectedPageSlug);

  // Headlines & Popular articles
  const headlineArticle = articles.find((a) => a.isHeadline) || articles[0];
  const secondaryFeatures = articles.filter((a) => a.id !== headlineArticle?.id).slice(0, 3);
  const popularArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const latestHeadlines = articles.slice(0, 5).map((a) => a.title);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Admin Dashboard View (Blogger Pro CMS) */}
      {currentView === 'admin' && adminUser && adminToken ? (
        <AdminDashboard
          adminUser={adminUser}
          token={adminToken}
          onLogout={handleLogout}
          onViewSite={navigateToHome}
          onViewArticle={navigateToArticle}
        />
      ) : (
        /* Public Portal View (Kompas/CNN Indonesia Layout) */
        <>
          <Header
            settings={settings}
            categories={categories}
            activeCategory={selectedCategorySlug}
            onSelectCategory={navigateToCategory}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
            adminUser={adminUser}
            onOpenAdminDashboard={navigateToAdmin}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            latestHeadlines={latestHeadlines}
          />

          <main className="flex-1">
            {/* 1. SINGLE ARTICLE VIEW */}
            {currentView === 'article' && selectedArticle ? (
              <ArticleDetail
                article={selectedArticle}
                relatedArticles={relatedArticles}
                adsConfig={adsConfig}
                onBack={navigateToHome}
                onSelectCategory={navigateToCategory}
                onSelectArticle={navigateToArticle}
              />
            ) : currentView === 'page' && selectedPage ? (
              /* 2. STATIC POLICY / EDITORIAL PAGE VIEW */
              <StaticPageView page={selectedPage} onBack={navigateToHome} />
            ) : currentView === 'category' ? (
              /* 3. CATEGORY ARCHIVE / SEARCH RESULTS VIEW */
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                {/* Leaderboard Ad */}
                <AdSenseSlot position="header" adsConfig={adsConfig} className="mb-6" />

                <div className="border-b-2 border-blue-900 pb-3 mb-6 flex items-baseline justify-between">
                  <h1 className="text-2xl font-black font-serif text-slate-900 uppercase tracking-tight">
                    {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : `Kategori: ${selectedCategorySlug}`}
                  </h1>
                  <span className="text-xs text-slate-500 font-medium font-mono tabular-nums">
                    {visibleArticles.length} Berita Ditemukan
                  </span>
                </div>

                {visibleArticles.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8">
                    <Newspaper className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-700">Belum Ada Berita di Kategori Ini</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                      Sebagai pemilik media, Anda dapat langsung mempublikasikan berita pertama di kategori ini melalui panel admin.
                    </p>
                    <button
                      onClick={navigateToAdmin}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" /> Masuk & Tulis Berita
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleArticles.map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        variant="standard"
                        onClick={navigateToArticle}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* 4. HOMEPAGE PORTAL (KOMPAS/CNN INDONESIA DUAL TIER LAYOUT) */
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
                {/* Top Leaderboard Ad Slot */}
                <AdSenseSlot position="header" adsConfig={adsConfig} className="mb-4" />

                {/* Empty State Welcome Guidance for Owner */}
                {articles.length === 0 && !isLoading && (
                  <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-xl p-6 sm:p-8 shadow-md border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 bg-blue-800/80 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full border border-blue-600/40">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Portal RUANGTREN Siap Digunakan</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
                        Selamat Datang, Pemilik & Administrator RUANGTREN!
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        Database dan seluruh 12 kategori standar berita Indonesia telah terinisialisasi bersih. Anda dapat login sekarang untuk menerbitkan berita pertama, menyesuaikan identitas website, dan mengonfigurasi Google AdSense.
                      </p>
                    </div>

                    <button
                      onClick={navigateToAdmin}
                      className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-950 font-bold rounded-lg text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <span>Masuk ke Dashboard Admin</span>
                      <ArrowRight className="w-4 h-4 text-blue-700" />
                    </button>
                  </div>
                )}

                {/* TIER 1: LEAD HEADLINE + SECONDARY FEATURE GRID */}
                {headlineArticle && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-blue-900">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-rose-600" />
                        <h2 className="text-lg font-black font-serif text-slate-900 uppercase tracking-tight">
                          Headline Berita Utama
                        </h2>
                      </div>
                      <span className="text-xs font-medium text-slate-500">Liputan Terhangat Hari Ini</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      {/* Left: Dominant Focal Hero Headline (7 cols) */}
                      <div className="lg:col-span-7">
                        <ArticleCard
                          article={headlineArticle}
                          variant="headline"
                          onClick={navigateToArticle}
                        />
                      </div>

                      {/* Right: 3 Secondary Feature Cards (5 cols) */}
                      <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                        {secondaryFeatures.length > 0 ? (
                          secondaryFeatures.map((sec) => (
                            <ArticleCard
                              key={sec.id}
                              article={sec}
                              variant="compact"
                              onClick={navigateToArticle}
                            />
                          ))
                        ) : (
                          <div className="h-full bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center text-slate-400">
                            <Newspaper className="w-8 h-8 text-slate-300 mb-2" />
                            <div className="text-xs font-bold text-slate-600">Berita Pendukung</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Terbitkan lebih banyak artikel di Dashboard untuk mengisi kolom sorotan ini.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* In-Feed Banner Ad */}
                <AdSenseSlot position="feed" adsConfig={adsConfig} className="my-6" />

                {/* TIER 2: MAIN FEED (70%) + SIDEBAR (30%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Berita Terbaru & Kategori (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-blue-900">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-700" />
                        <h2 className="text-base font-black font-serif text-slate-900 uppercase tracking-tight">
                          Berita Terbaru & Terkini
                        </h2>
                      </div>
                      <button
                        onClick={() => navigateToCategory('all')}
                        className="text-xs text-blue-700 hover:underline font-semibold"
                      >
                        Lihat Semua Berita &rarr;
                      </button>
                    </div>

                    {articles.length === 0 ? (
                      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-400">
                        <Newspaper className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <div className="text-sm font-bold text-slate-700">Belum Ada Berita Diterbitkan</div>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          Klik tombol di bawah untuk membuat dan mempublikasikan artikel berita perdana RUANGTREN.
                        </p>
                        <button
                          onClick={navigateToAdmin}
                          className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4" /> Buka Dashboard Admin
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {articles.slice(0, 8).map((art) => (
                          <ArticleCard
                            key={art.id}
                            article={art}
                            variant="standard"
                            onClick={navigateToArticle}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Berita Populer & Sidebar Ad (4 cols) */}
                  <aside className="lg:col-span-4 space-y-6">
                    {/* Sticky Sidebar Google AdSense Banner */}
                    <AdSenseSlot position="sidebar" adsConfig={adsConfig} />

                    {/* Popular Articles Widget (Ranked 1-5 like Detik/Kompas) */}
                    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-rose-600">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                          Berita Terpopuler
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-rose-600">24 Jam</span>
                      </div>

                      {popularArticles.length > 0 ? (
                        <div className="space-y-1">
                          {popularArticles.map((pop, idx) => (
                            <ArticleCard
                              key={pop.id}
                              article={pop}
                              variant="popular-row"
                              rankIndex={idx}
                              onClick={navigateToArticle}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">
                          Daftar berita populer akan diperbarui otomatis saat pembaca mengakses artikel.
                        </p>
                      )}
                    </div>

                    {/* Dewan Pers / Editorial Verification Badge */}
                    <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                        <span>Kredibilitas Informasi</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Setiap artikel di RUANGTREN diverifikasi oleh dewan redaksi independen guna memastikan kepatuhan terhadap Pedoman Pemberitaan Media Siber.
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </main>

          <Footer
            settings={settings}
            categories={categories}
            onSelectCategory={navigateToCategory}
            onOpenPage={navigateToPage}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          />
        </>
      )}

      {/* Admin Login Modal (Google OAuth & Whitelist Gate) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
