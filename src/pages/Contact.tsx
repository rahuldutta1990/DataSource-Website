import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { api } from '../services/api.js';

export const Contact: React.FC = () => {
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
      await api.submitEnquiry(formData);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF]">
      {/* Header */}
      <section className="pt-12 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Eyebrow text="Start a Conversation" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] font-heading">
              Have a Technology or Data Problem?
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-body leading-relaxed">
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
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 font-heading">
                      Consultation Request Received
                    </h2>
                    <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. A DataSource principal consultant will review your challenge details and follow up within one business day.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          company: '',
                          serviceInterest: 'Custom Web & Cloud Applications',
                          projectType: 'New Product Development',
                          budgetRange: '$25k - $50k',
                          message: '',
                        });
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-[#0077FF] font-bold hover:underline text-sm"
                    >
                      <span>Submit another consultation request</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B1B2B] font-heading mb-1">
                        Book a Technical Consultation
                      </h2>
                      <p className="text-xs text-slate-500">
                        Share your challenge with our engineering team for an objective appraisal.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. sarah@company.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="e.g. Apex Health Logistics"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +1 (555) 019-2834"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Service of Interest
                        </label>
                        <select
                          name="serviceInterest"
                          value={formData.serviceInterest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
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
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Project Scope / Type
                        </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Describe the Problem or Objective *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe the core bottleneck, current system constraints, and target timeline..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white resize-none font-body"
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

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Confidentiality guaranteed. NDA available upon request.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Direct Info & Philosophy */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#0B1B2B] text-white rounded-3xl p-8 space-y-6">
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
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0077FF]">
                  The DataSource Promise
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  &ldquo;You bring the challenge. DataSource builds the right solution.&rdquo;
                </p>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
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
