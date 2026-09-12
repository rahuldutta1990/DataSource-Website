import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api.js';
import { loadDb } from './server/db.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Initialize and seed database
  loadDb();

  // Dynamic robots.txt
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Sitemap: ${process.env.APP_URL || 'https://datasource.tech'}/sitemap.xml
`);
  });

  // Dynamic sitemap.xml
  app.get('/sitemap.xml', (_req, res) => {
    const db = loadDb();
    const baseUrl = process.env.APP_URL || 'https://datasource.tech';
    const now = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      '',
      '/about',
      '/services',
      '/case-studies',
      '/insights',
      '/contact',
      '/privacy-policy',
      '/terms-and-conditions',
    ];

    let urlsXml = staticRoutes
      .map(
        (r) => `  <url>
    <loc>${baseUrl}${r}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r === '' ? '1.0' : '0.8'}</priority>
  </url>`
      )
      .join('\n');

    // Dynamic services
    const servicesXml = db.services
      .filter((s) => s.status === 'published')
      .map(
        (s) => `  <url>
    <loc>${baseUrl}/services/${s.slug}</loc>
    <lastmod>${s.updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('\n');

    // Dynamic case studies
    const caseStudiesXml = db.caseStudies
      .filter((c) => c.status === 'published')
      .map(
        (c) => `  <url>
    <loc>${baseUrl}/case-studies/${c.slug}</loc>
    <lastmod>${c.updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('\n');

    // Dynamic insights
    const insightsXml = db.blogPosts
      .filter((b) => b.status === 'published')
      .map(
        (b) => `  <url>
    <loc>${baseUrl}/insights/${b.slug}</loc>
    <lastmod>${b.updatedAt.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
${servicesXml}
${caseStudiesXml}
${insightsXml}
</urlset>`;

    res.type('application/xml');
    res.send(sitemap);
  });

  // Mount API Router
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'DataSource API & CMS Server', timestamp: new Date().toISOString() });
  });

  // Vite middleware for dev / static build for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DataSource Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[DataSource Server] Startup failure:', err);
  process.exit(1);
});
