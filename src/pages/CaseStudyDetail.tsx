import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ArrowLeft, CheckCircle2, Quote } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { Breadcrumbs } from '../components/Breadcrumbs.js';
import { DetailPageSkeleton } from '../components/SkeletonLoader.js';
import { ReadingProgressBar } from '../components/ReadingProgressBar.js';
import { api } from '../services/api.js';
import { CaseStudy } from '../types.js';

export const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<(CaseStudy & { related: CaseStudy[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    api
      .getCaseStudyBySlug(slug)
      .then(setCaseStudy)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <DetailPageSkeleton variant="case-study" />;
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen py-32 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-800">Case Study Not Found</h1>
        <Link
          to="/case-studies"
          className="mt-4 inline-flex items-center gap-2 text-[#0077FF] font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Studies</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200">
      <ReadingProgressBar />
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Case Studies', url: '/case-studies' },
              { name: caseStudy.title },
            ]}
          />
        </div>
      </div>

      {/* Hero */}
      <section className="pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-5">
            <div className="flex items-center gap-3">
              <Eyebrow text={caseStudy.industry} variant="blue" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">• {caseStudy.year}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
              {caseStudy.title}
            </h1>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Client Engagement: {caseStudy.client}
            </p>
          </div>
        </div>
      </section>

      {/* Main Breakdown */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-10">
              {/* Cover Image */}
              <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg bg-slate-200 dark:bg-slate-800">
                <img
                  src={caseStudy.coverImage}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Challenge */}
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Phase 1 • The Problem
                </span>
                <h2 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading">The Challenge</h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-body text-base sm:text-lg">
                  {caseStudy.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                  Phase 2 • Engineering Approach
                </span>
                <h2 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading">The DataSource Solution</h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-body text-base sm:text-lg">
                  {caseStudy.solution}
                </p>
                {caseStudy.implementationDetails && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Implementation Note:</span>
                    {caseStudy.implementationDetails}
                  </div>
                )}
              </div>

              {/* Results & Metrics */}
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Phase 3 • Measurable Business ROI
                </span>
                <h2 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading">Outcomes &amp; Impact</h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-body text-base sm:text-lg">
                  {caseStudy.result}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {caseStudy.metrics.map((m, i) => (
                    <div key={i} className="p-5 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-200 dark:border-slate-700 text-center">
                      <div className="text-2xl font-black text-[#0077FF] dark:text-[#38BDF8] font-heading">{m.value}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial Quote if available */}
              {caseStudy.testimonialQuote && (
                <div className="bg-[#0B1B2B] text-white rounded-2xl p-8 space-y-4 relative border border-slate-800">
                  <Quote className="w-8 h-8 text-cyan-400/40" />
                  <p className="text-lg italic text-slate-200 leading-relaxed">
                    &ldquo;{caseStudy.testimonialQuote}&rdquo;
                  </p>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    — {caseStudy.testimonialAuthor || 'Client Executive'}
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Technologies Applied</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-mono font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Solve Similar Bottlenecks</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Have an application, pipeline, or reporting setup facing similar operational hurdles?
                </p>
                <Link
                  to="/contact"
                  className="w-full text-center bg-[#0077FF] hover:bg-[#0062D6] text-white py-3 rounded-xl font-bold text-sm block transition-colors"
                >
                  Schedule an Architecture Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
