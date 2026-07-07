import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCanvas from '../components/HeroCanvas';
import BrandLogo from '../components/BrandLogo';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const reviews = [
  {
    name: 'Nikola M.',
    avatar: 'N',
    text: 'Najbolji espresso u Mitrovici! Kuzminska ima onu pravu, toplu barsku atmosferu. Svako jutro počinjem ovde – osoblje je uvek nasmejano, kafa savršena.',
    textEn: 'The best espresso in Mitrovica. Kuzminska has that warm bar atmosphere, friendly staff and excellent coffee every morning.',
    stars: 5,
    mode: 'city' as const,
  },
  {
    name: 'Milica S.',
    avatar: 'M',
    text: 'Jedva čekam leto svake godine samo zbog Capanne na plaži. Najjači kokteli pored Save, muzika i vibes su ne­ponovljivi. Pravi raj!',
    textEn: 'Every summer I look forward to Capanna on the beach. Great cocktails by the Sava, music and an atmosphere that feels like a little escape.',
    stars: 5,
    mode: 'beach' as const,
  },
  {
    name: 'Dejan K.',
    avatar: 'D',
    text: 'Koncept sa dve lokacije im je vrhunski. Gde god da se nalaze, kvalitet ostaje isti. Capanna je postala deo identiteta Sremske Mitrovice.',
    textEn: 'The two-location concept is excellent. Wherever they are, the quality stays consistent. Capanna has become part of Sremska Mitrovica.',
    stars: 5,
    mode: 'both' as const,
  },
];

