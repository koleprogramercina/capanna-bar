import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';
import BeachReservationMap from '../components/BeachReservationMap';
import Footer from '../components/Footer';

const currentMonth = new Date().getMonth();
const isCurrentlySummer = currentMonth >= 4 && currentMonth <= 8;

const hours = {
  city: [
    { day: 'Ponedeljak – Četvrtak', open: '08:00', close: '23:00' },
    { day: 'Petak', open: '08:00', close: '01:00' },
    { day: 'Subota', open: '09:00', close: '01:00' },
    { day: 'Nedeljom', open: '10:00', close: '22:00' },
  ],
  beach: [
    { day: 'Ponedeljak – Četvrtak', open: '07:30', close: '00:00' },
    { day: 'Petak', open: '07:30', close: '01:00' },
    { day: 'Subota', open: '07:30', close: '01:00' },
    { day: 'Nedeljom', open: '08:00', close: '00:00' },
  ],
};

const today = new Date().getDay(); // 0=Sun, 1=Mon...
const todayLabel = today === 0 ? 'Nedeljom' : today >= 5 ? (today === 5 ? 'Petak' : 'Subota') : 'Ponedeljak – Četvrtak';

function MapEmbed({ isBeach }: { isBeach: boolean }) {
  const { text } = useLanguage();
  const mapQuery = isBeach
    ? 'Brioni Beach Sremska Mitrovica'
    : 'Kuzminska 1 Sremska Mitrovica';
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const directionsUrl = `https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`;

  return (
    <div className={`relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden ${
      isBeach ? 'border border-[#00a896]/20' : 'border border-[#d4af37]/20'
    }`}>
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-8 ${
        isBeach ? 'bg-[#0a2820] text-white/55' : 'bg-[#1a110b] text-[#f5e6c8]/55'
      }`}>
        <div className={`text-xs tracking-[0.3em] uppercase font-semibold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
          {text('Google mapa', 'Google map')}
        </div>
        <div className={`mt-2 text-lg font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
          {isBeach ? 'Brioni Beach' : 'Kuzminska 1'}
        </div>
        <div className="mt-1 text-xs">Sremska Mitrovica</div>
      </div>
      <iframe
        title={isBeach ? 'Capanna Brioni Beach mapa' : 'Capanna Kuzminska 1 mapa'}
        src={mapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full grayscale-[0.25] contrast-110"
      />
      <div className={`absolute inset-0 pointer-events-none mix-blend-multiply ${
        isBeach ? 'bg-[#00a896]/10' : 'bg-[#d4af37]/10'
      }`} />

      {/* Overlay label */}
      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider ${
        isBeach ? 'bg-[#00a896]/90 text-white' : 'bg-[#d4af37]/90 text-[#1a110b]'
      }`}>
        {isBeach ? '🌊 Brioni Beach' : '☕ Kuzminska 1'}
      </div>

      <div className="absolute top-4 right-4">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
            isBeach ? 'bg-[#00a896]/20 text-[#00a896] border border-[#00a896]/30' : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
          }`}
        >
          {text('Otvori u Google Maps', 'Open in Google Maps')} →
        </a>
      </div>
    </div>
  );
}

function HoursTable({ isBeach }: { isBeach: boolean }) {
  const { text } = useLanguage();
  const data = isBeach ? hours.beach : hours.city;

  return (
    <div className="space-y-2">
      {data.map(({ day, open, close }) => {
        const isToday = day === todayLabel || (todayLabel === 'Petak' && day === 'Petak') || (todayLabel === 'Subota' && day === 'Subota');
        const displayDay =
          day === 'Ponedeljak – Četvrtak' ? text('Ponedeljak – Četvrtak', 'Monday – Thursday') :
          day === 'Petak' ? text('Petak', 'Friday') :
          day === 'Subota' ? text('Subota', 'Saturday') :
          text('Nedeljom', 'Sunday');
        return (
          <div
            key={day}
            className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ${
              isToday
                ? isBeach
                  ? 'bg-[#00a896]/15 border border-[#00a896]/25'
                  : 'bg-[#d4af37]/15 border border-[#d4af37]/25'
                : isBeach
                  ? 'bg-[#0a2820]/40 border border-transparent'
                  : 'bg-[#1a110b]/40 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              {isToday && (
                <span className={`w-1.5 h-1.5 rounded-full ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'} animate-pulse`} />
              )}
              <span className={`text-sm ${
                isToday
                  ? isBeach ? 'text-[#00a896] font-semibold' : 'text-[#d4af37] font-semibold'
                  : isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'
              }`}>
                {displayDay}
                {isToday && <span className="ml-2 text-xs opacity-70">({text('danas', 'today')})</span>}
              </span>
            </div>
            <span className={`text-sm font-mono font-medium ${
              isToday
                ? isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
                : isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'
            }`}>
              {open} – {close}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  const { isBeach } = useSeason();
  const { text } = useLanguage();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-700 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* Header */}
      <div className={`py-16 px-6 text-center relative overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
          <span className="text-[15vw] font-display font-bold">KONTAKT</span>
        </div>
        <div className="relative z-10">
          <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {text('Pronađi nas', 'Find us')}
          </span>
          <h1 className={`mt-3 text-5xl lg:text-6xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Kontakt', 'Contact')}
          </h1>
          <p className={`mt-4 max-w-md mx-auto text-sm leading-relaxed ${isBeach ? 'text-white/55' : 'text-[#f5e6c8]/55'}`}>
            {text('Rezerviši sto, pronađi nas na mapi, ili nas kontaktiraj direktno. Uvek smo tu za tebe!', 'Book a table, find us on the map, or contact us directly. We are here for you.')}
          </p>
        </div>
      </div>

      {/* Currently active notice */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${
          isBeach
            ? 'bg-[#00a896]/10 border border-[#00a896]/20'
            : 'bg-[#d4af37]/10 border border-[#d4af37]/20'
        }`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
          </span>
          <div>
            <span className={`text-sm font-semibold ${isBeach ? 'text-[#00a896]' : 'text-emerald-400'}`}>
              {text('Trenutno aktivna lokacija:', 'Currently active location:')}{' '}
            </span>
            <span className={`text-sm ${isBeach ? 'text-white/80' : 'text-[#f5e6c8]/80'}`}>
              {isBeach ? text('Brioni Beach, Plaža Sava – Letnja sezona', 'Brioni Beach, Sava River – Summer season') : text('Kuzminska 1, Sremska Mitrovica – Zimska sezona', 'Kuzminska 1, Sremska Mitrovica – City season')}
            </span>
          </div>
          {!isCurrentlySummer && isBeach && (
            <span className={`ml-auto text-xs px-2 py-1 rounded-lg bg-orange-500/20 text-orange-400`}>
              {text('Ručno odabrano', 'Manually selected')}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left column – Info */}
          <div className="space-y-8">
            {/* Map */}
            <div>
              <h2 className={`text-xl font-display font-bold mb-4 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {text('Lokacija', 'Location')}
              </h2>
              <MapEmbed isBeach={isBeach} />
              
              {/* Active location card */}
              <div className={`p-4 rounded-xl mt-4 flex items-center gap-4 ${
                isBeach
                  ? 'bg-[#0a2820] border border-[#00a896]/30 ring-1 ring-[#00a896]/20'
                  : 'bg-[#1a110b] border border-[#d4af37]/30 ring-1 ring-[#d4af37]/20'
              }`}>
                <div className="text-2xl">{isBeach ? '🌊' : '☕'}</div>
                <div>
                  <div className={`font-semibold text-sm ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                    {isBeach ? 'Brioni Beach' : 'City Bar'}
                  </div>
                  <div className={`text-xs mt-0.5 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                    {isBeach ? text('Plaža Sava', 'Sava Beach') : 'Kuzminska 1'}, Sremska Mitrovica
                  </div>
                </div>
                <div className={`ml-auto text-xs flex items-center gap-1.5 ${isBeach ? 'text-emerald-400' : 'text-emerald-400'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {text('Otvoreno', 'Open')}
                </div>
              </div>
            </div>

            {/* Working hours */}
            <div>
              <h2 className={`text-xl font-display font-bold mb-4 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {text('Radno Vreme', 'Opening Hours')}
              </h2>
              <HoursTable isBeach={isBeach} />
            </div>

            {/* Contact info */}
            <div>
              <h2 className={`text-xl font-display font-bold mb-4 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {text('Kontakt Informacije', 'Contact Information')}
              </h2>
              <div className="space-y-3">
                {[
                  { icon: '✉️', label: text('Rezervacije', 'Bookings'), value: 'Instagram DM', href: 'https://instagram.com/capannabar' },
                  { icon: '☎️', label: text('Take-away porudžbine', 'Take-away orders'), value: '060 3663205', href: 'tel:+381603663205' },
                  { icon: '📸', label: 'Instagram', value: '@capannabar', href: 'https://instagram.com/capannabar' },
                ].map(({ icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group hover:scale-[1.02] ${
                      isBeach
                        ? 'bg-[#0a2820]/60 border border-[#00a896]/10 hover:border-[#00a896]/30'
                        : 'bg-[#1a110b]/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className={`text-xs tracking-wider uppercase ${isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}`}>
                        {label}
                      </div>
                      <div className={`text-sm font-medium mt-0.5 group-hover:translate-x-0.5 transition-transform ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                        {value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column – Reservation CTA */}
          <div>
            <div className={`rounded-2xl p-8 ${
              isBeach
                ? 'bg-[#041410] border border-[#00a896]/15'
                : 'bg-[#0a0705] border border-[#d4af37]/15'
            }`}>
              <h2 className={`text-xl font-display font-bold mb-2 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {text('Rezerviši Mesto', 'Book a Spot')}
              </h2>
              <p className={`text-sm mb-8 leading-relaxed ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>
                {text('Najbrži način da rezervišeš sto je poruka na Instagramu. Javi broj gostiju, datum i lokaciju.', 'The fastest way to book is by Instagram message. Send the number of guests, date and preferred location.')}
              </p>

              <div className="space-y-4">
                <a
                  href="https://instagram.com/capannabar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group ${
                    isBeach
                      ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40'
                      : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                  }`}
                >
                  <span className="text-3xl">✉️</span>
                  <div className="flex-1">
                    <div className="text-xs tracking-widest uppercase font-semibold opacity-80">{text('Rezervacija', 'Booking')}</div>
                    <div className="text-lg font-display font-bold mt-0.5">{text('Pošalji Instagram DM', 'Send Instagram DM')}</div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>

                <a
                  href="tel:+381603663205"
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group ${
                    isBeach
                      ? 'bg-[#0a2820]/60 border-[#00a896]/30 hover:border-[#00a896]/60'
                      : 'bg-[#1a110b]/60 border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <span className="text-3xl">☎️</span>
                  <div className="flex-1">
                    <div className={`text-xs tracking-widest uppercase font-semibold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                      {text('Take-away', 'Take-away')}
                    </div>
                    <div className={`text-lg font-display font-bold mt-0.5 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                      060 3663205
                    </div>
                  </div>
                  <span className={`text-xl group-hover:translate-x-1 transition-transform duration-300 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>→</span>
                </a>
              </div>

              <p className={`text-center text-xs mt-8 ${isBeach ? 'text-white/25' : 'text-[#f5e6c8]/25'}`}>
                {text('Javi nam broj gostiju, datum i lokaciju (☕ City ili 🌊 Beach) – sredićemo ostalo.', 'Send us the number of guests, date and location (☕ City or 🌊 Beach) and we will handle the rest.')}
              </p>
            </div>
          </div>
        </div>

        {isBeach && (
          <section className="mt-14">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.3em] text-[#00a896]">
                {text('Rezervacije stolova', 'Table reservations')}
              </span>
              <h2 className="mt-2 text-3xl font-display font-bold text-white">
                {text('Izaberi sto na Brioni Beach skici', 'Choose a table on the Brioni Beach map')}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                {text('Klikni sto, pošalji upit i osoblje će ga odobriti ili odbiti iz staff panela.', 'Click a table, send a request and the staff will approve or decline it from the staff panel.')}
              </p>
            </div>
            <BeachReservationMap />
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
