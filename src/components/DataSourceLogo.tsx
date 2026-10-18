import React from 'react';

export interface DataSourceLogoProps {
  variant?: 'horizontal' | 'icon-only' | 'white-horizontal' | 'compact';
  className?: string;
  showTagline?: boolean;
}

export const DataSourceLogo: React.FC<DataSourceLogoProps> = ({
  variant = 'horizontal',
  className = 'h-10',
  showTagline = true,
}) => {
  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Kernal Vane Technology Icon"
      >
        <defs>
          <linearGradient id="kv-vane-grad-1" x1="20" y1="20" x2="220" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#0077FF" />
            <stop offset="100%" stopColor="#0A2540" />
          </linearGradient>
          <linearGradient id="kv-vane-grad-2" x1="50" y1="40" x2="190" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0055EE" />
          </linearGradient>
        </defs>

        {/* Neural Grid Nodes representing AI Matrix */}
        <rect x="22" y="90" width="16" height="16" rx="4" fill="#A5F3FC" fillOpacity="0.85" />
        <rect x="44" y="66" width="16" height="16" rx="4" fill="#67E8F9" />
        <rect x="44" y="90" width="16" height="16" rx="4" fill="#67E8F9" />
        <rect x="44" y="114" width="16" height="16" rx="4" fill="#67E8F9" />

        <rect x="66" y="42" width="16" height="16" rx="4" fill="#38BDF8" />
        <rect x="66" y="66" width="16" height="16" rx="4" fill="#38BDF8" />
        <rect x="66" y="90" width="16" height="16" rx="4" fill="#38BDF8" />
        <rect x="66" y="114" width="16" height="16" rx="4" fill="#38BDF8" />
        <rect x="66" y="138" width="16" height="16" rx="4" fill="#38BDF8" />

        {/* Dynamic Vane Wing A (Ascending Kernel Blade) */}
        <path
          d="M92 48 L152 48 C160 48 166 54 163 62 L128 148 C125 155 117 158 110 154 L84 138 C78 134 78 126 83 121 L120 74 L92 74 C86 74 82 70 84 64 Z"
          fill="url(#kv-vane-grad-2)"
        />

        {/* Dynamic Vane Wing B (Forward AI Thrust Arrow) */}
        <path
          d="M138 42 C143 37 151 38 156 43 L216 94 C220 97 220 103 216 106 L156 157 C151 162 143 163 138 158 C133 153 134 145 139 140 L194 100 L139 60 C134 55 133 47 138 42 Z"
          fill="#0077FF"
        />

        {/* High-Tech Core Inset Accent */}
        <path
          d="M162 66 C165 63 170 64 173 67 L206 97 C208 99 208 101 206 103 L173 133 C170 136 165 137 162 134 C159 131 160 126 163 123 L192 100 L163 77 C160 74 159 69 162 66 Z"
          fill="#0A387E"
        />
      </svg>
    );
  }

  const isWhite = variant === 'white-horizontal';
  const viewBox = showTagline ? '0 0 780 190' : '0 0 740 160';
  const iconTransform = showTagline ? 'translate(10, 0)' : 'translate(10, -12)';

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
      aria-label="Kernal Vane Technology - IT Consulting and Software Technology in the AI Era"
    >
      <defs>
        <linearGradient id={`kv-grad-${isWhite ? 'w' : 'd'}`} x1="90" y1="40" x2="220" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor={isWhite ? '#38BDF8' : '#0077FF'} />
          <stop offset="100%" stopColor={isWhite ? '#60A5FA' : '#0A2540'} />
        </linearGradient>
        <linearGradient id={`arrow-grad-${isWhite ? 'w' : 'd'}`} x1="110" y1="100" x2="170" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A3FF" />
          <stop offset="1" stopColor={isWhite ? '#38BDF8' : '#0077FF'} />
        </linearGradient>
      </defs>

      {/* Left Brand Mark (Kernal Vane AI Grid & Blade Emblem) */}
      <g transform={iconTransform}>
        <rect x="20" y="90" width="18" height="18" rx="4" fill="#A5F3FC" fillOpacity="0.85" />
        <rect x="44" y="65" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="90" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="115" width="18" height="18" rx="4" fill="#67E8F9" />

        <rect x="68" y="40" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="65" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="90" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="115" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="140" width="18" height="18" rx="4" fill="#38BDF8" />

        <rect x="92" y="65" width="18" height="18" rx="4" fill={isWhite ? '#38BDF8' : '#00A3FF'} />
        <rect x="92" y="90" width="18" height="18" rx="4" fill={isWhite ? '#38BDF8' : '#00A3FF'} />
        <rect x="92" y="115" width="18" height="18" rx="4" fill={isWhite ? '#38BDF8' : '#00A3FF'} />

        {/* Dynamic Vane Arrow Core */}
        <rect x="110" y="86" width="60" height="28" rx="14" fill={`url(#arrow-grad-${isWhite ? 'w' : 'd'})`} />

        <path
          d="M148 45 C152 41 158 41 162 45 L215 94 C218 97 218 103 215 106 L162 155 C158 159 152 159 148 155 C144 151 144 145 148 141 L195 100 L148 59 C144 55 144 49 148 45 Z"
          fill={isWhite ? '#38BDF8' : '#0077FF'}
        />

        <path
          d="M168 65 C170 63 173 63 175 65 L208 97 C210 99 210 101 208 103 L175 135 C173 137 170 137 168 135 C166 133 166 129 168 127 L197 100 L168 73 C166 71 166 67 168 65 Z"
          fill={isWhite ? '#0B1B2B' : '#0A387E'}
        />
      </g>

      {/* Right Typography Section */}
      <g transform="translate(256, 0)">
        {/* Brand Name: Kernal Vane */}
        <text
          x="0"
          y={showTagline ? '78' : '82'}
          fontFamily="'Outfit', -apple-system, sans-serif"
          fontWeight="700"
          fontSize={showTagline ? '68' : '66'}
          letterSpacing="-0.03em"
          fill={isWhite ? '#FFFFFF' : '#0B1B2B'}
        >
          Kernal<tspan fill={isWhite ? '#38BDF8' : '#0077FF'}> Vane</tspan>
        </text>

        {/* Subtitle: TECHNOLOGY */}
        <text
          x="2"
          y={showTagline ? '116' : '122'}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="700"
          fontSize={showTagline ? '20' : '19'}
          letterSpacing="0.28em"
          fill={isWhite ? '#94A3B8' : '#1E293B'}
        >
          TECHNOLOGY
        </text>

        {showTagline && (
          <>
            <line
              x1="2"
              y1="134"
              x2="520"
              y2="134"
              stroke={isWhite ? '#334155' : '#CBD5E1'}
              strokeWidth="2"
            />
            {/* Tagline: IT Consulting and Software Technology in the AI Era */}
            <text
              x="2"
              y={showTagline ? '162' : '160'}
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="600"
              fontSize="19"
              letterSpacing="-0.01em"
              fill={isWhite ? '#CBD5E1' : '#475569'}
            >
              IT Consulting and Software Technology in the AI Era
            </text>
          </>
        )}
      </g>
    </svg>
  );
};

// Aliases for seamless drop-in everywhere across the codebase
export const KernalVaneLogo = DataSourceLogo;
export const KernelVaneLogo = DataSourceLogo;
