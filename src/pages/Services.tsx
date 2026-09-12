import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Search, Filter } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { DynamicIcon } from '../components/DynamicIcon.js';
import { SEOHead } from '../components/SEOHead.js';
import { api } from '../services/api.js';
import { ServiceItem, ServiceCategory } from '../types.js';

const serviceImages: Record<string, string> = {
  'custom-web-cloud-applications': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'power-bi-executive-dashboards': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  'data-engineering-pipeline-automation': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'it-consulting-technology-assessment': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  'ui-ux-digital-product-design': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
  'data-analytics-predictive-insights': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
  'database-architecture-migration': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  'workflow-automation-system-integration': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
};

export const Services: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    Promise.all([
      api.getServiceCategories().then(setCategories),
      api.getServices().then(setServices),
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

  return (
    <div className="min-h-screen transition-colors duration-200 overflow-x-hidden">
      <SEOHead
        title="Enterprise Technology & Data Consulting Services"
        description="Explore DataSource consulting services: Custom Web & Cloud Applications, Power BI Executive Dashboards, High-Throughput Data Engineering, and Technology Strategy Audits."
        keywords="cloud application development, data engineering services, power bi consulting, it architecture assessment, enterprise database migration"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />
      {/* Header with Professional Background & Entrance Animations */}
      <section className="relative pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Technology Architecture"
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
              Technology &amp; Data Consulting Services
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
              Pragmatic engineering and data consulting organized across four pillars. We help you design, build, optimize, and scale systems that last.
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

            {/* Search input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capabilities..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid with Section Images & Hover Wow Effects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Loading services...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-600 dark:text-slate-300 text-lg">No services matched your filter criteria.</p>
              <button
                onClick={() => {
                  handleCategoryChange('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-[#0077FF] dark:text-[#38BDF8] font-bold hover:underline text-sm"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((s, index) => {
                const cardImg = serviceImages[s.slug] || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop';
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="consulting-card bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#0077FF]/40 flex flex-col justify-between overflow-hidden group transition-all"
                  >
                    <div>
                      {/* Photographic Service Image Banner */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                        <img
                          src={cardImg}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-[#0E1726]/30 to-transparent" />
                        
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0B1B2B]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-[#0077FF] dark:text-[#38BDF8] border border-white/20">
                          {s.categoryName || 'Practice'}
                        </div>
                        
                        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white/95 dark:bg-[#0B1B2B]/95 backdrop-blur-md text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center shadow-lg border border-slate-200/60 dark:border-slate-700">
                          <DynamicIcon name={s.iconName} className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-7">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                          <Link to={`/services/${s.slug}`}>{s.title}</Link>
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-body">{s.excerpt}</p>

                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mb-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Core Scope:</p>
                          {s.keyCapabilities.map((cap, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-7 pb-7 pt-2">
                      <Link
                        to={`/services/${s.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0077FF] dark:text-[#38BDF8] hover:text-[#0052CC] dark:hover:text-cyan-300 pt-3 border-t border-slate-100 dark:border-slate-800/80 group-hover:translate-x-1 transition-all"
                      >
                        <span>View Service Specifications</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
