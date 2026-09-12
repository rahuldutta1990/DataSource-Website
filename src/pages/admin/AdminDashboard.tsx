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
} from 'lucide-react';
import { DataSourceLogo } from '../../components/DataSourceLogo.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import {
  ServiceItem,
  ServiceCategory,
  CaseStudy,
  BlogPost,
  ContactEnquiry,
  Testimonial,
  FAQ,
  SiteSettings,
} from '../../types.js';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inquiries' | 'services' | 'casestudies' | 'insights' | 'faq-testimonials' | 'settings'
  >('overview');

  // Data states
  const [inquiries, setInquiries] = useState<ContactEnquiry[]>([]);
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

  const checkAuthAndLoad = async () => {
    // If authenticated via Google OAuth with admin rights, ensure api auth token is set
    const isAdminUser = user && (profile?.role === 'admin' || user.email === 'admin@datasource.tech' || user.email === 'shimadutta62@gmail.com');
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
      ] = await Promise.all([
        api.getEnquiries(),
        api.getServices(),
        api.getServiceCategories(),
        api.getCaseStudies(),
        api.getInsights(),
        api.getTestimonials(),
        api.getFAQs(),
        api.getSettings(),
      ]);

      setInquiries(inquiriesData);
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

    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      showNotification('Site settings and statistics updated');
    } catch (err: any) {
      alert('Error updating settings: ' + err.message);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</p>
                <p className="text-3xl font-extrabold text-white mt-2 font-heading">{inquiries.length}</p>
                <p className="text-xs text-rose-400 mt-1">{newInquiriesCount} requiring review</p>
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

            <form onSubmit={handleSaveSettings} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Core Brand Philosophy
                </label>
                <textarea
                  rows={2}
                  value={settings.philosophy}
                  onChange={(e) => setSettings({ ...settings, philosophy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
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

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingService.slug || ''}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                />
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.excerpt || ''}
                  onChange={(e) => setEditingService({ ...editingService, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
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

            <form onSubmit={handleSaveCaseStudy} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={editingCaseStudy.client || ''}
                    onChange={(e) =>
                      setEditingCaseStudy({ ...editingCaseStudy, client: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    required
                    value={editingCaseStudy.industry || ''}
                    onChange={(e) =>
                      setEditingCaseStudy({ ...editingCaseStudy, industry: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Project Headline</label>
                <input
                  type="text"
                  required
                  value={editingCaseStudy.title || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Challenge Statement</label>
                <textarea
                  rows={2}
                  required
                  value={editingCaseStudy.challenge || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({ ...editingCaseStudy, challenge: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Solution Provided</label>
                <textarea
                  rows={2}
                  required
                  value={editingCaseStudy.solution || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({ ...editingCaseStudy, solution: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Result &amp; Impact</label>
                <textarea
                  rows={2}
                  required
                  value={editingCaseStudy.result || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({ ...editingCaseStudy, result: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
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

            <form onSubmit={handleSaveInsight} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingInsight.title || ''}
                  onChange={(e) =>
                    setEditingInsight({
                      ...editingInsight,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingInsight.category || ''}
                    onChange={(e) =>
                      setEditingInsight({ ...editingInsight, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Read Time</label>
                  <input
                    type="text"
                    required
                    value={editingInsight.readTime || ''}
                    onChange={(e) =>
                      setEditingInsight({ ...editingInsight, readTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Article Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={editingInsight.excerpt || ''}
                  onChange={(e) =>
                    setEditingInsight({ ...editingInsight, excerpt: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Content</label>
                <textarea
                  rows={5}
                  required
                  value={editingInsight.content || ''}
                  onChange={(e) =>
                    setEditingInsight({ ...editingInsight, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono text-xs"
                />
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
