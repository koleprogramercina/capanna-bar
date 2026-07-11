import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import BeachReservationMap from '../components/BeachReservationMap';
import BrandLogo from '../components/BrandLogo';
import { useSeason } from '../context/SeasonContext';
import {
  createLicense,
  getAccounts,
  getAnnouncement,
  getCurrentStaff,
  getLicenses,
  getReservations,
  LicenseKey,
  loginStaff,
  logoutStaff,
  registerStaff,
  ReservationRequest,
  saveAnnouncement,
  StaffAccount,
  StaffRole,
  updateReservationNotification,
  updateReservationStatus,
} from '../utils/staffStore';
import {
  getMenus,
  hasCustomMenus,
  MenuItem,
  MenuSeason,
  onMenusChanged,
  resetMenus,
  saveMenus,
  slugifyCategoryId,
  StoredMenus,
} from '../utils/menuStore';
import { getActiveSeason, setActiveSeason } from '../utils/staffStore';
import { isCloudConfigured } from '../utils/cloudSync';
import { isEmailConfigured } from '../utils/emailService';
import { addEvent, CapannaEvent, deleteEvent, getEvents } from '../utils/eventsStore';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/38">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-[#00a896]/60';

const roleLabel: Record<StaffRole, string> = {
  owner: 'Vlasnik',
  manager: 'Menadžer',
  waiter: 'Konobar',
};

const statusLabel = {
  pending: 'Na čekanju',
  approved: 'Odobreno',
  declined: 'Odbijeno',
};

