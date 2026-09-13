import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Layers, Briefcase, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { ServiceItem, CaseStudy, BlogPost } from '../types.js';
import { api } from '../services/api.js';

interface AutoSearchProps {
  isMobile?: boolean;
  onSelectMobile?: () => void;
}

export const AutoSearch: React.FC<AutoSearchProps> = ({ isMobile = false, onSelectMobile }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [insights, setInsights] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getServices().catch(() => []),
      api.getCaseStudies().catch(() => []),
      api.getInsights().catch(() => []),
    ])
      .then(([srvs, cscs, posts]) => {
        setServices(srvs);
        setCaseStudies(cscs);
        setInsights(posts);
      })
      .finally(() => setLoading(false));

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const filteredServices = trimmed
    ? services.filter(
        (s) =>
          s.title.toLowerCase().includes(trimmed) ||
          (s.excerpt && s.excerpt.toLowerCase().includes(trimmed))
      ).slice(0, 4)
    : [];

  const filteredCaseStudies = trimmed
    ? caseStudies.filter(
        (c) =>
          c.title.toLowerCase().includes(trimmed) ||
          c.client.toLowerCase().includes(trimmed) ||
          (c.excerpt && c.excerpt.toLowerCase().includes(trimmed))
      ).slice(0, 3)
    : [];

  const filteredInsights = trimmed
    ? insights.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(trimmed))
      ).slice(0, 3)
    : [];

  const totalResults = filteredServices.length + filteredCaseStudies.length + filteredInsights.length;

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectMobile) onSelectMobile();
    navigate(path);
  };

  if (isMobile) {
    return (
      <div className="relative w-full px-4 py-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search services, case studies, insights..."
            className="w-full pl-10 pr-8 py-2.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077FF]/50"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isOpen && trimmed.length > 0 && (
          <div className="mt-2 w-full bg-white dark:bg-[#0E1726] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 max-h-[360px] overflow-y-auto">
            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-[#0077FF]" />
                Results for "{query}"
              </span>
              <span>{totalResults} found</span>
            </div>

            {totalResults === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No matching items found.
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredServices.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Services</div>
                    {filteredServices.map((s) => (
                      <button
                        key={s.id || s.slug}
                        onClick={() => handleSelect(`/services/${s.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <span className="truncate">{s.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
                {filteredCaseStudies.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Case Studies</div>
                    {filteredCaseStudies.map((c) => (
                      <button
                        key={c.id || c.slug}
                        onClick={() => handleSelect(`/case-studies/${c.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <span className="truncate">{c.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
                {filteredInsights.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Insights</div>
                    {filteredInsights.map((p) => (
                      <button
                        key={p.id || p.slug}
                        onClick={() => handleSelect(`/insights/${p.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <span className="truncate">{p.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={searchRef} className="relative hidden lg:block">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..."
          className="w-28 lg:w-32 xl:w-52 2xl:w-60 focus:w-44 xl:focus:w-60 pl-9 pr-7 py-2 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077FF]/50 dark:focus:ring-[#38BDF8]/50 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && trimmed.length > 0 && (
        <div className="absolute right-0 mt-2 w-[380px] sm:w-[440px] bg-white dark:bg-[#0E1726] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[480px] overflow-y-auto">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
              Search Results for "{query}"
            </span>
            <span>{totalResults} found</span>
          </div>

          {totalResults === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              No matching services, case studies, or insights found. Try different keywords.
            </div>
          ) : (
            <div className="p-2 space-y-3">
              {filteredServices.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#0077FF]" /> Services ({filteredServices.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {filteredServices.map((s) => (
                      <button
                        key={s.id || s.slug}
                        onClick={() => handleSelect(`/services/${s.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                            {s.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {s.excerpt}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredCaseStudies.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-emerald-500" /> Case Studies ({filteredCaseStudies.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {filteredCaseStudies.map((c) => (
                      <button
                        key={c.id || c.slug}
                        onClick={() => handleSelect(`/case-studies/${c.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                            {c.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            Client: {c.client}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredInsights.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-500" /> Insights & Articles ({filteredInsights.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {filteredInsights.map((p) => (
                      <button
                        key={p.id || p.slug}
                        onClick={() => handleSelect(`/insights/${p.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {p.category} • {p.readTime || '5 min read'}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
