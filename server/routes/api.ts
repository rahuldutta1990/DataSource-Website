import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { loadDb, saveDb } from '../db.js';
import { requireAuth, generateToken, checkRateLimit, AuthenticatedRequest } from '../auth.js';
import {
  ServiceItem,
  CaseStudy,
  Industry,
  BlogPost,
  Testimonial,
  FAQ,
  ContactEnquiry,
  MediaItem,
  SiteSettings,
  AdminUser,
} from '../../src/types.js';

export const apiRouter = Router();

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Global Site Settings
apiRouter.get('/site-settings', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json({ data: db.settings });
});

// Services List
apiRouter.get('/services', (req: Request, res: Response) => {
  const db = loadDb();
  const { category, featured } = req.query;
  let list = db.services.filter((s) => s.status === 'published');

  if (category) {
    list = list.filter((s) => s.categoryId === category);
  }
  if (featured === 'true') {
    list = list.filter((s) => s.featured);
  }

  // Attach category names
  const enriched = list.map((s) => {
    const cat = db.serviceCategories.find((c) => c.id === s.categoryId);
    return { ...s, categoryName: cat?.name || 'General Consulting' };
  });

  res.json({ data: enriched });
});

// Service Detail by Slug
apiRouter.get('/services/:slug', (req: Request, res: Response) => {
  const db = loadDb();
  const service = db.services.find((s) => s.slug === req.params.slug && s.status === 'published');
  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  const category = db.serviceCategories.find((c) => c.id === service.categoryId);
  const relatedServices = db.services
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id && s.status === 'published')
    .slice(0, 3);

  res.json({
    data: {
      ...service,
      categoryName: category?.name || 'Technology',
      relatedServices,
    },
  });
});

// Service Categories
apiRouter.get('/service-categories', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json({ data: db.serviceCategories });
});

// Case Studies
apiRouter.get('/case-studies', (req: Request, res: Response) => {
  const db = loadDb();
  const { featured } = req.query;
  let list = db.caseStudies.filter((c) => c.status === 'published');
  if (featured === 'true') {
    list = list.filter((c) => c.featured);
  }
  res.json({ data: list });
});

// Case Study Detail
apiRouter.get('/case-studies/:slug', (req: Request, res: Response) => {
  const db = loadDb();
  const caseStudy = db.caseStudies.find((c) => c.slug === req.params.slug && c.status === 'published');
  if (!caseStudy) {
    res.status(404).json({ error: 'Case study not found' });
    return;
  }
  const related = db.caseStudies.filter((c) => c.id !== caseStudy.id && c.status === 'published').slice(0, 2);
  res.json({ data: { ...caseStudy, related } });
});

// Industries
apiRouter.get('/industries', (_req: Request, res: Response) => {
  const db = loadDb();
  const list = db.industries.filter((i) => i.status === 'published');
  res.json({ data: list });
});

// Blog/Insights Articles
apiRouter.get('/insights', (req: Request, res: Response) => {
  const db = loadDb();
  const { category, featured } = req.query;
  let list = db.blogPosts.filter((b) => b.status === 'published');

  if (category) {
    list = list.filter((b) => b.category.toLowerCase() === String(category).toLowerCase());
  }
  if (featured === 'true') {
    list = list.filter((b) => b.featured);
  }

  res.json({ data: list });
});

// Insight Detail by Slug
apiRouter.get('/insights/:slug', (req: Request, res: Response) => {
  const db = loadDb();
  const post = db.blogPosts.find((b) => b.slug === req.params.slug && b.status === 'published');
  if (!post) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }
  const related = db.blogPosts.filter((b) => b.id !== post.id && b.status === 'published').slice(0, 3);
  res.json({ data: { ...post, related } });
});

// Blog Categories
apiRouter.get('/blog-categories', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json({ data: db.blogCategories });
});

// Testimonials
apiRouter.get('/testimonials', (_req: Request, res: Response) => {
  const db = loadDb();
  const list = db.testimonials.filter((t) => t.status === 'published');
  res.json({ data: list });
});

// FAQs
apiRouter.get('/faqs', (_req: Request, res: Response) => {
  const db = loadDb();
  const list = db.faqs.filter((f) => f.status === 'published');
  res.json({ data: list });
});

