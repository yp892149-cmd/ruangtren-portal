import { db } from './db.ts';

export function getBaseUrl(reqUrl?: string): string {
  if (process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  return 'https://ruangtren.com';
}

export function generateSitemapXml(baseUrl: string): string {
  const articlesResult = db.getArticles({ status: 'published' });
  const categories = db.getCategories();
  const pages = db.getPages();
  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Categories
  for (const cat of categories) {
    xml += `  <url>
    <loc>${baseUrl}/kategori/${cat.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }

  // Static Policy & Editorial Pages
  for (const p of pages) {
    const mod = p.updatedAt ? p.updatedAt.split('T')[0] : now;
    xml += `  <url>
    <loc>${baseUrl}/halaman/${p.slug}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
  }

  // Published Articles (High priority for Google News & Search)
  for (const a of articlesResult.articles) {
    const pubDate = a.publishedAt ? a.publishedAt.split('T')[0] : now;
    const cleanTitle = a.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    xml += `  <url>
    <loc>${baseUrl}/berita/${a.slug}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <news:news>
      <news:publication>
        <news:name>RUANGTREN</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt || new Date().toISOString()}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
    </news:news>
  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

# Googlebot specific rules
User-agent: Googlebot
Allow: /
Allow: /berita/
Allow: /kategori/
Allow: /halaman/
Allow: /ads.txt

# Google AdSense Mediapartners bot
User-agent: Mediapartners-Google
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

export function generateRssFeed(baseUrl: string): string {
  const articlesResult = db.getArticles({ status: 'published', limit: 30 });
  const settings = db.getSettings();
  const now = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${settings.siteName} — ${settings.tagline}</title>
    <link>${baseUrl}</link>
    <description>${settings.description}</description>
    <language>id-ID</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
`;

  for (const art of articlesResult.articles) {
    const pubDate = art.publishedAt ? new Date(art.publishedAt).toUTCString() : now;
    const cleanTitle = art.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanSummary = art.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    xml += `    <item>
      <title>${cleanTitle}</title>
      <link>${baseUrl}/berita/${art.slug}</link>
      <guid isPermaLink="true">${baseUrl}/berita/${art.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${art.category}</category>
      <author>${art.author || 'Redaksi RUANGTREN'}</author>
      <description><![CDATA[${cleanSummary}]]></description>
      <content:encoded><![CDATA[${art.content}]]></content:encoded>
    </item>\n`;
  }

  xml += `  </channel>
</rss>`;
  return xml;
}
