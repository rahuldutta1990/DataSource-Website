import { FAQ } from '../types.js';

/**
 * Filter published FAQs for a specific page route or section.
 * Falls back safely if targetPages is not explicitly set.
 */
export function filterFAQsForPage(
  faqs: FAQ[],
  page: 'services' | 'about' | 'home' | 'all'
): FAQ[] {
  const published = faqs.filter((f) => f.status === 'published');
  if (page === 'all') return published;

  return published.filter((faq) => {
    // If targetPages array is provided, match against target page or 'all'
    if (Array.isArray(faq.targetPages) && faq.targetPages.length > 0) {
      return (
        faq.targetPages.includes(page) ||
        faq.targetPages.includes('all') ||
        faq.targetPages.includes(`/${page}`)
      );
    }

    // Fallback based on category heuristics if targetPages is absent
    const cat = (faq.category || '').toLowerCase();
    if (page === 'services') {
      return (
        cat.includes('service') ||
        cat.includes('power bi') ||
        cat.includes('data') ||
        cat.includes('engineering') ||
        cat.includes('architecture') ||
        cat.includes('engagement') ||
        cat.includes('security')
      );
    }
    if (page === 'about') {
      return (
        cat.includes('about') ||
        cat.includes('company') ||
        cat.includes('location') ||
        cat.includes('security') ||
        cat.includes('standards') ||
        cat.includes('governance') ||
        cat.includes('engagement')
      );
    }
    if (page === 'home') {
      return true;
    }

    return true;
  });
}

/**
 * Generates valid Schema.org FAQPage JSON-LD object for search engine crawlers.
 */
export function generateFAQPageSchema(
  faqs: FAQ[],
  pageFilter?: 'services' | 'about' | 'home' | 'all'
): Record<string, any> | null {
  const matchingFaqs = pageFilter ? filterFAQsForPage(faqs, pageFilter) : faqs.filter((f) => f.status === 'published');

  if (!matchingFaqs || matchingFaqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: matchingFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  };
}

/**
 * Validation summary helper for FAQ items.
 */
export interface FAQValidationResult {
  isValid: boolean;
  warnings: string[];
  charCountQuestion: number;
  charCountAnswer: number;
}

export function validateFAQItem(faq: Partial<FAQ>): FAQValidationResult {
  const warnings: string[] = [];
  const q = faq.question?.trim() || '';
  const a = faq.answer?.trim() || '';

  if (!q) {
    warnings.push('Question text is required.');
  } else if (q.length < 10) {
    warnings.push('Question is too short (< 10 chars).');
  } else if (!q.endsWith('?')) {
    warnings.push('Questions usually end with a question mark (?).');
  }

  if (!a) {
    warnings.push('Answer text is required.');
  } else if (a.length < 30) {
    warnings.push('Answer is very brief (< 30 chars). Detailed answers earn higher Google Rich Snippet click-throughs.');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    charCountQuestion: q.length,
    charCountAnswer: a.length,
  };
}
