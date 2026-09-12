import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb Navigation Component
 * Provides clean navigational context and structured SEO breadcrumbs.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // If explicit items are passed, use them
  let breadcrumbList: BreadcrumbItem[] = items || [];

  // If no items provided, generate automatically from pathname
  if (!items || items.length === 0) {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    breadcrumbList = [
      { name: 'Home', url: '/' },
      ...pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        // Humanize segment name (e.g. "case-studies" -> "Case Studies")
        const name = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return { name, url: index === pathSegments.length - 1 ? undefined : url };
      }),
    ];
  }

  if (breadcrumbList.length <= 1) {
    return null; // Don't show breadcrumbs on root home page
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-slate-500 dark:text-slate-400 py-3 overflow-x-auto whitespace-nowrap ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbList.map((item, index) => {
          const isLast = index === breadcrumbList.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
              )}
              {isLast || !item.url ? (
                <span
                  className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate"
                  aria-current="page"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-[#0077FF] dark:hover:text-[#38BDF8] transition-colors flex items-center gap-1 font-medium"
                >
                  {isFirst && <Home className="w-3.5 h-3.5 shrink-0 mb-0.5" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
