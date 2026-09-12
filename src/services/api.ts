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
  MediaItem,
  SiteSettings,
  DashboardStats,
  AdminUser,
} from '../types.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('datasource_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public APIs
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/site-settings`);
    if (!res.ok) throw new Error('Failed to load site settings');
    const json = await res.json();
    return json.data;
  },

  async getServices(category?: string, featured?: boolean): Promise<ServiceItem[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (featured) params.set('featured', 'true');
    const res = await fetch(`${API_BASE}/services?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load services');
    const json = await res.json();
    return json.data;
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem & { relatedServices: ServiceItem[] }> {
    const res = await fetch(`${API_BASE}/services/${slug}`);
    if (!res.ok) throw new Error('Service not found');
    const json = await res.json();
    return json.data;
  },

  async getServiceCategories(): Promise<ServiceCategory[]> {
    const res = await fetch(`${API_BASE}/service-categories`);
    if (!res.ok) throw new Error('Failed to load service categories');
    const json = await res.json();
    return json.data;
  },

  async getCaseStudies(featured?: boolean): Promise<CaseStudy[]> {
    const params = new URLSearchParams();
    if (featured) params.set('featured', 'true');
    const res = await fetch(`${API_BASE}/case-studies?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load case studies');
    const json = await res.json();
    return json.data;
  },

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy & { related: CaseStudy[] }> {
    const res = await fetch(`${API_BASE}/case-studies/${slug}`);
    if (!res.ok) throw new Error('Case study not found');
    const json = await res.json();
    return json.data;
  },

  async getIndustries(): Promise<Industry[]> {
    const res = await fetch(`${API_BASE}/industries`);
    if (!res.ok) throw new Error('Failed to load industries');
    const json = await res.json();
    return json.data;
  },

  async getInsights(category?: string, featured?: boolean): Promise<BlogPost[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (featured) params.set('featured', 'true');
    const res = await fetch(`${API_BASE}/insights?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load insights');
    const json = await res.json();
    return json.data;
  },

  async getInsightBySlug(slug: string): Promise<BlogPost & { related: BlogPost[] }> {
    const res = await fetch(`${API_BASE}/insights/${slug}`);
    if (!res.ok) throw new Error('Insight not found');
    const json = await res.json();
    return json.data;
  },

  async getBlogCategories(): Promise<BlogCategory[]> {
    const res = await fetch(`${API_BASE}/blog-categories`);
    if (!res.ok) throw new Error('Failed to load blog categories');
    const json = await res.json();
    return json.data;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Failed to load testimonials');
    const json = await res.json();
    return json.data;
  },

  async getFAQs(): Promise<FAQ[]> {
    const res = await fetch(`${API_BASE}/faqs`);
    if (!res.ok) throw new Error('Failed to load FAQs');
    const json = await res.json();
    return json.data;
  },

  async submitContact(payload: Partial<ContactEnquiry>): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit enquiry');
    return json;
  },

  // Admin Auth APIs
  async adminLogin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    localStorage.setItem('datasource_admin_token', json.token);
    localStorage.setItem('datasource_admin_user', JSON.stringify(json.user));
    return json;
  },

  async adminGetMe(): Promise<AdminUser | null> {
    const token = localStorage.getItem('datasource_admin_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/admin/me`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.user;
    } catch {
      return null;
    }
  },

  adminLogout(): void {
    localStorage.removeItem('datasource_admin_token');
    localStorage.removeItem('datasource_admin_user');
  },

  // Admin CMS CRUD APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard stats');
    const json = await res.json();
    return json.data;
  },

  // Admin Services
  async getAdminServices(): Promise<ServiceItem[]> {
    const res = await fetch(`${API_BASE}/admin/services`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveService(service: Partial<ServiceItem>): Promise<ServiceItem> {
    const isEdit = Boolean(service.id);
    const url = isEdit ? `${API_BASE}/admin/services/${service.id}` : `${API_BASE}/admin/services`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(service),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save service');
    return json.data;
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  // Admin Case Studies
  async getAdminCaseStudies(): Promise<CaseStudy[]> {
    const res = await fetch(`${API_BASE}/admin/case-studies`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveCaseStudy(cs: Partial<CaseStudy>): Promise<CaseStudy> {
    const isEdit = Boolean(cs.id);
    const url = isEdit ? `${API_BASE}/admin/case-studies/${cs.id}` : `${API_BASE}/admin/case-studies`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(cs),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save case study');
    return json.data;
  },

  async deleteCaseStudy(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/case-studies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete case study');
  },

  // Admin Insights / Blog Posts
  async getAdminInsights(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/admin/insights`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveInsight(post: Partial<BlogPost>): Promise<BlogPost> {
    const isEdit = Boolean(post.id);
    const url = isEdit ? `${API_BASE}/admin/insights/${post.id}` : `${API_BASE}/admin/insights`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(post),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save insight');
    return json.data;
  },

  async deleteInsight(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/insights/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete insight');
  },

  // Admin Testimonials
  async getAdminTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const isEdit = Boolean(testimonial.id);
    const url = isEdit ? `${API_BASE}/admin/testimonials/${testimonial.id}` : `${API_BASE}/admin/testimonials`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(testimonial),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save testimonial');
    return json.data;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },

  // Admin FAQs
  async getAdminFAQs(): Promise<FAQ[]> {
    const res = await fetch(`${API_BASE}/admin/faqs`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveFAQ(faq: Partial<FAQ>): Promise<FAQ> {
    const isEdit = Boolean(faq.id);
    const url = isEdit ? `${API_BASE}/admin/faqs/${faq.id}` : `${API_BASE}/admin/faqs`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(faq),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save FAQ');
    return json.data;
  },

  async deleteFAQ(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete FAQ');
  },

  // Admin Industries
  async getAdminIndustries(): Promise<Industry[]> {
    const res = await fetch(`${API_BASE}/admin/industries`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveIndustry(industry: Partial<Industry>): Promise<Industry> {
    const isEdit = Boolean(industry.id);
    const url = isEdit ? `${API_BASE}/admin/industries/${industry.id}` : `${API_BASE}/admin/industries`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(industry),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save industry');
    return json.data;
  },

  async deleteIndustry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/industries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete industry');
  },

  // Admin Enquiries
  async getAdminEnquiries(): Promise<ContactEnquiry[]> {
    const res = await fetch(`${API_BASE}/admin/enquiries`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async updateEnquiryStatus(id: string, status: string, notes?: string): Promise<ContactEnquiry> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, notes }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update enquiry');
    return json.data;
  },

  async deleteEnquiry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
  },

  // Admin Media
  async getAdminMedia(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE}/admin/media`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async saveMedia(item: Partial<MediaItem>): Promise<MediaItem> {
    const res = await fetch(`${API_BASE}/admin/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save media');
    return json.data;
  },

  async deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete media');
  },

  // Admin Site Settings
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update site settings');
    return json.data;
  },

  // Admin Users
  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeader(),
    });
    const json = await res.json();
    return json.data;
  },

  async createAdminUser(user: { name: string; email: string; password: string; role: string }): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(user),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create user');
    return json.data;
  },

  async deleteAdminUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
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
};
