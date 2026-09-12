import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const AmbientTechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes configuration
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles: Particle[] = [];

    const colors = [
      'rgba(0, 119, 255, ',    // Primary Brand Blue
      'rgba(56, 189, 248, ',   // Sky Cyan
      'rgba(99, 102, 241, ',   // Indigo Accent
      'rgba(14, 165, 233, ',   // Electric Blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Mouse interactivity
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle floating data particles and connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive mouse repulsion/pull
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (140 - dist) / 140;
            p.x += (dx / dist) * force * 0.6;
            p.y += (dy / dist) * force * 0.6;
          }
        }

        // Pulse alpha
        const currentAlpha = p.alpha + Math.sin(tick * p.pulseSpeed + p.pulsePhase) * 0.15;
        const clampedAlpha = Math.max(0.05, Math.min(0.65, currentAlpha));

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${clampedAlpha})`;
        ctx.fill();

        // Connect with nearby neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 140, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic Animated Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 dark:opacity-75" />

      {/* Futuristic Ambient Glowing Aurora Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#0077FF]/12 via-[#38BDF8]/10 to-transparent rounded-full blur-[120px] dark:from-[#0077FF]/15 dark:via-[#0284C7]/10 animate-pulse [animation-duration:8s]" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-[#6366F1]/10 via-[#0077FF]/08 to-transparent rounded-full blur-[130px] dark:from-[#4F46E5]/15 dark:via-[#0284C7]/12 animate-pulse [animation-duration:11s]" />
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-[#0284C7]/10 via-[#0077FF]/06 to-transparent rounded-full blur-[140px] dark:from-[#0284C7]/15 dark:via-[#38BDF8]/10 animate-pulse [animation-duration:9s]" />

      {/* Isometric Cyber Grid Pattern Layer */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        style={{
          backgroundImage: `linear-gradient(to right, #0077FF 1px, transparent 1px), linear-gradient(to bottom, #0077FF 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Imaginary floating micro tech coordinates & telemetry streams */}
      <div className="hidden xl:block absolute top-28 left-8 text-[9px] font-mono text-cyan-600/30 dark:text-cyan-400/25 tracking-widest space-y-1 select-none">
        <p>SYS.DS_NODE://40.7128° N, 74.0060° W</p>
        <p>STREAM: DATA_CORE_PIPELINE_V4.2</p>
        <p>STATUS: OPTIMAL · LATENCY: 0.18ms</p>
      </div>

      <div className="hidden xl:block absolute bottom-24 right-8 text-[9px] font-mono text-blue-600/30 dark:text-sky-400/25 tracking-widest space-y-1 select-none text-right">
        <p>SEC_ENCLAVE: TLS 1.3 · SHA-512</p>
        <p>INTEGRITY: 100% · CLOUD_SYNC: OK</p>
        <p>ARCH_REVISION: 2026.09</p>
      </div>
    </div>
  );
};
