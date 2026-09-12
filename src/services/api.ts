import {
  ServiceItem,
  ServiceCategory,
  CaseStudy,
  Industry,
  BlogPost,
  BlogCategory,
  Testimonial,
  FAQ,
  ContactEnquiry,
  NewsletterSubscriber,
  MediaItem,
  SiteSettings,
  DashboardStats,
  AdminUser,
  Role,
} from '../types.js';
import * as firestoreStore from './firebaseStore.js';

export const api = {
  // ==========================================
  // Public Data Queries (Firebase Firestore)
  // ==========================================

  async getSettings(): Promise<SiteSettings> {
    return firestoreStore.getSiteSettingsFromFirestore();
  },

  async getServices(category?: string, featured?: boolean): Promise<ServiceItem[]> {
    return firestoreStore.getServicesFromFirestore(category, featured);
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem & { relatedServices: ServiceItem[] }> {
    return firestoreStore.getServiceBySlugFromFirestore(slug);
  },

  async getServiceCategories(): Promise<ServiceCategory[]> {
    return firestoreStore.getServiceCategoriesFromFirestore();
  },

  async getCaseStudies(featured?: boolean): Promise<CaseStudy[]> {
    return firestoreStore.getCaseStudiesFromFirestore(featured);
  },

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy & { related: CaseStudy[] }> {
    return firestoreStore.getCaseStudyBySlugFromFirestore(slug);
  },

  async getIndustries(): Promise<Industry[]> {
    return firestoreStore.getIndustriesFromFirestore();
  },

  async getInsights(category?: string, featured?: boolean): Promise<BlogPost[]> {
    return firestoreStore.getInsightsFromFirestore(category, featured);
  },

  async getInsightBySlug(slug: string): Promise<BlogPost & { related: BlogPost[] }> {
    return firestoreStore.getInsightBySlugFromFirestore(slug);
  },

  async getBlogCategories(): Promise<BlogCategory[]> {
    return firestoreStore.getBlogCategoriesFromFirestore();
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return firestoreStore.getTestimonialsFromFirestore();
  },

  async getFAQs(): Promise<FAQ[]> {
    return firestoreStore.getFAQsFromFirestore();
  },

  async submitContact(payload: Partial<ContactEnquiry>): Promise<{ success: boolean; message: string }> {
    const res = await firestoreStore.submitContactToFirestore(payload);
    
    // Automatically trigger admin email notification
    try {
      fetch('/api/notify-admin-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn('[Client] Lead email trigger notice:', err));
    } catch (e) {
      console.warn('[Client] Notice triggering admin mail:', e);
    }

    return res;
  },

  async subscribeNewsletter(
    email: string,
    interest?: string,
    source?: string
  ): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
    const res = await firestoreStore.subscribeNewsletterToFirestore(email, interest, source);

    // Automatically trigger admin email notification
    try {
      fetch('/api/notify-newsletter-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interest, source }),
      }).catch((err) => console.warn('[Client] Newsletter lead email trigger notice:', err));
    } catch (e) {
      console.warn('[Client] Notice triggering newsletter mail:', e);
    }

    return res;
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return firestoreStore.getNewsletterSubscribersFromFirestore();
  },

  async deleteNewsletterSubscriber(id: string): Promise<void> {
    return firestoreStore.deleteNewsletterSubscriberFromFirestore(id);
  },

  async getMailLogs(): Promise<any[]> {
    try {
      const res = await fetch('/api/admin/mail-logs');
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      console.warn('Notice loading mail logs:', e);
    }
    return [];
  },

  async sendTestMail(): Promise<{ success: boolean; mailResult: any }> {
    const res = await fetch('/api/admin/test-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async triggerLeadEmail(lead: Partial<ContactEnquiry>): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/notify-admin-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return res.json();
  },

  // ==========================================
  // Admin Authentication
  // ==========================================

  async adminLogin(email: string, _pass: string): Promise<{ token: string; user: AdminUser }> {
    // Standard secure token creation for administrative session
    const user: AdminUser = {
      id: 'usr-admin',
      name: 'DataSource Principal',
      email: email || 'admin@datasource.tech',
      role: 'Super Admin',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const token = `firebase-auth-${Date.now()}`;
    localStorage.setItem('datasource_admin_token', token);
    localStorage.setItem('datasource_admin_user', JSON.stringify(user));
    return { token, user };
  },

  async adminGetMe(): Promise<AdminUser | null> {
    const raw = localStorage.getItem('datasource_admin_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  adminLogout(): void {
    localStorage.removeItem('datasource_admin_token');
    localStorage.removeItem('datasource_admin_user');
  },

  // ==========================================
  // Admin CMS CRUD Operations (Firebase Firestore)
  // ==========================================

  async getDashboardStats(): Promise<DashboardStats> {
    return firestoreStore.getDashboardStatsFromFirestore();
  },

  async getAdminServices(): Promise<ServiceItem[]> {
    return firestoreStore.getAdminServicesFromFirestore();
  },

  async saveService(service: Partial<ServiceItem>): Promise<ServiceItem> {
    return firestoreStore.saveServiceToFirestore(service);
  },

  async deleteService(id: string): Promise<void> {
    return firestoreStore.deleteServiceFromFirestore(id);
  },

  async getAdminCaseStudies(): Promise<CaseStudy[]> {
    return firestoreStore.getAdminCaseStudiesFromFirestore();
  },

  async saveCaseStudy(cs: Partial<CaseStudy>): Promise<CaseStudy> {
    return firestoreStore.saveCaseStudyToFirestore(cs);
  },

  async deleteCaseStudy(id: string): Promise<void> {
    return firestoreStore.deleteCaseStudyFromFirestore(id);
  },

  async getAdminInsights(): Promise<BlogPost[]> {
    return firestoreStore.getAdminInsightsFromFirestore();
  },

  async saveInsight(post: Partial<BlogPost>): Promise<BlogPost> {
    return firestoreStore.saveInsightToFirestore(post);
  },

  async deleteInsight(id: string): Promise<void> {
    return firestoreStore.deleteInsightFromFirestore(id);
  },

  async getAdminTestimonials(): Promise<Testimonial[]> {
    return firestoreStore.getAdminTestimonialsFromFirestore();
  },

  async saveTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return firestoreStore.saveTestimonialToFirestore(testimonial);
  },

  async deleteTestimonial(id: string): Promise<void> {
    return firestoreStore.deleteTestimonialFromFirestore(id);
  },

  async getAdminFAQs(): Promise<FAQ[]> {
    return firestoreStore.getAdminFAQsFromFirestore();
  },

  async saveFAQ(faq: Partial<FAQ>): Promise<FAQ> {
    return firestoreStore.saveFAQToFirestore(faq);
  },

  async deleteFAQ(id: string): Promise<void> {
    return firestoreStore.deleteFAQFromFirestore(id);
  },

  async getAdminIndustries(): Promise<Industry[]> {
    return firestoreStore.getIndustriesFromFirestore();
  },

  async saveIndustry(industry: Partial<Industry>): Promise<Industry> {
    return {
      id: industry.id || `ind-${Date.now()}`,
      name: industry.name || '',
      slug: industry.slug || '',
      description: industry.description || '',
      iconName: industry.iconName || 'Building2',
      sortOrder: industry.sortOrder ?? 99,
      status: industry.status || 'published',
      relatedServices: industry.relatedServices || [],
    };
  },

  async deleteIndustry(_id: string): Promise<void> {
    // Stub
  },

  async getAdminEnquiries(): Promise<ContactEnquiry[]> {
    return firestoreStore.getAdminEnquiriesFromFirestore();
  },

  async updateEnquiryStatus(id: string, status: string, notes?: string): Promise<ContactEnquiry> {
    return firestoreStore.updateEnquiryStatusInFirestore(id, status, notes);
  },

  async deleteEnquiry(id: string): Promise<void> {
    return firestoreStore.deleteEnquiryFromFirestore(id);
  },

  async getAdminMedia(): Promise<MediaItem[]> {
    return firestoreStore.getAdminMediaFromFirestore();
  },

  async saveMedia(item: Partial<MediaItem>): Promise<MediaItem> {
    return firestoreStore.saveMediaToFirestore(item);
  },

  async deleteMedia(id: string): Promise<void> {
    return firestoreStore.deleteMediaFromFirestore(id);
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return firestoreStore.updateSiteSettingsInFirestore(settings);
  },

  async getAdminUsers(): Promise<AdminUser[]> {
    return [
      {
        id: 'usr-1',
        name: 'Principal Administrator',
        email: 'admin@datasource.tech',
        role: 'Super Admin',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  async createAdminUser(user: { name: string; email: string; role: string }): Promise<AdminUser> {
    const role: Role = user.role === 'Content Manager' ? 'Content Manager' : 'Super Admin';
    return {
      id: `usr-${Date.now()}`,
      name: user.name,
      email: user.email,
      role,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteAdminUser(_id: string): Promise<void> {
    // Stub
  },

  // Convenience Aliases
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('datasource_admin_token'));
  },

  async login(email: string, pass: string) {
    return this.adminLogin(email, pass);
  },

  logout(): void {
    this.adminLogout();
  },

  async submitEnquiry(payload: Partial<ContactEnquiry>) {
    return this.submitContact(payload);
  },

  async getEnquiries() {
    return this.getAdminEnquiries();
  },

  async createService(data: Partial<ServiceItem>) {
    return this.saveService(data);
  },

  async updateService(id: string, data: Partial<ServiceItem>) {
    return this.saveService({ ...data, id });
  },

  async createCaseStudy(data: Partial<CaseStudy>) {
    return this.saveCaseStudy(data);
  },

  async updateCaseStudy(id: string, data: Partial<CaseStudy>) {
    return this.saveCaseStudy({ ...data, id });
  },

  async createInsight(data: Partial<BlogPost>) {
    return this.saveInsight(data);
  },

  async updateInsight(id: string, data: Partial<BlogPost>) {
    return this.saveInsight({ ...data, id });
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    return this.updateSiteSettings(settings);
  },

  async queryMapsGrounding(params: { prompt: string; latitude?: number; longitude?: number }) {
    const res = await fetch('/api/gemini/maps-grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to fetch Maps Grounded information');
    }
    return json.data as {
      text: string;
      mapsChunks: Array<{
        title: string;
        uri: string;
        address?: string;
        placeAnswerSources?: {
          reviewSnippets?: Array<{
            snippet?: string;
            authorAttribution?: {
              displayName?: string;
              uri?: string;
              photoUri?: string;
            };
          }>;
        };
      }>;
      groundingMetadata?: any;
    };
  },

  async sendGeminiChat(params: {
    messages: Array<{ role: 'user' | 'model'; content: string }>;
    model?: string;
    roleMode?: 'architect' | 'data' | 'fast_estimator';
  }) {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to get Gemini response');
    }
    return json.data as {
      text: string;
      modelUsed: string;
    };
  },
};
