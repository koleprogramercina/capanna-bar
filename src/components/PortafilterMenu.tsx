import { NavLink } from 'react-router-dom';
import { Home, Coffee, Calendar, Image, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PortafilterMenu() {
  const { text } = useLanguage();

  const menuItems = [
    { to: '/meni', label: text('CENOVNIK', 'MENU'), icon: <Coffee size={14} />, end: false },
    { to: '/rezervacija', label: text('REZERVACIJA', 'RESERVATION'), icon: <Calendar size={14} />, end: false },
    { to: '/galerija', label: text('GALERIJA', 'GALLERY'), icon: <Image size={14} />, end: false },
    { to: '/kontakt', label: text('KONTAKT', 'CONTACT'), icon: <Phone size={14} />, end: false },
  ];

  return (
    <div className="relative flex items-center" style={{ width: '520px', height: '90px' }}>
      
      {/* SVG PORTAFILTER (background) */}
      <svg
        viewBox="0 0 520 90"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <radialGradient id="chromeCup" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="40%" stopColor="#d8d8d8" />
            <stop offset="70%" stopColor="#a8a8a8" />
            <stop offset="100%" stopColor="#6d6d6d" />
          </radialGradient>

          <radialGradient id="coffeeGrounds" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#8b4513" />
            <stop offset="50%" stopColor="#5c2e0d" />
            <stop offset="100%" stopColor="#2d1607" />
          </radialGradient>

          <linearGradient id="handleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="20%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#000000" />
            <stop offset="80%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          <linearGradient id="handleHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <linearGradient id="spoutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0e0e0" />
            <stop offset="50%" stopColor="#909090" />
            <stop offset="100%" stopColor="#606060" />
          </linearGradient>

          <linearGradient id="rimShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>

        {/* HANDLE */}
        <path
          d="M 100 45 
             Q 110 25, 140 22
             L 470 30
             Q 495 32, 500 45
             Q 495 58, 470 60
             L 140 68
             Q 110 65, 100 45 Z"
          fill="url(#handleGradient)"
          stroke="#000"
          strokeWidth="0.5"
        />
        
        <path
          d="M 130 26
             Q 200 22, 470 32
             Q 480 33, 485 38
             Q 350 30, 130 34 Z"
          fill="url(#handleHighlight)"
        />

        <circle cx="200" cy="45" r="2" fill="#909090" stroke="#404040" strokeWidth="0.5" />
        <circle cx="200" cy="45" r="0.8" fill="#606060" />
        <circle cx="400" cy="45" r="2" fill="#909090" stroke="#404040" strokeWidth="0.5" />
        <circle cx="400" cy="45" r="0.8" fill="#606060" />

        <ellipse cx="498" cy="45" rx="4" ry="14" fill="#1a1a1a" stroke="#000" strokeWidth="0.5" />

        {/* SPOUT */}
        <rect x="92" y="38" width="14" height="14" rx="2" fill="url(#spoutGradient)" stroke="#404040" strokeWidth="0.5" />
        <rect x="94" y="40" width="10" height="3" fill="rgba(255,255,255,0.4)" />

        {/* CUP */}
        <circle cx="45" cy="45" r="42" fill="url(#chromeCup)" stroke="#4a4a4a" strokeWidth="1" />
        <ellipse cx="45" cy="20" rx="30" ry="6" fill="url(#rimShine)" />
        
        <ellipse cx="8" cy="45" rx="4" ry="6" fill="url(#chromeCup)" stroke="#4a4a4a" strokeWidth="0.5" />
        <ellipse cx="82" cy="45" rx="4" ry="6" fill="url(#chromeCup)" stroke="#4a4a4a" strokeWidth="0.5" />

        <circle cx="45" cy="45" r="34" fill="url(#coffeeGrounds)" />
        
        <circle cx="35" cy="35" r="0.8" fill="rgba(255,200,150,0.3)" />
        <circle cx="55" cy="40" r="0.6" fill="rgba(255,200,150,0.25)" />
        <circle cx="42" cy="55" r="0.7" fill="rgba(255,200,150,0.3)" />
        <circle cx="58" cy="50" r="0.5" fill="rgba(180,100,50,0.4)" />
        <circle cx="30" cy="50" r="0.6" fill="rgba(180,100,50,0.35)" />
        <circle cx="50" cy="30" r="0.5" fill="rgba(255,200,150,0.25)" />
        <circle cx="38" cy="45" r="0.4" fill="rgba(180,100,50,0.4)" />
        <circle cx="52" cy="58" r="0.5" fill="rgba(255,200,150,0.2)" />
        
        <circle cx="45" cy="45" r="34" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      </svg>

      {/* HOME BUTTON */}
      <NavLink
        to="/"
        end
        className="absolute left-[3px] top-[3px] w-[84px] h-[84px] rounded-full flex items-center justify-center z-10 group"
      >
        {({ isActive }) => (
          <div className="flex flex-col items-center justify-center">
            <Home 
              size={16} 
              className={`transition-all group-hover:scale-110 ${isActive ? 'text-[#d4af37]' : 'text-white'}`}
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
            />
            <span 
              className={`text-[8px] font-bold tracking-[0.15em] mt-0.5 ${isActive ? 'text-[#d4af37]' : 'text-white'}`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {text('POČETNA', 'HOME')}
            </span>
            {isActive && (
              <div className="w-4 h-[2px] rounded-full bg-[#d4af37] mt-0.5" />
            )}
          </div>
        )}
      </NavLink>

      {/* MENU ITEMS */}
      <div className="absolute left-[120px] top-0 right-[30px] h-full flex items-center justify-around z-10">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="flex flex-col items-center justify-center group"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center justify-center">
                <div className={`transition-all group-hover:scale-110 ${isActive ? 'text-[#d4af37]' : 'text-white'}`}>
                  {item.icon}
                </div>
                <span 
                  className={`text-[8px] font-bold tracking-[0.15em] mt-0.5 ${isActive ? 'text-[#d4af37]' : 'text-white/90 group-hover:text-white'}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-4 h-[2px] rounded-full bg-[#d4af37] mt-0.5" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
