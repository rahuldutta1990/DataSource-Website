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
        aria-label="KernelVane Logo Icon"
      >
        <defs>
          <linearGradient id="kv-icon-shaft" x1="110" y1="100" x2="170" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00B4D8" />
            <stop offset="1" stopColor="#0077FF" />
          </linearGradient>
        </defs>

        {/* Matrix grid rounded square nodes */}
        <rect x="20" y="90" width="18" height="18" rx="4" fill="#BAEEFB" fillOpacity="0.8" />
        <rect x="20" y="114" width="18" height="18" rx="4" fill="#BAEEFB" fillOpacity="0.8" />

        <rect x="44" y="66" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="90" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="114" width="18" height="18" rx="4" fill="#67E8F9" />

        <rect x="68" y="42" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="66" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="90" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="114" width="18" height="18" rx="4" fill="#38BDF8" />

        <rect x="92" y="66" width="18" height="18" rx="4" fill="#00A3FF" />
        <rect x="92" y="114" width="18" height="18" rx="4" fill="#00A3FF" />

        {/* Dynamic Arrow Shaft */}
        <rect x="110" y="86" width="60" height="28" rx="14" fill="url(#kv-icon-shaft)" />

        {/* Solid Chevron Arrow Head */}
        <path
          d="M148 44 C152 40 159 40 163 44 L216 95 C219 98 219 104 216 107 L163 158 C159 162 152 162 148 158 C144 154 144 147 148 143 L195 101 L148 59 C144 55 144 48 148 44 Z"
          fill="#0062F5"
        />
      </svg>
    );
  }

  const isWhite = variant === 'white-horizontal';
  const isCompact = variant === 'compact' || !showTagline;
  const viewBox = isCompact ? '0 0 740 145' : '0 0 780 190';
  const iconTransform = isCompact ? 'translate(10, -18)' : 'translate(10, 0)';

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
      aria-label="KernelVane - IT Consulting & Software • Code That Solves. Direction That Delivers."
    >
      <defs>
        <linearGradient id={`kv-shaft-${isWhite ? 'w' : 'd'}`} x1="110" y1="100" x2="170" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor={isWhite ? '#38BDF8' : '#00B4D8'} />
          <stop offset="1" stopColor={isWhite ? '#60A5FA' : '#0077FF'} />
        </linearGradient>
      </defs>

      {/* Left Emblem: Matrix & Arrow */}
      <g transform={iconTransform}>
        {/* Col 1 */}
        <rect x="20" y="90" width="18" height="18" rx="4" fill="#BAEEFB" fillOpacity={isWhite ? '0.7' : '0.8'} />
        <rect x="20" y="114" width="18" height="18" rx="4" fill="#BAEEFB" fillOpacity={isWhite ? '0.7' : '0.8'} />

        {/* Col 2 */}
        <rect x="44" y="66" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="90" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="114" width="18" height="18" rx="4" fill="#67E8F9" />

        {/* Col 3 */}
        <rect x="68" y="42" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="66" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="90" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="114" width="18" height="18" rx="4" fill="#38BDF8" />

        {/* Col 4 */}
        <rect x="92" y="66" width="18" height="18" rx="4" fill={isWhite ? '#38BDF8' : '#00A3FF'} />
        <rect x="92" y="114" width="18" height="18" rx="4" fill={isWhite ? '#38BDF8' : '#00A3FF'} />

        {/* Dynamic Arrow Shaft */}
        <rect x="110" y="86" width="60" height="28" rx="14" fill={`url(#kv-shaft-${isWhite ? 'w' : 'd'})`} />

        {/* Solid Chevron Arrow Head */}
        <path
          d="M148 44 C152 40 159 40 163 44 L216 95 C219 98 219 104 216 107 L163 158 C159 162 152 162 148 158 C144 154 144 147 148 143 L195 101 L148 59 C144 55 144 48 148 44 Z"
          fill={isWhite ? '#38BDF8' : '#0062F5'}
        />
      </g>

      {/* Right Typography Section */}
      <g transform="translate(248, 0)">
        {/* Brand Name: KernelVane */}
        <text
          x="0"
          y={isCompact ? '76' : '78'}
          fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize={isCompact ? '70' : '72'}
          letterSpacing="-0.03em"
          fill={isWhite ? '#FFFFFF' : '#0F172A'}
        >
          Kernel<tspan fill={isWhite ? '#38BDF8' : '#0080FF'}>Vane</tspan>
        </text>

        {/* Subtitle: IT CONSULTING & SOFTWARE */}
        <text
          x="2"
          y={isCompact ? '112' : '116'}
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="19"
          letterSpacing="0.28em"
          fill={isWhite ? '#94A3B8' : '#1E293B'}
        >
          I T   C O N S U L T I N G   &amp;   S O F T W A R E
        </text>

        {!isCompact && (
          <>
            <line
              x1="2"
              y1="134"
              x2="520"
              y2="134"
              stroke={isWhite ? '#334155' : '#CBD5E1'}
              strokeWidth="2"
            />
            {/* Tagline: Code That Solves. Direction That Delivers. */}
            <text
              x="2"
              y="164"
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontWeight="600"
              fontSize="20"
              letterSpacing="-0.01em"
              fill={isWhite ? '#CBD5E1' : '#475569'}
            >
              Code That Solves. Direction That Delivers.
            </text>
          </>
        )}
      </g>
    </svg>
  );
};

// Aliases for seamless drop-in everywhere across the codebase
export const KernelVaneLogo = DataSourceLogo;
export default DataSourceLogo;
