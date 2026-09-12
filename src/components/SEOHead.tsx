import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics.js';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
  breadcrumbs?: BreadcrumbItem[];
}

const DEFAULT_TITLE = 'DataSource Technology & Solutions | Enterprise Software, Cloud & Data Consulting';
const DEFAULT_DESC = 'DataSource is a technology and data consulting partner helping businesses design custom software, build scalable cloud architecture, deploy automated Power BI dashboards and engineer reliable data pipelines.';
const DEFAULT_KEYWORDS = 'technology consulting, software engineering, cloud architecture, data pipeline automation, Power BI dashboards, IT consulting, database migration, AI solutions';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop';
const BASE_URL = 'https://datasource.tech';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  schema,
  breadcrumbs,
}) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | DataSource Technology & Solutions` : DEFAULT_TITLE;
  const currentUrl = canonicalUrl || `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMeta = (nameAttr: 'name' | 'property', nameValue: string, content: string) => {
      let meta = document.querySelector(`meta[${nameAttr}="${nameValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, nameValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Open Graph Tags
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', 'DataSource Technology & Solutions');

    // 4. Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    // 6. JSON-LD Structured Data Schema
    const scriptId = 'seo-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaObjects: any[] = [];

    // Base Organization Schema
    schemaObjects.push({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'DataSource Technology & Solutions',
      url: BASE_URL,
      logo: `${BASE_URL}/datasource-icon.svg`,
      description: DEFAULT_DESC,
      email: 'contact@datasource.tech',
      priceRange: '$$$',
      areaServed: 'Global',
      serviceType: [
        'Custom Web & Cloud Applications',
        'Power BI Executive Dashboards',
        'Data Engineering & Pipeline Automation',
        'IT Strategy & Technology Assessment',
        'Database Architecture & Migration',
      ],
      sameAs: [
        'https://linkedin.com/company/datasource-tech',
        'https://twitter.com/datasourcetech',
        'https://github.com/datasourcetech',
      ],
    });

    // Breadcrumb Schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaObjects.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url.startsWith('http') ? b.url : `${BASE_URL}${b.url}`,
        })),
      });
    }

    // Custom Schema if passed
    if (schema) {
      if (Array.isArray(schema)) {
        schemaObjects.push(...schema);
      } else {
        schemaObjects.push(schema);
      }
    }

    script.textContent = JSON.stringify(schemaObjects.length === 1 ? schemaObjects[0] : schemaObjects);

    // 7. Track Google Analytics Page View
    trackPageView(location.pathname, fullTitle);
  }, [fullTitle, description, keywords, currentUrl, ogType, ogImage, JSON.stringify(schema), JSON.stringify(breadcrumbs)]);

  return null;
};
