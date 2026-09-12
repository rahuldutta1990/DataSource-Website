import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Database,
  BarChart3,
  Clock,
  Cpu,
  Layers,
  DollarSign,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Filter,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  HelpCircle,
  Save,
  ShieldCheck,
  TrendingDown,
  Workflow,
  Target,
  LineChart,
  Sliders,
  X,
  ExternalLink,
} from 'lucide-react';
import { BusinessProblemItem, SiteSettings } from '../../types.js';
import { api } from '../../services/api.js';
import { DEFAULT_BUSINESS_PROBLEMS } from '../../data/defaultBusinessProblems.js';

interface BusinessProblemsManagerProps {
  settings: SiteSettings | null;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  showNotification: (text: string, type?: 'success' | 'error') => void;
}

const AVAILABLE_ICONS = [
  { name: 'FileSpreadsheet', label: 'Spreadsheet / Excel', component: FileSpreadsheet },
  { name: 'Database', label: 'Database / Pipeline', component: Database },
  { name: 'BarChart3', label: 'Bar Chart / KPI', component: BarChart3 },
  { name: 'Clock', label: 'Clock / Speed', component: Clock },
  { name: 'Cpu', label: 'CPU / Legacy Tech', component: Cpu },
  { name: 'Layers', label: 'Layers / Process', component: Layers },
  { name: 'DollarSign', label: 'Dollar / Cost ROI', component: DollarSign },
  { name: 'BrainCircuit', label: 'AI & Machine Learning', component: BrainCircuit },
  { name: 'AlertTriangle', label: 'Alert / Quality', component: AlertTriangle },
  { name: 'Sparkles', label: 'Sparkles / Innovation', component: Sparkles },
  { name: 'Workflow', label: 'Workflow Automation', component: Workflow },
  { name: 'Target', label: 'Target / Strategy', component: Target },
  { name: 'LineChart', label: 'Line Chart / Analytics', component: LineChart },
];

export const getIconComponent = (iconName?: string): React.ElementType => {
  const match = AVAILABLE_ICONS.find((i) => i.name === iconName);
  return match ? match.component : AlertTriangle;
};

