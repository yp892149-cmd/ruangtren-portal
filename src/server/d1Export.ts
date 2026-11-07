import { db } from './db.ts';

export function generateCloudflareD1MigrationSQL(): string {
  const snapshot = db.getFullSnapshot();
  const timestamp = new Date().toISOString();

  let sql = `-- =========================================================
-- RUANGTREN — Cloudflare D1 Database Migration & Backup
-- Generated at: ${timestamp}
-- Engine Target: SQLite 3 / Cloudflare D1 (Workers & Pages)
-- 
-- How to apply to Cloudflare D1:
-- 1. Create your D1 database:
--    npx wrangler d1 create ruangtren-db
-- 2. Execute this migration script:
--    npx wrangler d1 execute ruangtren-db --file=ruangtren_d1_migration.sql
-- =========================================================

PRAGMA foreign_keys = ON;

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 2. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  tags TEXT, -- JSON array of tags
  author TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  views INTEGER NOT NULL DEFAULT 0,
  published_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  scheduled_at TEXT,
  seo_title TEXT,
  meta_description TEXT,
  focus_keywords TEXT,
  is_headline INTEGER NOT NULL DEFAULT 0,
  is_editors_pick INTEGER NOT NULL DEFAULT 0,
  is_trending INTEGER NOT NULL DEFAULT 0,
  is_popular INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);

-- 3. STATIC PAGES TABLE
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 5. ADS CONFIG TABLE
CREATE TABLE IF NOT EXISTS ads_config (
  id TEXT PRIMARY KEY,
  publisher_id TEXT NOT NULL,
  auto_ads_enabled INTEGER NOT NULL DEFAULT 1,
  header_active INTEGER NOT NULL DEFAULT 1,
  sidebar_active INTEGER NOT NULL DEFAULT 1,
  in_article_active INTEGER NOT NULL DEFAULT 1,
  bottom_article_active INTEGER NOT NULL DEFAULT 1,
  feed_active INTEGER NOT NULL DEFAULT 1,
  ads_txt_content TEXT NOT NULL
);

-- 6. TRENDING TOPICS TABLE
CREATE TABLE IF NOT EXISTS trending_topics (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  search_volume TEXT,
  trend_score INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  reference_url TEXT,
  source_name TEXT,
  published_date TEXT,
  editor_notes TEXT
);

-- =========================================================
-- DATA SEEDING / RESTORATION
-- =========================================================

`;

  // Seed Categories
  sql += `-- Categories (${snapshot.categories.length} records)\n`;
  for (const cat of snapshot.categories) {
    const escId = cat.id.replace(/'/g, "''");
    const escName = cat.name.replace(/'/g, "''");
    const escSlug = cat.slug.replace(/'/g, "''");
    const escDesc = (cat.description || '').replace(/'/g, "''");
    sql += `INSERT OR REPLACE INTO categories (id, name, slug, description, sort_order) VALUES ('${escId}', '${escName}', '${escSlug}', '${escDesc}', ${cat.sortOrder});\n`;
  }
  sql += `\n`;

  // Seed Pages
  sql += `-- Pages (${snapshot.pages.length} records)\n`;
  for (const p of snapshot.pages) {
    const escId = p.id.replace(/'/g, "''");
    const escSlug = p.slug.replace(/'/g, "''");
    const escTitle = p.title.replace(/'/g, "''");
    const escContent = p.content.replace(/'/g, "''");
    const escUpdated = p.updatedAt.replace(/'/g, "''");
    sql += `INSERT OR REPLACE INTO pages (id, slug, title, content, updated_at) VALUES ('${escId}', '${escSlug}', '${escTitle}', '${escContent}', '${escUpdated}');\n`;
  }
  sql += `\n`;

  // Seed Settings
  sql += `-- Site Settings\n`;
  const settingsJson = JSON.stringify(snapshot.settings).replace(/'/g, "''");
  sql += `INSERT OR REPLACE INTO settings (key, value) VALUES ('global_settings', '${settingsJson}');\n\n`;

  // Seed Ads Config
  sql += `-- Ads Config\n`;
  const ads = snapshot.adsConfig;
  const escPubId = ads.publisherId.replace(/'/g, "''");
  const escAdsTxt = ads.adsTxtContent.replace(/'/g, "''");
  sql += `INSERT OR REPLACE INTO ads_config (id, publisher_id, auto_ads_enabled, header_active, sidebar_active, in_article_active, bottom_article_active, feed_active, ads_txt_content) VALUES ('primary', '${escPubId}', ${ads.autoAdsEnabled ? 1 : 0}, ${ads.headerActive ? 1 : 0}, ${ads.sidebarActive ? 1 : 0}, ${ads.inArticleActive ? 1 : 0}, ${ads.bottomArticleActive ? 1 : 0}, ${ads.feedActive ? 1 : 0}, '${escAdsTxt}');\n\n`;

  // Seed Articles
  sql += `-- Articles (${snapshot.articles.length} records)\n`;
  for (const art of snapshot.articles) {
    const escId = art.id.replace(/'/g, "''");
    const escTitle = art.title.replace(/'/g, "''");
    const escSlug = art.slug.replace(/'/g, "''");
    const escSummary = art.summary.replace(/'/g, "''");
    const escContent = art.content.replace(/'/g, "''");
    const escImg = art.imageUrl.replace(/'/g, "''");
    const escThumb = (art.thumbnailUrl || art.imageUrl).replace(/'/g, "''");
    const escCat = art.category.replace(/'/g, "''");
    const escTags = JSON.stringify(art.tags || []).replace(/'/g, "''");
    const escAuthor = art.author.replace(/'/g, "''");
    const escStatus = art.status.replace(/'/g, "''");
    const escPubAt = art.publishedAt.replace(/'/g, "''");
    const escUpAt = art.updatedAt.replace(/'/g, "''");
    const escSeoTitle = (art.seoTitle || art.title).replace(/'/g, "''");
    const escMetaDesc = (art.metaDescription || art.summary).replace(/'/g, "''");
    const escFocus = (art.focusKeywords || '').replace(/'/g, "''");

    sql += `INSERT OR REPLACE INTO articles (id, title, slug, summary, content, image_url, thumbnail_url, category, tags, author, status, views, published_at, updated_at, seo_title, meta_description, focus_keywords, is_headline, is_editors_pick, is_trending, is_popular) VALUES ('${escId}', '${escTitle}', '${escSlug}', '${escSummary}', '${escContent}', '${escImg}', '${escThumb}', '${escCat}', '${escTags}', '${escAuthor}', '${escStatus}', ${art.views || 0}, '${escPubAt}', '${escUpAt}', '${escSeoTitle}', '${escMetaDesc}', '${escFocus}', ${art.isHeadline ? 1 : 0}, ${art.isEditorsPick ? 1 : 0}, ${art.isTrending ? 1 : 0}, ${art.isPopular ? 1 : 0});\n`;
  }

  return sql;
}
