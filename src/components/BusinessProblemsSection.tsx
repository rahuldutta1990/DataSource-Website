import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  Database,
  BarChart3,
  Clock,
  Cpu,
  Layers,
  DollarSign,
  BrainCircuit,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Workflow,
  Target,
  LineChart,
  LayoutGrid,
  Columns,
  MessageSquare,
  Phone,
  HelpCircle,
  Users,
} from 'lucide-react';
import { Eyebrow } from './Eyebrow.js';
import { BusinessProblemItem, SiteSettings } from '../types.js';
import { DEFAULT_BUSINESS_PROBLEMS } from '../data/defaultBusinessProblems.js';
import { api } from '../services/api.js';

const ICON_MAP: Record<string, React.ElementType> = {
  FileSpreadsheet,
  Database,
  BarChart3,
  Clock,
  Cpu,
  Layers,
  DollarSign,
  BrainCircuit,
  AlertTriangle,
  Sparkles,
  Workflow,
  Target,
  LineChart,
  ShieldAlert,
};

const resolveIcon = (iconName?: string): React.ElementType => {
  if (!iconName) return AlertTriangle;
  return ICON_MAP[iconName] || AlertTriangle;
};

interface BusinessProblemsSectionProps {
  initialProblems?: BusinessProblemItem[];
  customTitle?: string;
  customSubtitle?: string;
}

