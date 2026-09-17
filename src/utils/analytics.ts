// Google Analytics GA4 & Google Tag (gtag.js) helper for client-side routing & conversions

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const DEFAULT_GA_MEASUREMENT_ID = 'G-TMDMCRC1C7';

let currentMeasurementId =
  ((import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string) || DEFAULT_GA_MEASUREMENT_ID;

export interface AnalyticsDiagnosticLog {
  id: string;
  type: 'page_view' | 'event' | 'config' | 'error';
  name: string;
  params?: Record<string, any>;
  timestamp: string;
  status: 'dispatched' | 'pending' | 'failed';
}

const diagnosticLogs: AnalyticsDiagnosticLog[] = [];
const diagnosticListeners: ((logs: AnalyticsDiagnosticLog[]) => void)[] = [];

export function getDiagnosticLogs(): AnalyticsDiagnosticLog[] {
  return [...diagnosticLogs];
}

export function subscribeDiagnosticLogs(listener: (logs: AnalyticsDiagnosticLog[]) => void): () => void {
  diagnosticListeners.push(listener);
  return () => {
    const idx = diagnosticListeners.indexOf(listener);
    if (idx > -1) diagnosticListeners.splice(idx, 1);
  };
}

function recordLog(log: Omit<AnalyticsDiagnosticLog, 'id' | 'timestamp'>) {
  const entry: AnalyticsDiagnosticLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
  };
  diagnosticLogs.unshift(entry);
  if (diagnosticLogs.length > 50) diagnosticLogs.pop();
  diagnosticListeners.forEach((fn) => fn([...diagnosticLogs]));
}

export function getActiveMeasurementId(): string {
  return currentMeasurementId;
}

export function setMeasurementId(id: string): void {
  if (!id || typeof id !== 'string') return;
  const cleanId = id.trim();
  currentMeasurementId = cleanId;

  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === 'function') {
        window.gtag('config', cleanId);
        recordLog({
          type: 'config',
          name: 'gtag_config',
          params: { measurementId: cleanId },
          status: 'dispatched',
        });
      }
    }
  } catch (err) {
    console.debug('[Analytics] setMeasurementId notice:', err);
  }
}

export function isGoogleTagLoaded(): boolean {
  return (
    typeof window !== 'undefined' &&
    Array.isArray(window.dataLayer) &&
    typeof window.gtag === 'function'
  );
}

export function trackPageView(path: string, title?: string): void {
  try {
    if (typeof window !== 'undefined') {
      const pageTitle = title || document.title;
      if (typeof window.gtag === 'function') {
        window.gtag('config', currentMeasurementId, {
          page_path: path,
          page_title: pageTitle,
          page_location: window.location.href,
        });
        recordLog({
          type: 'page_view',
          name: path,
          params: { page_title: pageTitle, measurementId: currentMeasurementId },
          status: 'dispatched',
        });
      } else {
        recordLog({
          type: 'page_view',
          name: path,
          params: { page_title: pageTitle, notice: 'gtag not yet loaded' },
          status: 'pending',
        });
      }
    }
  } catch (err: any) {
    console.debug('[Analytics] page_view notice:', err);
    recordLog({
      type: 'error',
      name: 'page_view_error',
      params: { error: err?.message },
      status: 'failed',
    });
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
        console.log(`[Google Tag / GA4] Tracked event: ${eventName}`, params);
        recordLog({
          type: 'event',
          name: eventName,
          params,
          status: 'dispatched',
        });
      } else {
        console.debug(`[Google Tag] Queuing event until gtag is ready: ${eventName}`);
        recordLog({
          type: 'event',
          name: eventName,
          params: { ...(params || {}), notice: 'dataLayer queued' },
          status: 'pending',
        });
      }
    }
  } catch (err: any) {
    console.debug('[Analytics] event notice:', err);
    recordLog({
      type: 'error',
      name: `event_error_${eventName}`,
      params: { error: err?.message },
      status: 'failed',
    });
  }
}

// Pre-configured conversion events across the DataSource application
export const AnalyticsEvents = {
  LEAD_SUBMITTED: 'lead_inquiry_submitted',
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
  CONSULTATION_CLICKED: 'consultation_button_clicked',
  SERVICE_VIEWED: 'service_page_viewed',
  CASE_STUDY_VIEWED: 'case_study_viewed',
  INSIGHT_LIKED: 'insight_liked',
  INSIGHT_SHARED: 'insight_shared',
  INSIGHT_COMMENT_POSTED: 'insight_comment_posted',
  PHONE_CLICKED: 'contact_phone_clicked',
  EMAIL_CLICKED: 'contact_email_clicked',
  LOCATION_DIRECTIONS_CLICKED: 'location_directions_clicked',
};

