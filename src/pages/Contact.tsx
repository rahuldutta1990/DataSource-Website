import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, User as UserIcon } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { createFirestoreInquiry } from '../services/firestoreService.js';

export const Contact: React.FC = () => {
  const { user, profile, signInWithGoogle, refreshInquiries } = useAuth();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Submit to Firestore with client auth binding
      await createFirestoreInquiry({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        serviceRequired: formData.serviceInterest,
        budgetRange: formData.budgetRange,
        projectType: formData.projectType,
        requirement: formData.message,
        preferredContact: 'either',
        userId: user?.uid,
        userEmail: user?.email || undefined,
      });

      // 2. Also submit to backend API for dual persistence
      await api.submitEnquiry({
        ...formData,
        userId: user?.uid,
      });

      // 3. Refresh user's inquiries in context
      if (user) {
        await refreshInquiries();
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      // If Firestore or API had an issue, provide clear messaging
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200">
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
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                      Consultation Request Received
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. A DataSource principal consultant will review your challenge details and follow up within one business day.
                    </p>
                    <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                      <button
                        onClick={() => {
                          setSubmitted(false);
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
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. sarah@company.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
                        />
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
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +1 (555) 019-2834"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
                        />
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
                        Describe the Problem or Objective *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe the core bottleneck, current system constraints, and target timeline..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C] resize-none font-body"
                      />
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
                      <p className="text-xs text-slate-400">Phone</p>
                      <a href="tel:+18005123282" className="text-white font-bold hover:text-cyan-400">
                        +1 (800) 512-3282
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
                      <p className="text-xs text-slate-400">Headquarters</p>
                      <p className="text-white font-medium">Innovation Quarter, Tech Park Plaza</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Office Hours</p>
                      <p className="text-white font-medium">Mon – Fri: 9:00 AM – 6:00 PM EST</p>
                    </div>
                  </div>
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
    </div>
  );
};
