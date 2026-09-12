import React from 'react';

/**
 * Animated Shimmer Wave effect overlay
 */
export const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 rounded ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
  </div>
);

/**
 * Modern Spinner Component with glowing brand accent
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string; label?: string }> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizeClasses[size]} rounded-full border-slate-200 dark:border-slate-800 border-t-[#0077FF] dark:border-t-[#38BDF8] animate-spin`}
          role="status"
          aria-label={label || 'Loading content...'}
        />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#0077FF] dark:bg-[#38BDF8] animate-ping" />
      </div>
      {label && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Skeleton for Service Grid Cards (Matches Services.tsx grid item)
 */
export const ServiceCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between animate-pulse">
    <div>
      {/* Image Banner Skeleton */}
      <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
        <div className="absolute top-3 left-3 w-20 h-5 rounded-md bg-slate-300 dark:bg-slate-700" />
      </div>

      <div className="p-6 space-y-4">
        {/* Icon & Category Tag */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-24 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="w-4/5 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="w-1/2 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Excerpt lines */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-11/12 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-4/5 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Capabilities bullet tags */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="w-3/4 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="w-2/3 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Footer Button */}
    <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
      <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

/**
 * Skeleton for Insights Article Grid Cards (Matches Insights.tsx grid item)
 */
export const InsightCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between animate-pulse">
    <div>
      {/* Article Cover Image */}
      <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800" />

      <div className="p-6 space-y-3">
        {/* Meta Bar */}
        <div className="flex items-center gap-3">
          <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="w-full h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-5/6 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 pt-3">
          <div className="w-14 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="w-16 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="w-12 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>

    {/* Author & Footer */}
    <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-20 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

/**
 * Skeleton for Case Study Horizontal Bento Card (Matches CaseStudies.tsx item)
 */
export const CaseStudyCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse">
    {/* Left Image & Meta */}
    <div className="lg:col-span-5 space-y-4">
      <div className="rounded-2xl aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800" />
      <div className="flex items-center gap-2">
        <div className="w-24 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-28 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>

    {/* Right Content */}
    <div className="lg:col-span-7 space-y-6">
      <div className="space-y-3">
        <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="w-4/5 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="space-y-2">
        <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-11/12 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <div className="w-16 h-7 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="w-16 h-7 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="w-16 h-7 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <div className="w-36 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  </div>
);

/**
 * Detail Page Full Skeleton (Matches ServiceDetail.tsx, CaseStudyDetail.tsx, InsightDetail.tsx)
 */
export const DetailPageSkeleton: React.FC<{ variant?: 'service' | 'case-study' | 'insight' }> = ({
  variant = 'service',
}) => (
  <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200 animate-pulse">
    {/* Breadcrumbs Bar Skeleton */}
    <div className="bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 py-3.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <div className="w-12 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>

    {/* Hero Section Skeleton */}
    <div className="bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="w-28 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3 max-w-3xl">
          <div className="w-full h-10 sm:h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-3/4 h-10 sm:h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-2 max-w-2xl">
          <div className="w-full h-5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-5/6 h-5 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex gap-4 pt-4">
          <div className="w-36 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-32 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>

    {/* Body Section Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="aspect-[16/9] w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="w-48 h-7 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-4/5 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="w-32 h-5 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="w-32 h-5 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-36 h-5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-slate-800 mt-4" />
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-28 h-5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-3">
              <div className="w-full h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
