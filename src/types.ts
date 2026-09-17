export type Role = 'Super Admin' | 'Content Manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  excerpt: string;
  description: string;
  keyCapabilities: string[];
  iconName: string;
  sortOrder: number;
  status: 'published' | 'draft';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  year: string;
  coverImage: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: CaseStudyMetric[];
  technologies: string[];
  implementationDetails?: string;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  status: 'published' | 'draft';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  sortOrder: number;
  relatedServices: string[];
  imageUrl?: string;
  status: 'published' | 'draft';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  status: 'published' | 'draft';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  photoUrl?: string;
  quote: string;
  rating: number;
  status: 'published' | 'draft';
  featured: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'published' | 'draft';
  targetPages?: string[]; // e.g. ['services', 'about', 'home']
  updatedAt?: string;
}

export interface ContactEnquiry {
  id: string;
  userId?: string;
  userEmail?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceRequired: string;
  budgetRange: string;
  projectType: string;
  requirement: string;
  preferredContact: 'email' | 'phone' | 'either';
  status: 'new' | 'in_review' | 'contacted' | 'resolved';
  notes?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  interest?: string;
  source?: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
}

export interface InsightComment {
  id: string;
  insightId?: string; // 'general' or specific insight slug/id
  insightTitle?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  topic?: string;
  rating?: number;
  likesCount: number;
  status: 'approved' | 'pending' | 'rejected' | 'spam';
  createdAt: string;
  adminReply?: string;
  adminRepliedAt?: string;
  adminReplierName?: string;
}

export interface InsightEngagement {
  id: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  updatedAt: string;
}

export interface CommunityEngagementSummary {
  totalSubscribers: number;
  activeSubscribers: number;
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  totalLikes: number;
  totalShares: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'admin';
  company?: string;
  phone?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  itemType: 'casestudy' | 'insight' | 'service';
  itemId: string;
  title: string;
  slug: string;
  savedAt: string;
  excerpt?: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  altText: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
  editableNote?: string;
}

export interface OfficeLocation {
  id: string;
  name: string;
  badge: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  transit: string;
  focus: string[];
  mapQuery: string;
  coordinates: { lat: number; lng: number };
}

export interface SEOKeywordTarget {
  id: string;
  pageRoute: string;
  pageName: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'commercial' | 'transactional' | 'informational' | 'navigational';
  targetLocation: string;
  metaTitle: string;
  metaDescription: string;
  priority: 'high' | 'medium' | 'low';
  rankingStatus: 'ranking_top_10' | 'optimizing' | 'active_target' | 'planned';
  targetMonthlySearches?: string;
  lastAudited?: string;
  notes?: string;
}

export interface BusinessProblemItem {
  id: string;
  category: 'data_reporting' | 'operations_workflow' | 'software_cloud' | 'cost_strategy';
  iconName?: string;
  title: string;
  symptomQuote: string;
  businessImpact: string;
  consultingSolution: string;
  deliverables: string[];
  serviceSlug: string;
  serviceName: string;
  whoFeelsIt: string;
  badge: string;
  sortOrder?: number;
  status?: 'published' | 'draft';
}

export interface WhatWeDoItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface ProcessStepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  img?: string;
}

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface TechnologicalVerticalItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface EngineeringManifestoItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface StudioWorkbenchFeature {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  badge?: string;
}

export interface SiteSettings {
  companyName: string;
  fullName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  brandPhilosophy: string;
  brandMessage: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    youtube?: string;
  };
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaButtonText: string;
  secondaryCtaText?: string;
  footerText: string;
  copyright: string;
  stats: StatItem[];
  analyticsIdPlaceholder?: string;
  googleTagId?: string;
  googleTagEnabled?: boolean;
  gtmContainerId?: string;
  googleSearchConsoleVerification?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  whatsappGreeting?: string;
  whatsappConsultantName?: string;
  googleMapsEnabled?: boolean;
  googleMapsTitle?: string;
  googleMapsSubtitle?: string;
  officeLocations?: OfficeLocation[];
  seoKeywords?: SEOKeywordTarget[];
  businessProblemsEnabled?: boolean;
  businessProblemsTitle?: string;
  businessProblemsSubtitle?: string;
  businessProblems?: BusinessProblemItem[];
  conversionEvents?: any[];
  localBusinessSchemaEnabled?: boolean;
  footerQrCodeUrl?: string;

  // AI Studio Core Architecture & Pillars (Editable via CMS)
  pillarsTitle?: string;
  pillarsSubtitle?: string;
  pillars?: PillarItem[];
  technologicalVerticalsTitle?: string;
  technologicalVerticalsSubtitle?: string;
  technologicalVerticals?: TechnologicalVerticalItem[];

  // About Page AI Studio Content (Editable via CMS)
  aboutHeroTitle?: string;
  aboutHeroSubtitle?: string;
  aboutHeroPhilosophy?: string;
  aboutGenesisTitle?: string;
  aboutGenesisParagraph?: string;
  aboutArchitectsTitle?: string;
  aboutArchitectsParagraph?: string;
  aboutManifestoTitle?: string;
  aboutManifestoSubtitle?: string;
  aboutManifestoItems?: EngineeringManifestoItem[];

  // AI Studio Workbench Features (Editable via CMS)
  studioWorkbenchTitle?: string;
  studioWorkbenchSubtitle?: string;
  studioWorkbenchFeatures?: StudioWorkbenchFeature[];

  // Dedicated Page & Section Content (Editable via CMS)
  businessChallengesTitle?: string;
  businessChallengesDescription?: string;
  whatWeDoTitle?: string;
  whatWeDoSubtitle?: string;
  whatWeDoItems?: WhatWeDoItem[];
  whyChooseUsTitle?: string;
  whyChooseUsSubtitle?: string;
  whyChooseUsDescription?: string;
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: ProcessStepItem[];
}

export interface DashboardStats {
  totalServices: number;
  publishedServices: number;
  totalCaseStudies: number;
  publishedCaseStudies: number;
  totalInsights: number;
  publishedInsights: number;
  draftInsights: number;
  totalTestimonials: number;
  totalFAQs: number;
  totalEnquiries: number;
  newEnquiries: number;
  recentEnquiries: ContactEnquiry[];
  recentPosts: BlogPost[];
}
