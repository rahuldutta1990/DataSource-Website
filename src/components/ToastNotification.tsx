import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, Sparkles } from 'lucide-react';

export interface ToastNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  title?: string;
  referenceId?: string;
  duration?: number; // duration in ms, default 5000
  onActionClick?: () => void;
  actionLabel?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  isVisible,
  onClose,
  message = 'Your consultation request has been received and routed to our engineering team.',
  title = 'Message Sent Successfully',
  referenceId,
  duration = 5000,
  onActionClick,
  actionLabel = 'View Details',
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-white dark:bg-[#0E1726] border-2 border-emerald-500/40 dark:border-emerald-500/30 rounded-2xl shadow-2xl p-4 text-left overflow-hidden select-none"
        >
          {/* 5-second linear progress countdown bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-[#38BDF8] to-[#0077FF]"
          />

          <div className="flex items-start gap-3.5">
            {/* Animated Checkmark Badge */}
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            {/* Alert Content */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-heading">
                  {title}
                </h4>
                {referenceId && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {referenceId}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {message}
              </p>

              {onActionClick && (
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onActionClick}
                    className="text-xs font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>{actionLabel}</span>
                  </button>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    • Auto-closing in 5s
                  </span>
                </div>
              )}
            </div>

            {/* Manual Dismiss Button */}
            <button
              onClick={onClose}
              aria-label="Dismiss alert"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
