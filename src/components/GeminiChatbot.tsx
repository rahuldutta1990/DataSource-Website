import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Layers,
  Database,
  Zap,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../services/api.js';
import { WhatsAppIcon, cleanWhatsAppDigits } from './WhatsAppChatbot.js';

/**
 * Authentic Official Google Gemini Sparkle Star SVG Icon
 */
export const GeminiSparkleIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size,
}) => (
  <svg
    viewBox="0 0 28 28"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="geminiSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4E95FF" />
        <stop offset="40%" stopColor="#9B72CF" />
        <stop offset="75%" stopColor="#E26D82" />
        <stop offset="100%" stopColor="#FF8B5B" />
      </linearGradient>
    </defs>
    <path
      d="M14 0C14 7.732 7.732 14 0 14C7.732 14 14 20.268 14 28C14 20.268 20.268 14 28 14C20.268 14 14 7.732 14 0Z"
      fill="url(#geminiSparkleGrad)"
    />
  </svg>
);

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

type RoleMode = 'architect' | 'data' | 'fast_estimator';
type ModelSelection = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

const ROLE_PRESETS = [
  {
    id: 'architect' as RoleMode,
    label: 'Solutions Architect',
    description: 'System design, microservices, cloud migration & high-scale strategy',
    icon: Layers,
    recommendedModel: 'gemini-3.5-flash' as ModelSelection,
    defaultPrompt: 'What is the recommended cloud architecture for an enterprise web application expecting 100k daily users?',
  },
  {
    id: 'data' as RoleMode,
    label: 'Data & BI Strategist',
    description: 'Data warehouses, Power BI optimization & real-time ETL pipelines',
    icon: Database,
    recommendedModel: 'gemini-3.5-flash' as ModelSelection,
    defaultPrompt: 'How can we structure our Power BI semantic models for sub-second DAX query performance?',
  },
  {
    id: 'fast_estimator' as RoleMode,
    label: 'Fast Scoper & Estimator',
    description: 'Quick timelines, tech stack recommendations & phased roadmaps',
    icon: Zap,
    recommendedModel: 'gemini-3.1-flash-lite' as ModelSelection,
    defaultPrompt: 'Estimate development phases and typical team composition for an MVP customer analytics dashboard.',
  },
];

