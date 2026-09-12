import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, User as UserIcon, AlertCircle, ExternalLink, QrCode, Copy, Check } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { SEOHead } from '../components/SEOHead.js';
import { trackEvent, AnalyticsEvents } from '../utils/analytics.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { createFirestoreInquiry } from '../services/firestoreService.js';
import { GoogleMapsLocationFinder } from '../components/GoogleMapsLocationFinder.js';
import { WhatsAppIcon, cleanWhatsAppDigits } from '../components/WhatsAppChatbot.js';

export const Contact: React.FC = () => {
  const { user, profile, signInWithGoogle, refreshInquiries } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Custom Web & Cloud Applications',
    projectType: 'New Product Development',
    budgetRange: '$25k - $50k',
    message: '',
  });

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    message?: boolean;
  }>({});

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  useEffect(() => {
    const problemParam = searchParams.get('problem');
    const typeParam = searchParams.get('type');
    const serviceParam = searchParams.get('service');

    if (problemParam) {
      setFormData((prev) => ({
        ...prev,
        projectType: 'Technology Assessment / IT Audit',
        message: prev.message || `We are experiencing the following business/data challenge:\n• ${problemParam}\n\nWe would like an initial consultation to diagnose this bottleneck and review recommended solutions.`,
      }));
    } else if (typeParam === 'assessment') {
      setFormData((prev) => ({
        ...prev,
        projectType: 'Technology Assessment / IT Audit',
        message: prev.message || `Requesting a Free Initial IT & Data Architecture Assessment for our organization.`,
      }));
    }

    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        serviceInterest: serviceParam,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
        company: prev.company || profile?.company || '',
        phone: prev.phone || profile?.phone || '',
      }));
    }
  }, [user, profile]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedLead, setLastSubmittedLead] = useState<typeof formData | null>(null);
  const [copiedLead, setCopiedLead] = useState(false);

  const targetWhatsAppPhone = '+91 9038417437';
  const targetWhatsAppDigits = '919038417437';

  const generateWhatsAppLeadMessage = (lead: typeof formData) => {
    return `🚀 *New Consultation Request (DataSource Website)*
━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${lead.name || 'Client'}
🏢 *Company:* ${lead.company || 'Not Specified'}
📧 *Email:* ${lead.email}
📱 *Phone:* ${lead.phone || 'Not Specified'}
🛠️ *Service:* ${lead.serviceInterest}
📋 *Project Type:* ${lead.projectType}
💰 *Budget:* ${lead.budgetRange}
📝 *Requirement:*
${lead.message || 'Architecture consultation requested'}
━━━━━━━━━━━━━━━━━━━━━
🕒 *Timestamp:* ${new Date().toLocaleString()}`;
  };

  const generateWhatsAppLeadUrl = (lead: typeof formData) => {
    const text = generateWhatsAppLeadMessage(lead);
    return `https://wa.me/${targetWhatsAppDigits}?text=${encodeURIComponent(text)}`;
  };

  const validateField = (field: 'name' | 'email' | 'phone' | 'message', value: string): string => {
    const trimmed = value.trim();
    if (field === 'name') {
      if (!trimmed) return 'Full name is required.';
      if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
      return '';
    }

    if (field === 'email') {
      if (!trimmed) return 'Email is required.';
      if (!trimmed.includes('@')) return 'Email must contain an "@" symbol.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. name@example.com).';
      return '';
    }

    if (field === 'phone') {
      if (!trimmed) return 'Phone number is required.';
      if (/[a-zA-Z]/.test(trimmed)) {
        return 'Phone number must contain only numbers.';
      }
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        return `Phone number must be exactly 10 digits (${digitsOnly.length}/10 entered).`;
      }
      return '';
    }

    if (field === 'message') {
      if (!trimmed) return 'Please describe your problem or project objective.';
      if (trimmed.length < 10) return 'Please provide at least 10 characters explaining your requirement.';
      return '';
    }

    return '';
  };

  const handleBlur = (field: 'name' | 'email' | 'phone' | 'message') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const err = validateField(name as any, value);
      setFormErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required fields touched
    const allTouched = { name: true, email: true, phone: true, message: true };
    setTouched(allTouched);

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const phoneErr = validateField('phone', formData.phone);
    const msgErr = validateField('message', formData.message);

    const errors = {
      name: nameErr,
      email: emailErr,
      phone: phoneErr,
      message: msgErr,
    };
    setFormErrors(errors);

    if (nameErr || emailErr || phoneErr || msgErr) {
      setErrorMessage('Please correct the highlighted fields before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Submit to Firestore with client auth binding
      await createFirestoreInquiry({
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceRequired: formData.serviceInterest,
        budgetRange: formData.budgetRange,
        projectType: formData.projectType,
        requirement: formData.message.trim(),
        preferredContact: 'either',
        userId: user?.uid,
        userEmail: user?.email || undefined,
      });

      // 2. Also submit to backend API for dual persistence
      await api.submitEnquiry({
        ...formData,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        userId: user?.uid,
      });

      // 3. Refresh user's inquiries in context
      if (user) {
        await refreshInquiries();
      }

      // Track Google Analytics conversion event
      trackEvent(AnalyticsEvents.LEAD_SUBMITTED, {
        service_interest: formData.serviceInterest,
        budget_range: formData.budgetRange,
      });

      setLastSubmittedLead({ ...formData });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLeadDetails = () => {
    if (!lastSubmittedLead) return;
    const msg = generateWhatsAppLeadMessage(lastSubmittedLead);
    navigator.clipboard.writeText(msg);
    setCopiedLead(true);
    setTimeout(() => setCopiedLead(false), 2000);
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <SEOHead
        title="Schedule a Technical Consultation"
        description="Connect with DataSource principal consultants. Request an independent architectural evaluation, digital product roadmap, or data engineering consultation."
        keywords="hire software consultants, data engineering consultation, power bi dashboard audit, contact datasource"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />
      {/* Header */}
      <section className="pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Eyebrow text="Start a Conversation" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              Have a Technology or Data Problem?
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-body leading-relaxed">
              Let&apos;s understand the challenge first and find the right solution together. We start with your business goals, not pre-packaged software licenses.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm">
                {submitted ? (
                  <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
                        Consultation Request Submitted
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out! Your inquiry has been recorded and dispatched through our priority notification channels.
                      </p>
                    </div>

                    {/* Dual Lead Routing Status Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                      <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Email Dispatch</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">
                            Sent to <strong className="text-blue-600 dark:text-blue-400 font-mono">shimadutta62@gmail.com</strong>
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Route</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">
                            Target: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{targetWhatsAppPhone}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Priority Action Box */}
                    {lastSubmittedLead && (
                      <div className="max-w-lg mx-auto p-4 rounded-2xl bg-[#075E54]/10 dark:bg-emerald-950/50 border border-emerald-500/30 text-left space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <WhatsAppIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Instant WhatsApp Confirmation</span>
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                            Fastest Response
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Want an immediate response? Click below to send your structured project requirements directly to our principal consultant on WhatsApp.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <a
                            href={generateWhatsAppLeadUrl(lastSubmittedLead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-white" />
                            <span>Send Lead on WhatsApp ({targetWhatsAppPhone})</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={handleCopyLeadDetails}
                            className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title="Copy formatted lead text"
                          >
                            {copiedLead ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedLead ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setLastSubmittedLead(null);
                          setFormData({
                            name: user?.displayName || '',
                            email: user?.email || '',
                            phone: '',
                            company: '',
                            serviceInterest: 'Custom Web & Cloud Applications',
                            projectType: 'New Product Development',
                            budgetRange: '$25k - $50k',
                            message: '',
                          });
                        }}
                        className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition-colors"
                      >
                        <span>Submit another consultation request</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading mb-1">
                        Book a Technical Consultation
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Share your challenge with our engineering team for an objective appraisal.
                      </p>
                    </div>

                    {/* Google Auth Status Banner */}
                    {user ? (
                      <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-[#0077FF]" />
                          )}
                          <span className="text-slate-700 dark:text-slate-300">
                            Signed in as <strong className="text-[#0077FF] dark:text-[#38BDF8]">{user.displayName || user.email}</strong>. Contact details pre-filled.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <span className="text-slate-600 dark:text-slate-300">
                          Sign in with Google to autofill your contact details.
                        </span>
                        <button
                          type="button"
                          onClick={() => signInWithGoogle()}
                          className="inline-flex items-center gap-1.5 font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline self-start sm:self-auto shrink-0"
                        >
                          <span>Sign In with Google</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={() => handleBlur('name')}
                          placeholder="e.g. Sarah Jenkins"
                          aria-invalid={touched.name && !!formErrors.name}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C] transition-colors ${
                            touched.name && formErrors.name
                              ? 'border-2 border-rose-500 focus:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 focus:border-[#0077FF] dark:focus:border-[#38BDF8]'
                          }`}
                        />
                        {touched.name && formErrors.name && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formErrors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="e.g. sarah@example.com"
                          aria-invalid={touched.email && !!formErrors.email}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C] transition-colors ${
                            touched.email && formErrors.email
                              ? 'border-2 border-rose-500 focus:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 focus:border-[#0077FF] dark:focus:border-[#38BDF8]'
                          }`}
                        />
                        {touched.email && formErrors.email && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formErrors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="e.g. Apex Health Logistics"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Phone Number <span className="text-rose-500">*</span> <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 lowercase">(10 digits)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={() => handleBlur('phone')}
                          placeholder="e.g. 5550192834"
                          maxLength={14}
                          aria-invalid={touched.phone && !!formErrors.phone}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C] transition-colors ${
                            touched.phone && formErrors.phone
                              ? 'border-2 border-rose-500 focus:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 focus:border-[#0077FF] dark:focus:border-[#38BDF8]'
                          }`}
                        />
                        {touched.phone && formErrors.phone && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formErrors.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Service of Interest
                        </label>
                        <select
                          name="serviceInterest"
                          value={formData.serviceInterest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
                        >
                          <option>Custom Web &amp; Cloud Applications</option>
                          <option>UI/UX &amp; Product Design</option>
                          <option>Power BI &amp; Executive Dashboards</option>
                          <option>Data Analytics &amp; Predictive Insights</option>
                          <option>Data Engineering &amp; Pipeline Automation</option>
                          <option>Database Architecture &amp; Optimization</option>
                          <option>IT Consulting &amp; Technology Assessment</option>
                          <option>Cloud Infrastructure &amp; DevOps</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Project Scope / Type
                        </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
                        >
                          <option>New Product Development</option>
                          <option>Legacy System Modernization</option>
                          <option>BI / Dashboard Implementation</option>
                          <option>Data Pipeline &amp; ETL Automation</option>
                          <option>Technical Assessment / Audit</option>
                          <option>Other Custom Problem</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Describe the Problem or Objective <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={() => handleBlur('message')}
                        placeholder="Please describe the core bottleneck, current system constraints, and target timeline..."
                        aria-invalid={touched.message && !!formErrors.message}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C] resize-none font-body transition-colors ${
                          touched.message && formErrors.message
                            ? 'border-2 border-rose-500 focus:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700 focus:border-[#0077FF] dark:focus:border-[#38BDF8]'
                        }`}
                      />
                      {touched.message && formErrors.message && (
                        <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{formErrors.message}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0077FF] hover:bg-[#0062D6] disabled:opacity-50 text-white py-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors active:scale-98"
                    >
                      {submitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <span>Submit Consultation Request</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Confidentiality guaranteed. NDA available upon request.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Direct Info & Philosophy */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#0B1B2B] text-white rounded-3xl p-8 space-y-6 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Direct Office Lines
                </span>
                <h3 className="text-2xl font-bold font-heading">
                  Prefer to talk directly with an architect?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Call our advisory team directly or email us your scope documents. We respond to all technical queries within one business day.
                </p>

                <div className="space-y-4 pt-2 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Phone &amp; WhatsApp</p>
                      <a href="tel:+919038417437" className="text-white font-bold hover:text-cyan-400">
                        +91 9038417437
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <a href="mailto:contact@datasource.tech" className="text-white font-bold hover:text-cyan-400">
                        contact@datasource.tech
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Headquarters &amp; Hub</p>
                      <p className="text-white font-medium text-xs leading-relaxed">
                        3B13, Flat: 5D, Sanhita Simoco Township, Satuli, Langal Benki, Bhaganpur, Kashipur, Pithapukur, Bhangar, PO&PS: Hatisala Near Hatisala Six Lane, New Town Action 3, Kolkata 700135, West Bengal, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Office Hours</p>
                      <p className="text-white font-medium">Mon – Fri: 9:30 AM – 6:30 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated WhatsApp Direct Chat Card */}
              <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-emerald-500/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-[#25D366]/20 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Instant WhatsApp Chat</span>
                  </div>
                  <WhatsAppIcon className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="space-y-2 relative z-10">
                  <h4 className="text-xl font-bold font-heading">
                    Chat with a Solutions Architect
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Skip email delays. Message our senior technical team on WhatsApp at <strong className="text-emerald-300">{targetWhatsAppPhone}</strong> for rapid scoping, quote estimates, or architecture feedback.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 relative z-10">
                  <a
                    href={`https://wa.me/${targetWhatsAppDigits}?text=Hello%20DataSource%20team%2C%20I%20would%20like%20to%20discuss%20a%20technical%20project%20consultation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Open WhatsApp Chat ({targetWhatsAppPhone})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Tagline Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                  The DataSource Promise
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  &ldquo;You bring the challenge. DataSource builds the right solution.&rdquo;
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  We don&apos;t do high-pressure sales calls. Our initial consultation focuses entirely on scoping your technical problem and outlining potential architectural paths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Grounding Office & Tech Hub Section */}
      <section className="pb-20 pt-4 bg-slate-50/60 dark:bg-[#080E18]/60 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GoogleMapsLocationFinder />
        </div>
      </section>
    </div>
  );
};
