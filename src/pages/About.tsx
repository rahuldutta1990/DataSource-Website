import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Target, Users, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';

export const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Problem-First Thinking',
      desc: 'We never push buzzwords, unneeded licenses, or pre-packaged technology. We begin by dissecting your commercial bottleneck and work backward to the architecture.',
    },
    {
      icon: ShieldCheck,
      title: 'Engineering Integrity',
      desc: 'We write clean, modular, and well-tested code that your internal developers can comfortably maintain long after our engagement completes.',
    },
    {
      icon: Users,
      title: 'Direct Senior Access',
      desc: 'You work directly with principal consultants and lead architects. We do not bait-and-switch clients with junior staff.',
    },
    {
      icon: Award,
      title: 'Measurable Commercial ROI',
      desc: 'Every project must tie to a business outcome—whether cutting reporting latency from 12 days to instant, or eliminating customer order cancellations.',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Understand the Problem',
      desc: 'We interview operational leaders, audit legacy workflows, and identify exact root causes before proposing any technical intervention.',
    },
    {
      step: '02',
      title: 'Design the Right Solution',
      desc: 'We build interactive prototypes, validate database schemas, and align on timeline milestones with clear budget boundaries.',
    },
    {
      step: '03',
      title: 'Build and Implement',
      desc: 'Our engineers execute with continuous automated testing, modular architecture, and incremental deployments that avoid business disruption.',
    },
    {
      step: '04',
      title: 'Improve and Support',
      desc: 'We empower your team through knowledge transfer, performance tuning, and ongoing support agreements.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF]">
      {/* Hero Section */}
      <section className="pt-12 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <Eyebrow text="About DataSource" variant="blue" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B2B] tracking-tight font-heading leading-tight">
              Technology That Solves.{' '}
              <span className="text-[#0077FF] block">Data That Drives.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-body">
              DataSource is a technology and data consulting partner helping businesses solve technical problems, build digital products, improve operations, and turn data into useful business decisions.
            </p>
            <div className="p-4 rounded-xl bg-[#0077FF]/5 border border-[#0077FF]/15 text-sm font-semibold text-slate-800">
              Brand Philosophy: &ldquo;We start with the problem, not the technology.&rdquo;
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Story Section */}
      <section className="py-16 lg:py-24 bg-[#FAFCFF] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Eyebrow text="Our Purpose" variant="cyan" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] font-heading leading-tight">
                You Bring the Challenge. DataSource Builds the Right Solution.
              </h2>
              <p className="text-slate-600 leading-relaxed font-body">
                Too many consulting firms arrive with a predetermined hammer—a software subscription they resell, a trendy framework they want on their portfolio, or a bloated team structure designed to maximize billable hours.
              </p>
              <p className="text-slate-600 leading-relaxed font-body">
                At DataSource, we founded our practice on a simpler, more honest foundation: deeply understanding what your business actually requires. Whether that means a 3-week Power BI dashboard sprint, a custom cloud portal modernization, or an automated data pipeline between disparate warehouse databases, we design what fits your exact operational scale.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#0077FF] text-white px-6 py-3 rounded-xl font-bold text-sm shadow hover:bg-[#0062D6] transition-colors"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                  alt="DataSource Consulting Collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/90 via-transparent to-transparent p-8 flex flex-col justify-end text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Collaborative Delivery</span>
                  <h3 className="text-xl font-bold mt-1">Cross-Functional Data &amp; Engineering Teams</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow text="Guiding Principles" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] mt-2 font-heading">
              How We Work With Our Clients
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Our principles ensure reliable technical outcomes, direct communication, and long-term partnership trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-7 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 text-[#0077FF] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">{v.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-body">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process: The DataSource Way */}
      <section id="process" className="py-16 lg:py-24 bg-[#0B1B2B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow text="Delivery Framework" variant="white" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-heading">
              The DataSource Way
            </h2>
            <p className="text-slate-300 text-base mt-2">
              From the initial whiteboard session through multi-year production stability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, idx) => (
              <div key={idx} className="bg-slate-900/90 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-4xl font-black text-cyan-400 font-heading mb-4">{s.step}</div>
                  <h3 className="text-xl font-bold text-white font-heading mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-body">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
