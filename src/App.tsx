import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SeasonProvider, useSeason } from './context/SeasonContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import CursorTrail from './components/CursorTrail';
import AmbientEffect from './components/AmbientEffect';
import LoadingScreen from './components/LoadingScreen';
import FloatingInstagram from './components/FloatingInstagram';
import AnnouncementPopup from './components/AnnouncementPopup';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';

function ScrollToTop() {
const { pathname } = useLocation();
useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
return null;
}

function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    const timer = window.setTimeout(() => {
      document.querySelectorAll('section, .reveal').forEach(el => {
        if (el.classList.contains('reveal-in') || el.classList.contains('reveal-pending')) return;
        const rect = el.getBoundingClientRect();
        // Elementi već vidljivi pri učitavanju se ne sakrivaju (nema treperenja).
        if (rect.top > window.innerHeight * 0.9) {
          el.classList.add('reveal-pending');
          observer.observe(el);
        }
      });
    }, 350);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

function SeasonNotice() {
  const { season, activeSeason, setSeason } = useSeason();
  if (season === activeSeason) return null;
  const beachActive = activeSeason === 'beach';
  return (
    <div className="fixed inset-x-0 top-16 z-40 flex justify-center px-4 lg:top-20">
      <div
        className={`mt-2 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border px-4 py-2.5 text-center text-xs font-medium shadow-xl backdrop-blur-xl sm:text-sm ${
          beachActive
            ? 'border-[#00d6c0]/30 bg-[#04120f]/85 text-white/85'
            : 'border-[#d4af37]/30 bg-[#0d0804]/85 text-[#f5e6c8]/85'
        }`}
      >
        <span>
          {beachActive
            ? '🌊 Trenutno je letnja sezona — radimo na Brioni plaži, lokal na Kuzminskoj 1 je zatvoren.'
            : '☕ Trenutno je cafe sezona — radimo na Kuzminskoj 1, beach bar je zatvoren do leta.'}
        </span>
        <button
          onClick={() => setSeason(activeSeason)}
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            beachActive ? 'bg-[#00a896] text-white' : 'bg-[#d4af37] text-[#1a110b]'
          }`}
        >
          Vidi aktivnu
        </button>
      </div>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
const { pathname } = useLocation();
const [visible, setVisible] = useState(true);
const [key, setKey] = useState(pathname);

useEffect(() => {
setVisible(false);
const t = setTimeout(() => {
setKey(pathname);
setVisible(true);
}, 200);
return () => clearTimeout(t);
}, [pathname]);

return (
<div
key={key}
style={{
opacity: visible ? 1 : 0,
transform: visible ? 'translateY(0)' : 'translateY(12px)',
transition: 'opacity 0.5s ease, transform 0.5s ease',
}}
>
{children}
</div>
);
}

function AppRoutes() {
const { isBeach } = useSeason();
return (
<div data-season={isBeach ? 'beach' : 'city'}>
<LoadingScreen />
<ScrollToTop />
<ScrollReveal />
<CursorTrail />
<AmbientEffect />
<Navbar />
<SeasonNotice />
<FloatingInstagram />
<AnnouncementPopup />
<PageTransition>
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/meni" element={<MenuPage />} />
<Route path="/rezervacija" element={<ReservationPage />} />
<Route path="/galerija" element={<GalleryPage />} />
<Route path="/kontakt" element={<ContactPage />} />
<Route path="*" element={<HomePage />} />
</Routes>
</PageTransition>
</div>
);
}

export default function App() {
return (
<HashRouter>
<SeasonProvider>
<LanguageProvider>
<AppRoutes />
</LanguageProvider>
</SeasonProvider>
</HashRouter>
);
}