// Submit Contact / Consultation Form
apiRouter.post('/contact', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 5, 60000)) {
    res.status(429).json({ error: 'Too many requests. Please wait a minute before submitting again.' });
    return;
  }

  const { name, company, email, phone, serviceRequired, budgetRange, projectType, requirement, preferredContact } = req.body;

  if (!name || !email || !requirement) {
    res.status(400).json({ error: 'Name, email, and project requirement are required fields.' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  const db = loadDb();
  const newEnquiry: ContactEnquiry = {
    id: `enq-${Date.now()}`,
    name: String(name).trim(),
    company: String(company || '').trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone || '').trim(),
    serviceRequired: String(serviceRequired || 'General Consultation'),
    budgetRange: String(budgetRange || 'Flexible'),
    projectType: String(projectType || 'Consultation'),
    requirement: String(requirement).trim(),
    preferredContact: preferredContact === 'phone' ? 'phone' : preferredContact === 'either' ? 'either' : 'email',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.enquiries.unshift(newEnquiry);
  await saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting DataSource. Our technology leadership will review your requirements and reach out promptly.',
    data: { id: newEnquiry.id },
  });
});

// ==========================================
// 2. ADMIN AUTHENTICATION
// ==========================================

apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 8, 60000)) {
    res.status(429).json({ error: 'Too many failed login attempts. Please wait 60 seconds.' });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const db = loadDb();
  const user = db.adminUsers.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());

  if (!user || !user.active) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const matches = bcrypt.compareSync(String(password), user.passwordHash || '');
  if (!matches) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

apiRouter.get('/admin/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// 3. ADMIN PROTECTED CMS CRUD
// ==========================================

// Dashboard Metrics
apiRouter.get('/admin/dashboard-stats', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const stats = {
    totalServices: db.services.length,
    publishedServices: db.services.filter((s) => s.status === 'published').length,
    totalCaseStudies: db.caseStudies.length,
    publishedCaseStudies: db.caseStudies.filter((c) => c.status === 'published').length,
    totalInsights: db.blogPosts.length,
    publishedInsights: db.blogPosts.filter((b) => b.status === 'published').length,
    draftInsights: db.blogPosts.filter((b) => b.status === 'draft').length,
    totalTestimonials: db.testimonials.length,
    totalFAQs: db.faqs.length,
    totalEnquiries: db.enquiries.length,
    newEnquiries: db.enquiries.filter((e) => e.status === 'new').length,
    recentEnquiries: db.enquiries.slice(0, 5),
    recentPosts: db.blogPosts.slice(0, 5),
  };
  res.json({ data: stats });
});

// --- Services CRUD ---
apiRouter.get('/admin/services', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.services });
});

apiRouter.post('/admin/services', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const payload = req.body;
  const newService: ServiceItem = {
    id: `srv-${Date.now()}`,
    title: payload.title || 'Untitled Service',
    slug: payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `service-${Date.now()}`,
    categoryId: payload.categoryId || db.serviceCategories[0]?.id || 'cat-1',
    excerpt: payload.excerpt || '',
    description: payload.description || '',
    keyCapabilities: Array.isArray(payload.keyCapabilities) ? payload.keyCapabilities : [],
    iconName: payload.iconName || 'Code2',
    sortOrder: Number(payload.sortOrder) || db.services.length + 1,
    status: payload.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(payload.featured),
    seoTitle: payload.seoTitle || '',
    seoDescription: payload.seoDescription || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.services.push(newService);
  await saveDb(db);
  res.status(201).json({ success: true, data: newService });
});

apiRouter.put('/admin/services/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  db.services[idx] = {
    ...db.services[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  await saveDb(db);
  res.json({ success: true, data: db.services[idx] });
});

apiRouter.delete('/admin/services/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.services = db.services.filter((s) => s.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Service deleted successfully' });
});

// --- Case Studies CRUD ---
apiRouter.get('/admin/case-studies', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.caseStudies });
});

