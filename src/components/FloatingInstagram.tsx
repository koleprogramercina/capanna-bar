import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingInstagram() {
  const { isBeach } = useSeason();
  const { text } = useLanguage();

  return (
    <a
      href="https://instagram.com/capannabar"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={text('Pošalji Instagram poruku', 'Send Instagram message')}
      className={`fixed bottom-5 right-5 z-40 md:hidden h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
        isBeach
          ? 'bg-gradient-to-br from-[#00a896] via-[#02c8b3] to-[#ff4e50] text-white shadow-2xl shadow-teal-950/50'
          : 'bg-gradient-to-br from-[#d4af37] via-[#c99a2b] to-[#8B5E3C] text-[#1a110b] shadow-2xl shadow-amber-950/50'
      }`}
    >
      <span className={`absolute inset-0 rounded-full animate-ping ${
        isBeach ? 'bg-[#00a896]/25' : 'bg-[#d4af37]/25'
      }`} />
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="relative h-6 w-6"
        aria-hidden="true"
      >
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.67 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.69-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
      </svg>
    </a>
  );
}