export const BusinessProblemsManager: React.FC<BusinessProblemsManagerProps> = ({
  settings,
  onUpdateSettings,
  showNotification,
}) => {
  // Current problem list from settings, or fallback to defaults
  const currentProblems: BusinessProblemItem[] =
    settings?.businessProblems && settings.businessProblems.length > 0
      ? settings.businessProblems
      : DEFAULT_BUSINESS_PROBLEMS;

  // Local state for problems
  const [problems, setProblems] = useState<BusinessProblemItem[]>(currentProblems);
  const [sectionTitle, setSectionTitle] = useState<string>(
    settings?.businessProblemsTitle || 'What Business Problem Are You Trying to Solve?'
  );
  const [sectionSubtitle, setSectionSubtitle] = useState<string>(
    settings?.businessProblemsSubtitle ||
      'Most technology projects fail when companies buy software before diagnosing their real operational bottleneck. Select the challenge you are dealing with today to see how DataSource solves it with practical engineering and data clarity.'
  );
  const [sectionEnabled, setSectionEnabled] = useState<boolean>(
    settings?.businessProblemsEnabled !== false
  );

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [editingProblem, setEditingProblem] = useState<BusinessProblemItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [previewProblem, setPreviewProblem] = useState<BusinessProblemItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newDeliverableInput, setNewDeliverableInput] = useState<string>('');

  // Persist problems to backend settings
  const persistProblems = async (
    updatedList: BusinessProblemItem[],
    customTitle?: string,
    customSubtitle?: string,
    customEnabled?: boolean
  ) => {
    setIsSaving(true);
    try {
      const payload: Partial<SiteSettings> = {
        businessProblems: updatedList,
        businessProblemsTitle: customTitle !== undefined ? customTitle : sectionTitle,
        businessProblemsSubtitle: customSubtitle !== undefined ? customSubtitle : sectionSubtitle,
        businessProblemsEnabled: customEnabled !== undefined ? customEnabled : sectionEnabled,
      };

      const updated = await api.updateSiteSettings(payload);
      onUpdateSettings(updated);
      setProblems(updatedList);
      showNotification('Business Problems successfully saved to Firestore database.', 'success');
    } catch (err) {
      console.error('Failed to update business problems in Firestore:', err);
      showNotification('Notice saving changes. Local session updated.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered list
  const filteredProblems = problems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptomQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.consultingSolution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whoFeelsIt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.status !== 'draft') ||
      (statusFilter === 'draft' && item.status === 'draft');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Toggle status
  const toggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = problems.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === 'draft' ? ('published' as const) : ('draft' as const),
        };
      }
      return p;
    });
    setProblems(updated);
    await persistProblems(updated);
  };

  // Delete problem
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this business problem?')) {
      const updated = problems.filter((p) => p.id !== id);
      setProblems(updated);
      await persistProblems(updated);
    }
  };

  // Duplicate problem
  const handleDuplicate = async (problem: BusinessProblemItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned: BusinessProblemItem = {
      ...problem,
      id: `prob-${Date.now()}`,
      title: `${problem.title} (Copy)`,
      sortOrder: (problem.sortOrder || 1) + 1,
    };
    const updated = [...problems, cloned];
    setProblems(updated);
    await persistProblems(updated);
    showNotification('Business problem duplicated.', 'success');
  };

  // Open Edit Modal
  const handleOpenEdit = (problem: BusinessProblemItem) => {
    setEditingProblem({ ...problem });
    setIsCreatingNew(false);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const newProb: BusinessProblemItem = {
      id: `prob-${Date.now()}`,
      category: 'data_reporting',
      iconName: 'FileSpreadsheet',
      title: '',
      symptomQuote: '',
      businessImpact: '',
      consultingSolution: '',
      deliverables: [
        'Initial operational audit and workflow diagram',
        'Custom automated solution design',
        'Staff training and documentation',
      ],
      serviceSlug: '/services/power-bi-executive-dashboards',
      serviceName: 'Power BI & Executive Dashboards',
      whoFeelsIt: 'CEOs & Operations Leaders',
      badge: 'High Impact',
      sortOrder: problems.length + 1,
      status: 'published',
    };
    setEditingProblem(newProb);
    setIsCreatingNew(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    if (!editingProblem.title.trim()) {
      showNotification('Please enter a problem title.', 'error');
      return;
    }

    let updatedList: BusinessProblemItem[];
    if (isCreatingNew) {
      updatedList = [...problems, editingProblem];
    } else {
      updatedList = problems.map((p) => (p.id === editingProblem.id ? editingProblem : p));
    }

    // Sort by sortOrder
    updatedList.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

    setProblems(updatedList);
    setEditingProblem(null);
    setIsCreatingNew(false);
    await persistProblems(updatedList);
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (
      confirm(
        'Reset all business problems back to the 9 comprehensive enterprise defaults? This will overwrite existing customized entries.'
      )
    ) {
      setProblems(DEFAULT_BUSINESS_PROBLEMS);
      await persistProblems(DEFAULT_BUSINESS_PROBLEMS);
      showNotification('Reset to 9 default business problems successfully.', 'success');
    }
  };

  // Add deliverable to editing modal
  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim() || !editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      deliverables: [...(editingProblem.deliverables || []), newDeliverableInput.trim()],
    });
    setNewDeliverableInput('');
  };

  // Remove deliverable from editing modal
  const handleRemoveDeliverable = (index: number) => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      deliverables: (editingProblem.deliverables || []).filter((_, i) => i !== index),
    });
  };

  // Save Section Settings (Title & Subtitle)
  const handleSaveSectionSettings = async () => {
    await persistProblems(problems, sectionTitle, sectionSubtitle, sectionEnabled);
    showNotification('Section headers and visibility saved.', 'success');
  };

  return (
    <div className="space-y-8 text-left">
      {/* 1. Header Banner & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-[#38BDF8] border border-blue-500/30 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Problem-First Consulting
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {problems.length} Problems Configured
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              “What Business Problem Are You Trying to Solve?” Manager
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-body leading-relaxed">
              Control the interactive business problem diagnostic section displayed on the homepage.
              Add, edit, reorder, or draft business challenges, executive symptom quotes, and consulting solutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Problem</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-3 rounded-xl font-semibold text-xs transition-colors"
              title="Restore standard 9 business problems"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-left">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Total Problems</span>
            <p className="text-xl font-bold text-white font-mono mt-0.5">{problems.length}</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <span className="text-xs text-emerald-400 font-medium">Published / Live</span>
            <p className="text-xl font-bold text-emerald-300 font-mono mt-0.5">
              {problems.filter((p) => p.status !== 'draft').length}
            </p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <span className="text-xs text-amber-400 font-medium">Draft Mode</span>
            <p className="text-xl font-bold text-amber-300 font-mono mt-0.5">
              {problems.filter((p) => p.status === 'draft').length}
            </p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <span className="text-xs text-blue-400 font-medium">Linked Services</span>
            <p className="text-xl font-bold text-blue-300 font-mono mt-0.5">
              {new Set(problems.map((p) => p.serviceSlug)).size} Unique
            </p>
          </div>
        </div>
      </div>

      {/* 2. Section Global Settings Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Homepage Section Headers &amp; Visibility</h3>
              <p className="text-xs text-slate-400">Configure how the headline and introduction appear to visitors</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sectionEnabled}
                onChange={(e) => setSectionEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#0077FF] bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300">
                {sectionEnabled ? 'Section Enabled' : 'Section Hidden'}
              </span>
            </label>
            <button
              onClick={handleSaveSectionSettings}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Header</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Section Headline (H2)
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
              placeholder="What Business Problem Are You Trying to Solve?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Section Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-[#0077FF]"
              placeholder="Explanation paragraph underneath headline..."
            />
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, quotes, services..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0077FF]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0077FF]"
          >
            <option value="all">All Categories</option>
            <option value="data_reporting">Data &amp; Reporting</option>
            <option value="operations_workflow">Operations &amp; Workflow</option>
            <option value="software_cloud">Legacy Software &amp; Cloud</option>
            <option value="cost_strategy">Cost ROI &amp; Strategy</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0077FF]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* 4. Business Problems List */}
      <div className="space-y-4">
        {filteredProblems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto opacity-75" />
            <h3 className="text-lg font-bold text-white">No business problems match your search criteria</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your search terms or filters, or add a new business problem.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const IconComp = getIconComponent(prob.iconName);
            const isDraft = prob.status === 'draft';

            return (
              <div
                key={prob.id}
                className={`bg-slate-900 border rounded-3xl p-6 transition-all hover:border-slate-700 relative ${
                  isDraft ? 'border-amber-500/30 bg-slate-900/60' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Content Area */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#38BDF8] flex items-center justify-center shrink-0 border border-blue-500/20">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="space-y-3 flex-1">
                      {/* Top Badges & Title */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          #{prob.sortOrder ?? 1}
                        </span>
                        <h3 className="text-lg font-bold text-white font-heading">
                          {prob.title}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-[#38BDF8] border border-blue-500/20">
                          {prob.badge || 'Problem'}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isDraft
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {isDraft ? 'Draft' : 'Live on Homepage'}
                        </span>
                      </div>

                      {/* Symptom Quote */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                        <p className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Executive Symptom:
                        </p>
                        <p className="text-xs text-slate-300 italic">
                          {prob.symptomQuote}
                        </p>
                        <p className="text-[11px] text-rose-300 mt-2 flex items-start gap-1">
                          <TrendingDown className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                          <span><strong>Cost / Impact:</strong> {prob.businessImpact}</span>
                        </p>
                      </div>

                      {/* Consulting Solution */}
                      <div className="space-y-2">
                        <p className="text-xs text-[#38BDF8] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Consulting Solution:
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {prob.consultingSolution}
                        </p>
                      </div>

                      {/* Deliverables & Target Persona */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800/60">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>Target: <strong className="text-slate-200">{prob.whoFeelsIt}</strong></span>
                          <span>•</span>
                          <span>Linked Service: <strong className="text-blue-400">{prob.serviceName}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{prob.deliverables?.length || 0} Deliverables</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4">
                    <button
                      onClick={() => handleOpenEdit(prob)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors w-full"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Edit Problem</span>
                    </button>

                    <button
                      onClick={(e) => toggleStatus(prob.id, e)}
                      className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors w-full border ${
                        isDraft
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                      title={isDraft ? 'Publish to homepage' : 'Switch to draft'}
                    >
                      {isDraft ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isDraft ? 'Set Live' : 'Live'}</span>
                    </button>

                    <button
                      onClick={(e) => handleDuplicate(prob, e)}
                      className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      title="Duplicate this problem"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(prob.id, e)}
                      className="inline-flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      title="Delete problem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. ADD / EDIT MODAL */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-left space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#38BDF8] flex items-center justify-center border border-blue-500/30">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {isCreatingNew ? 'Create New Business Problem' : `Edit: ${editingProblem.title || 'Problem'}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure the pain point, symptom quote, consulting solution, and linked service
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProblem(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-5">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Problem Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProblem.title}
                    onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                    placeholder="e.g. Manual Excel & Spreadsheet Reporting"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingProblem.category}
                    onChange={(e) =>
                      setEditingProblem({
                        ...editingProblem,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  >
                    <option value="data_reporting">Data &amp; Reporting</option>
                    <option value="operations_workflow">Operations &amp; Workflow</option>
                    <option value="software_cloud">Legacy Software &amp; Cloud</option>
                    <option value="cost_strategy">Cost ROI &amp; Strategy</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Icon, Badge & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Visual Icon
                  </label>
                  <select
                    value={editingProblem.iconName || 'FileSpreadsheet'}
                    onChange={(e) => setEditingProblem({ ...editingProblem, iconName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label} ({ic.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingProblem.badge}
                    onChange={(e) => setEditingProblem({ ...editingProblem, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                    placeholder="e.g. High Impact, Cost Savings"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingProblem.sortOrder ?? 1}
                    onChange={(e) =>
                      setEditingProblem({
                        ...editingProblem,
                        sortOrder: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  />
                </div>
              </div>

              {/* Row 3: Target Persona & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Persona / Who Feels It
                  </label>
                  <input
                    type="text"
                    value={editingProblem.whoFeelsIt}
                    onChange={(e) => setEditingProblem({ ...editingProblem, whoFeelsIt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                    placeholder="e.g. CEOs, CFOs & Operations Leaders"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={editingProblem.status || 'published'}
                    onChange={(e) =>
                      setEditingProblem({
                        ...editingProblem,
                        status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  >
                    <option value="published">Published (Visible on Website)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Real-World Symptom Quote */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Real-World Symptom Quote (“How it sounds in your business”)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProblem.symptomQuote}
                  onChange={(e) => setEditingProblem({ ...editingProblem, symptomQuote: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500 font-body"
                  placeholder="“My managers spend 2 to 3 days at the end of every month copying rows between spreadsheets...”"
                />
              </div>

              {/* Row 5: Business Impact / Cost */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                  Business Cost / Risk of Inaction
                </label>
                <input
                  type="text"
                  required
                  value={editingProblem.businessImpact}
                  onChange={(e) => setEditingProblem({ ...editingProblem, businessImpact: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                  placeholder="Wasted payroll hours, reports arriving 2 weeks too late to take action, and human formula errors."
                />
              </div>

              {/* Row 6: Consulting Solution */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-1.5">
                  DataSource Consulting Solution (“How We Solve It”)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProblem.consultingSolution}
                  onChange={(e) =>
                    setEditingProblem({ ...editingProblem, consultingSolution: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#0077FF] font-body leading-relaxed"
                  placeholder="We replace manual spreadsheet compiling with automated Power BI dashboards connected directly to your databases..."
                />
              </div>

              {/* Row 7: Deliverables List Manager */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Concrete Deliverables (What the client receives)
                </label>

                <div className="space-y-2">
                  {(editingProblem.deliverables || []).map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="text"
                        value={deliv}
                        onChange={(e) => {
                          const updatedDelivs = [...(editingProblem.deliverables || [])];
                          updatedDelivs[idx] = e.target.value;
                          setEditingProblem({ ...editingProblem, deliverables: updatedDelivs });
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0077FF]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Add a new deliverable (e.g. Real-time data gateway refresh)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0077FF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    Add Deliverable
                  </button>
                </div>
              </div>

              {/* Row 8: Target Service Link & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Service Route / Slug
                  </label>
                  <input
                    type="text"
                    value={editingProblem.serviceSlug}
                    onChange={(e) => setEditingProblem({ ...editingProblem, serviceSlug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-[#0077FF]"
                    placeholder="/services/power-bi-executive-dashboards"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Service Name
                  </label>
                  <input
                    type="text"
                    value={editingProblem.serviceName}
                    onChange={(e) => setEditingProblem({ ...editingProblem, serviceName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                    placeholder="Power BI & Executive Dashboards"
                  />
                </div>
              </div>

              {/* Bottom Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Create Problem' : 'Save Problem Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
