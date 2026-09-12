import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { SEOHead } from '../components/SEOHead.js';
import { CaseStudyCardSkeleton, Spinner } from '../components/SkeletonLoader.js';
import { api } from '../services/api.js';
import { CaseStudy } from '../types.js';

export const CaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCaseStudies().then(setCaseStudies).finally(() => setLoading(false));
  }, []);

  const industries = Array.from(new Set(caseStudies.map((c) => c.industry)));

  const filtered =
    selectedIndustry === 'all'
      ? caseStudies
      : caseStudies.filter((c) => c.industry === selectedIndustry);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <SEOHead
        title="Enterprise Case Studies & Architecture Outcomes"
        description="Discover how DataSource has solved mission-critical engineering, Power BI dashboard automation, and cloud migration challenges across retail, healthcare, finance, and logistics."
        keywords="technology consulting case studies, power bi implementation results, data engineering success stories"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Case Studies', url: '/case-studies' },
        ]}
      />
      {/* Header */}
      <section className="pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Eyebrow text="Portfolio &amp; Outcomes" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              Real Impact, Proven Results
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
              Explore how DataSource partners with businesses to eliminate technical bottlenecks, modernize web applications, and engineer high-performance data analytics platforms.
            </p>
          </div>

          {/* Industry Filter Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                selectedIndustry === 'all'
                  ? 'bg-[#0077FF] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Sectors ({caseStudies.length})
            </button>
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  selectedIndustry === ind
                    ? 'bg-[#0077FF] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0077FF] dark:text-[#38BDF8] py-2">
                <Spinner size="sm" />
                <span>Loading case studies & architecture outcomes...</span>
              </div>
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <CaseStudyCardSkeleton key={idx} />
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">No case studies found for this sector.</div>
          ) : (
            <div className="space-y-12">
              {filtered.map((cs) => (
                <div
                  key={cs.id}
                  className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Left Column Image & Meta */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                      <img
                        src={cs.coverImage}
                        alt={cs.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {cs.industry}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {cs.year}
                      </span>
                    </div>
                  </div>

                  {/* Right Column Content */}
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {cs.client}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight hover:text-[#0077FF] dark:hover:text-[#38BDF8] transition-colors">
                      <Link to={`/case-studies/${cs.slug}`}>{cs.title}</Link>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-[#132034] p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Challenge</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{cs.challenge}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#132034] p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] mb-1">Solution</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{cs.solution}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#132034] p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Result</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{cs.result}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {cs.metrics.map((m, i) => (
                        <div key={i} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-200/70 dark:border-slate-700/80">
                          <div className="text-base sm:text-lg font-black text-[#0077FF] dark:text-[#38BDF8] font-heading">{m.value}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {cs.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/case-studies/${cs.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline"
                      >
                        <span>Full Case Study</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
