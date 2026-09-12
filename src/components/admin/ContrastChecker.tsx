import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  Info,
  Copy,
  Check,
  Sparkles,
  Palette,
  ShieldCheck,
  Eye,
} from 'lucide-react';

// Brand primary & secondary color palettes
export interface PaletteColor {
  name: string;
  hex: string;
  shade: string;
  category: 'primary-blue' | 'primary-navy' | 'accent-cyan' | 'neutral';
}

const BRAND_PALETTE: PaletteColor[] = [
  // Primary Brand Blue scale
  { name: 'Blue 50', hex: '#F0F7FF', shade: '50', category: 'primary-blue' },
  { name: 'Blue 100', hex: '#E0EFFF', shade: '100', category: 'primary-blue' },
  { name: 'Blue 200', hex: '#B9DCFF', shade: '200', category: 'primary-blue' },
  { name: 'Blue 300', hex: '#7CB9FF', shade: '300', category: 'primary-blue' },
  { name: 'Blue 400', hex: '#3B95FF', shade: '400', category: 'primary-blue' },
  { name: 'Blue 500 (Core)', hex: '#0077FF', shade: '500', category: 'primary-blue' },
  { name: 'Blue 600', hex: '#0063D6', shade: '600', category: 'primary-blue' },
  { name: 'Blue 700 (High-Contrast)', hex: '#004FAD', shade: '700', category: 'primary-blue' },
  { name: 'Blue 800', hex: '#003D87', shade: '800', category: 'primary-blue' },
  { name: 'Blue 900 (Deep)', hex: '#0A387E', shade: '900', category: 'primary-blue' },
  { name: 'Blue 950', hex: '#051E44', shade: '950', category: 'primary-blue' },

  // Primary Brand Navy scale
  { name: 'Navy 50', hex: '#F4F7FA', shade: '50', category: 'primary-navy' },
  { name: 'Navy 100', hex: '#E5ECF3', shade: '100', category: 'primary-navy' },
  { name: 'Navy 200', hex: '#C9D7E4', shade: '200', category: 'primary-navy' },
  { name: 'Navy 300', hex: '#9FB6CE', shade: '300', category: 'primary-navy' },
  { name: 'Navy 400', hex: '#6E8CAE', shade: '400', category: 'primary-navy' },
  { name: 'Navy 500', hex: '#48688E', shade: '500', category: 'primary-navy' },
  { name: 'Navy 600', hex: '#2D4868', shade: '600', category: 'primary-navy' },
  { name: 'Navy 700', hex: '#1E354F', shade: '700', category: 'primary-navy' },
  { name: 'Navy 800', hex: '#122438', shade: '800', category: 'primary-navy' },
  { name: 'Navy 900 (Core)', hex: '#0B1B2B', shade: '900', category: 'primary-navy' },
  { name: 'Navy 950', hex: '#060E18', shade: '950', category: 'primary-navy' },

  // Accent Brand Cyan scale
  { name: 'Cyan 100', hex: '#E0F2FE', shade: '100', category: 'accent-cyan' },
  { name: 'Cyan 200', hex: '#BAE6FD', shade: '200', category: 'accent-cyan' },
  { name: 'Cyan 400 (Core)', hex: '#38BDF8', shade: '400', category: 'accent-cyan' },
  { name: 'Cyan 500', hex: '#0EA5E9', shade: '500', category: 'accent-cyan' },
  { name: 'Cyan 700', hex: '#0369A1', shade: '700', category: 'accent-cyan' },
  { name: 'Cyan 900', hex: '#0C4A6E', shade: '900', category: 'accent-cyan' },

  // Common Surface Neutrals
  { name: 'Pure White', hex: '#FFFFFF', shade: 'white', category: 'neutral' },
  { name: 'Light Canvas', hex: '#FAFCFF', shade: 'canvas', category: 'neutral' },
  { name: 'Dark Surface', hex: '#0A1220', shade: 'surface', category: 'neutral' },
  { name: 'Dark Canvas', hex: '#070D18', shade: 'dark-canvas', category: 'neutral' },
];

