import React from 'react';
import { ArrowLeft, Shield, Calendar } from 'lucide-react';
import { StaticPage as PageType } from '../types/index.ts';

interface StaticPageViewProps {
  page: PageType;
  onBack: () => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({ page, onBack }) => {
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(page.updatedAt || new Date()));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </button>

      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" />
          <span>Regulasi & Standar Redaksi RUANGTREN</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-4 leading-tight">
          {page.title}
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-400 pb-4 mb-6 border-b border-slate-100">
          <Calendar className="w-3.5 h-3.5" />
          <span>Terakhir Diperbarui: {formattedDate}</span>
        </div>

        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};
