import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Database,
  Cpu,
  Workflow,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Eyebrow } from './Eyebrow.js';
import { api } from '../services/api.js';

export const AIHealthCheck: React.FC = () => {
  const [scores, setScores] = useState({
    reporting: 3,
    dataQuality: 3,
    integration: 2,
    automation: 2,
    kpiVisibility: 3,
    analytics: 3,
    aiReadiness: 2,
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    maturityScore: number;
    maturityStage: string;
    summary: string;
    recommendations: string[];
  } | null>(null);

  const handleSliderChange = (key: keyof typeof scores, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const calculateHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const res = await api.evaluateHealthCheck(scores);
      if (res && res.data) {
        setResult(res.data);
      } else {
        throw new Error('Failed');
      }
    } catch {
      // Fallback calculation if offline
      const avg = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0) / 7;
      const score = Math.round((avg / 5) * 100);
      let stage = 'Developing Data Maturity';
      if (score >= 80) stage = 'Optimized Data-Driven Enterprise';
      else if (score >= 60) stage = 'Structured Operational Analytics';
      else if (score >= 40) stage = 'Emerging Data Pipelines';

      setResult({
        maturityScore: score,
        maturityStage: stage,
        summary: `Your organization scored ${score}/100 on the Data & Analytics Health Index. While reporting and KPIs exist, significant acceleration can be achieved through automated data engineering pipelines and integrated Power BI gateways.`,
        recommendations: [
          'Consolidate siloed spreadsheets into a centralized cloud data warehouse (BigQuery / Snowflake).',
          'Automate manual monthly report compilation with scheduled Power BI dataflows.',
          'Implement robust data validation pipelines to improve data quality scores.',
        ],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section id="ai-health-check" className="py-16 sm:py-24 bg-white dark:bg-[#070D18] border-b border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow text="AI Data & Analytics Health Check" variant="blue" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading mt-3">
            Evaluate Your Enterprise Data Maturity
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 font-body">
            Rate your organization across 7 core dimensions from 1 (Basic / Manual) to 5 (Automated / Advanced) to receive an instant maturity score and practical architectural recommendations.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-[#0E1726] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          {!result ? (
            <form onSubmit={calculateHealth} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'reporting', label: 'Executive Reporting & Dashboards', desc: 'How automated and timely are your current reports?' },
                  { key: 'dataQuality', label: 'Data Quality & Validation', desc: 'Reliability and cleanliness of underlying records.' },
                  { key: 'integration', label: 'System & API Integration', desc: 'Connectivity between CRM, ERP, and databases.' },
                  { key: 'automation', label: 'Workflow & Process Automation', desc: 'Extent of manual data entry vs. automated triggers.' },
                  { key: 'kpiVisibility', label: 'Real-Time KPI Visibility', desc: 'Ability to track core business metrics daily.' },
                  { key: 'analytics', label: 'Advanced Analytics & Forecasting', desc: 'Predictive modeling or trend forecasting maturity.' },
                  { key: 'aiReadiness', label: 'AI & Machine Learning Readiness', desc: 'Preparedness for LLM, RAG, and AI agent integration.' },
                ].map((item) => {
                  const val = scores[item.key as keyof typeof scores];
                  return (
                    <div key={item.key} className="p-4 rounded-2xl bg-white dark:bg-[#132034] border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          {item.label}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#0077FF] dark:text-[#38BDF8]">
                          Level {val} / 5
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </p>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={val}
                        onChange={(e) => handleSliderChange(item.key as keyof typeof scores, parseInt(e.target.value))}
                        className="w-full accent-[#0077FF] cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={analyzing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Evaluating Health Index...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Health Maturity Score</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white dark:bg-[#132034] border border-slate-200 dark:border-slate-700">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                    Assessment Complete
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                    {result.maturityStage}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Evaluated across 7 enterprise data and analytics dimensions.
                  </p>
                </div>

                <div className="w-28 h-28 rounded-full bg-[#0077FF]/10 dark:bg-[#0077FF]/20 border-4 border-[#0077FF] flex flex-col items-center justify-center shrink-0">
                  <span className="text-3xl font-extrabold text-[#0077FF] dark:text-[#38BDF8] font-heading">
                    {result.maturityScore}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Score / 100
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                  AI Executive Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-body leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Practical Recommendations to Advance Maturity:
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#132034] border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700">
                <a
                  href="/contact?service=Data%20Analytics%20Health%20Check"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow transition-colors"
                >
                  <span>Discuss Your Assessment With an Architect</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setResult(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalculate Health Check</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
