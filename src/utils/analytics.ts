// Google Analytics GA4 helper for client-side routing & conversions

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  ((import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string) || 'G-DTSOURCE2026';

export function trackPageView(path: string, title?: string): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title || document.title,
      });
    }
  } catch (err) {
    console.debug('[Analytics] page_view notice:', err);
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      console.log(`[Analytics] Tracked event: ${eventName}`, params);
    }
  } catch (err) {
    console.debug('[Analytics] event notice:', err);
  }
}

// Pre-configured conversion events
export const AnalyticsEvents = {
  LEAD_SUBMITTED: 'lead_inquiry_submitted',
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
  CONSULTATION_CLICKED: 'consultation_button_clicked',
  SERVICE_VIEWED: 'service_page_viewed',
  CASE_STUDY_VIEWED: 'case_study_viewed',
};
