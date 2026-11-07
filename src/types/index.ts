export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  author: string;
  status: ArticleStatus;
  views: number;
  publishedAt: string;
  updatedAt: string;
  scheduledAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeywords?: string;
  isHeadline?: boolean;
  isEditorsPick?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  announcementText: string;
  announcementActive: boolean;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  adminEmails: string[];
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  navMenu: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
  }>;
}

export interface AdsConfig {
  publisherId: string;
  autoAdsEnabled: boolean;
  headerActive: boolean;
  sidebarActive: boolean;
  inArticleActive: boolean;
  bottomArticleActive: boolean;
  feedActive: boolean;
  adsTxtContent: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  category: string;
  searchVolume: string;
  trendScore: number;
  summary: string;
  referenceUrl: string;
  sourceName: string;
  publishedDate: string;
  editorNotes: string;
}

export interface AdminUser {
  email: string;
  name: string;
  picture?: string;
  role: 'owner' | 'editor';
}
