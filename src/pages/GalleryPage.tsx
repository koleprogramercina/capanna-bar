import { useState, useEffect, useRef } from 'react';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';

interface GalleryItem {
  src: string;
  alt: string;
  altEn: string;
  tag: string;
  tagEn: string;
  span: 'normal' | 'wide' | 'tall' | 'large';
  season: 'city' | 'beach' | 'both';
}

const galleryItems: GalleryItem[] = [
  { src: 'images/capanna-kuzminska-interior.jpg', alt: 'Capanna enterijer u Kuzminskoj', altEn: 'Capanna interior in Kuzminska', tag: 'City Lounge', tagEn: 'City Lounge', span: 'wide', season: 'city' },
  { src: 'images/espresso.jpg', alt: 'Signature espresso', altEn: 'Signature espresso', tag: 'Premium Kafa', tagEn: 'Premium Coffee', span: 'normal', season: 'city' },
  { src: 'images/capanna-kuzminska-terrace.jpg', alt: 'Capanna terasa u Kuzminskoj', altEn: 'Capanna terrace in Kuzminska', tag: 'Noćni Ambijent', tagEn: 'Night Atmosphere', span: 'tall', season: 'city' },
  { src: 'images/beach-bar-night.jpg', alt: 'Capanna Bar on the Beach noću', altEn: 'Capanna Bar on the Beach at night', tag: 'Brioni Beach', tagEn: 'Brioni Beach', span: 'wide', season: 'beach' },
  { src: 'images/beach-cocktail.jpg', alt: 'Koktel uz reku Savu', altEn: 'Cocktail by the Sava river', tag: 'Signature Kokteli', tagEn: 'Signature Cocktails', span: 'normal', season: 'beach' },
  { src: 'images/beach-loungers.jpg', alt: 'Ležaljke i suncobrani na plaži', altEn: 'Sun loungers and umbrellas on the beach', tag: 'Plaža', tagEn: 'Beach', span: 'large', season: 'beach' },
  { src: 'images/beach-sign.jpg', alt: 'Capanna Bar neon', altEn: 'Capanna Bar neon sign', tag: 'Detalji', tagEn: 'Details', span: 'normal', season: 'beach' },
  { src: 'images/espresso.jpg', alt: 'Latte art', altEn: 'Latte art', tag: 'Latte Art', tagEn: 'Latte Art', span: 'normal', season: 'city' },
  { src: 'images/beach-drinks.jpg', alt: 'Tropska pića u tiki čašama', altEn: 'Tropical drinks in tiki glasses', tag: 'Tropska Pića', tagEn: 'Tropical Drinks', span: 'wide', season: 'beach' },
  { src: 'images/beach-food.jpg', alt: 'Capanna hrana', altEn: 'Capanna food', tag: 'Hrana', tagEn: 'Food', span: 'normal', season: 'beach' },
  { src: 'images/beach-terrace.jpg', alt: 'Terasa uz reku', altEn: 'Terrace by the river', tag: 'Ambijent', tagEn: 'Atmosphere', span: 'tall', season: 'beach' },
  { src: 'images/beach-coffee.jpg', alt: 'Kafa na plaži', altEn: 'Coffee on the beach', tag: 'Jutarnja Kafa', tagEn: 'Morning Coffee', span: 'normal', season: 'beach' },
];

const filters = ['Sve', 'City Bar', 'Brioni Beach', 'Pića'];

