import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Layers,
  BarChart3,
  Code2,
} from 'lucide-react';
import { Eyebrow } from './Eyebrow.js';
import { api } from '../services/api.js';

export const AISolutionFinder: React.FC = () => {
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    recommendedService: string;
    category: string;
    rationale: string;
    implementationSteps: string[];
    estimatedTimeline: string;
  } | null>(null);

  const handleFindSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement.trim()) return;
    setLoading(true);

    try {
      const res = await api.findAISolution({ requirement });
      if (res && res.data) {
        setRecommendation(res.data);
      } else {
        throw new Error('Failed');
      }
    } catch {
      // Fallback recommendation
      setRecommendation({
        recommendedService: 'Power BI & Executive Dashboards',
        category: 'Data & Business Intelligence',
        rationale: 'Based on your requirement, your team requires unified executive visibility and automated KPI reporting to eliminate manual spreadsheet friction.',
        implementationSteps: [
          'Data source audit and connection mapping (SQL, Excel, Cloud APIs)',
          'Dimensional modeling and DAX metric calculation',
          'Interactive Power BI executive dashboard design & deployment',
        ],
        estimatedTimeline: '3 to 6 Weeks',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-solution-finder" className="py-16 sm:py-24 bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-[#0E1726] dark:via-[#070D18] dark:to-[#0E1726] border-b border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow text="AI Solution Finder" variant="blue" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading mt-3">
            Find the Exact Service For Your Requirement
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 font-body">
            Type your specific technical goal or challenge below. Our AI Solution Finder instantly matches your needs to our core practices across Data Analytics, BI, IT Consulting, Automation, Data Engineering, and Integration.
          </p>
        </div>

        <div className="bg-white dark:bg-[#132034] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          {!recommendation ? (
            <form onSubmit={handleFindSolution} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  What are you trying to build or solve?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g. Build an automated data pipeline from Postgres to Power BI..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-[#0077FF]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all shrink-0 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Matching...</span>
                      </>
                    ) : (
                      <>
                        <span>Find Solution</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick suggestion tags */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Or click a common objective:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Automate manual monthly reports',
                    'Migrate legacy SQL database to cloud',
                    'Build custom React client portal',
                    'Set up executive Power BI dashboards',
                    'Integrate Salesforce with internal ERP',
                  ].map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRequirement(tag)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0E1726] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                    {recommendation.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading mt-2">
                    {recommendation.recommendedService}
                  </h3>
                </div>

                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Timeline: {recommendation.estimatedTimeline}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Why This Matches Your Requirement:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-body leading-relaxed">
                  {recommendation.rationale}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended Implementation Roadmap:
                </h4>
                <div className="space-y-2">
                  {recommendation.implementationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700">
                <a
                  href={`/contact?service=${encodeURIComponent(recommendation.recommendedService)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow transition-colors"
                >
                  <span>Request Consultation For This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    setRecommendation(null);
                    setRequirement('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Search Another Requirement</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
