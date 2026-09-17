import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Search, Sparkles, Cpu, Layers, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { DynamicIcon } from '../components/DynamicIcon.js';
import { SEOHead } from '../components/SEOHead.js';
import { ServiceCardSkeleton } from '../components/SkeletonLoader.js';
import { api } from '../services/api.js';
import { ServiceItem, ServiceCategory, FAQ } from '../types.js';
import { generateFAQPageSchema, filterFAQsForPage } from '../utils/schemaGenerator.js';

const serviceImages: Record<string, string> = {
  'custom-model-engineering': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'ai-transformation-strategy': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  'intelligent-data-pipelines': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  'autonomous-agentic-workflows': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
};

export const Services: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    Promise.all([
      api.getServiceCategories().then(setCategories),
      api.getServices().then(setServices),
      api.getFAQs().then((items) => {
        setFaqs(items);
        const servicesFaqs = filterFAQsForPage(items, 'services');
        if (servicesFaqs.length > 0) {
          setActiveFaqId(servicesFaqs[0].id);
        }
      }),
    ]).finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filtered = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.categoryId === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keyCapabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const servicesFaqs = filterFAQsForPage(faqs, 'services');
  const faqSchema = generateFAQPageSchema(faqs, 'services');

  return (
    <div className="min-h-screen transition-colors duration-200 overflow-x-hidden">
      {/* On-Page SEO Meta Data with Dynamic FAQPage JSON-LD Schema */}
      <SEOHead
        title="Enterprise AI Services & Lifecycle Support | DataSource Tech"
        description="Discover our end-to-end AI services, from custom model engineering and autonomous workflows to intelligent data pipelines and strategic AI consulting."
        keywords="custom machine learning development, enterprise AI consulting, scalable neural network architecture, AI services, Power BI dashboards, ETL pipelines"
        canonicalUrl="https://datasource.tech/services"
        schema={faqSchema ? [faqSchema] : undefined}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />

      {/* Header with Background & Entrance Animations */}
      <section className="relative pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="AI Technology Architecture"
            className="w-full h-full object-cover opacity-10 dark:opacity-15 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-[#0A1220] dark:via-[#0A1220]/95 dark:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-4"
          >
            <Eyebrow text="Core Practices" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              Enterprise AI Services &amp; Lifecycle Engineering
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
              Discover our end-to-end AI services, from custom model engineering and autonomous workflows to intelligent data pipelines and strategic AI consulting.
            </p>
          </motion.div>

          {/* Search & Category Filter */}
          <div className="mt-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#0077FF] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Capabilities ({services.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    selectedCategory === c.id
                      ? 'bg-[#0077FF] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search capabilities or models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-20 bg-[#FAFCFF] dark:bg-[#070D18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <ServiceCardSkeleton key={n} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                No services found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleCategoryChange('all');
                }}
                className="mt-4 text-sm font-bold text-[#0077FF] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((service, idx) => {
                const img =
                  serviceImages[service.slug] ||
                  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop';

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="bg-white dark:bg-[#0E1726] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl dark:hover:border-cyan-500/30 transition-all flex flex-col group"
                  >
                    {/* Header Image */}
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      <img
                        src={img}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                          <DynamicIcon name={service.iconName} className="w-5 h-5" />
                        </div>
                        {service.featured && (
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#0077FF]/80 backdrop-blur-sm text-white">
                            Featured Practice
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#0077FF] dark:group-hover:text-cyan-400 transition-colors">
                          {service.title}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                          {service.excerpt}
                        </p>
                      </div>

                      {/* Capabilities */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Core Capabilities:
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {service.keyCapabilities.slice(0, 3).map((cap, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#0077FF] dark:text-cyan-400 group-hover:translate-x-1 transition-transform"
                        >
                          <span>Explore Technical Architecture</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services FAQ Accordion Section & Search Snippet Grounding */}
      {servicesFaqs.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-[#070D18] border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <Eyebrow text="Services Knowledge Base" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
                Frequently Asked Services &amp; Delivery Questions
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-body">
                Authoritative guidance on custom development, Power BI engineering, data pipeline automation, and enterprise engagement scopes.
              </p>
            </div>

            <div className="space-y-4">
              {servicesFaqs.map((faq) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-white dark:bg-[#0E1726] border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-white/80 dark:bg-[#0A1220] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 sm:mt-0 ${
                            isOpen
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 block mb-1">
                            {faq.category || 'Services'}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400' : 'text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-body border-t border-slate-100 dark:border-slate-800/80">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                <span>Have a bespoke engineering requirement or architecture question not covered here?</span>
              </div>
              <Link
                to="/contact"
                className="text-blue-600 dark:text-cyan-400 font-bold hover:underline shrink-0 inline-flex items-center gap-1"
              >
                <span>Ask our technical architects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Direct Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0B1B2B] to-[#0077FF] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Need a Custom AI Architecture Assessment?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Our principal machine learning engineers evaluate your data readiness, infrastructure security, and ROI roadmap with zero obligation.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Schedule an Architecture Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
