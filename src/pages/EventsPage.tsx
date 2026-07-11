import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, PartyPopper } from 'lucide-react';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';
import { CapannaEvent, getEvents, getUpcomingEvents } from '../utils/eventsStore';
import Footer from '../components/Footer';

const MONTHS_SR = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS_SR = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayIso() {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}

export default function EventsPage() {
  const { isBeach } = useSeason();
  const { isEnglish, text } = useLanguage();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [events, setEvents] = useState<CapannaEvent[]>(getEvents);

  useEffect(() => {
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail && detail !== 'capanna-events') return;
      setEvents(getEvents());
    };
    window.addEventListener('capanna-data-updated', refresh);
    return () => window.removeEventListener('capanna-data-updated', refresh);
  }, []);

  const accent = isBeach ? '#00a896' : '#d4af37';
  const accentText = isBeach ? 'text-[#42f5df]' : 'text-[#f0c84d]';

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CapannaEvent[]>();
    events.forEach(event => {
      map.set(event.date, [...(map.get(event.date) || []), event]);
    });
    return map;
  }, [events]);

  const monthCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Ponedeljak = 0
    const leadingBlanks = (firstDay.getDay() + 6) % 7;
    const cells: Array<{ day: number; iso: string } | null> = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push({ day, iso: toIso(viewYear, viewMonth, day) });
    return cells;
  }, [viewYear, viewMonth]);

  const changeMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const selectedEvents = eventsByDate.get(selectedDate) || [];
  const upcoming = useMemo(() => getUpcomingEvents().slice(0, 8), [events]); // eslint-disable-line react-hooks/exhaustive-deps
  const months = isEnglish ? MONTHS_EN : MONTHS_SR;
  const weekdays = isEnglish ? WEEKDAYS_EN : WEEKDAYS_SR;
  const today = todayIso();

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d}. ${months[m - 1].toLowerCase()} ${y}.`;
  };

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-700 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* Hero */}
      <section className={`relative overflow-hidden px-6 py-16 ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 ${isBeach ? 'bg-gradient-to-br from-[#00a896]/10 via-transparent to-[#ff4e50]/6' : 'bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#8B5E3C]/8'}`} />
        <div className="relative z-10 mx-auto max-w-7xl">
          <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${accentText}`}>
            {text('Šta se dešava u Capanni', 'What is happening at Capanna')}
          </span>
          <h1 className={`mt-3 max-w-3xl text-5xl font-display font-bold leading-none ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Događaji', 'Events')}
          </h1>
          <p className={`mt-5 max-w-2xl text-sm leading-relaxed ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>
            {text(
              'Žurke, svirke i specijalne večeri — sve na jednom mestu. Izaberi datum u kalendaru i vidi šta te čeka, pa rezerviši sto na vreme.',
              'Parties, live music and special nights — all in one place. Pick a date in the calendar, see what is on, and book your table in time.'
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Kalendar */}
          <div className={`rounded-2xl border p-5 ${isBeach ? 'border-[#00a896]/15 bg-[#0a2820]/50' : 'border-[#d4af37]/15 bg-[#1a110b]/50'}`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeMonth(-1)}
                aria-label={text('Prethodni mesec', 'Previous month')}
                className={`grid h-10 w-10 place-items-center rounded-xl border transition-colors ${isBeach ? 'border-[#00a896]/25 text-[#42f5df] hover:bg-[#00a896]/10' : 'border-[#d4af37]/25 text-[#f0c84d] hover:bg-[#d4af37]/10'}`}
              >
                <ChevronLeft size={18} />
              </button>
              <div className={`font-display text-xl font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {months[viewMonth]} {viewYear}.
              </div>
              <button
                onClick={() => changeMonth(1)}
                aria-label={text('Sledeći mesec', 'Next month')}
                className={`grid h-10 w-10 place-items-center rounded-xl border transition-colors ${isBeach ? 'border-[#00a896]/25 text-[#42f5df] hover:bg-[#00a896]/10' : 'border-[#d4af37]/25 text-[#f0c84d] hover:bg-[#d4af37]/10'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
              {weekdays.map(day => (
                <div key={day} className={`pb-2 text-[11px] font-bold uppercase tracking-wider ${isBeach ? 'text-white/35' : 'text-[#f5e6c8]/35'}`}>
                  {day}
                </div>
              ))}
              {monthCells.map((cell, index) =>
                cell === null ? (
                  <div key={`blank-${index}`} />
                ) : (
                  <button
                    key={cell.iso}
                    onClick={() => setSelectedDate(cell.iso)}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                      selectedDate === cell.iso
                        ? isBeach
                          ? 'border-[#00a896] bg-[#00a896]/25 text-white'
                          : 'border-[#d4af37] bg-[#d4af37]/25 text-[#f5e6c8]'
                        : eventsByDate.has(cell.iso)
                          ? isBeach
                            ? 'border-[#00a896]/40 bg-[#00a896]/10 text-white hover:bg-[#00a896]/20'
                            : 'border-[#d4af37]/40 bg-[#d4af37]/10 text-[#f5e6c8] hover:bg-[#d4af37]/20'
                          : `border-transparent ${isBeach ? 'text-white/55 hover:bg-white/[0.05]' : 'text-[#f5e6c8]/55 hover:bg-white/[0.05]'}`
                    } ${cell.iso === today ? 'ring-1 ring-inset ring-white/30' : ''} ${cell.iso < today && !eventsByDate.has(cell.iso) ? 'opacity-40' : ''}`}
                  >
                    {cell.day}
                    {eventsByDate.has(cell.iso) && (
                      <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full`} style={{ backgroundColor: accent }} />
                    )}
                  </button>
                )
              )}
            </div>

            <div className={`mt-4 flex items-center gap-2 text-[11px] ${isBeach ? 'text-white/35' : 'text-[#f5e6c8]/35'}`}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
              {text('Dan sa događajem', 'Day with an event')}
              <span className="ml-3 inline-block h-3 w-3 rounded ring-1 ring-white/30" />
              {text('Danas', 'Today')}
            </div>
          </div>

          {/* Detalji izabranog dana + predstojeći */}
          <div className="space-y-5">
            <div className={`rounded-2xl border p-5 ${isBeach ? 'border-[#00a896]/15 bg-[#0a2820]/50' : 'border-[#d4af37]/15 bg-[#1a110b]/50'}`}>
              <div className={`text-xs font-semibold uppercase tracking-[0.25em] ${accentText}`}>{formatDate(selectedDate)}</div>
              {selectedEvents.length === 0 ? (
                <p className={`mt-3 text-sm ${isBeach ? 'text-white/45' : 'text-[#f5e6c8]/45'}`}>
                  {text('Za ovaj dan još nema objavljenih događaja. Klikni dan sa tačkicom u kalendaru.', 'No events published for this day yet. Tap a dotted day in the calendar.')}
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {selectedEvents.map(event => (
                    <div key={event.id} className={`rounded-xl border p-4 ${isBeach ? 'border-[#00a896]/20 bg-[#00a896]/[0.07]' : 'border-[#d4af37]/20 bg-[#d4af37]/[0.07]'}`}>
                      <div className="flex items-start gap-3">
                        <PartyPopper size={20} className={accentText} />
                        <div className="min-w-0">
                          <div className={`font-display text-lg font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>{event.title}</div>
                          {event.time && (
                            <div className={`mt-1 flex items-center gap-1.5 text-xs ${accentText}`}>
                              <Clock size={12} /> {text('od', 'from')} {event.time}
                            </div>
                          )}
                          {event.desc && <p className={`mt-2 text-sm leading-relaxed ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>{event.desc}</p>}
                        </div>
                      </div>
                      <Link
                        to="/rezervacija"
                        className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 ${
                          isBeach ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white' : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b]'
                        }`}
                      >
                        {text('Rezerviši sto za taj dan', 'Book a table for that day')}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`rounded-2xl border p-5 ${isBeach ? 'border-[#00a896]/15 bg-[#0a2820]/50' : 'border-[#d4af37]/15 bg-[#1a110b]/50'}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] ${accentText}`}>
                <CalendarDays size={14} /> {text('Predstojeći događaji', 'Upcoming events')}
              </div>
              {upcoming.length === 0 ? (
                <p className={`mt-3 text-sm ${isBeach ? 'text-white/45' : 'text-[#f5e6c8]/45'}`}>
                  {text('Uskoro objavljujemo nove događaje — prati nas i na Instagramu @capannabar.', 'New events coming soon — follow us on Instagram @capannabar too.')}
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {upcoming.map(event => (
                    <button
                      key={event.id}
                      onClick={() => {
                        const [y, m] = event.date.split('-').map(Number);
                        setViewYear(y);
                        setViewMonth(m - 1);
                        setSelectedDate(event.date);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        isBeach ? 'border-white/[0.06] bg-white/[0.03] hover:bg-[#00a896]/10' : 'border-white/[0.06] bg-white/[0.03] hover:bg-[#d4af37]/10'
                      }`}
                    >
                      <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg text-center leading-none ${isBeach ? 'bg-[#00a896]/15 text-[#42f5df]' : 'bg-[#d4af37]/15 text-[#f0c84d]'}`}>
                        <div>
                          <div className="text-base font-black">{Number(event.date.slice(8, 10))}</div>
                          <div className="text-[9px] font-bold uppercase">{months[Number(event.date.slice(5, 7)) - 1].slice(0, 3)}</div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className={`truncate text-sm font-semibold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>{event.title}</div>
                        <div className={`text-xs ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>{event.time ? `${text('od', 'from')} ${event.time}` : text('ceo dan', 'all day')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Kako funkcionišu rezervacije */}
            <div className={`rounded-2xl border p-5 text-sm leading-relaxed ${isBeach ? 'border-[#00a896]/15 bg-[#0a2820]/50 text-white/65' : 'border-[#d4af37]/15 bg-[#1a110b]/50 text-[#f5e6c8]/65'}`}>
              <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.25em] ${accentText}`}>{text('Rezervacije', 'Reservations')}</div>
              {text(
                'Sto rezervišeš direktno na sajtu — izabereš sto, datum i vreme, a naše osoblje te poziva telefonom da potvrdi rezervaciju. Rezervacije primamo i porukom na Instagram profilu ',
                'You book a table directly on the website — pick a table, date and time, and our staff will call you to confirm. We also take reservations via Instagram DM at '
              )}
              <a href="https://instagram.com/capannabar" target="_blank" rel="noopener noreferrer" className={`font-semibold ${accentText}`}>
                @capannabar
              </a>
              .{' '}
              {text(
                'Petkom i subotom su žurke — rezervacije tada važe najkasnije do 21:30.',
                'Fridays and Saturdays are party nights — reservations then hold until 21:30 at the latest.'
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
