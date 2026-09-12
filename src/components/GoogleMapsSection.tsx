import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Mail, Clock, ExternalLink, ShieldCheck, Building2, Sparkles, Compass } from 'lucide-react';
import { OfficeLocation, SiteSettings } from '../types.js';
import { api } from '../services/api.js';

export type { OfficeLocation };

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru Global Technology HQ',
    badge: 'Global Engineering HQ & AI Lab',
    city: 'Bengaluru, Karnataka',
    country: 'India',
    address: 'Outer Ring Rd, Bellandur Tech Corridor, Bengaluru, Karnataka 560103',
    phone: '+91 9038417437',
    email: 'india@datasource.tech',
    hours: 'Mon – Fri: 9:30 AM – 6:30 PM IST',
    transit: 'Bellandur Outer Ring Road Metro & Tech Park Expressway',
    focus: ['Enterprise AI & Cloud Systems', 'Data Lakehouse Architecture', 'Power BI Executive Dashboards'],
    mapQuery: 'Bellandur Outer Ring Road, Bengaluru, Karnataka 560103',
    coordinates: { lat: 12.926, lng: 77.6762 },
  },
  {
    id: 'mumbai',
    name: 'Mumbai Financial & Enterprise Center',
    badge: 'FinTech & BFSI Consulting Hub',
    city: 'Mumbai, Maharashtra',
    country: 'India',
    address: 'Bandra Kurla Complex (BKC), G Block, Bandra East, Mumbai, Maharashtra 400051',
    phone: '+91 9038417437',
    email: 'mumbai@datasource.tech',
    hours: 'Mon – Fri: 9:30 AM – 6:30 PM IST',
    transit: 'BKC Metro Line 3 • 15 min from Bandra Terminus',
    focus: ['Financial Data Analytics', 'Real-Time Transaction Pipelines', 'Enterprise Cloud Modernization'],
    mapQuery: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    coordinates: { lat: 19.0657, lng: 72.8687 },
  },
  {
    id: 'kolkata',
    name: 'Kolkata Eastern Innovation Lab',
    badge: 'Software Engineering & Analytics Lab',
    city: 'Kolkata, West Bengal',
    country: 'India',
    address: 'Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091',
    phone: '+91 9038417437',
    email: 'kolkata@datasource.tech',
    hours: 'Mon – Fri: 9:30 AM – 6:30 PM IST',
    transit: 'Karunamoyee / Sector V Metro Station (East-West Metro Line)',
    focus: ['Full-Stack React & Node Engineering', 'ETL Data Pipeline Automation', 'UI/UX Design Systems'],
    mapQuery: 'Sector V, Salt Lake, Kolkata, West Bengal 700091',
    coordinates: { lat: 22.5801, lng: 88.4312 },
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR Technology Hub',
    badge: 'Enterprise & Cloud Center',
    city: 'Gurugram, Haryana (Delhi NCR)',
    country: 'India',
    address: 'DLF Cyber City, Building 10, DLF Phase 2, Gurugram, Haryana 122002',
    phone: '+91 9038417437',
    email: 'delhi@datasource.tech',
    hours: 'Mon – Fri: 9:30 AM – 6:30 PM IST',
    transit: 'IndusInd Bank Cyber City Rapid Metro Station',
    focus: ['Supply Chain Analytics', 'Enterprise Cloud Migration', 'Microservices Architecture'],
    mapQuery: 'DLF Cyber City, Gurugram, Haryana 122002',
    coordinates: { lat: 28.4908, lng: 77.0898 },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Cyberabad Tech Lab',
    badge: 'High-Scale Data & AI Center',
    city: 'Hyderabad, Telangana',
    country: 'India',
    address: 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
    phone: '+91 9038417437',
    email: 'hyderabad@datasource.tech',
    hours: 'Mon – Fri: 9:30 AM – 6:30 PM IST',
    transit: 'HITEC City / Raidurg Metro Station (Blue Line)',
    focus: ['Distributed Data Pipelines', 'BigQuery & Snowflake Warehouses', 'DevOps & MLOps Governance'],
    mapQuery: 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
    coordinates: { lat: 17.4474, lng: 78.3762 },
  },
  {
    id: 'global-desk',
    name: 'Global Client Delivery Desk',
    badge: 'International Client Engagements',
    city: 'Bengaluru (Worldwide Remote & Onsite)',
    country: 'India & Worldwide',
    address: 'DataSource Global Delivery, Bengaluru, Karnataka 560103, India',
    phone: '+91 9038417437',
    email: 'international@datasource.tech',
    hours: '24/7 Global Timezone Coverage (IST / EST / GMT)',
    transit: 'Global Remote Architecture Engagements & Executive Workshops',
    focus: ['Offshore Tech Teams', 'Enterprise Software Scaling', 'Cross-Border Data Compliance'],
    mapQuery: 'Bengaluru, Karnataka, India',
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
];

