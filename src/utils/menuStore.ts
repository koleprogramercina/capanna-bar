import { defaultBeachMenu, defaultCityMenu, MenuCategory, MenuItem } from '../data/menuData';

export type { MenuCategory, MenuItem };
export type MenuSeason = 'city' | 'beach';

export interface StoredMenus {
  city: MenuCategory[];
  beach: MenuCategory[];
}

const MENU_KEY = 'capanna-menu';

function readMenus(): StoredMenus | null {
  try {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredMenus;
    if (!Array.isArray(parsed.city) || !Array.isArray(parsed.beach)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getMenus(): StoredMenus {
  return readMenus() ?? { city: defaultCityMenu, beach: defaultBeachMenu };
}

export function saveMenus(menus: StoredMenus) {
  localStorage.setItem(MENU_KEY, JSON.stringify(menus));
  window.dispatchEvent(new CustomEvent('capanna-data-updated', { detail: MENU_KEY }));
}

export function resetMenus() {
  localStorage.removeItem(MENU_KEY);
  window.dispatchEvent(new CustomEvent('capanna-data-updated', { detail: MENU_KEY }));
}

export function hasCustomMenus() {
  return readMenus() !== null;
}

/** Subscribe to menu changes from this tab (custom event) and other tabs (storage event). */
export function onMenusChanged(callback: () => void) {
  const onCustom = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (!detail || detail === MENU_KEY) callback();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === MENU_KEY) callback();
  };
  window.addEventListener('capanna-data-updated', onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('capanna-data-updated', onCustom);
    window.removeEventListener('storage', onStorage);
  };
}

export function slugifyCategoryId(label: string) {
  return (
    label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `kategorija-${Date.now().toString(36)}`
  );
}
