import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { api } from '../services/api.js';
import { BlogPost } from '../types.js';

export const InsightDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<(BlogPost & { related: BlogPost[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    api
      .getInsightBySlug(slug)
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="min-h-screen py-32 text-center text-slate-400">Loading insight...</div>;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-32 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
        <Link
          to="/insights"
          className="mt-4 inline-flex items-center gap-2 text-[#0077FF] font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Insights</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800 py-3.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-[#0077FF] dark:hover:text-[#38BDF8]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/insights" className="hover:text-[#0077FF] dark:hover:text-[#38BDF8]">Insights</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 dark:text-white font-semibold truncate">{post.title}</span>
        </div>
      </div>

      {/* Article Header */}
      <article className="pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Eyebrow text={post.category} variant="blue" />
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-y border-slate-200 dark:border-slate-800 py-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8]" />
                  {post.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-[#0077FF] dark:text-[#38BDF8] font-bold hover:underline"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg bg-slate-100 dark:bg-slate-800">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Body */}
            <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-body whitespace-pre-line text-base sm:text-lg">
                {post.content}
              </div>

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">
                  Keywords:
                </span>
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Consultation CTA Banner */}
            <div className="bg-[#0B1B2B] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
              <div>
                <h3 className="text-2xl font-bold font-heading">Need Help Applying This?</h3>
                <p className="text-slate-300 text-sm mt-1 max-w-md">
                  DataSource architects and data engineers can audit your current architecture and help you plan your next step.
                </p>
              </div>
              <Link
                to="/contact"
                className="bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3 rounded-xl font-bold text-sm shrink-0 transition-colors"
              >
                Talk to an Architect
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
