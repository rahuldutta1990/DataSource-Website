import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  AdminUser,
  ServiceCategory,
  ServiceItem,
  CaseStudy,
  Industry,
  BlogPost,
  BlogCategory,
  Testimonial,
  FAQ,
  ContactEnquiry,
  MediaItem,
  SiteSettings,
  DashboardStats,
} from '../src/types.js';

interface DatabaseSchema {
  adminUsers: AdminUser[];
  serviceCategories: ServiceCategory[];
  services: ServiceItem[];
  caseStudies: CaseStudy[];
  industries: Industry[];
  blogCategories: BlogCategory[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  enquiries: ContactEnquiry[];
  media: MediaItem[];
  settings: SiteSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let inMemoryDb: DatabaseSchema | null = null;

function getInitialData(): DatabaseSchema {
  const initialSalt = bcrypt.genSaltSync(10);
  const defaultHashedPassword = bcrypt.hashSync('admin_datasource_2026', initialSalt);

  return {
    adminUsers: [
      {
        id: 'usr-1',
        name: 'Principal Administrator',
        email: 'admin@datasource.tech',
        passwordHash: defaultHashedPassword,
        role: 'Super Admin',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr-2',
        name: 'Lead Content Editor',
        email: 'editor@datasource.tech',
        passwordHash: defaultHashedPassword,
        role: 'Content Manager',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    serviceCategories: [
      {
        id: 'cat-1',
        name: 'Digital Product Development',
        slug: 'digital-product-development',
        description: 'End-to-end UI/UX, modern web applications, and resilient cloud software built with precision.',
        sortOrder: 1,
      },
      {
        id: 'cat-2',
        name: 'Data & Business Intelligence',
        slug: 'data-business-intelligence',
        description: 'Interactive Power BI dashboards, advanced analytics, and executive KPI reporting.',
        sortOrder: 2,
      },
      {
        id: 'cat-3',
        name: 'Data Engineering & Platforms',
        slug: 'data-engineering-platforms',
        description: 'Robust ETL/ELT data pipelines, modern data warehousing, and secure cloud integrations.',
        sortOrder: 3,
      },
      {
        id: 'cat-4',
        name: 'IT Consulting & Problem Solving',
        slug: 'it-consulting-problem-solving',
        description: 'Independent technology assessment, architecture modernization, and practical digital transformation.',
        sortOrder: 4,
      },
    ],
    services: [
      {
        id: 'srv-1',
        title: 'Custom Web & Cloud Applications',
        slug: 'custom-web-cloud-applications',
        categoryId: 'cat-1',
        excerpt: 'High-performance web apps, client portals, and SaaS platforms engineered for scale and speed.',
        description: 'We design and construct production-grade web applications with responsive architectures, microservices or monolithic frameworks tailored to real business workflows. Our codebases focus on maintainability, speed, security, and measurable ROI.',
        keyCapabilities: [
          'Full-Stack TypeScript / React / Node development',
          'Responsive desktop and mobile web experiences',
          'Cloud infrastructure on AWS / GCP / Azure',
          'API design, microservices, and database modeling',
        ],
        iconName: 'Code2',
        sortOrder: 1,
        status: 'published',
        featured: true,
        seoTitle: 'Custom Web & Cloud Application Development | DataSource',
        seoDescription: 'Enterprise-grade custom web application design and engineering by DataSource.',
        createdAt: '2025-01-10T10:00:00.000Z',
        updatedAt: '2025-01-10T10:00:00.000Z',
      },
      {
        id: 'srv-2',
        title: 'UI/UX & Product Design',
        slug: 'ui-ux-product-design',
        categoryId: 'cat-1',
        excerpt: 'Human-centered user experiences and interfaces that simplify complex business workflows.',
        description: 'Enterprise applications often fail because of confusing interfaces. We apply cognitive research, rapid prototyping, and design systems to turn dense domain tasks into intuitive, delight-driven workflows.',
        keyCapabilities: [
          'User research & persona mapping',
          'Figma design systems & interactive prototypes',
          'Accessibility compliance (WCAG 2.1 AA)',
          'Usability auditing and UX overhaul',
        ],
        iconName: 'LayoutGrid',
        sortOrder: 2,
        status: 'published',
        featured: true,
        seoTitle: 'Enterprise UI/UX Design Consulting | DataSource',
        seoDescription: 'Strategic digital product design and UX architecture for enterprise tools.',
        createdAt: '2025-01-12T10:00:00.000Z',
        updatedAt: '2025-01-12T10:00:00.000Z',
      },
      {
        id: 'srv-3',
        title: 'Power BI & Executive Dashboards',
        slug: 'power-bi-executive-dashboards',
        categoryId: 'cat-2',
        excerpt: 'Transform scattered spreadsheets and disparate databases into real-time decision cockpits.',
        description: 'DataSource bridges raw operational data and executive decision-making. We build customized Microsoft Power BI dashboards, automated data refreshes, and governance frameworks that empower managers with actionable clarity.',
        keyCapabilities: [
          'DAX modeling & Star Schema architecture',
          'Automated data refresh & gateway configuration',
          'Role-Based Row-Level Security (RLS)',
          'Executive KPI scorecards & financial reporting',
        ],
        iconName: 'BarChart3',
        sortOrder: 3,
        status: 'published',
        featured: true,
        seoTitle: 'Power BI Consulting & Executive Dashboards | DataSource',
        seoDescription: 'Custom Power BI solutions and automated business intelligence dashboards.',
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2025-01-15T10:00:00.000Z',
      },
      {
        id: 'srv-4',
        title: 'Data Analytics & Predictive Insights',
        slug: 'data-analytics-predictive-insights',
        categoryId: 'cat-2',
        excerpt: 'Identify trends, forecast demand, and unlock commercial opportunities buried in your data.',
        description: 'Move beyond historical descriptive reporting into diagnostic and predictive analytics. We build statistical models and automated alert systems that identify customer attrition, forecast inventory, and optimize pricing.',
        keyCapabilities: [
          'Statistical trend analysis & cohort modeling',
          'Customer segmentation & churn prediction',
          'Forecasting and scenario modeling',
          'Data cleanliness and anomaly detection',
        ],
        iconName: 'LineChart',
        sortOrder: 4,
        status: 'published',
        featured: false,
        seoTitle: 'Data Analytics & Predictive Modeling | DataSource',
        seoDescription: 'Actionable data science and predictive analytics for mid-market and enterprise firms.',
        createdAt: '2025-01-18T10:00:00.000Z',
        updatedAt: '2025-01-18T10:00:00.000Z',
      },
      {
        id: 'srv-5',
        title: 'Data Engineering & Pipeline Automation',
        slug: 'data-engineering-pipeline-automation',
        categoryId: 'cat-3',
        excerpt: 'Reliable, automated ETL/ELT pipelines connecting transactional systems to unified warehouses.',
        description: 'Data is useless if it arrives late or corrupted. We design fault-tolerant data pipelines that extract from legacy databases, SaaS APIs, and streaming brokers, transforming and loading into scalable analytical warehouses.',
        keyCapabilities: [
          'Modern Data Stack (Snowflake, BigQuery, dbt)',
          'Airflow & event-driven ingestion pipelines',
          'Automated data reconciliation & schema evolution',
          'Data lakehouse implementation',
        ],
        iconName: 'Layers',
        sortOrder: 5,
        status: 'published',
        featured: true,
        seoTitle: 'Data Engineering & Automated Pipelines | DataSource',
        seoDescription: 'Engineered data pipelines, ETL/ELT architecture, and modern data warehouses.',
        createdAt: '2025-01-20T10:00:00.000Z',
        updatedAt: '2025-01-20T10:00:00.000Z',
      },
      {
        id: 'srv-6',
        title: 'Database Architecture & Migration',
        slug: 'database-architecture-migration',
        categoryId: 'cat-3',
        excerpt: 'High-availability SQL/NoSQL architectures, query tuning, and zero-downtime data migrations.',
        description: 'Whether scaling PostgreSQL, partitioning multi-terabyte tables, or migrating on-premise servers to cloud-native databases, DataSource ensures bulletproof consistency, speed, and disaster recovery.',
        keyCapabilities: [
          'PostgreSQL, MySQL, Cloud SQL & Spanner expertise',
          'Schema normalization & indexing optimization',
          'Zero-downtime replication and database migration',
          'Automated backups, encryption & compliance controls',
        ],
        iconName: 'Database',
        sortOrder: 6,
        status: 'published',
        featured: false,
        seoTitle: 'Database Architecture & Cloud Migration | DataSource',
        seoDescription: 'Database performance tuning, cloud migrations, and high-concurrency architecture.',
        createdAt: '2025-01-22T10:00:00.000Z',
        updatedAt: '2025-01-22T10:00:00.000Z',
      },
      {
        id: 'srv-7',
        title: 'IT Consulting & Technology Assessment',
        slug: 'it-consulting-technology-assessment',
        categoryId: 'cat-4',
        excerpt: 'Unbiased technical audits, stack evaluations, and roadmap planning aligned with business goals.',
        description: 'Before committing capital to software development or enterprise tooling, obtain an objective evaluation of your current architecture, security posture, tech debt, and operational bottlenecks.',
        keyCapabilities: [
          'Technology stack & code quality audits',
          'Vendor selection and build-vs-buy analysis',
          'Cloud spend & infrastructure cost reduction',
          'Digital transformation execution roadmaps',
        ],
        iconName: 'Compass',
        sortOrder: 7,
        status: 'published',
        featured: true,
        seoTitle: 'IT Consulting & Architecture Assessment | DataSource',
        seoDescription: 'Pragmatic technical consulting that starts with business problems, not buzzwords.',
        createdAt: '2025-01-25T10:00:00.000Z',
        updatedAt: '2025-01-25T10:00:00.000Z',
      },
      {
        id: 'srv-8',
        title: 'Workflow Automation & System Integration',
        slug: 'workflow-automation-system-integration',
        categoryId: 'cat-4',
        excerpt: 'Connect your CRM, ERP, finance tools, and internal portals into unified, hands-off workflows.',
        description: 'Eliminate duplicate data entry, manual reconciliation, and spreadsheet handoffs. We build custom API connectors and background orchestration workers that keep your core business applications continuously in sync.',
        keyCapabilities: [
          'Custom REST & GraphQL middleware',
          'ERP/CRM integrations (Salesforce, SAP, NetSuite)',
          'Webhook orchestration and error-handling queues',
          'Operational automation and alerting systems',
        ],
        iconName: 'Cpu',
        sortOrder: 8,
        status: 'published',
        featured: false,
        seoTitle: 'Enterprise Workflow Automation & Integration | DataSource',
        seoDescription: 'Custom system integration and workflow automation consulting.',
        createdAt: '2025-01-28T10:00:00.000Z',
        updatedAt: '2025-01-28T10:00:00.000Z',
      },
    ],
    caseStudies: [
      {
        id: 'cs-1',
        title: 'Power BI Business Intelligence Dashboard for Multi-Entity Operations',
        slug: 'power-bi-business-intelligence-dashboard',
        client: 'Apex Logistics & Freight Group (Sample Demo Case)',
        industry: 'Supply Chain & Logistics',
        year: '2025',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
        challenge: 'The client operated across 14 regional hubs, each producing isolated Excel workbooks and localized ERP exports. Generating monthly P&L and operational efficiency metrics required 12 working days of manual data aggregation, leading to stale decisions and frequent reconciliation discrepancies.',
        solution: 'DataSource designed a centralized cloud data warehouse on PostgreSQL, configured automated nocturnal ETL pipelines, and built an interactive Power BI executive reporting suite with unified DAX metrics and automated role-based security filters for branch managers.',
        result: 'Monthly executive reporting time was cut from 12 days to real-time on-demand (sub-second refresh). Operational leadership gained visibility into transport route margins, reducing deadhead miles and saving an estimated $240,000 annually.',
        metrics: [
          { label: 'Reporting Lead Time', value: '12 Days → Real-time' },
          { label: 'Reconciliation Errors', value: 'Reduced by 94%' },
          { label: 'Annual Operational Savings', value: '$240,000+' },
        ],
        technologies: ['Power BI', 'DAX', 'PostgreSQL', 'Python ETL', 'Azure Cloud'],
        implementationDetails: 'Implemented in 8 weeks with complete user training and ongoing pipeline monitoring.',
        testimonialQuote: 'DataSource did not just give us pretty charts; they cleaned up our underlying data model so our managers finally trust the numbers they see every morning.',
        testimonialAuthor: 'VP of Finance & Operations',
        status: 'published',
        featured: true,
        seoTitle: 'Case Study: Power BI Dashboard & Data Pipeline | DataSource',
        seoDescription: 'How DataSource centralized reporting and accelerated decisions for multi-entity operations.',
        createdAt: '2025-01-14T10:00:00.000Z',
        updatedAt: '2025-01-14T10:00:00.000Z',
      },
      {
        id: 'cs-2',
        title: 'Enterprise Customer Web Portal & Application Modernization',
        slug: 'customer-web-application-modernization',
        client: 'Vanguard Professional Services (Sample Demo Case)',
        industry: 'Professional & Legal Services',
        year: '2024',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
        challenge: 'An aging 10-year-old monolithic portal crashed under peak billing cycles, lacked mobile capability, and exposed the firm to customer support friction with over 450 repetitive ticket submissions every month.',
        solution: 'DataSource architected a modern, secure React/TypeScript web application with responsive UI, integrated Stripe billing, document exchange, and automated real-time status notifications powered by a Node.js microservice API.',
        result: 'Customer self-service adoption rose to 88%, customer onboarding dropped from 3 days to 14 minutes, and support ticket volume plummeted by 67% within the first 60 days of launch.',
        metrics: [
          { label: 'Support Ticket Reduction', value: '67%' },
          { label: 'Onboarding Velocity', value: '3 Days → 14 Mins' },
          { label: 'System Uptime SLA', value: '99.98%' },
        ],
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
        implementationDetails: 'Delivered with 100% test coverage and zero downtime data migration of 60,000 legacy customer records.',
        testimonialQuote: 'The new portal has completely changed our client perception from a legacy firm to a tech-forward leader in our industry.',
        testimonialAuthor: 'Chief Operating Officer',
        status: 'published',
        featured: true,
        seoTitle: 'Case Study: Customer Web Application Modernization | DataSource',
        seoDescription: 'Transforming legacy portals into high-velocity digital customer experiences.',
        createdAt: '2025-01-18T10:00:00.000Z',
        updatedAt: '2025-01-18T10:00:00.000Z',
      },
      {
        id: 'cs-3',
        title: 'Scalable Data Engineering & Reporting Automation Platform',
        slug: 'data-engineering-reporting-automation',
        client: 'OmniTrade Retail Commerce (Sample Demo Case)',
        industry: 'Retail & E-commerce',
        year: '2024',
        coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1400&auto=format&fit=crop',
        challenge: 'Omnichannel inventory discrepancies across Shopify, physical point-of-sale systems, and warehouse distribution centers resulted in frequent stock-outs and customer cancellation refunds.',
        solution: 'Engineered an event-driven data streaming pipeline utilizing message queues, automated dbt transformations, and centralized stock allocation services that sync all sales channels in under 30 seconds.',
        result: 'Stockout cancellation rate dropped from 4.2% to 0.3%, inventory turnover improved by 22%, and inventory planning teams gained intraday forecasting models.',
        metrics: [
          { label: 'Stockout Cancellation Rate', value: '4.2% → 0.3%' },
          { label: 'Inventory Turnover', value: '+22%' },
          { label: 'Sync Latency', value: '< 30 Seconds' },
        ],
        technologies: ['Kafka', 'dbt', 'BigQuery', 'Node.js', 'Redis'],
        implementationDetails: 'Processed over 1.2M daily transactions with automated dead-letter queues.',
        testimonialQuote: 'DataSource diagnosed our architecture problem immediately and solved what two previous agencies failed to fix.',
        testimonialAuthor: 'Director of Technology',
        status: 'published',
        featured: true,
        seoTitle: 'Case Study: Retail Data Pipeline & Automated Sync | DataSource',
        seoDescription: 'Real-time inventory synchronization and data engineering for omnichannel retail.',
        createdAt: '2025-01-22T10:00:00.000Z',
        updatedAt: '2025-01-22T10:00:00.000Z',
      },
      {
        id: 'cs-4',
        title: 'Digital Healthcare Scheduling & Telehealth Platform',
        slug: 'digital-healthcare-scheduling-platform',
        client: 'CareFirst Clinics Network (Sample Demo Case)',
        industry: 'Healthcare',
        year: '2024',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop',
        challenge: 'Patients struggled with long phone wait times for specialist appointments, while medical practitioners experienced high no-show rates (24%) and inefficient clinical calendar gaps.',
        solution: 'Built a HIPAA-ready patient booking and intake web application with automated SMS/email reminders, calendar synchronization for 42 physicians, and direct electronic health record (EHR) integration.',
        result: 'No-show rates dropped from 24% to 7%, phone hold times fell by 80%, and patient satisfaction ratings climbed from 3.2 to 4.8 out of 5 stars.',
        metrics: [
          { label: 'No-Show Rate Drop', value: '24% → 7%' },
          { label: 'Patient Satisfaction', value: '4.8 / 5.0' },
          { label: 'Monthly Bookings', value: '18,500+' },
        ],
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Twilio API'],
        implementationDetails: 'Full encryption in-transit and at-rest with strict role-based clinician access.',
        testimonialQuote: 'Our clinic staff no longer spend their days playing phone tag. It has fundamentally improved both patient care and staff morale.',
        testimonialAuthor: 'Medical Operations Director',
        status: 'published',
        featured: false,
        seoTitle: 'Case Study: Healthcare Digital Platform | DataSource',
        seoDescription: 'HIPAA-compliant scheduling and patient intake platform by DataSource.',
        createdAt: '2025-01-25T10:00:00.000Z',
        updatedAt: '2025-01-25T10:00:00.000Z',
      },
    ],
    industries: [
      {
        id: 'ind-1',
        name: 'SaaS & Technology',
        slug: 'saas-technology',
        description: 'Accelerate product roadmap delivery, modernize architecture, and scale backend data ingestion without expanding fixed payroll.',
        iconName: 'Cpu',
        sortOrder: 1,
        relatedServices: ['Custom Web & Cloud Applications', 'Data Engineering & Pipeline Automation'],
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
        status: 'published',
      },
      {
        id: 'ind-2',
        name: 'Finance & Banking',
        slug: 'finance-banking',
        description: 'Audit-ready reporting, risk metric dashboards, automated reconciliation, and bank-grade data security.',
        iconName: 'Landmark',
        sortOrder: 2,
        relatedServices: ['Power BI & Executive Dashboards', 'Data Analytics & Predictive Insights'],
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
        status: 'published',
      },
      {
        id: 'ind-3',
        name: 'Healthcare & Life Sciences',
        slug: 'healthcare-life-sciences',
        description: 'Compliant clinical operations, patient intake applications, and diagnostic reporting that respects data privacy.',
        iconName: 'Activity',
        sortOrder: 3,
        relatedServices: ['Custom Web & Cloud Applications', 'Database Architecture & Migration'],
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
        status: 'published',
      },
      {
        id: 'ind-4',
        name: 'Retail & E-Commerce',
        slug: 'retail-e-commerce',
        description: 'Omnichannel inventory integration, customer lifetime value analytics, and high-conversion web experiences.',
        iconName: 'ShoppingBag',
        sortOrder: 4,
        relatedServices: ['Data Engineering & Pipeline Automation', 'UI/UX & Product Design'],
        imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
        status: 'published',
      },
      {
        id: 'ind-5',
        name: 'Manufacturing & Logistics',
        slug: 'manufacturing-logistics',
        description: 'Supply chain tracking, plant equipment telemetry, automated dispatching, and vendor performance dashboards.',
        iconName: 'Truck',
        sortOrder: 5,
        relatedServices: ['Power BI & Executive Dashboards', 'Workflow Automation & System Integration'],
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
        status: 'published',
      },
      {
        id: 'ind-6',
        name: 'Professional Services',
        slug: 'professional-services',
        description: 'Client billing portals, resource allocation tools, document workflows, and automated client status communication.',
        iconName: 'Briefcase',
        sortOrder: 6,
        relatedServices: ['Custom Web & Cloud Applications', 'IT Consulting & Technology Assessment'],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
        status: 'published',
      },
    ],
    blogCategories: [
      { id: 'bcat-1', name: 'Data Analytics', slug: 'data-analytics' },
      { id: 'bcat-2', name: 'Power BI', slug: 'power-bi' },
      { id: 'bcat-3', name: 'Data Engineering', slug: 'data-engineering' },
      { id: 'bcat-4', name: 'Software Development', slug: 'software-development' },
      { id: 'bcat-5', name: 'IT Consulting', slug: 'it-consulting' },
    ],
    blogPosts: [
      {
        id: 'post-1',
        title: 'Why Most Enterprise Power BI Implementations Struggle (And How to Fix Them)',
        slug: 'why-power-bi-implementations-struggle',
        excerpt: 'Organizations buy Power BI licenses expecting instant clarity, but end up with chaotic, unverified reports. Here is how disciplined data modeling turns confusion into confidence.',
        content: `Many mid-market and enterprise organizations invest in Microsoft Power BI with high hopes: executive teams want one single source of truth, division heads want drill-down capabilities, and operational managers want automated morning digests.

Yet within six to twelve months, a familiar pattern emerges:
1. **The "Report Jungle"**: Hundreds of standalone, unmonitored reports created by well-meaning business users, each calculating fundamental metrics slightly differently.
2. **DAX Performance Bottlenecks**: Queries take 45 seconds to load because calculations are built directly against wide flat tables rather than a well-structured star schema.
3. **Loss of Trust**: When the CFO and the Head of Sales present two different revenue numbers in the same boardroom meeting, confidence in the entire data infrastructure evaporates.

### The Remedy: Star Schema First, Visuals Second
True business intelligence begins far upstream from report canvases. The most resilient Power BI deployments adhere to three architectural rules:
- **Clean Star Schema Architecture**: Separate your transactional fact tables (sales, shipments, tickets) from dimensional tables (customers, products, calendar). Never blend dimensions into wide denormalized tables for report convenience.
- **Single Source DAX Measures**: Centralize core business calculations inside a certified shared dataset rather than recreating formulas inside individual PBIX files.
- **Row-Level Security (RLS) from Day One**: Configure role-based security in the model rather than creating 15 copies of the same report filtered for individual branch managers.

When you start with the data problem rather than visual vanity, Power BI transforms into the highest-ROI software asset in your company.`,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        author: 'DataSource Practice Lead',
        category: 'Power BI',
        tags: ['Power BI', 'Business Intelligence', 'Data Modeling', 'DAX'],
        publishedAt: '2025-01-20T08:00:00.000Z',
        readTime: '5 min read',
        status: 'published',
        featured: true,
        seoTitle: 'Why Enterprise Power BI Implementations Struggle | DataSource',
        seoDescription: 'Actionable architectural advice for establishing reliable Power BI reporting across enterprise divisions.',
        createdAt: '2025-01-20T08:00:00.000Z',
        updatedAt: '2025-01-20T08:00:00.000Z',
      },
      {
        id: 'post-2',
        title: 'Modernizing Legacy Web Applications Without Risky Big-Bang Rewrites',
        slug: 'modernizing-legacy-web-applications',
        excerpt: 'A complete rewrite of your core business software is almost always a budget trap. Learn the incremental Strangler Fig strategy that delivers value from month one.',
        content: `Every engineering leader eventually faces the legacy code dilemma: your existing web portal generates millions in company revenue, but its code is fragile, dependencies are obsolete, and adding a simple feature requires weeks of regression testing.

The instinct is often to declare: "Let's rebuild everything from scratch in a modern stack!"
Statistically, over 70% of complete enterprise software rewrites exceed budget, fall behind schedule, or stall entirely.

### The Strangler Fig Architecture
Instead of betting the company on a multi-year rewrite, modern consulting approaches utilize the **Strangler Fig Pattern**:
- Place a lightweight API routing proxy in front of both the legacy system and the new application.
- Identify one high-impact, self-contained domain capability (for example, client onboarding or invoice export).
- Re-engineer that single module using modern TypeScript, React, and modular APIs.
- Route production traffic for that module to the new service while all other requests continue seamlessly to the legacy backend.
- Incrementally migrate remaining modules one at a time.

This incremental approach delivers user-facing improvements within weeks, maintains uninterrupted business continuity, and keeps risk strictly bounded.`,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
        author: 'DataSource Engineering Team',
        category: 'Software Development',
        tags: ['Architecture', 'Legacy Modernization', 'TypeScript', 'Web Apps'],
        publishedAt: '2025-01-28T09:00:00.000Z',
        readTime: '6 min read',
        status: 'published',
        featured: true,
        seoTitle: 'How to Modernize Legacy Applications Safely | DataSource',
        seoDescription: 'Pragmatic architectural patterns for replacing legacy business software incrementally.',
        createdAt: '2025-01-28T09:00:00.000Z',
        updatedAt: '2025-01-28T09:00:00.000Z',
      },
      {
        id: 'post-3',
        title: 'Building Resilient Data Pipelines: From Fragile Scripts to Production ETL',
        slug: 'building-resilient-data-pipelines',
        excerpt: 'How to transition from ad-hoc cron scripts and spreadsheet exports to automated, idempotent data workflows that never lose a transaction.',
        content: `Many companies maintain multi-million dollar business processes on top of Python scripts triggered by Linux crontabs or manual exports run by junior analysts.

When a network hiccup or unexpected schema change occurs at 2:00 AM, the pipeline silently fails—and leadership makes decisions based on yesterday's corrupted numbers.

### Key Principles of Production-Grade Pipelines
1. **Idempotency**: Running the same pipeline twice on the same dataset must yield the exact same result without duplicate entries or state corruption.
2. **Schema Drift Defenses**: Implement strict validation at ingestion boundaries. If an external API suddenly drops or renames a key, fail the partition cleanly into a dead-letter queue and notify the engineers immediately.
3. **Automated Reconciliation**: Check record counts and financial sum totals automatically between the source database and destination warehouse before publishing the daily dataset to business users.

Building data pipelines is not about writing code; it is about engineering automated verification and recovery mechanisms.`,
        coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
        author: 'Data Infrastructure Team',
        category: 'Data Engineering',
        tags: ['ETL', 'Data Engineering', 'Pipelines', 'Warehousing'],
        publishedAt: '2025-02-04T11:00:00.000Z',
        readTime: '5 min read',
        status: 'published',
        featured: false,
        seoTitle: 'Building Production-Grade Data Pipelines | DataSource',
        seoDescription: 'Best practices for automated, reliable ETL pipelines and data engineering.',
        createdAt: '2025-02-04T11:00:00.000Z',
        updatedAt: '2025-02-04T11:00:00.000Z',
      },
      {
        id: 'post-4',
        title: 'The Real Cost of Tech Debt: When to Pay It Down vs. When to Ship',
        slug: 'the-real-cost-of-tech-debt',
        excerpt: 'Not all technical debt is bad. Strategic debt accelerates time-to-market, but unmanaged debt paralyzes engineering throughput. Here is how to evaluate the balance.',
        content: `Technical debt is frequently misunderstood. Non-technical founders and executives often view it as developer laziness, while engineers sometimes treat any imperfect code as an existential emergency.

In reality, technical debt behaves exactly like financial leverage: borrowing against optimal architecture can help you launch a new product line before competitors. However, if the interest payments—measured in bug triage and slowed feature velocity—outweigh new development, bankruptcy ensues.

### The Debt Triage Matrix
We recommend categorizing technical liabilities into three buckets:
- **Critical High-Interest Debt**: Security vulnerabilities, unindexed database tables on high-traffic paths, and zero-backup systems. Fix immediately.
- **Operational Drag Debt**: Missing test coverage on core financial calculations and confusing module boundaries. Schedule 20% of sprint capacity toward continuous refactoring.
- **Low-Impact Cosmetic Debt**: Minor code duplication in secondary admin pages or outdated CSS classes. Leave it alone until the surrounding feature requires modification.`,
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
        author: 'DataSource Strategy Consultant',
        category: 'IT Consulting',
        tags: ['Tech Debt', 'Consulting', 'Engineering Leadership'],
        publishedAt: '2025-02-12T09:30:00.000Z',
        readTime: '4 min read',
        status: 'published',
        featured: false,
        seoTitle: 'Managing Technical Debt in Growing Companies | DataSource',
        seoDescription: 'A pragmatic framework for managing engineering debt and maintaining development velocity.',
        createdAt: '2025-02-12T09:30:00.000Z',
        updatedAt: '2025-02-12T09:30:00.000Z',
      },
      {
        id: 'post-5',
        title: 'Designing Enterprise UI: Moving from Cluttered Sheets to Intuitive Systems',
        slug: 'designing-enterprise-ui-systems',
        excerpt: 'Enterprise software does not need to look like it was built in 1998. How modern design systems and cognitive spacing improve daily employee productivity.',
        content: `A common myth in business software is that enterprise users don't care about design—they just want tables and filters.

In truth, poor enterprise design costs companies millions in human error, slow customer onboarding, and high employee turnover. When an internal application displays 60 unorganized input fields and ambiguous icons, workers suffer mental fatigue and make mistakes.

By introducing structured typography hierarchies, consistent visual affordances, and mathematically balanced spacing, enterprise software can feel as effortless and fast as consumer-grade applications.`,
        coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
        author: 'UI/UX Design Practice',
        category: 'Software Development',
        tags: ['UI/UX', 'Product Design', 'Enterprise Software'],
        publishedAt: '2025-02-18T14:00:00.000Z',
        readTime: '4 min read',
        status: 'published',
        featured: false,
        seoTitle: 'Enterprise UI/UX Design Principles | DataSource',
        seoDescription: 'How thoughtful user interface design reduces operational errors and boosts productivity.',
        createdAt: '2025-02-18T14:00:00.000Z',
        updatedAt: '2025-02-18T14:00:00.000Z',
      },
      {
        id: 'post-6',
        title: 'The Practical Path to AI: Start with Data Quality, Not Model Hype',
        slug: 'the-practical-path-to-ai',
        excerpt: 'Generative AI and machine learning cannot fix broken data pipelines. Why data hygiene and clear problem statements must precede every AI initiative.',
        content: `In the rush to integrate artificial intelligence, business executives frequently ask: "How can we implement AI into our business this quarter?"

Our answer is always consistent: "What specific business problem are you solving, and how clean is the underlying operational data?"

If your inventory records, customer histories, and financial statements are fragmented across 20 incompatible spreadsheets, feeding them into a language model or predictive algorithm will simply produce hallucinated forecasts with unwarranted confidence.

Before investing in complex models, ensure your data foundations—collection, normalization, pipeline freshness, and governance—are rock solid. Only then will AI deliver compounding returns.`,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        author: 'DataSource Analytics Practice',
        category: 'Data Analytics',
        tags: ['AI', 'Data Governance', 'Strategy', 'Analytics'],
        publishedAt: '2025-02-25T10:00:00.000Z',
        readTime: '5 min read',
        status: 'published',
        featured: false,
        seoTitle: 'The Pragmatic Path to Enterprise AI | DataSource',
        seoDescription: 'Why data engineering and data quality are prerequisites for successful business AI.',
        createdAt: '2025-02-25T10:00:00.000Z',
        updatedAt: '2025-02-25T10:00:00.000Z',
      },
    ],
    testimonials: [
      {
        id: 't-1',
        name: 'Michael Henderson (Sample Demo)',
        designation: 'Chief Technology Officer',
        company: 'Apex Logistics & Freight',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        quote: 'DataSource transformed our entire reporting infrastructure. They did not push trendy tools or bloated architectures; they listened to our operational bottlenecks and delivered a Power BI solution that our leadership team uses every single day.',
        rating: 5,
        status: 'published',
        featured: true,
      },
      {
        id: 't-2',
        name: 'Sarah Lin, PhD (Sample Demo)',
        designation: 'VP of Digital Operations',
        company: 'CareFirst Clinics Network',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
        quote: 'Working with DataSource felt like having a senior in-house engineering team that actually understood healthcare workflows. The web application they engineered was delivered on time, under budget, and with zero patient downtime.',
        rating: 5,
        status: 'published',
        featured: true,
      },
      {
        id: 't-3',
        name: 'David Robinson (Sample Demo)',
        designation: 'Managing Partner',
        company: 'Vanguard Professional Services',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
        quote: 'They cut through the technical jargon and gave us clear options with direct cost-benefit trade-offs. Their consulting approach—starting with the problem rather than the technology—saved us from a costly software mistake.',
        rating: 5,
        status: 'published',
        featured: true,
      },
      {
        id: 't-4',
        name: 'Elena Rostova (Sample Demo)',
        designation: 'Director of Product & Data',
        company: 'OmniTrade Retail',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
        quote: 'Our inventory sync issues were costing us hundreds of thousands in order cancellations. DataSource built an automated pipeline that resolved our synchronization latency in less than two weeks.',
        rating: 5,
        status: 'published',
        featured: true,
      },
    ],
    faqs: [
      {
        id: 'faq-1',
        question: 'What type of businesses does DataSource work with?',
        answer: 'We collaborate with mid-market businesses, growth-stage tech companies, and enterprise divisions across industries including logistics, professional services, healthcare, retail, SaaS, and manufacturing. Whether you need a focused technical sprint or an end-to-end multi-quarter product build, we adapt our engagement model to your internal team.',
        category: 'General',
        sortOrder: 1,
        status: 'published',
      },
      {
        id: 'faq-2',
        question: 'What technology services do you provide?',
        answer: 'Our core capabilities span four pillars: Digital Product Development (custom web/cloud applications and UI/UX design), Data & Business Intelligence (Power BI dashboards, KPI modeling, and predictive analytics), Data Engineering & Platforms (ETL/ELT pipelines, warehousing, and database tuning), and IT Consulting (system assessments, cloud optimization, and digital strategy).',
        category: 'Services',
        sortOrder: 2,
        status: 'published',
      },
      {
        id: 'faq-3',
        question: 'Can you work with an existing development team?',
        answer: 'Yes, frequently. We often embed alongside existing in-house engineering and product teams to provide specialized expertise in data engineering, UI/UX overhauls, or architecture modernization. We integrate seamlessly into your Git workflows, sprint planning, and communication channels.',
        category: 'Engagement',
        sortOrder: 3,
        status: 'published',
      },
      {
        id: 'faq-4',
        question: 'Can DataSource improve an existing application rather than rebuilding it?',
        answer: 'Absolutely. We actively advocate for incremental modernization over risky complete rewrites. We perform comprehensive codebase audits, resolve performance bottlenecks, modernize frontend interfaces, and refactor backend APIs without disrupting your active business operations.',
        category: 'Services',
        sortOrder: 4,
        status: 'published',
      },
      {
        id: 'faq-5',
        question: 'Do you provide Power BI and data analytics solutions?',
        answer: 'Yes. We are specialists in enterprise Power BI design, DAX modeling, automated data gateway configuration, star schema warehousing, and row-level security. We turn messy multi-source spreadsheets into fast, automated executive dashboards.',
        category: 'Data & BI',
        sortOrder: 5,
        status: 'published',
      },
      {
        id: 'faq-6',
        question: 'Can you build custom web and mobile applications?',
        answer: 'Yes. We architect responsive, high-performance web applications using modern TypeScript, React, Node.js, and cloud native architectures that are accessible across desktop, tablet, and mobile devices.',
        category: 'Services',
        sortOrder: 6,
        status: 'published',
      },
      {
        id: 'faq-7',
        question: 'Do you provide ongoing technical support and maintenance?',
        answer: 'Yes. Beyond initial project delivery, DataSource offers structured maintenance agreements, continuous pipeline monitoring, database optimization, security patch cycles, and dedicated developer support hours.',
        category: 'Engagement',
        sortOrder: 7,
        status: 'published',
      },
      {
        id: 'faq-8',
        question: 'How do we start a project?',
        answer: 'The process begins with an exploratory consultation. You share your current business challenge or project requirements, our principal consultants review your goals, and we deliver a clear, transparent project scope outlining milestones, technology recommendations, and timelines.',
        category: 'Engagement',
        sortOrder: 8,
        status: 'published',
      },
    ],
    enquiries: [
      {
        id: 'enq-1',
        name: 'Robert Vance (Demo)',
        company: 'Vance International Logistics',
        email: 'robert@vance-intl.demo',
        phone: '+1 (555) 234-8901',
        serviceRequired: 'Power BI & Executive Dashboards',
        budgetRange: '$25k - $50k',
        projectType: 'Data & Analytics',
        requirement: 'We need to centralize operational reporting from 8 different warehouse hubs into a live Power BI executive dashboard with automated daily refreshes.',
        preferredContact: 'email',
        status: 'in_review',
        notes: 'Demonstration lead entered for CMS evaluation.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'enq-2',
        name: 'Katherine Miller (Demo)',
        company: 'Miller & Sterling Legal',
        email: 'kmiller@millersterling.demo',
        phone: '+1 (555) 890-1234',
        serviceRequired: 'Custom Web & Cloud Applications',
        budgetRange: '$50k - $100k',
        projectType: 'Web Portal Modernization',
        requirement: 'Looking to replace our legacy customer portal with a modern, responsive web application for client document sharing and billing.',
        preferredContact: 'phone',
        status: 'new',
        notes: 'Urgent timeline requested for Q2 rollout.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    media: [
      {
        id: 'med-1',
        fileName: 'datasource-logo.svg',
        url: '/datasource-logo.svg',
        altText: 'DataSource Technology & Solutions Official Logo',
        mimeType: 'image/svg+xml',
        sizeBytes: 4200,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-2',
        fileName: 'datasource-icon.svg',
        url: '/datasource-icon.svg',
        altText: 'DataSource Brand Mark Icon',
        mimeType: 'image/svg+xml',
        sizeBytes: 2100,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-3',
        fileName: 'analytics-dashboard-cover.jpg',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
        altText: 'Analytics and Business Intelligence Dashboard Screen',
        mimeType: 'image/jpeg',
        sizeBytes: 184000,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-4',
        fileName: 'modern-web-code.jpg',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
        altText: 'Modern Web Application Engineering',
        mimeType: 'image/jpeg',
        sizeBytes: 220000,
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      companyName: 'DataSource',
      fullName: 'DataSource Technology & Solutions',
      tagline: 'Technology That Solves. Data That Drives.',
      heroHeadline: 'Turning Technology and Data Into Business Solutions',
      heroSubheadline: 'DataSource helps businesses design, develop, analyse and improve digital solutions through technology, data and practical problem solving.',
      brandPhilosophy: 'We start with the problem, not the technology.',
      brandMessage: 'You bring the challenge. DataSource builds the right solution.',
      email: 'rd14190@gmail.com',
      phone: '+1 (800) 512-3282',
      address: 'DataSource Technology & Solutions, Innovation Quarter, Tech Park Plaza',
      businessHours: 'Monday – Friday: 9:00 AM – 6:00 PM EST',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/datasource-tech',
        twitter: 'https://x.com/datasourcetech',
        github: 'https://github.com/datasource-tech',
      },
      ctaHeadline: 'Have a Technology or Data Problem?',
      ctaSubheadline: "Let's understand the challenge first and find the right solution together.",
      ctaButtonText: 'Book a Consultation',
      footerText: 'DataSource is a technology and data consulting partner helping forward-thinking companies solve technical hurdles, engineer modern digital products, and unlock the true commercial value of their business data.',
      copyright: '© 2026 DataSource Technology & Solutions. All rights reserved.',
      stats: [
        { value: '10+', label: 'Years of Combined Expertise', sublabel: 'Sample demo stat - editable in CMS', editableNote: 'CMS Editable' },
        { value: '50+', label: 'Projects Delivered', sublabel: 'Sample demo stat - editable in CMS', editableNote: 'CMS Editable' },
        { value: '20+', label: 'Technology Capabilities', sublabel: 'Across cloud, data & code', editableNote: 'CMS Editable' },
        { value: '90%+', label: 'Repeat & Referral Engagements', sublabel: 'Long-term client partnerships', editableNote: 'CMS Editable' },
      ],
      analyticsIdPlaceholder: 'G-MEASUREMENT-ID',
      whatsappNumber: '+91 9038417437',
      whatsappEnabled: true,
      whatsappGreeting: '👋 Hi there! Welcome to DataSource Technology & Solutions. How can our technical architects assist you today?',
      whatsappConsultantName: 'DataSource Solutions Architect',
    },
  };
}

export function loadDb(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content);
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn('Could not read existing database.json, initializing fresh seed data', err);
  }

  inMemoryDb = getInitialData();
  saveDbSync(inMemoryDb);
  return inMemoryDb;
}

export function saveDbSync(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to atomically write database.json:', err);
  }
}

export async function saveDb(data: DatabaseSchema): Promise<void> {
  saveDbSync(data);
}
