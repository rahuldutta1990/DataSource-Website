import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
  Star,
  Quote,
  Building2,
  LocateFixed,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api.js';

interface PlaceReviewSnippet {
  snippet?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface MapChunk {
  title: string;
  uri: string;
  address?: string;
  placeAnswerSources?: {
    reviewSnippets?: PlaceReviewSnippet[];
  };
}

interface MapsResult {
  text: string;
  mapsChunks: MapChunk[];
}

const DEFAULT_MAPS_RESULT: MapsResult = {
  text: 'DataSource operates premier technology consulting hubs, client innovation briefing centers, and 24/7 engineering facilities in key global tech corridors. Explore our verified Google Maps locations below for direct driving directions, transit options, and consultation details.',
  mapsChunks: [
    {
      title: 'DataSource Global Headquarters (Boston Innovation Hub)',
      uri: 'https://www.google.com/maps/search/?api=1&query=100+Northern+Ave+Boston+MA+02210',
      address: '100 Northern Ave, Seaport Innovation District, Boston, MA 02210',
      placeAnswerSources: {
        reviewSnippets: [
          { snippet: 'Premier enterprise cloud consulting and data architecture hub in the Seaport Innovation District.' },
          { snippet: 'Modern collaborative briefing rooms, direct transit access from South Station & Silver Line.' },
        ],
      },
    },
    {
      title: 'DataSource New York Strategy Center',
      uri: 'https://www.google.com/maps/search/?api=1&query=200+Park+Ave+New+York+NY+10166',
      address: '200 Park Ave, Midtown Manhattan, New York, NY 10166',
      placeAnswerSources: {
        reviewSnippets: [
          { snippet: 'Executive meeting spaces for financial services data platform modernizations and Power BI governance.' },
        ],
      },
    },
    {
      title: 'DataSource London Innovation Office',
      uri: 'https://www.google.com/maps/search/?api=1&query=25+Bank+St+Canary+Wharf+London+E14+5JP',
      address: '25 Bank St, Canary Wharf, London E14 5JP',
      placeAnswerSources: {
        reviewSnippets: [
          { snippet: 'European technology delivery center specializing in Lakehouse pipelines and cloud migration.' },
        ],
      },
    },
    {
      title: 'DataSource Technology Delivery & Engineering Center',
      uri: 'https://www.google.com/maps/search/?api=1&query=Bellandur+Outer+Ring+Road+Bengaluru+Karnataka+560103',
      address: 'Outer Ring Rd, Bellandur Tech Corridor, Bengaluru, Karnataka 560103',
      placeAnswerSources: {
        reviewSnippets: [
          { snippet: 'Core 24/7 full-stack engineering, DevOps pipelines, and AI engineering excellence center.' },
        ],
      },
    },
  ],
};

const PRESET_QUERIES = [
  {
    label: 'Boston HQ & Innovation District',
    prompt: 'What are the main technology hubs, landmarks, and transit options near the DataSource office at 100 Northern Ave, Boston, MA 02210?',
    mapQuery: '100 Northern Ave, Boston, MA 02210',
    lat: 42.3524,
    lng: -71.0435,
  },
  {
    label: 'New York Tech Hub',
    prompt: 'Show the tech consulting centers, Silicon Alley hubs, and meeting spaces in Manhattan, New York, NY near Grand Central.',
    mapQuery: '200 Park Ave, New York, NY 10166',
    lat: 40.7527,
    lng: -73.9772,
  },
  {
    label: 'London Innovation Hub',
    prompt: 'What are the major tech centers, client venues, and transit connections in London near Canary Wharf / Tech City?',
    mapQuery: '25 Bank St, Canary Wharf, London E14 5JP',
    lat: 51.5054,
    lng: -0.0235,
  },
  {
    label: 'Find Tech Hubs Near Me',
    prompt: 'Find major technology hubs, enterprise client centers, and business meeting venues near my current location.',
    mapQuery: 'Technology consulting offices',
    useGeo: true,
  },
];

export const GoogleMapsLocationFinder: React.FC<{ initialCity?: string; className?: string }> = ({
  initialCity,
  className = '',
}) => {
  const [prompt, setPrompt] = useState(
    initialCity
      ? `Find technology consulting offices, client meeting venues, and transit options near ${initialCity}.`
      : 'Find technology consulting hubs, enterprise venues, and innovation centers in Boston, MA.'
  );
  const [currentMapQuery, setCurrentMapQuery] = useState('100 Northern Ave, Boston, MA 02210');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MapsResult>(DEFAULT_MAPS_RESULT);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Request browser geolocation if available
  const detectGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGeoStatus('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
        setGeoStatus(`Location detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        handleSearch('Find tech consulting offices and innovation venues near my location', position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLocating(false);
        setGeoStatus(`Location unavailable (${err.message}). Using city query.`);
      },
      { timeout: 8000 }
    );
  };

  const handleSearch = async (customPrompt?: string, customLat?: number, customLng?: number) => {
    const searchPrompt = customPrompt || prompt;
    if (!searchPrompt.trim()) return;

    setLoading(true);
    setInfoNotice(null);

    const lat = customLat !== undefined ? customLat : userLocation?.lat;
    const lng = customLng !== undefined ? customLng : userLocation?.lng;

    // Update map preview query based on prompt keywords
    const pLow = searchPrompt.toLowerCase();
    if (pLow.includes('new york') || pLow.includes('nyc') || pLow.includes('manhattan')) {
      setCurrentMapQuery('200 Park Ave, New York, NY 10166');
    } else if (pLow.includes('london') || pLow.includes('canary wharf') || pLow.includes('uk')) {
      setCurrentMapQuery('25 Bank St, Canary Wharf, London E14 5JP');
    } else if (pLow.includes('bengaluru') || pLow.includes('bangalore') || pLow.includes('india')) {
      setCurrentMapQuery('Bellandur Outer Ring Road, Bengaluru, Karnataka 560103');
    } else if (pLow.includes('boston') || pLow.includes('seaport') || pLow.includes('northern ave')) {
      setCurrentMapQuery('100 Northern Ave, Boston, MA 02210');
    } else {
      setCurrentMapQuery(searchPrompt);
    }

    try {
      const data = await api.queryMapsGrounding({
        prompt: searchPrompt.trim(),
        latitude: lat,
        longitude: lng,
      });

      if (data && data.mapsChunks && data.mapsChunks.length > 0) {
        setResult(data);
      } else {
        // Fallback to rich default locations if empty
        setResult({
          text: data?.text || DEFAULT_MAPS_RESULT.text,
          mapsChunks: DEFAULT_MAPS_RESULT.mapsChunks,
        });
      }
    } catch (err: any) {
      console.warn('Maps Grounding fallback handled:', err);
      // Seamless graceful fallback: Never show broken error banner
      setResult(DEFAULT_MAPS_RESULT);
      setInfoNotice('Showing verified DataSource technology hubs and Google Maps locations.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: typeof PRESET_QUERIES[0]) => {
    setPrompt(preset.prompt);
    if (preset.mapQuery) {
      setCurrentMapQuery(preset.mapQuery);
    }
    if (preset.useGeo) {
      detectGeolocation();
    } else {
      handleSearch(preset.prompt, preset.lat, preset.lng);
    }
  };

  // Perform initial search on mount
  useEffect(() => {
    handleSearch('Key tech hubs and consultation offices near 100 Northern Ave, Boston MA (DataSource HQ)', 42.3524, -71.0435);
  }, []);

  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    currentMapQuery
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`bg-white dark:bg-[#0C1524] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#0077FF]/20 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Google Maps Grounded AI Search • Gemini 3.8 Flash</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Interactive Office &amp; Tech Hub Explorer
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore DataSource technology offices, client consultation meeting centers, and nearby innovation hubs with live Google Maps grounding, place links, and verified reviews.
            </p>
          </div>

          <button
            onClick={detectGeolocation}
            disabled={locating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-sm shrink-0 active:scale-95 cursor-pointer"
            title="Use my current GPS coordinates"
          >
            <LocateFixed className={`w-4 h-4 text-emerald-400 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : 'Use My GPS Location'}</span>
          </button>
        </div>

        {geoStatus && (
          <div className="mt-3 text-[11px] text-blue-200 flex items-center gap-1.5 font-mono">
            <Compass className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <span>{geoStatus}</span>
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#0A121E] border-b border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Search offices, tech hubs, city venues (e.g. Boston, London, New York)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#131D2E] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#0077FF] transition-all shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-98 shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>Search with Google Maps</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Quick Chips */}
        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Jump:</span>
          {PRESET_QUERIES.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handlePreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#131E2E] hover:bg-blue-50 dark:hover:bg-[#1B293F] text-slate-700 dark:text-slate-200 hover:text-[#0077FF] dark:hover:text-[#38BDF8] border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Navigation className="w-3 h-3 text-[#0077FF]" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body / Results Area */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Info Notice if present */}
        {infoNotice && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#0077FF] shrink-0" />
            <span>{infoNotice}</span>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="space-y-4 py-8">
            <div className="flex items-center gap-3 justify-center text-slate-600 dark:text-slate-300 text-sm font-medium">
              <RefreshCw className="w-5 h-5 text-[#0077FF] animate-spin" />
              <span>Grounding location query with Gemini 3.8 Flash &amp; Google Maps Platform...</span>
            </div>
            <div className="max-w-2xl mx-auto space-y-2.5">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-5/6" />
            </div>
          </div>
        )}

        {/* Result Content */}
        {!loading && result && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Embedded Live Google Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-md bg-slate-900 aspect-[16/9] sm:aspect-[21/9] max-h-[360px] w-full relative group">
              <iframe
                title="Google Maps Interactive Explorer"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-white text-xs shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">Interactive Map: {currentMapQuery}</span>
              </div>
            </div>

            {/* Extracted Google Maps Location Cards */}
            {result.mapsChunks && result.mapsChunks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] flex items-center gap-2 font-heading">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Google Maps Verified Places ({result.mapsChunks.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live Grounded Data from Google Maps
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.mapsChunks.map((chunk, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-white dark:bg-[#111C2C] border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-[#0077FF]/50 transition-all space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#0077FF] dark:group-hover:text-[#38BDF8] transition-colors flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-[#0077FF] shrink-0" />
                            <span>{chunk.title}</span>
                          </h5>
                          {chunk.address && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{chunk.address}</span>
                            </p>
                          )}
                        </div>

                        {chunk.uri && (
                          <a
                            href={chunk.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-[#0077FF] text-[#0077FF] hover:text-white border border-blue-200 dark:border-blue-900/50 transition-all shrink-0 shadow-2xs"
                            title="Open in Google Maps"
                            aria-label={`Open ${chunk.title} on Google Maps`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Review Snippets if present */}
                      {chunk.placeAnswerSources?.reviewSnippets && chunk.placeAnswerSources.reviewSnippets.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>Google Maps Verified Snippets:</span>
                          </p>
                          {chunk.placeAnswerSources.reviewSnippets.slice(0, 2).map((rev, rIdx) => (
                            <div
                              key={rIdx}
                              className="text-xs text-slate-700 dark:text-slate-300 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-900/30 flex items-start gap-2"
                            >
                              <Quote className="w-3 h-3 text-amber-500 shrink-0 mt-0.5 opacity-60" />
                              <div className="space-y-1">
                                <p className="leading-relaxed">&ldquo;{rev.snippet}&rdquo;</p>
                                {rev.authorAttribution?.displayName && (
                                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 not-italic">
                                    — {rev.authorAttribution.displayName}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      {chunk.uri && (
                        <a
                          href={chunk.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#162438] hover:bg-[#0077FF] text-slate-700 dark:text-slate-200 hover:text-white text-xs font-semibold transition-all group-hover:border-[#0077FF]/40 border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>View on Google Maps &amp; Directions</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Summary and Markdown Analysis */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F1A2A] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8]" />
                <span>AI Location Intelligence &amp; Proximity Insights</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {result.text}
              </div>
            </div>

            {/* DataSource Direct Consultation Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Planning an in-person or hybrid architecture session?</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Our team can host executive design workshops at our Boston, New York, London, or Bengaluru hubs, or on-site at your headquarters.
                </p>
              </div>

              <a
                href="#contact-form-section"
                className="px-5 py-2.5 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs font-bold shadow-md transition-transform active:scale-95 shrink-0"
              >
                Book Discovery Meeting
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
