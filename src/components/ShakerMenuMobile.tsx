import { NavLink } from 'react-router-dom';
import { Home, Coffee, Calendar, Image, Phone, PartyPopper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onClose: () => void;
}

export default function ShakerMenuMobile({ onClose }: Props) {
  const { text } = useLanguage();

  const menuItems = [
    { to: '/meni', label: text('CENOVNIK', 'MENU'), icon: <Coffee size={22} />, end: false },
    { to: '/rezervacija', label: text('REZERVACIJA', 'RESERVATION'), icon: <Calendar size={22} />, end: false },
    { to: '/dogadjaji', label: text('DOGAĐAJI', 'EVENTS'), icon: <PartyPopper size={22} />, end: false },
    { to: '/galerija', label: text('GALERIJA', 'GALLERY'), icon: <Image size={22} />, end: false },
    { to: '/kontakt', label: text('KONTAKT', 'CONTACT'), icon: <Phone size={22} />, end: false },
  ];

  return (
    <div
      className="relative mx-auto flex items-start justify-center"
      style={{ width: '320px', height: '620px' }}
    >
      {/* SHAKER — realistic squat proportions matching reference photo */}
      <svg
        viewBox="0 0 280 620"
        className="nav-svg-in absolute left-1/2 top-4 -translate-x-1/2"
        style={{
          width: '280px',
          height: '600px',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.55))',
        }}
      >
        <defs>
          {/* Smooth soft chrome — no flicker */}
          <linearGradient id="bodyChrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a7a7a" />
            <stop offset="25%" stopColor="#c8c8c8" />
            <stop offset="50%" stopColor="#f0f0f0" />
            <stop offset="75%" stopColor="#b8b8b8" />
            <stop offset="100%" stopColor="#5a5a5a" />
          </linearGradient>

          <linearGradient id="capChrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a8a8a" />
            <stop offset="50%" stopColor="#f0f0f0" />
            <stop offset="100%" stopColor="#6a6a6a" />
          </linearGradient>

          <linearGradient id="collarChrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#707070" />
            <stop offset="50%" stopColor="#e0e0e0" />
            <stop offset="100%" stopColor="#5a5a5a" />
          </linearGradient>

          <linearGradient id="centerShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* ===== CAP (small top knob) ===== */}
        <path
          d="M 118 30
             Q 116 22, 124 20
             L 156 20
             Q 164 22, 162 30
             L 162 62
             Q 162 68, 156 68
             L 124 68
             Q 118 68, 118 62 Z"
          fill="url(#capChrome)"
          stroke="#4a4a4a"
          strokeWidth="0.8"
        />
        <ellipse cx="140" cy="26" rx="16" ry="2.5" fill="rgba(255,255,255,0.85)" />
        <line x1="118" y1="44" x2="162" y2="44" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
        <line x1="118" y1="54" x2="162" y2="54" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />

        {/* ===== COLLAR / STRAINER ===== */}
        <path
          d="M 108 68
             Q 104 68, 104 74
             L 104 128
             Q 104 134, 110 134
             L 170 134
             Q 176 134, 176 128
             L 176 74
             Q 176 68, 172 68 Z"
          fill="url(#collarChrome)"
          stroke="#4a4a4a"
          strokeWidth="0.8"
        />
        <rect x="104" y="70" width="72" height="2.5" fill="rgba(255,255,255,0.65)" />
        <rect x="104" y="130" width="72" height="2.5" fill="rgba(0,0,0,0.3)" />
        <rect x="122" y="78" width="10" height="48" rx="3" fill="rgba(255,255,255,0.4)" />

        {/* ===== MAIN BODY (SQUAT & WIDE like reference) ===== */}
        <path
          d="M 104 132
             Q 90 148, 74 200
             Q 56 280, 56 400
             Q 56 520, 82 560
             Q 108 590, 140 590
             Q 172 590, 198 560
             Q 224 520, 224 400
             Q 224 280, 206 200
             Q 190 148, 176 132 Z"
          fill="url(#bodyChrome)"
          stroke="#5a5a5a"
          strokeWidth="1"
        />

        {/* Soft center highlight — subtle, no flicker */}
        <ellipse cx="140" cy="380" rx="42" ry="220" fill="url(#centerShine)" opacity="0.6" />

        {/* Left edge highlight */}
        <path
          d="M 66 220 Q 60 340, 62 500 Q 68 540, 82 560"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Right edge shadow */}
        <path
          d="M 214 220 Q 220 340, 218 500 Q 212 540, 198 560"
          fill="none"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1.2"
        />

        {/* Bottom shadow */}
        <ellipse cx="140" cy="588" rx="48" ry="4" fill="rgba(0,0,0,0.35)" />
      </svg>

      {/* HOME BUTTON — over the collar */}
      <NavLink
        to="/"
        end
        onClick={onClose}
        className="absolute left-1/2 -translate-x-1/2 z-10 group"
        style={{ top: '100px' }}
      >
        {({ isActive }) => (
          <div className="nav-item-in flex flex-col items-center justify-center" style={{ animationDelay: '120ms' }}>
            <Home
              size={20}
              className={`transition-all group-hover:scale-110 ${
                isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'
              }`}
            />
            <span
              className={`text-[10px] font-bold tracking-[0.08em] mt-0.5 whitespace-nowrap ${
                isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'
              }`}
            >
              {text('POČETNA', 'HOME')}
            </span>
            {isActive && <div className="w-3 h-[2px] rounded-full bg-[#00877a] mt-0.5" />}
          </div>
        )}
      </NavLink>

      {/* MENU ITEMS — distributed vertically along the wide body */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-between z-10"
        style={{
          top: '205px',
          height: '300px',
          width: '200px',
        }}
      >
        {menuItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className="flex flex-col items-center justify-center group"
          >
            {({ isActive }) => (
              <div className="nav-item-in flex flex-col items-center justify-center" style={{ animationDelay: `${200 + index * 70}ms` }}>
                <div
                  className={`transition-all group-hover:scale-110 ${
                    isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))' }}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[12px] font-bold tracking-[0.12em] mt-1 whitespace-nowrap ${
                    isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'
                  }`}
                  style={{ textShadow: '0 1px 1px rgba(255,255,255,0.3)' }}
                >
                  {item.label}
                </span>
                {isActive && <div className="w-4 h-[2px] rounded-full bg-[#00877a] mt-1" />}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
