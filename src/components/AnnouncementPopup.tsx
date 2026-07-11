import { useEffect, useState } from 'react';
import { getAnnouncement, isAnnouncementLive } from '../utils/staffStore';

const SEEN_KEY = 'capanna-announcement-seen-at';
const DAY_MS = 24 * 60 * 60 * 1000;

export default function AnnouncementPopup() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const announcement = getAnnouncement();

  useEffect(() => {
    const seenAt = Number(localStorage.getItem(SEEN_KEY) || 0);
    const hasContent = announcement.title.trim() || announcement.body.trim() || announcement.imageUrl.trim();
    if (isAnnouncementLive(announcement) && hasContent && Date.now() - seenAt > DAY_MS) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcement.active, announcement.activeFrom, announcement.activeUntil, announcement.body, announcement.imageUrl, announcement.title, version]);

  useEffect(() => {
    const refresh = () => setVersion(item => item + 1);
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  const close = () => {
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    setOpen(false);
  };

  if (!open || !isAnnouncementLive(announcement) || (!announcement.title.trim() && !announcement.body.trim() && !announcement.imageUrl.trim())) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#00a896]/25 bg-[#041410] shadow-2xl shadow-teal-950/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,168,150,0.24),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(255,78,80,0.16),transparent_30%)]" />
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 h-9 w-9 rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Zatvori"
        >
          ×
        </button>
        {announcement.imageUrl && (
          <img
            src={announcement.imageUrl}
            alt=""
            className="relative z-[1] h-56 w-full object-cover"
            loading="eager"
            decoding="async"
          />
        )}
        <div className="relative p-7 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#42f5df]">Capanna obaveštenje</div>
          {announcement.title && <h2 className="mt-3 text-3xl font-display font-bold leading-tight text-white">{announcement.title}</h2>}
          {announcement.body && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/65">{announcement.body}</p>}
          {announcement.footer && <div className="mt-6 rounded-xl bg-white/[0.06] p-3 text-xs leading-relaxed text-white/45">{announcement.footer}</div>}
        </div>
      </div>
    </div>
  );
}
