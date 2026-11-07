import React from 'react';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { SiteSettings, Category } from '../types/index.ts';

interface FooterProps {
  settings: SiteSettings;
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onOpenPage: (slug: string) => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  onSelectCategory,
  onOpenPage,
  onOpenAdminLogin,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-16">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Identity & Editorial Mission */}
        <div className="space-y-3">
          <div className="text-xl font-bold tracking-tight text-white font-serif">
            RUANG<span className="text-blue-500">TREN</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[13px]">
            {settings.description ||
              'Portal berita digital independen berstandar nasional menyajikan informasi terpercaya, aktual, dan berimbang untuk kemajuan masyarakat Indonesia.'}
          </p>
          <div className="pt-2 text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{settings.contactAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{settings.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{settings.contactPhone}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Kategori Utama */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
            Kategori Berita
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Col 3: Kebijakan & Regulasi Media (AdSense Mandatory Pages) */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
            Redaksi & Kepatuhan
          </div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onOpenPage('pedoman-media-siber')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Pedoman Pemberitaan Media Siber
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPage('kebijakan-privasi')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Kebijakan Privasi (Privacy Policy)
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPage('disclaimer')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Sanggahan & Disclaimer
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPage('tentang-kami')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Tentang Kami
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPage('susunan-redaksi')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Susunan Dewan Redaksi
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPage('kontak')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Kontak & Hak Jawab
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Dewan Pers & SEO Links */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
            Standar Jurnalistik
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            RUANGTREN tunduk pada Kode Etik Jurnalistik dan Undang-Undang No. 40 Tahun 1999 tentang Pers serta mengutamakan akurasi dan keberimbangan fakta.
          </p>
          <div className="space-y-1.5 pt-1">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
            >
              <span>Peta Situs (Sitemap XML)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
            >
              <span>Sindikasi Berita (RSS Feed)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/ads.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
            >
              <span>Verifikasi Google ads.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Bottom Copyright & Admin Gateway Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-slate-300">{settings.siteName}</strong>. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Ditenagai oleh CMS Mandiri RUANGTREN</span>
            <span>·</span>
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Portal Masuk Redaksi</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
