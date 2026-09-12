import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Clock, Tag } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow.js';
import { api } from '../services/api.js';
import { BlogPost } from '../types.js';

export const Insights: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    api.getInsights().then(setPosts).finally(() => setLoading(false));
  }, []);

  const categories = [
    'Data Analytics',
    'Power BI',
    'Data Engineering',
    'Software Architecture',
    'IT Strategy',
  ];

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
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] transition-colors duration-200">
      {/* Header */}
      <section className="pt-12 pb-16 bg-white dark:bg-[#0A1220] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Eyebrow text="Engineering &amp; Strategy Blog" variant="blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              DataSource Insights
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
              Pragmatic articles, architectural patterns, and data engineering case studies written by our practicing consultants.
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
                All Articles ({posts.length})
              </button>
              {categories.map((c) => (
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

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1A2C]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading articles...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">No articles matched your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post) => (
                <article
                  key={post.id}
                  className="consulting-card bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
                        <span className="font-bold text-[#0077FF] dark:text-[#38BDF8] uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading leading-snug hover:text-[#0077FF] dark:hover:text-[#38BDF8] transition-colors mb-3">
                        <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-body">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{post.author}</span>
                    <Link
                      to={`/insights/${post.slug}`}
                      className="text-xs font-bold text-[#0077FF] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
