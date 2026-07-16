/**
 * ═══════════════════════════════════════════════════════════════════
 *  CAPANNA — CENTRALNA KONFIGURACIJA
 * ═══════════════════════════════════════════════════════════════════
 *
 * ── SUPABASE (baza podataka — meni, rezervacije, sezona, obaveštenja, događaji) ──
 * Ako se ikad menja projekat, tabela se pravi ovim SQL-om (SQL Editor):
 *
 *    create table capanna_kv (
 *      key text primary key,
 *      value jsonb,
 *      updated_at timestamptz default now()
 *    );
 *    alter table capanna_kv enable row level security;
 *    create policy "public read"  on capanna_kv for select using (true);
 *    create policy "public write" on capanna_kv for insert with check (true);
 *    create policy "public update" on capanna_kv for update using (true);
 */
export const SUPABASE_URL = 'https://vwfmlidsgvmmkzlrgrod.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_QmPQw_SzMNHAFhctVh3zOg__by8yATE';

/** Javna adresa sajta (koristi se za QR meni i deljenje). */
export const PUBLIC_SITE_URL = 'https://capannabar.rs';
