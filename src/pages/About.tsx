import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Target, Users, CheckCircle2, Award, Sparkles, Building2, Terminal } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';

export const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Problem-First Thinking',
      desc: 'We never push buzzwords, unneeded licenses, or pre-packaged technology. We begin by dissecting your commercial bottleneck and work backward to the architecture.',
      img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    },
    {
      icon: ShieldCheck,
      title: 'Engineering Integrity',
      desc: 'We write clean, modular, and well-tested code that your internal developers can comfortably maintain long after our engagement completes.',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    },
    {
      icon: Users,
      title: 'Direct Senior Access',
      desc: 'You work directly with principal consultants and lead architects. We do not bait-and-switch clients with junior staff.',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    },
    {
      icon: Award,
      title: 'Measurable Commercial ROI',
      desc: 'Every project must tie to a business outcome—whether cutting reporting latency from 12 days to instant, or eliminating customer order cancellations.',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Understand the Problem',
      desc: 'We interview operational leaders, audit legacy workflows, and identify exact root causes before proposing any technical intervention.',
      img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '02',
      title: 'Design the Right Solution',
      desc: 'We build interactive prototypes, validate database schemas, and align on timeline milestones with clear budget boundaries.',
      img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '03',
      title: 'Build and Implement',
      desc: 'Our engineers execute with continuous automated testing, modular architecture, and incremental deployments that avoid business disruption.',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '04',
      title: 'Improve and Support',
      desc: 'We empower your team through knowledge transfer, performance tuning, and ongoing support agreements.',
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200 overflow-x-hidden">
      {/* Hero Section with Background Professional Image & Animation */}
      <section className="relative pt-14 pb-20 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Ambient background architectural photo */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="DataSource Corporate Consulting Headquarters"
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
            <Eyebrow text="About DataSource" variant="blue" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading leading-tight">
              Technology That Solves.{' '}
              <span className="text-[#0077FF] dark:text-[#38BDF8] block">Data That Drives.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-body">
              DataSource is a technology and data consulting partner helping businesses solve technical problems, build digital products, improve operations, and turn data into useful business decisions.
            </p>
            <div className="p-4 rounded-xl bg-[#0077FF]/5 dark:bg-[#0077FF]/15 border border-[#0077FF]/15 dark:border-[#0077FF]/30 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Brand Philosophy: &ldquo;We start with the problem, not the technology.&rdquo;
            </div>
          </motion.div>
        </div>
      </section>

      {/* Two-Column Story Section */}
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
              <Eyebrow text="Our Purpose" variant="cyan" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
                You Bring the Challenge. DataSource Builds the Right Solution.
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                Too many consulting firms arrive with a predetermined hammer—a software subscription they resell, a trendy framework they want on their portfolio, or a bloated team structure designed to maximize billable hours.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                At DataSource, we founded our practice on a simpler, more honest foundation: deeply understanding what your business actually requires. Whether that means a 3-week Power BI dashboard sprint, a custom cloud portal modernization, or an automated data pipeline between disparate warehouse databases, we design what fits your exact operational scale.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                  alt="DataSource Consulting Collaboration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/90 via-transparent to-transparent p-8 flex flex-col justify-end text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Collaborative Delivery</span>
                  <h3 className="text-xl font-bold mt-1">Cross-Functional Data &amp; Engineering Teams</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values with Images & Hover Wow Effects */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0A1220] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <Eyebrow text="Guiding Principles" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white mt-2 font-heading">
              How We Work With Our Clients
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base mt-2">
              Our principles ensure reliable technical outcomes, direct communication, and long-term partnership trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden group hover:border-[#0077FF]/40 transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={v.img}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-lg bg-white/95 dark:bg-[#0B1B2B]/95 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center shadow">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">{v.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-body">{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process: The DataSource Way */}
      <section id="process" className="py-16 lg:py-24 bg-[#0B1B2B] text-white relative overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
            alt="Delivery Methodology"
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
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <Eyebrow text="Delivery Framework" variant="white" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-heading">
              The DataSource Way
            </h2>
            <p className="text-slate-300 text-base mt-2">
              From the initial whiteboard session through multi-year production stability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-cyan-400/50 flex flex-col justify-between overflow-hidden shadow-lg group transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-3xl font-black text-cyan-400 font-heading">{s.step}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white font-heading mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-body">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
