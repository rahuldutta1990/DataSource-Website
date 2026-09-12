import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, Filter } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { DynamicIcon } from '../components/DynamicIcon.js';
import { api } from '../services/api.js';
import { ServiceItem, ServiceCategory } from '../types.js';

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
    <div className="min-h-screen bg-[#FAFCFF]">
      {/* Header */}
      <section className="pt-12 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Eyebrow text="Core Practices" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] font-heading">
              Technology &amp; Data Consulting Services
            </h1>
            <p className="text-lg text-slate-600 font-body">
              Pragmatic engineering and data consulting organized across four pillars. We help you design, build, optimize, and scale systems that last.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="mt-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-slate-100">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#0077FF] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capabilities..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0077FF] bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Loading services...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-600 text-lg">No services matched your filter criteria.</p>
              <button
                onClick={() => {
                  handleCategoryChange('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-[#0077FF] font-bold hover:underline text-sm"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="consulting-card bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 text-[#0077FF] flex items-center justify-center mb-5">
                      <DynamicIcon name={s.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {s.categoryName || 'Practice'}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1 mb-3 font-heading hover:text-[#0077FF] transition-colors">
                      <Link to={`/services/${s.slug}`}>{s.title}</Link>
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 font-body">{s.excerpt}</p>

                    <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Scope:</p>
                      {s.keyCapabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0077FF] shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/services/${s.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0077FF] hover:text-[#0052CC] pt-3 border-t border-slate-100 group"
                  >
                    <span>View Service Specifications</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