apiRouter.post('/admin/case-studies', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const payload = req.body;
  const newCaseStudy: CaseStudy = {
    id: `cs-${Date.now()}`,
    title: payload.title || 'Untitled Case Study',
    slug: payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `case-study-${Date.now()}`,
    client: payload.client || 'Sample Demo Client',
    industry: payload.industry || 'Technology',
    year: payload.year || '2025',
    coverImage: payload.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    challenge: payload.challenge || '',
    solution: payload.solution || '',
    result: payload.result || '',
    metrics: Array.isArray(payload.metrics) ? payload.metrics : [],
    technologies: Array.isArray(payload.technologies) ? payload.technologies : [],
    implementationDetails: payload.implementationDetails || '',
    testimonialQuote: payload.testimonialQuote || '',
    testimonialAuthor: payload.testimonialAuthor || '',
    status: payload.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(payload.featured),
    seoTitle: payload.seoTitle || '',
    seoDescription: payload.seoDescription || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.caseStudies.push(newCaseStudy);
  await saveDb(db);
  res.status(201).json({ success: true, data: newCaseStudy });
});

apiRouter.put('/admin/case-studies/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.caseStudies.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Case study not found' });
    return;
  }

  db.caseStudies[idx] = {
    ...db.caseStudies[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  await saveDb(db);
  res.json({ success: true, data: db.caseStudies[idx] });
});

apiRouter.delete('/admin/case-studies/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.caseStudies = db.caseStudies.filter((c) => c.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Case study deleted' });
});

// --- Industries CRUD ---
apiRouter.get('/admin/industries', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.industries });
});

apiRouter.post('/admin/industries', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const payload = req.body;
  const newInd: Industry = {
    id: `ind-${Date.now()}`,
    name: payload.name || 'New Industry',
    slug: payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `industry-${Date.now()}`,
    description: payload.description || '',
    iconName: payload.iconName || 'Briefcase',
    sortOrder: Number(payload.sortOrder) || db.industries.length + 1,
    relatedServices: Array.isArray(payload.relatedServices) ? payload.relatedServices : [],
    imageUrl: payload.imageUrl || '',
    status: payload.status === 'draft' ? 'draft' : 'published',
  };

  db.industries.push(newInd);
  await saveDb(db);
  res.status(201).json({ success: true, data: newInd });
});

apiRouter.put('/admin/industries/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.industries.findIndex((i) => i.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Industry not found' });
    return;
  }

  db.industries[idx] = { ...db.industries[idx], ...req.body };
  await saveDb(db);
  res.json({ success: true, data: db.industries[idx] });
});

apiRouter.delete('/admin/industries/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.industries = db.industries.filter((i) => i.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Industry deleted' });
});

// --- Insights / Blog Posts CRUD ---
apiRouter.get('/admin/insights', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.blogPosts });
});

apiRouter.post('/admin/insights', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const payload = req.body;
  const newPost: BlogPost = {
    id: `post-${Date.now()}`,
    title: payload.title || 'Untitled Insight',
    slug: payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `insight-${Date.now()}`,
    excerpt: payload.excerpt || '',
    content: payload.content || '',
    coverImage: payload.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    author: payload.author || 'DataSource Practice Team',
    category: payload.category || 'Data Analytics',
    tags: Array.isArray(payload.tags) ? payload.tags : ['Consulting'],
    publishedAt: payload.publishedAt || new Date().toISOString(),
    readTime: payload.readTime || '4 min read',
    status: payload.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(payload.featured),
    seoTitle: payload.seoTitle || '',
    seoDescription: payload.seoDescription || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.blogPosts.push(newPost);
  await saveDb(db);
  res.status(201).json({ success: true, data: newPost });
});

apiRouter.put('/admin/insights/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.blogPosts.findIndex((b) => b.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  db.blogPosts[idx] = {
    ...db.blogPosts[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  await saveDb(db);
  res.json({ success: true, data: db.blogPosts[idx] });
});

apiRouter.delete('/admin/insights/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.blogPosts = db.blogPosts.filter((b) => b.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Article deleted' });
});

// --- Testimonials CRUD ---
apiRouter.get('/admin/testimonials', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.testimonials });
});

apiRouter.post('/admin/testimonials', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const payload = req.body;
  const newTestimonial: Testimonial = {
    id: `t-${Date.now()}`,
    name: payload.name || 'Sample Client',
    designation: payload.designation || 'Director',
    company: payload.company || 'Enterprise Partner',
    photoUrl: payload.photoUrl || '',
    quote: payload.quote || '',
    rating: Number(payload.rating) || 5,
    status: payload.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(payload.featured),
  };

  db.testimonials.push(newTestimonial);
  await saveDb(db);
  res.status(201).json({ success: true, data: newTestimonial });
});

