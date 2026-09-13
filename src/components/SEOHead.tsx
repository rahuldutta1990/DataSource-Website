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

    // 6. JSON-LD Structured Data Schema with Enhanced LocalBusiness and Multi-Location Indian Hubs
    const scriptId = 'seo-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaObjects: any[] = [];

    // Base Organization & LocalBusiness Schema (India Headquarters)
    schemaObjects.push({
      '@context': 'https://schema.org',
      '@type': ['ProfessionalService', 'LocalBusiness', 'ITService'],
      '@id': `${BASE_URL}/#organization`,
      name: 'DataSource Technology & Solutions',
      alternateName: 'DataSource Tech India',
      url: BASE_URL,
      logo: `${BASE_URL}/datasource-icon.svg`,
      image: DEFAULT_OG_IMAGE,
      description: DEFAULT_DESC,
      telephone: '+91 9038417437',
      email: 'rd14190@gmail.com',
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR, USD, EUR, GBP',
      paymentAccepted: 'Bank Wire, NEFT/RTGS, UPI, Corporate Credit Card',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Outer Ring Rd, Bellandur Tech Corridor',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560103',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 12.926,
        longitude: 77.6762,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:30',
          closes: '18:30',
        },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-9038417437',
          contactType: 'sales',
          email: 'india@datasource.tech',
          areaServed: ['IN', 'US', 'GB', 'Worldwide'],
          availableLanguage: ['English', 'Hindi', 'Bengali'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+91-9038417437',
          contactType: 'technical support',
          email: 'support@datasource.tech',
          areaServed: ['IN', 'Worldwide'],
          availableLanguage: ['English', 'Hindi'],
        },
      ],
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'City', name: 'Bengaluru' },
        { '@type': 'City', name: 'Mumbai' },
        { '@type': 'City', name: 'Kolkata' },
        { '@type': 'City', name: 'Delhi NCR' },
        { '@type': 'City', name: 'Hyderabad' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
      ],
      serviceType: [
        'Custom Web & Cloud Applications',
        'Power BI Executive Dashboards',
        'Data Engineering & Pipeline Automation',
        'IT Strategy & Technology Assessment',
        'Database Architecture & Migration',
        'UI/UX Enterprise Product Design',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Enterprise Consulting & Engineering Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Web & Cloud Applications',
              description: 'Enterprise full-stack web and cloud software engineered with React, Node.js and AWS/GCP.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Power BI Executive Dashboards',
              description: 'Custom Power BI dashboards, DAX modeling, automated refreshes, and KPI scorecards.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Data Engineering & Pipeline Automation',
              description: 'Modern ETL/ELT pipelines, Snowflake and BigQuery data warehousing, and Airflow orchestration.',
            },
          },
        ],
      },
      department: [
        {
          '@type': 'LocalBusiness',
          name: 'DataSource Mumbai Financial & Enterprise Hub',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Bandra Kurla Complex (BKC), G Block, Bandra East',
            addressLocality: 'Mumbai',
            addressRegion: 'Maharashtra',
            postalCode: '400051',
            addressCountry: 'IN',
          },
          geo: { '@type': 'GeoCoordinates', latitude: 19.0657, longitude: 72.8687 },
          telephone: '+91 9038417437',
          email: 'mumbai@datasource.tech',
        },
        {
          '@type': 'LocalBusiness',
          name: 'DataSource Kolkata Eastern Innovation Lab',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Salt Lake Sector V, Bidhannagar',
            addressLocality: 'Kolkata',
            addressRegion: 'West Bengal',
            postalCode: '700091',
            addressCountry: 'IN',
          },
          geo: { '@type': 'GeoCoordinates', latitude: 22.5801, longitude: 88.4312 },
          telephone: '+91 9038417437',
          email: 'kolkata@datasource.tech',
        },
        {
          '@type': 'LocalBusiness',
          name: 'DataSource Delhi NCR Technology Hub',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'DLF Cyber City, Building 10, DLF Phase 2',
            addressLocality: 'Gurugram',
            addressRegion: 'Haryana',
            postalCode: '122002',
            addressCountry: 'IN',
          },
          geo: { '@type': 'GeoCoordinates', latitude: 28.4908, longitude: 77.0898 },
          telephone: '+91 9038417437',
          email: 'delhi@datasource.tech',
        },
        {
          '@type': 'LocalBusiness',
          name: 'DataSource Hyderabad Cyberabad Tech Lab',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'HITEC City, Madhapur',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            postalCode: '500081',
            addressCountry: 'IN',
          },
          geo: { '@type': 'GeoCoordinates', latitude: 17.4474, longitude: 78.3762 },
          telephone: '+91 9038417437',
          email: 'hyderabad@datasource.tech',
        },
      ],
      sameAs: [
        'https://linkedin.com/company/datasource-tech',
        'https://twitter.com/datasourcetech',
        'https://github.com/datasource-tech',
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
