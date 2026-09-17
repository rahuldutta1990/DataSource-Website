import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Copy,
  ExternalLink,
  Code2,
  Sparkles,
  Send,
  Save,
  Radio,
  Search,
  ShieldCheck,
  AlertTriangle,
  Layers,
  BarChart3,
  RefreshCw,
  Info,
} from 'lucide-react';
import { SiteSettings } from '../../types.js';
import {
  DEFAULT_GA_MEASUREMENT_ID,
  getActiveMeasurementId,
  setMeasurementId,
  isGoogleTagLoaded,
  trackEvent,
  trackPageView,
  getDiagnosticLogs,
  subscribeDiagnosticLogs,
  AnalyticsDiagnosticLog,
  AnalyticsEvents,
} from '../../utils/analytics.js';

interface GoogleAnalyticsManagerProps {
  settings: SiteSettings | null;
  onUpdateSettings?: (updated: Partial<SiteSettings>) => Promise<void> | void;
  onNotification?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const GoogleAnalyticsManager: React.FC<GoogleAnalyticsManagerProps> = ({
  settings,
  onUpdateSettings,
  onNotification,
}) => {
  const [tagId, setTagId] = useState<string>(
    settings?.googleTagId || DEFAULT_GA_MEASUREMENT_ID
  );
  const [enabled, setEnabled] = useState<boolean>(
    settings?.googleTagEnabled !== undefined ? settings.googleTagEnabled : true
  );
  const [gtmId, setGtmId] = useState<string>(settings?.gtmContainerId || '');
  const [searchConsoleCode, setSearchConsoleCode] = useState<string>(
    settings?.googleSearchConsoleVerification || ''
  );
  const [customHeadScripts, setCustomHeadScripts] = useState<string>(
    settings?.customHeadScripts || ''
  );
  const [customBodyScripts, setCustomBodyScripts] = useState<string>(
    settings?.customBodyScripts || ''
  );

  const [saving, setSaving] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [logs, setLogs] = useState<AnalyticsDiagnosticLog[]>([]);
  const [tagLoaded, setTagLoaded] = useState<boolean>(false);
  
  // Custom event tester inputs
  const [customEventName, setCustomEventName] = useState('enterprise_inquiry_test');
  const [customEventValue, setCustomEventValue] = useState('25000');
  const [customEventCategory, setCustomEventCategory] = useState('Enterprise AI Strategy');

  useEffect(() => {
    if (settings?.googleTagId) {
      setTagId(settings.googleTagId);
    }
    if (settings?.googleTagEnabled !== undefined) {
      setEnabled(settings.googleTagEnabled);
    }
    if (settings?.gtmContainerId) {
      setGtmId(settings.gtmContainerId);
    }
    if (settings?.googleSearchConsoleVerification) {
      setSearchConsoleCode(settings.googleSearchConsoleVerification);
    }
    if (settings?.customHeadScripts) {
      setCustomHeadScripts(settings.customHeadScripts);
    }
    if (settings?.customBodyScripts) {
      setCustomBodyScripts(settings.customBodyScripts);
    }
  }, [settings]);

  useEffect(() => {
    setTagLoaded(isGoogleTagLoaded());
    setLogs(getDiagnosticLogs());

    const unsubscribe = subscribeDiagnosticLogs((newLogs) => {
      setLogs(newLogs);
      setTagLoaded(isGoogleTagLoaded());
    });

    const interval = setInterval(() => {
      setTagLoaded(isGoogleTagLoaded());
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const activeId = tagId.trim() || DEFAULT_GA_MEASUREMENT_ID;

  const generatedScriptSnippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${activeId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${activeId}');
</script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedScriptSnippet);
    setCopiedScript(true);
    if (onNotification) onNotification('success', 'Google tag snippet copied to clipboard');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(activeId);
    setCopiedId(true);
    if (onNotification) onNotification('success', `Measurement ID ${activeId} copied`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const updatedPayload: Partial<SiteSettings> = {
        googleTagId: tagId.trim(),
        googleTagEnabled: enabled,
        gtmContainerId: gtmId.trim(),
        googleSearchConsoleVerification: searchConsoleCode.trim(),
        customHeadScripts: customHeadScripts,
        customBodyScripts: customBodyScripts,
        analyticsIdPlaceholder: tagId.trim(),
      };

      if (onUpdateSettings) {
        await onUpdateSettings(updatedPayload);
      }

      // Activate immediately in current runtime
      setMeasurementId(tagId.trim());

      if (onNotification) {
        onNotification('success', `Google Analytics & Tag settings saved successfully (ID: ${tagId.trim()})`);
      }
    } catch (err: any) {
      if (onNotification) {
        onNotification('error', `Failed to save Google Tag settings: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFireTestEvent = (eventName: string, params: Record<string, any>) => {
    trackEvent(eventName, params);
    if (onNotification) {
      onNotification('info', `Dispatched "${eventName}" event to Google tag (${activeId})`);
    }
  };

  const handleFireCustomEvent = () => {
    if (!customEventName.trim()) return;
    trackEvent(customEventName.trim(), {
      value: Number(customEventValue) || 0,
      currency: 'USD',
      category: customEventCategory,
      source: 'admin_diagnostic_tester',
      timestamp: new Date().toISOString(),
    });
    if (onNotification) {
      onNotification('success', `Dispatched custom event "${customEventName.trim()}"`);
    }
  };

  const handleFirePageViewTest = () => {
    trackPageView('/insights/retrieval-augmented-generation-architecture', 'RAG Architecture Whitepaper | DataSource');
    if (onNotification) {
      onNotification('info', 'Fired simulated test page_view to GA4');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0077FF]/10 border border-[#0077FF]/30 flex items-center justify-center text-[#0077FF]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Google Tag &amp; GA4 Analytics Suite
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Tag
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Manage your Google tag (<code className="text-cyan-400 font-mono">gtag.js</code>), GA4 Measurement ID, Google Tag Manager, custom tracking pixels, and verify live hit dispatches across all application routes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors shadow-sm"
            >
              <span>Open GA4 Realtime</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0077FF] hover:bg-[#0060DF] text-white transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

        {/* Quick Diagnostics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Measurement ID</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm font-bold text-cyan-400">{activeId}</span>
                <button
                  onClick={handleCopyId}
                  title="Copy ID"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <Activity className="w-5 h-5 text-cyan-400 opacity-60" />
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Runtime Window Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${tagLoaded ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white">
                  {tagLoaded ? 'dataLayer & gtag Ready' : 'Initializing Script'}
                </span>
              </div>
            </div>
            <Radio className={`w-5 h-5 ${tagLoaded ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Session Hits Logged</p>
              <p className="text-lg font-bold text-white mt-0.5">{logs.length} events</p>
            </div>
            <Layers className="w-5 h-5 text-blue-400 opacity-60" />
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tracking Status</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 mt-1 rounded ${
                enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {enabled ? 'Enabled (Active)' : 'Disabled'}
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400 opacity-60" />
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration & Embedded Script */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tag Configuration Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0077FF]" />
              Google Tag &amp; Measurement ID Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Google Tag ID / GA4 Measurement ID <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tagId}
                    onChange={(e) => setTagId(e.target.value)}
                    placeholder="G-TMDMCRC1C7"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF] focus:ring-1 focus:ring-[#0077FF]"
                  />
                  <div className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                    Format: G-XXXXXXXXXX
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default: <span className="font-mono text-cyan-400">G-TMDMCRC1C7</span>. Stored in Firestore and automatically applied to all visitor sessions.
                </p>
              </div>

              {/* Enable / Disable Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-white">Enable Google Tag &amp; Analytics Tracking</p>
                  <p className="text-[11px] text-slate-400">
                    When active, page views and conversion events are automatically sent to Google Analytics.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0077FF]"></div>
                </label>
              </div>

              {/* Google Tag Manager Container ID */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Google Tag Manager (GTM) Container ID <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF]"
                />
              </div>

              {/* Google Search Console Verification Meta */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Google Search Console Verification Token <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={searchConsoleCode}
                  onChange={(e) => setSearchConsoleCode(e.target.value)}
                  placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF]"
                />
              </div>

              {/* Custom Header Code */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Custom &lt;head&gt; Tracking Scripts (e.g., LinkedIn Insight Tag, Meta Pixel)
                </label>
                <textarea
                  rows={3}
                  value={customHeadScripts}
                  onChange={(e) => setCustomHeadScripts(e.target.value)}
                  placeholder="<!-- Additional Header Tracking Scripts -->"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0077FF] hover:bg-[#0060DF] text-white transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save & Apply Google Tag Settings'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Script Snippet Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Active Google Tag Snippet (<code className="text-xs text-cyan-400">gtag.js</code>)
              </h2>
              <button
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                {copiedScript ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              This script is loaded inside the global <code className="text-slate-300 font-mono">&lt;head&gt;</code> of your web application:
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
              <pre>{generatedScriptSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Trigger Tester & Diagnostic Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Real-time Event Dispatch Tester */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Live GA4 Hit &amp; Conversion Dispatcher
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Click any conversion below to instantly fire a real Google Analytics event and verify it appears in your GA4 Realtime dashboard.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleFirePageViewTest}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    📄 Fire <code className="text-cyan-400 font-mono font-bold">page_view</code> Hit
                  </p>
                  <p className="text-[10px] text-slate-400">Simulate reading RAG Architecture Research Paper</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  Trigger
                </span>
              </button>

              <button
                onClick={() =>
                  handleFireTestEvent(AnalyticsEvents.LEAD_SUBMITTED, {
                    service_category: 'Custom Model Engineering',
                    budget_tier: '$50,000 - $100,000',
                    conversion_point: 'Admin Live Tester',
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    🎯 Fire <code className="text-emerald-400 font-mono font-bold">generate_lead</code> Conversion
                  </p>
                  <p className="text-[10px] text-slate-400">Enterprise AI Architectural Consultation inquiry</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  Trigger
                </span>
              </button>

              <button
                onClick={() =>
                  handleFireTestEvent(AnalyticsEvents.NEWSLETTER_SUBSCRIBED, {
                    interest: 'Autonomous Agents',
                    source: 'insights_article_footer',
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                    ✉️ Fire <code className="text-purple-400 font-mono font-bold">newsletter_subscribed</code>
                  </p>
                  <p className="text-[10px] text-slate-400">Engineering newsletter subscription</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
                  Trigger
                </span>
              </button>

              <button
                onClick={() =>
                  handleFireTestEvent(AnalyticsEvents.INSIGHT_LIKED, {
                    insight_slug: 'retrieval-augmented-generation-architecture',
                    category: 'Architecture',
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-rose-400 transition-colors">
                    ❤️ Fire <code className="text-rose-400 font-mono font-bold">insight_liked</code>
                  </p>
                  <p className="text-[10px] text-slate-400">Reader appreciation / applause interaction</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                  Trigger
                </span>
              </button>
            </div>

            {/* Custom Event Builder */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-300 mb-2">Custom Event Builder</p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customEventName}
                  onChange={(e) => setCustomEventName(e.target.value)}
                  placeholder="event_name (e.g., custom_cta_click)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customEventCategory}
                    onChange={(e) => setCustomEventCategory(e.target.value)}
                    placeholder="category"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF]"
                  />
                  <input
                    type="number"
                    value={customEventValue}
                    onChange={(e) => setCustomEventValue(e.target.value)}
                    placeholder="value (e.g. 25000)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0077FF]"
                  />
                </div>
                <button
                  onClick={handleFireCustomEvent}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Custom Event to dataLayer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Log Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Session Diagnostic Stream
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                {logs.length} logged
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No hits logged in this browser tab yet. Click a trigger above to fire one!
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-[11px] truncate max-w-[200px]">
                        {log.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            log.status === 'dispatched'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                    {log.params && Object.keys(log.params).length > 0 && (
                      <div className="text-[10px] text-slate-400 font-mono bg-slate-900/90 p-1.5 rounded overflow-x-auto">
                        {JSON.stringify(log.params)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. GA4 Verification Guide & Pre-Configured Event Dictionary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-md">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#0077FF]" />
          Pre-Configured Conversion Events in DataSource Application
        </h2>
        <p className="text-xs text-slate-400 mb-6 max-w-3xl">
          The following standard GA4 events are wired into the application's React components and automatically dispatch rich metadata when users interact with the site:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-bold text-emerald-400">lead_inquiry_submitted</code>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                Conversion
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fires when a prospective client submits a consultation or project brief through the Contact page.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-bold text-purple-400">newsletter_subscribed</code>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-semibold">
                Lead
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fires when an engineer or executive subscribes to the AI Studio research briefing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-bold text-cyan-400">page_view</code>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-semibold">
                Automatic
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fires on every SPA route transition (Home, About, Services, Case Studies, Insights, Contact).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-bold text-rose-400">insight_liked</code>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-semibold">
                Engagement
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fires when a reader applauds or likes an architecture research article.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-bold text-amber-400">insight_shared</code>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-semibold">
                Viral
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fires when a user shares an article to LinkedIn, Twitter/X, or copies the permalink.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-bold text-blue-400">consultation_button_clicked</code>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-semibold">
                Intent
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fires when a user clicks the "Schedule Strategy Session" or "Talk to an Architect" CTA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
