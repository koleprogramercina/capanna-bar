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

// Sezonu koju posetioci vide određuje ISKLJUČIVO vlasnik iz admin panela
// (capanna-active-season). Posetioci je ne mogu menjati.
function getDefaultSeason(): Season {
  return getActiveSeason();
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeasonState] = useState<Season>(getDefaultSeason);
  const [activeSeason, setActiveSeasonState] = useState<Season>(getActiveSeason);

  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  useEffect(() => {
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail && detail !== 'capanna-active-season') return;
      // Javni prikaz uvek prati vlasnikovu aktivnu sezonu.
      const next = getActiveSeason();
      setActiveSeasonState(next);
      setSeasonState(next);
    };
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  // setSeason/toggleSeason zadržani su za admin panel (StaffPortal); javni sajt ih ne koristi.
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
