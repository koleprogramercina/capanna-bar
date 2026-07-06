import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';

/**
 * Sinhronizacija sa Supabase bazom preko REST (PostgREST) API-ja.
 * Sve prolazi kroz jednu key-value tabelu `capanna_kv`, tako da meni,
 * rezervacije, aktivna sezona i obaveštenja rade isto kao do sada
 * (localStorage), a kada su ključevi u config.ts popunjeni — dele se
 * između svih posetilaca i uređaja.
 *
 * Nalozi i licencni ključevi osoblja se NAMERNO ne sinhronizuju
 * (ne treba da žive u javno čitljivoj tabeli).
 */

const SYNC_KEYS = [
  'capanna-menu',
  'capanna-reservations',
  'capanna-announcement',
  'capanna-active-season',
  'capanna-tables',
];

const POLL_INTERVAL_MS = 45_000;

let applyingRemote = false;
let started = false;

export function isCloudConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function headers() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function pushKey(key: string) {
  const raw = localStorage.getItem(key);
  if (raw === null) return;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = raw;
  }
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/capanna_kv`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
    });
  } catch (error) {
    console.warn('[capanna-sync] push failed for', key, error);
  }
}

async function pullAll() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/capanna_kv?select=key,value&key=in.(${SYNC_KEYS.map(k => `"${k}"`).join(',')})`,
      { headers: headers() }
    );
    if (!response.ok) return;
    const rows = (await response.json()) as Array<{ key: string; value: unknown }>;
    for (const row of rows) {
      const serialized = JSON.stringify(row.value);
      if (localStorage.getItem(row.key) !== serialized) {
        applyingRemote = true;
        try {
          localStorage.setItem(row.key, serialized);
          window.dispatchEvent(new CustomEvent('capanna-data-updated', { detail: row.key }));
        } finally {
          applyingRemote = false;
        }
      }
    }
  } catch (error) {
    console.warn('[capanna-sync] pull failed', error);
  }
}

/** Pokreće sync: inicijalni pull, periodični refresh i push na svaku lokalnu izmenu. */
export function initCloudSync() {
  if (started || !isCloudConfigured()) return;
  started = true;

  void pullAll();
  window.setInterval(() => void pullAll(), POLL_INTERVAL_MS);

  window.addEventListener('capanna-data-updated', event => {
    const key = (event as CustomEvent).detail as string | undefined;
    if (!key || applyingRemote || !SYNC_KEYS.includes(key)) return;
    void pushKey(key);
  });
}
