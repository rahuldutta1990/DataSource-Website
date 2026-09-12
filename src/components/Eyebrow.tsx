import React from 'react';

interface EyebrowProps {
  text: string;
  variant?: 'blue' | 'cyan' | 'dark' | 'white';
  className?: string;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ text, variant = 'blue', className = '' }) => {
  let badgeStyle = 'bg-[#0077FF]/10 text-[#0066FF] border border-[#0077FF]/20';
  let dotStyle = 'bg-[#0077FF]';

  if (variant === 'cyan') {
    badgeStyle = 'bg-[#38BDF8]/15 text-[#0284C7] border border-[#38BDF8]/30';
    dotStyle = 'bg-[#38BDF8]';
  } else if (variant === 'dark') {
    badgeStyle = 'bg-[#0B1B2B]/10 text-[#0B1B2B] border border-[#0B1B2B]/20';
    dotStyle = 'bg-[#0B1B2B]';
  } else if (variant === 'white') {
    badgeStyle = 'bg-white/10 text-white border border-white/20';
    dotStyle = 'bg-[#38BDF8]';
  }

  return (
    <div className={`badge-indicator ${badgeStyle} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyle} animate-pulse`} />
      <span>{text}</span>
    </div>
  );
};