const STARTER_PROMPTS = [
  'What are the key architectural steps for migrating monolithic apps to AWS or GCP?',
  'How does DataSource handle Power BI dashboard performance audits and DAX tuning?',
  'Recommend modern data warehouse architectures: Snowflake vs BigQuery vs Databricks.',
  'What security and governance patterns should we adopt for enterprise LLM integration?',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'init-0',
  role: 'model',
  content: `👋 **Welcome to DataSource AI Solutions Assistant!**

I am your Principal AI & Cloud Solutions Architect powered by **Google Gemini**. I can help you evaluate technical architectures, plan data engineering roadmaps, scope custom web applications, or answer enterprise modernization questions.

How can I assist your engineering and product goals today?`,
  timestamp: 'Just now',
  modelUsed: 'gemini-3.5-flash',
};

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('datasource_gemini_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [INITIAL_GREETING];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleMode>('architect');
  const [selectedModel, setSelectedModel] = useState<ModelSelection>('gemini-3.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('datasource_gemini_chat', JSON.stringify(messages));
    } catch (e) {
      console.warn('Unable to persist chat history:', e);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setShowTeaser(false);
      // Close WhatsApp if open to prevent overlap
      window.dispatchEvent(new CustomEvent('datasource:close-whatsapp'));
    }
  }, [isOpen]);

  // Listen for external close events
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('datasource:close-gemini', handleClose);
    return () => window.removeEventListener('datasource:close-gemini', handleClose);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare payload for multi-turn server route
      // Extract clean history array for Gemini API
      const historyPayload = newHistory
        .filter((m) => m.content && m.content.trim())
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await api.sendGeminiChat({
        messages: historyPayload,
        model: selectedModel,
        roleMode: selectedRole,
      });

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.modelUsed,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Unable to complete response:** ${err.message || 'Please check your connection and try again.'}\n\nYou can also connect directly with our principal engineering team on WhatsApp at **+91 9038417437**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
    localStorage.removeItem('datasource_gemini_chat');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatWhatsAppConsultationUrl = (snippet: string) => {
    const text = `Hi DataSource Team, I was discussing architecture options with the Gemini AI Assistant on your website:
━━━━━━━━━━━━━━━━━━━━━
"${snippet.slice(0, 300)}..."
━━━━━━━━━━━━━━━━━━━━━
I'd like to schedule an in-depth technical consultation with a senior architect.`;
    return `https://wa.me/919038417437?text=${encodeURIComponent(text)}`;
  };

  const renderSimpleMarkdown = (content: string) => {
    // Basic formatting for lines: bold, headers, bullet points, and code blocks
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Headers
          if (line.startsWith('### ')) {
            return (
              <h5 key={idx} className="font-bold text-slate-900 dark:text-white pt-1 text-xs sm:text-sm">
                {line.replace('### ', '')}
              </h5>
            );
          }
          if (line.startsWith('## ') || line.startsWith('# ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 dark:text-white pt-1.5 text-sm sm:text-base border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                {line.replace(/^#+\s/, '')}
              </h4>
            );
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
            const clean = line.replace(/^[-*•]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#0077FF] dark:text-[#38BDF8] font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(clean) }} />
              </div>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(line)) {
            const num = line.match(/^(\d+)\.\s/)?.[1];
            const clean = line.replace(/^\d+\.\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-bold text-slate-500 dark:text-slate-400 min-w-[16px]">{num}.</span>
                <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(clean) }} />
              </div>
            );
          }

          // Regular paragraph with inline markdown
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }} />
          );
        })}
      </div>
    );
  };

  const parseInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-[11px] text-[#0077FF] dark:text-cyan-300 font-semibold">$1</code>');
  };

  return (
    <>
      {/* Floating Launcher Button positioned vertically above WhatsApp icon */}
      <div className="fixed bottom-[84px] sm:bottom-[88px] right-5 z-40 flex flex-col items-end pointer-events-auto">
        {/* Animated Teaser Bubble */}
        {!isOpen && showTeaser && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-3 max-w-xs bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-2xl border border-indigo-500/30 flex items-start gap-3 cursor-pointer hover:scale-[1.02] transition-all animate-bounce"
            style={{ animationDuration: '3.5s' }}
            role="button"
            tabIndex={0}
            aria-label="Open Gemini AI Architect"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/30">
              <GeminiSparkleIcon className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Ask Gemini AI Architect</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-snug">
                Ask about cloud stacks, Power BI performance, or tech scoping.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Floating Gemini AI Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 active:scale-95 ${
            isOpen
              ? 'bg-slate-900 dark:bg-slate-800 text-white rotate-90 border border-slate-700'
              : 'bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E1B4B] hover:from-[#312E81] hover:to-[#1E293B] text-white hover:scale-105 border border-indigo-500/40 shadow-indigo-500/25'
          }`}
          aria-label={isOpen ? 'Close Gemini AI Assistant' : 'Open Gemini AI Assistant'}
          title="Ask DataSource Gemini AI Solutions Architect"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              {/* Outer shimmering halo */}
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-sm pointer-events-none group-hover:opacity-100 transition-opacity" />
              <GeminiSparkleIcon className="w-7 h-7 drop-shadow-md group-hover:scale-110 transition-transform" />
              {/* Gemini status pill badge */}
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-[9px] font-extrabold text-white px-1.5 py-0.2 rounded-full border border-slate-900 uppercase tracking-tighter">
                AI
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[440px] max-w-[460px] h-[580px] max-h-[85vh] bg-white dark:bg-[#0D1524] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0B1528] via-[#151D36] to-[#1B173B] text-white flex items-center justify-between border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                <GeminiSparkleIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm font-heading flex items-center gap-1.5">
                    <span>DataSource Gemini Architect</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">
                    {selectedModel.replace('gemini-', '')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Role: {ROLE_PRESETS.find((r) => r.id === selectedRole)?.label}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-colors ${
                  showSettings ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Configure Role & Model"
                aria-label="Settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={handleClearChat}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Reset conversation"
                aria-label="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings & Role Mode Dropdown Panel */}
          {showSettings && (
            <div className="p-3.5 bg-slate-50 dark:bg-[#121D30] border-b border-slate-200 dark:border-slate-800 text-xs space-y-3 shrink-0 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Specialized AI Role:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROLE_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedRole === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedRole(preset.id);
                          setSelectedModel(preset.recommendedModel);
                        }}
                        className={`p-2 rounded-xl text-left flex flex-col items-start gap-1 transition-all border ${
                          isSelected
                            ? 'bg-[#0077FF]/10 dark:bg-blue-950/60 border-[#0077FF] text-[#0077FF] dark:text-[#38BDF8] font-bold'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] leading-tight truncate w-full">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Gemini Model Tier:
                </label>
                <div className="grid grid-cols-3 gap-1.5 font-mono">
                  <button
                    onClick={() => setSelectedModel('gemini-3.5-flash')}
                    className={`py-1.5 px-2 rounded-lg text-center text-[10px] border transition-colors ${
                      selectedModel === 'gemini-3.5-flash'
                        ? 'bg-purple-600 text-white border-purple-500 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    3.5-flash (Balanced)
                  </button>

                  <button
                    onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                    className={`py-1.5 px-2 rounded-lg text-center text-[10px] border transition-colors ${
                      selectedModel === 'gemini-3.1-flash-lite'
                        ? 'bg-purple-600 text-white border-purple-500 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    3.1-flash-lite (Fast)
                  </button>

                  <button
                    onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                    className={`py-1.5 px-2 rounded-lg text-center text-[10px] border transition-colors ${
                      selectedModel === 'gemini-3.1-pro-preview'
                        ? 'bg-purple-600 text-white border-purple-500 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    3.1-pro (Deep STEM)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#0A101C]/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      isUser
                        ? 'bg-[#0077FF] text-white'
                        : 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-sm'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <GeminiSparkleIcon className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[85%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-sm ${
                        isUser
                          ? 'bg-[#0077FF] text-white rounded-tr-none font-medium text-xs sm:text-sm'
                          : 'bg-white dark:bg-[#131D30] text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        renderSimpleMarkdown(msg.content)
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span className="font-mono text-[9px] bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.2 rounded text-slate-500 dark:text-slate-400">
                          {msg.modelUsed}
                        </span>
                      )}

                      {!isUser && (
                        <>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <a
                            href={formatWhatsAppConsultationUrl(msg.content)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-500 transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold"
                            title="Send discussion to WhatsApp"
                          >
                            <WhatsAppIcon className="w-3 h-3" />
                            <span>Discuss on WhatsApp</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <GeminiSparkleIcon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-[#131D30] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Gemini is evaluating architecture...
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompt Chips */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white dark:bg-[#0E1726] border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap shrink-0 text-[11px]">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors text-left truncate max-w-[220px]"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-[#0D1524] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-[#141F33] rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-[#0077FF] transition-colors">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${ROLE_PRESETS.find((r) => r.id === selectedRole)?.label}... (Enter to send)`}
                rows={1}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none resize-none max-h-24 py-1 px-1"
                disabled={loading}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className={`p-2.5 rounded-xl font-bold text-white transition-all shrink-0 ${
                  inputMessage.trim() && !loading
                    ? 'bg-gradient-to-r from-[#0077FF] via-indigo-600 to-purple-600 hover:scale-105 shadow-md'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
