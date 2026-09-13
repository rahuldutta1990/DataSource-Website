import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  X,
  Navigation,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  RotateCcw,
  Sparkles,
  Eye,
  AlertCircle,
  Globe,
  Compass,
} from 'lucide-react';
import { OfficeLocation, SiteSettings } from '../../types.js';
import { OFFICE_LOCATIONS } from '../GoogleMapsSection.js';
import { api } from '../../services/api.js';

interface OfficeLocationsManagerProps {
  settings: SiteSettings | null;
  onUpdateSettings: (updated: SiteSettings) => void;
  showNotification: (msg: string) => void;
}

export const OfficeLocationsManager: React.FC<OfficeLocationsManagerProps> = ({
  settings,
  onUpdateSettings,
  showNotification,
}) => {
  const currentLocations: OfficeLocation[] =
    settings?.officeLocations && settings.officeLocations.length > 0
      ? settings.officeLocations
      : OFFICE_LOCATIONS;

  const [selectedPreviewLocation, setSelectedPreviewLocation] = useState<OfficeLocation>(
    currentLocations[0] || OFFICE_LOCATIONS[0]
  );
  const [editingLocation, setEditingLocation] = useState<Partial<OfficeLocation> | null>(null);
  const [focusInput, setFocusInput] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  // General Settings state for header and toggle
  const [mapsEnabled, setMapsEnabled] = useState<boolean>(settings?.googleMapsEnabled !== false);
  const [mapsTitle, setMapsTitle] = useState<string>(
    settings?.googleMapsTitle || 'Our Technology Hubs & Consultation Offices'
  );
  const [mapsSubtitle, setMapsSubtitle] = useState<string>(
    settings?.googleMapsSubtitle ||
      'Schedule an on-site architecture workshop or visit our consultation centers. Access live Google Maps routes, transit connections, and direct office contacts below.'
  );

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'name':
        if (!value || !value.trim()) return 'Office Name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      case 'city':
        if (!value || !value.trim()) return 'City is required.';
        return '';
      case 'country':
        if (!value || !value.trim()) return 'Country is required.';
        return '';
      case 'address':
        if (!value || !value.trim()) return 'Street address is required.';
        if (value.trim().length < 5) return 'Address must be at least 5 characters.';
        return '';
      case 'phone':
        if (!value || !value.trim()) return 'Phone number is required.';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      default:
        return '';
    }
  };

  const handleOpenAddModal = () => {
    setEditingLocation({
      name: '',
      badge: 'Regional Consulting Hub',
      city: '',
      country: 'United States',
      address: '',
      phone: '+91 9038417437',
      email: 'rd14190@gmail.com',
      hours: 'Mon – Fri: 9:30 AM – 6:30 PM IST',
      transit: 'Public transit & parking nearby',
      focus: ['Cloud Architecture', 'Data Engineering'],
      mapQuery: '',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    });
    setFocusInput('Cloud Architecture, Data Engineering');
    setErrors({});
    setTouched({});
  };

  const handleOpenEditModal = (loc: OfficeLocation) => {
    setEditingLocation({ ...loc });
    setFocusInput(Array.isArray(loc.focus) ? loc.focus.join(', ') : '');
    setErrors({});
    setTouched({});
  };

  const handleSaveLocationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !settings) return;

    const newErrors: Record<string, string> = {};
    ['name', 'city', 'country', 'address', 'phone', 'email'].forEach((f) => {
      const err = validateField(f, (editingLocation as any)[f]);
      if (err) newErrors[f] = err;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      city: true,
      country: true,
      address: true,
      phone: true,
      email: true,
    });

    if (Object.keys(newErrors).length > 0) {
      showNotification('Please fill in the required office details');
      return;
    }

    const focusList = focusInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const locId = editingLocation.id || `loc-${Date.now()}`;
    const cleanAddress = editingLocation.address || '';
    const cleanMapQuery = editingLocation.mapQuery?.trim() || cleanAddress || editingLocation.city || 'Tech Hub';

    const cleanLocation: OfficeLocation = {
      id: locId,
      name: editingLocation.name?.trim() || 'Regional Office',
      badge: editingLocation.badge?.trim() || 'Consultation Center',
      city: editingLocation.city?.trim() || '',
      country: editingLocation.country?.trim() || 'United States',
      address: cleanAddress,
      phone: editingLocation.phone?.trim() || '',
      email: editingLocation.email?.trim() || '',
      hours: editingLocation.hours?.trim() || 'Mon – Fri: 9:00 AM – 6:00 PM',
      transit: editingLocation.transit?.trim() || 'Public transit accessible',
      focus: focusList.length > 0 ? focusList : ['Technology Consulting', 'Data Solutions'],
      mapQuery: cleanMapQuery,
      coordinates: editingLocation.coordinates || { lat: 40.7128, lng: -74.006 },
    };

    const existingIndex = currentLocations.findIndex((l) => l.id === locId);
    let updatedLocations: OfficeLocation[];
    if (existingIndex >= 0) {
      updatedLocations = [...currentLocations];
      updatedLocations[existingIndex] = cleanLocation;
    } else {
      updatedLocations = [...currentLocations, cleanLocation];
    }

    try {
      setIsSaving(true);
      const updated = await api.updateSettings({
        ...settings,
        officeLocations: updatedLocations,
        googleMapsEnabled: mapsEnabled,
        googleMapsTitle: mapsTitle,
        googleMapsSubtitle: mapsSubtitle,
      });
      onUpdateSettings(updated);
      setSelectedPreviewLocation(cleanLocation);
      setEditingLocation(null);
      showNotification(`Office "${cleanLocation.name}" saved successfully`);
    } catch (err: any) {
      alert('Error saving office location: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLocation = async (id: string, name: string) => {
    if (!settings) return;
    if (currentLocations.length <= 1) {
      alert('At least one office location must remain active on the website.');
      return;
    }

    if (!confirm(`Are you sure you want to remove "${name}" from the global office locations?`)) {
      return;
    }

    const filtered = currentLocations.filter((l) => l.id !== id);
    try {
      setIsSaving(true);
      const updated = await api.updateSettings({
        ...settings,
        officeLocations: filtered,
        googleMapsEnabled: mapsEnabled,
        googleMapsTitle: mapsTitle,
        googleMapsSubtitle: mapsSubtitle,
      });
      onUpdateSettings(updated);
      if (selectedPreviewLocation.id === id) {
        setSelectedPreviewLocation(filtered[0] || OFFICE_LOCATIONS[0]);
      }
      showNotification(`Office "${name}" removed`);
    } catch (err: any) {
      alert('Error deleting location: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!settings) return;
    if (
      !confirm(
        'Reset office locations to the default Kolkata Technology Hub & Consultation Office?'
      )
    ) {
      return;
    }

    try {
      setIsSaving(true);
      const updated = await api.updateSettings({
        ...settings,
        officeLocations: OFFICE_LOCATIONS,
      });
      onUpdateSettings(updated);
      setSelectedPreviewLocation(OFFICE_LOCATIONS[0]);
      showNotification('Restored default Kolkata office location');
    } catch (err: any) {
      alert('Error restoring locations: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDisplaySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      const updated = await api.updateSettings({
        ...settings,
        googleMapsEnabled: mapsEnabled,
        googleMapsTitle: mapsTitle,
        googleMapsSubtitle: mapsSubtitle,
      });
      onUpdateSettings(updated);
      showNotification('Google Maps section settings saved successfully');
    } catch (err: any) {
      alert('Error saving Google Maps section settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    selectedPreviewLocation.mapQuery || selectedPreviewLocation.address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-8">
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Google Maps &amp; Office Hubs Manager
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your physical office locations, Google Maps display, transit details, and interactive map pins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
            title="Reset to 4 flagship global hubs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Office Location</span>
          </button>
        </div>
      </div>

      {/* Section Master Configuration Banner */}
      <form
        onSubmit={handleSaveDisplaySettings}
        className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
              Public Website Section Controls
            </span>
            <h3 className="text-lg font-bold text-white font-heading">
              Google Maps Section (Above Footer)
            </h3>
            <p className="text-xs text-slate-400">
              Controls the global Google Maps interactive section displayed above the footer across all website pages.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mapsEnabled}
              onChange={(e) => setMapsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-3 text-xs font-bold text-slate-200">
              {mapsEnabled ? 'Section Active' : 'Section Hidden'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Section Headline
            </label>
            <input
              type="text"
              value={mapsTitle}
              onChange={(e) => setMapsTitle(e.target.value)}
              placeholder="e.g. Our Technology Hubs & Consultation Offices"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0077FF] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Section Subtitle / Description
            </label>
            <input
              type="text"
              value={mapsSubtitle}
              onChange={(e) => setMapsSubtitle(e.target.value)}
              placeholder="e.g. Schedule an on-site architecture workshop or visit our consultation centers..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0077FF] transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Section Display</span>
          </button>
        </div>
      </form>

      {/* Main Content Layout: Active Locations & Live Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Office Locations List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Configured Office Locations ({currentLocations.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Click preview to test interactive map</span>
          </div>

          <div className="space-y-3">
            {currentLocations.map((loc) => {
              const isSelected = selectedPreviewLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-slate-950/90 border-[#0077FF] shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-[#38BDF8] border border-blue-500/30">
                          {loc.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {loc.city}, {loc.country}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{loc.name}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewLocation(loc)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-[#0077FF] text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title="Preview on map"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(loc)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit Office"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(loc.id, loc.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                        title="Delete Office"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span className="truncate">{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span>{loc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span>{loc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>

                  {/* Practice Specialties */}
                  {loc.focus && loc.focus.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {loc.focus.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Interactive Google Maps Preview Frame (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Live Google Map Preview
              </h3>
            </div>
            <span className="text-[11px] text-[#38BDF8] font-mono">
              {selectedPreviewLocation.city}
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
            <iframe
              title={`Live Preview - ${selectedPreviewLocation.name}`}
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-white">{selectedPreviewLocation.name}</p>
                <p className="text-slate-400 mt-0.5">{selectedPreviewLocation.address}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                Verified Hub
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400">
              <span className="font-mono text-[11px]">
                Coordinates: {selectedPreviewLocation.coordinates.lat.toFixed(4)},{' '}
                {selectedPreviewLocation.coordinates.lng.toFixed(4)}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedPreviewLocation.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#38BDF8] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Office Location Editor */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-left space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                  Office Location Configuration
                </span>
                <h3 className="text-xl font-bold text-white font-heading mt-0.5">
                  {editingLocation.id ? 'Edit Office Location' : 'Add New Office Location'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocationForm} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Office Title / Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingLocation.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingLocation({ ...editingLocation, name });
                      if (touched.name) {
                        setErrors((prev) => ({ ...prev, name: validateField('name', name) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, name: true }));
                      setErrors((prev) => ({ ...prev, name: validateField('name', editingLocation.name) }));
                    }}
                    placeholder="e.g. San Francisco Tech Hub"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      touched.name && errors.name
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hub Role / Badge
                  </label>
                  <input
                    type="text"
                    value={editingLocation.badge || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, badge: e.target.value })}
                    placeholder="e.g. Executive Hub & AI Lab"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingLocation.city || ''}
                    onChange={(e) => {
                      const city = e.target.value;
                      setEditingLocation({ ...editingLocation, city });
                      if (touched.city) {
                        setErrors((prev) => ({ ...prev, city: validateField('city', city) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, city: true }));
                      setErrors((prev) => ({ ...prev, city: validateField('city', editingLocation.city) }));
                    }}
                    placeholder="e.g. San Francisco, CA"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      touched.city && errors.city
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                  {touched.city && errors.city && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingLocation.country || ''}
                    onChange={(e) => {
                      const country = e.target.value;
                      setEditingLocation({ ...editingLocation, country });
                      if (touched.country) {
                        setErrors((prev) => ({ ...prev, country: validateField('country', country) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, country: true }));
                      setErrors((prev) => ({ ...prev, country: validateField('country', editingLocation.country) }));
                    }}
                    placeholder="e.g. United States"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      touched.country && errors.country
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingLocation.address || ''}
                  onChange={(e) => {
                    const address = e.target.value;
                    setEditingLocation({ ...editingLocation, address });
                    if (touched.address) {
                      setErrors((prev) => ({ ...prev, address: validateField('address', address) }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, address: true }));
                    setErrors((prev) => ({ ...prev, address: validateField('address', editingLocation.address) }));
                  }}
                  placeholder="e.g. 500 Howard St, Financial District, San Francisco, CA 94105"
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                    touched.address && errors.address
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-[#0077FF]'
                  }`}
                />
                {touched.address && errors.address && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Direct Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingLocation.phone || ''}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setEditingLocation({ ...editingLocation, phone });
                      if (touched.phone) {
                        setErrors((prev) => ({ ...prev, phone: validateField('phone', phone) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, phone: true }));
                      setErrors((prev) => ({ ...prev, phone: validateField('phone', editingLocation.phone) }));
                    }}
                    placeholder="e.g. +1 (415) 555-0198"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      touched.phone && errors.phone
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Direct Office Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingLocation.email || ''}
                    onChange={(e) => {
                      const email = e.target.value;
                      setEditingLocation({ ...editingLocation, email });
                      if (touched.email) {
                        setErrors((prev) => ({ ...prev, email: validateField('email', email) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      setErrors((prev) => ({ ...prev, email: validateField('email', editingLocation.email) }));
                    }}
                    placeholder="e.g. sf@datasource.tech"
                    className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#0077FF]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={editingLocation.hours || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, hours: e.target.value })}
                    placeholder="e.g. Mon – Fri: 9:00 AM – 6:00 PM PST"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Transit &amp; Parking Notes
                  </label>
                  <input
                    type="text"
                    value={editingLocation.transit || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, transit: e.target.value })}
                    placeholder="e.g. Transbay Terminal • Montgomery BART"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Practice Specialties / Focus Areas (Comma separated)
                </label>
                <input
                  type="text"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  placeholder="e.g. Enterprise AI Strategy, Cloud Migration, Power BI Analytics"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0077FF]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Separate tags with commas. These display as specialized badges on the office card.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Google Maps Query
                  </label>
                  <input
                    type="text"
                    value={editingLocation.mapQuery || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, mapQuery: e.target.value })}
                    placeholder="e.g. 500 Howard St, San Francisco, CA"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#0077FF]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editingLocation.coordinates?.lat ?? 37.7749}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        coordinates: {
                          lat: parseFloat(e.target.value) || 0,
                          lng: editingLocation.coordinates?.lng ?? 0,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#0077FF]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editingLocation.coordinates?.lng ?? -122.4194}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        coordinates: {
                          lat: editingLocation.coordinates?.lat ?? 0,
                          lng: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#0077FF]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLocation(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#0077FF] hover:bg-[#0062D6] text-white text-xs font-bold shadow transition-all active:scale-95 disabled:opacity-50"
                >
                  Save Office Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
