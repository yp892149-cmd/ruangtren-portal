import React, { useEffect } from 'react';
import { ArrowLeft, Clock, Eye, Share2, Facebook, Twitter, MessageCircle, Copy, Check, ChevronRight } from 'lucide-react';
import { Article, AdsConfig } from '../types/index.ts';
import { AdSenseSlot } from './AdSenseSlot.tsx';
import { ArticleCard } from './ArticleCard.tsx';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  adsConfig: AdsConfig;
  onBack: () => void;
  onSelectCategory: (category: string) => void;
  onSelectArticle: (slug: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  relatedArticles,
  adsConfig,
  onBack,
  onSelectCategory,
  onSelectArticle,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Sync document title and canonical URL in browser
  useEffect(() => {
    document.title = `${article.seoTitle || article.title} — RUANGTREN`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      document.title = 'RUANGTREN — Berita Terkini, Informasi Terpercaya';
    };
  }, [article]);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(article.publishedAt));

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`${article.title}\nBaca selengkapnya di RUANGTREN: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @ruangtren`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank');
  };

  // Split content to insert In-Article Native AdSense after paragraph 2
  const renderContentWithInArticleAd = () => {
    const paragraphs = article.content.split('</p>');
    if (paragraphs.length <= 2) {
      return (
        <div
          className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base sm:text-[17px] space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      );
    }

    const firstHalf = paragraphs.slice(0, 2).join('</p>') + '</p>';
    const secondHalf = paragraphs.slice(2).join('</p>');

    return (
      <div className="text-slate-800 leading-relaxed text-base sm:text-[17px]">
        <div
          className="prose prose-slate max-w-none space-y-4 mb-4"
          dangerouslySetInnerHTML={{ __html: firstHalf }}
        />

        {/* High CTR In-Article AdSense Native Unit */}
        <AdSenseSlot position="in-article" adsConfig={adsConfig} className="my-6" />

        <div
          className="prose prose-slate max-w-none space-y-4 mt-4"
          dangerouslySetInnerHTML={{ __html: secondHalf }}
        />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={onBack} className="hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Beranda
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <button
          onClick={() => onSelectCategory(article.category.toLowerCase())}
          className="hover:text-blue-700 font-medium"
        >
          {article.category}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-400 truncate max-w-xs sm:max-w-md">{article.title}</span>
      </nav>

      {/* 2. Top Leaderboard Ad */}
      <AdSenseSlot position="header" adsConfig={adsConfig} className="mb-6" />

      {/* 3. Article Split Layout: 70% Content / 30% Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Article Body (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 sm:p-8 shadow-xs">
          {/* Category kicker */}
          <div className="text-xs uppercase tracking-wider font-bold text-rose-600 mb-2">
            {article.category}
          </div>

          {/* Headline */}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif leading-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h1>

          {/* Author & Timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 py-3 border-y border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">{article.author}</span>
              <span aria-hidden="true">·</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> 3 menit baca
              </span>
              <span className="flex items-center gap-1 text-slate-400 tabular-nums">
                <Eye className="w-3.5 h-3.5" /> {article.views || 0} pembaca
              </span>
            </div>
          </div>

          {/* Social Share Strip */}
          <div className="flex items-center gap-2 mb-6 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5 mr-1">
              <Share2 className="w-3.5 h-3.5" /> Bagikan:
            </span>
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </button>
            <button
              onClick={shareViaFacebook}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" /> Facebook
            </button>
            <button
              onClick={shareViaTwitter}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-black text-white rounded transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" /> X
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors ml-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <figure className="mb-6">
              <div className="rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
              <figcaption className="text-xs text-slate-500 italic mt-2 text-center">
                Foto: Dokumentasi Redaksi {article.author} / RUANGTREN
              </figcaption>
            </figure>
          )}

          {/* Lead Summary */}
          {article.summary && (
            <div className="font-medium text-slate-700 text-base sm:text-lg leading-relaxed mb-6 italic border-l-2 border-blue-700 pl-4 py-1">
              {article.summary}
            </div>
          )}

          {/* Article HTML Body with In-Article Native Ad */}
          <div className="article-body">
            {renderContentWithInArticleAd()}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Topik Terkait
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Article Multiplex Ad */}
          <AdSenseSlot position="bottom-article" adsConfig={adsConfig} className="mt-8 pt-4 border-t border-slate-100" />

          {/* Author Signoff Box */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-900 shrink-0">
              <img
                src="/src/assets/images/avatar_admin_journalist_1794078378846.jpg"
                alt={article.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">{article.author}</div>
              <p className="text-[11px] text-slate-500">
                Jurnalis & Dewan Redaksi RUANGTREN. Melaporkan berita aktual, terverifikasi, dan mendalam untuk masyarakat Indonesia.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Sidebar Sticky AdSense Banner */}
          <AdSenseSlot position="sidebar" adsConfig={adsConfig} />

          {/* Related Articles Widget */}
          {relatedArticles.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 mb-3 border-b-2 border-blue-900">
                Berita Terkait {article.category}
              </h3>
              <div className="space-y-3">
                {relatedArticles.slice(0, 5).map((rel, idx) => (
                  <ArticleCard
                    key={rel.id}
                    article={rel}
                    variant="popular-row"
                    rankIndex={idx}
                    onClick={onSelectArticle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pedoman Redaksi Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-900 leading-relaxed">
            <div className="font-bold mb-1">Pedoman Hak Jawab</div>
            <p className="text-[11px] text-blue-800">
              RUANGTREN menghormati hak jawab dan hak koreksi sesuai Kode Etik Jurnalistik. Silakan hubungi email redaksi@ruangtren.com untuk permohonan klarifikasi berita.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
