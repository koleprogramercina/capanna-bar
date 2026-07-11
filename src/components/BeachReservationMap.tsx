import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createReservation, getReservations, ReservationRequest } from '../utils/staffStore';
import { isEmailConfigured } from '../utils/emailService';
import { getEventsForDate } from '../utils/eventsStore';
import { beachTables, donjiDividers, isPartyNight, PARTY_CUTOFF, TableSpot, TableZone, zoneLabels } from '../data/tables';

const MIN_LEAD_MINUTES = 90;
/** Minimalan razmak između dve rezervacije istog stola istog dana. */
const TABLE_GAP_MINUTES = 120;

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const statusLabel = {
  free: 'Slobodno',
  pending: 'Na čekanju',
  approved: 'Zauzeto',
};

function statusFor(tableId: string, reservations: ReservationRequest[]) {
  const tableReservations = reservations.filter(item => item.tableId === tableId);
  if (tableReservations.some(item => item.status === 'approved')) return 'approved';
  if (tableReservations.some(item => item.status === 'pending')) return 'pending';
  return 'free';
}

/** Vizuelni stil stola prema vrsti, statusu i selekciji. */
function tableStyles(table: TableSpot, status: 'free' | 'pending' | 'approved', active: boolean) {
  if (!table.reservable) {
    // ✕ / BX — nikad se ne rezerviše; prikazan sivo, isprekidano
    return `border-dashed ${table.kind === 'bar' ? 'border-fuchsia-300/25 bg-fuchsia-500/[0.06] text-fuchsia-200/45' : 'border-white/20 bg-white/[0.04] text-white/35'} ${active ? 'ring-2 ring-white/25' : ''}`;
  }
  if (table.kind === 'bar') {
    // B4 — žurka sto
    const base =
      status === 'approved'
        ? 'bg-red-500/85 border-red-200 text-white'
        : status === 'pending'
          ? 'bg-amber-300/90 border-amber-100 text-[#211400]'
          : 'bg-fuchsia-500/80 border-fuchsia-200 text-white';
    return `border-solid ${base} ${active ? 'ring-4 ring-fuchsia-200/40 scale-105' : ''}`;
  }
  const base =
    status === 'approved'
      ? 'bg-red-500/85 border-red-200 text-white'
      : status === 'pending'
        ? 'bg-amber-300/90 border-amber-100 text-[#211400]'
        : 'bg-[#00a896]/85 border-[#bffdf4]/80 text-white';
  return `border-solid ${base} ${active ? 'ring-4 ring-white/30 scale-105' : ''}`;
}

