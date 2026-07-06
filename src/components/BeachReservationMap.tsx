import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createReservation, getReservations, ReservationRequest } from '../utils/staffStore';
import { isEmailConfigured } from '../utils/emailService';
import { beachTables, MAP_BACKGROUND_IMAGE } from '../data/tables';

const MIN_LEAD_MINUTES = 90;

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

export default function BeachReservationMap({ staffView = false, previewOnly = false }: { staffView?: boolean; previewOnly?: boolean }) {
  const visibleTables = previewOnly ? beachTables.slice(0, 10) : beachTables;
  const [reservations, setReservations] = useState<ReservationRequest[]>(getReservations);
  const [selectedTable, setSelectedTable] = useState(visibleTables[0]);
  const [sent, setSent] = useState(false);
  const [sentWithEmail, setSentWithEmail] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const refresh = () => setReservations(getReservations());
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  const selectedStatus = useMemo(() => statusFor(selectedTable.id, reservations), [reservations, selectedTable.id]);
  const selectedReservations = reservations.filter(item => item.tableId === selectedTable.id);

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const email = String(form.get('email') || '').trim();
    const date = String(form.get('date') || '');
    const time = String(form.get('time') || '');

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

    setFormError('');
    createReservation({
      tableId: selectedTable.id,
      tableLabel: selectedTable.label,
      name,
      phone,
      email: email || undefined,
      guests: Number(form.get('guests') || selectedTable.seats),
      date,
      time,
      note: String(form.get('note') || ''),
    });
    event.currentTarget.reset();
    setSent(true);
    setSentWithEmail(Boolean(email) && isEmailConfigured());
    setReservations(getReservations());
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="relative min-h-[560px] overflow-hidden rounded-2xl border border-[#00a896]/20 bg-[#041410]">
        <img src={MAP_BACKGROUND_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-18" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,16,0.72),rgba(4,20,16,0.94)),radial-gradient(circle_at_30%_20%,rgba(0,168,150,0.24),transparent_34%)]" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-xl border border-[#00a896]/25 bg-[#00a896]/10 px-5 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#42f5df]">
          <span>Bar / Kokteli</span>
          <span>Brioni Beach</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-4 text-center text-xs uppercase tracking-[0.28em] text-white/40">
          Linija reke Save
        </div>
        <div className="absolute right-5 top-24 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/45">
          VIP zona
        </div>

        {visibleTables.map(table => {
          const status = statusFor(table.id, reservations);
          const active = selectedTable.id === table.id;
          const styles =
            status === 'approved'
              ? 'bg-red-500/90 border-red-100 text-white'
              : status === 'pending'
                ? 'bg-amber-300/90 border-amber-50 text-[#211400]'
                : 'bg-[#00a896]/90 border-[#bffdf4] text-white';
          return (
            <button
              key={table.id}
              onClick={() => { setSelectedTable(table); setSent(false); }}
              className={`absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 shadow-xl transition-all hover:scale-110 sm:h-16 sm:w-16 ${styles} ${active ? 'scale-110 ring-4 ring-white/30' : ''}`}
              style={{ left: `${table.x}%`, top: `${table.y}%` }}
              title={`${table.label} - ${table.zone}`}
            >
              <span className="text-sm font-black leading-none">{table.label}</span>
              <span className="text-[10px] leading-none opacity-80">{table.seats}</span>
            </button>
          );
        })}

        <div className="absolute bottom-24 left-4 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full bg-[#00a896]/20 px-3 py-1 text-[#42f5df]">Slobodno</span>
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-amber-200">Na čekanju</span>
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-red-200">Zauzeto</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#00a896]/15 bg-[#071a17] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#00a896]">{selectedTable.zone}</div>
            <h3 className="mt-1 text-3xl font-display font-bold text-white">{selectedTable.label}</h3>
            <p className="mt-1 text-sm text-white/45">{selectedTable.seats} osoba · {statusLabel[selectedStatus]}</p>
            {!staffView && <p className="mt-2 text-xs leading-relaxed text-white/40">Pošalji upit za sto. Osoblje potvrđuje rezervaciju iz admin panela.</p>}
          </div>
          <div className="rounded-full bg-[#00a896]/15 px-3 py-1 text-xs font-semibold text-[#42f5df]">Brioni</div>
        </div>

        {staffView ? (
          <div className="mt-6 space-y-3 text-sm text-white/60">
            {selectedReservations.length === 0 && <div className="rounded-xl bg-white/[0.03] p-4">Nema upita za ovaj sto.</div>}
            {selectedReservations.map(item => (
              <div key={item.id} className="rounded-xl bg-white/[0.04] p-4">
                <div className="font-semibold text-white">{item.name} · {item.guests} osoba</div>
                <div className="mt-1 text-xs">{item.date} u {item.time} · {item.phone}{item.email ? ` · ${item.email}` : ''}</div>
                <div className="mt-2 text-xs text-white/40">{item.note || 'Bez napomene'}</div>
                <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">{statusLabel[statusFor(item.tableId, [item])]}</div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={submitReservation} className="mt-6 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input name="name" required placeholder="Ime i prezime *" className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
              <input name="phone" required type="tel" placeholder="Telefon *" className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
            </div>
            <input name="email" type="email" placeholder="Email (opciono — za potvrdu rezervacije)" className="w-full rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input name="date" required type="date" min={todayIso()} className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none" />
              <input name="time" required type="time" className="rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none" />
            </div>
            <p className="text-[11px] leading-relaxed text-white/35">Rezervacija je moguća najmanje 1 sat i 30 minuta unapred.</p>
            <input name="guests" required type="number" min="1" max="16" defaultValue={selectedTable.seats} className="w-full rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none" />
            <textarea name="note" placeholder="Napomena" rows={3} className="w-full rounded-xl border border-[#00a896]/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
            <button className="w-full rounded-xl bg-gradient-to-r from-[#00a896] to-[#02c8b3] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white">
              Pošalji upit za rezervaciju
            </button>
            {formError && <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-300">{formError}</div>}
            {sent && (
              <div className="rounded-xl bg-emerald-500/10 p-3 text-center text-sm text-emerald-300">
                {sentWithEmail
                  ? 'Upit je prosleđen osoblju. Potvrda ti stiže na email — i još jedna kada rezervacija bude odobrena.'
                  : 'Upit je prosleđen osoblju. Osoblje potvrđuje rezervaciju u najkraćem roku.'}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
