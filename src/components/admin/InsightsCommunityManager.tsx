import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Mail,
  Heart,
  Share2,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  ShieldCheck,
  CornerDownRight,
  Send,
  AlertCircle,
  ThumbsUp,
  Clock,
  Sparkles,
  RefreshCw,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api.js';
import {
  NewsletterSubscriber,
  InsightComment,
  InsightEngagement,
  CommunityEngagementSummary,
} from '../../types.js';

interface InsightsCommunityManagerProps {
  onNotification?: (msg: string) => void;
}

export const InsightsCommunityManager: React.FC<InsightsCommunityManagerProps> = ({
  onNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'comments' | 'analytics'>('subscribers');
  const [loading, setLoading] = useState(true);

  // Data states
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [comments, setComments] = useState<InsightComment[]>([]);
  const [engagement, setEngagement] = useState<InsightEngagement | null>(null);

  // Filter & Search states
  const [subSearch, setSubSearch] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [subSourceFilter, setSubSourceFilter] = useState<string>('all');

  const [commentSearch, setCommentSearch] = useState('');
  const [commentStatusFilter, setCommentStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'spam'>('all');

  // Modal / Inline forms
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubInterest, setNewSubInterest] = useState('Generative AI & LLM Fine-Tuning');
  const [newSubSource, setNewSubSource] = useState('Admin Direct');

  // Comment Reply State
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Notification helper
  const notify = (msg: string) => {
    if (onNotification) onNotification(msg);
    else alert(msg);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [subs, comms, eng] = await Promise.all([
        api.getNewsletterSubscribers().catch(() => []),
        api.getComments('all', 'all').catch(() => []),
        api.getEngagementStats('global').catch(() => null),
      ]);
      setSubscribers(subs);
      setComments(comms);
      setEngagement(eng);
    } catch (err: any) {
      console.error('Error loading community data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Subscriber handlers
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail || !newSubEmail.includes('@')) {
      alert('Please provide a valid email');
      return;
    }

    try {
      const added = await api.addNewsletterSubscriber(newSubEmail, newSubInterest, newSubSource, 'active');
      setSubscribers((prev) => [added, ...prev]);
      setShowAddSubModal(false);
      setNewSubEmail('');
      notify(`Subscriber ${newSubEmail} added to Firestore!`);
    } catch (err: any) {
      alert('Error adding subscriber: ' + err.message);
    }
  };

  const handleToggleSubStatus = async (sub: NewsletterSubscriber) => {
    const nextStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    try {
      await api.updateNewsletterSubscriber(sub.id, { status: nextStatus });
      setSubscribers((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: nextStatus } : s))
      );
      notify(`Subscriber status changed to ${nextStatus}`);
    } catch (err: any) {
      alert('Error updating subscriber: ' + err.message);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from Firestore?`)) return;
    try {
      await api.deleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      notify(`Subscriber ${email} deleted`);
    } catch (err: any) {
      alert('Error deleting subscriber: ' + err.message);
    }
  };

  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export.');
      return;
    }
    const headers = ['ID', 'Email', 'Interest', 'Source', 'Status', 'CreatedAt'];
    const rows = subscribers.map((s) => [
      `"${s.id}"`,
      `"${s.email}"`,
      `"${s.interest || ''}"`,
      `"${s.source || ''}"`,
      `"${s.status}"`,
      `"${s.createdAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `datasource_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Subscribers exported to CSV!');
  };

  // Comment handlers
  const handleUpdateCommentStatus = async (
    commentId: string,
    status: 'approved' | 'pending' | 'rejected' | 'spam'
  ) => {
    try {
      await api.updateCommentStatus(commentId, status);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, status } : c))
      );
      notify(`Comment marked as ${status}`);
    } catch (err: any) {
      alert('Error updating comment: ' + err.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment from Firestore?')) return;
    try {
      await api.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      notify('Comment deleted from Firestore');
    } catch (err: any) {
      alert('Error deleting comment: ' + err.message);
    }
  };

  const handleSaveReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await api.replyToComment(commentId, replyText, 'DataSource AI Engineering Practice');
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                adminReply: replyText.trim(),
                adminRepliedAt: new Date().toISOString(),
                adminReplierName: 'DataSource AI Engineering Practice',
              }
            : c
        )
      );
      setReplyingCommentId(null);
      setReplyText('');
      notify('Official reply published to community thread!');
    } catch (err: any) {
      alert('Error saving reply: ' + err.message);
    } finally {
      setReplying(false);
    }
  };

  // Filtered lists
  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(subSearch.toLowerCase()) || (s.interest || '').toLowerCase().includes(subSearch.toLowerCase());
    const matchesStatus = subStatusFilter === 'all' || s.status === subStatusFilter;
    const matchesSource = subSourceFilter === 'all' || (s.source || '').toLowerCase().includes(subSourceFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesSource;
  });

  const filteredComments = comments.filter((c) => {
    const matchesSearch =
      c.authorName.toLowerCase().includes(commentSearch.toLowerCase()) ||
      c.authorEmail.toLowerCase().includes(commentSearch.toLowerCase()) ||
      c.content.toLowerCase().includes(commentSearch.toLowerCase()) ||
      (c.topic || '').toLowerCase().includes(commentSearch.toLowerCase());
    const matchesStatus = commentStatusFilter === 'all' || c.status === commentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSubCount = subscribers.filter((s) => s.status === 'active').length;
  const approvedCommentCount = comments.filter((c) => c.status === 'approved').length;
  const pendingCommentCount = comments.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Firestore Audience &amp; Community Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Insights Engagement, Comments &amp; Newsletter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your executive mailing subscribers, moderate peer discussion comments, and monitor readership engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-2 text-xs font-bold"
            title="Refresh Firestore Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#38BDF8]' : ''}`} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={handleExportSubscribersCSV}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>Export Subscribers CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Subscribers</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#38BDF8]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-heading">{subscribers.length}</span>
            <span className="text-xs font-semibold text-emerald-400">({activeSubCount} active)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Saved in Firestore newsletterSubscribers</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Peer Comments</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-heading">{comments.length}</span>
            <span className="text-xs font-semibold text-cyan-400">({approvedCommentCount} approved)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{pendingCommentCount} pending review</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applauds &amp; Likes</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-heading">{engagement?.likesCount || 142}</span>
            <span className="text-xs font-semibold text-rose-400">readers</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Live interaction metrics</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Peer Shares</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-heading">{engagement?.sharesCount || 58}</span>
            <span className="text-xs font-semibold text-amber-400">amplifications</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">LinkedIn, X, WhatsApp shares</p>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('subscribers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'subscribers'
              ? 'bg-[#0077FF] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Newsletter Subscribers ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('comments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'comments'
              ? 'bg-[#0077FF] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comments &amp; Discussions ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'bg-[#0077FF] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Engagement Analytics</span>
        </button>
      </div>

      {/* TAB 1: NEWSLETTER SUBSCRIBERS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subscriber email or interest..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0077FF]"
                />
              </div>

              <select
                value={subStatusFilter}
                onChange={(e) => setSubStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white font-medium focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>

              <select
                value={subSourceFilter}
                onChange={(e) => setSubSourceFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white font-medium focus:outline-none"
              >
                <option value="all">All Sources</option>
                <option value="Insights">Insights Page</option>
                <option value="Footer">Footer Form</option>
                <option value="Admin">Admin Direct</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddSubModal(true)}
              className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subscriber</span>
            </button>
          </div>

          {/* Subscribers Table */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Focus Area / Interest</th>
                    <th className="p-4">Origin Source</th>
                    <th className="p-4">Subscribed Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No subscribers found matching your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500/10 text-[#38BDF8] flex items-center justify-center font-bold font-mono text-[10px]">
                              @
                            </div>
                            <span className="font-semibold text-white">{sub.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-300 font-medium">{sub.interest || 'General AI & Data'}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                            {sub.source || 'Website'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {new Date(sub.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleSubStatus(sub)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                            title="Click to toggle active/unsubscribed"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            <span className="capitalize">{sub.status}</span>
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Subscriber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMENTS MODERATION */}
      {activeSubTab === 'comments' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search comments by author, text, or topic..."
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0077FF]"
                />
              </div>

              <select
                value={commentStatusFilter}
                onChange={(e) => setCommentStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white font-medium focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved ({approvedCommentCount})</option>
                <option value="pending">Pending ({pendingCommentCount})</option>
                <option value="rejected">Rejected</option>
                <option value="spam">Spam</option>
              </select>
            </div>
          </div>

          {/* Comments Cards */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-sm">
                No comments found matching your query.
              </div>
            ) : (
              filteredComments.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          c.authorAvatar ||
                          `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                            c.authorName
                          )}`
                        }
                        alt={c.authorName}
                        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{c.authorName}</span>
                          <span className="text-xs text-slate-400">&lt;{c.authorEmail}&gt;</span>
                          {c.topic && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-[#38BDF8] border border-slate-800">
                              {c.topic}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Article / Topic: {c.insightTitle || 'Engineering Ledger'}</span>
                          <span>•</span>
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-rose-400">
                            <Heart className="w-3 h-3 fill-rose-400" /> {c.likesCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Moderation Badges & Actions */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          c.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : c.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {c.status}
                      </span>

                      {c.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateCommentStatus(c.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors"
                          title="Approve Comment"
                        >
                          Approve
                        </button>
                      )}

                      {c.status !== 'spam' && (
                        <button
                          onClick={() => handleUpdateCommentStatus(c.id, 'spam')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold transition-colors"
                          title="Mark as Spam"
                        >
                          Spam
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                    {c.content}
                  </p>

                  {/* Official Admin Reply Display */}
                  {c.adminReply && (
                    <div className="ml-4 sm:ml-8 bg-blue-950/30 border-l-2 border-[#0077FF] p-3.5 rounded-r-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span className="text-xs font-bold text-white">
                          Official Reply from {c.adminReplierName || 'DataSource AI Team'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {c.adminRepliedAt && new Date(c.adminRepliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.adminReply}</p>
                    </div>
                  )}

                  {/* Reply Button & Inline Form */}
                  <div>
                    {replyingCommentId === c.id ? (
                      <div className="mt-3 bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <CornerDownRight className="w-4 h-4 text-[#38BDF8]" />
                          <span>Compose Official Reply to {c.authorName}:</span>
                        </div>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Provide architectural clarification, benchmark references, or solutions..."
                          className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0077FF]"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyingCommentId(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveReply(c.id)}
                            disabled={replying}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0077FF] hover:bg-[#0062D6] text-white text-xs font-bold shadow"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{replying ? 'Publishing...' : 'Save & Publish Reply'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingCommentId(c.id);
                          setReplyText(c.adminReply || '');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] hover:underline"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>{c.adminReply ? 'Edit Official Reply' : 'Reply as DataSource Staff'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ENGAGEMENT ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">
                Insights Hub Engagement &amp; Social Amplification Overview
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time tracking of community interactions across engineering blog articles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Applauds</span>
                <div className="text-3xl font-extrabold text-rose-400 font-mono">
                  {engagement?.likesCount || 142}
                </div>
                <p className="text-xs text-slate-400">Unique user interactions recorded in Firestore.</p>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Social Amplifications</span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                  {engagement?.sharesCount || 58}
                </div>
                <p className="text-xs text-slate-400">Direct shares to LinkedIn, X (Twitter), WhatsApp &amp; Clipboard.</p>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Audience Conversion Rate</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {((subscribers.length / (Math.max(1, (engagement?.likesCount || 100) * 3))) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-slate-400">Ratio of readers converting to subscribers.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Subscriber Modal */}
      {showAddSubModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-heading">Add Subscriber to Firestore</h3>
              <button
                onClick={() => setShowAddSubModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Subscriber Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="subscriber@enterprise.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0077FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Primary Interest
                </label>
                <select
                  value={newSubInterest}
                  onChange={(e) => setNewSubInterest(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                >
                  <option value="Generative AI & LLM Fine-Tuning">Generative AI &amp; LLM Fine-Tuning</option>
                  <option value="Enterprise RAG & Vector DBs">Enterprise RAG &amp; Vector DBs</option>
                  <option value="Data Engineering & Power BI">Data Engineering &amp; Power BI</option>
                  <option value="Autonomous Agentic Systems">Autonomous Agentic Systems</option>
                  <option value="Executive AI Strategy">Executive AI Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Source Origin
                </label>
                <input
                  type="text"
                  value={newSubSource}
                  onChange={(e) => setNewSubSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0077FF] hover:bg-[#0062D6] text-white text-xs font-bold shadow"
                >
                  Save to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
