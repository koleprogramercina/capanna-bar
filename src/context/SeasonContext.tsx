import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getActiveSeason } from '../utils/staffStore';

export type Season = 'city' | 'beach';

interface SeasonContextType {
  season: Season;
  setSeason: (s: Season) => void;
  toggleSeason: () => void;
  isBeach: boolean;
  isCity: boolean;
  /** Sezona koju je vlasnik označio kao stvarno aktivnu (koji lokal radi). */
  activeSeason: Season;
}

const SeasonContext = createContext<SeasonContextType | null>(null);

function getDefaultSeason(): Season {
  // Vlasnikova aktivna sezona je autoritativna za početni prikaz.
  if (localStorage.getItem('capanna-active-season')) return getActiveSeason();
  const stored = localStorage.getItem('capanna-season');
  if (stored === 'beach' || stored === 'city') return stored;
  const month = new Date().getMonth(); // 0-indexed
  // May(4) – September(8) => beach, October(9)–April(3) => city
  return month >= 4 && month <= 8 ? 'beach' : 'city';
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeasonState] = useState<Season>(getDefaultSeason);
  const [activeSeason, setActiveSeasonState] = useState<Season>(getActiveSeason);

  useEffect(() => {
    localStorage.setItem('capanna-season', season);
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  useEffect(() => {
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail && detail !== 'capanna-active-season') return;
      const next = getActiveSeason();
      setActiveSeasonState(previous => {
        if (previous !== next) setSeasonState(next);
        return next;
      });
    };
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  const setSeason = (s: Season) => setSeasonState(s);
  const toggleSeason = () => setSeasonState(prev => prev === 'city' ? 'beach' : 'city');

  return (
    <SeasonContext.Provider value={{
      season,
      setSeason,
      toggleSeason,
      isBeach: season === 'beach',
      isCity: season === 'city',
      activeSeason,
    }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be used inside SeasonProvider');
  return ctx;
}
