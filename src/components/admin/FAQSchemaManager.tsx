import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode,
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowRight,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { FAQ } from '../../types.js';
import {
  generateFAQPageSchema,
  filterFAQsForPage,
  validateFAQItem,
} from '../../utils/schemaGenerator.js';

interface FAQSchemaManagerProps {
  faqs: FAQ[];
  onSaveFAQ: (faq: Partial<FAQ>) => Promise<void>;
  onDeleteFAQ: (id: string) => Promise<void>;
  onResetDefaults?: () => Promise<void>;
}

const CATEGORY_PRESETS = [
  'Services & Capabilities',
  'About & Company',
  'Power BI & Analytics',
  'Data Engineering & ETL',
  'Security & Governance',
  'Engagement & Delivery',
  'Engineering Standards',
  'General',
];

const RECOMMENDED_FAQS: Omit<FAQ, 'id'>[] = [
  {
    question: 'How does DataSource Technology protect enterprise data, proprietary IP, and confidentiality?',
    answer:
      'We enforce strict data sovereignty, signed non-disclosure agreements (NDAs), and enterprise security protocols. All data pipeline engineering, Power BI models, and cloud solutions are deployed directly within your dedicated cloud tenant (AWS, Azure, GCP) or isolated on-premises infrastructure. We never store, transfer, or retain client proprietary datasets externally.',
    category: 'Security & Governance',
    sortOrder: 1,
    status: 'published',
    targetPages: ['home', 'about', 'services'],
  },
  {
    question: 'What core technology and data consulting services does DataSource provide?',
    answer:
      'DataSource delivers end-to-end IT problem solving, including custom software and web application development, executive Power BI dashboard engineering, automated ETL/ELT data pipelines, cloud database architecture (PostgreSQL, Snowflake, BigQuery), system modernization, and pragmatic AI/automation workflows.',
    category: 'Services & Capabilities',
    sortOrder: 2,
    status: 'published',
    targetPages: ['services', 'home'],
  },
  {
    question: 'Where is DataSource Technology located, and do you support clients remotely and on-site?',
    answer:
      'Our principal Technology Hub & Consultation Office is located in Kolkata, West Bengal, India (Sanhita Simoco Township, New Town Action Area 3 corridor). We provide hybrid collaboration, on-site consultation across India, and fully remote engineering delivery for clients throughout India, the United States, Europe, and globally.',
    category: 'About & Company',
    sortOrder: 3,
    status: 'published',
    targetPages: ['about', 'home', 'services'],
  },
  {
    question: 'How do you design, optimize, and automate Power BI dashboards for large organizations?',
    answer:
      'We build star-schema data models, develop optimized DAX calculations, configure scheduled gateway refreshes, implement Row-Level Security (RLS) for multi-department access, and design high-contrast executive KPI views tailored for C-suite and operations leaders.',
    category: 'Power BI & Analytics',
    sortOrder: 4,
    status: 'published',
    targetPages: ['services'],
  },
  {
    question: 'What is the typical timeline and engagement model for custom software and data projects?',
    answer:
      'Engagements typically begin with a 1-to-2 week technical discovery and architecture sprint, followed by 4-to-12 week agile development iterations. We offer flexible engagement structures including dedicated project-based milestones, staff augmentation, and fractional technical advisory.',
    category: 'Engagement & Delivery',
    sortOrder: 5,
    status: 'published',
    targetPages: ['services', 'about'],
  },
  {
    question: 'What engineering methodologies and quality standards does DataSource follow?',
    answer:
      'Our engineering methodology is grounded in clean architecture, type safety (TypeScript, structured SQL), rigorous unit and integration testing, continuous CI/CD automated deployment, and strict performance benchmarking to ensure zero-downtime operational reliability.',
    category: 'Engineering Standards',
    sortOrder: 6,
    status: 'published',
    targetPages: ['about', 'services'],
  },
];

