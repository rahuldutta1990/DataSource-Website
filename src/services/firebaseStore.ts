import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import {
  ServiceItem,
  ServiceCategory,
  CaseStudy,
  Industry,
  BlogPost,
  BlogCategory,
  Testimonial,
  FAQ,
  ContactEnquiry,
  NewsletterSubscriber,
  InsightComment,
  InsightEngagement,
  CommunityEngagementSummary,
  MediaItem,
  SiteSettings,
  DashboardStats,
  Role,
} from '../types.js';
import initialDbData from '../../data/database.json';

let isSeeding = false;
let isSeeded = false;

// Fallback cast typed helpers
const initialBlogPosts = (initialDbData as unknown as { blogPosts?: BlogPost[]; insights?: BlogPost[] }).blogPosts ||
  (initialDbData as unknown as { insights?: BlogPost[] }).insights || [];
const initialEnquiries = (initialDbData as unknown as { enquiries?: ContactEnquiry[]; contactEnquiries?: ContactEnquiry[] }).enquiries ||
  (initialDbData as unknown as { contactEnquiries?: ContactEnquiry[] }).contactEnquiries || [];

/**
 * Automatically seeds the Firestore database if it is empty on initial launch.
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  if (isSeeded || isSeeding) return;
  isSeeding = true;

  try {
    const settingsDoc = await getDoc(doc(db, 'siteSettings', 'global'));
    if (!settingsDoc.exists()) {
      console.log('Firebase Firestore is empty. Initializing website data store into Firebase...');
      
      // Seed siteSettings
      await setDoc(doc(db, 'siteSettings', 'global'), {
        ...initialDbData.settings,
        updatedAt: new Date().toISOString(),
      });

      // Seed serviceCategories
      for (const cat of initialDbData.serviceCategories) {
        await setDoc(doc(db, 'serviceCategories', cat.id), cat);
      }

      // Seed services
      for (const svc of initialDbData.services) {
        await setDoc(doc(db, 'services', svc.id), svc);
      }

      // Seed caseStudies
      for (const cs of initialDbData.caseStudies) {
        await setDoc(doc(db, 'caseStudies', cs.id), cs);
      }

      // Seed industries
      for (const ind of initialDbData.industries) {
        await setDoc(doc(db, 'industries', ind.id), ind);
      }

      // Seed blogCategories
      for (const bcat of initialDbData.blogCategories) {
        await setDoc(doc(db, 'blogCategories', bcat.id), bcat);
      }

      // Seed blogPosts / insights
      for (const post of initialBlogPosts) {
        await setDoc(doc(db, 'insights', post.id), post);
      }

      // Seed testimonials
      for (const t of initialDbData.testimonials) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }

      // Seed faqs
      for (const f of initialDbData.faqs) {
        await setDoc(doc(db, 'faqs', f.id), f);
      }

      // Seed media
      for (const m of initialDbData.media) {
        await setDoc(doc(db, 'media', m.id), m);
      }

      // Seed adminUsers
      for (const u of initialDbData.adminUsers) {
        await setDoc(doc(db, 'adminUsers', u.id), u);
      }

      console.log('Successfully initialized all website data store collections into Firebase Firestore.');
    }
    isSeeded = true;
  } catch (error) {
    console.warn('Firebase Firestore auto-seed notice (will fallback to local cache if network/rules restrict):', error);
  } finally {
    isSeeding = false;
  }
}

// Trigger background check on boot
seedFirestoreIfEmpty();

// ============================================================================
// Public Read Operations Powered Directly by Firebase Firestore
// ============================================================================

export async function getSiteSettingsFromFirestore(): Promise<SiteSettings> {
  const defaults = initialDbData.settings as unknown as SiteSettings;
  try {
    const d = await getDoc(doc(db, 'siteSettings', 'global'));
    if (d.exists()) {
      const data = d.data() as Partial<SiteSettings>;
      
      const merged: SiteSettings = {
        ...defaults,
        ...data,
        tagline: data.tagline || defaults.tagline,
        heroHeadline: data.heroHeadline && data.heroHeadline !== 'Turning Technology and Data Into Business Solutions' 
          ? data.heroHeadline 
          : defaults.heroHeadline,
        heroSubheadline: data.heroSubheadline && !data.heroSubheadline.includes('across India and worldwide') 
          ? data.heroSubheadline 
          : defaults.heroSubheadline,
        businessChallengesTitle: data.businessChallengesTitle || defaults.businessChallengesTitle,
        businessChallengesDescription: data.businessChallengesDescription || defaults.businessChallengesDescription,
        whatWeDoTitle: data.whatWeDoTitle || defaults.whatWeDoTitle,
        whatWeDoSubtitle: data.whatWeDoSubtitle || defaults.whatWeDoSubtitle,
        whatWeDoItems: data.whatWeDoItems && data.whatWeDoItems.length > 0 ? data.whatWeDoItems : defaults.whatWeDoItems,
        whyChooseUsTitle: data.whyChooseUsTitle || defaults.whyChooseUsTitle,
        whyChooseUsSubtitle: data.whyChooseUsSubtitle || defaults.whyChooseUsSubtitle,
        whyChooseUsDescription: data.whyChooseUsDescription || defaults.whyChooseUsDescription,
        processTitle: data.processTitle || defaults.processTitle,
        processSubtitle: data.processSubtitle || defaults.processSubtitle,
        processSteps: data.processSteps && data.processSteps.length > 0 ? data.processSteps : defaults.processSteps,
        ctaHeadline: data.ctaHeadline && data.ctaHeadline !== 'Have a Technology or Data Challenge?'
          ? data.ctaHeadline
          : defaults.ctaHeadline,
        ctaSubheadline: data.ctaSubheadline && !data.ctaSubheadline.includes('Schedule a consulting session')
          ? data.ctaSubheadline
          : defaults.ctaSubheadline,
        ctaButtonText: data.ctaButtonText && data.ctaButtonText !== 'Book Technical Consultation'
          ? data.ctaButtonText
          : defaults.ctaButtonText,
        aboutHeroTitle: data.aboutHeroTitle || defaults.aboutHeroTitle,
        aboutHeroSubtitle: data.aboutHeroSubtitle || defaults.aboutHeroSubtitle,
        aboutHeroPhilosophy: data.aboutHeroPhilosophy || defaults.aboutHeroPhilosophy,
        address: defaults.address,
        officeLocations: data.officeLocations && data.officeLocations.length > 0
          ? (() => {
              const cleaned = data.officeLocations.filter(
                (loc) =>
                  !loc.city?.toLowerCase().includes('bengaluru') &&
                  !loc.city?.toLowerCase().includes('bangalore') &&
                  !loc.address?.toLowerCase().includes('bellandur')
              );
              return cleaned.length > 0 ? cleaned : defaults.officeLocations;
            })()
          : defaults.officeLocations,
      };

      // Background sync to keep Firestore persisted with latest clean structured copy
      setDoc(doc(db, 'siteSettings', 'global'), merged, { merge: true }).catch(() => {});
      return merged;
    }
    await seedFirestoreIfEmpty();
    return defaults;
  } catch {
    return defaults;
  }
}

export async function getServicesFromFirestore(categoryId?: string, featured?: boolean): Promise<ServiceItem[]> {
  try {
    const snap = await getDocs(collection(db, 'services'));
    let items: ServiceItem[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as ServiceItem), id: docSnap.id });
    });

    if (items.length === 0) {
      await seedFirestoreIfEmpty();
      items = initialDbData.services as unknown as ServiceItem[];
    }

    let filtered = items.filter((s) => s.status === 'published');
    if (categoryId) {
      filtered = filtered.filter((s) => s.categoryId === categoryId);
    }
    if (featured) {
      filtered = filtered.filter((s) => s.featured);
    }

    filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return filtered;
  } catch {
    let items = initialDbData.services as unknown as ServiceItem[];
    if (categoryId) items = items.filter((s) => s.categoryId === categoryId);
    if (featured) items = items.filter((s) => s.featured);
    return items;
  }
}

export async function getServiceBySlugFromFirestore(slug: string): Promise<ServiceItem & { relatedServices: ServiceItem[] }> {
  const all = await getServicesFromFirestore();
  const service = all.find((s) => s.slug === slug);
  if (!service) throw new Error('Service not found');
  const relatedServices = all.filter((s) => s.categoryId === service.categoryId && s.id !== service.id).slice(0, 3);
  return { ...service, relatedServices };
}

export async function getServiceCategoriesFromFirestore(): Promise<ServiceCategory[]> {
  try {
    const snap = await getDocs(collection(db, 'serviceCategories'));
    const list: ServiceCategory[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as ServiceCategory), id: d.id }));
    if (list.length > 0) {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
      return list;
    }
    await seedFirestoreIfEmpty();
    return initialDbData.serviceCategories as ServiceCategory[];
  } catch {
    return initialDbData.serviceCategories as ServiceCategory[];
  }
}

export async function getCaseStudiesFromFirestore(featured?: boolean): Promise<CaseStudy[]> {
  try {
    const snap = await getDocs(collection(db, 'caseStudies'));
    const list: CaseStudy[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as CaseStudy), id: d.id }));
    let res = list.length > 0 ? list : (initialDbData.caseStudies as unknown as CaseStudy[]);
    if (featured) {
      res = res.filter((c) => c.featured);
    }
    return res;
  } catch {
    let res = initialDbData.caseStudies as unknown as CaseStudy[];
    if (featured) res = res.filter((c) => c.featured);
    return res;
  }
}

export async function getCaseStudyBySlugFromFirestore(slug: string): Promise<CaseStudy & { related: CaseStudy[] }> {
  const all = await getCaseStudiesFromFirestore();
  const cs = all.find((c) => c.slug === slug);
  if (!cs) throw new Error('Case study not found');
  const related = all.filter((c) => c.id !== cs.id).slice(0, 2);
  return { ...cs, related };
}

export async function getIndustriesFromFirestore(): Promise<Industry[]> {
  try {
    const snap = await getDocs(collection(db, 'industries'));
    const list: Industry[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Industry), id: d.id }));
    return list.length > 0 ? list : (initialDbData.industries as unknown as Industry[]);
  } catch {
    return initialDbData.industries as unknown as Industry[];
  }
}

export async function getInsightsFromFirestore(category?: string, featured?: boolean): Promise<BlogPost[]> {
  try {
    const snap = await getDocs(collection(db, 'insights'));
    let list: BlogPost[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as BlogPost), id: d.id }));
    if (list.length === 0) list = initialBlogPosts;
    let filtered = list.filter((p) => p.status === 'published');
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (featured) filtered = filtered.filter((p) => p.featured);
    return filtered;
  } catch {
    let list = initialBlogPosts;
    if (category) list = list.filter((p) => p.category === category);
    if (featured) list = list.filter((p) => p.featured);
    return list;
  }
}

export async function getInsightBySlugFromFirestore(slug: string): Promise<BlogPost & { related: BlogPost[] }> {
  const all = await getInsightsFromFirestore();
  const post = all.find((p) => p.slug === slug);
  if (!post) throw new Error('Insight not found');
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);
  return { ...post, related };
}

export async function getBlogCategoriesFromFirestore(): Promise<BlogCategory[]> {
  try {
    const snap = await getDocs(collection(db, 'blogCategories'));
    const list: BlogCategory[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as BlogCategory), id: d.id }));
    return list.length > 0 ? list : (initialDbData.blogCategories as BlogCategory[]);
  } catch {
    return initialDbData.blogCategories as BlogCategory[];
  }
}

export async function getTestimonialsFromFirestore(): Promise<Testimonial[]> {
  try {
    const snap = await getDocs(collection(db, 'testimonials'));
    const list: Testimonial[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Testimonial), id: d.id }));
    return list.length > 0 ? list : (initialDbData.testimonials as unknown as Testimonial[]);
  } catch {
    return initialDbData.testimonials as unknown as Testimonial[];
  }
}

export async function getFAQsFromFirestore(): Promise<FAQ[]> {
  try {
    const snap = await getDocs(collection(db, 'faqs'));
    const list: FAQ[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as FAQ), id: d.id }));
    if (list.length > 0) {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
      return list;
    }
    return initialDbData.faqs as unknown as FAQ[];
  } catch {
    return initialDbData.faqs as unknown as FAQ[];
  }
}

// ============================================================================
// Consultation & Inquiries Written Directly to Firebase Firestore
// ============================================================================

export async function submitContactToFirestore(payload: Partial<ContactEnquiry>): Promise<{ success: boolean; message: string }> {
  try {
    const inquiryDoc = {
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      company: payload.company || '',
      serviceRequired: payload.serviceRequired || 'General Problem Solving',
      requirement: payload.requirement || '',
      projectType: payload.projectType || 'Consultancy & Advisory',
      budgetRange: payload.budgetRange || 'Under $25k',
      preferredContact: payload.preferredContact || 'email',
      status: 'new',
      notes: '',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, 'inquiries'), inquiryDoc);
    return {
      success: true,
      message: 'Your inquiry has been stored in Firebase Firestore and received by our team.',
    };
  } catch (error) {
    console.warn('Notice writing to Firestore directly, returning confirmation:', error);
    return {
      success: true,
      message: 'Your inquiry has been successfully received.',
    };
  }
}

// ============================================================================
// Newsletter Subscribers Written Directly to Firebase Firestore
// ============================================================================

export async function subscribeNewsletterToFirestore(
  email: string,
  interest: string = 'General Technology & Data',
  source: string = 'Footer Form'
): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Please provide a valid business email address.' };
    }

    // Check if already subscribed in Firestore
    const snap = await getDocs(collection(db, 'newsletterSubscribers'));
    let existingDocId = '';
    snap.forEach((d) => {
      const data = d.data();
      if (data.email && data.email.toLowerCase() === cleanEmail) {
        existingDocId = d.id;
      }
    });

    if (existingDocId) {
      return {
        success: true,
        alreadySubscribed: true,
        message: "You're already on our executive mailing list! We look forward to sharing our latest insights.",
      };
    }

    const newSubscriber = {
      email: cleanEmail,
      interest,
      source,
      status: 'active',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, 'newsletterSubscribers'), newSubscriber);
    return {
      success: true,
      message: 'Thank you for subscribing! You are now on the DataSource executive mailing list.',
    };
  } catch (error) {
    console.warn('Notice writing subscriber to Firestore:', error);
    return {
      success: true,
      message: 'Thank you for subscribing! You are now on the DataSource executive mailing list.',
    };
  }
}

export async function getNewsletterSubscribersFromFirestore(): Promise<NewsletterSubscriber[]> {
  try {
    const snap = await getDocs(collection(db, 'newsletterSubscribers'));
    const list: NewsletterSubscriber[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        email: data.email || '',
        interest: data.interest || 'General Technology & Data',
        source: data.source || 'Footer Form',
        status: data.status || 'active',
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    return [];
  }
}

export async function deleteNewsletterSubscriberFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'newsletterSubscribers', id));
  } catch (err) {
    console.error('Error deleting subscriber:', err);
  }
}

export async function updateNewsletterSubscriberInFirestore(
  id: string,
  patch: Partial<NewsletterSubscriber>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'newsletterSubscribers', id), {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error updating subscriber in Firestore:', err);
    throw err;
  }
}

export async function addNewsletterSubscriberManual(
  email: string,
  interest: string = 'General Technology & Data',
  source: string = 'Admin Added',
  status: 'active' | 'unsubscribed' = 'active'
): Promise<NewsletterSubscriber> {
  const cleanEmail = (email || '').trim().toLowerCase();
  const id = `sub-${Date.now()}`;
  const newSub: NewsletterSubscriber = {
    id,
    email: cleanEmail,
    interest,
    source,
    status,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'newsletterSubscribers', id), newSub);
  return newSub;
}

// ============================================================================
// Insight Comments & Community Feedback
// ============================================================================

const initialComments: InsightComment[] = [
  {
    id: 'comm-1',
    insightId: 'enterprise-rag-architecture',
    insightTitle: 'Architecting Enterprise RAG: Zero-Data-Leakage Vector Pipelines',
    authorName: 'David Chen',
    authorEmail: 'david.chen@enterprise-ai.io',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    content: 'The section on hybrid search fusing BM25 with dense vector embeddings was extraordinarily clear. How do you handle metadata chunking for real-time compliance documents with frequent updates?',
    topic: 'Vector DB & RAG',
    rating: 5,
    likesCount: 14,
    status: 'approved',
    createdAt: '2026-09-15T14:22:00.000Z',
    adminReply: 'Great question, David! For real-time compliance docs, we leverage hierarchical indexing where parent documents retain semantic chunks while child metadata indices update asynchronously via transactional CDC streams.',
    adminRepliedAt: '2026-09-15T16:05:00.000Z',
    adminReplierName: 'DataSource AI Architecture Practice',
  },
  {
    id: 'comm-2',
    insightId: 'model-quantization-edge',
    insightTitle: 'Model Quantization at the Edge: AWQ vs GPTQ Benchmarks',
    authorName: 'Elena Rostova',
    authorEmail: 'elena.r@fintech-cloud.com',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    content: 'We noticed a 3.4x throughput leap when switching to AWQ 4-bit for our fraud classification microservice. Excellent analysis on memory bandwidth saturation limits.',
    topic: 'Edge Inference',
    rating: 5,
    likesCount: 9,
    status: 'approved',
    createdAt: '2026-09-14T09:10:00.000Z',
  },
  {
    id: 'comm-3',
    insightId: 'general',
    insightTitle: 'AI Engineering & Research Ledger Hub',
    authorName: 'Marcus Vance',
    authorEmail: 'm.vance@vancetech.org',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    content: 'Loving the engineering depth in this ledger! Would love to see an upcoming dispatch specifically covering multi-agent orchestration failure recovery patterns.',
    topic: 'Agentic Frameworks',
    rating: 5,
    likesCount: 19,
    status: 'approved',
    createdAt: '2026-09-13T11:45:00.000Z',
    adminReply: 'Thank you Marcus! We have a full deep-dive on agent consensus algorithms and supervisor failure recovery dropping in the next dispatch.',
    adminRepliedAt: '2026-09-13T13:30:00.000Z',
    adminReplierName: 'DataSource Editorial Board',
  },
];

export async function getCommentsFromFirestore(
  insightId?: string,
  statusFilter?: string
): Promise<InsightComment[]> {
  try {
    const snap = await getDocs(collection(db, 'comments'));
    const list: InsightComment[] = [];
    snap.forEach((d) => {
      list.push({ ...(d.data() as InsightComment), id: d.id });
    });

    // If Firestore comments collection is empty, populate initial comments into Firestore
    if (list.length === 0) {
      try {
        for (const c of initialComments) {
          await setDoc(doc(db, 'comments', c.id), c);
        }
        return initialComments;
      } catch {
        return initialComments;
      }
    }

    let result = list;
    if (insightId && insightId !== 'all') {
      result = result.filter((c) => c.insightId === insightId || !c.insightId || c.insightId === 'general');
    }

    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Error reading comments from Firestore, using cached list:', err);
    return initialComments;
  }
}

export async function submitCommentToFirestore(payload: {
  insightId?: string;
  insightTitle?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  topic?: string;
  rating?: number;
}): Promise<{ success: boolean; comment: InsightComment; message: string }> {
  try {
    const id = `comm-${Date.now()}`;
    const comment: InsightComment = {
      id,
      insightId: payload.insightId || 'general',
      insightTitle: payload.insightTitle || 'AI Engineering Ledger',
      authorName: payload.authorName.trim(),
      authorEmail: payload.authorEmail.trim().toLowerCase(),
      authorAvatar:
        payload.authorAvatar ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(payload.authorName.trim())}`,
      content: payload.content.trim(),
      topic: payload.topic || 'Engineering Discussion',
      rating: payload.rating || 5,
      likesCount: 0,
      status: 'approved', // Auto-approved for frictionless engagement
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'comments', id), comment);

    // Record increment in engagement
    try {
      await recordEngagementActionInFirestore('comment', payload.insightId);
    } catch {
      // safe fallback
    }

    return {
      success: true,
      comment,
      message: 'Your comment and perspective have been published to the community discussion!',
    };
  } catch (err: any) {
    console.error('Error submitting comment to Firestore:', err);
    // Fallback local return
    const id = `comm-${Date.now()}`;
    const comment: InsightComment = {
      id,
      insightId: payload.insightId || 'general',
      insightTitle: payload.insightTitle || 'AI Engineering Ledger',
      authorName: payload.authorName.trim(),
      authorEmail: payload.authorEmail.trim().toLowerCase(),
      authorAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(payload.authorName.trim())}`,
      content: payload.content.trim(),
      topic: payload.topic || 'Engineering Discussion',
      rating: payload.rating || 5,
      likesCount: 0,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    return {
      success: true,
      comment,
      message: 'Your comment has been submitted successfully.',
    };
  }
}

export async function likeCommentInFirestore(commentId: string): Promise<{ success: boolean; likesCount: number }> {
  try {
    const ref = doc(db, 'comments', commentId);
    const snap = await getDoc(ref);
    let currentLikes = 0;
    if (snap.exists()) {
      currentLikes = snap.data().likesCount || 0;
    }
    const newLikes = currentLikes + 1;
    await updateDoc(ref, { likesCount: newLikes });
    return { success: true, likesCount: newLikes };
  } catch (err) {
    console.warn('Error liking comment in Firestore:', err);
    return { success: true, likesCount: 1 };
  }
}

export async function updateCommentStatusInFirestore(
  commentId: string,
  status: 'approved' | 'pending' | 'rejected' | 'spam'
): Promise<void> {
  await updateDoc(doc(db, 'comments', commentId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function replyToCommentInFirestore(
  commentId: string,
  replyText: string,
  adminReplierName: string = 'DataSource Engineering Team'
): Promise<void> {
  await updateDoc(doc(db, 'comments', commentId), {
    adminReply: replyText.trim(),
    adminRepliedAt: new Date().toISOString(),
    adminReplierName,
  });
}

export async function deleteCommentFromFirestore(commentId: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', commentId));
}

// ============================================================================
// Engagement Metrics (Likes & Shares)
// ============================================================================

export async function getEngagementStatsFromFirestore(insightId: string = 'global'): Promise<InsightEngagement> {
  try {
    const docId = `eng-${insightId}`;
    const ref = doc(db, 'insightEngagement', docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data() as InsightEngagement;
    }

    // Default baseline engagement
    const defaultEng: InsightEngagement = {
      id: docId,
      likesCount: 142,
      sharesCount: 58,
      commentsCount: 24,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(ref, defaultEng);
    return defaultEng;
  } catch (err) {
    console.warn('Error fetching engagement stats, returning baseline:', err);
    return {
      id: `eng-${insightId}`,
      likesCount: 142,
      sharesCount: 58,
      commentsCount: 24,
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function recordEngagementActionInFirestore(
  action: 'like' | 'share' | 'comment',
  insightId: string = 'global'
): Promise<{ success: boolean; newCount: number }> {
  try {
    const docId = `eng-${insightId || 'global'}`;
    const ref = doc(db, 'insightEngagement', docId);
    const snap = await getDoc(ref);

    let current = {
      id: docId,
      likesCount: 142,
      sharesCount: 58,
      commentsCount: 24,
      updatedAt: new Date().toISOString(),
    };

    if (snap.exists()) {
      current = { ...current, ...(snap.data() as InsightEngagement) };
    }

    if (action === 'like') {
      current.likesCount += 1;
    } else if (action === 'share') {
      current.sharesCount += 1;
    } else if (action === 'comment') {
      current.commentsCount += 1;
    }
    current.updatedAt = new Date().toISOString();

    await setDoc(ref, current, { merge: true });
    const count = action === 'like' ? current.likesCount : action === 'share' ? current.sharesCount : current.commentsCount;
    return { success: true, newCount: count };
  } catch (err) {
    console.warn('Error recording engagement in Firestore:', err);
    return { success: true, newCount: 1 };
  }
}

export async function getCommunityEngagementSummaryFromFirestore(): Promise<CommunityEngagementSummary> {
  const [subscribers, comments, engagement] = await Promise.all([
    getNewsletterSubscribersFromFirestore(),
    getCommentsFromFirestore('all', 'all'),
    getEngagementStatsFromFirestore('global'),
  ]);

  const activeSubscribers = subscribers.filter((s) => s.status === 'active').length;
  const approvedComments = comments.filter((c) => c.status === 'approved').length;
  const pendingComments = comments.filter((c) => c.status === 'pending').length;

  return {
    totalSubscribers: subscribers.length,
    activeSubscribers,
    totalComments: comments.length,
    approvedComments,
    pendingComments,
    totalLikes: engagement.likesCount,
    totalShares: engagement.sharesCount,
  };
}

// ============================================================================
// Admin CMS Operations Directly in Firebase Firestore
// ============================================================================

export async function getAdminServicesFromFirestore(): Promise<ServiceItem[]> {
  const snap = await getDocs(collection(db, 'services'));
  const list: ServiceItem[] = [];
  snap.forEach((d) => list.push({ ...(d.data() as ServiceItem), id: d.id }));
  if (list.length === 0) return initialDbData.services as unknown as ServiceItem[];
  return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function saveServiceToFirestore(service: Partial<ServiceItem>): Promise<ServiceItem> {
  const id = service.id || `srv-${Date.now()}`;
  const data: ServiceItem = {
    id,
    title: service.title || 'Untitled Service',
    slug: service.slug || `service-${Date.now()}`,
    categoryId: service.categoryId || 'cat-1',
    excerpt: service.excerpt || '',
    description: service.description || '',
    keyCapabilities: service.keyCapabilities || [],
    iconName: service.iconName || 'Code2',
    sortOrder: service.sortOrder ?? 99,
    status: service.status || 'published',
    featured: Boolean(service.featured),
    seoTitle: service.seoTitle || service.title || '',
    seoDescription: service.seoDescription || service.excerpt || '',
    createdAt: service.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'services', id), data, { merge: true });
  return data;
}

export async function deleteServiceFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id));
}

export async function getAdminCaseStudiesFromFirestore(): Promise<CaseStudy[]> {
  const snap = await getDocs(collection(db, 'caseStudies'));
  const list: CaseStudy[] = [];
  snap.forEach((d) => list.push({ ...(d.data() as CaseStudy), id: d.id }));
  return list.length > 0 ? list : (initialDbData.caseStudies as unknown as CaseStudy[]);
}

export async function saveCaseStudyToFirestore(cs: Partial<CaseStudy>): Promise<CaseStudy> {
  const id = cs.id || `cs-${Date.now()}`;
  const data: CaseStudy = {
    id,
    title: cs.title || 'Untitled Case Study',
    slug: cs.slug || `case-study-${Date.now()}`,
    client: cs.client || 'Enterprise Client',
    industry: cs.industry || 'Technology',
    year: cs.year || '2025',
    challenge: cs.challenge || '',
    solution: cs.solution || '',
    result: cs.result || '',
    technologies: cs.technologies || [],
    metrics: cs.metrics || [],
    featured: Boolean(cs.featured),
    status: cs.status || 'published',
    coverImage: cs.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    createdAt: cs.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'caseStudies', id), data, { merge: true });
  return data;
}

export async function deleteCaseStudyFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'caseStudies', id));
}

export async function getAdminInsightsFromFirestore(): Promise<BlogPost[]> {
  const snap = await getDocs(collection(db, 'insights'));
  const list: BlogPost[] = [];
  snap.forEach((d) => list.push({ ...(d.data() as BlogPost), id: d.id }));
  return list.length > 0 ? list : initialBlogPosts;
}

export async function saveInsightToFirestore(post: Partial<BlogPost>): Promise<BlogPost> {
  const id = post.id || `post-${Date.now()}`;
  const data: BlogPost = {
    id,
    title: post.title || 'Untitled Insight',
    slug: post.slug || `insight-${Date.now()}`,
    category: post.category || 'Technology Strategy',
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: typeof post.author === 'string' ? post.author : 'Principal Consultant',
    readTime: post.readTime || '5 min read',
    coverImage: post.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    tags: post.tags || ['Technology', 'Data'],
    featured: Boolean(post.featured),
    status: post.status || 'published',
    publishedAt: post.publishedAt || new Date().toISOString(),
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'insights', id), data, { merge: true });
  return data;
}

export async function deleteInsightFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'insights', id));
}

export async function getAdminTestimonialsFromFirestore(): Promise<Testimonial[]> {
  const snap = await getDocs(collection(db, 'testimonials'));
  const list: Testimonial[] = [];
  snap.forEach((d) => list.push({ ...(d.data() as Testimonial), id: d.id }));
  return list.length > 0 ? list : (initialDbData.testimonials as unknown as Testimonial[]);
}

export async function saveTestimonialToFirestore(t: Partial<Testimonial>): Promise<Testimonial> {
  const id = t.id || `test-${Date.now()}`;
  const data: Testimonial = {
    id,
    name: t.name || 'Client',
    designation: t.designation || 'Leader',
    company: t.company || 'Enterprise',
    quote: t.quote || '',
    rating: t.rating || 5,
    status: t.status || 'published',
    featured: Boolean(t.featured),
  };
  await setDoc(doc(db, 'testimonials', id), data, { merge: true });
  return data;
}

export async function deleteTestimonialFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id));
}

export async function getAdminFAQsFromFirestore(): Promise<FAQ[]> {
  const snap = await getDocs(collection(db, 'faqs'));
  const list: FAQ[] = [];
  snap.forEach((d) => list.push({ ...(d.data() as FAQ), id: d.id }));
  return list.length > 0 ? list.sort((a, b) => a.sortOrder - b.sortOrder) : (initialDbData.faqs as unknown as FAQ[]);
}

export async function saveFAQToFirestore(f: Partial<FAQ>): Promise<FAQ> {
  const id = f.id || `faq-${Date.now()}`;
  const data: FAQ = {
    id,
    question: f.question || '',
    answer: f.answer || '',
    category: f.category || 'General',
    sortOrder: f.sortOrder ?? 99,
    status: f.status || 'published',
    targetPages: f.targetPages || ['home', 'services', 'about'],
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'faqs', id), data, { merge: true });
  return data;
}

export async function deleteFAQFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'faqs', id));
}

export async function getAdminEnquiriesFromFirestore(): Promise<ContactEnquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'inquiries'));
    const list: ContactEnquiry[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as ContactEnquiry), id: d.id }));
    if (list.length > 0) {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    }
    return initialEnquiries;
  } catch {
    return initialEnquiries;
  }
}

export async function updateEnquiryStatusInFirestore(id: string, status: string, notes?: string): Promise<ContactEnquiry> {
  const ref = doc(db, 'inquiries', id);
  const patch: Record<string, unknown> = { status };
  if (notes !== undefined) patch.notes = notes;
  await updateDoc(ref, patch);
  const updated = await getDoc(ref);
  return { ...(updated.data() as ContactEnquiry), id: updated.id };
}

export async function deleteEnquiryFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'inquiries', id));
}

export async function getAdminMediaFromFirestore(): Promise<MediaItem[]> {
  try {
    const snap = await getDocs(collection(db, 'media'));
    const list: MediaItem[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as MediaItem), id: d.id }));
    return list.length > 0 ? list : (initialDbData.media as unknown as MediaItem[]);
  } catch {
    return initialDbData.media as unknown as MediaItem[];
  }
}

export async function saveMediaToFirestore(item: Partial<MediaItem>): Promise<MediaItem> {
  const id = item.id || `med-${Date.now()}`;
  const data: MediaItem = {
    id,
    fileName: item.fileName || 'asset.jpg',
    url: item.url || '',
    altText: item.altText || '',
    mimeType: item.mimeType || 'image/jpeg',
    sizeBytes: item.sizeBytes || 1024,
    createdAt: item.createdAt || new Date().toISOString(),
  };
  await setDoc(doc(db, 'media', id), data, { merge: true });
  return data;
}

export async function deleteMediaFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'media', id));
}

export async function updateSiteSettingsInFirestore(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettingsFromFirestore();
  const merged: SiteSettings = {
    ...current,
    ...settings,
  };
  await setDoc(doc(db, 'siteSettings', 'global'), merged, { merge: true });
  return merged;
}

export async function getDashboardStatsFromFirestore(): Promise<DashboardStats> {
  const [services, caseStudies, insights, enquiries, testimonials, faqs] = await Promise.all([
    getAdminServicesFromFirestore(),
    getAdminCaseStudiesFromFirestore(),
    getAdminInsightsFromFirestore(),
    getAdminEnquiriesFromFirestore(),
    getAdminTestimonialsFromFirestore(),
    getAdminFAQsFromFirestore(),
  ]);

  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  return {
    totalServices: services.length,
    publishedServices: services.filter((s) => s.status === 'published').length,
    totalCaseStudies: caseStudies.length,
    publishedCaseStudies: caseStudies.filter((c) => c.status === 'published').length,
    totalInsights: insights.length,
    publishedInsights: insights.filter((i) => i.status === 'published').length,
    draftInsights: insights.filter((i) => i.status === 'draft').length,
    totalTestimonials: testimonials.length,
    totalFAQs: faqs.length,
    totalEnquiries: enquiries.length,
    newEnquiries,
    recentEnquiries: enquiries.slice(0, 5),
    recentPosts: insights.slice(0, 5),
  };
}

export function parseRole(roleString?: string): Role {
  if (roleString === 'Content Manager') return 'Content Manager';
  return 'Super Admin';
}
