import { NavLink } from 'react-router-dom';
import { Home, Coffee, Calendar, Image, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ShakerMenu() {
  const { text } = useLanguage();

  const menuItems = [
    { to: '/meni', label: text('CENOVNIK', 'MENU'), icon: <Coffee size={14} />, end: false },
    { to: '/rezervacija', label: text('REZERVACIJA', 'RESERVATION'), icon: <Calendar size={14} />, end: false },
    { to: '/galerija', label: text('GALERIJA', 'GALLERY'), icon: <Image size={14} />, end: false },
    { to: '/kontakt', label: text('KONTAKT', 'CONTACT'), icon: <Phone size={14} />, end: false },
  ];

  return (
    <div className="relative flex items-center" style={{ width: '520px', height: '90px' }}>
      
      {/* SVG SHAKER (background) */}
      <svg
        viewBox="0 0 520 90"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }}
      >
        <defs>
          {/* Main chrome body gradient (horizontal highlights for curvature) */}
          <linearGradient id="shakerBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8a8a8a" />
            <stop offset="15%" stopColor="#e8e8e8" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#d8d8d8" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#7a7a7a" />
          </linearGradient>

          {/* Cap gradient (slightly darker) */}
          <linearGradient id="capGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7a7a7a" />
            <stop offset="30%" stopColor="#e0e0e0" />
            <stop offset="60%" stopColor="#c8c8c8" />
            <stop offset="100%" stopColor="#6a6a6a" />
          </linearGradient>

          {/* Collar/strainer gradient */}
          <linearGradient id="collarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6a6a6a" />
            <stop offset="40%" stopColor="#d0d0d0" />
            <stop offset="60%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#5a5a5a" />
          </linearGradient>

          {/* Vertical shine on body */}
          <linearGradient id="verticalShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>

          {/* Dark shadow line */}
          <linearGradient id="shadowLine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0.5)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>
        </defs>

        {/* CAP (small piece on left) */}
        <path
          d="M 8 35
             Q 8 30, 12 30
             L 40 30
             Q 44 30, 44 35
             L 44 55
             Q 44 60, 40 60
             L 12 60
             Q 8 60, 8 55 Z"
          fill="url(#capGradient)"
          stroke="#404040"
          strokeWidth="0.5"
        />
        
        {/* Cap groove line */}
        <line x1="14" y1="40" x2="14" y2="50" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
        <line x1="38" y1="40" x2="38" y2="50" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />

        {/* COLLAR/STRAINER (wider middle piece) */}
        <path
          d="M 34 27
             Q 34 23, 39 23
             L 94 23
             Q 99 23, 99 28
             L 99 62
             Q 99 67, 94 67
             L 39 67
             Q 34 67, 34 62 Z"
          fill="url(#collarGradient)"
          stroke="#404040"
          strokeWidth="0.5"
        />
        
        {/* Collar lip highlight */}
        <ellipse cx="66.5" cy="26" rx="26" ry="1.6" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="66.5" cy="64" rx="26" ry="1.6" fill="rgba(0,0,0,0.3)" />

        {/* MAIN BODY (curved, tapered shape - handle) */}
        <path
          d="M 96 22
             Q 104 20, 120 18
             L 490 22
             Q 505 25, 508 45
             Q 505 65, 490 68
             L 120 72
             Q 104 70, 96 68 Z"
          fill="url(#shakerBody)"
          stroke="#404040"
          strokeWidth="0.5"
        />

        {/* Vertical shine strip (bright reflection down the middle) */}
        <rect x="150" y="25" width="8" height="40" rx="4" fill="url(#verticalShine)" opacity="0.5" />
        <rect x="300" y="25" width="6" height="40" rx="3" fill="url(#verticalShine)" opacity="0.4" />
        <rect x="430" y="25" width="5" height="40" rx="2.5" fill="url(#verticalShine)" opacity="0.35" />

        {/* Subtle vertical shadow lines (showing curve) */}
        <rect x="109" y="25" width="1.5" height="40" fill="url(#shadowLine)" opacity="0.4" />
        <rect x="490" y="25" width="1.5" height="40" fill="url(#shadowLine)" opacity="0.4" />

        {/* Rounded end (right tip) */}
        <ellipse cx="506" cy="45" rx="4" ry="22" fill="#8a8a8a" />
        <ellipse cx="504" cy="45" rx="2" ry="18" fill="rgba(255,255,255,0.3)" />
      </svg>

      {/* HOME BUTTON (over the collar area) */}
      <NavLink
        to="/"
        end
        className="absolute left-[34px] top-[23px] w-[65px] h-[44px] flex items-center justify-center z-10 group"
      >
        {({ isActive }) => (
          <div className="flex flex-col items-center justify-center">
            <Home 
              size={13} 
              className={`transition-all group-hover:scale-110 ${isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'}`}
              style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))' }}
            />
            <span 
              className={`text-[7px] font-bold tracking-[0.04em] mt-0.5 whitespace-nowrap ${isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'}`}
            >
              {text('POČETNA', 'HOME')}
            </span>
            {isActive && (
              <div className="w-4 h-[2px] rounded-full bg-[#00877a] mt-0.5" />
            )}
          </div>
        )}
      </NavLink>

      {/* MENU ITEMS (over the body) */}
      <div className="absolute left-[126px] top-0 right-[30px] h-full flex items-center justify-around z-10">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="flex flex-col items-center justify-center group"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center justify-center">
                <div 
                  className={`transition-all group-hover:scale-110 ${isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'}`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))' }}
                >
                  {item.icon}
                </div>
                <span 
                  className={`text-[8px] font-bold tracking-[0.15em] mt-0.5 ${isActive ? 'text-[#00877a]' : 'text-[#0d2b26]'}`}
                  style={{ textShadow: '0 1px 1px rgba(255,255,255,0.3)' }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-4 h-[2px] rounded-full bg-[#00877a] mt-0.5" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
