import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  Terminal,
  Cpu,
  Layers,
  HelpCircle,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { SEOHead } from '../components/SEOHead.js';
import { api } from '../services/api.js';
import { SiteSettings, FAQ } from '../types.js';
import { generateFAQPageSchema, filterFAQsForPage } from '../utils/schemaGenerator.js';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
    api.getFAQs().then((items) => {
      setFaqs(items);
      const aboutFaqs = filterFAQsForPage(items, 'about');
      if (aboutFaqs.length > 0) {
        setActiveFaqId(aboutFaqs[0].id);
      }
    }).catch(() => {});
  }, []);

  const manifestoItems = settings?.aboutManifestoItems || [
    {
      id: 'man-1',
      title: 'Absolute Transparency',
      description:
        'Every deep learning model and automated agent we deploy comes equipped with interpretability layers, ensuring your operational and audit teams understand exactly why a specific algorithmic decision was executed.',
      iconName: 'CheckCircle2',
    },
    {
      id: 'man-2',
      title: 'Ethical Rigor & Compliance',
      description:
        'We champion active bias mitigation, rigorous data sanitization, and responsible AI governance from day one, ensuring compliance with global data sovereignty laws.',
      iconName: 'ShieldCheck',
    },
    {
      id: 'man-3',
      title: 'Performance Without Compromise',
      description:
        'Low-latency inference, optimized token expenditure, and highly cost-efficient hardware scaling strategies are permanently embedded into our core architectural DNA.',
      iconName: 'Zap',
    },
  ];

  const aboutFaqs = filterFAQsForPage(faqs, 'about');
  const faqSchema = generateFAQPageSchema(faqs, 'about');

  return (
    <div className="min-h-screen transition-colors duration-200 overflow-x-hidden">
      {/* On-Page SEO Meta Data with Dynamic FAQPage JSON-LD Schema */}
      <SEOHead
        title="About Us | AI Research & Enterprise Engineering | DataSource Tech"
        description="Meet the collective of research scientists and systems architects at DataSource Technology AI Studio dedicated to solving complex enterprise challenges."
        keywords="AI research lab, machine learning engineers, enterprise AI studio, artificial intelligence architects, AI ethics and governance, Kolkata technology hub"
        canonicalUrl="https://datasource.tech/about"
        schema={faqSchema ? [faqSchema] : undefined}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Ambient background architectural photo */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="DataSource AI Innovation & Engineering Center"
            className="w-full h-full object-cover opacity-10 dark:opacity-15 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-[#0A1220] dark:via-[#0A1220]/95 dark:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <Eyebrow text="About DataSource Technology" variant="blue" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading leading-tight">
              {settings?.aboutHeroTitle || 'Pioneering the Frontiers of Applied Artificial Intelligence'}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-body">
              {settings?.aboutHeroSubtitle ||
                'We are a collective of research scientists, systems architects, and machine learning engineers dedicated to solving complex enterprise challenges through uncompromising technical excellence.'}
            </p>
            <div className="p-4 rounded-xl bg-[#0077FF]/5 dark:bg-[#0077FF]/15 border border-[#0077FF]/15 dark:border-[#0077FF]/30 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Brand Philosophy: &ldquo;In an era where off-the-shelf software falls short, true competitive advantage requires bespoke intelligence.&rdquo;
            </div>
          </motion.div>
        </div>
      </section>

      {/* Genesis and Mission */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <Eyebrow text="Our Genesis" variant="cyan" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
                {settings?.aboutGenesisTitle || 'Our Genesis and Mission'}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body text-base sm:text-lg">
                {settings?.aboutGenesisParagraph ||
                  'Founded on the principle that artificial intelligence should amplify human ingenuity rather than merely imitate it, DataSource Technology AI Studio bridges the gap between theoretical algorithmic breakthroughs and practical, scalable commercial applications. We do not just build software; we construct highly specialized, intelligent systems that natively evolve alongside your enterprise goals and market demands.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Explore AI Studio Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <span>View Proven Impact</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                  alt="DataSource AI Architects Collaborating"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-black/60 px-2.5 py-1 rounded">
                    R&amp;D + Production Engineering
                  </span>
                  <p className="text-lg font-bold mt-2">
                    Turning Complex Mathematics into Scalable Enterprise Systems
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Architects Behind the Intelligence */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 order-2 lg:order-1 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                  alt="DataSource Technical Architects"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-black/60 px-2.5 py-1 rounded">
                    Senior Technical Leadership
                  </span>
                  <p className="text-lg font-bold mt-2">
                    Zero Junior Bait-and-Switch — Senior Systems Architects Only
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 order-1 lg:order-2 space-y-6"
            >
              <Eyebrow text="Our Team & Values" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
                {settings?.aboutArchitectsTitle || 'The Architects Behind the Intelligence'}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body text-base sm:text-lg">
                {settings?.aboutArchitectsParagraph ||
                  'Our core team is comprised of industry veterans who have architected data systems at scale. By combining deep mathematical rigor with pragmatic software engineering, we ensure that every model transitioning from our sandbox to your production environment is resilient, accurate, and aligned with enterprise-grade standards. We believe in building transparent partnerships based on technical truth.'}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-2xl font-extrabold text-[#0077FF] dark:text-cyan-400 font-heading">99.4%</p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Production Model Accuracy</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-2xl font-extrabold text-[#0077FF] dark:text-cyan-400 font-heading">Zero</p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Data Breaches / IP Egress</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The DataSource Engineering Manifesto */}
      <section className="py-20 lg:py-28 bg-[#FAFCFF] dark:bg-[#070D18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Eyebrow text="Engineering Standards" variant="cyan" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              {settings?.aboutManifestoTitle || 'The DataSource Engineering Manifesto'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {settings?.aboutManifestoSubtitle ||
                'Uncompromising principles governing every model, algorithm, and pipeline we deploy.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {manifestoItems.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-8 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#0077FF]/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 text-[#0077FF] dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {idx === 0 && <CheckCircle2 className="w-6 h-6" />}
                  {idx === 1 && <ShieldCheck className="w-6 h-6" />}
                  {idx === 2 && <Zap className="w-6 h-6" />}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Company & Delivery FAQ Accordion Section */}
      {aboutFaqs.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0A1220] border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <Eyebrow text="Company & Engagement FAQ" variant="blue" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
                Frequently Asked Company &amp; Location Questions
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-body">
                Learn about DataSource&apos;s corporate structure, Kolkata Technology Hub, remote delivery capabilities, and engineering rigor.
              </p>
            </div>

            <div className="space-y-4">
              {aboutFaqs.map((faq) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-white dark:bg-[#0E1726] border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-slate-50 dark:bg-[#070D18] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 block mb-1">
                            {faq.category || 'Company'}
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

            <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                <span>Interested in our technical advisory or looking to visit our Kolkata Technology Hub?</span>
              </div>
              <Link
                to="/contact"
                className="text-blue-600 dark:text-cyan-400 font-bold hover:underline shrink-0 inline-flex items-center gap-1"
              >
                <span>Get in touch with us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0B1B2B] to-[#0077FF] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
            {settings?.ctaHeadline || "Let's Architect Your Next AI Breakthrough"}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-body">
            {settings?.ctaSubheadline ||
              'Connect with our senior engineering team to discuss your custom AI roadmap, platform integration, or enterprise consultation needs.'}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              {settings?.secondaryCtaText || 'Schedule a Strategy Session'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
