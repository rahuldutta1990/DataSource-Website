import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  BookOpen,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  Mail,
  Phone,
  Calendar,
  Eye,
  Save,
  Download,
  Copy,
  Check,
  AlertCircle,
  Users,
  ShieldCheck,
  Palette,
  MessageCircle,
  Smartphone,
  MapPin,
  Tag,
} from 'lucide-react';
import { DataSourceLogo } from '../../components/DataSourceLogo.js';
import { ContrastChecker } from '../../components/admin/ContrastChecker.js';
import { OfficeLocationsManager } from '../../components/admin/OfficeLocationsManager.js';
import { TargetKeywordManager } from '../../components/admin/TargetKeywordManager.js';
import { BusinessProblemsManager } from '../../components/admin/BusinessProblemsManager.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import {
  ServiceItem,
  ServiceCategory,
  CaseStudy,
  BlogPost,
  ContactEnquiry,
  NewsletterSubscriber,
  Testimonial,
  FAQ,
  SiteSettings,
} from '../../types.js';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'inquiries'
    | 'subscribers'
    | 'services'
    | 'casestudies'
    | 'insights'
    | 'faq-testimonials'
    | 'problems'
    | 'maps-locations'
    | 'keywords'
    | 'settings'
    | 'contrast'
  >('overview');

  // Data states
  const [inquiries, setInquiries] = useState<ContactEnquiry[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [insights, setInsights] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit Modals
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<Partial<CaseStudy> | null>(null);
  const [editingInsight, setEditingInsight] = useState<Partial<BlogPost> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<ContactEnquiry | null>(null);

  // Form Validation States
  const [serviceErrors, setServiceErrors] = useState<Record<string, string>>({});
  const [serviceTouched, setServiceTouched] = useState<Record<string, boolean>>({});

  const [caseStudyErrors, setCaseStudyErrors] = useState<Record<string, string>>({});
  const [caseStudyTouched, setCaseStudyTouched] = useState<Record<string, boolean>>({});

  const [insightErrors, setInsightErrors] = useState<Record<string, string>>({});
  const [insightTouched, setInsightTouched] = useState<Record<string, boolean>>({});

  const [settingsErrors, setSettingsErrors] = useState<Record<string, string>>({});
  const [settingsTouched, setSettingsTouched] = useState<Record<string, boolean>>({});

  // Validation Logic
  const validateServiceField = (field: string, val: any): string => {
    switch (field) {
      case 'title':
        if (!val || !val.trim()) return 'Service title is required.';
        if (val.trim().length < 3) return 'Title must be at least 3 characters.';
        return '';
      case 'slug':
        if (!val || !val.trim()) return 'URL slug is required.';
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val.trim())) {
          return 'Valid slug format: lowercase letters, numbers, and hyphens (e.g. data-analytics).';
        }
        return '';
      case 'excerpt':
        if (!val || !val.trim()) return 'Short excerpt is required.';
        if (val.trim().length < 10) return 'Excerpt must be at least 10 characters.';
        return '';
      case 'description':
        if (!val || !val.trim()) return 'Detailed description is required.';
        if (val.trim().length < 20) return 'Description must be at least 20 characters.';
        return '';
      default:
        return '';
    }
  };

  const validateAllServiceFields = (service: Partial<ServiceItem>): Record<string, string> => {
    const errs: Record<string, string> = {};
    const titleErr = validateServiceField('title', service.title);
    if (titleErr) errs.title = titleErr;
    const slugErr = validateServiceField('slug', service.slug);
    if (slugErr) errs.slug = slugErr;
    const excerptErr = validateServiceField('excerpt', service.excerpt);
    if (excerptErr) errs.excerpt = excerptErr;
    const descErr = validateServiceField('description', service.description);
    if (descErr) errs.description = descErr;
    return errs;
  };

  const validateCaseStudyField = (field: string, val: any): string => {
    switch (field) {
      case 'client':
        if (!val || !val.trim()) return 'Client name is required.';
        if (val.trim().length < 2) return 'Client name must be at least 2 characters.';
        return '';
      case 'industry':
        if (!val || !val.trim()) return 'Industry is required.';
        if (val.trim().length < 2) return 'Industry must be at least 2 characters.';
        return '';
      case 'title':
        if (!val || !val.trim()) return 'Project headline is required.';
        if (val.trim().length < 3) return 'Headline must be at least 3 characters.';
        return '';
      case 'challenge':
        if (!val || !val.trim()) return 'Challenge statement is required.';
        if (val.trim().length < 10) return 'Challenge statement must be at least 10 characters.';
        return '';
      case 'solution':
        if (!val || !val.trim()) return 'Solution details are required.';
        if (val.trim().length < 10) return 'Solution details must be at least 10 characters.';
        return '';
      case 'result':
        if (!val || !val.trim()) return 'Result & impact summary is required.';
        if (val.trim().length < 5) return 'Result summary must be at least 5 characters.';
        return '';
      default:
        return '';
    }
  };

  const validateAllCaseStudyFields = (cs: Partial<CaseStudy>): Record<string, string> => {
    const errs: Record<string, string> = {};
    ['client', 'industry', 'title', 'challenge', 'solution', 'result'].forEach((f) => {
      const err = validateCaseStudyField(f, (cs as any)[f]);
      if (err) errs[f] = err;
    });
    return errs;
  };

  const validateInsightField = (field: string, val: any): string => {
    switch (field) {
      case 'title':
        if (!val || !val.trim()) return 'Article title is required.';
        if (val.trim().length < 3) return 'Title must be at least 3 characters.';
        return '';
      case 'category':
        if (!val || !val.trim()) return 'Category is required.';
        return '';
      case 'readTime':
        if (!val || !val.trim()) return 'Read time is required (e.g. 5 min read).';
        return '';
      case 'excerpt':
        if (!val || !val.trim()) return 'Article excerpt is required.';
        if (val.trim().length < 10) return 'Excerpt must be at least 10 characters.';
        return '';
      case 'content':
        if (!val || !val.trim()) return 'Full content is required.';
        if (val.trim().length < 20) return 'Article content must be at least 20 characters.';
        return '';
      default:
        return '';
    }
  };

  const validateAllInsightFields = (ins: Partial<BlogPost>): Record<string, string> => {
    const errs: Record<string, string> = {};
    ['title', 'category', 'readTime', 'excerpt', 'content'].forEach((f) => {
      const err = validateInsightField(f, (ins as any)[f]);
      if (err) errs[f] = err;
    });
    return errs;
  };

  const validateSettingsField = (field: string, val: any): string => {
    switch (field) {
      case 'tagline':
        if (!val || !val.trim()) return 'Brand tagline is required.';
        if (val.trim().length < 3) return 'Tagline must be at least 3 characters.';
        return '';
      case 'philosophy':
        if (!val || !val.trim()) return 'Core brand philosophy is required.';
        if (val.trim().length < 10) return 'Philosophy must be at least 10 characters.';
        return '';
      case 'email':
        if (!val || !val.trim()) return 'Contact email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email address.';
        return '';
      case 'phone':
        if (!val || !val.trim()) return 'Phone number is required.';
        if (val.trim().length < 7) return 'Phone number must be at least 7 characters.';
        return '';
      default:
        return '';
    }
  };

  const validateAllSettingsFields = (st: SiteSettings): Record<string, string> => {
    const errs: Record<string, string> = {};
    ['tagline', 'philosophy', 'email', 'phone'].forEach((f) => {
      const err = validateSettingsField(f, (st as any)[f]);
      if (err) errs[f] = err;
    });
    return errs;
  };

  const checkAuthAndLoad = async () => {
    // If authenticated via Google OAuth with admin rights, ensure api auth token is set
    const isAdminUser = user && (profile?.role === 'admin' || user.email === 'admin@datasource.tech' || user.email === 'shimadutta62@gmail.com' || user.email === 'rd14190@gmail.com');
    if (isAdminUser && !api.isAuthenticated()) {
      localStorage.setItem('datasource_admin_token', 'google_auth_admin_token');
      localStorage.setItem(
        'datasource_admin_user',
        JSON.stringify({
          id: user.uid,
          name: user.displayName || 'Administrator',
          email: user.email || 'admin@datasource.tech',
          role: 'Super Admin',
        })
      );
    }

    if (!api.isAuthenticated() && !isAdminUser) {
      navigate('/admin/login');
      return;
    }

    try {
      setLoading(true);
      const [
        inquiriesData,
        servicesData,
        categoriesData,
        caseStudiesData,
        insightsData,
        testimonialsData,
        faqsData,
        settingsData,
        subscribersData,
      ] = await Promise.all([
        api.getEnquiries(),
        api.getServices(),
        api.getServiceCategories(),
        api.getCaseStudies(),
        api.getInsights(),
        api.getTestimonials(),
        api.getFAQs(),
        api.getSettings(),
        api.getNewsletterSubscribers(),
      ]);

      setInquiries(inquiriesData);
      setSubscribers(subscribersData || []);
      setServices(servicesData);
      setCategories(categoriesData);
      setCaseStudies(caseStudiesData);
      setInsights(insightsData);
      setTestimonials(testimonialsData);
      setFaqs(faqsData);
      setSettings(settingsData);
    } catch (err: any) {
      if (err.message?.includes('auth') || err.message?.includes('Unauthorized')) {
        api.logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndLoad();
  }, [user, profile]);

  const handleLogout = async () => {
    api.logout();
    await signOutUser();
    navigate('/admin/login');
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Inquiry Status Handler
  const handleInquiryStatus = async (id: string, status: ContactEnquiry['status']) => {
    try {
      await api.updateEnquiryStatus(id, status);
      setInquiries((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
      showNotification(`Inquiry updated to "${status}"`);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Service Save Handler
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const errors = validateAllServiceFields(editingService);
    setServiceErrors(errors);
    setServiceTouched({ title: true, slug: true, excerpt: true, description: true });

    if (Object.keys(errors).length > 0) {
      showNotification('Please correct the validation errors in the form');
      return;
    }

    try {
      if (editingService.id) {
        const updated = await api.updateService(editingService.id, editingService);
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showNotification('Service updated successfully');
      } else {
        const created = await api.createService(editingService as any);
        setServices((prev) => [...prev, created]);
        showNotification('New service added');
      }
      setEditingService(null);
      setServiceErrors({});
      setServiceTouched({});
    } catch (err: any) {
      alert('Error saving service: ' + err.message);
    }
  };

  // Service Delete Handler
  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showNotification('Service deleted');
    } catch (err: any) {
      alert('Error deleting service: ' + err.message);
    }
  };

  // Case Study Save Handler
  const handleSaveCaseStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCaseStudy) return;

    const errors = validateAllCaseStudyFields(editingCaseStudy);
    setCaseStudyErrors(errors);
    setCaseStudyTouched({ client: true, industry: true, title: true, challenge: true, solution: true, result: true });

    if (Object.keys(errors).length > 0) {
      showNotification('Please correct the validation errors in the form');
      return;
    }

    try {
      if (editingCaseStudy.id) {
        const updated = await api.updateCaseStudy(editingCaseStudy.id, editingCaseStudy);
        setCaseStudies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showNotification('Case study updated');
      } else {
        const created = await api.createCaseStudy(editingCaseStudy as any);
        setCaseStudies((prev) => [...prev, created]);
        showNotification('New case study created');
      }
      setEditingCaseStudy(null);
      setCaseStudyErrors({});
      setCaseStudyTouched({});
    } catch (err: any) {
      alert('Error saving case study: ' + err.message);
    }
  };

  // Case Study Delete Handler
  const handleDeleteCaseStudy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      await api.deleteCaseStudy(id);
      setCaseStudies((prev) => prev.filter((c) => c.id !== id));
      showNotification('Case study deleted');
    } catch (err: any) {
      alert('Error deleting case study: ' + err.message);
    }
  };

  // Insight Save Handler
  const handleSaveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsight) return;

    const errors = validateAllInsightFields(editingInsight);
    setInsightErrors(errors);
    setInsightTouched({ title: true, category: true, readTime: true, excerpt: true, content: true });

    if (Object.keys(errors).length > 0) {
      showNotification('Please correct the validation errors in the form');
      return;
    }

    try {
      if (editingInsight.id) {
        const updated = await api.updateInsight(editingInsight.id, editingInsight);
        setInsights((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        showNotification('Insight article updated');
      } else {
        const created = await api.createInsight(editingInsight as any);
        setInsights((prev) => [created, ...prev]);
        showNotification('New insight article published');
      }
      setEditingInsight(null);
      setInsightErrors({});
      setInsightTouched({});
    } catch (err: any) {
      alert('Error saving article: ' + err.message);
    }
  };

  // Insight Delete Handler
  const handleDeleteInsight = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.deleteInsight(id);
      setInsights((prev) => prev.filter((i) => i.id !== id));
      showNotification('Article deleted');
    } catch (err: any) {
      alert('Error deleting article: ' + err.message);
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    const errors = validateAllSettingsFields(settings);
    setSettingsErrors(errors);
    setSettingsTouched({ tagline: true, philosophy: true, email: true, phone: true });

    if (Object.keys(errors).length > 0) {
      showNotification('Please correct the validation errors in settings');
      return;
    }

    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSettingsErrors({});
      setSettingsTouched({});
      showNotification('Site settings and statistics updated');
    } catch (err: any) {
      alert('Error updating settings: ' + err.message);
    }
  };

  // Newsletter Mailing List Handlers
  const handleCopyEmails = () => {
    if (subscribers.length === 0) return;
    const emailsList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailsList);
    setCopySuccess(true);
    showNotification(`Copied ${subscribers.length} email addresses to clipboard`);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) return;
    const headers = ['Email', 'Interest Focus', 'Source', 'Status', 'Subscribed At'];
    const rows = subscribers.map((s) => [
      `"${s.email.replace(/"/g, '""')}"`,
      `"${(s.interest || 'General').replace(/"/g, '""')}"`,
      `"${(s.source || 'Website').replace(/"/g, '""')}"`,
      `"${s.status || 'active'}"`,
      `"${new Date(s.createdAt).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `datasource_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported mailing list as CSV');
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Remove ${email} from the mailing list?`)) return;
    try {
      await api.deleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      showNotification(`Removed ${email} from mailing list`);
    } catch (err: any) {
      alert('Error removing subscriber: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-medium">
        Loading DataSource CMS Portal...
      </div>
    );
  }

  const newInquiriesCount = inquiries.filter((q) => q.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0077FF] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Top Logo */}
          <div className="p-6 border-b border-slate-800">
            <Link to="/">
              <DataSourceLogo variant="white-horizontal" className="h-9 w-auto" />
            </Link>
            <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-[#38BDF8]">
              CMS Administration
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Consultation Inquiries</span>
              </div>
              {newInquiriesCount > 0 && (
                <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {newInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'subscribers'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Mailing List Leads</span>
              </div>
              {subscribers.length > 0 && (
                <span className="text-xs bg-cyan-600/60 text-cyan-200 font-bold px-2 py-0.5 rounded-full">
                  {subscribers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'services'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Services ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('casestudies')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'casestudies'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Case Studies ({caseStudies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'insights'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Insights &amp; Blog ({insights.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faq-testimonials')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'faq-testimonials'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Reviews &amp; FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('problems')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'problems'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-[#38BDF8]" />
                <span>Business Problems</span>
              </div>
              <span className="text-xs bg-blue-500/20 text-[#38BDF8] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                {settings?.businessProblems?.length || 9}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('maps-locations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'maps-locations'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Google Maps &amp; Hubs</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {settings?.officeLocations?.length || 6}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('keywords')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'keywords'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Target Keywords &amp; SEO</span>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {settings?.seoKeywords?.length || 6}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site &amp; Brand Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('contrast')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'contrast'
                  ? 'bg-[#0077FF] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>WCAG Contrast Tool</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {user && (
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0077FF] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {user.displayName?.charAt(0) || 'A'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 bg-slate-900 hover:bg-slate-800/80 py-2.5 rounded-xl transition-colors"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 py-2.5 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-heading">
                DataSource CMS Overview
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage live digital assets, client engagement inquiries, and consulting content.
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</p>
                <p className="text-3xl font-extrabold text-white mt-2 font-heading">{inquiries.length}</p>
                <p className="text-xs text-rose-400 mt-1">{newInquiriesCount} requiring review</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Mailing Leads</p>
                <p className="text-3xl font-extrabold text-cyan-400 mt-2 font-heading">{subscribers.length}</p>
                <p className="text-xs text-slate-500 mt-1">Newsletter subscribers</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Services</p>
                <p className="text-3xl font-extrabold text-[#38BDF8] mt-2 font-heading">{services.length}</p>
                <p className="text-xs text-slate-500 mt-1">Across {categories.length} core pillars</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Case Studies</p>
                <p className="text-3xl font-extrabold text-[#0077FF] mt-2 font-heading">{caseStudies.length}</p>
                <p className="text-xs text-slate-500 mt-1">Real impact &amp; verified metrics</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Insights</p>
                <p className="text-3xl font-extrabold text-emerald-400 mt-2 font-heading">{insights.length}</p>
                <p className="text-xs text-slate-500 mt-1">Engineering articles</p>
              </div>
            </div>

            {/* Recent Inquiries List */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-heading">Recent Consultation Requests</h2>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-bold text-[#38BDF8] hover:underline"
                >
                  View All ({inquiries.length})
                </button>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No consultation inquiries received yet.</p>
              ) : (
                <div className="divide-y divide-slate-800 text-sm">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{inq.name}</span>
                          <span className="text-xs text-slate-400">({inq.company || 'Direct'})</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              inq.status === 'new'
                                ? 'bg-rose-500/20 text-rose-300'
                                : inq.status === 'in-progress'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {inq.serviceInterest} • &ldquo;{inq.message}&rdquo;
                        </p>
                      </div>

                      <button
                        onClick={() => setViewingInquiry(inq)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300"
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Business Problems Diagnostic Manager Banner */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-950 p-6 rounded-2xl border border-cyan-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    “What Business Problem Are You Trying to Solve?” Diagnostic
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure the problem-first homepage diagnostic section, executive symptom quotes, and consulting solutions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('problems')}
                className="px-4 py-2.5 rounded-xl bg-[#0077FF] hover:bg-[#0062D6] text-white text-xs font-bold shrink-0 transition-colors shadow"
              >
                Manage Business Problems ({settings?.businessProblems?.length || 9})
              </button>
            </div>

            {/* WCAG Contrast & Accessibility Verifier Banner */}
            <div className="bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 p-6 rounded-2xl border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Brand Palette &amp; WCAG Contrast Verifier
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test foreground and background color combinations against WCAG 2.1 AA/AAA accessibility requirements using DataSource brand palettes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('contrast')}
                className="px-4 py-2.5 rounded-xl bg-[#0077FF] hover:bg-[#0062D6] text-white text-xs font-bold shrink-0 transition-colors shadow"
              >
                Launch Contrast Tool
              </button>
            </div>
          </div>
        )}

        {/* 2. INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white font-heading">
                  Consultation Requests
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage incoming client inquiries submitted via the public consultation form.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Service &amp; Scope</th>
                      <th className="p-4">Budget</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inquiries.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-900/50">
                        <td className="p-4">
                          <p className="font-bold text-white">{q.name}</p>
                          <p className="text-xs text-slate-400">{q.email}</p>
                          {q.phone && <p className="text-xs text-slate-500">{q.phone}</p>}
                        </td>
                        <td className="p-4 text-slate-300">{q.company || '—'}</td>
                        <td className="p-4">
                          <p className="text-white text-xs font-medium">{q.serviceInterest}</p>
                          <p className="text-[11px] text-slate-500">{q.projectType}</p>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-300">{q.budgetRange}</td>
                        <td className="p-4">
                          <select
                            value={q.status}
                            onChange={(e) =>
                              handleInquiryStatus(q.id, e.target.value as ContactEnquiry['status'])
                            }
                            className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setViewingInquiry(q)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0077FF] text-xs font-medium text-white transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2.5 MAILING LIST & SUBSCRIBERS TAB */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white font-heading">
                  Newsletter &amp; Mailing List Leads
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Prospective client leads captured through the footer newsletter form and website subscription widgets.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyEmails}
                  disabled={subscribers.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
                  title="Copy all emails for campaign"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copySuccess ? 'Emails Copied!' : 'Copy All Emails'}</span>
                </button>

                <button
                  onClick={handleExportSubscribersCSV}
                  disabled={subscribers.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077FF] hover:bg-[#0066E0] text-white text-xs font-semibold transition-colors shadow-md shadow-blue-900/30 disabled:opacity-50"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Audience</p>
                <p className="text-2xl font-extrabold text-white mt-1 font-heading">{subscribers.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Active subscribers in Firestore</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Footer Form Signups</p>
                <p className="text-2xl font-extrabold text-cyan-400 mt-1 font-heading">
                  {subscribers.filter((s) => s.source?.includes('Footer') || !s.source).length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">High-intent organic leads</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Rate</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-heading">
                  {subscribers.length > 0
                    ? `${Math.round((subscribers.filter((s) => s.status !== 'unsubscribed').length / subscribers.length) * 100)}%`
                    : '100%'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Zero bounce rate recorded</p>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Subscriber Email</th>
                      <th className="p-4">Focus Interest</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Subscribed Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                          <p className="text-sm font-medium">No newsletter leads captured yet.</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Visitors subscribing via the footer newsletter form will appear here instantly.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-900/50">
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                {sub.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{sub.email}</p>
                                <p className="text-[11px] text-slate-500">ID: {sub.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              {sub.interest || 'General'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            {sub.source || 'Footer Form'}
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            {new Date(sub.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                sub.status === 'unsubscribed'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'unsubscribed' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                              {sub.status === 'unsubscribed' ? 'Unsubscribed' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white font-heading">
                  Services Management
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Configure active technology practices, capabilities checklists, and descriptions.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingService({
                    title: '',
                    slug: '',
                    categoryId: categories[0]?.id || 'cat-software',
                    categoryName: categories[0]?.name || 'Software Development & Cloud',
                    excerpt: '',
                    description: '',
                    iconName: 'Code2',
                    keyCapabilities: ['Architecture Review', 'End-to-End Delivery'],
                  })
                }
                className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-sm font-bold shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((s) => (
                <div key={s.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                        {s.categoryName}
                      </span>
                      <h3 className="text-lg font-bold text-white font-heading mt-0.5">{s.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/services/{s.slug}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingService(s)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-rose-900/50 text-rose-400"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.excerpt}</p>

                  <div className="pt-2 border-t border-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Key Capabilities:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.keyCapabilities.map((cap, i) => (
                        <span key={i} className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CASE STUDIES TAB */}
        {activeTab === 'casestudies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white font-heading">
                  Case Studies &amp; Outcomes
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage client success stories, challenge breakdowns, and verified metrics.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingCaseStudy({
                    title: '',
                    slug: '',
                    client: '',
                    industry: 'Finance & Banking',
                    year: '2026',
                    challenge: '',
                    solution: '',
                    result: '',
                    coverImage:
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
                    metrics: [
                      { label: 'Time Saved', value: '75%' },
                      { label: 'Latency Cut', value: '<500ms' },
                      { label: 'ROI Multiple', value: '4.2x' },
                    ],
                    technologies: ['TypeScript', 'Power BI', 'PostgreSQL'],
                  })
                }
                className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-sm font-bold shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Case Study</span>
              </button>
            </div>

            <div className="space-y-4">
              {caseStudies.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={c.coverImage}
                      alt={c.title}
                      className="w-20 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                          {c.client}
                        </span>
                        <span className="text-xs text-slate-500">• {c.industry} ({c.year})</span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-heading mt-0.5">{c.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/case-studies/{c.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => setEditingCaseStudy(c)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCaseStudy(c.id)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900/50 text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white font-heading">
                  Insights &amp; Engineering Blog
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Create and manage thought leadership articles and technical tutorials.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingInsight({
                    title: '',
                    slug: '',
                    category: 'Data Analytics',
                    readTime: '5 min read',
                    excerpt: '',
                    content: '',
                    coverImage:
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
                    author: 'DataSource Engineering Practice',
                    publishedAt: new Date().toISOString(),
                    tags: ['Architecture', 'Data'],
                  })
                }
                className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-sm font-bold shadow"
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </div>

            <div className="space-y-4">
              {insights.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-20 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                          {p.category}
                        </span>
                        <span className="text-xs text-slate-500">• {p.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-heading mt-0.5">{p.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/insights/{p.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => setEditingInsight(p)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInsight(p.id)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900/50 text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TESTIMONIALS & FAQ TAB */}
        {activeTab === 'faq-testimonials' && (
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-heading">
                Reviews &amp; FAQs
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Maintain client feedback testimonials and public FAQ accordion answers.
              </p>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">Client Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-xs italic text-slate-300 leading-relaxed mb-4">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="pt-3 border-t border-slate-900">
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.designation} • {t.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h2 className="text-xl font-bold text-white font-heading">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. SETTINGS & BRAND STATS TAB */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-heading">
                Site &amp; Brand Settings
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Update brand messaging, contact lines, and highlighted performance metrics.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} noValidate className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Brand Tagline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => {
                    setSettings({ ...settings, tagline: e.target.value });
                    if (settingsTouched.tagline) {
                      setSettingsErrors((prev) => ({ ...prev, tagline: validateSettingsField('tagline', e.target.value) }));
                    }
                  }}
                  onBlur={() => {
                    setSettingsTouched((prev) => ({ ...prev, tagline: true }));
                    setSettingsErrors((prev) => ({ ...prev, tagline: validateSettingsField('tagline', settings.tagline) }));
                  }}
                  aria-invalid={settingsTouched.tagline && !!settingsErrors.tagline}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none transition-colors ${
                    settingsTouched.tagline && settingsErrors.tagline
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {settingsTouched.tagline && settingsErrors.tagline && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{settingsErrors.tagline}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Core Brand Philosophy <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={settings.philosophy}
                  onChange={(e) => {
                    setSettings({ ...settings, philosophy: e.target.value });
                    if (settingsTouched.philosophy) {
                      setSettingsErrors((prev) => ({ ...prev, philosophy: validateSettingsField('philosophy', e.target.value) }));
                    }
                  }}
                  onBlur={() => {
                    setSettingsTouched((prev) => ({ ...prev, philosophy: true }));
                    setSettingsErrors((prev) => ({ ...prev, philosophy: validateSettingsField('philosophy', settings.philosophy) }));
                  }}
                  aria-invalid={settingsTouched.philosophy && !!settingsErrors.philosophy}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white text-sm resize-none focus:outline-none transition-colors ${
                    settingsTouched.philosophy && settingsErrors.philosophy
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {settingsTouched.philosophy && settingsErrors.philosophy && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{settingsErrors.philosophy}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Contact Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => {
                      setSettings({ ...settings, email: e.target.value });
                      if (settingsTouched.email) {
                        setSettingsErrors((prev) => ({ ...prev, email: validateSettingsField('email', e.target.value) }));
                      }
                    }}
                    onBlur={() => {
                      setSettingsTouched((prev) => ({ ...prev, email: true }));
                      setSettingsErrors((prev) => ({ ...prev, email: validateSettingsField('email', settings.email) }));
                    }}
                    aria-invalid={settingsTouched.email && !!settingsErrors.email}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none transition-colors ${
                      settingsTouched.email && settingsErrors.email
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {settingsTouched.email && settingsErrors.email && (
                    <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{settingsErrors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => {
                      setSettings({ ...settings, phone: e.target.value });
                      if (settingsTouched.phone) {
                        setSettingsErrors((prev) => ({ ...prev, phone: validateSettingsField('phone', e.target.value) }));
                      }
                    }}
                    onBlur={() => {
                      setSettingsTouched((prev) => ({ ...prev, phone: true }));
                      setSettingsErrors((prev) => ({ ...prev, phone: validateSettingsField('phone', settings.phone) }));
                    }}
                    aria-invalid={settingsTouched.phone && !!settingsErrors.phone}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none transition-colors ${
                      settingsTouched.phone && settingsErrors.phone
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {settingsTouched.phone && settingsErrors.phone && (
                    <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{settingsErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* WhatsApp Chatbot Integration Settings Panel */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-heading">
                        WhatsApp Chatbot Integration
                      </h3>
                      <p className="text-xs text-slate-400">
                        Configure the live floating WhatsApp chat widget, number, advisor profile, and welcome greeting.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.whatsappEnabled !== false}
                      onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2.5 text-xs font-bold text-slate-300">
                      {settings.whatsappEnabled !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      WhatsApp Business Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber || settings.phone || ''}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="e.g. +91 9038417437 or 9038417437"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Include country code (e.g. +1 for US/Canada, +44 for UK).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Advisor / Consultant Display Name
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappConsultantName || ''}
                      onChange={(e) => setSettings({ ...settings, whatsappConsultantName: e.target.value })}
                      placeholder="e.g. DataSource Solutions Architect"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Displays in widget header with verified business badge.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Automated Initial Greeting
                  </label>
                  <textarea
                    rows={2}
                    value={settings.whatsappGreeting || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappGreeting: e.target.value })}
                    placeholder="👋 Hi there! Welcome to DataSource Technology & Solutions. How can our technical architects assist you today?"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    First welcome message displayed to visitors opening the WhatsApp chat widget.
                  </p>
                </div>
              </div>

              {/* Stats Editor */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#38BDF8]">
                  Homepage Stats Bar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {settings.stats.map((st, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => {
                            const newStats = [...settings.stats];
                            newStats[idx].value = e.target.value;
                            setSettings({ ...settings, stats: newStats });
                          }}
                          placeholder="Value (e.g. 50+)"
                          className="w-1/3 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-cyan-300 font-bold"
                        />
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => {
                            const newStats = [...settings.stats];
                            newStats[idx].label = e.target.value;
                            setSettings({ ...settings, stats: newStats });
                          }}
                          placeholder="Label"
                          className="w-2/3 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        value={st.sublabel}
                        onChange={(e) => {
                          const newStats = [...settings.stats];
                          newStats[idx].sublabel = e.target.value;
                          setSettings({ ...settings, stats: newStats });
                        }}
                        placeholder="Sublabel"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer UPI QR Code Management */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-heading">
                      Footer UPI Payment QR Code
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload or replace the payment QR code displayed in the website footer. Valid formats: PNG, JPEG, WEBP, SVG (Max 5MB).
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <div className="bg-white p-3 rounded-xl shadow border border-slate-700 shrink-0 text-center">
                    <img
                      src={settings.footerQrCodeUrl || '/upi-qr.png'}
                      alt="Footer QR Preview"
                      className="w-28 h-28 object-contain rounded-lg mx-auto"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1.5 block">Current QR Preview</span>
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Upload New QR Image File
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validate file type
                        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
                        if (!validTypes.includes(file.type)) {
                          alert('Invalid file format. Please upload a PNG, JPEG, WEBP, or SVG image.');
                          return;
                        }

                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size exceeds 5MB limit. Please choose a smaller file.');
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          const result = uploadEvent.target?.result as string;
                          if (result) {
                            setSettings({ ...settings, footerQrCodeUrl: result });
                            showNotification('QR code updated in draft. Click "Save System Settings" to apply.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0077FF] file:text-white hover:file:bg-[#0062D6] cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">
                      Changes will reflect immediately in the website footer upon saving settings.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3 rounded-xl font-bold text-sm shadow"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* 8. BUSINESS PROBLEMS DIAGNOSTIC MANAGER */}
        {activeTab === 'problems' && (
          <BusinessProblemsManager
            settings={settings}
            onUpdateSettings={setSettings}
            showNotification={showNotification}
          />
        )}

        {/* 9. GOOGLE MAPS & GLOBAL OFFICE HUBS MANAGER */}
        {activeTab === 'maps-locations' && (
          <OfficeLocationsManager
            settings={settings}
            onUpdateSettings={setSettings}
            showNotification={showNotification}
          />
        )}

        {/* 10. GOOGLE SEARCH & TARGET KEYWORDS MANAGER */}
        {activeTab === 'keywords' && (
          <TargetKeywordManager
            settings={settings}
            onUpdateSettings={setSettings}
            showNotification={showNotification}
          />
        )}

        {/* 11. WCAG CONTRAST & ACCESSIBILITY TOOL */}
        {activeTab === 'contrast' && <ContrastChecker />}
      </main>

      {/* MODAL: Service Editor */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Service Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingService.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setEditingService({ ...editingService, title, slug });
                    if (serviceTouched.title) {
                      setServiceErrors((prev) => ({ ...prev, title: validateServiceField('title', title) }));
                    }
                  }}
                  onBlur={() => {
                    setServiceTouched((prev) => ({ ...prev, title: true }));
                    setServiceErrors((prev) => ({ ...prev, title: validateServiceField('title', editingService.title) }));
                  }}
                  aria-invalid={serviceTouched.title && !!serviceErrors.title}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    serviceTouched.title && serviceErrors.title
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {serviceTouched.title && serviceErrors.title && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{serviceErrors.title}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingService.slug || ''}
                  onChange={(e) => {
                    const slug = e.target.value;
                    setEditingService({ ...editingService, slug });
                    if (serviceTouched.slug) {
                      setServiceErrors((prev) => ({ ...prev, slug: validateServiceField('slug', slug) }));
                    }
                  }}
                  onBlur={() => {
                    setServiceTouched((prev) => ({ ...prev, slug: true }));
                    setServiceErrors((prev) => ({ ...prev, slug: validateServiceField('slug', editingService.slug) }));
                  }}
                  aria-invalid={serviceTouched.slug && !!serviceErrors.slug}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm font-mono focus:outline-none transition-colors ${
                    serviceTouched.slug && serviceErrors.slug
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {serviceTouched.slug && serviceErrors.slug && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{serviceErrors.slug}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={editingService.categoryId || ''}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id === e.target.value);
                    setEditingService({
                      ...editingService,
                      categoryId: e.target.value,
                      categoryName: cat?.name || '',
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editingService.excerpt || ''}
                  onChange={(e) => {
                    const excerpt = e.target.value;
                    setEditingService({ ...editingService, excerpt });
                    if (serviceTouched.excerpt) {
                      setServiceErrors((prev) => ({ ...prev, excerpt: validateServiceField('excerpt', excerpt) }));
                    }
                  }}
                  onBlur={() => {
                    setServiceTouched((prev) => ({ ...prev, excerpt: true }));
                    setServiceErrors((prev) => ({ ...prev, excerpt: validateServiceField('excerpt', editingService.excerpt) }));
                  }}
                  aria-invalid={serviceTouched.excerpt && !!serviceErrors.excerpt}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    serviceTouched.excerpt && serviceErrors.excerpt
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {serviceTouched.excerpt && serviceErrors.excerpt && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{serviceErrors.excerpt}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={editingService.description || ''}
                  onChange={(e) => {
                    const description = e.target.value;
                    setEditingService({ ...editingService, description });
                    if (serviceTouched.description) {
                      setServiceErrors((prev) => ({ ...prev, description: validateServiceField('description', description) }));
                    }
                  }}
                  onBlur={() => {
                    setServiceTouched((prev) => ({ ...prev, description: true }));
                    setServiceErrors((prev) => ({ ...prev, description: validateServiceField('description', editingService.description) }));
                  }}
                  aria-invalid={serviceTouched.description && !!serviceErrors.description}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    serviceTouched.description && serviceErrors.description
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {serviceTouched.description && serviceErrors.description && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{serviceErrors.description}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Key Capabilities (comma separated)
                </label>
                <input
                  type="text"
                  value={(editingService.keyCapabilities || []).join(', ')}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      keyCapabilities: e.target.value.split(',').map((x) => x.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0077FF] text-white text-sm font-bold shadow"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Case Study Editor */}
      {editingCaseStudy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingCaseStudy.id ? 'Edit Case Study' : 'Create Case Study'}
              </h3>
              <button
                onClick={() => setEditingCaseStudy(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCaseStudy} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Client Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.client || ''}
                    onChange={(e) => {
                      const client = e.target.value;
                      setEditingCaseStudy({ ...editingCaseStudy, client });
                      if (caseStudyTouched.client) {
                        setCaseStudyErrors((prev) => ({ ...prev, client: validateCaseStudyField('client', client) }));
                      }
                    }}
                    onBlur={() => {
                      setCaseStudyTouched((prev) => ({ ...prev, client: true }));
                      setCaseStudyErrors((prev) => ({ ...prev, client: validateCaseStudyField('client', editingCaseStudy.client) }));
                    }}
                    aria-invalid={caseStudyTouched.client && !!caseStudyErrors.client}
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      caseStudyTouched.client && caseStudyErrors.client
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {caseStudyTouched.client && caseStudyErrors.client && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{caseStudyErrors.client}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Industry <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.industry || ''}
                    onChange={(e) => {
                      const industry = e.target.value;
                      setEditingCaseStudy({ ...editingCaseStudy, industry });
                      if (caseStudyTouched.industry) {
                        setCaseStudyErrors((prev) => ({ ...prev, industry: validateCaseStudyField('industry', industry) }));
                      }
                    }}
                    onBlur={() => {
                      setCaseStudyTouched((prev) => ({ ...prev, industry: true }));
                      setCaseStudyErrors((prev) => ({ ...prev, industry: validateCaseStudyField('industry', editingCaseStudy.industry) }));
                    }}
                    aria-invalid={caseStudyTouched.industry && !!caseStudyErrors.industry}
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      caseStudyTouched.industry && caseStudyErrors.industry
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {caseStudyTouched.industry && caseStudyErrors.industry && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{caseStudyErrors.industry}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Project Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingCaseStudy.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setEditingCaseStudy({ ...editingCaseStudy, title, slug });
                    if (caseStudyTouched.title) {
                      setCaseStudyErrors((prev) => ({ ...prev, title: validateCaseStudyField('title', title) }));
                    }
                  }}
                  onBlur={() => {
                    setCaseStudyTouched((prev) => ({ ...prev, title: true }));
                    setCaseStudyErrors((prev) => ({ ...prev, title: validateCaseStudyField('title', editingCaseStudy.title) }));
                  }}
                  aria-invalid={caseStudyTouched.title && !!caseStudyErrors.title}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    caseStudyTouched.title && caseStudyErrors.title
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {caseStudyTouched.title && caseStudyErrors.title && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{caseStudyErrors.title}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Challenge Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editingCaseStudy.challenge || ''}
                  onChange={(e) => {
                    const challenge = e.target.value;
                    setEditingCaseStudy({ ...editingCaseStudy, challenge });
                    if (caseStudyTouched.challenge) {
                      setCaseStudyErrors((prev) => ({ ...prev, challenge: validateCaseStudyField('challenge', challenge) }));
                    }
                  }}
                  onBlur={() => {
                    setCaseStudyTouched((prev) => ({ ...prev, challenge: true }));
                    setCaseStudyErrors((prev) => ({ ...prev, challenge: validateCaseStudyField('challenge', editingCaseStudy.challenge) }));
                  }}
                  aria-invalid={caseStudyTouched.challenge && !!caseStudyErrors.challenge}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    caseStudyTouched.challenge && caseStudyErrors.challenge
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {caseStudyTouched.challenge && caseStudyErrors.challenge && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{caseStudyErrors.challenge}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Solution Provided <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editingCaseStudy.solution || ''}
                  onChange={(e) => {
                    const solution = e.target.value;
                    setEditingCaseStudy({ ...editingCaseStudy, solution });
                    if (caseStudyTouched.solution) {
                      setCaseStudyErrors((prev) => ({ ...prev, solution: validateCaseStudyField('solution', solution) }));
                    }
                  }}
                  onBlur={() => {
                    setCaseStudyTouched((prev) => ({ ...prev, solution: true }));
                    setCaseStudyErrors((prev) => ({ ...prev, solution: validateCaseStudyField('solution', editingCaseStudy.solution) }));
                  }}
                  aria-invalid={caseStudyTouched.solution && !!caseStudyErrors.solution}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    caseStudyTouched.solution && caseStudyErrors.solution
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {caseStudyTouched.solution && caseStudyErrors.solution && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{caseStudyErrors.solution}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Result &amp; Impact <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editingCaseStudy.result || ''}
                  onChange={(e) => {
                    const result = e.target.value;
                    setEditingCaseStudy({ ...editingCaseStudy, result });
                    if (caseStudyTouched.result) {
                      setCaseStudyErrors((prev) => ({ ...prev, result: validateCaseStudyField('result', result) }));
                    }
                  }}
                  onBlur={() => {
                    setCaseStudyTouched((prev) => ({ ...prev, result: true }));
                    setCaseStudyErrors((prev) => ({ ...prev, result: validateCaseStudyField('result', editingCaseStudy.result) }));
                  }}
                  aria-invalid={caseStudyTouched.result && !!caseStudyErrors.result}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    caseStudyTouched.result && caseStudyErrors.result
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {caseStudyTouched.result && caseStudyErrors.result && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{caseStudyErrors.result}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCaseStudy(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0077FF] text-white text-sm font-bold shadow"
                >
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Article Editor */}
      {editingInsight && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingInsight.id ? 'Edit Insight' : 'New Article'}
              </h3>
              <button
                onClick={() => setEditingInsight(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInsight} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingInsight.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setEditingInsight({ ...editingInsight, title, slug });
                    if (insightTouched.title) {
                      setInsightErrors((prev) => ({ ...prev, title: validateInsightField('title', title) }));
                    }
                  }}
                  onBlur={() => {
                    setInsightTouched((prev) => ({ ...prev, title: true }));
                    setInsightErrors((prev) => ({ ...prev, title: validateInsightField('title', editingInsight.title) }));
                  }}
                  aria-invalid={insightTouched.title && !!insightErrors.title}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    insightTouched.title && insightErrors.title
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {insightTouched.title && insightErrors.title && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{insightErrors.title}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingInsight.category || ''}
                    onChange={(e) => {
                      const category = e.target.value;
                      setEditingInsight({ ...editingInsight, category });
                      if (insightTouched.category) {
                        setInsightErrors((prev) => ({ ...prev, category: validateInsightField('category', category) }));
                      }
                    }}
                    onBlur={() => {
                      setInsightTouched((prev) => ({ ...prev, category: true }));
                      setInsightErrors((prev) => ({ ...prev, category: validateInsightField('category', editingInsight.category) }));
                    }}
                    aria-invalid={insightTouched.category && !!insightErrors.category}
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      insightTouched.category && insightErrors.category
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {insightTouched.category && insightErrors.category && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{insightErrors.category}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Read Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={editingInsight.readTime || ''}
                    onChange={(e) => {
                      const readTime = e.target.value;
                      setEditingInsight({ ...editingInsight, readTime });
                      if (insightTouched.readTime) {
                        setInsightErrors((prev) => ({ ...prev, readTime: validateInsightField('readTime', readTime) }));
                      }
                    }}
                    onBlur={() => {
                      setInsightTouched((prev) => ({ ...prev, readTime: true }));
                      setInsightErrors((prev) => ({ ...prev, readTime: validateInsightField('readTime', editingInsight.readTime) }));
                    }}
                    aria-invalid={insightTouched.readTime && !!insightErrors.readTime}
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      insightTouched.readTime && insightErrors.readTime
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {insightTouched.readTime && insightErrors.readTime && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{insightErrors.readTime}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Article Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editingInsight.excerpt || ''}
                  onChange={(e) => {
                    const excerpt = e.target.value;
                    setEditingInsight({ ...editingInsight, excerpt });
                    if (insightTouched.excerpt) {
                      setInsightErrors((prev) => ({ ...prev, excerpt: validateInsightField('excerpt', excerpt) }));
                    }
                  }}
                  onBlur={() => {
                    setInsightTouched((prev) => ({ ...prev, excerpt: true }));
                    setInsightErrors((prev) => ({ ...prev, excerpt: validateInsightField('excerpt', editingInsight.excerpt) }));
                  }}
                  aria-invalid={insightTouched.excerpt && !!insightErrors.excerpt}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    insightTouched.excerpt && insightErrors.excerpt
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {insightTouched.excerpt && insightErrors.excerpt && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{insightErrors.excerpt}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={editingInsight.content || ''}
                  onChange={(e) => {
                    const content = e.target.value;
                    setEditingInsight({ ...editingInsight, content });
                    if (insightTouched.content) {
                      setInsightErrors((prev) => ({ ...prev, content: validateInsightField('content', content) }));
                    }
                  }}
                  onBlur={() => {
                    setInsightTouched((prev) => ({ ...prev, content: true }));
                    setInsightErrors((prev) => ({ ...prev, content: validateInsightField('content', editingInsight.content) }));
                  }}
                  aria-invalid={insightTouched.content && !!insightErrors.content}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm font-mono text-xs focus:outline-none transition-colors ${
                    insightTouched.content && insightErrors.content
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {insightTouched.content && insightErrors.content && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{insightErrors.content}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingInsight(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0077FF] text-white text-sm font-bold shadow"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Inquiry Inspector */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-left space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                  Consultation Request Detail
                </span>
                <h3 className="text-xl font-bold text-white font-heading mt-0.5">
                  {viewingInquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingInquiry(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold">Email &amp; Phone</p>
                <p className="text-white font-medium mt-0.5">{viewingInquiry.email}</p>
                {viewingInquiry.phone && (
                  <p className="text-slate-300 text-xs mt-0.5">{viewingInquiry.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs text-slate-500 font-semibold">Company</p>
                  <p className="text-white font-medium mt-0.5">{viewingInquiry.company || 'Direct'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs text-slate-500 font-semibold">Budget</p>
                  <p className="text-white font-medium mt-0.5">{viewingInquiry.budgetRange}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold">Service &amp; Project Type</p>
                <p className="text-white font-medium mt-0.5">{viewingInquiry.serviceInterest}</p>
                <p className="text-xs text-slate-400">{viewingInquiry.projectType}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold">Submitted Problem Statement</p>
                <p className="text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">
                  {viewingInquiry.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Status:</span>
                <select
                  value={viewingInquiry.status}
                  onChange={(e) => {
                    handleInquiryStatus(viewingInquiry.id, e.target.value as any);
                    setViewingInquiry({ ...viewingInquiry, status: e.target.value as any });
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <a
                href={`mailto:${viewingInquiry.email}?subject=DataSource Consulting Inquiry follow-up`}
                className="inline-flex items-center gap-1.5 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
