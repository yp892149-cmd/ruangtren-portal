import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { Article } from '../types/index.ts';

interface ArticleCardProps {
  article: Article;
  variant?: 'headline' | 'standard' | 'popular-row' | 'compact';
  rankIndex?: number;
  onClick: (slug: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  rankIndex,
  onClick,
}) => {
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  const fallbackImage = '/src/assets/images/ruangtren_editorial_press_1794078379752.jpg';

  // --- 1. Variant: Lead Story / Headline ---
  if (variant === 'headline') {
    return (
      <article
        onClick={() => onClick(article.slug)}
        className="group cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
      >
        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
          <img
            src={article.imageUrl || fallbackImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
              <span className="uppercase tracking-wider">{article.category}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span className="text-white/80 font-normal">{formattedDate}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug font-serif text-white group-hover:text-blue-200 transition-colors" style={{ textWrap: 'balance' }}>
              {article.title}
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">{article.author}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 3 menit baca
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono tabular-nums text-slate-400">
              <Eye className="w-3.5 h-3.5" /> {article.views || 0}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // --- 2. Variant: Popular Row (Index 1-5 like Kompas/Detik) ---
  if (variant === 'popular-row') {
    return (
      <article
        onClick={() => onClick(article.slug)}
        className="group cursor-pointer flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0"
      >
        {typeof rankIndex === 'number' && (
          <div className="text-2xl font-black font-serif text-slate-300 group-hover:text-blue-700 transition-colors w-7 shrink-0 text-center tabular-nums">
            {rankIndex + 1}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-0.5">
            {article.category}
          </div>
          <h4
            className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-2 leading-snug"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums flex items-center gap-0.5">
              <Eye className="w-3 h-3" /> {article.views || 0}
            </span>
          </div>
        </div>
        {article.thumbnailUrl && (
          <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
            <img
              src={article.thumbnailUrl || article.imageUrl || fallbackImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>
        )}
      </article>
    );
  }

  // --- 3. Variant: Compact / Secondary Feature ---
  if (variant === 'compact') {
    return (
      <article
        onClick={() => onClick(article.slug)}
        className="group cursor-pointer flex gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="w-24 sm:w-28 aspect-4/3 rounded overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
          <img
            src={article.thumbnailUrl || article.imageUrl || fallbackImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-0.5">
              {article.category}
            </div>
            <h4
              className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-2 leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {article.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums flex items-center gap-0.5">
              <Eye className="w-3 h-3" /> {article.views || 0}
            </span>
          </div>
        </div>
      </article>
    );
  }

  // --- 4. Variant: Standard Feed Card ---
  return (
    <article
      onClick={() => onClick(article.slug)}
      className="group cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-all shadow-xs hover:shadow-sm flex flex-col"
    >
      <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 relative">
        <img
          src={article.imageUrl || fallbackImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
          {article.category}
        </div>
      </div>
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-2 leading-snug mb-2 font-serif"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
            {article.summary}
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span>{formattedDate}</span>
          <span className="tabular-nums flex items-center gap-1 text-slate-400">
            <Eye className="w-3 h-3" /> {article.views || 0}
          </span>
        </div>
      </div>
    </article>
  );
};
