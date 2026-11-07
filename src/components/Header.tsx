import React, { useState } from 'react';
import { Search, Shield, LogOut, ChevronRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { SiteSettings, Category, AdminUser } from '../types/index.ts';

interface HeaderProps {
  settings: SiteSettings;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onOpenAdminLogin: () => void;
  adminUser: AdminUser | null;
  onOpenAdminDashboard: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  latestHeadlines?: string[];
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  categories,
  activeCategory,
  onSelectCategory,
  onOpenAdminLogin,
  adminUser,
  onOpenAdminDashboard,
  onLogout,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  latestHeadlines = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Formatted Indonesian date
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Utility Top Bar: Date, Announcement & Admin Gate */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-medium text-slate-200 hidden sm:inline">{todayFormatted}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-blue-400 font-semibold uppercase tracking-wider text-[11px]">Media Siber Nasional</span>
          </div>

          {/* Announcement or Breaking News Ticker */}
          <div className="truncate flex-1 text-center sm:text-left text-slate-300 font-normal text-[11px] sm:text-xs">
            {settings.announcementActive && settings.announcementText ? (
              <span className="hover:text-white transition-colors">{settings.announcementText}</span>
            ) : latestHeadlines.length > 0 ? (
              <span className="hover:text-white transition-colors">
                <span className="text-rose-400 font-bold mr-1.5">TERKINI:</span> {latestHeadlines[0]}
              </span>
            ) : (
              <span>RUANGTREN — Portal Berita Terkini & Informasi Terpercaya</span>
            )}
          </div>

          {/* Admin Login / Dashboard Quick Button */}
          <div className="flex items-center gap-2 shrink-0">
            {adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdminDashboard}
                  className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
                  title="Masuk ke Dashboard CMS"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden sm:inline">Dashboard Admin</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors text-[11px]"
                title="Login Khusus Administrator RUANGTREN"
              >
                <Shield className="w-3 h-3 text-slate-400" />
                <span>Login Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header (Top Bar Contract: 3 Zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single element Brand Wordmark */}
        <div className="flex items-baseline gap-3 shrink-0">
          <button
            onClick={() => onSelectCategory('all')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-950 font-serif group-hover:text-blue-900 transition-colors">
                RUANG<span className="text-blue-700">TREN</span>
              </span>
            </div>
            <p className="text-[10px] tracking-wide text-slate-500 uppercase font-medium hidden sm:block">
              {settings.tagline || 'Berita Terkini, Informasi Terpercaya'}
            </p>
          </button>
        </div>

        {/* Zone 2: Clean 4–5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'all' ? 'text-blue-700 border-b-2 border-blue-700 pb-0.5' : 'hover:text-blue-900'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onSelectCategory('nasional')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'nasional' ? 'text-blue-700 border-b-2 border-blue-700 pb-0.5' : 'hover:text-blue-900'
            }`}
          >
            Nasional
          </button>
          <button
            onClick={() => onSelectCategory('politik')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'politik' ? 'text-blue-700 border-b-2 border-blue-700 pb-0.5' : 'hover:text-blue-900'
            }`}
          >
            Politik
          </button>
          <button
            onClick={() => onSelectCategory('ekonomi')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'ekonomi' ? 'text-blue-700 border-b-2 border-blue-700 pb-0.5' : 'hover:text-blue-900'
            }`}
          >
            Ekonomi
          </button>
          <button
            onClick={() => onSelectCategory('teknologi')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'teknologi' ? 'text-blue-700 border-b-2 border-blue-700 pb-0.5' : 'hover:text-blue-900'
            }`}
          >
            Teknologi
          </button>
          <button
            onClick={() => onSelectCategory('viral')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'viral' ? 'text-rose-600 font-bold border-b-2 border-rose-600 pb-0.5' : 'text-rose-600 hover:text-rose-800'
            }`}
          >
            Viral
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Search & Mobile Menu Toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <form onSubmit={onSearchSubmit} className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari berita terkini..."
              className="w-48 lg:w-60 pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-all text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </form>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-900 transition-colors"
            aria-label="Cari berita"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-blue-900 transition-colors"
            aria-label="Menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 md:hidden">
          <form onSubmit={onSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ketik kata kunci berita..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-700"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 text-xs font-semibold rounded hover:bg-blue-900"
            >
              Cari
            </button>
          </form>
        </div>
      )}

      {/* 3. Sub-Navigation Bar: 12 Categories Horizontal Rail */}
      <div className="bg-slate-100/90 border-t border-slate-200 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-1 py-1 whitespace-nowrap text-xs font-medium text-slate-700">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded transition-colors shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-900 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => {
            const isCatActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-3 py-1.5 rounded transition-colors shrink-0 cursor-pointer ${
                  isCatActive
                    ? 'bg-blue-900 text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-300 py-3 px-6 space-y-2 text-sm font-medium text-slate-800 shadow-lg">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Kategori Berita</span>
            {adminUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminDashboard();
                }}
                className="text-xs text-blue-700 font-bold flex items-center gap-1"
              >
                Dashboard Admin <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-slate-700 hover:text-blue-900 flex items-center gap-1"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span>Semua Kategori</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCategory(c.slug);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 text-slate-700 hover:text-blue-900 flex items-center gap-1"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