export const FAQSchemaManager: React.FC<FAQSchemaManagerProps> = ({
  faqs,
  onSaveFAQ,
  onDeleteFAQ,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'schema-inspector'>('library');
  const [filterPage, setFilterPage] = useState<'all' | 'services' | 'about' | 'home'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal / Drawer state for FAQ Add/Edit
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [schemaPageTarget, setSchemaPageTarget] = useState<'services' | 'about' | 'home' | 'all'>('services');

  // Form field state
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('Services & Capabilities');
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formTargetPages, setFormTargetPages] = useState<string[]>(['services', 'about', 'home']);
  const [formErrors, setFormErrors] = useState<{ question?: string; answer?: string }>({});

  const handleOpenAddModal = () => {
    setEditingFaq({});
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('Services & Capabilities');
    setFormSortOrder(faqs.length + 1);
    setFormStatus('published');
    setFormTargetPages(['services', 'about']);
    setFormErrors({});
  };

  const handleOpenEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category || 'General');
    setFormSortOrder(faq.sortOrder ?? 1);
    setFormStatus(faq.status || 'published');
    setFormTargetPages(faq.targetPages || ['home', 'services', 'about']);
    setFormErrors({});
  };

  const handleToggleTargetPage = (pageKey: string) => {
    setFormTargetPages((prev) =>
      prev.includes(pageKey) ? prev.filter((p) => p !== pageKey) : [...prev, pageKey]
    );
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { question?: string; answer?: string } = {};

    if (!formQuestion.trim()) {
      errors.question = 'Question text is required.';
    } else if (formQuestion.trim().length < 5) {
      errors.question = 'Question must be at least 5 characters.';
    }

    if (!formAnswer.trim()) {
      errors.answer = 'Answer text is required.';
    } else if (formAnswer.trim().length < 10) {
      errors.answer = 'Answer must be at least 10 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveFAQ({
        id: editingFaq?.id,
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        category: formCategory.trim() || 'General',
        sortOrder: Number(formSortOrder) || 1,
        status: formStatus,
        targetPages: formTargetPages.length > 0 ? formTargetPages : ['home', 'services', 'about'],
      });
      setEditingFaq(null);
    } catch (err) {
      console.error('Error saving FAQ:', err);
      alert('Failed to save FAQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickToggleStatus = async (faq: FAQ) => {
    const nextStatus = faq.status === 'published' ? 'draft' : 'published';
    await onSaveFAQ({
      ...faq,
      status: nextStatus,
    });
  };

  const handleDelete = async (id: string, question: string) => {
    if (window.confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      await onDeleteFAQ(id);
    }
  };

  const handleLoadPresets = async () => {
    if (
      !window.confirm(
        'Load the recommended high-performance FAQ set (covering Services, About, Power BI, and Kolkata Hub)? This will add missing questions to your database.'
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (onResetDefaults) {
        await onResetDefaults();
      } else {
        for (const item of RECOMMENDED_FAQS) {
          const exists = faqs.some(
            (f) => f.question.toLowerCase().trim() === item.question.toLowerCase().trim()
          );
          if (!exists) {
            await onSaveFAQ(item);
          }
        }
      }
    } catch (err) {
      console.error('Error loading default FAQs:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered FAQs list
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || faq.status === filterStatus;

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    let matchesPage = true;
    if (filterPage !== 'all') {
      if (Array.isArray(faq.targetPages) && faq.targetPages.length > 0) {
        matchesPage = faq.targetPages.includes(filterPage) || faq.targetPages.includes('all');
      } else {
        // heuristic fallback
        matchesPage = true;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesPage;
  });

  // Generated JSON-LD for Inspector
  const generatedSchema = generateFAQPageSchema(faqs, schemaPageTarget);
  const formattedJsonLd = generatedSchema ? JSON.stringify(generatedSchema, null, 2) : '// No published FAQs found for this page target.';

  const handleCopySchema = () => {
    navigator.clipboard.writeText(formattedJsonLd);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  // Stats calculation
  const totalCount = faqs.length;
  const publishedCount = faqs.filter((f) => f.status === 'published').length;
  const servicesSchemaCount = filterFAQsForPage(faqs, 'services').length;
  const aboutSchemaCount = filterFAQsForPage(faqs, 'about').length;
  const homeSchemaCount = filterFAQsForPage(faqs, 'home').length;

  return (
    <div className="space-y-8" id="faq-schema-manager">
      {/* Header & Sub-nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                FAQPage Schema &amp; Knowledge Base
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage FAQ accordions and generate valid Schema.org <code className="text-amber-300 font-mono text-xs">FAQPage</code> JSON-LD for Services &amp; About pages to dominate Google Rich Snippets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleLoadPresets}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700 disabled:opacity-50"
            title="Load recommended Services and About FAQ presets"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Recommended FAQs</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Total FAQs</span>
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-heading">
            {totalCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {publishedCount} published · {totalCount - publishedCount} drafts
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-blue-900/30 bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center justify-between">
            <span>Services Schema</span>
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-300 mt-1.5 font-heading">
            {servicesSchemaCount} <span className="text-xs font-normal text-slate-400">active</span>
          </div>
          <p className="text-[10px] text-blue-400/70 mt-1">
            Injected at /services
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-900/30 bg-gradient-to-b from-amber-950/20 to-transparent">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span>About Schema</span>
            <Globe className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1.5 font-heading">
            {aboutSchemaCount} <span className="text-xs font-normal text-slate-400">active</span>
          </div>
          <p className="text-[10px] text-amber-400/70 mt-1">
            Injected at /about
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-900/30 bg-gradient-to-b from-emerald-950/20 to-transparent">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
            <span>Home Schema</span>
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1.5 font-heading">
            {homeSchemaCount} <span className="text-xs font-normal text-slate-400">active</span>
          </div>
          <p className="text-[10px] text-emerald-400/70 mt-1">
            Injected at /
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Rich Result Status</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1">
            <span>Google Eligible</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Valid Schema.org syntax
          </p>
        </div>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'library'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ Library &amp; Page Allocator ({faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema-inspector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'schema-inspector'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Live FAQPage JSON-LD Inspector</span>
        </button>
      </div>

      {/* TAB 1: FAQ LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, answers, or categories..."
                className="w-full bg-slate-900 text-white pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Page filter */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Page:</span>
                {(['all', 'services', 'about', 'home'] as const).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setFilterPage(pg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      filterPage === pg
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Status:</span>
                {(['all', 'published', 'draft'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      filterStatus === st
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs List */}
          {filteredFaqs.length === 0 ? (
            <div className="bg-slate-950 p-12 text-center rounded-3xl border border-slate-800">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No FAQs matching current filters</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Try adjusting your search query, changing the page filter, or load the recommended FAQ preset dataset.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterPage('all');
                    setFilterStatus('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleLoadPresets}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Load Recommended FAQs
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq, idx) => {
                const validation = validateFAQItem(faq);
                const targetPages = faq.targetPages || ['home', 'services', 'about'];

                return (
                  <div
                    key={faq.id || `faq-${idx}`}
                    className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-850 text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                            #{faq.sortOrder ?? idx + 1}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-md bg-blue-950/60 text-blue-300 text-[11px] font-medium border border-blue-800/50">
                            {faq.category || 'General'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuickToggleStatus(faq)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              faq.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                            }`}
                            title="Click to toggle published / draft status"
                          >
                            {faq.status || 'published'}
                          </button>

                          {/* Target Page Badges */}
                          <div className="flex items-center gap-1 ml-auto sm:ml-0">
                            {targetPages.includes('services') && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                /services
                              </span>
                            )}
                            {targetPages.includes('about') && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                /about
                              </span>
                            )}
                            {targetPages.includes('home') && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                /home
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-white font-heading leading-snug">
                          {faq.question}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed font-body">
                          {faq.answer}
                        </p>

                        <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500 border-t border-slate-900">
                          <span>Q: {validation.charCountQuestion} chars</span>
                          <span>A: {validation.charCountAnswer} chars</span>
                          {validation.isValid ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Valid Schema Entity
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {validation.warnings[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(faq)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(faq.id, faq.question)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 hover:border-rose-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE FAQPAGE JSON-LD SCHEMA INSPECTOR */}
      {activeTab === 'schema-inspector' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" />
                  <span>Real-time Schema.org FAQPage JSON-LD Code</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  This structured data is automatically compiled and injected into the target page &lt;head&gt; tags via <code className="text-amber-300">SEOHead</code>.
                </p>
              </div>

              {/* Target Page Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Page Schema:</span>
                {(['services', 'about', 'home', 'all'] as const).map((target) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setSchemaPageTarget(target)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      schemaPageTarget === target
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {target === 'all' ? 'All (Unified)' : `/${target}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">
                  {filterFAQsForPage(faqs, schemaPageTarget).length} Active Entities
                </span>
                <span className="text-slate-500">for target {schemaPageTarget === 'all' ? 'All Pages' : `/${schemaPageTarget}`}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy JSON-LD</span>
                    </>
                  )}
                </button>

                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-colors border border-amber-500/30"
                >
                  <span>Test in Google Rich Results</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Code Display Area */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080d1a]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <span>&lt;script type=&quot;application/ld+json&quot;&gt;</span>
                <span>Schema.org / FAQPage</span>
              </div>
              <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[460px] scrollbar-thin scrollbar-thumb-slate-700">
                <code>{formattedJsonLd}</code>
              </pre>
            </div>

            {/* Google Search SERP Rich Snippet Simulation */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Search SERP Rich Snippet Preview</span>
              </div>

              <div className="p-4 rounded-xl bg-white text-slate-900 max-w-2xl shadow-md border border-slate-200">
                <div className="text-xs text-slate-600">https://datasource.tech &gt; {schemaPageTarget}</div>
                <div className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer">
                  {schemaPageTarget === 'services'
                    ? 'Enterprise IT, Cloud & Data Consulting Services | DataSource'
                    : schemaPageTarget === 'about'
                    ? 'About DataSource Technology | Engineering & AI Consulting'
                    : 'DataSource Technology & Solutions | Enterprise Software & Data'}
                </div>
                <div className="text-xs text-slate-700 mt-1">
                  DataSource provides high-performance custom software, Power BI executive dashboards, and automated ETL data pipelines...
                </div>

                {/* FAQ rich expansion preview */}
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  {filterFAQsForPage(faqs, schemaPageTarget).slice(0, 3).map((faq, fIdx) => (
                    <div key={fIdx} className="flex items-center justify-between text-slate-800 py-1 border-b border-slate-50 last:border-0 font-medium">
                      <span>{faq.question}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT FAQ */}
      <AnimatePresence>
        {editingFaq !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white font-heading">
                    {editingFaq.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure question, detailed response, and target page schema allocations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-5">
                {/* Question */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Question Text <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formQuestion.length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formQuestion}
                    onChange={(e) => {
                      setFormQuestion(e.target.value);
                      if (formErrors.question) setFormErrors((prev) => ({ ...prev, question: undefined }));
                    }}
                    placeholder="e.g. What core technology and data consulting services does DataSource provide?"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm border focus:outline-none transition-colors ${
                      formErrors.question
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-800 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.question && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.question}</span>
                    </p>
                  )}
                </div>

                {/* Answer */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Answer Text <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formAnswer.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={formAnswer}
                    onChange={(e) => {
                      setFormAnswer(e.target.value);
                      if (formErrors.answer) setFormErrors((prev) => ({ ...prev, answer: undefined }));
                    }}
                    placeholder="Provide a comprehensive, authoritative explanation. Concrete details build client trust and achieve high Google Rich Snippet click-through rates."
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm border resize-none focus:outline-none transition-colors ${
                      formErrors.answer
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-800 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.answer && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.answer}</span>
                    </p>
                  )}
                </div>

                {/* Target Pages Allocation */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Target Page Placements (Visible Accordion + FAQPage JSON-LD)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Select which pages will render this FAQ in their interactive accordion and output it inside their Schema.org JSON-LD markup:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        formTargetPages.includes('services')
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formTargetPages.includes('services')}
                        onChange={() => handleToggleTargetPage('services')}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <span className="text-xs">Services (/services)</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        formTargetPages.includes('about')
                          ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formTargetPages.includes('about')}
                        onChange={() => handleToggleTargetPage('about')}
                        className="rounded border-slate-700 text-amber-600 focus:ring-0"
                      />
                      <span className="text-xs">About (/about)</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        formTargetPages.includes('home')
                          ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formTargetPages.includes('home')}
                        onChange={() => handleToggleTargetPage('home')}
                        className="rounded border-slate-700 text-purple-600 focus:ring-0"
                      />
                      <span className="text-xs">Home (/)</span>
                    </label>
                  </div>
                </div>

                {/* Category & Sort Order & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORY_PRESETS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Display Sort Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={formSortOrder}
                      onChange={(e) => setFormSortOrder(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Publication Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as 'published' | 'draft')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="published">Published (Live &amp; Indexed)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingFaq.id ? 'Save Changes' : 'Create FAQ Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