const PRESET_COMBINATIONS = [
  {
    title: 'Brand Blue on White',
    textColor: '#0077FF',
    bgColor: '#FFFFFF',
    notes: 'Core brand action on white card',
  },
  {
    title: 'Accessible Blue (700) on White',
    textColor: '#004FAD',
    bgColor: '#FFFFFF',
    notes: 'WCAG AAA compliant text on light background',
  },
  {
    title: 'Brand Navy on Light Canvas',
    textColor: '#0B1B2B',
    bgColor: '#FAFCFF',
    notes: 'Primary editorial body & header readability',
  },
  {
    title: 'White on Brand Blue (500)',
    textColor: '#FFFFFF',
    bgColor: '#0077FF',
    notes: 'Primary action buttons & key hero badges',
  },
  {
    title: 'White on High-Contrast Blue (700)',
    textColor: '#FFFFFF',
    bgColor: '#004FAD',
    notes: 'Accessible buttons with higher contrast safety',
  },
  {
    title: 'Brand Cyan on Brand Navy (900)',
    textColor: '#38BDF8',
    bgColor: '#0B1B2B',
    notes: 'Cyber telemetry highlights in dark mode',
  },
  {
    title: 'White on Brand Navy (900)',
    textColor: '#FFFFFF',
    bgColor: '#0B1B2B',
    notes: 'White headers on dark navbar & footer',
  },
  {
    title: 'Soft Blue 300 on Navy 950',
    textColor: '#7CB9FF',
    bgColor: '#060E18',
    notes: 'Secondary metadata labels in dark canvas',
  },
];

