import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';
import { generateSitemapXml, generateRobotsTxt, generateRssFeed, getBaseUrl } from './src/server/seo.ts';
import { isEmailAuthorized, createAdminSession, verifySessionToken, destroySession, requireAdminAuth, getAllowedAdminEmails } from './src/server/auth.ts';
import { generateCloudflareD1MigrationSQL } from './src/server/d1Export.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// -------------------------------------------------------------
// 1. PUBLIC SEO & CRAWLER ENDPOINTS
// -------------------------------------------------------------

// Dynamic Sitemap XML
app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')
    ? process.env.APP_URL.replace(/\/$/, '')
    : `${protocol}://${host}`;

  const xml = generateSitemapXml(baseUrl);
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')
    ? process.env.APP_URL.replace(/\/$/, '')
    : `${protocol}://${host}`;

  const robots = generateRobotsTxt(baseUrl);
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

// RSS Feed
app.get(['/feed.xml', '/rss.xml', '/feed'], (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')
    ? process.env.APP_URL.replace(/\/$/, '')
    : `${protocol}://${host}`;

  const feed = generateRssFeed(baseUrl);
  res.header('Content-Type', 'application/rss+xml; charset=utf-8');
  res.send(feed);
});

// Google AdSense ads.txt (Essential for AdSense verification & monetization)
app.get('/ads.txt', (req, res) => {
  const ads = db.getAdsConfig();
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(ads.adsTxtContent || `google.com, pub-${ads.publisherId.replace('ca-pub-', '')}, DIRECT, f08c47fec0942fa0\n`);
});

// -------------------------------------------------------------
// 2. PUBLIC REST API ROUTES
// -------------------------------------------------------------

// Get published articles
app.get('/api/articles', (req, res) => {
  const { category, search, tag, limit, offset } = req.query;
  const result = db.getArticles({
    status: 'published',
    category: category as string,
    search: search as string,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
  });
  res.json({ success: true, ...result });
});

// Get single article by slug
app.get('/api/articles/:slug', (req, res) => {
  const { slug } = req.params;
  const article = db.getArticleBySlug(slug);
  if (!article) {
    return res.status(404).json({ success: false, error: 'Berita tidak ditemukan' });
  }
  // Increment view count
  db.incrementViews(slug);
  res.json({ success: true, article });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = db.getCategories();
  res.json({ success: true, categories });
});

// Get static pages
app.get('/api/pages', (req, res) => {
  const pages = db.getPages();
  res.json({ success: true, pages });
});

app.get('/api/pages/:slug', (req, res) => {
  const page = db.getPageBySlug(req.params.slug);
  if (!page) {
    return res.status(404).json({ success: false, error: 'Halaman tidak ditemukan' });
  }
  res.json({ success: true, page });
});

// Get site settings
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  // Strip sensitive info like raw admin emails list for public viewers
  const publicSettings = {
    ...settings,
    adminEmailsCount: settings.adminEmails.length,
  };
  res.json({ success: true, settings: publicSettings });
});

// Get Ads configuration
app.get('/api/ads', (req, res) => {
  const ads = db.getAdsConfig();
  res.json({ success: true, ads });
});

// Public Trending topics
app.get('/api/trending', (req, res) => {
  const topics = db.getTrendingTopics();
  res.json({ success: true, topics });
});

// -------------------------------------------------------------
// 3. AUTHENTICATION (Google OAuth 2.0 & Admin Gate)
// -------------------------------------------------------------

// Check Session
app.get('/api/auth/check', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.substring(7);
  const session = verifySessionToken(token);
  if (!session) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, user: session });
});

