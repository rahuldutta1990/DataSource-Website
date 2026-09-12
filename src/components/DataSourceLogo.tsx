import React from 'react';

interface DataSourceLogoProps {
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
        aria-label="DataSource Icon"
      >
        <rect x="20" y="90" width="18" height="18" rx="4" fill="#A5F3FC" fillOpacity="0.85" />
        <rect x="44" y="65" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="90" width="18" height="18" rx="4" fill="#67E8F9" />
        <rect x="44" y="115" width="18" height="18" rx="4" fill="#67E8F9" />
        
        <rect x="68" y="40" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="65" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="90" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="115" width="18" height="18" rx="4" fill="#38BDF8" />
        <rect x="68" y="140" width="18" height="18" rx="4" fill="#38BDF8" />

        <rect x="92" y="65" width="18" height="18" rx="4" fill="#00A3FF" />
        <rect x="92" y="90" width="18" height="18" rx="4" fill="#00A3FF" />
        <rect x="92" y="115" width="18" height="18" rx="4" fill="#00A3FF" />

        <rect x="110" y="86" width="60" height="28" rx="14" fill="url(#icon-grad)" />

        <path
          d="M148 45 C152 41 158 41 162 45 L215 94 C218 97 218 103 215 106 L162 155 C158 159 152 159 148 155 C144 151 144 145 148 141 L195 100 L148 59 C144 55 144 49 148 45 Z"
          fill="#0077FF"
        />
        
        <path
          d="M168 65 C170 63 173 63 175 65 L208 97 C210 99 210 101 208 103 L175 135 C173 137 170 137 168 135 C166 133 166 129 168 127 L197 100 L168 73 C166 71 166 67 168 65 Z"
          fill="#0A387E"
        />

        <defs>
          <linearGradient id="icon-grad" x1="110" y1="100" x2="170" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00A3FF" />
            <stop offset="1" stopColor="#0077FF" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  const isWhite = variant === 'white-horizontal';

  return (
    <svg
      viewBox="0 0 900 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DataSource Technology & Solutions Logo"
    >
      {/* Left Brand Mark */}
      <g transform="translate(10, 20)">
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
      <g transform="translate(320, 20)">
        <text
          x="0"
          y="75"
          fontFamily="'Outfit', -apple-system, sans-serif"
          fontWeight="700"
          fontSize="76"
          letterSpacing="-0.03em"
          fill={isWhite ? '#FFFFFF' : '#0B1B2B'}
        >
          Data<tspan fill={isWhite ? '#38BDF8' : '#0077FF'}>Source</tspan>
        </text>
        
        <text
          x="4"
          y="125"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="700"
          fontSize="21"
          letterSpacing="0.28em"
          fill={isWhite ? '#94A3B8' : '#1E293B'}
        >
          TECHNOLOGY &amp; SOLUTIONS
        </text>
        
        {showTagline && (
          <>
            <line
              x1="4"
              y1="145"
              x2="490"
              y2="145"
              stroke={isWhite ? '#334155' : '#CBD5E1'}
              strokeWidth="2"
            />
            <text
              x="4"
              y="180"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="500"
              fontSize="22"
              letterSpacing="-0.01em"
              fill={isWhite ? '#CBD5E1' : '#64748B'}
            >
              Technology That Solves. Data That Drives.
            </text>
          </>
        )}
      </g>

      <defs>
        <linearGradient id="arrow-grad-d" x1="110" y1="100" x2="170" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A3FF" />
          <stop offset="1" stopColor="#0077FF" />
        </linearGradient>
        <linearGradient id="arrow-grad-w" x1="110" y1="100" x2="170" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A3FF" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
