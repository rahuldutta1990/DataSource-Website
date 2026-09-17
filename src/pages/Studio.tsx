import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  BarChart3,
  Cpu,
  Layers,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  Database,
  Lock,
  Zap,
  RefreshCw,
  Play,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead.js';
import { Eyebrow } from '../components/Eyebrow.js';
import { api } from '../services/api.js';
import { SiteSettings } from '../types.js';

export const Studio: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'sandbox' | 'vault' | 'observability'>('sandbox');
  const [simulatedLoss, setSimulatedLoss] = useState(0.042);
  const [simulatedTokens, setSimulatedTokens] = useState(482100);
  const [isTrainingSim, setIsTrainingSim] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  const handleSimulateStep = () => {
    setIsTrainingSim(true);
    setTimeout(() => {
      setSimulatedLoss((prev) => Math.max(0.008, Number((prev * 0.88).toFixed(4))));
      setSimulatedTokens((prev) => prev + 128400);
      setIsTrainingSim(false);
    }, 800);
  };

  const workbenchFeatures = settings?.studioWorkbenchFeatures || [
    {
      id: 'wb-1',
      title: 'Interactive Experimentation Sandbox',
      description: 'Rapidly test hyperparameter configurations, evaluate loss curves across multiple model iterations, and fine-tune open foundation models in an isolated, secure environment.',
      iconName: 'SlidersHorizontal',
      badge: 'Real-Time Tuning',
    },
    {
      id: 'wb-2',
      title: 'Secure Vector Knowledge Vault',
      description: 'Connect your unstructured corporate documentation directly to high-dimensional vector embeddings, enabling real-time context retrieval with zero external egress.',
      iconName: 'ShieldCheck',
      badge: 'Zero-Egress Security',
    },
    {
      id: 'wb-3',
      title: 'Real-Time Observability Dashboard',
      description: 'Monitor drift detection, token expenditure, and latency metrics across all deployed endpoints in one centralized UI.',
      iconName: 'BarChart3',
      badge: 'Sub-100ms Telemetry',
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-200 overflow-x-hidden">
      {/* On-Page SEO Meta Data */}
      <SEOHead
        title="The DataSource AI Studio Platform | Machine Learning Workspace"
        description="Accelerate model experimentation, secure data ingestion, and seamless production deployment with our proprietary AI Studio Platform."
        keywords="proprietary AI development platform, machine learning workspace, model experimentation pipeline, MLOps platform"
        canonical="https://datasourcerechnology.ai.studio/studio"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'DataSource AI Studio Platform',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Cloud Web Platform',
          description: 'A centralized, enterprise-grade environment designed to accelerate machine learning experimentation, secure data ingestion, and seamless production deployment.',
        }}
      />

      {/* Hero Banner */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-[#070D18] via-[#0B1B2B] to-[#0E1726] text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>ENTERPRISE MLOPS WORKBENCH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              The DataSource AI Studio:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Your Unified Intelligence Workbench
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              A centralized, enterprise-grade environment designed to accelerate machine learning experimentation, secure data ingestion, and seamless production deployment.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="#interactive-workbench"
                className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:translate-y-[-1px]"
              >
                <span>Launch Interactive Workbench</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/contact?type=studio-demo"
                className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3.5 rounded-xl font-bold transition-all"
              >
                <span>Schedule an Enterprise Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Studio Architecture Pillars */}
      <section className="py-20 bg-white dark:bg-[#070D18] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Eyebrow text="Proprietary Tooling & Capabilities" variant="blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Architected for Real-Time Model Adaptation
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4 text-base">
              Built specifically to eliminate friction between research-grade mathematical architectures and production enterprise workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workbenchFeatures.map((feat, idx) => (
              <motion.div
                key={feat.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {idx === 0 && <SlidersHorizontal className="w-6 h-6" />}
                    {idx === 1 && <ShieldCheck className="w-6 h-6" />}
                    {idx === 2 && <BarChart3 className="w-6 h-6" />}
                  </div>
                  {feat.badge && (
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                      {feat.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workbench Sandbox Preview */}
      <section id="interactive-workbench" className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4" />
                <span>Live Studio Emulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Interactive Environment Simulator
              </h2>
            </div>

            {/* View Mode Selector */}
            <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'sandbox'
                    ? 'bg-[#0077FF] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. PEFT Sandbox
              </button>
              <button
                onClick={() => setActiveTab('vault')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'vault'
                    ? 'bg-[#0077FF] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Vector Vault
              </button>
              <button
                onClick={() => setActiveTab('observability')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'observability'
                    ? 'bg-[#0077FF] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Telemetry
              </button>
            </div>
          </div>

          {/* Terminal / Workbench Screen */}
          <div className="rounded-2xl bg-[#070D18] border border-slate-800 shadow-2xl overflow-hidden">
            {/* Header bar */}
            <div className="px-6 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-slate-400">
                  datasource-studio-v4.1.2 :: {activeTab}.env
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span>VPC Isolated</span>
              </div>
            </div>

            {/* Workbench Body */}
            <div className="p-6 sm:p-8">
              {activeTab === 'sandbox' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      <span>Hyperparameter & LoRA Tuning</span>
                    </h3>
                    <p className="text-sm text-slate-400">
                      Simulate low-rank adaptation on domain-specific corpora with parameter-efficient fine-tuning.
                    </p>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs font-mono text-slate-400 flex justify-between">
                          <span>LoRA Rank (r)</span>
                          <span className="text-cyan-400 font-bold">16</span>
                        </label>
                        <input
                          type="range"
                          disabled
                          defaultValue="16"
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-slate-400 flex justify-between">
                          <span>Alpha Scaling</span>
                          <span className="text-cyan-400 font-bold">32</span>
                        </label>
                        <input
                          type="range"
                          disabled
                          defaultValue="32"
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateStep}
                      disabled={isTrainingSim}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                    >
                      {isTrainingSim ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executing Gradient Step...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Simulate Training Epoch</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-slate-400">Training Loss Curve</span>
                      <span className="text-emerald-400 font-bold">Loss: {simulatedLoss}</span>
                    </div>

                    <div className="h-32 flex items-end gap-2 pt-4">
                      {[0.42, 0.31, 0.22, 0.16, 0.09, 0.06, simulatedLoss].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-500"
                            style={{ height: `${Math.min(100, Math.max(12, val * 200))}%` }}
                          />
                          <span className="text-[10px] text-slate-500">e{i + 1}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Total Tokens Processed</span>
                        <span className="text-white text-sm font-bold">{simulatedTokens.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Gradient Norm</span>
                        <span className="text-cyan-400 text-sm font-bold">0.0182 (Converged)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vault' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database className="w-5 h-5 text-cyan-400" />
                        <span>High-Dimensional Vector Knowledge Vault</span>
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        Zero-egress vector indexing with strict AES-256 encryption and role-based access filtering.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                      AES-256 ENCRYPTED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500 block">Indexed Vector Chunks</span>
                      <span className="text-xl font-bold text-white mt-1 block">1,842,900</span>
                      <span className="text-xs text-emerald-400 font-mono">1536-dim embeddings</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500 block">Retrieval Latency (p99)</span>
                      <span className="text-xl font-bold text-cyan-400 mt-1 block">14.2 ms</span>
                      <span className="text-xs text-slate-400 font-mono">HNSW Cosine index</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500 block">External Egress</span>
                      <span className="text-xl font-bold text-emerald-400 mt-1 block">0.00 Bytes</span>
                      <span className="text-xs text-slate-400 font-mono">Air-gapped VPC</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'observability' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <span>Production Telemetry & Drift Observability</span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Continuous monitoring of concept drift, inference latency, and token consumption across all micro-services.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500">Inference Latency</span>
                      <p className="text-lg font-bold text-white mt-1">38 ms</p>
                      <span className="text-[10px] text-emerald-400">Target &lt; 50ms</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500">Drift Delta (KS-Stat)</span>
                      <p className="text-lg font-bold text-emerald-400 mt-1">0.012</p>
                      <span className="text-[10px] text-slate-400">Within confidence bound</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500">Active Endpoints</span>
                      <p className="text-lg font-bold text-white mt-1">18 Clusters</p>
                      <span className="text-[10px] text-cyan-400">Multi-region active</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-500">Guardrail Triggers</span>
                      <p className="text-lg font-bold text-white mt-1">0 Blocked</p>
                      <span className="text-[10px] text-emerald-400">100% Policy Pass</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#0B1B2B] to-[#0077FF] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Accelerate Your Enterprise AI Roadmap?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Deploy custom models on your private cloud infrastructure with full architectural governance and zero data leakage.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Consult with Senior AI Engineers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
