import { useSeason } from '../context/SeasonContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-24 w-24',
};

export default function BrandLogo({ size = 'md', withText = true, className = '' }: BrandLogoProps) {
  const { isBeach } = useSeason();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="images/capanna-logo-light.png"
        alt="Capanna Bar"
        className={`${sizeMap[size]} object-contain transition-[filter] duration-500 ${
          isBeach
            ? 'drop-shadow-[0_0_14px_rgba(0,214,192,0.35)]'
            : 'drop-shadow-[0_0_14px_rgba(212,175,55,0.35)]'
        }`}
        loading="eager"
        decoding="async"
      />
      {withText && (
        <div className="leading-none">
          <div className={`font-display text-xl font-black uppercase tracking-[0.08em] ${isBeach ? 'text-white' : 'text-[#fff0d2]'}`}>
            Capanna
          </div>
          <div className={`mt-1 text-[10px] font-bold uppercase tracking-[0.34em] ${isBeach ? 'text-[#43f5de]' : 'text-[#f0c84d]'}`}>
            Bar
          </div>
        </div>
      )}
    </div>
  );
}