export const BusinessProblemsSection: React.FC<BusinessProblemsSectionProps> = ({
  initialProblems,
  customTitle,
  customSubtitle,
}) => {
  const navigate = useNavigate();

  const [problemsList, setProblemsList] = useState<BusinessProblemItem[]>(
    initialProblems || DEFAULT_BUSINESS_PROBLEMS
  );
  const [headline, setHeadline] = useState<string>(
    customTitle || 'What Business Problem Are You Trying to Solve?'
  );
  const [description, setDescription] = useState<string>(
    customSubtitle ||
      'Most IT projects fail when software is purchased before diagnosing operational bottlenecks. Select your challenge below to review our diagnostic approach, technical deliverables, and business outcomes.'
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // Fetch dynamic settings from Firestore if not provided via props
  useEffect(() => {
    let isMounted = true;
    if (!initialProblems) {
      api
        .getSettings()
        .then((settings: SiteSettings) => {
          if (isMounted && settings) {
            if (settings.businessProblems && settings.businessProblems.length > 0) {
              setProblemsList(settings.businessProblems);
            }
            if (settings.businessProblemsTitle) {
              setHeadline(settings.businessProblemsTitle);
            }
            if (settings.businessProblemsSubtitle) {
              setDescription(settings.businessProblemsSubtitle);
            }
            if (settings.businessProblemsEnabled !== undefined) {
              setIsEnabled(settings.businessProblemsEnabled);
            }
          }
        })
        .catch((err) => console.warn('Using default business problems dataset:', err));
    }
    return () => {
      isMounted = false;
    };
  }, [initialProblems]);

  const publishedProblems = problemsList.filter((p) => p.status !== 'draft');
  const activeList = publishedProblems.length > 0 ? publishedProblems : DEFAULT_BUSINESS_PROBLEMS;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(activeList[0]?.id || '');
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');

  useEffect(() => {
    if (activeList.length > 0 && (!selectedProblemId || !activeList.some((p) => p.id === selectedProblemId))) {
      setSelectedProblemId(activeList[0].id);
    }
  }, [activeList, selectedProblemId]);

  const activeProblem =
    activeList.find((p) => p.id === selectedProblemId) || activeList[0] || DEFAULT_BUSINESS_PROBLEMS[0];

  const filteredProblems =
    selectedCategory === 'all'
      ? activeList
      : activeList.filter((p) => p.category === selectedCategory);

  if (!isEnabled) {
    return null;
  }

  const ActiveIcon = resolveIcon(activeProblem.iconName);

  return (
    <section
      id="business-problems"
      className="py-16 sm:py-24 bg-white dark:bg-[#070D18] border-b border-slate-200/80 dark:border-slate-800 relative overflow-hidden text-left"
    >
      {/* Background Subtle Tech Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <Eyebrow text="Problem-First Technology Consulting" variant="blue" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading mt-3 leading-tight">
            {headline}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-body">
            {description}
          </p>
        </div>

        {/* Category Filters & View Mode Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            {[
              { id: 'all', label: `All Problems (${activeList.length})` },
              { id: 'data_reporting', label: 'Data & Reporting' },
              { id: 'operations_workflow', label: 'Operations & Workflow' },
              { id: 'software_cloud', label: 'Legacy & Cloud' },
              { id: 'cost_strategy', label: 'IT Costs & Strategy' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0077FF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-[#132034] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#132034] p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
            <button
              onClick={() => setViewMode('spotlight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'spotlight'
                  ? 'bg-white dark:bg-[#0E1726] text-[#0077FF] dark:text-[#38BDF8] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Spotlight</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#0E1726] text-[#0077FF] dark:text-[#38BDF8] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Grid</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Spotlight View (Side-by-side List & Detailed Info Card) */}
        {viewMode === 'spotlight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Problem List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 px-1 pb-1">
                <Filter className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
                Select a business challenge to inspect details:
              </span>

              {filteredProblems.map((prob) => {
                const IconComponent = resolveIcon(prob.iconName);
                const isSelected = activeProblem.id === prob.id;

                return (
                  <button
                    key={prob.id}
                    onClick={() => setSelectedProblemId(prob.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border relative flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-[#0077FF]/5 dark:bg-[#0077FF]/15 border-[#0077FF] dark:border-[#38BDF8] shadow-md shadow-blue-500/10'
                        : 'bg-white dark:bg-[#0E1726] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0077FF] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-[#132034] text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#132034] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                          {prob.badge || 'Challenge'}
                        </span>
                        <span className="text-[11px] font-bold text-[#0077FF] dark:text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity">
                          Inspect &rarr;
                        </span>
                      </div>
                      <h3
                        className={`text-sm font-bold font-heading mt-1 transition-colors line-clamp-1 ${
                          isSelected
                            ? 'text-[#0077FF] dark:text-[#38BDF8]'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {prob.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-body">
                        {prob.symptomQuote}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Information-Rich Solution Card (7 Cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProblem.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 text-left"
                >
                  {/* Top Header & Badge */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#0077FF]/10 dark:bg-[#0077FF]/20 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center border border-[#0077FF]/20 shrink-0">
                        <ActiveIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/60">
                          {activeProblem.badge || 'Business Challenge'}
                        </span>
                        <h3 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading mt-1">
                          {activeProblem.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#132034] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <Users className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
                      <span>Role: <strong>{activeProblem.whoFeelsIt}</strong></span>
                    </div>
                  </div>

                  {/* Operational Symptom / Challenge Statement */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>The Operational Bottleneck</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic font-body leading-relaxed">
                      {activeProblem.symptomQuote}
                    </p>
                  </div>

                  {/* Financial & Business Impact */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      <span>Business &amp; Financial Cost</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-body leading-relaxed">
                      {activeProblem.businessImpact}
                    </p>
                  </div>

                  {/* The Consulting Solution */}
                  <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-[#0077FF] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 shrink-0 text-[#0077FF] dark:text-[#38BDF8]" />
                      <span>Our Engineering &amp; Consulting Solution</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-body leading-relaxed">
                      {activeProblem.consultingSolution}
                    </p>
                  </div>

                  {/* Core Deliverables List */}
                  {activeProblem.deliverables && activeProblem.deliverables.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Concrete Deliverables You Receive:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeProblem.deliverables.map((deliv, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear CTA Bar */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Link
                      to={`/contact?problem=${encodeURIComponent(activeProblem.title)}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all text-center"
                    >
                      <span>Consult On This Challenge</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {activeProblem.serviceSlug && (
                      <Link
                        to={activeProblem.serviceSlug}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-[#132034] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-center"
                      >
                        <span>View Related Practice</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* View Mode 2: Full Information Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((prob) => {
              const IconComponent = resolveIcon(prob.iconName);
              return (
                <div
                  key={prob.id}
                  className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col justify-between text-left space-y-4 hover:border-[#0077FF]/50 transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#0077FF]/10 dark:bg-[#0077FF]/20 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center border border-[#0077FF]/20">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#132034] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                        {prob.badge || 'Challenge'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0B1B2B] dark:text-white font-heading group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors">
                      {prob.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic font-body line-clamp-2">
                      {prob.symptomQuote}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#132034] border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                        Solution Overview:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-body line-clamp-3">
                        {prob.consultingSolution}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      Affects: <strong className="text-slate-600 dark:text-slate-300">{prob.whoFeelsIt}</strong>
                    </span>

                    <Link
                      to={`/contact?problem=${encodeURIComponent(prob.title)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline"
                    >
                      <span>Consult</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* High-Impact Clear CTA Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0B1B2B] via-[#0E243A] to-[#071322] text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 inline-flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Custom Technical Assessment
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Have a Specific Technology Bottleneck Not Listed Above?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
              Every organization&apos;s data and software environment is unique. Schedule a 30-minute discovery consultation with our principal technology consultants in Kolkata or virtually worldwide. We evaluate your exact operational workflow before recommending any software.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 relative z-10">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all text-center"
            >
              <span>Schedule Problem Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+919038417437"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-center"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+91 9038417437</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
