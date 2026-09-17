import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Clock, Tag } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { SEOHead } from '../components/SEOHead.js';
import { InsightCardSkeleton, Spinner } from '../components/SkeletonLoader.js';
import { InsightsCommunitySection } from '../components/insights/InsightsCommunitySection.js';
import { api } from '../services/api.js';
import { BlogPost, BlogCategory } from '../types.js';

export const Insights: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    Promise.all([
      api.getInsights().then(setPosts),
      api.getBlogCategories().then(setCategories).catch(() => []),
    ]).finally(() => setLoading(false));
  }, []);

  const defaultCategories = [
    'Model Architecture & Fine-Tuning',
    'Agentic Frameworks',
    'Enterprise Strategy',
  ];

  const categoryNames =
    categories.length > 0 ? categories.map((c) => c.name) : defaultCategories;

  const handleCategoryChange = (cat: string) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filtered = posts.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* On-Page SEO Meta Data */}
      <SEOHead
        title="AI Engineering Insights & Research Blog | DataSource Tech"
        description="Explore technical deep-dives, machine learning research, and enterprise AI implementation strategies from the engineering team at DataSource Technology."
        keywords="AI engineering blog, machine learning research articles, enterprise AI insights, custom LLM tutorials, MLOps best practices"
        canonical="https://datasourcerechnology.ai.studio/insights"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Insights', url: '/insights' },
        ]}
      />

      {/* Header */}
      <section className="pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Eyebrow text="Engineering &amp; Strategy Blog" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              AI Engineering Insights &amp; Research Ledger
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
              Explore technical deep-dives, machine learning research, and enterprise AI implementation strategies from the engineering team at DataSource Technology.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="mt-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#0077FF] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Publications ({posts.length})
              </button>
              {categoryNames.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    selectedCategory.toLowerCase() === c.toLowerCase()
                      ? 'bg-[#0077FF] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search research topics or papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0077FF] dark:text-[#38BDF8] py-2">
                <Spinner size="sm" />
                <span>Loading engineering insights...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <InsightCardSkeleton key={idx} />
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              No insights found for this topic.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-[#0E1726] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl dark:hover:border-cyan-500/30 transition-all flex flex-col group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm border border-white/10">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#0077FF] dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        By {post.author}
                      </span>
                      <Link
                        to={`/insights/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077FF] dark:text-cyan-400 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read Technical Paper</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Interactive Comments, Like, Share & Newsletter Signup Community Section */}
          <InsightsCommunitySection
            insightId="general"
            insightTitle="AI Engineering & Research Ledger Hub"
            category="Enterprise AI & Data Architecture"
          />
        </div>
      </section>
    </div>
  );
};
