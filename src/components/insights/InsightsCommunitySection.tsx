import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Copy,
  Check,
  Linkedin,
  Twitter,
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  ThumbsUp,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { InsightComment, InsightEngagement } from '../../types.js';

interface InsightsCommunitySectionProps {
  insightId?: string;
  insightTitle?: string;
  category?: string;
}

export const InsightsCommunitySection: React.FC<InsightsCommunitySectionProps> = ({
  insightId = 'general',
  insightTitle = 'AI Engineering & Research Ledger',
  category = 'Enterprise AI & Data Architecture',
}) => {
  // Engagement State
  const [engagement, setEngagement] = useState<InsightEngagement>({
    id: `eng-${insightId}`,
    likesCount: 142,
    sharesCount: 58,
    commentsCount: 24,
    updatedAt: new Date().toISOString(),
  });
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [shareMenuOpen, setShareMenuOpen] = useState<boolean>(false);

  // Newsletter State
  const [newsEmail, setNewsEmail] = useState('');
  const [newsInterest, setNewsInterest] = useState('All Topics (AI, Data, Architecture)');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedResult, setSubscribedResult] = useState<{
    success: boolean;
    message: string;
    already?: boolean;
  } | null>(null);

  // Comments State
  const [comments, setComments] = useState<InsightComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentTopic, setCommentTopic] = useState('System Architecture');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');
  const [commentFilter, setCommentFilter] = useState<'all' | 'replied'>('all');
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load local storage like status
    const storedLikeKey = `ds_liked_${insightId}`;
    if (localStorage.getItem(storedLikeKey) === 'true') {
      setHasLiked(true);
    }

    // Load live engagement stats
    api
      .getEngagementStats(insightId)
      .then((eng) => {
        if (eng) setEngagement(eng);
      })
      .catch((err) => console.warn('Notice loading engagement:', err));

    // Load comments
    api
      .getComments(insightId, 'approved')
      .then((data) => setComments(data))
      .catch((err) => console.warn('Notice loading comments:', err))
      .finally(() => setLoadingComments(false));
  }, [insightId]);

  // Handle Hub/Article Like
  const handleToggleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setEngagement((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
    localStorage.setItem(`ds_liked_${insightId}`, 'true');

    try {
      await api.recordEngagementAction('like', insightId);
    } catch (err) {
      console.warn('Notice syncing like:', err);
    }
  };

  // Handle Share Actions
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://datasource.tech/insights';
  const shareTitle = `${insightTitle} | DataSource Technology`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      recordShareMetric();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Read this engineering insight from DataSource Technology: ${insightTitle}`,
          url: currentUrl,
        });
        recordShareMetric();
      } catch {
        // user cancelled share
      }
    } else {
      setShareMenuOpen(!shareMenuOpen);
    }
  };

  const handleSocialShare = (platform: 'linkedin' | 'twitter' | 'whatsapp') => {
    recordShareMetric();
    let url = '';
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=DataSourceTech`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
  };

  const recordShareMetric = () => {
    setEngagement((prev) => ({ ...prev, sharesCount: prev.sharesCount + 1 }));
    api.recordEngagementAction('share', insightId).catch(() => {});
  };

  // Handle Newsletter Subscribe
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes('@')) return;

    setSubscribing(true);
    setSubscribedResult(null);

    try {
      const res = await api.subscribeNewsletter(
        newsEmail,
        newsInterest,
        insightId === 'general' ? 'Insights Hub Bottom Section' : `Insight: ${insightTitle}`
      );
      setSubscribedResult({
        success: res.success,
        message: res.message,
        already: res.alreadySubscribed,
      });
      if (res.success && !res.alreadySubscribed) {
        setNewsEmail('');
      }
    } catch (err: any) {
      setSubscribedResult({
        success: false,
        message: err.message || 'Unable to complete subscription. Please try again.',
      });
    } finally {
      setSubscribing(false);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentEmail.trim() || !commentContent.trim()) {
      alert('Please fill out your name, email, and perspective.');
      return;
    }

    setSubmittingComment(true);
    setCommentSuccessMsg('');

    try {
      const res = await api.submitComment({
        insightId,
        insightTitle,
        authorName: commentName.trim(),
        authorEmail: commentEmail.trim(),
        content: commentContent.trim(),
        topic: commentTopic,
        rating: 5,
      });

      if (res.success && res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setEngagement((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
        setCommentContent('');
        setCommentSuccessMsg('Your perspective has been posted successfully!');
        setTimeout(() => setCommentSuccessMsg(''), 6000);
      }
    } catch (err: any) {
      alert('Error submitting comment: ' + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle Like on Individual Comment
  const handleLikeComment = async (cId: string) => {
    if (likedCommentIds[cId]) return;
    setLikedCommentIds((prev) => ({ ...prev, [cId]: true }));
    setComments((prev) =>
      prev.map((c) => (c.id === cId ? { ...c, likesCount: (c.likesCount || 0) + 1 } : c))
    );
    try {
      await api.likeComment(cId);
    } catch (err) {
      console.warn('Notice liking comment:', err);
    }
  };

  const displayedComments =
    commentFilter === 'replied'
      ? comments.filter((c) => !!c.adminReply)
      : comments;

  return (
    <div id="insights-community-hub" className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800 space-y-16">
      {/* 1. INTERACTIVE ENGAGEMENT & SOCIAL AMPLIFICATION BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 dark:from-[#0B1220] dark:via-[#0F1B30] dark:to-[#0B1220] border border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0077FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Engagement &amp; Research Feedback</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Found these engineering dispatches valuable?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-body max-w-xl">
              Support the research team, share with your engineering peers, or join the discussion with technical colleagues.
            </p>
          </div>

          {/* Action Buttons & Counters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Like Hub/Article Button */}
            <button
              id="like-insight-btn"
              onClick={handleToggleLike}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
                hasLiked
                  ? 'bg-rose-600 text-white shadow-rose-600/30 scale-105'
                  : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 hover:border-rose-500/50'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                  hasLiked ? 'fill-white scale-110' : 'text-rose-400'
                }`}
              />
              <span>{hasLiked ? 'Applauded' : 'Applaud Research'}</span>
              <span className="bg-black/30 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                {engagement.likesCount}
              </span>
            </button>

            {/* Share Hub Button */}
            <button
              id="share-insight-btn"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Insights</span>
              <span className="bg-black/30 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                {engagement.sharesCount}
              </span>
            </button>

            {/* Quick Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`p-3 rounded-2xl text-sm border transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Copy Page URL"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Direct Social Links */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-blue-600/30 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare('twitter')}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-sky-500/30 transition-colors"
                title="Share on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Engagement Metrics Ticker */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-xl font-extrabold text-cyan-400 font-mono">{engagement.likesCount}</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Total Applauds</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-xl font-extrabold text-blue-400 font-mono">{engagement.sharesCount}</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Peer Shares</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{comments.length}</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Community Q&amp;As</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-xl font-extrabold text-amber-400 font-mono">1.2k+</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Mailing Subscribers</p>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE NEWSLETTER SIGNUP CARD (STORES IN FIRESTORE) */}
      <div className="bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-[#0077FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-900/50">
                <Mail className="w-3.5 h-3.5" />
                <span>Executive Engineering Dispatch</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] dark:text-white font-heading leading-tight">
                Architectural Blueprints in Your Inbox
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-body leading-relaxed">
                Join over 1,200+ CTOs, principal AI architects, and data leaders. We send zero marketing fluff—only production code benchmarks, RAG system teardowns, and model evaluation protocols.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Zero Spam Guarantee
                </span>
                <span>•</span>
                <span>Bi-weekly schedule</span>
                <span>•</span>
                <span>Unsubscribe anytime</span>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-[#070D18] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              {subscribedResult ? (
                <div
                  className={`p-6 rounded-xl text-center space-y-3 ${
                    subscribedResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-base font-heading">
                    {subscribedResult.already ? 'Already Subscribed!' : 'Subscription Confirmed!'}
                  </h4>
                  <p className="text-xs leading-relaxed">{subscribedResult.message}</p>
                  <button
                    onClick={() => setSubscribedResult(null)}
                    className="text-xs font-bold underline hover:opacity-80 mt-2 inline-block"
                  >
                    Subscribe another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Business Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@enterprise.com"
                        value={newsEmail}
                        onChange={(e) => setNewsEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Primary Area of Focus
                    </label>
                    <select
                      value={newsInterest}
                      onChange={(e) => setNewsInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                    >
                      <option value="All Topics (AI, Data, Architecture)">All Topics (AI, Data, Architecture)</option>
                      <option value="Generative AI & LLM Fine-Tuning">Generative AI &amp; LLM Fine-Tuning</option>
                      <option value="Enterprise RAG & Vector Databases">Enterprise RAG &amp; Vector Databases</option>
                      <option value="Autonomous Agentic Systems">Autonomous Agentic Systems</option>
                      <option value="Data Engineering & Power BI Pipelines">Data Engineering &amp; Power BI Pipelines</option>
                      <option value="Executive AI Strategy & Governance">Executive AI Strategy &amp; Governance</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0077FF] hover:bg-[#0062D6] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {subscribing ? (
                      <span>Saving to Firestore Database...</span>
                    ) : (
                      <>
                        <span>Join Technical Dispatch</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    Stored securely in your cloud Firestore instance.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PEER PERSPECTIVES & COMMENTS DISCUSSION HUB */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Engineering Community</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
              Technical Q&amp;A &amp; Peer Discussion ({comments.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Discuss architecture tradeoffs, benchmark findings, and system design patterns with our engineering team.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setCommentFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                commentFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Discussions ({comments.length})
            </button>
            <button
              onClick={() => setCommentFilter('replied')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                commentFilter === 'replied'
                  ? 'bg-white dark:bg-slate-800 text-[#0077FF] dark:text-[#38BDF8] shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
              <span>Staff Answered</span>
            </button>
          </div>
        </div>

        {/* Existing Comments List */}
        <div className="space-y-4">
          {loadingComments ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Loading community discussion from Firestore...
            </div>
          ) : displayedComments.length === 0 ? (
            <div className="bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No comments found in this view. Be the first to share an engineering perspective below!
            </div>
          ) : (
            displayedComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 space-y-4 transition-shadow hover:shadow-md"
              >
                {/* Author Info & Topic */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        comment.authorAvatar ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                          comment.authorName
                        )}`
                      }
                      alt={comment.authorName}
                      className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        {comment.topic && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {comment.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Like this comment */}
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      likedCommentIds[comment.id]
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
                        : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-rose-500'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.likesCount || 0}</span>
                  </button>
                </div>

                {/* Comment Content */}
                <p className="text-sm text-slate-700 dark:text-slate-200 font-body leading-relaxed pl-13">
                  {comment.content}
                </p>

                {/* Official Admin / Staff Reply */}
                {comment.adminReply && (
                  <div className="ml-6 sm:ml-10 bg-blue-50/80 dark:bg-blue-950/30 border-l-2 border-[#0077FF] dark:border-cyan-400 p-4 rounded-r-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0077FF] dark:text-cyan-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {comment.adminReplierName || 'DataSource Engineering Practice'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0077FF]/10 text-[#0077FF] dark:text-cyan-300 px-2 py-0.2 rounded">
                        Verified Staff
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-body">
                      {comment.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Comment Submission Form */}
        <div className="bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Leave a Technical Comment or Question
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Share real-world implementation experiences, request architectural clarifications, or suggest upcoming research topics.
            </p>
          </div>

          {commentSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{commentSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Work / Personal Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="s.jenkins@company.com"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Technical Topic
                </label>
                <select
                  value={commentTopic}
                  onChange={(e) => setCommentTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                >
                  <option value="System Architecture">System Architecture</option>
                  <option value="Vector DB & RAG">Vector DB &amp; RAG</option>
                  <option value="LLM Fine-Tuning">LLM Fine-Tuning</option>
                  <option value="Autonomous Agents">Autonomous Agents</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Your Question or Technical Perspective *
              </label>
              <textarea
                required
                rows={4}
                placeholder="What was your experience with latency benchmarks? Any tradeoffs you noticed when deploying to Kubernetes?"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <span className="text-[11px] text-slate-400">
                Comments are saved to Firestore and moderated by our engineering administrators.
              </span>
              <button
                type="submit"
                disabled={submittingComment}
                className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingComment ? 'Publishing...' : 'Post Perspective'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
