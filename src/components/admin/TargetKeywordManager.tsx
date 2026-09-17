import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Globe,
  MapPin,
  Tag,
  FileText,
  Smartphone,
  Monitor,
  AlertCircle,
  CheckCircle2,
  Filter,
  BarChart2,
  HelpCircle,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { SEOKeywordTarget, SiteSettings } from '../../types.js';
import { api } from '../../services/api.js';

interface TargetKeywordManagerProps {
  settings: SiteSettings | null;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  showNotification: (text: string, type?: 'success' | 'error') => void;
}

const DEFAULT_INDIAN_SEO_KEYWORDS: SEOKeywordTarget[] = [
  {
    id: 'seo-1',
    pageRoute: '/',
    pageName: 'Home - Enterprise Technology & Data',
    primaryKeyword: 'Technology Consulting Company Kolkata India',
    secondaryKeywords: [
      'Data engineering consultants India',
      'Enterprise cloud software Kolkata',
      'Power BI consulting company India',
      'Full stack web development India',
    ],
    searchIntent: 'commercial',
    targetLocation: 'India & Global',
    metaTitle: 'DataSource Technology & Solutions | Enterprise Software, Cloud & Data Consulting',
    metaDescription:
      'DataSource is an enterprise technology and data consulting partner in India helping companies design custom web apps, scalable cloud architectures, Power BI dashboards and automated data pipelines.',
    priority: 'high',
    rankingStatus: 'active_target',
    targetMonthlySearches: '4,200/mo',
    lastAudited: '2026-09-12',
    notes: 'Primary brand homepage targeting high-intent technology and data consulting searches in India and global clients.',
  },
  {
    id: 'seo-2',
    pageRoute: '/services/power-bi-executive-dashboards',
    pageName: 'Power BI & Executive Dashboards',
    primaryKeyword: 'Power BI Consulting Services India',
    secondaryKeywords: [
      'Power BI dashboard developers Kolkata',
      'Executive KPI reporting consultants Kolkata',
      'Power BI automated refresh setup India',
      'DAX modeling and Star Schema consulting',
    ],
    searchIntent: 'transactional',
    targetLocation: 'Pan-India & Overseas',
    metaTitle: 'Power BI Consulting & Executive Dashboards India | DataSource',
    metaDescription:
      'Custom Power BI dashboard engineering, DAX star schema modeling, automated data gateway configuration, and executive KPI scorecards by DataSource in India.',
    priority: 'high',
    rankingStatus: 'active_target',
    targetMonthlySearches: '3,100/mo',
    lastAudited: '2026-09-12',
    notes: 'Targeting decision-makers looking to hire Power BI consultants and automate executive reporting.',
  },
  {
    id: 'seo-3',
    pageRoute: '/services/data-engineering-pipeline-automation',
    pageName: 'Data Engineering & Pipeline Automation',
    primaryKeyword: 'Data Engineering Company in Kolkata India',
    secondaryKeywords: [
      'ETL data pipeline developers India',
      'Snowflake BigQuery migration consultants',
      'Airflow data pipeline architecture India',
      'Lakehouse modernization services India',
    ],
    searchIntent: 'commercial',
    targetLocation: 'Kolkata / Pan-India',
    metaTitle: 'Data Engineering & Pipeline Automation Services India | DataSource',
    metaDescription:
      'Fault-tolerant ETL/ELT pipelines, Snowflake and BigQuery data warehousing, Airflow workflow orchestration, and Lakehouse engineering by DataSource.',
    priority: 'high',
    rankingStatus: 'active_target',
    targetMonthlySearches: '2,800/mo',
    lastAudited: '2026-09-12',
    notes: 'High commercial intent for mid-market and enterprise data warehouse migrations.',
  },
  {
    id: 'seo-4',
    pageRoute: '/services/custom-web-cloud-applications',
    pageName: 'Custom Web & Cloud Applications',
    primaryKeyword: 'Custom Software Development Company India',
    secondaryKeywords: [
      'Enterprise React TypeScript developers India',
      'Cloud web application engineers Kolkata',
      'Node.js API and microservices architecture',
      'SaaS application development India',
    ],
    searchIntent: 'transactional',
    targetLocation: 'India & Global Export',
    metaTitle: 'Custom Web & Cloud Application Development India | DataSource',
    metaDescription:
      'Production-grade custom web application design and cloud software engineering with React, TypeScript, Node.js, and AWS/GCP cloud architectures.',
    priority: 'high',
    rankingStatus: 'active_target',
    targetMonthlySearches: '5,400/mo',
    lastAudited: '2026-09-12',
    notes: 'Attracts domestic and global clients looking for premium full-stack engineering teams.',
  },
  {
    id: 'seo-5',
    pageRoute: '/services',
    pageName: 'All Technology & Data Services',
    primaryKeyword: 'IT Consulting and Data Solutions India',
    secondaryKeywords: [
      'Digital product development services India',
      'Enterprise data consulting firms Kolkata',
      'Software architecture audit India',
      'UI UX product design consulting',
    ],
    searchIntent: 'commercial',
    targetLocation: 'India & Global',
    metaTitle: 'Technology & Data Consulting Services India | DataSource',
    metaDescription:
      'Explore DataSource\'s full range of enterprise services: digital product development, Power BI dashboards, data pipeline engineering, and IT consulting.',
    priority: 'medium',
    rankingStatus: 'active_target',
    targetMonthlySearches: '1,900/mo',
    lastAudited: '2026-09-12',
    notes: 'Overview hub page for all service categories.',
  },
  {
    id: 'seo-6',
    pageRoute: '/contact',
    pageName: 'Contact & Office Locations',
    primaryKeyword: 'Contact Technology Consultants Kolkata',
    secondaryKeywords: [
      'DataSource office locations India',
      'Book IT architecture consultation India',
      'Hire data engineering consultants India',
      'Kolkata tech consulting contact number',
    ],
    searchIntent: 'navigational',
    targetLocation: 'Kolkata, West Bengal, India',
    metaTitle: 'Contact DataSource Technology & Solutions | Kolkata, West Bengal, India',
    metaDescription:
      'Connect with DataSource technical architects at our Kolkata Technology Hub. Call +91 9038417437 or book a consultation.',
    priority: 'high',
    rankingStatus: 'active_target',
    targetMonthlySearches: '1,200/mo',
    lastAudited: '2026-09-12',
    notes: 'Local search and direct conversion hub for enquiries and office visits.',
  },
];

