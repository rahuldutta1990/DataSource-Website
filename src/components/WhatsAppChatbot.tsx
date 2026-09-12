import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  QrCode,
  CheckCheck,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { SiteSettings } from '../types.js';

/**
 * Authentic Official WhatsApp Brand SVG Icon
 */
export const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.004 2c-5.518 0-9.998 4.477-9.998 9.996 0 1.761.459 3.473 1.332 4.986L2 22l5.178-1.328a9.96 9.96 0 0 0 4.826 1.324h.004c5.518 0 9.998-4.477 9.998-9.996 0-2.671-1.04-5.182-2.928-7.071A9.94 9.94 0 0 0 12.004 2zm0 18.307h-.003a8.31 8.31 0 0 1-4.237-1.157l-.304-.18-3.149.808.84-3.07-.198-.316A8.28 8.28 0 0 1 3.697 12c0-4.58 3.727-8.307 8.307-8.307 2.22 0 4.307.864 5.877 2.434a8.26 8.26 0 0 1 2.433 5.873c0 4.58-3.727 8.307-8.31 8.307zm4.555-6.223c-.249-.125-1.478-.73-1.708-.813-.23-.083-.397-.125-.564.125-.167.249-.646.813-.792.98-.146.166-.292.187-.542.062s-1.054-.389-2.008-1.24c-.742-.662-1.243-1.48-1.389-1.73-.146-.25-.016-.385.109-.509.112-.112.249-.291.374-.437.125-.145.166-.249.25-.416.083-.166.041-.312-.021-.437-.063-.125-.564-1.36-.772-1.862-.203-.49-.41-.423-.564-.431l-.481-.008c-.166 0-.437.062-.666.312-.23.25-.875.855-.875 2.085s.896 2.418 1.021 2.585c.125.166 1.764 2.693 4.273 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.577.101.48-.071 1.478-.604 1.687-1.187.208-.584.208-1.084.146-1.188-.063-.104-.229-.166-.479-.291z" />
  </svg>
);

export function cleanWhatsAppDigits(rawNumber?: string): string {
  if (!rawNumber) return '919038417437';
  const digits = rawNumber.replace(/\D/g, '');
  if (!digits) return '919038417437';
  // If 10 digits (like 9038417437), prepend India country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickAction?: string;
  suggestedPrompt?: string;
}

const QUICK_TOPICS = [
  {
    id: 'consultation',
    label: '📅 Book Architecture Consultation',
    message: 'Hi DataSource team! I would like to schedule a technical architecture consultation to discuss our upcoming project.',
    response: 'Excellent! Our principal architects conduct complimentary 45-minute technical discovery sessions. We can explore your system constraints, target timelines, and potential architecture options. Click below to continue directly to WhatsApp and choose your preferred time slot!'
  },
  {
    id: 'powerbi',
    label: '📊 Power BI & Executive Dashboards',
    message: 'Hello, I am interested in building automated Power BI executive dashboards and centralized reporting for my business.',
    response: 'We specialize in end-to-end BI solutions—from data warehousing to custom DAX metrics and automated refreshes. Would you like to review sample dashboards or discuss your data sources?'
  },
  {
    id: 'custom_web',
    label: '💻 Custom Web & Cloud Engineering',
    message: 'Hi, we are looking for a development partner to build a high-performance custom web application / cloud portal.',
    response: 'Our engineering team designs and delivers enterprise-grade TypeScript/React and cloud-native applications. Let us know what features or integrations you are planning!'
  },
  {
    id: 'pipelines',
    label: '⚡ Data Pipelines & ETL Automation',
    message: 'Hi! We need help modernizing our data pipelines, data lakehouse, and automating data synchronization.',
    response: 'We construct resilient ETL/ELT pipelines with automated validation, zero-downtime migrations, and cloud integration across AWS, GCP, and Azure.'
  },
  {
    id: 'quote',
    label: '💰 Request Estimate & Scope Overview',
    message: 'Hello! I have a project in mind and would like to get a ballpark budget and timeline estimate.',
    response: 'We provide transparent, fixed-scope or milestone-based scoping. Share your high-level requirements on WhatsApp and we will outline an initial timeline and estimate!'
  }
];

