/**
 * Raspored stolova — digitalizovan prema skici vlasnika (jul 2026).
 *
 * Lokal ima dva dela razdvojena stepenicama:
 *  - GORNJI DEO (uz šank)
 *  - DONJI DEO
 *
 * Vrste stolova:
 *  - kind: 'standard', reservable: true  → normalan sto, broj = maks. osoba
 *  - kind: 'standard', reservable: false → "X" sto, NIKADA se ne rezerviše (samo za goste koji dođu)
 *  - kind: 'bar', reservable: true       → barski sto (B4), postavlja se SAMO za žurke (petak/subota)
 *  - kind: 'bar', reservable: false      → barski sto (BX), stoji za žurke ali se ne rezerviše
 *
 * Pravila žurke: petak i subota veče; rezervacije važe najkasnije do 21:30.
 * x/y/w/h su procenti unutar platna zone (0–100).
 */

export type TableZone = 'gornji' | 'donji';

export interface TableSpot {
  id: string;
  label: string;
  zone: TableZone;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Maksimalan broj osoba za stolom. */
  seats: number;
  /** Prikaz kapaciteta, npr. "4–6" ili "10–15". */
  seatsLabel: string;
  kind: 'standard' | 'bar';
  reservable: boolean;
}

/** Vreme do kog važe rezervacije petkom i subotom (žurka). */
export const PARTY_CUTOFF = '21:30';

/** Da li je datum (yyyy-mm-dd) petak ili subota — veče žurke. */
export function isPartyNight(dateStr: string): boolean {
  const day = new Date(`${dateStr}T12:00`).getDay();
  return day === 5 || day === 6;
}

export const zoneLabels: Record<TableZone, { sr: string; en: string }> = {
  gornji: { sr: 'Gornji deo', en: 'Upper area' },
  donji: { sr: 'Donji deo', en: 'Lower area' },
};

export const beachTables: TableSpot[] = [
  // ─────────── GORNJI DEO (uz šank) ───────────
  { id: 'G1', label: 'G1', zone: 'gornji', x: 8, y: 12, w: 11, h: 14, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },
  { id: 'GX1', label: '✕', zone: 'gornji', x: 26, y: 14, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'GB1', label: 'B4', zone: 'gornji', x: 42, y: 12, w: 6, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'GBX1', label: 'BX', zone: 'gornji', x: 52, y: 22, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'GX2', label: '✕', zone: 'gornji', x: 18, y: 34, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'G2', label: 'G2', zone: 'gornji', x: 36, y: 38, w: 11, h: 14, seats: 6, seatsLabel: '4–6', kind: 'standard', reservable: true },
  { id: 'GX3', label: '✕', zone: 'gornji', x: 56, y: 40, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'G3', label: 'G3', zone: 'gornji', x: 76, y: 34, w: 11, h: 14, seats: 6, seatsLabel: '4–6', kind: 'standard', reservable: true },
  { id: 'GX4', label: '✕', zone: 'gornji', x: 10, y: 58, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'G4', label: 'G4', zone: 'gornji', x: 28, y: 60, w: 9, h: 12, seats: 4, seatsLabel: '4', kind: 'standard', reservable: true },
  { id: 'GX5', label: '✕', zone: 'gornji', x: 46, y: 62, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'G5', label: 'G5', zone: 'gornji', x: 68, y: 58, w: 17, h: 14, seats: 15, seatsLabel: '10–15', kind: 'standard', reservable: true },
  { id: 'GX6', label: '✕', zone: 'gornji', x: 24, y: 80, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'G6', label: 'G6', zone: 'gornji', x: 46, y: 80, w: 11, h: 13, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },

  // ─────────── DONJI DEO ───────────
  { id: 'DX1', label: '✕', zone: 'donji', x: 8, y: 8, w: 10, h: 13, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'DX2', label: '✕', zone: 'donji', x: 26, y: 8, w: 10, h: 13, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'D1', label: 'D1', zone: 'donji', x: 76, y: 10, w: 11, h: 14, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },
  { id: 'DX3', label: '✕', zone: 'donji', x: 8, y: 32, w: 12, h: 15, seats: 6, seatsLabel: '—', kind: 'standard', reservable: false },
  // Klaster barskih stolova (postavljaju se samo za žurku)
  { id: 'DBX1', label: 'BX', zone: 'donji', x: 34, y: 30, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX2', label: 'BX', zone: 'donji', x: 43, y: 34, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX3', label: 'BX', zone: 'donji', x: 52, y: 30, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX4', label: 'BX', zone: 'donji', x: 34, y: 44, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX5', label: 'BX', zone: 'donji', x: 43, y: 48, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX6', label: 'BX', zone: 'donji', x: 52, y: 44, w: 6, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DB1', label: 'B4', zone: 'donji', x: 63, y: 32, w: 6, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'DB2', label: 'B4', zone: 'donji', x: 63, y: 46, w: 6, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'DB3', label: 'B4', zone: 'donji', x: 30, y: 56, w: 6, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'D2', label: 'D2', zone: 'donji', x: 46, y: 62, w: 11, h: 13, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },
  { id: 'DX4', label: '✕', zone: 'donji', x: 10, y: 58, w: 12, h: 15, seats: 6, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'D3', label: 'D3', zone: 'donji', x: 8, y: 80, w: 9, h: 12, seats: 4, seatsLabel: '4', kind: 'standard', reservable: true },
  { id: 'DX5', label: '✕', zone: 'donji', x: 28, y: 80, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'DX6', label: '✕', zone: 'donji', x: 48, y: 80, w: 9, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'D4', label: 'D4', zone: 'donji', x: 70, y: 78, w: 9, h: 12, seats: 4, seatsLabel: '4', kind: 'standard', reservable: true },
];
