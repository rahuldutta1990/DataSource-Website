import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon, cleanWhatsAppDigits } from './WhatsAppChatbot.js';

export interface InquirySuccessData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  projectType?: string;
  budgetRange?: string;
  message?: string;
  referenceId?: string;
  submittedAt?: string;
}

interface InquirySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InquirySuccessData | null;
  targetWhatsAppPhone?: string;
}

export const InquirySuccessModal: React.FC<InquirySuccessModalProps> = ({
  isOpen,
  onClose,
  data,
  targetWhatsAppPhone = '+91 97750 09477',
}) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!data) return null;

  const refId = data.referenceId || `DST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const generateWhatsAppUrl = () => {
    const cleanNumber = cleanWhatsAppDigits(targetWhatsAppPhone);
    const text = `*New Enterprise Consultation Inquiry*\n\n*Reference:* ${refId}\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Phone:* ${data.phone || 'N/A'}\n*Company:* ${data.company || 'N/A'}\n*Practice / Service:* ${data.serviceInterest || 'General Inquiry'}\n*Project Type:* ${data.projectType || 'General'}\n*Budget:* ${data.budgetRange || 'Flexible'}\n\n*Message:* ${data.message || 'Consultation requested'}\n\n_Sent via DataSource Technology AI Studio_`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleCopy = () => {
    const text = `DataSource Technology AI Studio — Consultation Inquiry Confirmation
Reference ID: ${refId}
Client: ${data.name} (${data.email}${data.phone ? ` / ${data.phone}` : ''})
Company: ${data.company || 'N/A'}
Service: ${data.serviceInterest || 'Custom AI Engineering'}
Project Type: ${data.projectType || 'Architecture Scoping'}
Budget Range: ${data.budgetRange || 'Flexible'}
Message: ${data.message || 'N/A'}
Timestamp: ${data.submittedAt || new Date().toLocaleString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            className="relative w-full max-w-xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-left"
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#0077FF] via-[#00D4FF] to-emerald-400" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close confirmation modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              {/* Header with animated icon */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1 pr-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Inquiry Logged &amp; Dispatched</span>
                  </div>
                  <h2
                    id="inquiry-modal-title"
                    className="text-xl sm:text-2xl font-extrabold text-[#0B1B2B] dark:text-white font-heading"
                  >
                    Consultation Request Confirmed
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body leading-relaxed">
                    Thank you, <strong className="text-slate-900 dark:text-white">{data.name}</strong>. Your project scope has been received and routed to our principal engineering team.
                  </p>
                </div>
              </div>

              {/* Reference ID and Dispatch Route Pills */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tracking Reference:
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#0077FF] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/60">
                      {refId}
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0077FF] dark:hover:text-cyan-400 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Reference'}</span>
                  </button>
                </div>

                {/* Dispatch routing indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-[#0077FF] shrink-0" />
                    <span className="truncate">
                      Dispatched to: <strong className="text-slate-900 dark:text-slate-100 font-mono">rd14190@gmail.com</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Avg. Response: <strong>2 – 4 Business Hours</strong></span>
                  </div>
                </div>
              </div>

              {/* Inquiry Summary Snapshot */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Summary of Submitted Requirements:
                </p>
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Practice / Service</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {data.serviceInterest || 'Custom AI Engineering'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Project Engagement</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {data.projectType || 'Architecture Scoping'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Budget Scope</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {data.budgetRange || 'Flexible'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Client Contact</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {data.email} {data.phone ? `• ${data.phone}` : ''}
                      </span>
                    </div>
                  </div>

                  {data.message && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400 block text-[11px] mb-1">Requirement Notes</span>
                      <p className="text-slate-700 dark:text-slate-300 italic line-clamp-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        &ldquo;{data.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority WhatsApp Direct Connect */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <WhatsAppIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Need Immediate Architecture Review?</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded-full">
                    Priority Channel
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Send this structured inquiry directly to our lead engineering architect on WhatsApp for instant acknowledgment and real-time scheduling.
                </p>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Send Lead on WhatsApp ({targetWhatsAppPhone})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#0077FF] hover:bg-[#0062D6] text-white px-5 py-3 rounded-xl font-bold text-xs shadow transition-all text-center"
                >
                  Done &amp; Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Export standalone ToastNotification
export { ToastNotification } from './ToastNotification.js';
export type { ToastNotificationProps } from './ToastNotification.js';