// Google Identity / OAuth Login
app.post('/api/auth/google', async (req, res) => {
  const { credential, email, name, picture } = req.body;

  let verifiedEmail = '';
  let verifiedName = 'Admin RUANGTREN';
  let verifiedPicture = picture || '';

  // If a JWT credential was supplied from Google One-Tap / Identity Services
  if (credential) {
    try {
      // Decode JWT payload without external library
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        verifiedEmail = payload.email || '';
        verifiedName = payload.name || verifiedName;
        verifiedPicture = payload.picture || verifiedPicture;
      }
    } catch (err) {
      console.error('Failed to parse Google credential token:', err);
    }
  }

  // Fallback to provided direct credentials
  if (!verifiedEmail && email) {
    verifiedEmail = email.trim();
    if (name) verifiedName = name.trim();
  }

  if (!verifiedEmail) {
    return res.status(400).json({
      success: false,
      error: 'Data akun Google tidak valid. Silakan coba kembali.',
    });
  }

  // Verify against whitelist
  if (!isEmailAuthorized(verifiedEmail)) {
    return res.status(403).json({
      success: false,
      error: `Akses Ditolak: Alamat email (${verifiedEmail}) tidak terdaftar dalam daftar Administrator RUANGTREN. Hanya pemilik terverifikasi yang dapat masuk ke dashboard.`,
    });
  }

  // Create session
  const token = createAdminSession(verifiedEmail, verifiedName, verifiedPicture);

  res.json({
    success: true,
    token,
    user: {
      email: verifiedEmail,
      name: verifiedName,
      picture: verifiedPicture,
      role: 'owner',
    },
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    destroySession(authHeader.substring(7));
  }
  res.json({ success: true, message: 'Berhasil logout' });
});

// -------------------------------------------------------------
// 4. PROTECTED ADMIN API ROUTES (requireAdminAuth)
// -------------------------------------------------------------

// Get all articles (including drafts & scheduled)
app.get('/api/admin/articles', requireAdminAuth, (req, res) => {
  const { category, status, search } = req.query;
  const result = db.getArticles({
    category: category as string,
    status: status as string,
    search: search as string,
  });
  res.json({ success: true, ...result });
});

// Create article
app.post('/api/admin/articles', requireAdminAuth, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const article = db.createArticle({
      ...req.body,
      author: req.body.author || adminUser?.name || 'Redaksi RUANGTREN',
    });
    res.json({ success: true, article, message: 'Berita berhasil disimpan & diterbitkan!' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Gagal menyimpan artikel' });
  }
});

// Update article
app.put('/api/admin/articles/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const updated = db.updateArticle(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
  }
  res.json({ success: true, article: updated, message: 'Perubahan artikel berhasil disimpan!' });
});

// Delete article
app.delete('/api/admin/articles/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteArticle(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
  }
  res.json({ success: true, message: 'Artikel berhasil dihapus' });
});

// Dashboard Statistics
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  const stats = db.getStats();
  res.json({ success: true, stats });
});

// Update site settings
app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated, message: 'Pengaturan situs berhasil diperbarui!' });
});

// Get admin settings including adminEmails whitelist
app.get('/api/admin/settings', requireAdminAuth, (req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, settings, allowedEmails: getAllowedAdminEmails() });
});

// Update ads config
app.put('/api/admin/ads', requireAdminAuth, (req, res) => {
  const updated = db.updateAdsConfig(req.body);
  res.json({ success: true, ads: updated, message: 'Pengaturan Google AdSense berhasil disimpan!' });
});

// Update static page
app.put('/api/admin/pages/:slug', requireAdminAuth, (req, res) => {
  const { slug } = req.params;
  const existing = db.getPageBySlug(slug);
  const updated = db.savePage({
    id: existing?.id || `page-${slug}`,
    slug,
    title: req.body.title || existing?.title || slug,
    content: req.body.content || '',
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, page: updated, message: 'Halaman berhasil diperbarui!' });
});