const tickerItems = ['Espresso', 'Mojito', 'Craft Lager', 'Sex on the Beach', 'Cappuccino', 'Aperol Spritz', 'Lemonade', 'Irish Coffee', 'Piña Colada', 'Flat White'];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review, isActive }: { review: typeof reviews[0]; isActive: boolean }) {
  const { isBeach } = useSeason();
  const { isEnglish, text } = useLanguage();
  return (
    <div className={`transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute'}`}>
      <div className={`rounded-2xl p-8 relative overflow-hidden ${
        isBeach
          ? 'bg-gradient-to-br from-[#0d2b26] to-[#0a1f1c] border border-[#00a896]/20'
          : 'bg-gradient-to-br from-[#1a110b] to-[#0f0a06] border border-[#d4af37]/20'
      }`}>
        {/* Decorative quote */}
        <div className={`absolute top-4 right-6 text-8xl font-serif leading-none pointer-events-none select-none ${
          isBeach ? 'text-[#00a896]/10' : 'text-[#d4af37]/10'
        }`}>"</div>
        
        <StarRating count={review.stars} />
        <p className={`mt-4 text-base leading-relaxed italic ${isBeach ? 'text-white/80' : 'text-[#f5e6c8]/80'}`}>
          "{isEnglish ? review.textEn : review.text}"
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            isBeach
              ? 'bg-gradient-to-br from-[#00a896] to-[#02c8b3] text-white'
              : 'bg-gradient-to-br from-[#d4af37] to-[#a07f20] text-[#1a110b]'
          }`}>
            {review.avatar}
          </div>
          <div>
            <div className={`font-semibold text-sm ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>{review.name}</div>
            <div className={`text-xs ${isBeach ? 'text-[#00a896]/70' : 'text-[#d4af37]/70'}`}>
              {review.mode === 'city' ? text('☕ Kuzminska lokacija', '☕ Kuzminska location') : review.mode === 'beach' ? '🌊 Brioni Beach' : text('✨ Obe lokacije', '✨ Both locations')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isBeach } = useSeason();
  const { text } = useLanguage();
  const [activeReview, setActiveReview] = useState(0);
  const [tickerPos, setTickerPos] = useState(0);
  const tickerRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-advance reviews
  useEffect(() => {
    const id = setInterval(() => setActiveReview(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, []);

  // Ticker animation
  useEffect(() => {
    let pos = 0;
    const tick = () => {
      pos -= 0.5;
      setTickerPos(pos);
      tickerRef.current = requestAnimationFrame(tick);
    };
    tickerRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(tickerRef.current);
  }, []);

  // Scroll parallax for bento
  useEffect(() => {
    const onScroll = () => {
      if (scrollRef.current) {
        const cards = scrollRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const progress = 1 - rect.top / window.innerHeight;
          const offset = lerp(0, -20, progress * (i % 2 === 0 ? 1 : -1));
          card.style.transform = `translateY(${offset}px)`;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tickerString = [...tickerItems, ...tickerItems, ...tickerItems].join(' · ');
  const charWidth = 9.5;
  const wrappedPos = ((tickerPos % (tickerItems.join(' · ').length * charWidth)) + (tickerItems.join(' · ').length * charWidth)) % (tickerItems.join(' · ').length * charWidth);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isBeach
            ? 'bg-gradient-to-br from-[#071a17] via-[#0a2820] to-[#071520]'
            : 'bg-gradient-to-br from-[#0f0a06] via-[#1a110b] to-[#0a0705]'
        }`} />

        {/* Real city ambience image, treated as a dark cinematic backdrop */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isBeach ? 'opacity-0' : 'opacity-100'}`}>
          <img
            src="images/capanna-kuzminska-interior.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover scale-105 opacity-42 blur-[1.5px] saturate-125 contrast-110 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a06]/65 via-[#0f0a06]/34 to-[#0f0a06]/82" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(212,175,55,0.20),transparent_36%),radial-gradient(circle_at_50%_58%,rgba(0,0,0,0.08),rgba(0,0,0,0.72)_68%)]" />
        </div>

        {/* Ambient light orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 pointer-events-none ${
          isBeach ? 'bg-[#00a896]/8' : 'bg-[#d4af37]/6'
        }`} />
        <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-1000 pointer-events-none ${
          isBeach ? 'bg-[#ff4e50]/6' : 'bg-[#8B5E3C]/8'
        }`} />

        {/* 3D Canvas */}
        <div className="absolute inset-0 opacity-90 sm:opacity-95">
          <HeroCanvas />
        </div>
        <div className="absolute inset-x-0 top-[24%] mx-auto h-64 w-[min(720px,92vw)] rounded-full bg-black/35 blur-3xl pointer-events-none" />

        {/* Hero text content */}
        <div
          className="relative z-10 text-center px-6 pointer-events-none select-none"
          style={{ textShadow: '0 2px 26px rgba(0,0,0,0.9)' }}
        >
          {/* Mode badge */}
          <BrandLogo size="lg" withText={false} className="mb-5 justify-center opacity-95" />
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6 border transition-all duration-700 ${
            isBeach
              ? 'bg-[#001f1c]/70 border-[#00a896]/45 text-[#2df2d7]'
              : 'bg-[#1a110b]/70 border-[#d4af37]/45 text-[#f0c84d]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'}`} />
            {isBeach ? text('Brioni Beach • Plaža Sava', 'Brioni Beach • Sava River') : 'Kuzminska 1 • Sremska Mitrovica'}
          </div>

          <h1 className={`font-display font-bold text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-tight transition-all duration-700 ${
            isBeach ? 'text-white' : 'text-[#f5e6c8]'
          }`}>
            CAPANNA
          </h1>

          <div className={`mt-2 text-sm sm:text-base tracking-[0.5em] uppercase font-light transition-all duration-700 ${
            isBeach ? 'text-[#43f5de]' : 'text-[#f0c84d]'
          }`}>
            {isBeach ? 'Beach & Cocktail Bar' : 'Premium Coffee & Lounge'}
          </div>

          <p className={`mt-6 max-w-md mx-auto text-sm sm:text-base leading-relaxed transition-all duration-700 ${
            isBeach ? 'text-white/78' : 'text-[#f5e6c8]/78'
          }`}>
            {isBeach
              ? text('Gde letnje sunce sreće savski talas. Kokteli, muzika i nezaboravni trenuci na Brioni plaži.', 'Where summer light meets the Sava river. Cocktails, music and easy moments on Brioni Beach.')
              : text('Topla atmosfera u srcu grada. Premium kafa, craft pića i urbana elegancija na Kuzminskoj 1.', 'A warm city atmosphere with premium coffee, drinks and relaxed lounge energy at Kuzminska 1.')}
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 pointer-events-auto">
            <Link
              to="/meni"
              className={`px-7 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${
                isBeach
                  ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-500/30 hover:shadow-[0_0_34px_rgba(0,214,192,0.5),0_10px_24px_rgba(0,0,0,0.35)]'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/30 hover:shadow-[0_0_34px_rgba(212,175,55,0.5),0_10px_24px_rgba(0,0,0,0.35)]'
              }`}
            >
              {isBeach ? text('Vidi Koktele', 'See Cocktails') : text('Vidi Meni', 'See Menu')}
            </Link>
            <Link
              to="/kontakt"
              className={`px-7 py-3 rounded-full text-sm font-semibold tracking-wider uppercase border transition-all duration-300 hover:scale-105 active:scale-95 ${
                isBeach
                  ? 'border-[#00a896]/50 text-[#00a896] hover:border-[#00d6c0] hover:bg-[#00a896]/10 hover:shadow-[0_0_24px_rgba(0,214,192,0.28)]'
                  : 'border-[#d4af37]/50 text-[#d4af37] hover:border-[#f0c84d] hover:bg-[#d4af37]/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.28)]'
              }`}
            >
              {text('Rezerviši', 'Book')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className={`w-px h-12 ${isBeach ? 'bg-gradient-to-b from-[#00a896]/0 via-[#00a896]/60 to-[#00a896]/0' : 'bg-gradient-to-b from-[#d4af37]/0 via-[#d4af37]/60 to-[#d4af37]/0'} animate-pulse`} />
          <span className={`text-xs tracking-widest uppercase ${isBeach ? 'text-[#00a896]/50' : 'text-[#d4af37]/50'}`}>Scroll</span>
        </div>

        {/* Active mode label */}
        <div
          className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-xs tracking-wider uppercase transition-all duration-300 hover:opacity-100 opacity-80 rounded-full px-3 py-2 border backdrop-blur-md ${
            isBeach ? 'text-[#43f5de] border-[#00a896]/25 bg-[#001f1c]/45' : 'text-[#f0c84d] border-[#d4af37]/25 bg-[#1a110b]/45'
          }`}
        >
          {isBeach ? text('Beach Mode', 'Beach Mode') : text('City Mode', 'City Mode')}
        </div>
      </section>

      {/* ── BENTO GRID SECTION ── */}
      <section ref={scrollRef} className="relative py-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {text('Naša priča', 'Our story')}
          </span>
          <h2 className={`mt-3 text-4xl lg:text-5xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Dve lokacije,', 'Two locations,')}<br />{text('jedan duh', 'one spirit')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-[200px] lg:auto-rows-[220px]">
          
          {/* Card A – The Concept (tall) */}
          <div
            data-parallax
            className={`lg:row-span-2 rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden group transition-all duration-500 cursor-default ${
              isBeach
                ? 'bg-gradient-to-b from-[#0a2820] to-[#071a17] border border-[#00a896]/15 hover:border-[#00a896]/40'
                : 'bg-gradient-to-b from-[#1a110b] to-[#0f0a06] border border-[#d4af37]/15 hover:border-[#d4af37]/40'
            }`}
          >
            {/* Background image */}
            <img
              src={isBeach ? 'images/beach-bar.jpg' : 'images/capanna-kuzminska-interior.jpg'}
              alt="Capanna Bar"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10">
              <div className={`text-5xl font-display italic mb-3 opacity-30 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>"</div>
              <h3 className={`text-xl font-display font-bold mb-3 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {text('Sezonski Koncept', 'Seasonal Concept')}
              </h3>
              <p className={`text-sm leading-relaxed ${isBeach ? 'text-white/65' : 'text-[#f5e6c8]/65'}`}>
                {text('Svake jeseni, Capanna se transformiše u toplu gradsku kafanu na Kuzminskoj 1. Svakog proleća, celokupan tim i duh brenda seli se na Brioni plažu.', 'Every autumn, Capanna becomes a warm city lounge at Kuzminska 1. Every spring, the whole spirit of the brand moves to Brioni Beach.')}
              </p>
              <div className={`mt-4 text-xs tracking-widest uppercase font-medium group-hover:translate-x-1 transition-transform duration-300 ${
                isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
              }`}>
                {isBeach ? text('🌊 Trenutno: Plaža', '🌊 Now: Beach') : text('☕ Trenutno: Grad', '☕ Now: City')} →
              </div>
            </div>
          </div>

          {/* Card B – Live Status */}
          <div
            data-parallax
            className={`rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${
              isBeach
                ? 'bg-gradient-to-br from-[#0a2820] to-[#041410] border border-[#00a896]/20'
                : 'bg-gradient-to-br from-[#1a110b] to-[#0a0705] border border-[#d4af37]/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs tracking-widest uppercase font-medium ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>
                {text('Aktivna lokacija', 'Active location')}
              </span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
                </span>
                <span className={`text-xs font-medium ${isBeach ? 'text-[#00a896]' : 'text-emerald-400'}`}>LIVE</span>
              </div>
            </div>
            <div>
              <div className={`text-2xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {isBeach ? 'Brioni Beach' : 'Kuzminska 1'}
              </div>
              <div className={`text-sm mt-1 ${isBeach ? 'text-[#00a896]/70' : 'text-[#d4af37]/70'}`}>
                {isBeach ? text('Plaža Sava, Sremska Mitrovica', 'Sava Beach, Sremska Mitrovica') : 'Sremska Mitrovica'}
              </div>
              <div className={`mt-3 text-xs px-3 py-1.5 rounded-full inline-block ${
                isBeach ? 'bg-[#00a896]/15 text-[#00a896]' : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {isBeach ? text('Letnja sezona aktivna', 'Summer season active') : text('Zimska sezona aktivna', 'City season active')}
              </div>
            </div>
          </div>

          {/* Card C – Menu Preview (ticker) */}
          <Link
            to="/meni"
            data-parallax
            className={`rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-500 group cursor-pointer hover:scale-[1.02] ${
              isBeach
                ? 'bg-gradient-to-br from-[#ff4e50]/15 to-[#c04000]/5 border border-[#ff4e50]/20 hover:border-[#ff4e50]/40'
                : 'bg-gradient-to-br from-[#d4af37]/10 to-[#8B5E3C]/5 border border-[#d4af37]/20 hover:border-[#d4af37]/40'
            }`}
          >
            <div>
              <span className={`text-xs tracking-widest uppercase font-medium ${isBeach ? 'text-[#ff4e50]/70' : 'text-[#d4af37]/70'}`}>
                {text('Naš Meni', 'Our Menu')}
              </span>
              <div className={`text-2xl font-display font-bold mt-1 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {isBeach ? text('Kokteli & Osveženja', 'Cocktails & Refreshments') : text('Kafa & Napici', 'Coffee & Drinks')}
              </div>
            </div>
            {/* Auto-scrolling ticker */}
            <div className="overflow-hidden mt-4">
              <div
                className={`whitespace-nowrap text-sm font-medium ${isBeach ? 'text-[#ff4e50]/80' : 'text-[#d4af37]/80'}`}
                style={{ transform: `translateX(${wrappedPos % (tickerItems.join(' · ').length * charWidth) * -1}px)` }}
              >
                {tickerString}
              </div>
            </div>
            <div className={`mt-3 text-xs font-semibold tracking-widest uppercase group-hover:translate-x-1 transition-transform duration-300 ${
              isBeach ? 'text-[#ff4e50]' : 'text-[#d4af37]'
            }`}>
              {text('Pogledaj cenovnik', 'View menu')} →
            </div>
          </Link>

          {/* Card D – Location card */}
          <div
            data-parallax
            className={`md:col-span-2 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden transition-all duration-500 group ${
              isBeach
                ? 'bg-gradient-to-br from-[#0a2820] to-[#041e1a] border border-[#00a896]/20 hover:border-[#00a896]/40'
                : 'bg-gradient-to-br from-[#1a110b] to-[#0a0705] border border-[#d4af37]/20 hover:border-[#d4af37]/40'
            }`}
          >
            {/* Mini map visualization */}
            <div className="flex-shrink-0 w-full sm:w-48 h-36 rounded-xl overflow-hidden relative">
              <div className={`absolute inset-0 transition-colors duration-700 ${isBeach ? 'bg-[#0d3d35]' : 'bg-[#2a1a0e]'}`}>
                {/* Stylized map lines */}
                <svg viewBox="0 0 200 150" className="w-full h-full opacity-60">
                  {/* River */}
                  <path d="M 0 80 Q 50 70 100 85 Q 150 100 200 90" stroke={isBeach ? '#00a896' : '#d4af37'} strokeWidth="12" fill="none" opacity="0.5" />
                  {/* Streets */}
                  <line x1="0" y1="50" x2="200" y2="50" stroke={isBeach ? '#ffffff' : '#d4af37'} strokeWidth="1.5" opacity="0.2" />
                  <line x1="0" y1="30" x2="200" y2="30" stroke={isBeach ? '#ffffff' : '#d4af37'} strokeWidth="1" opacity="0.15" />
                  <line x1="60" y1="0" x2="60" y2="150" stroke={isBeach ? '#ffffff' : '#d4af37'} strokeWidth="1" opacity="0.15" />
                  <line x1="130" y1="0" x2="130" y2="150" stroke={isBeach ? '#ffffff' : '#d4af37'} strokeWidth="1" opacity="0.15" />
                  {/* City pin */}
                  <circle cx="80" cy="45" r="5" fill={isBeach ? '#ffffff' : '#d4af37'} opacity={isBeach ? 0.4 : 1} />
                  <text x="88" y="48" fill={isBeach ? '#fff' : '#d4af37'} fontSize="8" opacity={isBeach ? 0.5 : 0.9}>Kuzminska</text>
                  {/* Beach pin */}
                  <circle cx="140" cy="78" r={isBeach ? 7 : 4} fill={isBeach ? '#00a896' : '#ffffff'} opacity={isBeach ? 1 : 0.4}>
                    <animate attributeName="r" values={isBeach ? "5;8;5" : "4;4;4"} dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="150" y="81" fill={isBeach ? '#00a896' : '#fff'} fontSize="8" opacity={isBeach ? 1 : 0.4}>Brioni Beach</text>
                </svg>
              </div>
            </div>
            <div>
              <span className={`text-xs tracking-widest uppercase font-medium ${isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}`}>
                {text('Pronađi nas', 'Find us')}
              </span>
              <h3 className={`text-xl font-display font-bold mt-1 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {isBeach ? text('Brioni Plaža, Sava', 'Brioni Beach, Sava') : 'Kuzminska 1, SM'}
              </h3>
              <p className={`text-sm mt-2 leading-relaxed ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>
                {isBeach
                  ? text('Letnji raj na obali reke Save. Dođi direktno na plažu – nećeš nas propustiti!', 'A summer spot on the Sava riverbank. Come straight to the beach and you will find us easily.')
                  : text('U srcu Sremske Mitrovice. Parking dostupan, lako dostupno svim gradskim linijama.', 'In the heart of Sremska Mitrovica, easy to reach and close to the city centre.')}
              </p>
              <Link
                to="/kontakt"
                className={`inline-block mt-3 text-xs font-semibold tracking-widest uppercase group-hover:translate-x-1 transition-transform duration-300 ${
                  isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
                }`}
              >
                {text('Detaljne upute', 'Directions')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISUAL SPLIT SECTION ── */}
      <section className={`py-20 px-6 relative overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-96 group transition-all duration-500 ${
              isBeach ? 'ring-1 ring-[#00a896]/20' : 'ring-1 ring-[#d4af37]/20'
            }`}>
              <img
                src={isBeach ? 'images/cocktail.jpg' : 'images/espresso.jpg'}
                alt="Capanna signature drink"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className={`absolute inset-0 ${isBeach ? 'bg-gradient-to-t from-[#071a17]/80 to-transparent' : 'bg-gradient-to-t from-[#0f0a06]/80 to-transparent'}`} />
              <div className="absolute bottom-6 left-6">
                <div className={`text-white font-display font-bold text-2xl`}>
                  {isBeach ? 'Signature Kokteli' : 'Premium Kafa'}
                </div>
                <div className={`text-sm mt-1 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                  {isBeach ? 'Tropical & Fresh' : 'Espresso & Beyond'}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                  {text('O nama', 'About us')}
                </span>
                <h2 className={`mt-3 text-3xl lg:text-4xl font-display font-bold leading-tight ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                  {isBeach
                    ? text('Letnja sloboda na reci', 'Summer freedom by the river')
                    : text('Gradska elegancija uz šoljicu', 'City elegance with every cup')}
                </h2>
              </div>
              <p className={`text-base leading-relaxed ${isBeach ? 'text-white/65' : 'text-[#f5e6c8]/65'}`}>
                {isBeach
                  ? text('Brioni plaža je naš letnji dom – prostrana, živahna i puna energije. Svaki koktel je pažljivo kreiran od svežih sastojaka, a ambijent je savršena mešavina relaksacije i zabave.', 'Brioni Beach is our summer home: open, lively and full of energy. Cocktails, river air and a relaxed beach rhythm.')
                  : text('Kuzminska 1 je naš zimski dom – topao, intiman prostor u srcu Sremske Mitrovice. Svaka šoljica kafe je umetnost, a atmosfera te uvek dobrodošla kao starog prijatelja.', 'Kuzminska 1 is our city home: warm, intimate and easy-going. Coffee, drinks and a welcome that feels familiar.')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(isBeach
                  ? [['50+', text('Koktel recepata', 'Cocktail recipes')], ['7', text('Dana u nedelji', 'Days a week')], ['5★', text('Utisci gostiju', 'Guest impressions')], ['2014', text('Osnovani', 'Founded')]]
                  : [['12h', text('Dnevno otvoreni', 'Open daily')], ['15+', text('Vrsta kafe', 'Coffee options')], ['5★', text('Utisci gostiju', 'Guest impressions')], ['2014', text('Osnovani', 'Founded')]]
                ).map(([val, label]) => (
                  <div key={label} className={`p-4 rounded-xl ${isBeach ? 'bg-[#0a2820]/80 border border-[#00a896]/15' : 'bg-[#1a110b]/80 border border-[#d4af37]/15'}`}>
                    <div className={`text-2xl font-display font-bold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>{val}</div>
                    <div className={`text-xs mt-1 ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOD & TAKEAWAY SECTION ── */}
      <section className={`py-20 px-6 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
          <div className={`rounded-2xl overflow-hidden min-h-[320px] relative ${
            isBeach ? 'ring-1 ring-[#00a896]/20' : 'ring-1 ring-[#d4af37]/20'
          }`}>
            <img
                src={isBeach ? 'images/gallery-beach.jpg' : 'images/capanna-kuzminska-terrace.jpg'}
              alt={text('Capanna hrana i piće', 'Capanna food and drinks')}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${isBeach ? 'bg-gradient-to-t from-[#071a17]/95 via-[#071a17]/35 to-transparent' : 'bg-gradient-to-t from-[#0f0a06]/95 via-[#0f0a06]/35 to-transparent'}`} />
            <div className="absolute bottom-6 left-6 right-6">
              <div className={`text-xs tracking-[0.3em] uppercase font-semibold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                {text('Hrana za poneti', 'Food to go')}
              </div>
              <div className="mt-2 text-3xl font-display font-bold text-white">
                {text('Naruči, pokupi, ponesi', 'Order, pick up, take away')}
              </div>
            </div>
          </div>
          <div className={`rounded-2xl p-8 lg:p-10 ${
            isBeach ? 'bg-[#041410] border border-[#00a896]/15' : 'bg-[#0a0705] border border-[#d4af37]/15'
          }`}>
            <span className={`text-xs tracking-[0.3em] uppercase font-semibold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              {text('Take-away opcija', 'Take-away available')}
            </span>
            <h2 className={`mt-3 text-3xl lg:text-4xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
              {text('Hrana ne mora da se jede kod nas.', 'You do not have to dine in.')}
            </h2>
            <p className={`mt-4 text-base leading-relaxed ${isBeach ? 'text-white/65' : 'text-[#f5e6c8]/65'}`}>
              {text(
                'Ako si u prolazu, na poslu ili samo želiš Capanna ukus kod kuće, hranu možeš da naručiš unapred telefonom na 060 3663205, pokupiš i poneseš. Piće, kafa i sezonski meni ostaju dostupni na licu mesta.',
                'If you are passing by, at work, or simply want Capanna at home, you can order food ahead by phone at 060 3663205, pick it up and take it with you. Drinks, coffee and the seasonal menu are still available on site.'
              )}
            </p>
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                [text('Poruči', 'Order'), text('Pozovi 060 3663205', 'Call 060 3663205')],
                [text('Pokupi', 'Pick up'), text('Dogovoreno vreme', 'At the agreed time')],
                [text('Ponesi', 'Take away'), text('Za posao, kuću ili plažu', 'For work, home or the beach')],
              ].map(([title, desc]) => (
                <div key={title} className={`rounded-xl p-4 ${isBeach ? 'bg-[#0a2820]/70' : 'bg-[#1a110b]/70'}`}>
                  <div className={`text-sm font-bold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>{title}</div>
                  <div className={`mt-1 text-xs leading-relaxed ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>{desc}</div>
                </div>
              ))}
            </div>
            <a
              href="tel:+381603663205"
              className={`inline-flex mt-8 px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-105 ${
                isBeach
                  ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b]'
              }`}
            >
              {text('Pozovi za porudžbinu: 060 3663205', 'Order by phone: 060 3663205')}
            </a>
          </div>
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      <section className={`py-24 px-6 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {text('Utisci gostiju', 'Guest impressions')}
          </span>
          <h2 className={`mt-3 text-4xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Šta kažu naši gosti', 'What guests say')}
          </h2>
        </div>

        <div className="max-w-2xl mx-auto mt-12 relative min-h-[280px]">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} isActive={i === activeReview} />
          ))}
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8 absolute -bottom-10 left-0 right-0">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReview(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeReview
                    ? `w-6 h-2 ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'}`
                    : `w-2 h-2 ${isBeach ? 'bg-white/25' : 'bg-[#f5e6c8]/25'}`
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className={`py-24 px-6 relative overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 ${
          isBeach
            ? 'bg-gradient-to-r from-[#00a896]/5 via-transparent to-[#ff4e50]/5'
            : 'bg-gradient-to-r from-[#d4af37]/5 via-transparent to-[#8B5E3C]/5'
        }`} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl lg:text-5xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Dođi i uveri se', 'Come and see it')}<br />
            <span className={isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}>{text('lično.', 'yourself.')}</span>
          </h2>
          <p className={`mt-4 text-base leading-relaxed max-w-xl mx-auto ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>
            {isBeach
              ? text('Rezerviši svoje mesto na plaži. Savršen koktel te čeka.', 'Book your spot on the beach. A cold drink is waiting.')
              : text('Rezerviši sto za posebnu večer ili jutarnju kafu sa prijateljem.', 'Book a table for an evening out or morning coffee with friends.')}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/kontakt"
              className={`px-8 py-4 rounded-full font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 text-sm ${
                isBeach
                  ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-500/30'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/30'
              }`}
            >
              {text('Rezervacija', 'Book')}
            </Link>
            <Link
              to="/galerija"
              className={`px-8 py-4 rounded-full font-semibold tracking-wider uppercase border transition-all duration-300 hover:scale-105 text-sm ${
                isBeach
                  ? 'border-white/20 text-white/70 hover:text-white hover:border-white/40'
                  : 'border-[#f5e6c8]/20 text-[#f5e6c8]/70 hover:text-[#f5e6c8] hover:border-[#f5e6c8]/40'
              }`}
            >
              {text('Galerija Slika', 'Photo Gallery')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-10 px-6 ${
        isBeach
          ? 'bg-[#041410] border-[#00a896]/10'
          : 'bg-[#0a0705] border-[#d4af37]/10'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`font-display font-bold text-xl tracking-wider ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            CAPANNA <span className={`font-normal text-sm tracking-widest uppercase ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>Bar</span>
          </div>
          <div className={`text-xs tracking-wider text-center ${isBeach ? 'text-white/30' : 'text-[#f5e6c8]/30'}`}>
            {isBeach ? 'Brioni Beach, Sava River' : 'Kuzminska 1, Sremska Mitrovica'} · © {new Date().getFullYear()} Capanna Bar
          </div>
          <div className="flex gap-6">
            {[text('Početna', 'Home'), text('Meni', 'Menu'), text('Galerija', 'Gallery'), text('Kontakt', 'Contact')].map((item, i) => (
              <Link
                key={item}
                to={['/', '/meni', '/galerija', '/kontakt'][i]}
                className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                  isBeach ? 'text-white/30 hover:text-[#00a896]' : 'text-[#f5e6c8]/30 hover:text-[#d4af37]'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
