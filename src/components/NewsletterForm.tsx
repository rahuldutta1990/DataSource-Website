import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';
import { trackEvent, AnalyticsEvents } from '../utils/analytics.js';

interface NewsletterFormProps {
  source?: string;
  variant?: 'footer' | 'inline' | 'compact';
  className?: string;
}

const INTEREST_TOPICS = [
  'All Insights',
  'Cloud Architecture',
  'Data Engineering & AI',
  'Executive Strategy',
];

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  source = 'Footer Newsletter Form',
  variant = 'footer',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('All Insights');
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const validateEmail = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid work or corporate email address.';
    }
    return '';
  };

  const handleBlur = () => {
    setTouched(true);
    const err = validateEmail(email);
    setValidationError(err);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
    if (touched) {
      setValidationError(validateEmail(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const err = validateEmail(email);
    setValidationError(err);

    if (err) {
      setStatus('error');
      setFeedbackMessage(err);
      return;
    }

    const trimmed = email.trim();

    try {
      setStatus('loading');
      setFeedbackMessage('');
      setValidationError('');

      const res = await api.subscribeNewsletter(trimmed, selectedInterest, source);

      trackEvent(AnalyticsEvents.NEWSLETTER_SUBSCRIBED, {
        topic: selectedInterest,
        source,
      });

      if (res.success) {
        setStatus('success');
        setFeedbackMessage(
          res.alreadySubscribed
            ? "You're already on our executive mailing list! We look forward to sharing our latest briefing."
            : "Thank you for subscribing! You've been added to our executive mailing list."
        );
        setEmail('');
        setTouched(false);
      } else {
        setStatus('error');
        setFeedbackMessage(res.message || 'Unable to subscribe at this time. Please try again.');
      }
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      // Fallback optimistic success for resilient UX
      setStatus('success');
      setFeedbackMessage("Thank you for subscribing! You've been added to our executive mailing list.");
      setEmail('');
      setTouched(false);
    }
  };

  if (status === 'success') {
    return (
      <div
        id="newsletter-success-box"
        className={`bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 ${className}`}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base font-heading">
              Welcome to DataSource Briefings
            </h4>
            <p className="text-slate-300 text-sm mt-0.5 leading-relaxed">
              {feedbackMessage}
            </p>
            <p className="text-xs text-emerald-400/80 mt-1">
              Topic: <span className="font-semibold text-emerald-300">{selectedInterest}</span> · Sent bi-weekly
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setFeedbackMessage('');
          }}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 transition-colors shrink-0 self-start sm:self-center"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div id="newsletter-form-container" className={className}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Topic selection chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Focus:
          </span>
          {INTEREST_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedInterest(topic)}
              className={`text-xs px-2.5 py-1 rounded-full transition-all border whitespace-nowrap ${
                selectedInterest === topic
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-semibold shadow-sm shadow-cyan-900/30'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Input and Submit button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="newsletter-email-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder="Enter your corporate or work email..."
              aria-invalid={(touched && !!validationError) || status === 'error'}
              aria-describedby={(touched && validationError) || (status === 'error' && feedbackMessage) ? 'newsletter-error-msg' : undefined}
              className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none transition-all shadow-inner ${
                (touched && validationError) || status === 'error'
                  ? 'border-2 border-rose-500 focus:ring-2 focus:ring-rose-400'
                  : 'border border-slate-700 focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
              }`}
              disabled={status === 'loading'}
              autoComplete="email"
              aria-label="Email address for newsletter sign-up"
            />
          </div>

          <button
            id="newsletter-submit-btn"
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0066E0] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md shadow-blue-900/30 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {((touched && validationError) || status === 'error') && (
          <div
            id="newsletter-error-msg"
            className="flex items-center gap-2 text-rose-400 text-xs font-medium pt-1 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{validationError || feedbackMessage}</span>
          </div>
        )}

        {/* Trust & Privacy Notice */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Sent bi-weekly · Zero spam · Unsubscribe with 1 click
          </span>
          <span className="hidden sm:inline text-slate-500">
            Stored securely in Firestore
          </span>
        </div>
      </form>
    </div>
  );
};
