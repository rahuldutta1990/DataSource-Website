import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Database,
  Code2,
  BarChart3,
  Star,
  Quote,
} from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { DynamicIcon } from '../components/DynamicIcon.js';
import { api } from '../services/api.js';
import {
  ServiceItem,
  ServiceCategory,
  CaseStudy,
  Industry,
  BlogPost,
  Testimonial,
  FAQ,
  SiteSettings,
} from '../types.js';

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSettings().then(setSettings).catch(() => {}),
      api.getServiceCategories().then(setCategories).catch(() => {}),
      api.getServices().then(setServices).catch(() => {}),
      api.getCaseStudies().then(setCaseStudies).catch(() => {}),
      api.getIndustries().then(setIndustries).catch(() => {}),
      api.getInsights().then(setPosts).catch(() => {}),
      api.getTestimonials().then(setTestimonials).catch(() => {}),
      api.getFAQs().then((data) => {
        setFaqs(data);
        if (data.length > 0) setActiveFaq(data[0].id);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredServices =
    activeCategory === 'all'
      ? services.slice(0, 6)
      : services.filter((s) => s.categoryId === activeCategory);

  const capabilities = [
    {
      title: 'Design experiences people understand',
      desc: 'Intuitive user workflows that eliminate cognitive fatigue and reduce human operational error.',
    },
    {
      title: 'Build reliable web and mobile applications',
      desc: 'Robust full-stack systems engineered with modern TypeScript, modular APIs, and zero-downtime reliability.',
    },
    {
      title: 'Turn business data into useful insight',
      desc: 'Automated Power BI dashboards and predictive scorecards that give executives daily decision clarity.',
    },
    {
      title: 'Engineer scalable data and technology systems',
      desc: 'Fault-tolerant data pipelines, database tuning, and high-concurrency cloud architectures.',
    },
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Understand the Problem',
      desc: 'We start with your operational bottlenecks and commercial objectives. We interview stakeholders and audit workflows before recommending any tech.',
    },
    {
      num: '02',
      title: 'Design the Right Solution',
      desc: 'We architect intuitive prototypes, data schemas, and integration roadmaps that fit your budget and team capacity—avoiding bloated vendor dependencies.',
    },
    {
      num: '03',
      title: 'Build and Implement',
      desc: 'Our senior engineers construct production-ready code with continuous testing, incremental rollouts, and zero business interruption.',
    },
    {
      num: '04',
      title: 'Improve and Support',
      desc: 'We train your staff, monitor performance telemetry, tune database queries, and provide dedicated engineering support for long-term compounding returns.',
    },
  ];

  const clientCategories = [
    'Software & Technology',
    'Professional Services',
    'Finance & Business',
    'Healthcare & Clinical',
    'Education & Learning',
    'Retail & E-commerce',
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF]">
      {/* 1. HERO SECTION (Figma Insighter Composition) */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Confident Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <Eyebrow text="Technology & Data Consulting" variant="blue" />

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B2B] tracking-tight leading-[1.12] font-heading">
                Turning Technology and Data Into{' '}
                <span className="text-[#0077FF] inline-block relative">
                  Business Solutions
                  <span className="absolute left-0 -bottom-1.5 w-full h-1 bg-[#38BDF8] rounded-full opacity-60" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#475569] leading-relaxed max-w-2xl font-body">
                DataSource helps businesses design, develop, analyse and improve digital solutions through technology, data and practical problem solving.
              </p>

              {/* Core Brand Philosophy Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-xl bg-[#0077FF]/10 text-[#0077FF] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF]">Our Philosophy</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    &ldquo;We start with the problem, understand the business need and build the solution that actually fits.&rdquo;
                  </p>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-7 py-4 rounded-xl text-base font-bold shadow-md shadow-blue-600/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-4 rounded-xl text-base font-bold transition-colors"
                >
                  <span>Explore Our Services</span>
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077FF]" />
                  <span>No vendor lock-in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077FF]" />
                  <span>Transparent delivery milestones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077FF]" />
                  <span>Senior engineers only</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Technology & Data Panel */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative glow */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#0077FF]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Main Hero Card Composition */}
                <div className="relative bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90 overflow-hidden">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                      alt="Data Intelligence Dashboard Visual"
                      className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#38BDF8] bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
                        Live Analytics Engine
                      </span>
                      <p className="text-base font-bold mt-1.5">Executive Data Cockpit &amp; Cloud Systems</p>
                    </div>
                  </div>

                  {/* Overlaid Floating Metrics Card */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <TrendingUp className="w-3.5 h-3.5 text-[#0077FF]" />
                        <span>Reporting Latency</span>
                      </div>
                      <p className="text-lg font-extrabold text-[#0B1B2B] mt-1 font-heading">Sub-second</p>
                      <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Real-time sync</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>System Uptime</span>
                      </div>
                      <p className="text-lg font-extrabold text-[#0B1B2B] mt-1 font-heading">99.98%</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Continuous SLA</p>
                    </div>
                  </div>

                  {/* Small tag line badge */}
                  <div className="mt-3 py-2 px-3 rounded-lg bg-[#0077FF]/5 border border-[#0077FF]/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">You bring the challenge.</span>
                    <span className="font-bold text-[#0077FF]">DataSource builds the solution.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / VALUE CATEGORIES STRIP (Figma Inspired) */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Trusted Technology &amp; Data Partner Across Sectors
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {clientCategories.map((cat, idx) => (
              <div
                key={idx}
                className="py-3 px-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-[#0077FF]/40 text-center transition-all shadow-none hover:shadow-sm group cursor-default"
              >
                <p className="text-xs font-bold text-slate-700 group-hover:text-[#0077FF] transition-colors">
                  {cat}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT / EXPERTISE ASYMMETRIC SECTION */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-5">
              <Eyebrow text="About DataSource" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] tracking-tight font-heading leading-tight">
                Solving Complexity With Technology and Data Clarity
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-body">
                From digital products and web applications to analytics, dashboards and data engineering, DataSource helps businesses turn complex requirements into practical technology solutions.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-[#0077FF] font-bold hover:text-[#0052CC] transition-colors group"
                >
                  <span>Explore DataSource Story &amp; Leadership</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Capability Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0077FF]/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0077FF]/10 text-[#0077FF] flex items-center justify-center font-bold text-sm mb-4 group-hover:bg-[#0077FF] group-hover:text-white transition-colors">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-[#0077FF] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed font-body">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BUSINESS RESULTS / STATS SECTION (CMS Editable) */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow text="Demonstrated Experience" variant="cyan" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
              Measurable Technical &amp; Operational Impact
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic">
              *Sample performance indicators — fully manageable and customizable via the DataSource CMS
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {settings?.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center hover:bg-white hover:border-[#0077FF]/30 transition-all hover:shadow-sm"
              >
                <div className="text-4xl sm:text-5xl font-black text-[#0077FF] font-heading tracking-tight">
                  {stat.value}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{stat.label}</h3>
                <p className="text-xs text-slate-500 mt-1">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION (Structured Cards & Filtering) */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Eyebrow text="Practice Areas" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
                Structured Technology &amp; Data Services
              </h2>
              <p className="text-slate-600 text-base mt-2 max-w-xl">
                We organize our engineering capabilities into four focused consulting pillars designed to solve specific operational challenges.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0077FF] border border-[#0077FF]/30 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#0077FF] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Capabilities
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#0077FF] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="consulting-card bg-white rounded-2xl p-7 border border-slate-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 text-[#0077FF] flex items-center justify-center mb-5">
                    <DynamicIcon name={service.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {service.categoryName || 'Consulting'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3 font-heading hover:text-[#0077FF] transition-colors">
                    <Link to={`/services/${service.slug}`}>{service.title}</Link>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{service.excerpt}</p>

                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Capabilities:</p>
                    {service.keyCapabilities.slice(0, 3).map((cap, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0077FF] shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0077FF] hover:text-[#0052CC] pt-2 group"
                >
                  <span>Service Details &amp; Scope</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CASE STUDIES (Real Impact, Proven Results with Challenge, Solution, Result) */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow text="Case Studies" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
              Real Impact, Proven Results
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Explore how DataSource solves engineering bottlenecks and turns raw business records into measurable operational advantages.
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.slice(0, 2).map((cs, idx) => (
              <div
                key={cs.id}
                className="bg-slate-50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Column: Image & Client Metadata */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 shadow-md">
                    <img
                      src={cs.coverImage}
                      alt={cs.title}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      {cs.industry}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      {cs.year}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#0077FF]/10 text-[#0077FF]">
                      Verified Case
                    </span>
                  </div>
                </div>

                {/* Right Column: Challenge, Solution, Result */}
                <div className="lg:col-span-7 space-y-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{cs.client}</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] font-heading leading-tight">
                    <Link to={`/case-studies/${cs.slug}`} className="hover:text-[#0077FF] transition-colors">
                      {cs.title}
                    </Link>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">Challenge</p>
                      <p className="text-xs text-slate-600 line-clamp-4">{cs.challenge}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] mb-1">Solution</p>
                      <p className="text-xs text-slate-600 line-clamp-4">{cs.solution}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Result</p>
                      <p className="text-xs text-slate-600 line-clamp-4">{cs.result}</p>
                    </div>
                  </div>

                  {/* Highlight Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {cs.metrics.map((m, i) => (
                      <div key={i} className="text-center p-3 rounded-xl bg-white border border-slate-200/70">
                        <div className="text-base sm:text-lg font-black text-[#0077FF] font-heading">{m.value}</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {cs.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[11px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/case-studies/${cs.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0077FF] hover:underline"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 bg-[#0077FF] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow hover:bg-[#0062D6] transition-colors"
            >
              <span>Explore All Case Studies &amp; Outcomes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PROCESS SECTION: THE DATASOURCE WAY (4 Steps) */}
      <section className="py-16 lg:py-24 bg-[#0B1B2B] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Eyebrow text="Our Methodology" variant="white" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-heading">
              The DataSource Way
            </h2>
            <p className="text-slate-300 text-base mt-2">
              A structured four-phase delivery framework that guarantees alignment with your business problem from discovery through deployment.
            </p>
            <div className="mt-4 inline-block bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
              &ldquo;We start with the problem, not the technology.&rdquo;
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className="bg-slate-900/80 p-7 rounded-2xl border border-slate-800 hover:border-cyan-400/50 transition-all group flex flex-col justify-between relative"
              >
                <div>
                  <div className="text-3xl font-black text-cyan-400 font-heading mb-4 group-hover:scale-105 transition-transform">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-body">{step.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                  <span>Phase {step.num} Delivery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INDUSTRIES SECTION */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow text="Industry Alignment" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
              Domain Expertise Built For Your Sector
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Every industry has distinct regulatory requirements, operational tempos, and data structures. We bring proven domain frameworks to each engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.slice(0, 6).map((ind) => (
              <div
                key={ind.id}
                className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0077FF]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 text-[#0077FF] flex items-center justify-center mb-5">
                    <DynamicIcon name={ind.iconName} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">{ind.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 font-body">{ind.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Common Solutions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.relatedServices.map((svc, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow text="Client Feedback" variant="cyan" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
              What Technology Leaders Say
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic">
              *Sample demonstration reviews provided for evaluation — easily manageable and editable in CMS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#0077FF]/20 mb-2" />
                  <p className="text-sm text-slate-700 italic leading-relaxed mb-6 font-body">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0077FF]/10 text-[#0077FF] font-bold flex items-center justify-center text-sm">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.designation} • {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="Common Questions" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Everything you need to know about working with DataSource Technology &amp; Solutions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0077FF] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 font-body">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 text-sm text-slate-500">
            Have a different question?{' '}
            <Link to="/contact" className="text-[#0077FF] font-bold hover:underline">
              Speak directly with our engineering team
            </Link>
          </div>
        </div>
      </section>

      {/* 11. LATEST INSIGHTS / BLOG CARDS */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Eyebrow text="Knowledge &amp; Perspectives" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
                Insights from Our Practice
              </h2>
              <p className="text-slate-600 text-base mt-2 max-w-xl">
                Practical articles on enterprise data modeling, web architecture, and avoiding tech debt traps.
              </p>
            </div>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0077FF] border border-[#0077FF]/30 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="consulting-card bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="font-bold text-[#0077FF] uppercase tracking-wider">{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug hover:text-[#0077FF] transition-colors mb-3">
                      <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-body">{post.excerpt}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{post.author}</span>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="text-xs font-bold text-[#0077FF] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