export default function BeachReservationMap({ staffView = false, previewOnly = false }: { staffView?: boolean; previewOnly?: boolean }) {
  void previewOnly; // mapa je sada uvek kompletna (raspored po skici vlasnika)
  const [zone, setZone] = useState<TableZone>('gornji');
  const [reservations, setReservations] = useState<ReservationRequest[]>(getReservations);
  const [selectedTable, setSelectedTable] = useState<TableSpot>(beachTables.find(t => t.zone === 'gornji' && t.reservable) || beachTables[0]);
  const [sent, setSent] = useState(false);
  const [sentWithEmail, setSentWithEmail] = useState(false);
  const [formError, setFormError] = useState('');
  const [chosenDate, setChosenDate] = useState('');
  const [eventsVersion, setEventsVersion] = useState(0);

  useEffect(() => {
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!detail || detail === 'capanna-reservations') setReservations(getReservations());
      if (!detail || detail === 'capanna-events') setEventsVersion(v => v + 1);
    };
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  // Događaj objavljen za izabrani datum (prikazuje se gostu na formi)
  const dateEvents = useMemo(
    () => (chosenDate ? getEventsForDate(chosenDate) : []),
    [chosenDate, eventsVersion]
  );

  const zoneTables = useMemo(() => beachTables.filter(t => t.zone === zone), [zone]);
  const selectedStatus = useMemo(() => statusFor(selectedTable.id, reservations), [reservations, selectedTable.id]);
  const selectedReservations = reservations.filter(item => item.tableId === selectedTable.id);

  const switchZone = (next: TableZone) => {
    if (next === zone) return;
    setZone(next);
    setSent(false);
    setFormError('');
    const firstReservable = beachTables.find(t => t.zone === next && t.reservable);
    if (firstReservable) setSelectedTable(firstReservable);
  };

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const email = String(form.get('email') || '').trim();
    const date = String(form.get('date') || '');
    const time = String(form.get('time') || '');
    const guests = Number(form.get('guests') || selectedTable.seats);

    setSent(false);
    if (name.split(/\s+/).length < 2) {
      setFormError('Unesi ime i prezime (oba su obavezna).');
      return;
    }
    if (phone.replace(/\D/g, '').length < 6) {
      setFormError('Unesi ispravan broj telefona.');
      return;
    }
    const requested = new Date(`${date}T${time}`);
    if (Number.isNaN(requested.getTime())) {
      setFormError('Izaberi datum i vreme rezervacije.');
      return;
    }
    const minTime = new Date(Date.now() + MIN_LEAD_MINUTES * 60_000);
    if (requested < minTime) {
      setFormError(
        requested < new Date()
          ? 'Ne može se rezervisati u prošlosti — izaberi budući termin.'
          : 'Rezervacija mora biti najmanje 1 sat i 30 minuta unapred.'
      );
      return;
    }
    if (guests > selectedTable.seats) {
      setFormError(`Za sto ${selectedTable.id} maksimum je ${selectedTable.seatsLabel} osoba. Za veće grupe izaberi veći sto ili nas pozovi.`);
      return;
    }
    // Barski (žurka) stolovi postoje samo petkom i subotom
    if (selectedTable.kind === 'bar' && !isPartyNight(date)) {
      setFormError('Barski stolovi se postavljaju samo za žurke — petak i subota veče. Izaberi petak ili subotu.');
      return;
    }
    // Petak i subota su žurke: rezervacija važi najkasnije do 21:30
    if (isPartyNight(date) && time > PARTY_CUTOFF) {
      setFormError(`Petkom i subotom su žurke — rezervacije važe najkasnije do ${PARTY_CUTOFF}. Izaberi raniji termin.`);
      return;
    }
    // Isti sto ne može dva puta u kratkom razmaku — minimum 2 sata između rezervacija
    const conflict = reservations.find(item => {
      if (item.tableId !== selectedTable.id || item.date !== date || item.status === 'declined') return false;
      const existing = new Date(`${item.date}T${item.time}`);
      return Math.abs(requested.getTime() - existing.getTime()) < TABLE_GAP_MINUTES * 60_000;
    });
    if (conflict) {
      setFormError(
        `Sto ${selectedTable.id} je već tražen tog dana u ${conflict.time}. Između dve rezervacije istog stola mora proći najmanje 2 sata — izaberi drugi termin ili drugi sto.`
      );
      return;
    }

    setFormError('');
    createReservation({
      tableId: selectedTable.id,
      tableLabel: `${selectedTable.id} (${zoneLabels[selectedTable.zone].sr})`,
      name,
      phone,
      email: email || undefined,
      guests,
      date,
      time,
      note: String(form.get('note') || ''),
    });
    event.currentTarget.reset();
    setChosenDate('');
    setSent(true);
    setSentWithEmail(Boolean(email) && isEmailConfigured());
    setReservations(getReservations());
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <div>
        {/* Birač dela lokala */}
        <div className="mb-4 flex rounded-2xl border border-[#00a896]/15 bg-[#071a17] p-1.5">
          {(['gornji', 'donji'] as const).map(item => {
            const count = beachTables.filter(t => t.zone === item && t.reservable).length;
            return (
              <button
                key={item}
                onClick={() => switchZone(item)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  zone === item ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-900/40' : 'text-white/45 hover:text-white/75'
                }`}
              >
                <span>{item === 'gornji' ? '⬆' : '⬇'}</span>
                <span>{zoneLabels[item].sr}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${zone === item ? 'bg-white/20' : 'bg-white/10'}`}>{count} stolova</span>
              </button>
            );
          })}
        </div>

        {/* Šematska mapa (prema skici vlasnika) */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#00a896]/20 bg-[#041410] sm:aspect-[16/12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(0,168,150,0.14),transparent_42%)]" />

          {/* Šank — gore u sredini gornjeg dela, kao na mapi */}
          {zone === 'gornji' && (
            <div className="absolute left-[31%] top-[2%] h-[12%] w-[27%]">
              <div className="flex h-full w-full items-center justify-center rounded-b-xl rounded-t-md border border-[#d4af37]/40 bg-gradient-to-b from-[#8B5E3C]/60 to-[#d4af37]/25 text-[11px] font-bold uppercase tracking-[0.3em] text-[#f0c84d]">
                🍸 Šank
              </div>
              <div className="absolute left-1/2 top-full h-[40%] w-[18%] -translate-x-1/2 rounded-b-md border border-t-0 border-[#d4af37]/40 bg-[#8B5E3C]/40" />
            </div>
          )}

          {/* Pregrade u donjem delu, kao na mapi */}
          {zone === 'donji' &&
            donjiDividers.map((wall, index) => (
              <div
                key={index}
                className="pointer-events-none absolute w-[0.6%] rounded-full bg-white/15"
                style={{ left: `${wall.x}%`, top: `${wall.y}%`, height: `${wall.h}%` }}
              />
            ))}

          {/* Stepenice — prelaz u drugi deo, klik menja zonu */}
          <button
            onClick={() => switchZone(zone === 'gornji' ? 'donji' : 'gornji')}
            className={`absolute inset-x-0 z-10 flex h-9 items-center justify-center gap-2 border-white/10 bg-white/[0.05] text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 backdrop-blur-sm transition-colors hover:bg-white/[0.1] hover:text-white/80 ${
              zone === 'gornji' ? 'bottom-0 border-t' : 'top-0 border-b'
            }`}
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 14px, transparent 14px 28px)' }}
          >
            {zone === 'gornji' ? '⬇ Stepenice · Donji deo' : '⬆ Stepenice · Gornji deo'}
          </button>

          {zoneTables.map(table => {
            const status = statusFor(table.id, reservations);
            const active = selectedTable.id === table.id;
            return (
              <button
                key={table.id}
                onClick={() => { setSelectedTable(table); setSent(false); setFormError(''); }}
                className={`absolute flex flex-col items-center justify-center rounded-lg border-2 shadow-lg transition-all hover:scale-105 ${tableStyles(table, status, active)}`}
                style={{ left: `${table.x}%`, top: `${table.y}%`, width: `${table.w}%`, height: `${table.h}%` }}
                title={
                  !table.reservable
                    ? table.kind === 'bar'
                      ? 'Barski sto (žurka) — ne rezerviše se'
                      : 'Ne rezerviše se — slobodan sto za goste'
                    : table.kind === 'bar'
                      ? `Barski sto do ${table.seatsLabel} osoba — samo petak/subota`
                      : `Sto za ${table.seatsLabel} osoba`
                }
              >
                <span className={`font-black leading-none ${table.kind === 'bar' || !table.reservable ? 'text-[11px]' : 'text-sm'}`}>
                  {table.reservable ? table.id : table.kind === 'bar' ? 'B✕' : '✕'}
                </span>
                {table.reservable && <span className="mt-0.5 text-[9px] font-bold leading-none opacity-85">{table.seatsLabel} os.</span>}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full bg-[#00a896]/20 px-3 py-1 text-[#42f5df]">Slobodno</span>
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-amber-200">Na čekanju</span>
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-red-200">Zauzeto</span>
          <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-fuchsia-200">🎉 Žurka sto (pet/sub)</span>
          <span className="rounded-full border border-dashed border-white/25 bg-white/[0.04] px-3 py-1 text-white/45">✕ Bez rezervacije</span>
        </div>

        <div className="mt-3 rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/[0.07] p-3 text-xs leading-relaxed text-fuchsia-100/85">
          🎉 <strong>Petak i subota veče — žurka:</strong> sve rezervacije važe najkasnije do <strong>{PARTY_CUTOFF}</strong>. Barski stolovi (B4) postavljaju se samo tada i primaju do 4 osobe.
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-[#00a896]/15 bg-[#071a17] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#00a896]">{zoneLabels[selectedTable.zone].sr}</div>
            <h3 className="mt-1 text-3xl font-display font-bold text-white">
              {selectedTable.reservable ? selectedTable.id : 'Sto bez rezervacije'}
            </h3>
            <p className="mt-1 text-sm text-white/45">
              {selectedTable.reservable
                ? `Do ${selectedTable.seatsLabel} osoba · ${statusLabel[selectedStatus]}`
                : 'Slobodan za goste koji dođu — ne rezerviše se'}
            </p>
            {selectedTable.kind === 'bar' && selectedTable.reservable && (
              <p className="mt-2 text-xs leading-relaxed text-fuchsia-200/80">🎉 Barski sto — rezerviše se samo za žurke (petak i subota), važi do {PARTY_CUTOFF}.</p>
            )}
            {!staffView && selectedTable.reservable && (
              <p className="mt-2 text-xs leading-relaxed text-white/40">Izaberi termin i pošalji rezervaciju — osoblje Capanne te poziva telefonom da potvrdi.</p>
            )}
          </div>
          <div className="rounded-full bg-[#00a896]/15 px-3 py-1 text-xs font-semibold text-[#42f5df]">Brioni</div>
        </div>

        {staffView ? (
          <div className="mt-6 space-y-3 text-sm text-white/60">
            {!selectedTable.reservable && <div className="rounded-xl bg-white/[0.03] p-4">Ovaj sto se ne rezerviše (✕ na skici) — služi za goste bez rezervacije.</div>}
            {selectedTable.reservable && selectedReservations.length === 0 && <div className="rounded-xl bg-white/[0.03] p-4">Nema upita za ovaj sto.</div>}
            {selectedReservations.map(item => (
              <div key={item.id} className="rounded-xl bg-white/[0.04] p-4">
                <div className="font-semibold text-white">{item.name} · {item.guests} osoba</div>
                <div className="mt-1 text-xs">{item.date} u {item.time} · {item.phone}{item.email ? ` · ${item.email}` : ''}</div>
                <div className="mt-2 text-xs text-white/40">{item.note || 'Bez napomene'}</div>
                <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">{statusLabel[statusFor(item.tableId, [item])]}</div>
              </div>
            ))}
          </div>
        ) : !selectedTable.reservable ? (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/55">
            Ovaj sto je označen sa ✕ — <strong className="text-white/80">ne prima rezervacije</strong> i uvek je slobodan za goste koji svrate.
            Izaberi neki od stolova u boji da pošalješ upit za rezervaciju.
          </div>
        ) : (
          <form onSubmit={submitReservation} className="mt-6 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input name="name" required placeholder="Ime i prezime *" className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
              <input name="phone" required type="tel" placeholder="Telefon *" className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
            </div>
            <input name="email" type="email" placeholder="Email (opciono — za potvrdu rezervacije)" className="w-full rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="date"
                required
                type="date"
                min={todayIso()}
                value={chosenDate}
                onChange={event => setChosenDate(event.currentTarget.value)}
                className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              />
              <input name="time" required type="time" className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none" />
            </div>
            {dateEvents.length > 0 && (
              <div className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/[0.09] p-3 text-sm leading-relaxed text-fuchsia-100">
                🎉 <strong>Tog dana u Capanni:</strong>{' '}
                {dateEvents.map(item => `${item.title}${item.time ? ` (od ${item.time})` : ''}`).join(' · ')}
                {isPartyNight(chosenDate) && <span className="mt-1 block text-xs text-fuchsia-200/75">Rezervacija tog dana važi najkasnije do {PARTY_CUTOFF}.</span>}
              </div>
            )}
            <p className="text-[11px] leading-relaxed text-white/35">
              Najmanje 1 sat i 30 min unapred. Petkom i subotom (žurka) rezervacije važe do {PARTY_CUTOFF}.
            </p>
            <input
              name="guests"
              required
              type="number"
              min="1"
              max={selectedTable.seats}
              defaultValue={Math.min(selectedTable.seats, 4)}
              className="w-full rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />
            <textarea name="note" placeholder="Napomena" rows={3} className="w-full rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
            <button className="w-full rounded-xl bg-gradient-to-r from-[#00a896] to-[#02c8b3] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white">
              Rezerviši sto
            </button>
            {formError && <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-300">{formError}</div>}
            {sent && (
              <div className="rounded-xl bg-emerald-500/10 p-3 text-center text-sm text-emerald-300">
                {sentWithEmail
                  ? 'Rezervacija je primljena! Potvrda ti stiže na email — i još jedna kada bude odobrena.'
                  : '📞 Rezervacija je primljena! Osoblje Capanne će te uskoro pozvati telefonom da potvrdi.'}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
