import { NavLink } from 'react-router-dom';
import { Home, Coffee, Calendar, Image, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onClose: () => void;
}

export default function PortafilterMenuMobile({ onClose }: Props) {
  const { text } = useLanguage();

  const menuItems = [
    { to: '/meni', label: text('CENOVNIK', 'MENU'), icon: <Coffee size={22} />, end: false },
    { to: '/rezervacija', label: text('REZERVACIJA', 'RESERVATION'), icon: <Calendar size={22} />, end: false },
    { to: '/galerija', label: text('GALERIJA', 'GALLERY'), icon: <Image size={22} />, end: false },
    { to: '/kontakt', label: text('KONTAKT', 'CONTACT'), icon: <Phone size={22} />, end: false },
  ];

  return (
    <div
      className="relative mx-auto flex items-start justify-center"
      style={{ width: '320px', height: '560px' }}
    >
      <svg
        viewBox="0 0 280 660"
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: '290px',
          height: '600px',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.55))',
        }}
      >
        <defs>
          <radialGradient id="cupChrome" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fafafa" />
            <stop offset="30%" stopColor="#d8d8d8" />
            <stop offset="60%" stopColor="#a8a8a8" />
            <stop offset="85%" stopColor="#7a7a7a" />
            <stop offset="100%" stopColor="#4a4a4a" />
          </radialGradient>

          <linearGradient id="spoutChrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a7a7a" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#5a5a5a" />
          </linearGradient>

          <linearGradient id="handleRubber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>

          <linearGradient id="handleShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <radialGradient id="earChrome" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="60%" stopColor="#909090" />
            <stop offset="100%" stopColor="#4a4a4a" />
          </radialGradient>
        </defs>

        {/* Ears */}
        <ellipse cx="52" cy="110" rx="16" ry="22" fill="url(#earChrome)" stroke="#3a3a3a" strokeWidth="0.8" />
        <circle cx="52" cy="108" r="2.8" fill="#2a2a2a" />
        <circle cx="52" cy="108" r="1.2" fill="#5a5a5a" />

        <ellipse cx="228" cy="110" rx="16" ry="22" fill="url(#earChrome)" stroke="#3a3a3a" strokeWidth="0.8" />
        <circle cx="228" cy="108" r="2.8" fill="#2a2a2a" />
        <circle cx="228" cy="108" r="1.2" fill="#5a5a5a" />

        {/* Chrome outer cup */}
        <circle cx="140" cy="110" r="82" fill="url(#cupChrome)" stroke="#3a3a3a" strokeWidth="1.5" />

        {/* SOLID BROWN COFFEE — big and visible */}
        <circle cx="140" cy="110" r="70" fill="#5c2e0d" />
        
        {/* Coffee gradient overlay for depth */}
        <circle cx="140" cy="110" r="70" fill="url(#coffeeShine)" />

        {/* Coffee texture — lots of speckles */}
        <circle cx="115" cy="85" r="1.6" fill="#c98a5a" opacity="0.7" />
        <circle cx="165" cy="92" r="1.4" fill="#c98a5a" opacity="0.65" />
        <circle cx="130" cy="130" r="1.5" fill="#c98a5a" opacity="0.7" />
        <circle cx="175" cy="122" r="1.2" fill="#8b4513" opacity="0.9" />
        <circle cx="105" cy="122" r="1.4" fill="#8b4513" opacity="0.85" />
        <circle cx="152" cy="78" r="1.1" fill="#c98a5a" opacity="0.65" />
        <circle cx="125" cy="105" r="1" fill="#8b4513" opacity="0.9" />
        <circle cx="160" cy="145" r="1.3" fill="#c98a5a" opacity="0.6" />
        <circle cx="108" cy="145" r="1.2" fill="#8b4513" opacity="0.85" />
        <circle cx="185" cy="100" r="1.1" fill="#c98a5a" opacity="0.65" />
        <circle cx="92" cy="105" r="1.1" fill="#8b4513" opacity="0.85" />
        <circle cx="148" cy="158" r="1" fill="#c98a5a" opacity="0.6" />
        <circle cx="120" cy="70" r="0.9" fill="#8b4513" opacity="0.9" />
        <circle cx="170" cy="70" r="1.1" fill="#c98a5a" opacity="0.6" />
        <circle cx="100" cy="88" r="1" fill="#8b4513" opacity="0.85" />
        <circle cx="188" cy="128" r="1.1" fill="#8b4513" opacity="0.85" />
        <circle cx="95" cy="148" r="1" fill="#c98a5a" opacity="0.6" />
        <circle cx="178" cy="155" r="0.9" fill="#8b4513" opacity="0.85" />
        <circle cx="140" cy="90" r="0.8" fill="#c98a5a" opacity="0.65" />
        <circle cx="140" cy="140" r="0.9" fill="#8b4513" opacity="0.85" />

        {/* Dark inner ring shadow */}
        <circle cx="140" cy="110" r="70" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />

        
        {/* Spout collar */}
        <rect x="124" y="188" width="32" height="22" rx="2.5" fill="url(#spoutChrome)" stroke="#3a3a3a" strokeWidth="0.8" />
        <rect x="128" y="192" width="5" height="14" fill="rgba(255,255,255,0.5)" />
        <rect x="146" y="192" width="3" height="14" fill="rgba(0,0,0,0.25)" />
        <circle cx="132" cy="199" r="1.4" fill="#404040" />
        <circle cx="148" cy="199" r="1.4" fill="#404040" />

        {/* Handle — široka drška da meni stavke stanu unutar nje */}
        <path
          d="M 122 210
             Q 100 217, 94 238
             Q 82 310, 80 400
             Q 78 500, 86 578
             Q 91 620, 108 637
             Q 140 650, 172 637
             Q 189 620, 194 578
             Q 202 500, 200 400
             Q 198 310, 186 238
             Q 180 217, 158 210 Z"
          fill="url(#handleRubber)"
          stroke="#000000"
          strokeWidth="0.8"
        />

        <path
          d="M 118 232 Q 106 350, 106 510 Q 111 588, 124 624 Q 140 631, 156 624 Q 145 588, 145 510 Q 145 350, 138 232 Z"
          fill="url(#handleShine)"
          opacity="0.7"
        />
        <path
          d="M 92 250 Q 85 400, 90 560"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M 188 250 Q 195 400, 190 560"
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1.5"
        />

        <ellipse cx="140" cy="643" rx="32" ry="6" fill="#0a0a0a" stroke="#000" strokeWidth="0.5" />
        <ellipse cx="140" cy="641" rx="24" ry="2.5" fill="rgba(255,255,255,0.08)" />

        {/* Coffee shine overlay gradient defined here since it references coffee circle */}
        <defs>
          <radialGradient id="coffeeShine" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(255,180,120,0.35)" />
            <stop offset="50%" stopColor="rgba(139,69,19,0)" />
            <stop offset="100%" stopColor="rgba(30,15,5,0.4)" />
          </radialGradient>
        </defs>
      </svg>

      {/* HOME BUTTON */}
      <NavLink
        to="/"
        end
        onClick={onClose}
        className="absolute left-1/2 -translate-x-1/2 z-10 group"
        style={{ top: '80px' }}
      >
        {({ isActive }) => (
          <div className="flex flex-col items-center justify-center">
            <Home
              size={22}
              className={`transition-all group-hover:scale-110 ${
                isActive ? 'text-[#d4af37]' : 'text-[#f5e6c8]'
              }`}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
            />
            <span
              className={`text-[10px] font-bold tracking-[0.15em] mt-1 whitespace-nowrap ${
                isActive ? 'text-[#d4af37]' : 'text-[#f5e6c8]'
              }`}
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}
            >
              {text('POČETNA', 'HOME')}
            </span>
            {isActive && <div className="w-4 h-[1px] bg-[#d4af37] mt-1" />}
          </div>
        )}
      </NavLink>

      {/* MENU ITEMS */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-between z-10"
        style={{
          top: '212px',
          height: '280px',
          width: '220px',
        }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className="flex flex-col items-center justify-center group"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`transition-all group-hover:scale-110 ${
                    isActive ? 'text-[#d4af37]' : 'text-white'
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[12px] font-bold tracking-[0.12em] mt-1 whitespace-nowrap ${
                    isActive ? 'text-[#d4af37]' : 'text-white/95 group-hover:text-white'
                  }`}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}
                >
                  {item.label}
                </span>
                {isActive && <div className="w-4 h-[1px] bg-[#d4af37] mt-1" />}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
