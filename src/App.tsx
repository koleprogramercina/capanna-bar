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
import EventsPage from './pages/EventsPage';

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
<FloatingInstagram />
<AnnouncementPopup />
<PageTransition>
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/meni" element={<MenuPage />} />
<Route path="/rezervacija" element={<ReservationPage />} />
<Route path="/dogadjaji" element={<EventsPage />} />
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
