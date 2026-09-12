import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Terminal, Shield, Activity, Radio, Binary, Sparkles } from 'lucide-react';

export const CyberCircuitTrace: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none ${className}`} aria-hidden="true">
      <svg
        className="w-full h-full opacity-20 dark:opacity-30"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 20 H120 L160 60 H280 L320 100 H390"
          stroke="url(#blue-cyan-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M40 180 H140 L180 140 H260 L300 80 H380"
          stroke="url(#blue-cyan-gradient)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        {/* Node joints */}
        <circle cx="120" cy="20" r="3" fill="#0077FF" />
        <circle cx="160" cy="60" r="3" fill="#38BDF8" />
        <circle cx="280" cy="60" r="3" fill="#0077FF" />
        <circle cx="320" cy="100" r="3" fill="#38BDF8" />
        <circle cx="140" cy="180" r="3" fill="#38BDF8" />
        <circle cx="180" cy="140" r="3" fill="#0077FF" />
        <circle cx="300" cy="80" r="3" fill="#38BDF8" />

        <defs>
          <linearGradient id="blue-cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0077FF" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const FloatingDataHologram: React.FC<{
  label: string;
  value: string;
  subtext?: string;
  icon?: 'cpu' | 'terminal' | 'shield' | 'activity';
  className?: string;
  delay?: number;
}> = ({ label, value, subtext, icon = 'activity', className = '', delay = 0 }) => {
  const IconComponent =
    icon === 'cpu'
      ? Cpu
      : icon === 'terminal'
      ? Terminal
      : icon === 'shield'
      ? Shield
      : Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      className={`relative inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-cyan-500/20 shadow-lg shadow-cyan-900/10 dark:shadow-cyan-950/40 select-none ${className}`}
    >
      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-[#0077FF] dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
        <IconComponent className="w-4 h-4" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80">
            {label}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">{value}</p>
        {subtext && <p className="text-[10px] text-slate-400">{subtext}</p>}
      </div>
    </motion.div>
  );
};

export const HolographicDataCube: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} aria-hidden="true">
      <motion.div
        animate={{ rotate: [0, 360], y: [0, -10, 0] }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="w-24 h-24 sm:w-32 sm:h-32 relative"
      >
        {/* Outer glowing geometric ring */}
        <div className="absolute inset-0 rounded-3xl border border-dashed border-cyan-400/30 dark:border-cyan-400/40 animate-spin [animation-duration:25s]" />
        {/* Inner diamond */}
        <div className="absolute inset-3 rounded-2xl border border-[#0077FF]/40 dark:border-[#0077FF]/50 rotate-45 backdrop-blur-[2px]" />
        {/* Glowing center orb */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#0077FF]/30 to-[#38BDF8]/40 blur-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Binary className="w-6 h-6 text-cyan-500 dark:text-cyan-300 opacity-60" />
        </div>
      </motion.div>
    </div>
  );
};