// Manage Categories
app.post('/api/admin/categories', requireAdminAuth, (req, res) => {
  const { name, description, sortOrder } = req.body;
  const slug = (req.body.slug || name || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const cat = db.saveCategory({
    id: req.body.id || `cat-${Date.now()}`,
    name,
    slug,
    description: description || '',
    sortOrder: typeof sortOrder === 'number' ? sortOrder : 99,
  });
  res.json({ success: true, category: cat, message: 'Kategori berhasil disimpan' });
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req, res) => {
  db.deleteCategory(req.params.id);
  res.json({ success: true, message: 'Kategori berhasil dihapus' });
});

// Manage Trending Topics
app.post('/api/admin/trending', requireAdminAuth, (req, res) => {
  const topic = db.saveTrendingTopic({
    id: req.body.id || `tr-${Date.now()}`,
    topic: req.body.topic,
    category: req.body.category || 'Nasional',
    searchVolume: req.body.searchVolume || 'Volume tinggi',
    trendScore: req.body.trendScore || 85,
    summary: req.body.summary || '',
    referenceUrl: req.body.referenceUrl || '',
    sourceName: req.body.sourceName || 'Riset Media',
    publishedDate: new Date().toLocaleDateString('id-ID'),
    editorNotes: req.body.editorNotes || '',
  });
  res.json({ success: true, topic, message: 'Topik trending berhasil disimpan' });
});

app.delete('/api/admin/trending/:id', requireAdminAuth, (req, res) => {
  db.deleteTrendingTopic(req.params.id);
  res.json({ success: true, message: 'Topik trending berhasil dihapus' });
});

// Cloudflare D1 Migration SQL Export
app.get('/api/admin/d1-export', requireAdminAuth, (req, res) => {
  const sql = generateCloudflareD1MigrationSQL();
  res.header('Content-Type', 'application/sql; charset=utf-8');
  res.attachment('ruangtren_cloudflare_d1_backup.sql');
  res.send(sql);
});

// -------------------------------------------------------------
// 5. CRAWLER SSR META INJECTION & VITE/SPA SERVING
// -------------------------------------------------------------

// Helper to inject OpenGraph & Schema.org NewsArticle into index.html for crawlers
function injectArticleMeta(html: string, slug: string, baseUrl: string): string {
  const article = db.getArticleBySlug(slug);
  if (!article) return html;

  const title = `${article.seoTitle || article.title} — RUANGTREN`;
  const desc = article.metaDescription || article.summary;
  const canonical = `${baseUrl}/berita/${article.slug}`;
  const image = article.imageUrl.startsWith('http') ? article.imageUrl : `${baseUrl}${article.imageUrl}`;

  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': desc,
    'image': [image],
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt,
    'author': [{
      '@type': 'Person',
      'name': article.author,
    }],
    'publisher': {
      '@type': 'Organization',
      'name': 'RUANGTREN',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.png`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonical,
    },
  });

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />\n    <link rel="canonical" href="${canonical}" />\n    <script type="application/ld+json">${schemaJson}</script>`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />`)
    .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`);
}

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    // Custom route handler for SSR crawler / direct article URLs
    app.get(['/berita/:slug', '/kategori/:name', '/halaman/:slug', '/admin', '*'], async (req, res, next) => {
      // If it's an asset or API request, let next() handle it
      if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/@') || req.originalUrl.includes('.')) {
        return next();
      }

      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        // Check if article request
        const articleMatch = url.match(/^\/berita\/([^/?#]+)/);
        if (articleMatch) {
          const host = req.get('host') || 'localhost:3000';
          const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
          const baseUrl = `${protocol}://${host}`;
          template = injectArticleMeta(template, articleMatch[1], baseUrl);
        }

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));

    app.get('*', (req, res) => {
      let template = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'), 'utf-8');
      const articleMatch = req.originalUrl.match(/^\/berita\/([^/?#]+)/);
      if (articleMatch) {
        const host = req.get('host') || 'localhost:3000';
        const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;
        template = injectArticleMeta(template, articleMatch[1], baseUrl);
      }
      res.send(template);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RUANGTREN Server] Running at http://localhost:${PORT}`);
    console.log(`[RUANGTREN Server] Allowed Admin Emails: ${getAllowedAdminEmails().join(', ')}`);
  });
}

startServer();
