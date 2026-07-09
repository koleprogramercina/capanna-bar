/**
 * Raspored stolova za beach rezervacije.
 *
 * Kada stigne prava mapa lokala:
 * 1. Ubaci sliku mape u `public/images/` i promeni MAP_BACKGROUND_IMAGE.
 * 2. Ažuriraj koordinate (x, y su procenti od širine/visine mape),
 *    zone, broj mesta i oznake stolova ispod.
 * Sve ostalo (status, rezervacije, admin pregled) radi automatski.
 */

export interface TableSpot {
  id: string;
  label: string;
  zone: string;
  /** Pozicija u procentima od leve ivice mape (0–100). */
  x: number;
  /** Pozicija u procentima od gornje ivice mape (0–100). */
  y: number;
  seats: number;
}

export const MAP_BACKGROUND_IMAGE = 'images/beach-loungers.jpg';

export const beachTables: TableSpot[] = [
  { id: 'S1', label: 'S1', zone: 'Suncobrani', x: 13, y: 28, seats: 4 },
  { id: 'S2', label: 'S2', zone: 'Suncobrani', x: 25, y: 24, seats: 4 },
  { id: 'S3', label: 'S3', zone: 'Suncobrani', x: 37, y: 28, seats: 4 },
  { id: 'S4', label: 'S4', zone: 'Suncobrani', x: 49, y: 24, seats: 4 },
  { id: 'S5', label: 'S5', zone: 'Suncobrani', x: 61, y: 28, seats: 4 },
  { id: 'S6', label: 'S6', zone: 'Suncobrani', x: 73, y: 24, seats: 4 },
  { id: 'B1', label: 'B1', zone: 'Bar', x: 18, y: 48, seats: 6 },
  { id: 'B2', label: 'B2', zone: 'Bar', x: 32, y: 53, seats: 6 },
  { id: 'B3', label: 'B3', zone: 'Bar', x: 47, y: 48, seats: 6 },
  { id: 'B4', label: 'B4', zone: 'Bar', x: 62, y: 53, seats: 6 },
  { id: 'B5', label: 'B5', zone: 'Bar', x: 77, y: 48, seats: 6 },
  { id: 'L1', label: 'L1', zone: 'Ležaljke', x: 17, y: 72, seats: 2 },
  { id: 'L2', label: 'L2', zone: 'Ležaljke', x: 29, y: 76, seats: 2 },
  { id: 'L3', label: 'L3', zone: 'Ležaljke', x: 41, y: 72, seats: 2 },
  { id: 'L4', label: 'L4', zone: 'Ležaljke', x: 53, y: 76, seats: 2 },
  { id: 'L5', label: 'L5', zone: 'Ležaljke', x: 65, y: 72, seats: 2 },
  { id: 'L6', label: 'L6', zone: 'Ležaljke', x: 77, y: 76, seats: 2 },
  { id: 'VIP1', label: 'VIP 1', zone: 'VIP', x: 88, y: 34, seats: 8 },
  { id: 'VIP2', label: 'VIP 2', zone: 'VIP', x: 90, y: 60, seats: 10 },
];
