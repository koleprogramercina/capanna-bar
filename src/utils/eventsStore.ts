import { generateId } from './staffStore';

/** Vrste događaja koje admin bira pri objavi. */
export const EVENT_TYPES = [
  { id: 'dj', label: 'DJ veče', emoji: '🎧' },
  { id: 'bend', label: 'Bend / svirka', emoji: '🎸' },
  { id: 'zurka', label: 'Žurka', emoji: '🎉' },
  { id: 'tematsko', label: 'Tematsko veče', emoji: '✨' },
  { id: 'promocija', label: 'Promocija / akcija', emoji: '🍹' },
  { id: 'sport', label: 'Sportski prenos', emoji: '⚽' },
  { id: 'ostalo', label: 'Ostalo', emoji: '📌' },
] as const;

export type EventTypeId = (typeof EVENT_TYPES)[number]['id'];

export function eventTypeInfo(typeId?: string) {
  return EVENT_TYPES.find(item => item.id === typeId) || EVENT_TYPES[EVENT_TYPES.length - 1];
}

/** Događaj koji osoblje objavljuje iz admin panela (žurke, svirke, promocije...). */
export interface CapannaEvent {
  id: string;
  /** Datum događaja, yyyy-mm-dd. */
  date: string;
  title: string;
  /** Vrsta događaja — id iz EVENT_TYPES. */
  type?: EventTypeId;
  desc?: string;
  /** Vreme početka, npr. "21:00" (opciono). */
  time?: string;
  createdAt: string;
}

const EVENTS_KEY = 'capanna-events';

function readEvents(): CapannaEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as CapannaEvent[]) : [];
  } catch {
    return [];
  }
}

export function getEvents(): CapannaEvent[] {
  return readEvents().sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
}

export function saveEvents(events: CapannaEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent('capanna-data-updated', { detail: EVENTS_KEY }));
}

export function addEvent(payload: Omit<CapannaEvent, 'id' | 'createdAt'>) {
  const event: CapannaEvent = { ...payload, id: generateId('evt'), createdAt: new Date().toISOString() };
  saveEvents([...readEvents(), event]);
  return event;
}

export function deleteEvent(id: string) {
  saveEvents(readEvents().filter(event => event.id !== id));
}

/** Svi događaji za dati datum (yyyy-mm-dd). */
export function getEventsForDate(date: string): CapannaEvent[] {
  return getEvents().filter(event => event.date === date);
}

/** Predstojeći događaji (danas i kasnije). */
export function getUpcomingEvents(): CapannaEvent[] {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return getEvents().filter(event => event.date >= iso);
}
