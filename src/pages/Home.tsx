import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
  Clock,
  Award,
  Users,
  Building2,
  FileCheck,
} from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { DynamicIcon } from '../components/DynamicIcon.js';
import { SEOHead } from '../components/SEOHead.js';
import {
  CyberCircuitTrace,
  FloatingDataHologram,
  HolographicDataCube,
} from '../components/TechDecorations.js';
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

// Section-specific high-resolution photography mappings
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

const industryFallbackImages: Record<string, string> = {
  'saas-technology': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  'finance-banking': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
  'healthcare-life-sciences': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
  'retail-e-commerce': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
  'manufacturing-logistics': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
  'professional-services': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
};

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
      icon: Users,
    },
    {
      title: 'Build reliable web and mobile applications',
      desc: 'Robust full-stack systems engineered with modern TypeScript, modular APIs, and zero-downtime reliability.',
      icon: Code2,
    },
    {
      title: 'Turn business data into useful insight',
      desc: 'Automated Power BI dashboards and predictive scorecards that give executives daily decision clarity.',
      icon: BarChart3,
    },
    {
      title: 'Engineer scalable data and technology systems',
      desc: 'Fault-tolerant data pipelines, database tuning, and high-concurrency cloud architectures.',
      icon: Database,
    },
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Understand the Problem',
      desc: 'We start with your operational bottlenecks and commercial objectives. We interview stakeholders and audit workflows before recommending any tech.',
      img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '02',
      title: 'Design the Right Solution',
      desc: 'We architect intuitive prototypes, data schemas, and integration roadmaps that fit your budget and team capacity—avoiding bloated vendor dependencies.',
      img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '03',
      title: 'Build and Implement',
      desc: 'Our senior engineers construct production-ready code with continuous testing, incremental rollouts, and zero business interruption.',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '04',
      title: 'Improve and Support',
      desc: 'We train your staff, monitor performance telemetry, tune database queries, and provide dedicated engineering support for long-term compounding returns.',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
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
    <div className="min-h-screen transition-colors duration-200 overflow-x-hidden relative">
      {/* On-Page SEO Meta Tags & Schema */}
      <SEOHead
        title="Technology That Solves. Data That Drives."
        description="DataSource helps enterprises design custom cloud software, automated Power BI dashboards, high-throughput data engineering pipelines and strategic IT architecture."
        keywords="enterprise technology consulting, power bi dashboards, cloud applications, data engineering, database migration, IT assessment"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'DataSource Technology & Solutions',
          url: 'https://datasource.tech',
        }}
      />

      {/* 1. HERO BANNER: Turning Technology and Data Into Business Solutions */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Background Professional Image for Hero Banner with Cyber Glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="DataSource Professional Technology & Data Headquarters"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-15 mix-blend-luminosity scale-105"
          />
          {/* Multi-layered soft gradients allowing constellation particles through */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFCFF]/90 via-[#FAFCFF]/85 to-transparent dark:from-[#070D18]/90 dark:via-[#070D18]/85 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0077FF]/[0.03] to-[#FAFCFF]/90 dark:to-[#070D18]/90" />
          {/* Cybernetic schematic circuit overlay */}
          <CyberCircuitTrace className="absolute top-10 right-0 w-[500px] h-[250px] opacity-40 dark:opacity-60 hidden xl:block" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Floating imaginary holographic data cube in top right */}
          <div className="hidden lg:block absolute -top-8 right-12 z-20">
            <HolographicDataCube />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Confident Editorial Typography with Scroll & Entrance Wow Animations */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow text="Professional Technology & Data Consulting" variant="blue" />
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  REAL-TIME PIPELINE ACTIVE
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight leading-[1.12] font-heading">
                Turning Technology and Data Into{' '}
                <span className="text-[#0077FF] dark:text-[#38BDF8] inline-block relative">
                  Business Solutions
                  <span className="absolute left-0 -bottom-1.5 w-full h-1 bg-[#38BDF8] rounded-full opacity-60" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#475569] dark:text-slate-300 leading-relaxed max-w-2xl font-body">
                DataSource helps businesses design, develop, analyse and improve digital solutions through technology, data and practical problem solving.
              </p>

              {/* Floating Holographic Telemetry Cards */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <FloatingDataHologram
                  icon="cpu"
                  label="Architecture"
                  value="Zero-Downtime Microservices"
                  delay={0.1}
                />
                <FloatingDataHologram
                  icon="activity"
                  label="Data Telemetry"
                  value="Sub-Second ETL Sync"
                  delay={0.2}
                />
              </div>

              {/* Core Brand Philosophy Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#0E1726]/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-xl bg-[#0077FF]/10 dark:bg-[#0077FF]/20 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">Our Philosophy</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    &ldquo;We start with the problem, understand the business need and build the solution that actually fits.&rdquo;
                  </p>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] dark:bg-[#0077FF] dark:hover:bg-[#0066EE] text-white px-7 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-600/25 transition-all hover:translate-y-[-2px] active:translate-y-0"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300/90 dark:border-slate-700 px-6 py-4 rounded-xl text-base font-bold transition-all hover:border-[#0077FF]/40 shadow-sm"
                >
                  <span>Explore Our Services</span>
                </Link>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8]" />
                  <span>No vendor lock-in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8]" />
                  <span>Transparent delivery milestones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8]" />
                  <span>Senior engineers &amp; consultants only</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Professional Consultancy Visual Hero Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative ambient glow */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#38BDF8]/20 dark:bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#0077FF]/15 dark:bg-[#0077FF]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Main Hero Card Composition */}
                <div className="relative bg-white dark:bg-[#0E1726] rounded-3xl p-4 sm:p-5 shadow-2xl dark:shadow-slate-950/60 border border-slate-200/90 dark:border-slate-800 overflow-hidden">
                  {/* Primary Professional Consultancy Image */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 group">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                      alt="DataSource Professional Technology and Data Consultants in Advisory Session"
                      className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B] via-transparent to-transparent opacity-90" />
                    
                    {/* Image caption badge */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#38BDF8] bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm">
                        Strategic Technology Advisory
                      </span>
                      <p className="text-base font-bold mt-1.5 leading-snug">
                        Executive Boardroom Strategy &amp; Architecture Delivery
                      </p>
                    </div>
                  </div>

                  {/* Overlaid Floating Consultant Badge with Wow Idle Motion */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    className="absolute top-7 left-7 bg-white/95 dark:bg-[#0B1B2B]/95 backdrop-blur-md rounded-2xl p-2.5 pr-4 shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=160&auto=format&fit=crop"
                      alt="Senior Solutions Architect"
                      className="w-10 h-10 rounded-xl object-cover border border-[#0077FF]/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Senior Advisory</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Principal Technology Consultants</p>
                    </div>
                  </motion.div>

                  {/* Overlaid Floating Metrics Card */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <TrendingUp className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
                        <span>Reporting Latency</span>
                      </div>
                      <p className="text-lg font-extrabold text-[#0B1B2B] dark:text-white mt-1 font-heading">Sub-second</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Real-time sync</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span>System Reliability</span>
                      </div>
                      <p className="text-lg font-extrabold text-[#0B1B2B] dark:text-white mt-1 font-heading">99.98%</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Continuous SLA</p>
                    </div>
                  </div>

                  {/* Brand Promise Line */}
                  <div className="mt-3 py-2 px-3 rounded-lg bg-[#0077FF]/5 dark:bg-[#0077FF]/15 border border-[#0077FF]/15 dark:border-[#0077FF]/30 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">You bring the challenge.</span>
                    <span className="font-bold text-[#0077FF] dark:text-[#38BDF8]">DataSource builds the solution.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Consultancy Practice Pillars Strip with Section Images */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          >
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/70 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:border-[#0077FF]/40 transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop"
                  alt="Architecture & IT Consulting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">Advisory Practice</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Problem-First Discovery &amp; IT Audits</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Independent architecture evaluations &amp; roadmaps</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/70 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:border-[#0077FF]/40 transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop"
                  alt="Enterprise Data Engineering"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">Data &amp; BI Practice</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Modern Data Pipelines &amp; Analytics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-throughput ETL, warehousing &amp; Power BI</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/70 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:border-[#0077FF]/40 transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop"
                  alt="Full Stack Engineering"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">Engineering Practice</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Production Web &amp; Cloud Platforms</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scalable TypeScript, microservices &amp; UI/UX</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST / VALUE CATEGORIES STRIP */}
      <section className="py-10 bg-white dark:bg-[#0A1220] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Trusted Technology &amp; Data Partner Across Sectors
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {clientCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="py-3 px-3 rounded-xl bg-slate-50 dark:bg-[#111C2E] hover:bg-white dark:hover:bg-[#162338] border border-slate-200/60 dark:border-slate-800 hover:border-[#0077FF]/40 text-center transition-all shadow-none hover:shadow-sm cursor-default"
              >
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                  {cat}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT / EXPERTISE ASYMMETRIC SECTION WITH SECTION IMAGERY */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-6"
            >
              <Eyebrow text="About DataSource" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading leading-tight">
                Solving Complexity With Technology and Data Clarity
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-body">
                From digital products and web applications to analytics, dashboards and data engineering, DataSource helps businesses turn complex requirements into practical technology solutions.
              </p>
              
              {/* Professional consultancy advisory team visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                  alt="DataSource Senior Technology Consulting Team"
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/90 via-[#0B1B2B]/40 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-black/50 px-2 py-0.5 rounded">
                      DataSource Advisory Guild
                    </span>
                    <p className="text-white text-xs font-semibold mt-1">
                      Hands-on architecture reviews, zero-fluff audits, and pragmatic problem-solving
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-[#0077FF] dark:text-[#38BDF8] font-bold hover:text-[#0052CC] dark:hover:text-cyan-300 transition-colors group"
                >
                  <span>Explore DataSource Story &amp; Leadership</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: 4 Capability Cards with Scroll Entrance */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {capabilities.map((cap, i) => {
                const IconComponent = cap.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#0077FF]/30 dark:hover:border-[#0077FF]/50 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-[#0077FF]/10 dark:bg-[#0077FF]/20 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center font-bold text-sm mb-4 group-hover:bg-[#0077FF] group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-body">{cap.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Capability Pillar 0{i + 1}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BUSINESS RESULTS / STATS SECTION */}
      <section className="py-14 bg-white dark:bg-[#0A1220] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <Eyebrow text="Demonstrated Experience" variant="cyan" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
              Measurable Technical &amp; Operational Impact
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
              *Sample performance indicators — fully manageable and customizable via the DataSource CMS
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {settings?.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800 text-center hover:bg-white dark:hover:bg-[#162338] hover:border-[#0077FF]/30 dark:hover:border-[#0077FF]/40 transition-all hover:shadow-md"
              >
                <div className="text-4xl sm:text-5xl font-black text-[#0077FF] dark:text-[#38BDF8] font-heading tracking-tight">
                  {stat.value}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{stat.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION WITH HIGH-RESOLUTION SECTION IMAGERY & SCROLL ANIMATIONS */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <Eyebrow text="Practice Areas" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
                Structured Technology &amp; Data Services
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base mt-2 max-w-xl">
                We organize our engineering capabilities into four focused consulting pillars designed to solve specific operational challenges.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#0077FF] dark:text-[#38BDF8] border border-[#0077FF]/30 dark:border-[#0077FF]/50 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 shadow-sm"
            >
              <span>View All 8+ Practice Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#0077FF] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
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
                    : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Service Cards Grid with Photographic Header & Hover Wow Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map((service, index) => {
              const cardImage = serviceImages[service.slug] || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop';
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0077FF]/40 transition-all group"
                >
                  <div>
                    {/* Photographic Service Image Banner */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                      <img
                        src={cardImage}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-[#0E1726]/30 to-transparent" />
                      
                      {/* Overlaid Category Tag & Dynamic Icon */}
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0B1B2B]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-[#0077FF] dark:text-[#38BDF8] border border-white/20">
                        {service.categoryName || 'Consulting'}
                      </div>
                      
                      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white/95 dark:bg-[#0B1B2B]/95 backdrop-blur-md text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center shadow-lg border border-slate-200/60 dark:border-slate-700">
                        <DynamicIcon name={service.iconName} className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 font-heading group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                        <Link to={`/services/${service.slug}`}>{service.title}</Link>
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-body">
                        {service.excerpt}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Capabilities:</p>
                        {service.keyCapabilities.slice(0, 3).map((cap, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0077FF] dark:text-[#38BDF8] hover:text-[#0052CC] dark:hover:text-cyan-300 pt-2 group-hover:translate-x-1 transition-all"
                    >
                      <span>Service Details &amp; Scope</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CASE STUDIES WITH VERIFIED BEFORE/AFTER PHOTOGRAPHY */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0A1220] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Eyebrow text="Case Studies" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
              Real Impact, Proven Results
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base mt-2">
              Explore how DataSource solves engineering bottlenecks and turns raw business records into measurable operational advantages.
            </p>
          </motion.div>

          <div className="space-y-12">
            {caseStudies.slice(0, 2).map((cs, index) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="bg-slate-50 dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#0077FF]/30 transition-all"
              >
                {/* Left Column: Image & Client Metadata */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-md group relative">
                    <img
                      src={cs.coverImage}
                      alt={cs.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0077FF] px-2 py-0.5 rounded">
                        {cs.client}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {cs.industry}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {cs.year}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#0077FF]/10 dark:bg-[#0077FF]/25 text-[#0077FF] dark:text-[#38BDF8]">
                      Verified Case
                    </span>
                  </div>
                </div>

                {/* Right Column: Challenge, Solution, Result */}
                <div className="lg:col-span-7 space-y-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{cs.client}</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
                    <Link to={`/case-studies/${cs.slug}`} className="hover:text-[#0077FF] dark:hover:text-[#38BDF8] transition-colors">
                      {cs.title}
                    </Link>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-white dark:bg-[#132034] p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Challenge</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4">{cs.challenge}</p>
                    </div>
                    <div className="bg-white dark:bg-[#132034] p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] mb-1">Solution</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4">{cs.solution}</p>
                    </div>
                    <div className="bg-white dark:bg-[#132034] p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Result</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4">{cs.result}</p>
                    </div>
                  </div>

                  {/* Highlight Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {cs.metrics.map((m, i) => (
                      <div key={i} className="text-center p-3 rounded-xl bg-white dark:bg-[#132034] border border-slate-200/70 dark:border-slate-700/80">
                        <div className="text-base sm:text-lg font-black text-[#0077FF] dark:text-[#38BDF8] font-heading">{m.value}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {cs.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[11px] bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/case-studies/${cs.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline group"
                    >
                      <span>Read Full Study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow transition-colors"
            >
              <span>Explore All Case Studies &amp; Outcomes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. METHODOLOGY: THE DATASOURCE WAY (With High-Tech Delivery Center Background & Phase Images) */}
      <section className="py-16 lg:py-24 bg-[#0B1B2B] text-white relative overflow-hidden">
        {/* Background Delivery Center Image Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
            alt="DataSource Engineering Framework Center"
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1B2B]/95 via-[#0B1B2B]/90 to-[#0B1B2B]/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-cyan-400/50 transition-all group flex flex-col justify-between overflow-hidden shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-2xl font-black text-cyan-400 font-heading">
                    {step.num}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white font-heading mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-body">{step.desc}</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                    <span>Phase {step.num} Delivery</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INDUSTRIES SECTION WITH DEDICATED PHOTOGRAPHY ON EVERY CARD */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Eyebrow text="Industry Alignment" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
              Domain Expertise Built For Your Sector
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base mt-2">
              Every industry has distinct regulatory requirements, operational tempos, and data structures. We bring proven domain frameworks to each engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.slice(0, 6).map((ind, index) => {
              const indImg = ind.imageUrl || industryFallbackImages[ind.slug] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';
              return (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#0077FF]/40 dark:hover:border-[#0077FF]/50 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Industry Photographic Banner */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                      <img
                        src={indImg}
                        alt={ind.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-[#0E1726]/30 to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 dark:bg-[#0B1B2B]/95 backdrop-blur-md text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center shadow-md border border-slate-200/60 dark:border-slate-700">
                        <DynamicIcon name={ind.iconName} className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-2 group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                        {ind.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 font-body">
                        {ind.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                      Common Solutions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ind.relatedServices.map((svc, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0A1220] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Eyebrow text="Client Feedback" variant="cyan" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
              What Technology Leaders Say
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
              *Sample demonstration reviews provided for evaluation — easily manageable and editable in CMS
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-7 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-[#0077FF]/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#0077FF]/20 dark:text-[#38BDF8]/20 mb-2" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6 font-body">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#0077FF]/30" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0077FF]/10 dark:bg-[#0077FF]/20 text-[#0077FF] dark:text-[#38BDF8] font-bold flex items-center justify-center text-sm">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.designation} • {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION WITH DIRECT CONSULTANT CARD */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Eyebrow text="Common Questions" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base mt-2">
              Everything you need to know about working with DataSource Technology &amp; Solutions.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0077FF] dark:text-[#38BDF8] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/80 font-body">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Consultant Advisory Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5 }}
            className="mt-10 p-5 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                alt="Principal Consultant"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#0077FF]/40 shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-[#0077FF] dark:text-[#38BDF8] uppercase tracking-wider">Direct Advisory Access</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Have a specific architectural question?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Speak directly with our senior consulting engineers with zero sales pressure.</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 bg-[#0077FF] hover:bg-[#0062D6] text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition-colors"
            >
              <span>Schedule Architecture Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 11. LATEST INSIGHTS / BLOG CARDS WITH PHOTOGRAPHY */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0A1220] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <Eyebrow text="Knowledge &amp; Perspectives" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
                Insights from Our Practice
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base mt-2 max-w-xl">
                Practical articles on enterprise data modeling, web architecture, and avoiding tech debt traps.
              </p>
            </div>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#0077FF] dark:text-[#38BDF8] border border-[#0077FF]/30 dark:border-[#0077FF]/50 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 shadow-sm"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#0077FF]/40 transition-all group"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden bg-slate-900">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
                      <span className="font-bold text-[#0077FF] dark:text-[#38BDF8] uppercase tracking-wider">{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading leading-snug group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors mb-3">
                      <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-body">{post.excerpt}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{post.author}</span>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="text-xs font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FUTURISTIC COMMAND-CENTER CTA BANNER */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-transparent via-[#0077FF]/[0.03] to-slate-900 dark:to-[#050A14]">
        <div className="absolute inset-0 pointer-events-none">
          {/* Cybernetic schematic and glowing energy lines */}
          <CyberCircuitTrace className="absolute -top-12 left-1/4 w-[600px] h-[300px] opacity-30 dark:opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#0077FF]/20 via-[#38BDF8]/20 to-[#6366F1]/20 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-14 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/30 shadow-2xl shadow-cyan-950/20 relative overflow-hidden"
          >
            {/* Top imaginary tech telemetry status bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/70 dark:border-slate-800 text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-cyan-400/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>DIRECT CONSULTANT ENGAGEMENT PROTOCOL</span>
              </div>
              <div className="hidden sm:block">
                <span>ENCRYPTION: 4096-BIT · SLA GUARANTEED</span>
              </div>
            </div>

            <Eyebrow text="Ready to Elevate Your Technology?" variant="blue" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 font-heading tracking-tight leading-tight max-w-2xl mx-auto">
              Transform Your Architecture &amp; Unlock Business Data Value
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-body">
              Whether you are architecting a mission-critical web application, automating high-throughput data pipelines, or designing executive Power BI dashboards, our senior consultants deliver results.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0077FF] to-[#00A3FF] hover:from-[#0066EE] hover:to-[#0088EE] text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-blue-500/25 transition-all hover:translate-y-[-2px] active:translate-y-0"
              >
                <span>Book Strategic Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/case-studies"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 px-7 py-4 rounded-xl text-base font-bold transition-all shadow-sm"
              >
                <span>Review Proven Case Studies</span>
              </Link>
            </div>

            {/* Micro assurance guarantees */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Direct Senior Engineering Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Transparent Milestone Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero Obligation Discovery Call
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