export const WhatsAppChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default fallback WhatsApp Phone Number
  // Default cleaned phone digits for WhatsApp wa.me link
  const rawPhone = settings?.whatsappNumber || '+91 9038417437';
  const whatsappDigits = cleanWhatsAppDigits(settings?.whatsappNumber || '919038417437');
  const consultantName = settings?.whatsappConsultantName || 'DataSource Solutions Architect';
  const welcomeGreeting = settings?.whatsappGreeting || '👋 Hi there! Welcome to DataSource Technology & Solutions. How can our technical architects assist you today?';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome-1',
      sender: 'bot',
      text: welcomeGreeting,
      timestamp: 'Just now'
    },
    {
      id: 'msg-welcome-2',
      sender: 'bot',
      text: 'Select a quick topic below or type your project requirement to connect instantly on WhatsApp:',
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    let mounted = true;
    api.getSettings().then((s) => {
      if (mounted && s) {
        setSettings(s);
        if (s.whatsappGreeting) {
          setMessages((prev) => [
            {
              id: 'msg-welcome-1',
              sender: 'bot',
              text: s.whatsappGreeting || welcomeGreeting,
              timestamp: 'Just now'
            },
            prev[1]
          ]);
        }
      }
    }).catch((err) => {
      console.warn('Could not load WhatsApp settings:', err);
    });

    // Show initial teaser popup after 3.5 seconds on first visit
    const teaserTimer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('ds_whatsapp_teaser_dismissed');
      if (!dismissed) {
        setShowTeaser(true);
      }
    }, 3500);

    return () => {
      mounted = false;
      clearTimeout(teaserTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      sessionStorage.setItem('ds_whatsapp_teaser_dismissed', 'true');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('datasource:close-gemini'));
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const handleCloseWhatsApp = () => setIsOpen(false);
    window.addEventListener('datasource:close-whatsapp', handleCloseWhatsApp);
    return () => window.removeEventListener('datasource:close-whatsapp', handleCloseWhatsApp);
  }, []);

  const handleDismissTeaser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTeaser(false);
    sessionStorage.setItem('ds_whatsapp_teaser_dismissed', 'true');
  };

  const generateWhatsAppUrl = (customText?: string) => {
    const textToSend = customText || inputValue || 'Hello DataSource! I would like to inquire about your technology and data consulting services.';
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(textToSend)}`;
  };

  const handleOpenWhatsApp = (customText?: string) => {
    const url = generateWhatsAppUrl(customText);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectTopic = (topic: typeof QUICK_TOPICS[0]) => {
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: topic.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: topic.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompt: topic.message
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Thanks for your inquiry! Our technical consultants are ready to discuss "${userText}". Tap below to open our live WhatsApp chat thread with your message already pre-filled.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompt: userText
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const handleCopyLink = () => {
    const url = generateWhatsAppUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-1',
        sender: 'bot',
        text: welcomeGreeting,
        timestamp: 'Just now'
      },
      {
        id: 'msg-welcome-2',
        sender: 'bot',
        text: 'Select a quick topic below or type your project requirement to connect instantly on WhatsApp:',
        timestamp: 'Just now'
      }
    ]);
  };

  // If explicitly disabled in settings
  if (settings && settings.whatsappEnabled === false) {
    return null;
  }

  return (
    <>
      {/* Floating Action Trigger in Bottom Right */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto">
        {/* Animated Teaser Bubble */}
        {!isOpen && showTeaser && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-3 max-w-xs bg-white dark:bg-[#0E1B2C] text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-start gap-3 cursor-pointer hover:scale-[1.02] transition-all animate-bounce"
            style={{ animationDuration: '3s' }}
            role="button"
            tabIndex={0}
            aria-label="Open WhatsApp Chat"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Chat on WhatsApp</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-snug">
                Have a data or software problem? Speak with a consultant directly at +91 9038417437.
              </p>
            </div>
            <button
              onClick={handleDismissTeaser}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Floating WhatsApp Button with Original WhatsApp Brand Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 active:scale-95 ${
            isOpen
              ? 'bg-slate-900 dark:bg-slate-800 text-white rotate-90'
              : 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:scale-105 shadow-emerald-600/50'
          }`}
          aria-label={isOpen ? 'Close WhatsApp Chat' : 'Open WhatsApp Chat'}
          title="Chat with DataSource on WhatsApp (+91 9038417437)"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              {/* Pulsing ring */}
              <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
              <WhatsAppIcon className="w-8 h-8 text-white drop-shadow-sm" />
              {/* Online Indicator Badge */}
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-300 border-2 border-white dark:border-slate-900 rounded-full" />
            </>
          )}
        </button>
      </div>

      {/* WhatsApp Chatbot Window */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] h-[560px] max-h-[82vh] bg-white dark:bg-[#0C1523] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          role="dialog"
          aria-label="DataSource WhatsApp Chatbot Assistant"
        >
          {/* Header */}
          <div className="bg-[#075E54] dark:bg-[#0A4840] text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-heading font-extrabold text-xs tracking-wider">
                    DS
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white font-heading">
                    {consultantName}
                  </h3>
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white text-[#075E54] text-[9px] font-black" title="Verified Business">
                    ✓
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online • Instant WhatsApp Response</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/90">
              <button
                onClick={() => setShowQrModal(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Scan QR Code to open on Mobile"
                aria-label="Scan QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Restart Chat Conversation"
                aria-label="Restart Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Notice */}
          <div className="bg-[#128C7E]/10 dark:bg-emerald-950/30 px-3.5 py-1.5 border-b border-emerald-500/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Official Business WhatsApp: <strong className="text-slate-900 dark:text-white">{rawPhone}</strong></span>
            </span>
          </div>

          {/* Message Thread Body (WhatsApp Styled) */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-[#E5DDD5]/20 dark:bg-[#070D18]/80">
            {/* Encryption notice */}
            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-medium border border-amber-200/60 dark:border-amber-900/40 shadow-xs flex items-center gap-1">
                🔒 Direct channel to DataSource engineering &amp; consulting team.
              </span>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#D9FDD3] dark:bg-[#005C4B] text-slate-900 dark:text-emerald-50 rounded-tr-xs'
                      : 'bg-white dark:bg-[#182232] text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3 h-3 text-[#34B7F1]" />
                    )}
                  </div>
                </div>

                {/* Direct Action Link if bot provided a suggested prompt */}
                {msg.suggestedPrompt && (
                  <div className="mt-2 w-full max-w-[86%]">
                    <button
                      onClick={() => handleOpenWhatsApp(msg.suggestedPrompt)}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span>Continue to WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#182232] px-3.5 py-2 rounded-2xl rounded-tl-xs w-16 border border-slate-200/60 dark:border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {/* Quick Topic Chips */}
            <div className="pt-2 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                Suggested Topics
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className="text-left text-xs bg-white/90 dark:bg-[#131E2E] hover:bg-emerald-50 dark:hover:bg-[#1C2C42] text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="font-medium truncate mr-2">{topic.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Bar & Direct WhatsApp Button */}
          <div className="p-3 bg-white dark:bg-[#0C1523] border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
            {/* Custom Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message or project goal..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#152132] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-40 text-white shadow transition-transform active:scale-95"
                title="Send and generate WhatsApp link"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Open WhatsApp Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleOpenWhatsApp()}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:brightness-105 active:scale-98"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Open Direct WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#152132] hover:bg-slate-200 dark:hover:bg-[#1C2C42] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy WhatsApp Chat Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop QR Code Scan Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close QR Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Scan with Mobile WhatsApp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Point your phone camera to start a live conversation immediately.
              </p>
            </div>

            {/* Generated SVG QR Code representation */}
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generateWhatsAppUrl())}&color=075E54`}
                alt="Scan to Chat on WhatsApp"
                className="w-44 h-44 mx-auto rounded-lg"
                loading="lazy"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-600 dark:text-slate-300 font-bold">
                WhatsApp: {rawPhone}
              </p>
              <button
                onClick={() => handleOpenWhatsApp()}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Open in Web WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
