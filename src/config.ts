/**
 * ═══════════════════════════════════════════════════════════════════
 *  CAPANNA — CENTRALNA KONFIGURACIJA
 *  Ovo je jedini fajl koji treba popuniti da sajt proradi "u oblaku".
 * ═══════════════════════════════════════════════════════════════════
 *
 * ── SUPABASE (baza podataka — meni, rezervacije, sezona, obaveštenja) ──
 * 1. Napravi besplatan nalog na https://supabase.com i novi projekat.
 * 2. U SQL editoru pokreni:
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
 *
 * 3. U Settings → API kopiraj "Project URL" i "anon public" ključ ovde:
 */
export const SUPABASE_URL = ''; // npr. https://abcdefgh.supabase.co  (Settings → API → Project URL)
export const SUPABASE_ANON_KEY = 'sb_publishable_eIW8TlMP4tpUCQ3wzWJUmA_OsBMVOJF';

/**
 * ── EMAILJS (slanje email potvrda gostima) ──
 * 1. Napravi besplatan nalog na https://www.emailjs.com (200 mejlova/mesec besplatno).
 * 2. Dodaj Email Service (npr. Gmail) → kopiraj Service ID.
 * 3. Napravi dva template-a i kopiraj njihove ID-jeve:
 *    - "Zahtev primljen"  → koristi promenljive: {{to_email}}, {{guest_name}},
 *      {{table_label}}, {{date}}, {{time}}, {{guests}}
 *    - "Rezervacija potvrđena" → iste promenljive
 *    (u template podešavanjima stavi "To email" = {{to_email}})
 * 4. U Account → General kopiraj Public Key.
 */
export const EMAILJS_PUBLIC_KEY = '';
export const EMAILJS_SERVICE_ID = '';
export const EMAILJS_TEMPLATE_REQUEST = '';
export const EMAILJS_TEMPLATE_APPROVED = '';

/**
 * Javna adresa sajta (koristi se za QR meni i email linkove).
 * Kada stigne pravi domen (npr. capannabar.rs), promeni samo ovu liniju.
 */
export const PUBLIC_SITE_URL = 'https://koleprogramercina.github.io/capanna-bar';
