import { isCloudConfigured } from './cloudSync';

export type StaffRole = 'owner' | 'manager' | 'waiter';
export type ReservationStatus = 'pending' | 'approved' | 'declined';
export type SeasonMode = 'city' | 'beach';

export interface LicenseKey {
  key: string;
  role: StaffRole;
  note: string;
  usedBy?: string;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
}

export interface StaffAccount {
  username: string;
  passwordHash: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
}

export interface ReservationRequest {
  id: string;
  tableId: string;
  tableLabel: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  note: string;
  status: ReservationStatus;
  guestNotified: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  footer: string;
  imageUrl: string;
  active: boolean;
  /** Popup je vidljiv tek od ovog trenutka (datetime-local, opciono). */
  activeFrom?: string;
  /** Popup se sam gasi posle ovog trenutka (datetime-local, opciono). */
  activeUntil?: string;
  updatedAt: string;
}

/** Da li popup treba da se prikazuje sada (aktivan + unutar zakazanog raspona). */
export function isAnnouncementLive(announcement: Announcement, now = new Date()): boolean {
  if (!announcement.active) return false;
  if (announcement.activeFrom && now < new Date(announcement.activeFrom)) return false;
  if (announcement.activeUntil && now > new Date(announcement.activeUntil)) return false;
  return true;
}

const LICENSES_KEY = 'capanna-staff-licenses';
const ACCOUNTS_KEY = 'capanna-staff-accounts';
const SESSION_KEY = 'capanna-staff-session';
const RESERVATIONS_KEY = 'capanna-reservations';
const ANNOUNCEMENT_KEY = 'capanna-announcement';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('capanna-data-updated', { detail: key }));
}

function hashPassword(value: string) {
  return btoa(unescape(encodeURIComponent(`capanna:${value}`)));
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ensureStaffSeed() {
  // Kada je baza povezana, ključevi i nalozi žive u njoj — nikakav lokalni
  // seed se ne upisuje (da hardkodovani ključ ne bi pregazio prave podatke).
  if (isCloudConfigured()) return;
  // Fallback samo za lokalni razvoj bez baze, i to isključivo na prvom pokretanju.
  const licenses = readJson<LicenseKey[]>(LICENSES_KEY, []);
  const accounts = readJson<StaffAccount[]>(ACCOUNTS_KEY, []);
  if (licenses.length === 0 && accounts.length === 0) {
    writeJson<LicenseKey[]>(LICENSES_KEY, [
      {
        key: 'CAPANNA-OWNER-2026',
        role: 'owner',
        note: 'Initial owner setup key (samo lokalni dev)',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ]);
  }
}

export function getLicenses() {
  ensureStaffSeed();
  return readJson<LicenseKey[]>(LICENSES_KEY, []);
}

export function saveLicenses(licenses: LicenseKey[]) {
  writeJson(LICENSES_KEY, licenses);
}

export function createLicense(role: StaffRole, note: string, expiresAt?: string) {
  const key = `CAPANNA-${role.toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const licenses = getLicenses();
  const license: LicenseKey = {
    key,
    role,
    note,
    expiresAt,
    active: true,
    createdAt: new Date().toISOString(),
  };
  saveLicenses([license, ...licenses]);
  return license;
}

export function getAccounts() {
  return readJson<StaffAccount[]>(ACCOUNTS_KEY, []);
}

export function getCurrentStaff() {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return null;
  return getAccounts().find(account => account.username === username && account.active) || null;
}

export function registerStaff(licenseKey: string, username: string, password: string) {
  const normalizedKey = licenseKey.trim().toUpperCase();
  const normalizedUsername = username.trim().toLowerCase();
  const licenses = getLicenses();
  const license = licenses.find(item => item.key === normalizedKey);
  if (!license || !license.active || license.usedBy) return { ok: false, message: 'License key nije validan ili je već iskorišćen.' };
  if (license.expiresAt && new Date(license.expiresAt) < new Date()) return { ok: false, message: 'License key je istekao.' };
  const accounts = getAccounts();
  if (accounts.some(account => account.username === normalizedUsername)) return { ok: false, message: 'Username već postoji.' };

  const account: StaffAccount = {
    username: normalizedUsername,
    passwordHash: hashPassword(password),
    role: license.role,
    active: true,
    createdAt: new Date().toISOString(),
  };
  writeJson(ACCOUNTS_KEY, [account, ...accounts]);
  saveLicenses(licenses.map(item => item.key === normalizedKey ? { ...item, usedBy: normalizedUsername } : item));
  localStorage.setItem(SESSION_KEY, normalizedUsername);
  return { ok: true, message: 'Nalog je napravljen.' };
}

export function loginStaff(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();
  const account = getAccounts().find(item => item.username === normalizedUsername && item.active);
  if (!account || account.passwordHash !== hashPassword(password)) return false;
  localStorage.setItem(SESSION_KEY, normalizedUsername);
  return true;
}

export function logoutStaff() {
  localStorage.removeItem(SESSION_KEY);
}

export function getReservations() {
  return readJson<ReservationRequest[]>(RESERVATIONS_KEY, []);
}

export function saveReservations(reservations: ReservationRequest[]) {
  writeJson(RESERVATIONS_KEY, reservations);
}

export function createReservation(payload: Omit<ReservationRequest, 'id' | 'status' | 'guestNotified' | 'createdAt'>) {
  const reservation: ReservationRequest = {
    ...payload,
    id: generateId('res'),
    status: 'pending',
    guestNotified: false,
    createdAt: new Date().toISOString(),
  };
  saveReservations([reservation, ...getReservations()]);
  return reservation;
}

export function updateReservationStatus(id: string, status: ReservationStatus) {
  saveReservations(getReservations().map(item => item.id === id ? { ...item, status, guestNotified: status === 'approved' ? item.guestNotified : false } : item));
}

export function getActiveSeason(): SeasonMode {
  const stored = readJson<SeasonMode | null>('capanna-active-season', null);
  if (stored === 'city' || stored === 'beach') return stored;
  const month = new Date().getMonth();
  return month >= 4 && month <= 8 ? 'beach' : 'city';
}

export function setActiveSeason(season: SeasonMode) {
  writeJson('capanna-active-season', season);
}

export function updateReservationNotification(id: string, guestNotified: boolean) {
  saveReservations(getReservations().map(item => item.id === id ? { ...item, guestNotified } : item));
}

export function getAnnouncement() {
  const fallback: Announcement = {
    id: 'staff-message',
    title: '',
    body: '',
    footer: '',
    imageUrl: '',
    active: false,
    updatedAt: new Date().toISOString(),
  };
  const stored = readJson<Announcement & { ctaLabel?: string; ctaHref?: string }>(ANNOUNCEMENT_KEY, fallback);
  if (stored.ctaLabel || stored.ctaHref || stored.id === 'welcome') {
    const migrated = {
      ...fallback,
      title: stored.title || '',
      body: stored.body || '',
      footer: '',
      imageUrl: '',
      active: false,
      updatedAt: new Date().toISOString(),
    };
    saveAnnouncement(migrated);
    return migrated;
  }
  return { ...fallback, ...stored };
}

export function saveAnnouncement(announcement: Announcement) {
  writeJson(ANNOUNCEMENT_KEY, announcement);
}