function StaffGate({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get('username') || '');
    const password = String(form.get('password') || '');

    if (mode === 'login') {
      if (loginStaff(username, password)) onAuth();
      else setMessage('Pogrešno korisničko ime ili šifra.');
      return;
    }

    const result = registerStaff(String(form.get('license') || ''), username, password);
    setMessage(result.message);
    if (result.ok) onAuth();
  };

  return (
    <div className="min-h-screen bg-[#050807] px-5 py-12 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <BrandLogo size="lg" className="mb-8" />
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-[#00a896]">Admin pristup</div>
          <h1 className="mt-4 text-5xl font-display font-black leading-none">Capanna panel</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/58">
            Panel je za zaposlene. Prvo se aktivira licencni ključ, zatim svaki član osoblja koristi svoje korisničko ime i šifru.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/45">
            Nemaš ključ? Zatraži ga od vlasnika — generiše se u panelu, u sekciji „Licencni ključevi za osoblje".
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-6 flex rounded-xl bg-black/30 p-1">
            {(['login', 'register'] as const).map(item => (
              <button
                type="button"
                key={item}
                onClick={() => { setMode(item); setMessage(''); }}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${mode === item ? 'bg-[#00a896] text-white' : 'text-white/45'}`}
              >
                {item === 'login' ? 'Prijava' : 'Aktiviraj ključ'}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {mode === 'register' && (
              <Field label="Licencni ključ">
                <input name="license" required className={inputClass} placeholder="CAPANNA-..." />
              </Field>
            )}
            <Field label="Korisničko ime">
              <input name="username" required className={inputClass} placeholder="npr. marko" />
            </Field>
            <Field label="Šifra">
              <input name="password" required type="password" minLength={5} className={inputClass} placeholder="minimum 5 karaktera" />
            </Field>
          </div>
          {message && <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{message}</div>}
          <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#00a896] to-[#02c8b3] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white">
            {mode === 'login' ? 'Otvori panel' : 'Napravi nalog'}
          </button>
        </form>
      </div>
    </div>
  );
}

const emptyItemForm = {
  name: '',
  price: '',
  desc: '',
  emoji: '',
  badge: '',
  allergens: '',
  categoryId: '',
  newCatLabel: '',
  newCatEmoji: '',
};

function MenuManager() {
  const [menus, setMenusState] = useState<StoredMenus>(getMenus);
  const [seasonTab, setSeasonTab] = useState<MenuSeason>('city');
  const [editing, setEditing] = useState<{ catId: string; index: number } | null>(null);
  const [form, setForm] = useState(emptyItemForm);
  const [notice, setNotice] = useState('');

  useEffect(() => onMenusChanged(() => setMenusState(getMenus())), []);

  const categories = menus[seasonTab];
  const set = (patch: Partial<typeof emptyItemForm>) => setForm(current => ({ ...current, ...patch }));

  const commit = (next: StoredMenus, message: string) => {
    saveMenus(next);
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const startEdit = (catId: string, index: number) => {
    const item = categories.find(cat => cat.id === catId)?.items[index];
    if (!item) return;
    setEditing({ catId, index });
    setForm({
      name: item.name,
      price: item.price,
      desc: item.desc || '',
      emoji: item.emoji || '',
      badge: item.badge || '',
      allergens: item.allergens || '',
      categoryId: catId,
      newCatLabel: '',
      newCatEmoji: '',
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyItemForm);
  };

  const submitItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.price.trim()) return;
    const next: StoredMenus = JSON.parse(JSON.stringify(menus));
    const list = next[seasonTab];

    let targetId = form.categoryId;
    if (targetId === '__new__') {
      const label = form.newCatLabel.trim();
      if (!label) return;
      targetId = slugifyCategoryId(label);
      if (!list.some(cat => cat.id === targetId)) {
        list.push({ id: targetId, label, emoji: form.newCatEmoji.trim() || '🍽️', season: seasonTab, items: [] });
      }
    }
    if (!targetId) targetId = list[0]?.id;
    const targetCat = list.find(cat => cat.id === targetId);
    if (!targetCat) return;

    const preserved = editing ? list.find(cat => cat.id === editing.catId)?.items[editing.index] : undefined;
    const item: MenuItem = {
      ...preserved,
      name: form.name.trim(),
      price: form.price.trim(),
      desc: form.desc.trim() || undefined,
      emoji: form.emoji.trim() || preserved?.emoji || '🍽️',
      badge: form.badge.trim() || undefined,
      allergens: form.allergens.trim() || undefined,
    };

    if (editing) {
      const sourceCat = list.find(cat => cat.id === editing.catId);
      if (!sourceCat) return;
      if (editing.catId === targetId) {
        sourceCat.items[editing.index] = item;
      } else {
        sourceCat.items.splice(editing.index, 1);
        targetCat.items.push(item);
      }
    } else {
      targetCat.items.push(item);
    }

    commit(next, editing ? 'Proizvod je izmenjen.' : 'Proizvod je dodat u meni.');
    cancelEdit();
  };

  const deleteItem = (catId: string, index: number) => {
    const next: StoredMenus = JSON.parse(JSON.stringify(menus));
    const cat = next[seasonTab].find(entry => entry.id === catId);
    if (!cat) return;
    cat.items.splice(index, 1);
    if (editing && editing.catId === catId && editing.index === index) cancelEdit();
    commit(next, 'Proizvod je obrisan.');
  };

  const deleteCategory = (catId: string) => {
    const cat = categories.find(entry => entry.id === catId);
    if (!cat) return;
    if (!window.confirm(`Obrisati kategoriju "${cat.label}" i svih ${cat.items.length} proizvoda?`)) return;
    const next: StoredMenus = JSON.parse(JSON.stringify(menus));
    next[seasonTab] = next[seasonTab].filter(entry => entry.id !== catId);
    if (editing && editing.catId === catId) cancelEdit();
    commit(next, 'Kategorija je obrisana.');
  };

  const restoreDefaults = () => {
    if (!window.confirm('Vratiti kompletan meni (grad i plaža) na podrazumevani? Sve izmene se gube.')) return;
    resetMenus();
    cancelEdit();
    setNotice('Meni je vraćen na podrazumevani.');
    window.setTimeout(() => setNotice(''), 3000);
  };

  return (
    <section className="rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.04] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-display font-bold">Uređivanje menija</h2>
          <p className="mt-1 text-sm text-white/45">
            Vlasnički pristup. Izmene se odmah vide na javnom sajtu. {hasCustomMenus() ? 'Aktivan je izmenjeni meni.' : 'Aktivan je podrazumevani meni.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-black/30 p-1">
            {(['city', 'beach'] as const).map(item => (
              <button
                key={item}
                onClick={() => { setSeasonTab(item); cancelEdit(); }}
                className={`rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider ${seasonTab === item ? 'bg-[#d4af37] text-[#1a110b]' : 'text-white/45'}`}
              >
                {item === 'city' ? 'Grad' : 'Plaža'}
              </button>
            ))}
          </div>
          <button
            onClick={restoreDefaults}
            className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/60"
          >
            Vrati podrazumevani
          </button>
        </div>
      </div>

      {notice && <div className="mt-4 rounded-xl bg-emerald-500/12 p-3 text-sm text-emerald-200">{notice}</div>}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {categories.length === 0 && (
            <div className="rounded-xl bg-white/[0.03] p-4 text-sm text-white/45">Nema kategorija. Dodaj proizvod sa novom kategorijom desno.</div>
          )}
          {categories.map(cat => (
            <div key={cat.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <span className="text-lg">{cat.emoji}</span>
                  {cat.label}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/55">{cat.items.length}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="rounded-lg bg-red-500/12 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-200"
                >
                  Obriši kategoriju
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {cat.items.length === 0 && <div className="rounded-lg bg-white/[0.03] p-3 text-xs text-white/40">Kategorija je prazna.</div>}
                {cat.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className={`flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between ${
                      editing && editing.catId === cat.id && editing.index === index ? 'bg-[#d4af37]/12 ring-1 ring-[#d4af37]/40' : 'bg-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-white">
                        <span>{item.emoji}</span>
                        <span className="font-semibold">{item.name}</span>
                        <span className="font-bold text-[#d4af37]">{item.price}</span>
                        {item.badge && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60">{item.badge}</span>}
                      </div>
                      {item.desc && <div className="mt-1 truncate text-xs text-white/45">{item.desc}</div>}
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <button onClick={() => startEdit(cat.id, index)} className="rounded-lg bg-sky-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200">Izmeni</button>
                      <button onClick={() => deleteItem(cat.id, index)} className="rounded-lg bg-red-500/12 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-200">Obriši</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submitItem} className="h-fit rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-lg font-bold">{editing ? 'Izmena proizvoda' : 'Novi proizvod'}</h3>
          <div className="mt-4 space-y-3">
            <Field label="Naziv proizvoda">
              <input value={form.name} onChange={event => set({ name: event.currentTarget.value })} required className={inputClass} placeholder="npr. Espresso Tonic" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cena">
                <input value={form.price} onChange={event => set({ price: event.currentTarget.value })} required className={inputClass} placeholder="npr. 320 din" />
              </Field>
              <Field label="Emoji">
                <input value={form.emoji} onChange={event => set({ emoji: event.currentTarget.value })} className={inputClass} placeholder="npr. ☕" />
              </Field>
            </div>
            <Field label="Opis">
              <textarea value={form.desc} onChange={event => set({ desc: event.currentTarget.value })} rows={2} className={inputClass} placeholder="Kratak opis proizvoda" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bedž (opciono)">
                <input value={form.badge} onChange={event => set({ badge: event.currentTarget.value })} className={inputClass} placeholder="npr. Novo" />
              </Field>
              <Field label="Alergeni (opciono)">
                <input value={form.allergens} onChange={event => set({ allergens: event.currentTarget.value })} className={inputClass} placeholder="npr. Mleko" />
              </Field>
            </div>
            <Field label="Kategorija">
              <select value={form.categoryId} onChange={event => set({ categoryId: event.currentTarget.value })} required className={inputClass}>
                <option value="" disabled>Izaberi kategoriju</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                ))}
                <option value="__new__">➕ Nova kategorija...</option>
              </select>
            </Field>
            {form.categoryId === '__new__' && (
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <Field label="Naziv nove kategorije">
                  <input value={form.newCatLabel} onChange={event => set({ newCatLabel: event.currentTarget.value })} required className={inputClass} placeholder="npr. Vino" />
                </Field>
                <Field label="Emoji">
                  <input value={form.newCatEmoji} onChange={event => set({ newCatEmoji: event.currentTarget.value })} className={inputClass} placeholder="🍷" />
                </Field>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex-1 rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#1a110b]">
              {editing ? 'Sačuvaj izmene' : 'Dodaj proizvod'}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white/60">
                Otkaži
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function StatsSection({ reservations }: { reservations: ReservationRequest[] }) {
  const days = useMemo(() => {
    const list: Array<{ key: string; label: string; count: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      list.push({ key, label: `${date.getDate()}.${date.getMonth() + 1}.`, count: 0 });
    }
    reservations.forEach(item => {
      const key = item.createdAt.slice(0, 10);
      const entry = list.find(day => day.key === key);
      if (entry) entry.count += 1;
    });
    return list;
  }, [reservations]);

  const maxCount = Math.max(1, ...days.map(day => day.count));
  const total = reservations.length;
  const approved = reservations.filter(item => item.status === 'approved');
  const conversion = total > 0 ? Math.round((approved.length / total) * 100) : 0;
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = approved.filter(item => item.date >= todayIso);
  const upcomingGuests = upcoming.reduce((sum, item) => sum + item.guests, 0);

  const topTables = useMemo(() => {
    const counts = new Map<string, number>();
    reservations.forEach(item => counts.set(item.tableLabel, (counts.get(item.tableLabel) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [reservations]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-xl font-display font-bold">Statistika</h2>
      <p className="mt-1 text-sm text-white/45">Pregled upita za rezervacije u poslednje dve nedelje.</p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-white/35">Upiti po danima (14 dana)</div>
          <div className="mt-4 flex h-36 items-end gap-1.5">
            {days.map(day => (
              <div key={day.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${day.label} — ${day.count} upita`}>
                <span className="text-[10px] text-white/60 opacity-0 transition-opacity group-hover:opacity-100">{day.count}</span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#00a896]/60 to-[#02c8b3] transition-all"
                  style={{ height: `${Math.max(4, (day.count / maxCount) * 100)}%`, opacity: day.count === 0 ? 0.18 : 1 }}
                />
                <span className="hidden text-[9px] text-white/30 sm:block">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">Stopa odobrenja</div>
              <div className="mt-2 text-3xl font-display font-bold text-[#00d6c0]">{conversion}%</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">Gosti uskoro</div>
              <div className="mt-2 text-3xl font-display font-bold text-[#d4af37]">{upcomingGuests}</div>
              <div className="text-xs text-white/40">{upcoming.length} rezervacija</div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/35">Najtraženiji stolovi</div>
            <div className="mt-3 space-y-2">
              {topTables.length === 0 && <div className="text-sm text-white/40">Još nema upita.</div>}
              {topTables.map(([label, count]) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-14 font-semibold text-white">{label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${(count / topTables[0][1]) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-white/55">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventsManager() {
  const [events, setEvents] = useState<CapannaEvent[]>(getEvents);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail && detail !== 'capanna-events') return;
      setEvents(getEvents());
    };
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  const submitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get('date') || '');
    const title = String(form.get('title') || '').trim();
    if (!date || !title) return;
    addEvent({
      date,
      title,
      time: String(form.get('time') || '') || undefined,
      desc: String(form.get('desc') || '').trim() || undefined,
    });
    event.currentTarget.reset();
    setEvents(getEvents());
    setNotice('Događaj je objavljen — vidljiv je na stranici Događaji i na rezervacijama za taj dan.');
    window.setTimeout(() => setNotice(''), 4000);
  };

  const removeEvent = (id: string) => {
    deleteEvent(id);
    setEvents(getEvents());
  };

  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(item => item.date >= todayIso);
  const past = events.filter(item => item.date < todayIso);

  return (
    <section className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/[0.04] p-5">
      <h2 className="text-xl font-display font-bold">🎉 Događaji</h2>
      <p className="mt-1 text-sm text-white/45">
        Objavi žurku, svirku ili specijalnu večer — gosti je vide u kalendaru na stranici „Događaji", a prikazuje se i na rezervacijama za taj dan.
      </p>

      {notice && <div className="mt-4 rounded-xl bg-emerald-500/12 p-3 text-sm text-emerald-200">{notice}</div>}

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submitEvent} className="h-fit rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-lg font-bold">Novi događaj</h3>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Datum"><input name="date" required type="date" className={inputClass} /></Field>
              <Field label="Vreme (opciono)"><input name="time" type="time" className={inputClass} /></Field>
            </div>
            <Field label="Naziv događaja">
              <input name="title" required className={inputClass} placeholder="npr. DJ Summer Night" />
            </Field>
            <Field label="Opis (opciono)">
              <textarea name="desc" rows={3} className={inputClass} placeholder="npr. Letnja žurka uz koktele i DJ-a do jutra" />
            </Field>
          </div>
          <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white">
            Objavi događaj
          </button>
        </form>

        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">Predstojeći ({upcoming.length})</div>
          {upcoming.length === 0 && <div className="rounded-xl bg-white/[0.03] p-4 text-sm text-white/45">Nema objavljenih događaja.</div>}
          {upcoming.map(item => (
            <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="min-w-0">
                <div className="font-semibold text-white">{item.title}</div>
                <div className="mt-1 text-xs text-fuchsia-200/80">{item.date}{item.time ? ` · od ${item.time}` : ''}</div>
                {item.desc && <div className="mt-1 text-xs text-white/45">{item.desc}</div>}
              </div>
              <button onClick={() => removeEvent(item.id)} className="flex-shrink-0 rounded-lg bg-red-500/12 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-200">
                Obriši
              </button>
            </div>
          ))}
          {past.length > 0 && (
            <>
              <div className="pt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/25">Prošli ({past.length})</div>
              {past.slice(-4).map(item => (
                <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/10 p-3 opacity-55">
                  <div className="min-w-0 text-sm">
                    <span className="font-semibold text-white/70">{item.title}</span>
                    <span className="ml-2 text-xs text-white/40">{item.date}</span>
                  </div>
                  <button onClick={() => removeEvent(item.id)} className="flex-shrink-0 rounded-lg bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200/70">
                    Obriši
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ReservationCard({ item }: { item: ReservationRequest }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-semibold text-white">{item.tableLabel} · {item.name} · {item.guests} osoba</div>
          <div className="mt-1 text-xs text-white/45">{item.date} u {item.time} · {item.phone}{item.email ? ` · ✉️ ${item.email}` : ''}</div>
          <div className="mt-2 text-sm text-white/55">{item.note || 'Bez napomene'}</div>
          <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">
            {statusLabel[item.status]}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => updateReservationStatus(item.id, 'approved')} className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-200">Odobri</button>
          <button onClick={() => updateReservationStatus(item.id, 'pending')} className="rounded-lg bg-amber-500/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-200">Vrati</button>
          <button onClick={() => updateReservationStatus(item.id, 'declined')} className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-200">Odbij</button>
        </div>
      </div>
      {item.status === 'approved' && (
        <label className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={item.guestNotified}
            onChange={event => updateReservationNotification(item.id, event.currentTarget.checked)}
          />
          {item.guestNotified ? 'Gost je obavešten.' : 'Označi kada pošalješ potvrdu gostu.'}
        </label>
      )}
    </div>
  );
}

export default function StaffPortal() {
  const { setSeason } = useSeason();
  const [activeSeason, setActiveSeasonState] = useState(getActiveSeason);
  const [staff, setStaff] = useState<StaffAccount | null>(getCurrentStaff);
  const [reservations, setReservations] = useState<ReservationRequest[]>(getReservations);
  const [licenses, setLicenses] = useState<LicenseKey[]>(getLicenses);
  const [accounts, setAccounts] = useState<StaffAccount[]>(getAccounts);
  const [announcement, setAnnouncement] = useState(getAnnouncement);
  const [adImage, setAdImage] = useState(announcement.imageUrl);

  useEffect(() => {
    const refresh = () => {
      setReservations(getReservations());
      setLicenses(getLicenses());
      setAccounts(getAccounts());
      const nextAnnouncement = getAnnouncement();
      setAnnouncement(nextAnnouncement);
      setAdImage(nextAnnouncement.imageUrl);
      setStaff(getCurrentStaff());
      setActiveSeasonState(getActiveSeason());
    };
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  const stats = useMemo(() => ({
    pending: reservations.filter(item => item.status === 'pending').length,
    approved: reservations.filter(item => item.status === 'approved').length,
    declined: reservations.filter(item => item.status === 'declined').length,
    notified: reservations.filter(item => item.status === 'approved' && item.guestNotified).length,
    staff: accounts.length,
  }), [accounts.length, reservations]);

  if (!staff) return <StaffGate onAuth={() => setStaff(getCurrentStaff())} />;

  const submitLicense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    createLicense(String(form.get('role') || 'waiter') as StaffRole, String(form.get('note') || 'Staff ključ'), String(form.get('expiresAt') || '') || undefined);
    event.currentTarget.reset();
    setLicenses(getLicenses());
  };

  const submitAnnouncement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const imageUrl = adImage || String(form.get('imageUrl') || '');
    saveAnnouncement({
      ...announcement,
      title: String(form.get('title') || ''),
      body: String(form.get('body') || ''),
      footer: String(form.get('footer') || ''),
      imageUrl,
      active: form.get('active') === 'on',
      updatedAt: new Date().toISOString(),
    });
    setAnnouncement(getAnnouncement());
  };

  const uploadAdImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAdImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const grouped = {
    pending: reservations.filter(item => item.status === 'pending'),
    approved: reservations.filter(item => item.status === 'approved'),
    declined: reservations.filter(item => item.status === 'declined'),
  };

  return (
    <div className="min-h-screen bg-[#050807] text-white">
      <header className="border-b border-white/10 bg-black/25 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo size="sm" />
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${isCloudConfigured() ? 'bg-emerald-500/15 text-emerald-200' : 'bg-white/10 text-white/45'}`}
              title={isCloudConfigured() ? 'Podaci se sinhronizuju sa bazom' : 'Podaci su samo u ovom browseru — popuni src/config.ts za bazu'}
            >
              {isCloudConfigured() ? '● Baza povezana' : '○ Lokalni režim'}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${isEmailConfigured() ? 'bg-emerald-500/15 text-emerald-200' : 'bg-white/10 text-white/45'}`}
              title={isEmailConfigured() ? 'Gosti dobijaju email potvrde' : 'Email potvrde nisu podešene — popuni src/config.ts'}
            >
              {isEmailConfigured() ? '● Email aktivan' : '○ Email nije podešen'}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">{staff.username} · {roleLabel[staff.role]}</span>
            <button
              onClick={() => { logoutStaff(); setStaff(null); }}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70"
            >
              Odjava
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            ['Sezona', activeSeason === 'beach' ? 'Plaža' : 'Grad'],
            ['Novi upiti', String(stats.pending)],
            ['Odobreno', String(stats.approved)],
            ['Odbijeno', String(stats.declined)],
            ['Osoblje', String(stats.staff)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">{label}</div>
              <div className="mt-2 text-3xl font-display font-bold">{value}</div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-display font-bold">Aktivna sezona</h2>
              <p className="mt-1 text-sm text-white/45">
                Ovo određuje koji lokal je otvoren. Gosti na sajtu vide ovu sezonu, a za drugu dobijaju obaveštenje da je lokal zatvoren.
              </p>
            </div>
            <div className="flex rounded-xl bg-black/30 p-1">
              {(['city', 'beach'] as const).map(item => (
                <button
                  key={item}
                  onClick={() => { setActiveSeason(item); setActiveSeasonState(item); setSeason(item); }}
                  className={`rounded-lg px-5 py-2 text-sm font-bold uppercase tracking-wider ${activeSeason === item ? 'bg-[#00a896] text-white' : 'text-white/45'}`}
                >
                  {item === 'city' ? '☕ Grad' : '🌊 Plaža'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <StatsSection reservations={reservations} />

        <EventsManager />

        {staff.role === 'owner' ? (
          <MenuManager />
        ) : (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/45">
            🔒 Uređivanje menija je dostupno samo vlasničkom nalogu.
          </section>
        )}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-display font-bold">Skica stolova za plažu</h2>
            <p className="mt-1 text-sm text-white/45">Klikni sto da vidiš rezervacije za njega. Boje označavaju status.</p>
          </div>
          <BeachReservationMap staffView />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-5">
              <h2 className="text-xl font-display font-bold">Novi upiti</h2>
              <div className="mt-4 space-y-3">
                {grouped.pending.length === 0 && <div className="rounded-xl bg-white/[0.03] p-4 text-sm text-white/45">Nema novih upita.</div>}
                {grouped.pending.map(item => <ReservationCard key={item.id} item={item} />)}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5">
              <h2 className="text-xl font-display font-bold">Odobrene rezervacije</h2>
              <p className="mt-1 text-sm text-white/45">Označi kada gostu pošalješ potvrdu.</p>
              <div className="mt-4 space-y-3">
                {grouped.approved.length === 0 && <div className="rounded-xl bg-white/[0.03] p-4 text-sm text-white/45">Još nema odobrenih rezervacija.</div>}
                {grouped.approved.map(item => <ReservationCard key={item.id} item={item} />)}
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.035] p-5">
              <h2 className="text-xl font-display font-bold">Odbijeno</h2>
              <div className="mt-4 space-y-3">
                {grouped.declined.length === 0 && <div className="rounded-xl bg-white/[0.03] p-4 text-sm text-white/45">Nema odbijenih upita.</div>}
                {grouped.declined.map(item => <ReservationCard key={item.id} item={item} />)}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <form onSubmit={submitAnnouncement} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-xl font-display font-bold">Popup reklama / obaveštenje</h2>
              <p className="mt-1 text-sm text-white/45">Može tekst, slika reklame, ili oba. Slika može biti URL ili upload iz računara.</p>
              <div className="mt-4 space-y-3">
                <Field label="Naslov"><input name="title" defaultValue={announcement.title} className={inputClass} /></Field>
                <Field label="Tekst"><textarea name="body" defaultValue={announcement.body} rows={4} className={inputClass} /></Field>
                <Field label="Slika reklame - URL"><input name="imageUrl" defaultValue={announcement.imageUrl} onChange={event => setAdImage(event.currentTarget.value)} className={inputClass} placeholder="images/reklama.jpg ili https://..." /></Field>
                <Field label="Upload slike reklame"><input type="file" accept="image/*" onChange={uploadAdImage} className={inputClass} /></Field>
                {adImage && <img src={adImage} alt="Pregled reklame" className="max-h-56 w-full rounded-xl object-cover" />}
                <Field label="Donji tekst"><input name="footer" defaultValue={announcement.footer} className={inputClass} placeholder="npr. Vidimo se večeras u Capanni" /></Field>
                <label className="flex items-center gap-3 text-sm text-white/70">
                  <input name="active" type="checkbox" defaultChecked={announcement.active} />
                  Popup aktivan
                </label>
              </div>
              <button className="mt-4 w-full rounded-xl bg-[#00a896] px-4 py-3 text-sm font-bold uppercase tracking-wider">Sačuvaj popup</button>
            </form>

            <form onSubmit={submitLicense} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-xl font-display font-bold">Licencni ključevi za osoblje</h2>
              <div className="mt-4 space-y-3">
                <Field label="Uloga">
                  <select name="role" className={inputClass} defaultValue="waiter">
                    <option value="waiter">Konobar</option>
                    <option value="manager">Menadžer</option>
                    <option value="owner">Vlasnik</option>
                  </select>
                </Field>
                <Field label="Napomena"><input name="note" className={inputClass} placeholder="npr. Marko sezona 2026" /></Field>
                <Field label="Ističe"><input name="expiresAt" type="date" className={inputClass} /></Field>
              </div>
              <button className="mt-4 w-full rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#1a110b]">Generiši ključ</button>
              <div className="mt-4 max-h-72 space-y-2 overflow-auto">
                {licenses.map(item => (
                  <div key={item.key} className="rounded-lg bg-black/25 p-3 text-xs">
                    <div className="font-bold tracking-wider text-[#d4af37]">{item.key}</div>
                    <div className="mt-1 text-white/45">{roleLabel[item.role]} · {item.usedBy ? `iskorišćen: ${item.usedBy}` : 'nije iskorišćen'} · {item.note}</div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
