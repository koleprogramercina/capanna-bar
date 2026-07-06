import { Link } from 'react-router-dom';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { isBeach } = useSeason();
  const { text } = useLanguage();

  return (
    <footer className={`border-t py-12 px-6 transition-colors duration-700 ${
      isBeach
        ? 'bg-[#041410] border-[#00a896]/10'
        : 'bg-[#0a0705] border-[#d4af37]/10'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <BrandLogo size="md" className="mb-4" />
            <p className={`text-sm leading-relaxed max-w-xs ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>
              {text('Premium kafa, hrana i kokteli. Gradski lounge zimi, beach bar leti — uvek Capanna.', 'Premium coffee, food and cocktails. City lounge in winter, beach bar in summer — always Capanna.')}
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/capannabar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @capannabar"
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-300 hover:scale-110 ${
                  isBeach
                    ? 'bg-[#0a2820] border border-[#00a896]/15 hover:border-[#00a896]/40'
                    : 'bg-[#1a110b] border border-[#d4af37]/15 hover:border-[#d4af37]/40'
                }`}
              >
                📸
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className={`text-xs tracking-[0.3em] uppercase font-semibold mb-4 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              {text('Navigacija', 'Navigation')}
            </div>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: text('Početna', 'Home') },
                { to: '/meni', label: text('Cenovnik', 'Menu') },
                { to: '/galerija', label: text('Galerija', 'Gallery') },
                { to: '/kontakt', label: text('Kontakt', 'Contact') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${
                      isBeach ? 'text-white/40 hover:text-[#00a896]' : 'text-[#f5e6c8]/40 hover:text-[#d4af37]'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Location */}
          <div>
            <div className={`text-xs tracking-[0.3em] uppercase font-semibold mb-4 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              {text('Lokacija', 'Location')}
            </div>
            <div>
              <div className={`text-sm font-medium ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {isBeach ? '🌊 Brioni Beach' : '☕ City Bar'}
              </div>
              <div className={`text-xs mt-1 ${isBeach ? 'text-[#00a896]/70' : 'text-[#d4af37]/70'}`}>
                {isBeach ? text('Plaža Sava', 'Sava Beach') : 'Kuzminska 1'}
              </div>
              <div className={`text-xs ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>
                Sremska Mitrovica
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isBeach ? 'border-[#00a896]/10' : 'border-[#d4af37]/10'
        }`}>
          <div className={`text-xs ${isBeach ? 'text-white/20' : 'text-[#f5e6c8]/20'}`}>
            © {new Date().getFullYear()} Capanna Bar · Sremska Mitrovica · {text('Sva prava zadržana', 'All rights reserved')}
          </div>
          <div className={`text-xs flex items-center gap-2 ${isBeach ? 'text-[#00a896]/40' : 'text-[#d4af37]/40'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
            {isBeach ? text('Letnja sezona aktivna', 'Summer season active') : text('Zimska sezona aktivna', 'City season active')}
          </div>
        </div>
      </div>
    </footer>
  );
}
