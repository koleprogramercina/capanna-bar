import { useEffect, useRef } from 'react';
import { useSeason } from '../context/SeasonContext';

interface TrailDot {
  x: number;
  y: number;
  age: number;
  size: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isBeach } = useSeason();
  const isBeachRef = useRef(isBeach);
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef(0);

  useEffect(() => {
    isBeachRef.current = isBeach;
  }, [isBeach]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on touch devices — there is no mouse cursor to trail, and the
    // constant rAF loop would just waste battery/CPU on phones & tablets.
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Add new dot
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        size: Math.random() * 4 + 2,
      });
      // Limit trail length
      if (trailRef.current.length > 40) {
        trailRef.current.shift();
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const beach = isBeachRef.current;

      trailRef.current.forEach((dot) => {
        dot.age += 1;
        const progress = dot.age / 60;
        const opacity = Math.max(0, 0.6 - progress * 0.8);
        const size = dot.size * (1 - progress * 0.5);

        if (opacity <= 0) return;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0, size), 0, Math.PI * 2);

        if (beach) {
          // Water ripple – teal/cyan
          ctx.fillStyle = `rgba(0, 168, 150, ${opacity * 0.7})`;
          ctx.fill();
          // Ripple ring
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size * (1 + progress * 2), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 200, 179, ${opacity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Sand/golden particles for city mode
          ctx.fillStyle = `rgba(212, 175, 55, ${opacity * 0.6})`;
          ctx.fill();
        }
      });

      // Remove old dots
      trailRef.current = trailRef.current.filter(d => d.age < 60);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Custom cursor dot
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