interface GoogleMapsSectionProps {
  className?: string;
  customLocations?: OfficeLocation[];
  previewSettings?: Partial<SiteSettings>;
}

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({
  className = '',
  customLocations,
  previewSettings,
}) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (previewSettings) {
      setSettings(previewSettings as SiteSettings);
      return;
    }

    let isMounted = true;
    api
      .getSettings()
      .then((data) => {
        if (isMounted && data) {
          setSettings(data);
        }
      })
      .catch(() => {
        // Fallback gracefully
      });

    return () => {
      isMounted = false;
    };
  }, [previewSettings]);

  const activeLocations =
    customLocations ||
    (settings?.officeLocations && settings.officeLocations.length > 0
      ? settings.officeLocations
      : OFFICE_LOCATIONS);

  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation>(activeLocations[0] || OFFICE_LOCATIONS[0]);

  // Keep selected office in sync if activeLocations change
  useEffect(() => {
    if (activeLocations.length > 0) {
      const exists = activeLocations.find((loc) => loc.id === selectedOffice?.id);
      if (!exists) {
        setSelectedOffice(activeLocations[0]);
      }
    }
  }, [activeLocations, selectedOffice?.id]);

  if (!previewSettings && settings?.googleMapsEnabled === false) {
    return null;
  }

  const sectionTitle = settings?.googleMapsTitle || 'Our Technology Hubs & Consultation Offices';
  const sectionSubtitle =
    settings?.googleMapsSubtitle ||
    'Schedule an on-site architecture workshop or visit our consultation centers. Access live Google Maps routes, transit connections, and direct office contacts below.';

  if (!selectedOffice) {
    return null;
  }

  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    selectedOffice.mapQuery || selectedOffice.address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    selectedOffice.address
  )}`;

  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    selectedOffice.address
  )}`;

  return (
    <section
      id="google-maps-global-section"
      className={`bg-slate-50/80 dark:bg-[#070E1A] py-16 lg:py-20 border-t border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors ${className}`}
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0077FF]/5 dark:bg-[#0077FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0077FF] dark:text-[#38BDF8] border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
            <span>Google Maps Verified Global Presence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            {sectionTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Location Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {activeLocations.map((office) => {
            const isSelected = selectedOffice.id === office.id;
            return (
              <button
                key={office.id}
                onClick={() => setSelectedOffice(office)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#0077FF] text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-[#0F1A2A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16253C] border border-slate-200 dark:border-slate-800'
                }`}
                aria-pressed={isSelected}
              >
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#0077FF] dark:text-[#38BDF8]'}`} />
                <span>{office.city}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {office.country === 'United States' ? 'USA' : office.country}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Maps Display Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-[#0B1524] rounded-3xl border border-slate-200 dark:border-slate-800/90 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Left Column: Interactive Map Frame */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-md bg-slate-900 group">
              <iframe
                title={`Google Map - ${selectedOffice.name}`}
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />

              {/* Floating Map Status Overlay */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-white text-xs shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">{selectedOffice.city}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {selectedOffice.coordinates.lat.toFixed(3)}, {selectedOffice.coordinates.lng.toFixed(3)}
                </span>
              </div>
            </div>

            {/* Map Action Quick Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Business Location • Open for Meetings</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs font-bold transition-all shadow-sm"
                  aria-label={`Get directions to ${selectedOffice.name} on Google Maps`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#132034] hover:bg-slate-200 dark:hover:bg-[#1A2C48] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
                  aria-label={`Open ${selectedOffice.name} in Google Maps`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Map</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Office Detail Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-50 dark:bg-[#0F1B2E] p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-700/60">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                    {selectedOffice.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-0.5">
                    {selectedOffice.name}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-[#0077FF] dark:text-[#38BDF8] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>{selectedOffice.address}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8] shrink-0" />
                  <a href={`tel:${selectedOffice.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline font-medium">
                    {selectedOffice.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8] shrink-0" />
                  <a href={`mailto:${selectedOffice.email}`} className="hover:underline font-medium text-[#0077FF] dark:text-[#38BDF8]">
                    {selectedOffice.email}
                  </a>
                </div>

                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedOffice.hours}</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#15233A] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">🚇 Transit &amp; Access:</span>
                  <p>{selectedOffice.transit}</p>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Practice Specialties at this Location:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOffice.focus.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#0077FF] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-900/40 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Book consultation CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Meeting by appointment
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  In-person &amp; hybrid strategy sessions
                </p>
              </div>

              <a
                href="/contact"
                className="px-4 py-2 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs font-bold shadow-sm transition-transform active:scale-95 shrink-0"
              >
                Schedule Visit
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
