import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface BackgroundBeamsProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
}

export const BackgroundBeams: React.FC<BackgroundBeamsProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check prefers-reduced-motion media query
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    // Subtle particles for depth
    const particleCount = 14;
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * (width || 800),
          y: Math.random() * (height || 600),
          radius: 0.8 + Math.random() * 1.4,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.08 - Math.random() * 0.12,
          alpha: 0.05 + Math.random() * 0.15,
          targetAlpha: 0.05 + Math.random() * 0.2,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();

      if (prefersReducedMotion) {
        drawStatic();
      }
    };

    const drawGrid = () => {
      const spacing = 36;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      const dotRadius = 1;

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      // Soft ambient blue glow in upper-right / hero focus
      const gradient = ctx.createRadialGradient(
        width * 0.7,
        height * 0.25,
        0,
        width * 0.7,
        height * 0.25,
        Math.max(width * 0.5, 300)
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.02)');
      gradient.addColorStop(1, 'rgba(9, 11, 16, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    let startTimestamp: number | null = null;

    const render = (now: number) => {
      if (prefersReducedMotion) {
        drawStatic();
        return;
      }

      if (startTimestamp === null) startTimestamp = now;
      const elapsed = (now - startTimestamp) * 0.001; // in seconds

      ctx.clearRect(0, 0, width, height);

      // 1. Base ambient dot grid
      drawGrid();

      // 2. Subtle animated ambient gradient glow
      const pulse = 0.06 + Math.sin(elapsed * 0.8) * 0.025;
      const glowX = width * 0.65 + Math.cos(elapsed * 0.4) * 40;
      const glowY = height * 0.3 + Math.sin(elapsed * 0.5) * 25;

      const radialGlow = ctx.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        Math.max(width * 0.55, 320)
      );
      radialGlow.addColorStop(0, `rgba(59, 130, 246, ${pulse.toFixed(3)})`);
      radialGlow.addColorStop(0.5, `rgba(59, 130, 246, ${(pulse * 0.3).toFixed(3)})`);
      radialGlow.addColorStop(1, 'rgba(9, 11, 16, 0)');

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Diagonal ambient light beams (moving slowly)
      const beamOffset1 = ((elapsed * 25) % (width + height * 0.8)) - height * 0.4;
      const beamOffset2 = (((elapsed * 18) + 300) % (width + height * 0.8)) - height * 0.4;

      const drawBeam = (offsetX: number, beamWidth: number, maxAlpha: number) => {
        ctx.save();
        ctx.translate(offsetX, 0);
        ctx.rotate((-32 * Math.PI) / 180);

        const beamGradient = ctx.createLinearGradient(-beamWidth / 2, 0, beamWidth / 2, 0);
        beamGradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        beamGradient.addColorStop(0.5, `rgba(59, 130, 246, ${maxAlpha})`);
        beamGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = beamGradient;
        ctx.fillRect(-beamWidth / 2, -height, beamWidth, height * 3);
        ctx.restore();
      };

      drawBeam(beamOffset1, 140, 0.04);
      drawBeam(beamOffset2, 100, 0.028);

      // 4. Floating micro-particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Gentle alpha breathing
        p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        if (Math.abs(p.targetAlpha - p.alpha) < 0.01) {
          p.targetAlpha = 0.04 + Math.random() * 0.18;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha.toFixed(3)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Resize observer setup
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();

    // Start loop or static draw
    if (prefersReducedMotion) {
      drawStatic();
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    // Handle motion preference change dynamically
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        drawStatic();
      } else if (animationFrameId === null) {
        startTimestamp = null;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else {
      // Fallback for older browsers
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={twMerge('pointer-events-none absolute inset-0 overflow-hidden select-none', className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block"
      />
    </div>
  );
};

export default BackgroundBeams;
