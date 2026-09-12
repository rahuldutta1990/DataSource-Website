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
  footerText: string;
  copyright: string;
  stats: StatItem[];
  analyticsIdPlaceholder?: string;
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
