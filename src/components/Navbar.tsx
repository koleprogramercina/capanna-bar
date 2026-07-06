import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Coffee, Martini, Sparkles } from 'lucide-react';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';
import PortafilterMenu from './PortafilterMenu';
import ShakerMenu from './ShakerMenu';
import PortafilterMenuMobile from './PortafilterMenuMobile';
import ShakerMenuMobile from './ShakerMenuMobile';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { isBeach, toggleSeason } = useSeason();
  const { language, toggleLanguage, text } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? isBeach
            ? 'border-b border-white/[0.06] bg-[#04120f]/55 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150'
            : 'border-b border-white/[0.06] bg-[#0d0804]/55 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-10">
        <NavLink to="/" className="group flex items-center gap-3">
          <BrandLogo size="sm" />
        </NavLink>

        <div className="hidden items-center justify-center md:flex">
          <div className={`nav-instrument ${isBeach ? 'nav-instrument--beach' : 'nav-instrument--city'}`}>
            {isBeach ? <ShakerMenu /> : <PortafilterMenu />}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleLanguage}
            className={`hidden h-9 items-center rounded-full border p-1 text-xs font-bold tracking-widest transition-all sm:flex ${
              isBeach
                ? 'border-[#00d6c0]/25 bg-[#06241f]/70 text-white'
                : 'border-[#d4af37]/25 bg-[#1a110b]/70 text-[#f5e6c8]'
            }`}
            aria-label={text('Promeni jezik', 'Change language')}
          >
            <span className={`rounded-full px-2.5 py-1 transition-colors ${language === 'sr' ? (isBeach ? 'bg-[#00a896] text-white' : 'bg-[#d4af37] text-[#1a110b]') : 'opacity-55'}`}>
              SR
            </span>
            <span className={`rounded-full px-2.5 py-1 transition-colors ${language === 'en' ? (isBeach ? 'bg-[#00a896] text-white' : 'bg-[#d4af37] text-[#1a110b]') : 'opacity-55'}`}>
              EN
            </span>
          </button>

          <button
            onClick={toggleSeason}
            className={`season-toggle ${isBeach ? 'season-toggle--beach' : 'season-toggle--city'}`}
            aria-label={isBeach ? text('Prebaci na cafe sezonu', 'Switch to cafe season') : text('Prebaci na beach sezonu', 'Switch to beach season')}
            title={isBeach ? text('Prebaci na cafe sezonu', 'Switch to cafe season') : text('Prebaci na beach sezonu', 'Switch to beach season')}
          >
            <span className="season-toggle__label hidden sm:inline">{isBeach ? 'Beach' : 'Cafe'}</span>
            <span className="season-toggle__track">
              <span className="season-toggle__trail" />
              <span className="season-toggle__spark season-toggle__spark--one" />
              <span className="season-toggle__spark season-toggle__spark--two" />
              <span className="season-toggle__spark season-toggle__spark--three" />
              <span className="season-toggle__thumb">
                {isBeach ? <Martini size={16} strokeWidth={2.4} /> : <Coffee size={16} strokeWidth={2.4} />}
              </span>
            </span>
            <Sparkles className="season-toggle__glint hidden sm:block" size={14} strokeWidth={2.2} />
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={`relative flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border transition-all duration-300 md:hidden ${
              menuOpen
                ? isBeach
                  ? 'border-[#00a896] bg-[#00a896] shadow-lg shadow-teal-500/30'
                  : 'border-[#d4af37] bg-[#d4af37] shadow-lg shadow-amber-500/30'
                : isBeach
                  ? 'border-[#00a896]/20 bg-[#06241f]/65'
                  : 'border-[#d4af37]/20 bg-[#1a110b]/65'
            }`}
            aria-label={menuOpen ? text('Zatvori meni', 'Close menu') : text('Otvori meni', 'Open menu')}
            aria-expanded={menuOpen}
          >
            <span className={`block h-0.5 w-6 transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''} ${menuOpen ? (isBeach ? 'bg-white' : 'bg-[#1a110b]') : isBeach ? 'bg-white' : 'bg-[#f5e6c8]'}`} />
            <span className={`block h-0.5 w-6 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${menuOpen ? (isBeach ? 'bg-white' : 'bg-[#1a110b]') : isBeach ? 'bg-white' : 'bg-[#f5e6c8]'}`} />
            <span className={`block h-0.5 w-6 transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''} ${menuOpen ? (isBeach ? 'bg-white' : 'bg-[#1a110b]') : isBeach ? 'bg-white' : 'bg-[#f5e6c8]'}`} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 top-16 transition-all duration-500 md:hidden ${
          menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'
        } ${isBeach ? 'bg-[#041410]/98' : 'bg-[#0a0705]/98'} backdrop-blur-2xl`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isBeach
              ? 'bg-gradient-to-b from-[#00a896]/12 via-transparent to-[#ff4e50]/8'
              : 'bg-gradient-to-b from-[#d4af37]/12 via-transparent to-[#8B5E3C]/8'
          }`}
        />

        <div className="relative flex h-full flex-col items-center justify-start pt-4">
          {isBeach ? <ShakerMenuMobile onClose={() => setMenuOpen(false)} /> : <PortafilterMenuMobile onClose={() => setMenuOpen(false)} />}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-6">
          <a
            href="https://instagram.com/capannabar"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 font-semibold transition-transform active:scale-[0.98] ${
              isBeach
                ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-950/35'
                : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-950/35'
            }`}
          >
            <span>{text('Instagram rezervacije', 'Instagram bookings')}</span>
            <span className="text-xl">↗</span>
          </a>
          <div className={`flex items-center justify-center gap-2 text-xs ${isBeach ? 'text-white/35' : 'text-[#f5e6c8]/35'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'}`} />
            {isBeach ? text('Letnja sezona aktivna', 'Summer season active') : text('Cafe sezona aktivna', 'Cafe season active')}
          </div>
        </div>
      </div>
    </nav>
  );
}
