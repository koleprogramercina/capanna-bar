import BeachReservationMap from '../components/BeachReservationMap';
import Footer from '../components/Footer';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';

export default function ReservationPage() {
  const { isBeach, activeSeason } = useSeason();
  const { text } = useLanguage();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-700 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      <section className={`relative overflow-hidden px-6 py-16 ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 ${isBeach ? 'bg-gradient-to-br from-[#00a896]/10 via-transparent to-[#ff4e50]/8' : 'bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#8B5E3C]/8'}`} />
        <div className="relative z-10 mx-auto max-w-7xl">
          <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {text('Upit za sto', 'Table request')}
          </span>
          <h1 className={`mt-3 max-w-3xl text-5xl font-display font-bold leading-none ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            {text('Rezervacija', 'Reservation')}
          </h1>
          <p className={`mt-5 max-w-2xl text-sm leading-relaxed ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>
            {text(
              'Izaberi sto, datum, vreme i broj osoba — rezervacija odmah stiže našem osoblju, a mi te pozivamo telefonom da potvrdimo. Rezervacije primamo i porukom na Instagram profilu @capannabar.',
              'Pick a table, date, time and number of guests — your reservation goes straight to our staff and we will call you to confirm. We also take reservations via Instagram DM at @capannabar.'
            )}
          </p>
          <a
            href="https://instagram.com/capannabar"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-7 inline-flex rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105 ${
              isBeach
                ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white'
                : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b]'
            }`}
          >
            {text('Rezervacije preko Instagrama', 'Book via Instagram')}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {activeSeason === 'city' && (
          <div className="mb-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
            ☕ {text(
              'Trenutno je cafe sezona — beach bar na Brioni plaži je zatvoren. Rezervacije stolova na plaži važe za letnju sezonu.',
              'It is currently cafe season — the beach bar at Brioni Beach is closed. Beach table reservations apply to the summer season.'
            )}
          </div>
        )}
        <BeachReservationMap previewOnly />
      </section>
      <Footer />
    </div>
  );
}
