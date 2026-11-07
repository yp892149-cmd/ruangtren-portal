import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  PlusCircle,
  Settings,
  DollarSign,
  TrendingUp,
  Database,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle,
  Search,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link,
  Image,
  Video,
  Code,
  Layout,
  Globe,
  Share2,
  Lock,
  LogOut,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Article, Category, SiteSettings, AdsConfig, TrendingTopic, AdminUser } from '../types/index.ts';

interface AdminDashboardProps {
  adminUser: AdminUser;
  token: string;
  onLogout: () => void;
  onViewSite: () => void;
  onViewArticle: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  token,
  onLogout,
  onViewSite,
  onViewArticle,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'stats' | 'articles' | 'editor' | 'settings' | 'ads' | 'trending' | 'backup' | 'guides'
  >('articles');

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Editor Form State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const visualEditorRef = useRef<HTMLDivElement>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Nasional');
  const [formTags, setFormTags] = useState('');
  const [formAuthor, setFormAuthor] = useState(adminUser.name || 'Redaksi RUANGTREN');
  const [formStatus, setFormStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formIsHeadline, setFormIsHeadline] = useState(false);
  const [formIsEditorsPick, setFormIsEditorsPick] = useState(false);

  // Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [adsConfig, setAdsConfig] = useState<AdsConfig | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Trending Topics State
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);

  // Show temporary toast notification
  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Auth fetch helper
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    return fetch(url, { ...options, headers });
  };

  // Load Initial Data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [artRes, catRes, statsRes, setRes, adsRes, trendRes] = await Promise.all([
        authFetch('/api/admin/articles'),
        fetch('/api/categories'),
        authFetch('/api/admin/stats'),
        authFetch('/api/admin/settings'),
        fetch('/api/ads'),
        fetch('/api/trending'),
      ]);

      const artData = await artRes.json();
      if (artData.success) setArticles(artData.articles || []);

      const catData = await catRes.json();
      if (catData.success) setCategories(catData.categories || []);

      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      const setData = await setRes.json();
      if (setData.success) setSiteSettings(setData.settings);

      const adsData = await adsRes.json();
      if (adsData.success) setAdsConfig(adsData.ads);

      const trendData = await trendRes.json();
      if (trendData.success) setTrendingTopics(trendData.topics || []);
    } catch (err: any) {
      notify('Gagal memuat data dari server: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  // Sync visual editor content when switching modes
  const handleEditorModeToggle = (mode: 'visual' | 'html') => {
    if (mode === 'html') {
      if (visualEditorRef.current) {
        setFormContent(visualEditorRef.current.innerHTML);
      }
    } else {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = formContent;
      }
    }
    setEditorMode(mode);
  };

  // Format command for visual editor
  const executeFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setFormContent(visualEditorRef.current.innerHTML);
    }
  };

  const insertHeading = (headingTag: string) => {
    document.execCommand('formatBlock', false, `<${headingTag}>`);
    if (visualEditorRef.current) {
      setFormContent(visualEditorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Masukkan tautan URL (contoh: https://contoh.com):');
    if (url) {
      executeFormat('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar (atau gunakan preset gambar redaksi):');
    if (url) {
      executeFormat('insertImage', url);
    }
  };

  const insertYouTubeVideo = () => {
    const embedCode = prompt(
      'Masukkan URL Video YouTube (contoh: https://www.youtube.com/watch?v=xxxx) atau kode embed <iframe>:'
    );
    if (embedCode) {
      let finalEmbed = embedCode;
      if (embedCode.includes('youtube.com/watch?v=')) {
        const vidId = embedCode.split('v=')[1]?.split('&')[0];
        finalEmbed = `<div class="aspect-video my-4"><iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe></div>`;
      } else if (embedCode.includes('youtu.be/')) {
        const vidId = embedCode.split('youtu.be/')[1]?.split('?')[0];
        finalEmbed = `<div class="aspect-video my-4"><iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe></div>`;
      }
      document.execCommand('insertHTML', false, finalEmbed);
      if (visualEditorRef.current) {
        setFormContent(visualEditorRef.current.innerHTML);
      }
    }
  };

  // Open Form to Write New Article
  const handleStartNewArticle = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormSlug('');
    setFormSummary('');
    setFormContent('');
    setFormImageUrl('/src/assets/images/ruangtren_editorial_press_1794078379752.jpg');
    setFormCategory('Nasional');
    setFormTags('berita, terkini, indonesia');
    setFormAuthor(adminUser.name || 'Redaksi RUANGTREN');
    setFormStatus('published');
    setFormSeoTitle('');
    setFormMetaDesc('');
    setFormKeywords('');
    setFormIsHeadline(false);
    setFormIsEditorsPick(false);
    setActiveTab('editor');
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = '<p>Tulis paragraf pembuka berita di sini...</p>';
      }
    }, 100);
  };

  // Open Form to Edit Existing Article
  const handleStartEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setFormTitle(art.title);
    setFormSlug(art.slug);
    setFormSummary(art.summary);
    setFormContent(art.content);
    setFormImageUrl(art.imageUrl);
    setFormCategory(art.category);
    setFormTags((art.tags || []).join(', '));
    setFormAuthor(art.author);
    setFormStatus(art.status);
    setFormSeoTitle(art.seoTitle || art.title);
    setFormMetaDesc(art.metaDescription || art.summary);
    setFormKeywords(art.focusKeywords || '');
    setFormIsHeadline(Boolean(art.isHeadline));
    setFormIsEditorsPick(Boolean(art.isEditorsPick));
    setActiveTab('editor');
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = art.content;
      }
    }, 100);
  };

  // Save Article (Create or Update)
  const handleSaveArticle = async (forcedStatus?: 'published' | 'draft') => {
    const title = formTitle.trim();
    if (!title) {
      notify('Judul berita tidak boleh kosong!', 'error');
      return;
    }

    const currentContent =
      editorMode === 'visual' && visualEditorRef.current
        ? visualEditorRef.current.innerHTML
        : formContent;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const targetStatus = forcedStatus || formStatus;

    const payload = {
      title,
      slug: formSlug.trim() || undefined,
      summary: formSummary.trim() || title,
      content: currentContent,
      imageUrl: formImageUrl || '/src/assets/images/ruangtren_editorial_press_1794078379752.jpg',
      category: formCategory,
      tags: parsedTags,
      author: formAuthor || adminUser.name || 'Redaksi RUANGTREN',
      status: targetStatus,
      seoTitle: formSeoTitle.trim() || title,
      metaDescription: formMetaDesc.trim() || formSummary.trim() || title,
      focusKeywords: formKeywords.trim(),
      isHeadline: formIsHeadline,
      isEditorsPick: formIsEditorsPick,
    };

    setIsLoading(true);
    try {
      let res;
      if (editingArticleId) {
        res = await authFetch(`/api/admin/articles/${editingArticleId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await authFetch('/api/admin/articles', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan artikel');
      }

      notify(editingArticleId ? 'Perubahan artikel berhasil disimpan!' : 'Berita baru berhasil diterbitkan!');
      await loadDashboardData();
      setActiveTab('articles');
    } catch (err: any) {
      notify(err.message || 'Terjadi kesalahan sistem saat menyimpan artikel', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel: "${title}"?`)) return;

    try {
      const res = await authFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Gagal menghapus artikel');

      notify('Artikel berhasil dihapus');
      loadDashboardData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    if (!siteSettings) return;
    setIsLoading(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Gagal memperbarui pengaturan situs');

      notify('Pengaturan situs berhasil diperbarui!');
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Admin Email
  const handleAddAdminEmail = () => {
    if (!newAdminEmail.trim() || !siteSettings) return;
    const email = newAdminEmail.trim().toLowerCase();
    if (!siteSettings.adminEmails.includes(email)) {
      setSiteSettings({
        ...siteSettings,
        adminEmails: [...siteSettings.adminEmails, email],
      });
      setNewAdminEmail('');
      notify(`Alamat ${email} ditambahkan ke daftar izin admin. Klik "Simpan Pengaturan" untuk menetapkan.`);
    }
  };

  const handleRemoveAdminEmail = (email: string) => {
    if (!siteSettings) return;
    if (siteSettings.adminEmails.length <= 1) {
      notify('Minimal harus ada 1 email administrator terdaftar!', 'error');
      return;
    }
    setSiteSettings({
      ...siteSettings,
      adminEmails: siteSettings.adminEmails.filter((e) => e !== email),
    });
  };

  // Save Ads Configuration
  const handleSaveAds = async () => {
    if (!adsConfig) return;
    setIsLoading(true);
    try {
      const res = await authFetch('/api/admin/ads', {
        method: 'PUT',
        body: JSON.stringify(adsConfig),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Gagal memperbarui konfigurasi AdSense');

      notify('Konfigurasi Google AdSense berhasil disimpan!');
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Use Trending Topic in Article
  const handleUseTrendingTopic = (topic: TrendingTopic) => {
    handleStartNewArticle();
    setFormTitle(topic.topic);
    setFormCategory(topic.category);
    setFormSummary(topic.summary);
    setFormTags(`trending, ${topic.category.toLowerCase()}, ${topic.sourceName.toLowerCase()}`);
    setActiveTab('editor');
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = `<p><strong>RUANGTREN, JAKARTA</strong> — ${topic.summary}</p><p>${topic.editorNotes}</p><p>Sumber referensi: <a href="${topic.referenceUrl}">${topic.sourceName}</a></p>`;
      }
    }, 150);
    notify(`Topik "${topic.topic}" dimuat ke Editor Berita!`);
  };

  // Filtered Articles List
  const filteredArticles = articles.filter((art) => {
    if (statusFilter !== 'all' && art.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && art.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* 1. Dashboard Top Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black font-serif tracking-tight text-white">
              RUANG<span className="text-blue-500">TREN</span>
            </span>
            <span className="text-[11px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              CMS Studio (Blogger Pro)
            </span>
          </div>

          {/* Quick Action & Admin User Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartNewArticle}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tulis Berita Baru</span>
            </button>

            <button
              onClick={onViewSite}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 hover:bg-slate-800 transition-colors"
              title="Buka Website Publik"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Portal</span>
            </button>

            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {adminUser.picture ? (
                  <img src={adminUser.picture} alt={adminUser.name} className="w-full h-full object-cover" />
                ) : (
                  adminUser.name.charAt(0)
                )}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight">{adminUser.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{adminUser.email}</div>
              </div>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800 transition-colors ml-1"
                title="Keluar dari Sesi Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Horizontal Navigation Tabs (Laptop-Optimized) */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kelola Berita ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editor Berita Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Statistik & Ringkasan</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan Situs Mandiri</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Google AdSense</span>
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'trending'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span>Riset Topik Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backup & Cloudflare D1</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-md transition-colors cursor-pointer ${
                activeTab === 'guides'
                  ? 'bg-slate-900 text-white font-bold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan Lengkap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-rose-900 text-white border-rose-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* ======================================================== */}
        {/* TAB 1: KELOLA BERITA (BLOGGER-STYLE ARTICLE MANAGER)     */}
        {/* ======================================================== */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleStartNewArticle}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" /> Tulis Berita
                </button>

                {/* Filter Status */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({articles.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('published')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      statusFilter === 'published' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Terbit ({articles.filter((a) => a.status === 'published').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('draft')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      statusFilter === 'draft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Draft ({articles.filter((a) => a.status === 'draft').length})
                  </button>
                </div>

                {/* Filter Kategori */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Bar in Dashboard */}
              <div className="relative">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Cari judul berita..."
                  className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Articles Table (Blogger Style) */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Judul Berita</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Penulis</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Pembaca</th>
                      <th className="py-3 px-3">Tanggal</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <div className="font-semibold text-slate-600 text-sm">Belum Ada Artikel</div>
                          <p className="text-xs text-slate-400 mt-1">
                            {articles.length === 0
                              ? 'Database artikel saat ini kosong sesuai preferensi awal. Klik "Tulis Berita Baru" untuk menerbitkan artikel pertama Anda!'
                              : 'Tidak ada artikel yang cocok dengan filter pencarian.'}
                          </p>
                          {articles.length === 0 && (
                            <button
                              onClick={handleStartNewArticle}
                              className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                            >
                              + Tulis Berita Pertama
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* Title & Slug */}
                          <td className="py-3 px-4 max-w-sm">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                              {art.title}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              /berita/{art.slug}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                              {art.category}
                            </span>
                          </td>

                          {/* Author */}
                          <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                            {art.author}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {art.status === 'published' ? (
                              <span className="text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                                Diterbitkan
                              </span>
                            ) : art.status === 'draft' ? (
                              <span className="text-amber-700 bg-amber-50 font-semibold px-2 py-0.5 rounded text-[11px] border border-amber-200">
                                Draft
                              </span>
                            ) : (
                              <span className="text-blue-700 bg-blue-50 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-200">
                                Terjadwal
                              </span>
                            )}
                          </td>

                          {/* Views */}
                          <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                            {art.views || 0}
                          </td>

                          {/* Date */}
                          <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                            {new Date(art.publishedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => onViewArticle(art.slug)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100 transition-colors"
                                title="Lihat di Portal Publik"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleStartEditArticle(art)}
                                className="p-1.5 text-slate-400 hover:text-emerald-700 rounded hover:bg-slate-100 transition-colors"
                                title="Edit Berita"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id, art.title)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                                title="Hapus Berita"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EDITOR BERITA STUDIO (VISUAL WYSIWYG & HTML)      */}
        {/* ======================================================== */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Main Writing Area */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('articles')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-slate-300">|</span>
                    <h2 className="text-sm font-bold text-slate-900">
                      {editingArticleId ? 'Edit Berita' : 'Tulis Berita Baru'}
                    </h2>
                  </div>

                  {/* Dual Mode Switcher: Visual vs HTML */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => handleEditorModeToggle('visual')}
                      className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                        editorMode === 'visual'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" /> Visual Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditorModeToggle('html')}
                      className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                        editorMode === 'html'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" /> HTML Source
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Judul Berita <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (!editingArticleId) {
                        const slugified = e.target.value
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/\s+/g, '-');
                        setFormSlug(slugified);
                      }
                    }}
                    placeholder="Contoh: Terjadi Banjir di Yogyakarta, Sejumlah Wilayah Terendam"
                    className="w-full px-3.5 py-2.5 text-base sm:text-lg font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-serif"
                  />
                </div>

                {/* Permalink / Slug preview */}
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-600 shrink-0">URL Mandiri:</span>
                  <span className="text-slate-400 truncate">ruangtren.com/berita/</span>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="slug-artikel-unik"
                    className="flex-1 bg-white px-2 py-0.5 border border-slate-300 rounded text-xs font-mono text-blue-700"
                  />
                </div>

                {/* Ringkasan Berita / Excerpt */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ringkasan Berita (Lead Paragraph)
                  </label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Ringkasan singkat berita untuk pembaca dan cuplikan mesin pencari..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Editor Content Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Isi Artikel Lengkap
                  </label>

                  {/* VISUAL TOOLBAR */}
                  {editorMode === 'visual' && (
                    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 border border-slate-300 rounded-t-lg text-slate-700">
                      <button
                        type="button"
                        onClick={() => executeFormat('bold')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Tebal (Bold)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeFormat('italic')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Miring (Italic)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-4 w-px bg-slate-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => insertHeading('h2')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors flex items-center text-[11px] font-bold"
                        title="Sub-judul H2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading('h3')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors flex items-center text-[11px] font-bold"
                        title="Sub-judul H3"
                      >
                        H3
                      </button>
                      <div className="h-4 w-px bg-slate-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => executeFormat('insertUnorderedList')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Daftar Bullet"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeFormat('insertOrderedList')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Daftar Angka"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading('blockquote')}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Kutipan Narasumber"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-4 w-px bg-slate-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={insertLink}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Sisipkan Tautan"
                      >
                        <Link className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={insertImage}
                        className="p-1.5 hover:bg-white hover:text-blue-700 rounded transition-colors"
                        title="Sisipkan Gambar"
                      >
                        <Image className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={insertYouTubeVideo}
                        className="p-1.5 hover:bg-white hover:text-rose-600 rounded transition-colors flex items-center gap-1 text-[11px]"
                        title="Sematkan Video YouTube"
                      >
                        <Video className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sematkan Video</span>
                      </button>
                    </div>
                  )}

                  {/* Visual ContentEditable Canvas */}
                  {editorMode === 'visual' ? (
                    <div
                      ref={visualEditorRef}
                      contentEditable
                      className="min-h-[380px] p-4 bg-white border border-t-0 border-slate-300 rounded-b-lg focus:outline-none prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm"
                      onBlur={() => {
                        if (visualEditorRef.current) {
                          setFormContent(visualEditorRef.current.innerHTML);
                        }
                      }}
                    />
                  ) : (
                    /* Raw HTML Editor Mode */
                    <textarea
                      rows={16}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="<p>Tulis kode HTML artikel di sini...</p>"
                      className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Publishing & SEO Metadata Panel */}
            <div className="lg:col-span-4 space-y-4">
              {/* Publication Actions Box */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Publikasi Berita
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Status Penerbitan
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="published">Terbitkan Sekarang (Live)</option>
                    <option value="draft">Simpan sebagai Draft</option>
                    <option value="scheduled">Jadwalkan Publikasi</option>
                  </select>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveArticle('published')}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>TERBITKAN BERITA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveArticle('draft')}
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Simpan Draft</span>
                  </button>
                </div>
              </div>

              {/* Taxonomy & Author Box */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Kategori & Gambar
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kategori Berita <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tag / Kata Kunci (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="banjir, yogyakarta, cuaca"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Penulis / Jurnalis
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    URL Gambar Utama Berita
                  </label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://... atau path gambar"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  {formImageUrl && (
                    <div className="mt-2 w-full aspect-16/9 rounded overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/src/assets/images/ruangtren_editorial_press_1794078379752.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsHeadline}
                      onChange={(e) => setFormIsHeadline(e.target.checked)}
                      className="rounded text-blue-700"
                    />
                    <span>Jadikan Headline Utama Beranda</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsEditorsPick}
                      onChange={(e) => setFormIsEditorsPick(e.target.checked)}
                      className="rounded text-blue-700"
                    />
                    <span>Tampilkan di Pilihan Editor</span>
                  </label>
                </div>
              </div>

              {/* SEO Box (Google Search Optimization) */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Google SEO & Cuplikan
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={formSeoTitle}
                    onChange={(e) => setFormSeoTitle(e.target.value)}
                    placeholder="Judul khusus untuk Google Search"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-700">Meta Description</label>
                    <span className="text-[10px] text-slate-400">
                      {formMetaDesc.length}/160 karakter
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formMetaDesc}
                    onChange={(e) => setFormMetaDesc(e.target.value)}
                    placeholder="Deskripsi ringkas yang muncul di hasil pencarian Google..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Google Snippet Live Preview */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-left">
                  <div className="text-[10px] text-slate-400 mb-1 uppercase font-semibold">
                    Pratinjau Hasil Google:
                  </div>
                  <div className="text-blue-800 text-xs font-medium hover:underline truncate">
                    {formSeoTitle || formTitle || 'Judul Berita RUANGTREN'}
                  </div>
                  <div className="text-[11px] text-emerald-700 truncate">
                    https://ruangtren.com/berita/{formSlug || 'slug-berita'}
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                    {formMetaDesc || formSummary || 'Deskripsi berita akan dirayapi dan diindeks oleh bot Google.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: STATISTIK & RINGKASAN                             */}
        {/* ======================================================== */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Stat Counter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Artikel
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                  {stats?.totalArticles ?? articles.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Tanpa batasan kuota penerbitan</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Artikel Diterbitkan
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 mt-2 font-mono tabular-nums">
                  {stats?.published ?? articles.filter((a) => a.status === 'published').length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Tersedia di web publik & sitemap</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Draft Tersimpan
                </div>
                <div className="text-3xl font-extrabold text-amber-700 mt-2 font-mono tabular-nums">
                  {stats?.drafts ?? articles.filter((a) => a.status === 'draft').length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Siap untuk diedit & diterbitkan</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Total Pembaca (Views)
                </div>
                <div className="text-3xl font-extrabold text-blue-800 mt-2 font-mono tabular-nums">
                  {stats?.totalViews ?? articles.reduce((acc, c) => acc + (c.views || 0), 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Akumulasi seluruh tayangan</div>
              </div>
            </div>

            {/* Quick Actions & Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                  Distribusi Berita per Kategori
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((c) => {
                    const count = articles.filter(
                      (a) => a.category.toLowerCase() === c.name.toLowerCase()
                    ).length;
                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="text-xs font-semibold text-slate-800">{c.name}</div>
                        <div className="text-lg font-bold text-blue-900 font-mono tabular-nums">
                          {count} berita
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                  Kesiapan Mesin Pencari & Monetisasi
                </h3>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-medium">Dynamic Sitemap XML (/sitemap.xml)</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Aktif Otomatis
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-medium">File ads.txt (/ads.txt)</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Sesuai Standar
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-medium">Robots.txt (/robots.txt)</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Googlebot Siap
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-medium">Schema.org NewsArticle (JSON-LD)</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Tersemat di Artikel
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PENGATURAN SITUS MANDIRI                          */}
        {/* ======================================================== */}
        {activeTab === 'settings' && siteSettings && (
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Kendali Mandiri Pengaturan Situs</h2>
                <p className="text-xs text-slate-500">
                  Kelola identitas, pengumuman breaking news, menu publik, dan hak akses admin secara mandiri.
                </p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Portal Media</label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Portal</label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Situs (Meta Description Utama)
              </label>
              <textarea
                rows={2}
                value={siteSettings.description}
                onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            {/* Breaking News / Announcement Bar Settings */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bilah Pengumuman / Breaking News Ticker
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.announcementActive}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, announcementActive: e.target.checked })
                    }
                    className="rounded text-blue-700"
                  />
                  <span>Aktifkan Ticker</span>
                </label>
              </div>
              <input
                type="text"
                value={siteSettings.announcementText}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementText: e.target.value })}
                placeholder="Teks pengumuman penting yang muncul di header paling atas..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Redaksi</label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telepon / Hotline</label>
                <input
                  type="text"
                  value={siteSettings.contactPhone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Redaksi</label>
                <input
                  type="text"
                  value={siteSettings.contactAddress}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactAddress: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Admin Email Whitelist Management */}
            <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Daftar Email Administrator Terverifikasi (ADMIN_EMAILS)
                </h3>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Hanya akun Gmail yang terdaftar di bawah ini yang dapat masuk ke portal admin.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {siteSettings.adminEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-300 rounded text-xs font-medium text-blue-950"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdminEmail(email)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus dari daftar admin"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md pt-1">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="tambah.admin.baru@gmail.com"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAdminEmail}
                  className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold"
                >
                  Tambah Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: MONETISASI GOOGLE ADSENSE                         */}
        {/* ======================================================== */}
        {activeTab === 'ads' && adsConfig && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Pengaturan Monetisasi Google AdSense
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Konfigurasikan Publisher ID, sakelar slot iklan, dan file ads.txt untuk mulai menghasilkan uang.
                  </p>
                </div>
                <button
                  onClick={handleSaveAds}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan AdSense</span>
                </button>
              </div>

              {/* Publisher ID Form */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-3">
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Google AdSense Publisher ID (Client ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adsConfig.publisherId}
                    onChange={(e) => setAdsConfig({ ...adsConfig, publisherId: e.target.value.trim() })}
                    placeholder="ca-pub-1234567890123456"
                    className="flex-1 px-3.5 py-2 text-sm bg-white border border-emerald-300 rounded-lg font-mono font-bold text-emerald-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-emerald-800">
                  Dapatkan Publisher ID dari dashboard Google AdSense Anda (menu Akun &gt; Pengaturan &gt; Informasi Akun).
                </p>
              </div>

              {/* Individual Slot Toggles */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Pengaturan Unit Iklan Strategis (5 Slot Berpenghasilan Tinggi)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Header Leaderboard (728x90)</div>
                      <div className="text-[11px] text-slate-500">Muncul di bagian atas sebelum headline</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={adsConfig.headerActive}
                      onChange={(e) => setAdsConfig({ ...adsConfig, headerActive: e.target.checked })}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                  </label>

                  <label className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Sidebar Rectangle (300x250)</div>
                      <div className="text-[11px] text-slate-500">Muncul di samping artikel berita</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={adsConfig.sidebarActive}
                      onChange={(e) => setAdsConfig({ ...adsConfig, sidebarActive: e.target.checked })}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                  </label>

                  <label className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800">In-Article Native Ad (CTR Tertinggi)</div>
                      <div className="text-[11px] text-slate-500">Muncul di tengah paragraf bacaan artikel</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={adsConfig.inArticleActive}
                      onChange={(e) => setAdsConfig({ ...adsConfig, inArticleActive: e.target.checked })}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                  </label>

                  <label className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Bottom Article Multiplex Ad</div>
                      <div className="text-[11px] text-slate-500">Muncul setelah akhir paragraf artikel</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={adsConfig.bottomArticleActive}
                      onChange={(e) => setAdsConfig({ ...adsConfig, bottomArticleActive: e.target.checked })}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                  </label>

                  <label className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between sm:col-span-2 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Between News Feed Ad</div>
                      <div className="text-[11px] text-slate-500">Iklan selingan di antara kartu berita homepage</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={adsConfig.feedActive}
                      onChange={(e) => setAdsConfig({ ...adsConfig, feedActive: e.target.checked })}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Live ads.txt Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Konten File ads.txt (Disediakan di /ads.txt)
                  </label>
                  <a
                    href="/ads.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Buka /ads.txt Publik <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <textarea
                  rows={3}
                  value={adsConfig.adsTxtContent}
                  onChange={(e) => setAdsConfig({ ...adsConfig, adsTxtContent: e.target.value })}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-200 border border-slate-700 rounded-lg focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Format resmi Google: <code>google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code>
                </p>
              </div>
            </div>

            {/* AdSense Approval Checklist Box */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Panduan Kesiapan Menghasilkan Uang dari Google AdSense
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">1. Halaman Kebijakan Pers & Hukum</div>
                  <p className="text-[11px] text-slate-600">
                    RUANGTREN telah menyediakan 6 halaman wajib: Pedoman Siber, Kebijakan Privasi, Disclaimer, Tentang Kami, Redaksi, dan Kontak.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">2. Konten Artikel Orisinal</div>
                  <p className="text-[11px] text-slate-600">
                    Terbitkan minimal 15–20 berita unik melalui CMS ini dengan informasi faktual sebelum mengajukan audit domain ke Google AdSense.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">3. Navigasi Jelas & Kecepatan Web</div>
                  <p className="text-[11px] text-slate-600">
                    Desain portal tanpa jebakan klik (*no invalid traffic*) dan mematuhi Better Ads Standards.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">4. Verifikasi Kepemilikan ads.txt</div>
                  <p className="text-[11px] text-slate-600">
                    Crawler Google dapat langsung memverifikasi file /ads.txt secara otomatis tanpa perlu setup FTP rumit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: RISET TOPIK TRENDING                              */}
        {/* ======================================================== */}
        {activeTab === 'trending' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                  <span>Riset Topik Berita Trending & Viral</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Pantau topik hangat yang ramai dibicarakan masyarakat untuk dijadikan bahan liputan berita mandiri terverifikasi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-rose-600 uppercase tracking-wider text-[11px]">
                        {topic.category}
                      </span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {topic.searchVolume}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif mb-2">
                      {topic.topic}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{topic.summary}</p>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
                      <strong className="text-slate-800 block text-[11px] uppercase mb-0.5">
                        Catatan Editor:
                      </strong>
                      <span>{topic.editorNotes}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <a
                      href={topic.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Sumber: {topic.sourceName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleUseTrendingTopic(topic)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Buat Berita Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: BACKUP & CLOUDFLARE D1                            */}
        {/* ======================================================== */}
        {activeTab === 'backup' && (
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-700" />
                <span>Pencadangan Database & Ekspor Cloudflare D1</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Database artikel Anda tersimpan secara persisten di server. Anda dapat mengunduh salinan migrasi Cloudflare D1 SQL kapan saja.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    File Migrasi SQL Cloudflare D1
                  </div>
                  <div className="text-xs text-slate-500">
                    Berisi skema tabel (categories, articles, pages, settings, ads) dan seluruh data artikel siap eksekusi di Cloudflare D1.
                  </div>
                </div>
                <a
                  href="/api/admin/d1-export"
                  download="ruangtren_cloudflare_d1_backup.sql"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh .SQL D1</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">
                Cara Mengimpor ke Cloudflare D1:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 font-mono text-[11px]">
                <li>npx wrangler d1 create ruangtren-db</li>
                <li>npx wrangler d1 execute ruangtren-db --file=ruangtren_cloudflare_d1_backup.sql</li>
                <li>Deploy server ke Cloudflare Pages atau Workers via wrangler deploy</li>
              </ol>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: PANDUAN LENGKAP PENGELOLAAN                       */}
        {/* ======================================================== */}
        {activeTab === 'guides' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
                Panduan Lengkap Pengelolaan Portal Berita RUANGTREN
              </h2>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-blue-900 text-sm mb-1">
                    1. Panduan Autentikasi Google OAuth 2.0
                  </h3>
                  <p className="mb-2">
                    Aplikasi ini menggunakan validasi whitelist server. Hanya alamat Gmail yang terdaftar di konfigurasi yang dapat mengakses panel admin ini:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Alamat terverifikasi saat ini: <code>yp892149@gmail.com</code> dan <code>rullganteng987@gmail.com</code>.</li>
                    <li>Untuk menambahkan admin lain, buka tab <strong>"Pengaturan Situs Mandiri"</strong> &gt; tambahkan email ke daftar.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-blue-900 text-sm mb-1">
                    2. Panduan Google Search Console (Agar Cepat Terindeks)
                  </h3>
                  <p className="mb-2">
                    Agar setiap artikel berita Anda muncul di pencarian Google:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Buka <code>search.google.com/search-console</code> dan masukkan URL domain Anda.</li>
                    <li>Buka menu <strong>Sitemaps</strong> di Search Console.</li>
                    <li>Masukkan URL sitemap: <code>https://domain-anda/sitemap.xml</code> dan klik Kirim.</li>
                    <li>Sitemap RUANGTREN otomatis memperbarui daftar artikel setiap kali Anda menerbitkan berita baru.</li>
                  </ol>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-blue-900 text-sm mb-1">
                    3. Panduan Pendaftaran Google AdSense (Mendapatkan Penghasilan)
                  </h3>
                  <p className="mb-2">
                    Langkah mengajukan akun Google AdSense:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Pastikan Anda telah menerbitkan minimal 15–20 berita orisinal.</li>
                    <li>Daftar di <code>adsense.google.com</code> menggunakan akun Google Anda.</li>
                    <li>Salin kode Publisher ID (misal: <code>ca-pub-1234567890</code>) ke tab <strong>"Google AdSense"</strong> di CMS ini.</li>
                    <li>Salin baris record ads.txt yang diberikan Google ke kolom ads.txt.</li>
                    <li>Tunggu tim peninjau Google memeriksa website (biasanya 2-7 hari kerja).</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