apiRouter.put('/admin/testimonials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.testimonials.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Testimonial not found' });
    return;
  }

  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  await saveDb(db);
  res.json({ success: true, data: db.testimonials[idx] });
});

apiRouter.delete('/admin/testimonials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Testimonial deleted' });
});

// --- FAQs CRUD ---
apiRouter.get('/admin/faqs', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.faqs });
});

apiRouter.post('/admin/faqs', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const payload = req.body;
  const newFaq: FAQ = {
    id: `faq-${Date.now()}`,
    question: payload.question || 'New Question?',
    answer: payload.answer || '',
    category: payload.category || 'General',
    sortOrder: Number(payload.sortOrder) || db.faqs.length + 1,
    status: payload.status === 'draft' ? 'draft' : 'published',
  };

  db.faqs.push(newFaq);
  await saveDb(db);
  res.status(201).json({ success: true, data: newFaq });
});

apiRouter.put('/admin/faqs/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.faqs.findIndex((f) => f.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }

  db.faqs[idx] = { ...db.faqs[idx], ...req.body };
  await saveDb(db);
  res.json({ success: true, data: db.faqs[idx] });
});

apiRouter.delete('/admin/faqs/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.faqs = db.faqs.filter((f) => f.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'FAQ deleted' });
});

// --- Contact Enquiries Management ---
apiRouter.get('/admin/enquiries', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.enquiries });
});

apiRouter.put('/admin/enquiries/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const idx = db.enquiries.findIndex((e) => e.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }

  db.enquiries[idx] = {
    ...db.enquiries[idx],
    status: req.body.status || db.enquiries[idx].status,
    notes: req.body.notes !== undefined ? req.body.notes : db.enquiries[idx].notes,
  };

  await saveDb(db);
  res.json({ success: true, data: db.enquiries[idx] });
});

apiRouter.delete('/admin/enquiries/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.enquiries = db.enquiries.filter((e) => e.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Enquiry deleted' });
});

// --- Media Library ---
apiRouter.get('/admin/media', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  res.json({ data: db.media });
});

apiRouter.post('/admin/media', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  const { fileName, url, altText, mimeType, sizeBytes } = req.body;
  if (!url) {
    res.status(400).json({ error: 'Media URL is required' });
    return;
  }

  const newMedia: MediaItem = {
    id: `med-${Date.now()}`,
    fileName: fileName || `upload-${Date.now()}`,
    url: url,
    altText: altText || 'Media Asset',
    mimeType: mimeType || 'image/jpeg',
    sizeBytes: sizeBytes || 1024,
    createdAt: new Date().toISOString(),
  };

  db.media.unshift(newMedia);
  await saveDb(db);
  res.status(201).json({ success: true, data: newMedia });
});

apiRouter.delete('/admin/media/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.media = db.media.filter((m) => m.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'Media item deleted' });
});

// --- Site Settings Update ---
apiRouter.put('/admin/settings', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = loadDb();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  await saveDb(db);
  res.json({ success: true, data: db.settings });
});

// --- Admin Users Management ---
apiRouter.get('/admin/users', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'Super Admin') {
    res.status(403).json({ error: 'Only Super Admins can manage users' });
    return;
  }
  const db = loadDb();
  const safeUsers = db.adminUsers.map(({ passwordHash: _, ...rest }) => rest);
  res.json({ data: safeUsers });
});

apiRouter.post('/admin/users', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'Super Admin') {
    res.status(403).json({ error: 'Only Super Admins can create new administrative users' });
    return;
  }
  const { name, email, password, role } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  const db = loadDb();
  const existing = db.adminUsers.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'A user with this email address already exists' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(String(password), salt);

  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    passwordHash,
    role: role === 'Content Manager' ? 'Content Manager' : 'Super Admin',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.adminUsers.push(newUser);
  await saveDb(db);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, data: safeUser });
});

apiRouter.delete('/admin/users/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'Super Admin') {
    res.status(403).json({ error: 'Only Super Admins can delete users' });
    return;
  }
  if (req.user?.id === req.params.id) {
    res.status(400).json({ error: 'You cannot delete your own active administrator account' });
    return;
  }

  const db = loadDb();
  db.adminUsers = db.adminUsers.filter((u) => u.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true, message: 'User deleted' });
});
