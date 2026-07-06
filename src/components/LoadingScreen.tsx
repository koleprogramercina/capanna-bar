import { useEffect, useState } from 'react';
import { useSeason } from '../context/SeasonContext';
import BrandLogo from './BrandLogo';

export default function LoadingScreen() {
  const { isBeach } = useSeason();
  const [visible, setVisible] = useState(() => sessionStorage.getItem('capanna-loader-seen') !== 'true');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem('capanna-loader-seen', 'true');
    const t1 = setTimeout(() => setFadeOut(true), 700);
    const t2 = setTimeout(() => setVisible(false), 1050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-500"
      style={{
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
        background: isBeach
          ? 'linear-gradient(135deg, #041410 0%, #0a2820 50%, #071a17 100%)'
          : 'linear-gradient(135deg, #0f0a06 0%, #1a110b 50%, #0a0705 100%)',
      }}
    >
      {/* Logo animation */}
      <div className="text-center">
        <BrandLogo size="lg" withText={false} className="mb-6 justify-center" />

        <h1
          className={`font-display font-bold text-4xl tracking-[0.3em] uppercase ${
            isBeach ? 'text-white' : 'text-[#f5e6c8]'
          }`}
          style={{ animation: 'fadeSlideUp 0.45s ease forwards', animationDelay: '0.08s', opacity: 0 }}
        >
          CAPANNA
        </h1>
        <div
          className={`mt-2 text-xs tracking-[0.5em] uppercase font-light ${
            isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
          }`}
          style={{ animation: 'fadeSlideUp 0.45s ease forwards', animationDelay: '0.18s', opacity: 0 }}
        >
          {isBeach ? 'Beach & Cocktail Bar' : 'Coffee & Lounge Bar'}
        </div>

        {/* Progress bar */}
        <div className={`mt-10 w-48 h-px mx-auto ${isBeach ? 'bg-[#00a896]/15' : 'bg-[#d4af37]/15'}`}>
          <div
            className={`h-full ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'}`}
            style={{
              width: '100%',
              animation: 'progressGrow 0.65s ease forwards',
              transformOrigin: 'left',
            }}
          />
        </div>

        <div
          className={`mt-4 text-xs tracking-[0.3em] uppercase font-medium ${
            isBeach ? 'text-white/25' : 'text-[#f5e6c8]/25'
          }`}
          style={{ animation: 'fadeSlideUp 0.45s ease forwards', animationDelay: '0.28s', opacity: 0 }}
        >
          Sremska Mitrovica
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
