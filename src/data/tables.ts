/**
 * Raspored stolova — digitalizovan 1:1 prema mapi vlasnika (jul 2026).
 *
 * Lokal ima dva dela razdvojena stepenicama:
 *  - GORNJI DEO (sa šankom, gore u sredini)
 *  - DONJI DEO (sa dve pregrade/ograde)
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
  // ─────────── GORNJI DEO (šank gore u sredini) ───────────
  // Levi blok
  { id: 'G1', label: 'G1', zone: 'gornji', x: 5, y: 6, w: 10, h: 10, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },
  { id: 'GX1', label: '✕', zone: 'gornji', x: 3.5, y: 24, w: 5, h: 15, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'GB1', label: 'B4', zone: 'gornji', x: 12.5, y: 24, w: 5, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'GBX1', label: 'BX', zone: 'gornji', x: 8, y: 35, w: 5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'G2', label: 'G2', zone: 'gornji', x: 3.5, y: 45, w: 5.5, h: 16, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },
  { id: 'GX2', label: '✕', zone: 'gornji', x: 12.5, y: 46, w: 5, h: 15, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  // Sredina (ispod šanka)
  { id: 'G3', label: 'G3', zone: 'gornji', x: 31, y: 31, w: 10, h: 9, seats: 6, seatsLabel: '4–6', kind: 'standard', reservable: true },
  { id: 'G4', label: 'G4', zone: 'gornji', x: 47, y: 31, w: 10, h: 9, seats: 6, seatsLabel: '4–6', kind: 'standard', reservable: true },
  { id: 'GX3', label: '✕', zone: 'gornji', x: 31, y: 59, w: 10, h: 9, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'GX4', label: '✕', zone: 'gornji', x: 46, y: 63, w: 10, h: 9, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  // Desni blok
  { id: 'G5', label: 'G5', zone: 'gornji', x: 70, y: 6, w: 9, h: 16, seats: 15, seatsLabel: '10–15', kind: 'standard', reservable: true },
  { id: 'GX5', label: '✕', zone: 'gornji', x: 66, y: 36, w: 13, h: 7, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'G6', label: 'G6', zone: 'gornji', x: 67.5, y: 50, w: 5, h: 8, seats: 4, seatsLabel: '4', kind: 'standard', reservable: true },
  { id: 'GX6', label: '✕', zone: 'gornji', x: 78, y: 59, w: 5, h: 8, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'GX7', label: '✕', zone: 'gornji', x: 70, y: 73, w: 5, h: 8, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },

  // ─────────── DONJI DEO (dve pregrade) ───────────
  // Levo od prve pregrade
  { id: 'DX1', label: '✕', zone: 'donji', x: 4, y: 16, w: 11, h: 13, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'DX2', label: '✕', zone: 'donji', x: 4, y: 49, w: 11, h: 13, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  // Srednji deo — X stolovi i klaster barskih
  { id: 'DX3', label: '✕', zone: 'donji', x: 24, y: 24, w: 8, h: 10, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'DBX1', label: 'BX', zone: 'donji', x: 36, y: 38, w: 4.5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX2', label: 'BX', zone: 'donji', x: 29, y: 46, w: 4.5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX3', label: 'BX', zone: 'donji', x: 36, y: 54, w: 4.5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX4', label: 'BX', zone: 'donji', x: 42.5, y: 46, w: 4.5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX5', label: 'BX', zone: 'donji', x: 42.5, y: 63, w: 4.5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DBX6', label: 'BX', zone: 'donji', x: 36, y: 72, w: 4.5, h: 8, seats: 4, seatsLabel: '—', kind: 'bar', reservable: false },
  { id: 'DB1', label: 'B4', zone: 'donji', x: 48.5, y: 39, w: 4.5, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'DB2', label: 'B4', zone: 'donji', x: 48.5, y: 55, w: 4.5, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'DB3', label: 'B4', zone: 'donji', x: 48.5, y: 74, w: 4.5, h: 8, seats: 4, seatsLabel: '4', kind: 'bar', reservable: true },
  { id: 'DX4', label: '✕', zone: 'donji', x: 25, y: 62, w: 8, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  // Centar-desno
  { id: 'D1', label: 'D1', zone: 'donji', x: 57, y: 33, w: 10, h: 10, seats: 6, seatsLabel: '6', kind: 'standard', reservable: true },
  { id: 'DX5', label: '✕', zone: 'donji', x: 58, y: 62, w: 9, h: 13, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  // Desno od druge pregrade
  { id: 'DX6', label: '✕', zone: 'donji', x: 76.5, y: 21, w: 7, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'D2', label: 'D2', zone: 'donji', x: 76.5, y: 55, w: 7, h: 12, seats: 4, seatsLabel: '4', kind: 'standard', reservable: true },
  { id: 'DX7', label: '✕', zone: 'donji', x: 89, y: 24, w: 7, h: 12, seats: 4, seatsLabel: '—', kind: 'standard', reservable: false },
  { id: 'D3', label: 'D3', zone: 'donji', x: 90, y: 62, w: 6, h: 11, seats: 4, seatsLabel: '4', kind: 'standard', reservable: true },
];

/** Pregrade/ograde u donjem delu (dekorativno, po mapi). */
export const donjiDividers = [
  { x: 18, y: 17, h: 58 },
  { x: 71, y: 19, h: 56 },
];
