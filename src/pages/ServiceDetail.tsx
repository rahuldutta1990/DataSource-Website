import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { DynamicIcon } from '../components/DynamicIcon.js';
import { Breadcrumbs } from '../components/Breadcrumbs.js';
import { DetailPageSkeleton } from '../components/SkeletonLoader.js';
import { ReadingProgressBar } from '../components/ReadingProgressBar.js';
import { SEOHead } from '../components/SEOHead.js';
import { api } from '../services/api.js';
import { ServiceItem } from '../types.js';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<(ServiceItem & { relatedServices: ServiceItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    api
      .getServiceBySlug(slug)
      .then(setService)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <DetailPageSkeleton variant="service" />;
  }

  if (error || !service) {
    return (
      <div className="min-h-screen py-32 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-800">Service Not Found</h1>
        <p className="text-slate-500 mt-2">The requested service detail page could not be located.</p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-2 text-[#0077FF] font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200">
      <SEOHead
        title={service.seoTitle || `${service.title} | DataSource Tech`}
        description={service.seoDescription || service.excerpt}
        canonical={`https://datasourcerechnology.ai.studio/services/${service.slug}`}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: service.title },
        ]}
      />
      <ReadingProgressBar />
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Services', url: '/services' },
              { name: service.title },
            ]}
          />
        </div>
      </div>

      {/* Hero */}
      <section className="pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <Eyebrow text={service.categoryName || 'Practice'} variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-body leading-relaxed">
              {service.excerpt}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow transition-colors"
              >
                <span>Consult On This Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Scope */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Detailed Overview */}
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading">
                  Overview &amp; Approach
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-body">
                  <p className="text-base sm:text-lg">{service.description}</p>
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading">
                  Key Capabilities &amp; Deliverables
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.keyCapabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#0077FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Model */}
              <div className="bg-slate-900 dark:bg-[#0A1220] border border-slate-800 text-white rounded-2xl p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
                  How We Engage
                </span>
                <h3 className="text-2xl font-bold font-heading">Transparent Milestones &amp; Direct Senior Access</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We don&apos;t lock clients into ambiguous hourly retainers. Every project follows a clear milestone delivery agreement with documented sprint goals, Git repository access, and ongoing technical advisory.
                </p>
              </div>
            </div>

            {/* Right: Sidebar & Related Services */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Ready to Discuss?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Speak directly with a DataSource practice lead to scope your timeline, architecture requirements, and budget.
                </p>
                <Link
                  to="/contact"
                  className="w-full text-center bg-[#0077FF] hover:bg-[#0062D6] text-white py-3 rounded-xl font-bold text-sm block transition-colors"
                >
                  Book Free Consultation
                </Link>
              </div>

              {service.relatedServices && service.relatedServices.length > 0 && (
                <div className="bg-white dark:bg-[#0E1726] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Complementary Services
                  </h3>
                  <div className="space-y-3">
                    {service.relatedServices.map((rel) => (
                      <Link
                        key={rel.id}
                        to={`/services/${rel.slug}`}
                        className="block p-3 rounded-xl bg-slate-50 dark:bg-[#132034] hover:bg-blue-50/50 dark:hover:bg-[#182740] border border-slate-100 dark:border-slate-700/80 transition-colors group"
                      >
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                          {rel.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{rel.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