// Helper: parse hex to RGB
function parseHex(hexStr: string): { r: number; g: number; b: number } | null {
  let hex = hexStr.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (hex.length !== 6) return null;
  const num = parseInt(hex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: WCAG relative luminance calculation
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper: calculate contrast ratio (1:1 to 21:1)
function calculateContrast(hex1: string, hex2: string): number | null {
  const rgb1 = parseHex(hex1);
  const rgb2 = parseHex(hex2);
  if (!rgb1 || !rgb2) return null;
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const ContrastChecker: React.FC = () => {
  const [textColor, setTextColor] = useState<string>('#0B1B2B');
  const [bgColor, setBgColor] = useState<string>('#FAFCFF');
  const [copied, setCopied] = useState(false);
  const [targetSlot, setTargetSlot] = useState<'text' | 'bg'>('text');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'primary-blue' | 'primary-navy' | 'accent-cyan' | 'neutral'
  >('all');

  // Compute contrast ratio
  const ratio = useMemo(() => calculateContrast(textColor, bgColor), [textColor, bgColor]);

  const isValidPair = ratio !== null;
  const formattedRatio = ratio !== null ? ratio.toFixed(2) : '--';

  // WCAG 2.1 Compliance standard checks
  const aaNormal = ratio !== null && ratio >= 4.5;
  const aaLarge = ratio !== null && ratio >= 3.0; // 18pt or 14pt bold
  const aaaNormal = ratio !== null && ratio >= 7.0;
  const aaaLarge = ratio !== null && ratio >= 4.5;
  const uiComponent = ratio !== null && ratio >= 3.0; // WCAG 2.1 non-text contrast

  // Rating label
  let ratingLabel = 'Insufficient Contrast';
  let ratingVariant: 'fail' | 'partial' | 'pass' | 'optimal' = 'fail';

  if (ratio !== null) {
    if (ratio >= 7.0) {
      ratingLabel = 'Enhanced AAA Compliance (Optimal)';
      ratingVariant = 'optimal';
    } else if (ratio >= 4.5) {
      ratingLabel = 'Standard AA Compliance (Passed)';
      ratingVariant = 'pass';
    } else if (ratio >= 3.0) {
      ratingLabel = 'Acceptable for Large Text Only (≥18pt)';
      ratingVariant = 'partial';
    } else {
      ratingLabel = 'Fails WCAG AA Requirements';
      ratingVariant = 'fail';
    }
  }

  // Handlers
  const handleSwap = () => {
    setTextColor(bgColor);
    setBgColor(textColor);
  };

  const handleApplyPreset = (preset: { textColor: string; bgColor: string }) => {
    setTextColor(preset.textColor);
    setBgColor(preset.bgColor);
  };

  const handlePaletteSelect = (hex: string) => {
    if (targetSlot === 'text') {
      setTextColor(hex);
    } else {
      setBgColor(hex);
    }
  };

  const handleCopyCodes = () => {
    const text = `/* WCAG Contrast Ratio: ${formattedRatio}:1 */\ncolor: ${textColor};\nbackground-color: ${bgColor};`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredPalette =
    selectedCategory === 'all'
      ? BRAND_PALETTE
      : BRAND_PALETTE.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title & Explainer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG 2.1 AA / AAA Accessibility Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Palette Contrast &amp; Accessibility Verifier
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Audit foreground and background pairings against W3C accessibility specifications.
            Ensure compliance across normal text (≥4.5:1), large headlines (≥3:1), and high-contrast AAA requirements (≥7:1) using the DataSource primary and secondary palettes.
          </p>
        </div>

        <button
          onClick={handleCopyCodes}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors shrink-0 self-start sm:self-center"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy CSS Pair'}</span>
        </button>
      </div>

      {/* Main 2-Column Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Color Inputs & Swapper */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#38BDF8]" />
                <span>Color Configuration</span>
              </h2>

              <button
                type="button"
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
                title="Swap foreground and background colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            </div>

            {/* Foreground / Text Color Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Foreground (Text) Color</span>
                </label>
                <button
                  type="button"
                  onClick={() => setTargetSlot('text')}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                    targetSlot === 'text'
                      ? 'bg-[#0077FF] text-white font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {targetSlot === 'text' ? 'Active Target' : 'Select Target'}
                </button>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  aria-label="Pick Foreground Color"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#0B1B2B"
                  maxLength={7}
                  className="flex-1 bg-transparent text-white font-mono text-sm font-bold uppercase focus:outline-none"
                />
                <div
                  className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
                  style={{ backgroundColor: textColor }}
                />
              </div>
            </div>

            {/* Background Color Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0077FF]" />
                  <span>Background Color</span>
                </label>
                <button
                  type="button"
                  onClick={() => setTargetSlot('bg')}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                    targetSlot === 'bg'
                      ? 'bg-[#0077FF] text-white font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {targetSlot === 'bg' ? 'Active Target' : 'Select Target'}
                </button>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  aria-label="Pick Background Color"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#FAFCFF"
                  maxLength={7}
                  className="flex-1 bg-transparent text-white font-mono text-sm font-bold uppercase focus:outline-none"
                />
                <div
                  className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
                  style={{ backgroundColor: bgColor }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>Clicking palette swatches below will update the <strong>{targetSlot === 'text' ? 'Foreground' : 'Background'}</strong> color.</span>
            </p>
          </div>

          {/* Quick Brand Preset Combinations */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Brand Presets
            </h3>
            <div className="space-y-2">
              {PRESET_COMBINATIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center -space-x-1 shrink-0">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.textColor }}
                        title={`Text: ${preset.textColor}`}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.bgColor }}
                        title={`Background: ${preset.bgColor}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {preset.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{preset.notes}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30 shrink-0">
                    Apply
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contrast Score, WCAG Matrix & Live Simulation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Contrast Score Card */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                  Calculated Contrast Ratio
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl sm:text-6xl font-extrabold text-white font-mono tracking-tight">
                    {formattedRatio}:1
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                    ratingVariant === 'optimal'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : ratingVariant === 'pass'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : ratingVariant === 'partial'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {ratingVariant === 'optimal' || ratingVariant === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>{ratingLabel}</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                  W3C Guideline 1.4.3 &amp; 1.4.6 Algorithm
                </p>
              </div>
            </div>

            {/* WCAG Compliance Matrix Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6">
              {/* AA Normal Text */}
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  aaNormal
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">AA Normal Text</span>
                  {aaNormal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-lg font-extrabold mt-1 text-white">
                  {aaNormal ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Requires ≥ 4.5:1 ratio</p>
              </div>

              {/* AA Large Text */}
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  aaLarge
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">AA Large Text</span>
                  {aaLarge ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-lg font-extrabold mt-1 text-white">
                  {aaLarge ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Requires ≥ 3.0:1 ratio (≥18pt)</p>
              </div>

              {/* AAA Normal Text */}
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  aaaNormal
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">AAA Normal Text</span>
                  {aaaNormal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-lg font-extrabold mt-1 text-white">
                  {aaaNormal ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Requires ≥ 7.0:1 ratio</p>
              </div>

              {/* AAA Large Text */}
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  aaaLarge
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">AAA Large Text</span>
                  {aaaLarge ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-lg font-extrabold mt-1 text-white">
                  {aaaLarge ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Requires ≥ 4.5:1 ratio</p>
              </div>

              {/* UI Components & Graphics */}
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  uiComponent
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">UI Components</span>
                  {uiComponent ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-lg font-extrabold mt-1 text-white">
                  {uiComponent ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Requires ≥ 3.0:1 (Non-text)</p>
              </div>

              {/* Contrast Multiplier */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Threshold
                </span>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  {ratio && ratio >= 7 ? 'Exceeds strict AAA standard' : ratio && ratio >= 4.5 ? 'Meets core AA commercial baseline' : 'Recommend darker text or lighter background'}
                </p>
              </div>
            </div>
          </div>

          {/* Live Component Simulation Card */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0077FF]" />
                <span>Live Rendering Preview</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {textColor} on {bgColor}
              </span>
            </div>

            {/* Visual Canvas using the input colors */}
            <div
              className="p-6 sm:p-8 rounded-2xl transition-colors border shadow-inner space-y-4"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: `${textColor}25`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase border"
                  style={{
                    backgroundColor: `${textColor}15`,
                    color: textColor,
                    borderColor: `${textColor}30`,
                  }}
                >
                  Pill Badge
                </span>
                <span className="text-xs opacity-75 font-mono">DataSource Technology</span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                Enterprise Cloud Architecture &amp; Data Telemetry
              </h4>

              <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-xl">
                DataSource engineers robust, scalable data pipelines and executive dashboards that empower commercial decision making with real-time accuracy and zero latency.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div
                  className="px-4 py-2 rounded-xl text-xs font-bold border shadow-sm flex items-center gap-2"
                  style={{
                    backgroundColor: textColor,
                    color: bgColor,
                    borderColor: `${textColor}40`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Primary Button Simulation</span>
                </div>

                <div
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{
                    backgroundColor: 'transparent',
                    color: textColor,
                    borderColor: `${textColor}50`,
                  }}
                >
                  <span>Secondary Outline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Palette Swatch Explorer */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              DataSource Official Brand Palette Swatches
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any swatch to apply to active target: <strong className="text-cyan-400">{targetSlot === 'text' ? 'Foreground (Text)' : 'Background'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'primary-blue', 'primary-navy', 'accent-cyan', 'neutral'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0077FF] text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Swatch Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredPalette.map((color) => {
            const isSelectedText = textColor.toLowerCase() === color.hex.toLowerCase();
            const isSelectedBg = bgColor.toLowerCase() === color.hex.toLowerCase();

            return (
              <button
                key={color.hex + color.name}
                type="button"
                onClick={() => handlePaletteSelect(color.hex)}
                className={`p-3 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                  isSelectedText || isSelectedBg
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
                }`}
              >
                <div
                  className="w-full h-12 rounded-xl border border-black/10 shadow-inner mb-2.5 relative"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelectedText && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-cyan-300 font-mono text-[9px] font-bold">
                      TEXT
                    </span>
                  )}
                  {isSelectedBg && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] font-bold">
                      BG
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                  {color.name}
                </p>
                <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                  {color.hex}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
