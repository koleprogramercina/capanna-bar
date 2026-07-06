import { useEffect, useRef } from 'react';
import { useSeason } from '../context/SeasonContext';

export default function AmbientEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isBeach } = useSeason();
  const isBeachRef = useRef(isBeach);
  const animRef = useRef(0);

  useEffect(() => {
    isBeachRef.current = isBeach;
  }, [isBeach]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Beach: floating bubbles/particles
    // City: slow floating ember particles
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; phase: number; speed: number;
    }> = [];

    const spawnParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 0.8),
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
    });

    for (let i = 0; i < 30; i++) {
      const p = spawnParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    let elapsed = 0;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      elapsed += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const beach = isBeachRef.current;

      // Spawn new particles
      if (particles.length < 40 && Math.random() < 0.05) {
        particles.push(spawnParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * p.speed * 5 + p.phase) * 0.4;
        p.phase += p.speed;

        // Fade out near top
        const fadeHeight = canvas.height * 0.15;
        const fadeFactor = p.y < fadeHeight ? p.y / fadeHeight : 1;

        const alpha = p.opacity * fadeFactor;

        if (beach) {
          // Teal bubble
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 168, 150, ${alpha * 0.5})`;
          ctx.fill();
          // Ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 200, 200, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Amber ember
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          // Flicker
          const flicker = 0.8 + Math.sin(elapsed * 8 + p.phase * 3) * 0.2;
          ctx.fillStyle = `rgba(212, 175, 55, ${alpha * flicker * 0.6})`;
          ctx.fill();
          // Glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          gradient.addColorStop(0, `rgba(255, 180, 60, ${alpha * 0.15 * flicker})`);
          gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Remove if out of bounds
        if (p.y < -20) {
          particles.splice(i, 1);
        }
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6, mixBlendMode: 'screen' }}
    />
  );
}