function GalleryCard({ item, isBeach, index }: { item: GalleryItem; isBeach: boolean; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { isEnglish, text } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const spanClass =
    item.span === 'wide' ? 'col-span-2' :
    item.span === 'tall' ? 'row-span-2' :
    item.span === 'large' ? 'col-span-2 row-span-2' : '';

  const heightClass =
    item.span === 'tall' || item.span === 'large' ? 'h-[460px]' :
    item.span === 'wide' ? 'h-[230px]' : 'h-[230px]';

  return (
    <div
      ref={ref}
      className={`${spanClass} relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative ${heightClass} overflow-hidden rounded-2xl ${
        isBeach ? 'ring-1 ring-[#00a896]/10' : 'ring-1 ring-[#d4af37]/10'
      } group-hover:ring-[#00a896]/40`}>
        {/* Loading skeleton */}
        {!loaded && (
          <div className={`absolute inset-0 animate-pulse ${isBeach ? 'bg-[#0a2820]' : 'bg-[#1a110b]'}`} />
        )}
        <img
          src={item.src}
          alt={isEnglish ? item.altEn : item.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            hovered ? 'scale-110' : 'scale-100'
          } ${
            isBeach
              ? 'group-hover:brightness-75 group-hover:saturate-110'
              : 'group-hover:brightness-75'
          }`}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          hovered ? 'opacity-100' : 'opacity-0'
        } ${
          isBeach
            ? 'bg-gradient-to-t from-[#041410]/90 via-[#041410]/30 to-transparent'
            : 'bg-gradient-to-t from-[#0a0705]/90 via-[#0a0705]/30 to-transparent'
        }`} />

        {/* Tag */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
          isBeach
            ? 'bg-[#00a896]/20 text-[#00a896] border border-[#00a896]/30'
            : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
        }`}>
          {isEnglish ? item.tagEn : item.tag}
        </div>

        {/* Hover info */}
        <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ${
          hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className={`font-semibold text-sm ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {isEnglish ? item.altEn : item.alt}
          </div>
          <div className={`text-xs mt-1 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            Capanna Bar · {item.season === 'city' ? 'Kuzminska 1' : item.season === 'beach' ? 'Brioni Beach' : text('Obe lokacije', 'Both locations')}
          </div>
        </div>

        {/* Wave distortion overlay (beach mode) */}
        {isBeach && hovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20"
              style={{
                background: 'linear-gradient(to top, #00a896, transparent)',
                animation: 'waveMove 2s ease-in-out infinite',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { isBeach } = useSeason();
  const { text } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('Sve');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredItems = galleryItems.filter(item => {
    if (activeFilter === 'Sve') return true;
    if (activeFilter === 'City Bar') return item.season === 'city' || item.season === 'both';
    if (activeFilter === 'Brioni Beach') return item.season === 'beach' || item.season === 'both';
    if (activeFilter === 'Pića') return item.tag.includes('Kafa') || item.tag.includes('Kokteli') || item.tag.includes('Pića') || item.tag.includes('Latte') || item.tag.includes('Tropska');
    return true;
  });

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-700 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* Page header */}
      <div className={`py-16 px-6 text-center relative overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 opacity-5 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'} flex items-center justify-center pointer-events-none select-none`}>
          <span className="text-[18vw] font-display font-bold">FOTO</span>
        </div>
        <div className="relative z-10">
          <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {text('Vizuelni prikaz', 'Visual preview')}
          </span>
          <h1 className={`mt-3 text-5xl lg:text-6xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Galerija', 'Gallery')}
          </h1>
          <p className={`mt-4 max-w-xl mx-auto text-sm leading-relaxed ${isBeach ? 'text-white/55' : 'text-[#f5e6c8]/55'}`}>
            {text('Kroz fotografije doživi atmosferu obe lokacije – od intimnih zimskih večeri do letnjeg beachfront iskustva na Savi.', 'Explore the atmosphere of both locations through photos, from city evenings to summer days by the Sava.')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                activeFilter === f
                  ? isBeach
                    ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-500/20'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/20'
                  : isBeach
                    ? 'bg-[#0a2820]/60 text-white/50 border border-[#00a896]/15 hover:border-[#00a896]/40 hover:text-white'
                    : 'bg-[#1a110b]/60 text-[#f5e6c8]/50 border border-[#d4af37]/15 hover:border-[#d4af37]/40 hover:text-[#f5e6c8]'
              }`}
            >
              {f === 'Sve' ? text('Sve', 'All') : f === 'Pića' ? text('Pića', 'Drinks') : f}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[230px]">
          {filteredItems.map((item, i) => (
            <div key={`${item.src}-${i}`} onClick={() => setLightboxImg(item.src)}>
              <GalleryCard item={item} isBeach={isBeach} index={i} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className={`text-center py-20 ${isBeach ? 'text-white/30' : 'text-[#f5e6c8]/30'}`}>
            <div className="text-5xl mb-4">📷</div>
            <p className="text-sm tracking-wider">{text('Nema fotografija za odabrani filter', 'No photos for the selected filter')}</p>
          </div>
        )}

        {/* Instagram CTA */}
        <div className={`mt-16 rounded-2xl p-8 text-center relative overflow-hidden ${
          isBeach ? 'bg-[#041410] border border-[#00a896]/15' : 'bg-[#0a0705] border border-[#d4af37]/15'
        }`}>
          <div className={`absolute inset-0 opacity-5 ${isBeach ? 'bg-gradient-to-br from-[#00a896] to-[#ff4e50]' : 'bg-gradient-to-br from-[#d4af37] to-[#8B5E3C]'}`} />
          <div className="relative z-10">
            <div className="text-4xl mb-3">📸</div>
            <h3 className={`text-2xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
              {text('Prati nas na Instagramu', 'Follow us on Instagram')}
            </h3>
            <p className={`mt-2 text-sm ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>
              @capannabar · Sremska Mitrovica
            </p>
            <a
              href="https://instagram.com/capannabar"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 ${
                isBeach
                  ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-500/20'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/20'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @capannabar
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl font-light transition-colors"
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
          <img
            src={lightboxImg}
            alt="Gallery"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes waveMove {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.3) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
