import React from 'react';
import { AdsConfig } from '../types/index.ts';

interface AdSenseSlotProps {
  position: 'header' | 'sidebar' | 'in-article' | 'bottom-article' | 'feed';
  adsConfig: AdsConfig;
  className?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ position, adsConfig, className = '' }) => {
  // Check if this slot is active
  let isActive = false;
  let slotLabel = '';
  let slotDimensions = '';

  switch (position) {
    case 'header':
      isActive = adsConfig.headerActive;
      slotLabel = 'Header Leaderboard (728x90 / Responsif)';
      slotDimensions = 'h-[90px] max-w-[728px]';
      break;
    case 'sidebar':
      isActive = adsConfig.sidebarActive;
      slotLabel = 'Sidebar Half-Page / Rectangle (300x250 / 300x600)';
      slotDimensions = 'min-h-[250px] w-full max-w-[320px]';
      break;
    case 'in-article':
      isActive = adsConfig.inArticleActive;
      slotLabel = 'In-Article Native Ad (Responsif CTR Tinggi)';
      slotDimensions = 'min-h-[120px] w-full';
      break;
    case 'bottom-article':
      isActive = adsConfig.bottomArticleActive;
      slotLabel = 'Matched Content / Multiplex Ad (Bawah Artikel)';
      slotDimensions = 'min-h-[140px] w-full';
      break;
    case 'feed':
      isActive = adsConfig.feedActive;
      slotLabel = 'In-Feed Ad (Antara Daftar Berita)';
      slotDimensions = 'min-h-[100px] w-full';
      break;
  }

  if (!isActive) return null;

  const hasPublisherId = adsConfig.publisherId && !adsConfig.publisherId.includes('9988776655443322');

  return (
    <div className={`my-4 mx-auto overflow-hidden text-center ${className}`}>
      {/* Policy Compliant Ad Disclaimer Label */}
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 text-center font-medium">
        Advertisements / Iklan
      </div>

      {hasPublisherId ? (
        /* Real AdSense Unit */
        <div className={`mx-auto bg-white flex items-center justify-center border border-slate-200/60 rounded ${slotDimensions}`}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsConfig.publisherId}
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      ) : (
        /* Respectful Preview Container for AdSense Preparation */
        <div
          className={`mx-auto bg-slate-100/90 border border-dashed border-slate-300 rounded p-3 flex flex-col items-center justify-center text-slate-500 ${slotDimensions}`}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Slot Google AdSense — {slotLabel}</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md">
            Siap tayang setelah verifikasi akun AdSense. Publisher ID:{' '}
            <code className="text-slate-600 bg-slate-200 px-1 py-0.5 rounded text-[10px]">
              {adsConfig.publisherId || 'Belum diisi'}
            </code>
          </p>
        </div>
      )}
    </div>
  );
};