const PRESET_SUGGESTIONS = [
  {
    keyword: 'Power BI Developers Kolkata',
    intent: 'transactional' as const,
    route: '/services/power-bi-executive-dashboards',
    location: 'Kolkata / India',
  },
  {
    keyword: 'Cloud Lakehouse Architecture India',
    intent: 'commercial' as const,
    route: '/services/data-engineering-pipeline-automation',
    location: 'Pan-India',
  },
  {
    keyword: 'Enterprise React TypeScript Agency India',
    intent: 'commercial' as const,
    route: '/services/custom-web-cloud-applications',
    location: 'India & Overseas',
  },
  {
    keyword: 'IT Architecture Audit Consultants Mumbai',
    intent: 'commercial' as const,
    route: '/services/it-strategy-technology-assessment',
    location: 'Mumbai / BKC',
  },
  {
    keyword: 'BigQuery Data Warehouse Migration Kolkata',
    intent: 'commercial' as const,
    route: '/services/database-architecture-migration',
    location: 'Kolkata / Sector V',
  },
];

export const TargetKeywordManager: React.FC<TargetKeywordManagerProps> = ({
  settings,
  onUpdateSettings,
  showNotification,
}) => {
  const keywordsList: SEOKeywordTarget[] =
    settings?.seoKeywords && settings.seoKeywords.length > 0
      ? settings.seoKeywords
      : DEFAULT_INDIAN_SEO_KEYWORDS;

  const [searchFilter, setSearchFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'keywords' | 'schema' | 'guide'>('keywords');

  const [editingKeyword, setEditingKeyword] = useState<SEOKeywordTarget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Form state
  const [formPageName, setFormPageName] = useState('');
  const [formPageRoute, setFormPageRoute] = useState('/');
  const [formPrimaryKeyword, setFormPrimaryKeyword] = useState('');
  const [formSecondaryKeywords, setFormSecondaryKeywords] = useState('');
  const [formSearchIntent, setFormSearchIntent] = useState<'commercial' | 'transactional' | 'informational' | 'navigational'>('commercial');
  const [formTargetLocation, setFormTargetLocation] = useState('India & Global');
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [formRankingStatus, setFormRankingStatus] = useState<'ranking_top_10' | 'optimizing' | 'active_target' | 'planned'>('active_target');
  const [formMonthlySearches, setFormMonthlySearches] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setEditingKeyword(null);
    setFormPageName('');
    setFormPageRoute('/');
    setFormPrimaryKeyword('');
    setFormSecondaryKeywords('');
    setFormSearchIntent('commercial');
    setFormTargetLocation('India & Global');
    setFormMetaTitle('DataSource Technology & Solutions | Enterprise Software & Data');
    setFormMetaDescription('DataSource helps enterprise businesses solve technical challenges with cloud apps, Power BI, and data pipelines.');
    setFormPriority('high');
    setFormRankingStatus('active_target');
    setFormMonthlySearches('2,500/mo');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (kw: SEOKeywordTarget) => {
    setEditingKeyword(kw);
    setFormPageName(kw.pageName);
    setFormPageRoute(kw.pageRoute);
    setFormPrimaryKeyword(kw.primaryKeyword);
    setFormSecondaryKeywords(kw.secondaryKeywords ? kw.secondaryKeywords.join(', ') : '');
    setFormSearchIntent(kw.searchIntent);
    setFormTargetLocation(kw.targetLocation);
    setFormMetaTitle(kw.metaTitle);
    setFormMetaDescription(kw.metaDescription);
    setFormPriority(kw.priority);
    setFormRankingStatus(kw.rankingStatus);
    setFormMonthlySearches(kw.targetMonthlySearches || '');
    setFormNotes(kw.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPrimaryKeyword.trim() || !formMetaTitle.trim()) {
      showNotification('Please fill in at least the Primary Keyword and Meta Title', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const secondaryArray = formSecondaryKeywords
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedItem: SEOKeywordTarget = {
        id: editingKeyword ? editingKeyword.id : `seo-${Date.now()}`,
        pageName: formPageName || 'Page Target',
        pageRoute: formPageRoute.startsWith('/') ? formPageRoute : `/${formPageRoute}`,
        primaryKeyword: formPrimaryKeyword.trim(),
        secondaryKeywords: secondaryArray,
        searchIntent: formSearchIntent,
        targetLocation: formTargetLocation.trim(),
        metaTitle: formMetaTitle.trim(),
        metaDescription: formMetaDescription.trim(),
        priority: formPriority,
        rankingStatus: formRankingStatus,
        targetMonthlySearches: formMonthlySearches.trim() || undefined,
        lastAudited: new Date().toISOString().split('T')[0],
        notes: formNotes.trim() || undefined,
      };

      let newKeywordsList: SEOKeywordTarget[];
      if (editingKeyword) {
        newKeywordsList = keywordsList.map((k) => (k.id === editingKeyword.id ? updatedItem : k));
      } else {
        newKeywordsList = [updatedItem, ...keywordsList];
      }

      const updatedSettings: SiteSettings = {
        ...(settings || ({} as SiteSettings)),
        seoKeywords: newKeywordsList,
      };

      await api.updateSettings({ seoKeywords: newKeywordsList });
      onUpdateSettings(updatedSettings);
      setIsModalOpen(false);
      showNotification(
        editingKeyword
          ? `Updated target keyword "${updatedItem.primaryKeyword}"`
          : `Added new target keyword "${updatedItem.primaryKeyword}"`,
        'success'
      );
    } catch (err) {
      console.error(err);
      showNotification('Failed to save target keyword to database', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKeyword = async (id: string, keywordTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove the target keyword "${keywordTitle}"?`)) {
      return;
    }

    try {
      const newKeywordsList = keywordsList.filter((k) => k.id !== id);
      const updatedSettings: SiteSettings = {
        ...(settings || ({} as SiteSettings)),
        seoKeywords: newKeywordsList,
      };

      await api.updateSettings({ seoKeywords: newKeywordsList });
      onUpdateSettings(updatedSettings);
      showNotification(`Deleted target keyword "${keywordTitle}"`, 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete target keyword', 'error');
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Reset all target keywords to the curated India-wise default keywords set (Kolkata Technology Hub, Power BI India, Data Pipelines, etc.)?'
      )
    ) {
      return;
    }

    try {
      const updatedSettings: SiteSettings = {
        ...(settings || ({} as SiteSettings)),
        seoKeywords: DEFAULT_INDIAN_SEO_KEYWORDS,
      };

      await api.updateSettings({ seoKeywords: DEFAULT_INDIAN_SEO_KEYWORDS });
      onUpdateSettings(updatedSettings);
      showNotification('Reset SEO target keywords to India-wise defaults', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to reset default keywords', 'error');
    }
  };

  const filteredKeywords = keywordsList.filter((k) => {
    const matchesSearch =
      k.primaryKeyword.toLowerCase().includes(searchFilter.toLowerCase()) ||
      k.pageName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      k.pageRoute.toLowerCase().includes(searchFilter.toLowerCase()) ||
      k.targetLocation.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (k.secondaryKeywords &&
        k.secondaryKeywords.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase())));

    const matchesIntent = intentFilter === 'all' || k.searchIntent === intentFilter;
    const matchesPriority = priorityFilter === 'all' || k.priority === priorityFilter;

    return matchesSearch && matchesIntent && matchesPriority;
  });

  const generateRichSchemaPreview = () => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'ProfessionalService', 'LocalBusiness', 'ITService'],
          '@id': 'https://datasource.tech/#organization',
          name: settings?.fullName || 'DataSource Technology & Solutions',
          alternateName: 'DataSource Tech India',
          url: 'https://datasource.tech',
          logo: 'https://datasource.tech/datasource-icon.svg',
          telephone: settings?.phone || '+91 9038417437',
          email: settings?.email || 'rd14190@gmail.com',
          priceRange: '₹₹₹',
          currenciesAccepted: 'INR, USD, EUR, GBP',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '3B13, Flat: 5D, Sanhita Simoco Township, Satuli, Langal Benki, Bhaganpur, Kashipur, Pithapukur, Bhangar, PO&PS: Hatisala Near Hatisala Six Lane, New Town Action 3',
            addressLocality: 'Kolkata',
            addressRegion: 'West Bengal',
            postalCode: '700135',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 22.5292,
            longitude: 88.5085,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:30',
              closes: '18:30',
            },
          ],
          department: (settings?.officeLocations || []).map((loc) => ({
            '@type': 'LocalBusiness',
            name: `${settings?.companyName || 'DataSource'} - ${loc.name}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: loc.address,
              addressLocality: loc.city,
              addressCountry: loc.country === 'India' ? 'IN' : loc.country,
            },
            telephone: loc.phone,
            email: loc.email,
          })),
        },
      ],
    };
  };

  const copySchemaJson = () => {
    navigator.clipboard.writeText(JSON.stringify(generateRichSchemaPreview(), null, 2));
    setCopiedSchema(true);
    showNotification('Copied Local Business JSON-LD Schema to clipboard', 'success');
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Google Search Optimization &amp; SERP Engine
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Target Keyword Manager &amp; Local Schemas
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Configure high-intent search terms for Google to index and recommend your business.
              Simulate Google SERP snippet previews and manage localized Indian structured data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              title="Reset to recommended Indian keywords"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Target Keyword
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Total Targeted Keywords</span>
            <span className="text-2xl font-bold text-white mt-1 block">{keywordsList.length}</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Indexed in JSON-LD
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">High Priority Targets</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {keywordsList.filter((k) => k.priority === 'high').length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Commercial &amp; Transactional</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Local Hubs Schema</span>
            <span className="text-2xl font-bold text-blue-400 mt-1 block">
              {settings?.officeLocations?.length || 6} Cities
            </span>
            <span className="text-[11px] text-slate-400 font-medium">BLR, BOM, CCU, DEL, HYD</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Google Rich Snippets</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">Active</span>
            <span className="text-[11px] text-purple-300 font-medium">LocalBusiness + Service</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'keywords'
              ? 'bg-[#0077FF] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Page Keyword Targets ({keywordsList.length})
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'schema'
              ? 'bg-[#0077FF] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Local Business Schema (JSON-LD)
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'guide'
              ? 'bg-[#0077FF] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Google Ranking Action Guide
        </button>
      </div>

      {/* TAB 1: KEYWORDS MANAGER */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search keywords, routes, locations, or secondary tags..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-lg text-xs border border-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 text-[11px]">Intent:</span>
                <select
                  value={intentFilter}
                  onChange={(e) => setIntentFilter(e.target.value)}
                  className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All Intents</option>
                  <option value="commercial" className="bg-slate-900">Commercial</option>
                  <option value="transactional" className="bg-slate-900">Transactional</option>
                  <option value="informational" className="bg-slate-900">Informational</option>
                  <option value="navigational" className="bg-slate-900">Navigational</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All</option>
                  <option value="high" className="bg-slate-900">High</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="low" className="bg-slate-900">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${
                    previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop SERP Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${
                    previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile SERP Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Keyword Cards List */}
          <div className="space-y-4">
            {filteredKeywords.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">No target keywords match your filter</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Try adjusting your search query or intent filter, or add a new target keyword.
                </p>
              </div>
            ) : (
              filteredKeywords.map((kw) => (
                <div
                  key={kw.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all space-y-4"
                >
                  {/* Row Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start md:items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20">
                        {kw.pageRoute}
                      </span>
                      <h4 className="text-white font-bold text-base">{kw.pageName}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          kw.searchIntent === 'commercial'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : kw.searchIntent === 'transactional'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : kw.searchIntent === 'informational'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {kw.searchIntent} Intent
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          kw.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : kw.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {kw.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(kw.primaryKeyword)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                        title="Search keyword on Google"
                      >
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        Google Test
                      </a>
                      <button
                        onClick={() => openEditModal(kw)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Keyword Settings"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteKeyword(kw.id, kw.primaryKeyword)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Keyword Target"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Primary & Secondary Keywords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block font-medium mb-1">
                        🎯 Primary Focus Search Term:
                      </span>
                      <div className="text-white font-semibold bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                        <span>{kw.primaryKeyword}</span>
                        {kw.targetMonthlySearches && (
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                            Est. {kw.targetMonthlySearches}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>Geo Target: <strong className="text-slate-300">{kw.targetLocation}</strong></span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block font-medium mb-1">
                        🏷️ Secondary &amp; Long-Tail Keywords:
                      </span>
                      <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800 min-h-[40px]">
                        {kw.secondaryKeywords && kw.secondaryKeywords.length > 0 ? (
                          kw.secondaryKeywords.map((sec, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded border border-slate-700/60"
                            >
                              {sec}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 text-[11px]">No secondary tags added</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live Google SERP Snippet Preview Simulator */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Google Search Result Preview ({previewDevice === 'desktop' ? 'Desktop' : 'Mobile'})
                      </span>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className={`font-mono ${kw.metaTitle.length > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          Title: {kw.metaTitle.length}/60
                        </span>
                        <span className={`font-mono ${kw.metaDescription.length > 160 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          Desc: {kw.metaDescription.length}/160
                        </span>
                      </div>
                    </div>

                    {/* Google SERP Simulated Card */}
                    <div className={`bg-white rounded-lg p-3.5 font-sans transition-all ${previewDevice === 'mobile' ? 'max-w-md mx-auto shadow-md' : 'w-full'}`}>
                      {/* URL / Breadcrumb */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-[#0077FF] flex items-center justify-center text-white text-[10px] font-bold">
                          D
                        </div>
                        <div className="text-[12px] text-[#202124] leading-tight">
                          <span className="font-medium">DataSource Technology &amp; Solutions</span>
                          <span className="text-[#5f6368] text-[11px] block">https://datasource.tech{kw.pageRoute}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h5 className="text-[#1a0dab] hover:underline text-[16px] leading-[1.3] font-medium mt-1 cursor-pointer">
                        {kw.metaTitle}
                      </h5>

                      {/* Description */}
                      <p className="text-[#4d5156] text-[13px] leading-[1.4] mt-1 line-clamp-2">
                        {kw.metaDescription}
                      </p>

                      {/* Rich snippets tag in preview */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-3 text-[11px] text-[#0f5132]">
                        <span className="bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                          ★ 4.9 · IT Consulting · Kolkata Tech Hub
                        </span>
                        <span className="text-slate-500">
                          Verified Local Business
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STRUCTURED SCHEMA INSPECTOR */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Live LocalBusiness &amp; Multi-Hub JSON-LD Schema
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  This structured data code is dynamically injected into your website head for Googlebot
                  and Google Maps crawlers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copySchemaJson}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSchema ? 'Copied!' : 'Copy JSON-LD'}
                </button>
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Test in Google Rich Results
                </a>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-96">
              <pre className="text-xs text-emerald-300 font-mono leading-relaxed">
                {JSON.stringify(generateRichSchemaPreview(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTION GUIDE */}
      {activeTab === 'guide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">
              How to Get Google to Recommend Your Website in India &amp; Worldwide
            </h3>
            <p className="text-slate-400 text-sm">
              Follow these verified steps to index your website pages and rank for high-intent search terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">1</span>
                Connect Your Custom Domain
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Assign a custom domain like <code className="text-blue-300">www.datasource.tech</code> or <code className="text-blue-300">www.datasourcetechnology.com</code>. Google ranks custom domains much higher than temporary cloud sandbox URLs.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
                Submit Sitemap to Google Search Console
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Visit <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-blue-400 underline">Google Search Console</a>, add your domain, and submit <code className="text-emerald-300">https://yourdomain.com/sitemap.xml</code> for instant crawl scheduling.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
                Claim Free Google Business Profiles
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Create a verified profile at <a href="https://www.google.com/business/" target="_blank" rel="noreferrer" className="text-amber-400 underline">Google Business Profile</a> for your Kolkata Technology Hub. This activates local Google Maps rankings for searches like <em>"Power BI consultants near me"</em>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">4</span>
                Publish Target-Rich Case Studies
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Use your CMS Admin Case Studies tool to publish detailed project stories mentioning client industries (Fintech, Retail, Logistics, Healthcare) and technology stacks (Power BI, Snowflake, React, AWS).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-white font-bold text-lg">
                  {editingKeyword ? 'Edit Target Keyword' : 'Add Target Search Keyword'}
                </h3>
                <p className="text-slate-400 text-xs">
                  Optimize specific URLs and Google search phrases for maximum organic visibility.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKeyword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Page Name / Purpose
                  </label>
                  <input
                    type="text"
                    value={formPageName}
                    onChange={(e) => setFormPageName(e.target.value)}
                    placeholder="e.g. Power BI & Executive Dashboards"
                    required
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Page URL Route
                  </label>
                  <input
                    type="text"
                    value={formPageRoute}
                    onChange={(e) => setFormPageRoute(e.target.value)}
                    placeholder="e.g. /services/power-bi-executive-dashboards"
                    required
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Focus Keyword (What users search on Google)
                </label>
                <input
                  type="text"
                  value={formPrimaryKeyword}
                  onChange={(e) => setFormPrimaryKeyword(e.target.value)}
                  placeholder="e.g. Power BI Consulting Services India"
                  required
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Secondary &amp; Long-Tail Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formSecondaryKeywords}
                  onChange={(e) => setFormSecondaryKeywords(e.target.value)}
                  placeholder="e.g. Power BI dashboard developers Kolkata, DAX modeling consulting, Executive KPI reporting"
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Search Intent
                  </label>
                  <select
                    value={formSearchIntent}
                    onChange={(e) => setFormSearchIntent(e.target.value as any)}
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="commercial">Commercial (Comparing services)</option>
                    <option value="transactional">Transactional (Ready to hire)</option>
                    <option value="informational">Informational (Learning/Guides)</option>
                    <option value="navigational">Navigational (Brand Search)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Geographic Region
                  </label>
                  <input
                    type="text"
                    value={formTargetLocation}
                    onChange={(e) => setFormTargetLocation(e.target.value)}
                    placeholder="e.g. India & Global / Kolkata"
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Google Meta Title Tag
                  </label>
                  <span className={`text-[11px] font-mono ${formMetaTitle.length > 60 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                    {formMetaTitle.length}/60 chars (Recommended: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={formMetaTitle}
                  onChange={(e) => setFormMetaTitle(e.target.value)}
                  placeholder="e.g. Power BI Consulting & Executive Dashboards India | DataSource"
                  required
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Google Meta Description Tag
                  </label>
                  <span className={`text-[11px] font-mono ${formMetaDescription.length > 160 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                    {formMetaDescription.length}/160 chars (Recommended: 140-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formMetaDescription}
                  onChange={(e) => setFormMetaDescription(e.target.value)}
                  placeholder="Write a clear, compelling summary that includes your primary keywords and calls users to take action..."
                  required
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monthly Search Volume (Est.)
                  </label>
                  <input
                    type="text"
                    value={formMonthlySearches}
                    onChange={(e) => setFormMonthlySearches(e.target.value)}
                    placeholder="e.g. 3,200/mo"
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Internal Strategy Notes
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Focus on enterprise financial clients"
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                  {isSaving ? 'Saving...' : editingKeyword ? 'Update Target Keyword' : 'Save New Target Keyword'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
