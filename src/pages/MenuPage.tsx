import { useState, useRef, useEffect } from 'react';
import { useSeason } from '../context/SeasonContext';
import { useLanguage } from '../context/LanguageContext';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import Footer from '../components/Footer';
import { getMenus, MenuCategory, MenuItem, onMenusChanged } from '../utils/menuStore';

const PUBLIC_MENU_URL = 'https://capannabar.rs/#/meni';

const categoryTranslations: Record<string, string> = {
  kafa: 'Coffee',
  zestina: 'Spirits',
  pivo: 'Beer',
  bezalkoholna: 'Soft Drinks',
  kokteli: 'Cocktails',
  smoothie: 'Smoothies & Lemonade',
  iced: 'Iced Coffee',
  hrana: 'Food to go',
};

const descTranslations: Record<string, string> = {
  'Dvostruki Arabica blend': 'Double Arabica blend',
  'Kremasto mleko, savršena pena': 'Creamy milk and smooth foam',
  'Australijski stil, dvostruki shot': 'Australian style, double shot',
  'Jameson whiskey, kafa, šlag': 'Jameson whiskey, coffee and whipped cream',
  'Vanila sladoled sa espressom': 'Vanilla ice cream with espresso',
  '24h hladna ekstrakcija': '24-hour cold extraction',
  'Irski whiskey 40ml': 'Irish whiskey 40ml',
  'Tennessee whiskey 40ml': 'Tennessee whiskey 40ml',
  'Premium Scottish gin 40ml': 'Premium Scottish gin 40ml',
  'French premium vodka 40ml': 'French premium vodka 40ml',
  'Aperol, prosecco, soda, narandža': 'Aperol, prosecco, soda and orange',
  'Gin, Campari, vermouth': 'Gin, Campari and vermouth',
  '0.4l / točeno': '0.4l draft',
  '0.33l boca': '0.33l bottle',
  'Nemačko pšenično': 'German wheat beer',
  'Svež limun, menta, med': 'Fresh lemon, mint and honey',
  '0.2l, prirodni': '0.2l, natural juice',
  'Mineralna voda 0.25l': 'Mineral water 0.25l',
  'Havana Club, svež limun, menta, soda': 'Havana Club, fresh lime, mint and soda',
  'Vodka, Malibu, ananas, breskva': 'Vodka, Malibu, pineapple and peach',
  'Kokos rum, svež ananas, kokos krem': 'Coconut rum, fresh pineapple and coconut cream',
  'Naš signature koktel – tekila, tequila sunrise twist': 'Our signature cocktail: tequila with a sunrise twist',
  'Mango, kokos, rum, paprika twist': 'Mango, coconut, rum and a chili twist',
  'Elderflower, prosecco, menta, limun': 'Elderflower, prosecco, mint and lemon',
  'Rum, jagoda, limun – blended': 'Rum, strawberry and lime, blended',
  'Vodka, Curaçao, limunada': 'Vodka, Curacao and lemonade',
  'Svež mango, jogurt, med': 'Fresh mango, yogurt and honey',
  'Ananas, kokos voda, banana': 'Pineapple, coconut water and banana',
  'Domaća limonada sa mentom i bobicastim voćem': 'Homemade lemonade with mint and berries',
  'Lubenica, menta, limun, soda': 'Watermelon, mint, lemon and soda',
  'Sveže jagode, limun, med': 'Fresh strawberries, lemon and honey',
  'Espresso, mleko na ledu': 'Espresso and milk over ice',
  'Cold brew, tonic voda, citrus': 'Cold brew, tonic water and citrus',
  'Japanski matcha, kokosovo mleko, led': 'Japanese matcha, coconut milk and ice',
  'Espresso blended sa ledom i mlekom': 'Espresso blended with ice and milk',
  '0.33l, serviran sa svežim limunom': '0.33l, served with fresh lemon',
  '0.33l boca, hladna': '0.33l bottle, chilled',
  '0.4l, savski hlad': '0.4l, cold by the Sava',
};

const allergenTranslations: Record<string, string> = {
  'Nema': 'None',
  'Mleko': 'Milk',
  'Mleko, gluten': 'Milk, gluten',
  'Mleko, jaja': 'Milk, eggs',
  'Gluten': 'Gluten',
  'Gluten, ječam': 'Gluten, barley',
  'Gluten, pšenica': 'Gluten, wheat',
  'Sumpor-dioksid': 'Sulphur dioxide',
  'Pitati osoblje': 'Ask staff',
};

const badgeTranslations: Record<string, string> = {
  'Popularno': 'Popular',
  'Top Izbor': 'Top Pick',
  'Top Prodaja': 'Top Seller',
  '🌟 Naš Specijalitet': 'House Special',
  'Naš Specijalitet': 'House Special',
};

function MenuItemCard({ item, isBeach }: { item: MenuItem; isBeach: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const { isEnglish, text } = useLanguage();
  const desc = isEnglish ? item.descEn || (item.desc ? descTranslations[item.desc] || item.desc : undefined) : item.desc;
  const ingredients = isEnglish ? item.ingredientsEn || item.ingredients : item.ingredients;
  const allergens = isEnglish ? item.allergensEn || (item.allergens ? allergenTranslations[item.allergens] || item.allergens : undefined) : item.allergens;
  const badge = isEnglish ? item.badgeEn || (item.badge ? badgeTranslations[item.badge] || item.badge : undefined) : item.badge;
  const price = isEnglish && item.price === 'na upit' ? 'ask staff' : item.price;

  return (
    <div
      className={`rounded-xl transition-all duration-300 overflow-hidden ${
        isBeach
          ? 'bg-[#0a2820]/60 border border-[#00a896]/10 hover:border-[#00a896]/30'
          : 'bg-[#1a110b]/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
      }`}
    >
      <div
        className="flex items-start justify-between p-4 cursor-pointer gap-3"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{item.emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-semibold text-sm ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {item.name}
              </span>
              {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider ${
                  isBeach
                    ? 'bg-[#00a896]/20 text-[#00a896]'
                    : 'bg-[#d4af37]/20 text-[#d4af37]'
                }`}>
                  {badge}
                </span>
              )}
            </div>
            {desc && (
              <p className={`text-xs mt-1 ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>{desc}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`font-bold text-sm ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {price}
          </span>
          {(ingredients || allergens) && (
            <span className={`text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''} ${isBeach ? 'text-white/30' : 'text-[#f5e6c8]/30'}`}>
              ▾
            </span>
          )}
        </div>
      </div>

      {/* Accordion expanded content */}
      {(ingredients || allergens) && (
        <div className={`overflow-hidden transition-all duration-400 ${expanded ? 'max-h-40' : 'max-h-0'}`}>
          <div className={`px-4 pb-4 pt-0 border-t text-xs space-y-2 ${isBeach ? 'border-[#00a896]/10' : 'border-[#d4af37]/10'}`}>
            {ingredients && (
              <div className="flex items-start gap-2 mt-3">
                <span className={isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}>{text('Sastojci:', 'Ingredients:')}</span>
                <span className={isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}>{ingredients}</span>
              </div>
            )}
            {allergens && (
              <div className="flex items-start gap-2">
                <span className={isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}>{text('Alergeni:', 'Allergens:')}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  allergens === 'Nema' || allergens === 'None'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {allergens}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  const { isBeach } = useSeason();
  const { isEnglish, text } = useLanguage();
  const [activeTab, setActiveTab] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [menus, setMenus] = useState(getMenus);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => onMenusChanged(() => setMenus(getMenus())), []);

  const currentMenu = isBeach ? menus.beach : menus.city;

  // Reset tab when season changes
  useEffect(() => {
    if (currentMenu.length > 0) setActiveTab(currentMenu[0].id);
  }, [isBeach]);

  // Initialize active tab
  useEffect(() => {
    if (!activeTab && currentMenu.length > 0) {
      setActiveTab(currentMenu[0].id);
    }
  }, [currentMenu, activeTab]);

  const activeCategory = currentMenu.find(c => c.id === activeTab) || currentMenu[0];

  // Slide indicator
  useEffect(() => {
    if (!tabsRef.current || !indicatorRef.current) return;
    const activeBtn = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (!activeBtn) return;
    const containerRect = tabsRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicatorRef.current.style.left = `${btnRect.left - containerRect.left}px`;
    indicatorRef.current.style.width = `${btnRect.width}px`;
  }, [activeTab, isBeach]);

  const qrMenuUrl = PUBLIC_MENU_URL;
  const categoryLabel = (cat: MenuCategory) => isEnglish ? cat.labelEn || categoryTranslations[cat.id] || cat.label : cat.label;

  return (
    <div className={`min-h-screen transition-colors duration-700 pt-20 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* Hero header */}
      <div className={`relative py-16 px-6 overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 ${
          isBeach
            ? 'bg-gradient-to-br from-[#00a896]/8 via-transparent to-[#ff4e50]/5'
            : 'bg-gradient-to-br from-[#d4af37]/8 via-transparent to-[#8B5E3C]/5'
        }`} />
        
        {/* Decorative background text */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none ${
          isBeach ? 'text-[#00a896]/4' : 'text-[#d4af37]/4'
        }`}>
          <span className="text-[20vw] font-display font-bold">MENU</span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              {isBeach ? text('🌊 Beach Mode Aktivan', '🌊 Beach Mode Active') : text('☕ City Mode Aktivan', '☕ City Mode Active')}
            </span>
            <h1 className={`mt-2 text-5xl lg:text-6xl font-display font-bold leading-none ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
              {isBeach ? text('Kokteli &', 'Cocktails &') : text('Kafa &', 'Coffee &')}
              <br />
              <span className={isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}>
                {isBeach ? text('Osveženja', 'Refreshments') : text('Napici', 'Drinks')}
              </span>
            </h1>
            <p className={`mt-4 max-w-md text-sm leading-relaxed ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>
              {isBeach
                ? text('Svaki koktel je pažljivo kreiran od svežih, tropskih sastojaka. Letnji raj u čaši.', 'Cocktails, refreshments and beach drinks for long summer days.')
                : text('Premium kafa, craft pića i fini napici za svaki momenat dana.', 'Premium coffee, drinks and take-away options for any moment of the day.')}
            </p>
          </div>

          {/* QR Code Button */}
          <div className="flex-shrink-0 relative w-full md:w-auto">
            <button
              onClick={() => setShowQR(p => !p)}
              className={`flex w-full md:w-auto items-center justify-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isBeach
                  ? 'bg-[#00a896]/10 border-[#00a896]/40 text-[#42f5df] hover:bg-[#00a896]/18'
                  : 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#f0c84d] hover:bg-[#d4af37]/18'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3z" />
              </svg>
              <span className="text-sm font-semibold tracking-wide">{text('Skeniraj meni', 'Scan menu')}</span>
            </button>

            {/* QR Popup */}
            {showQR && (
              <div className={`fixed left-1/2 top-24 z-[120] w-[calc(100vw-32px)] max-w-[320px] -translate-x-1/2 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                isBeach
                  ? 'bg-[#0a2820]/98 border-[#00a896]/25 shadow-teal-950/50'
                  : 'bg-[#1a110b]/98 border-[#d4af37]/25 shadow-amber-950/50'
              }`}>
                <div className="text-center mb-3">
                  <div className={`text-xs tracking-[0.25em] uppercase font-semibold mb-1 ${isBeach ? 'text-[#42f5df]' : 'text-[#f0c84d]'}`}>
                    {text('Digitalni meni', 'Digital menu')}
                  </div>
                  <div className={`text-sm font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                    Capanna Bar
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-inner flex justify-center">
                  <QRCode
                    value={qrMenuUrl}
                    size={188}
                    level="H"
                    marginSize={2}
                    fgColor="#071a17"
                  />
                </div>
                <div className={`mt-3 text-center text-xs leading-relaxed ${isBeach ? 'text-white/55' : 'text-[#f5e6c8]/55'}`}>
                  {text('QR vodi direktno na javni meni.', 'QR opens the public menu directly.')}
                </div>
                <a
                  href={qrMenuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 block truncate text-center text-[11px] ${isBeach ? 'text-[#42f5df]/80' : 'text-[#f0c84d]/80'}`}
                >
                  capannabar.rs/#/meni
                </a>
                <button
                  onClick={() => setShowQR(false)}
                  className={`mt-4 w-full rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isBeach
                      ? 'bg-[#00a896]/15 text-[#42f5df] hover:bg-[#00a896]/25'
                      : 'bg-[#d4af37]/15 text-[#f0c84d] hover:bg-[#d4af37]/25'
                  }`}
                >
                  {text('Zatvori', 'Close')}
                </button>
                <div className={`mt-3 text-center text-[10px] leading-relaxed ${isBeach ? 'text-white/30' : 'text-[#f5e6c8]/30'}`}>
                  {text('Ako domen bude drugačiji, menja se samo ovaj link.', 'If the domain changes, only this link needs to be updated.')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Filter tabs */}
        <div
          ref={tabsRef}
          className={`relative flex flex-wrap gap-2 p-1.5 rounded-2xl mb-10 ${
            isBeach ? 'bg-[#0a2820] border border-[#00a896]/10' : 'bg-[#1a110b] border border-[#d4af37]/10'
          }`}
        >
          {/* Sliding indicator */}
          <div
            ref={indicatorRef}
            className={`absolute top-1.5 h-[calc(100%-12px)] rounded-xl transition-all duration-400 pointer-events-none ${
              isBeach
                ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] shadow-lg shadow-teal-500/20'
                : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] shadow-lg shadow-amber-500/20'
            }`}
            style={{ left: 0, width: 0 }}
          />
          {currentMenu.map(cat => (
            <button
              key={cat.id}
              data-tab={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                activeTab === cat.id
                  ? isBeach ? 'text-white' : 'text-[#1a110b]'
                  : isBeach ? 'text-white/72 hover:text-white bg-white/[0.03]' : 'text-[#f5e6c8]/72 hover:text-[#f5e6c8] bg-white/[0.03]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{categoryLabel(cat)}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === cat.id
                  ? isBeach ? 'bg-white/20 text-white' : 'bg-[#1a110b]/20 text-[#1a110b]'
                  : isBeach ? 'bg-white/12 text-white/70' : 'bg-white/8 text-[#f5e6c8]/70'
              }`}>
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Category heading */}
        {activeCategory && (
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{activeCategory.emoji}</span>
              <div>
                <h2 className={`text-2xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                  {categoryLabel(activeCategory)}
                </h2>
                <p className={`text-sm mt-1 ${isBeach ? 'text-[#00a896]/70' : 'text-[#d4af37]/70'}`}>
                  {activeCategory.items.length} {text('stavki', 'items')}
                </p>
              </div>
            </div>
            <div className={`mt-4 h-px ${isBeach ? 'bg-gradient-to-r from-[#00a896]/30 to-transparent' : 'bg-gradient-to-r from-[#d4af37]/30 to-transparent'}`} />
          </div>
        )}

        {/* Menu items grid */}
        {activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCategory.items.map((item, i) => (
              <MenuItemCard key={i} item={item} isBeach={isBeach} />
            ))}
          </div>
        )}

        {/* Allergen notice */}
        <div className={`mt-12 p-4 rounded-xl text-xs ${isBeach ? 'bg-[#0a2820]/50 text-white/40' : 'bg-[#1a110b]/50 text-[#f5e6c8]/40'}`}>
          <strong className={isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}>{text('Napomena o alergenima:', 'Allergen note:')}</strong>{' '}
          {text('Za više informacija o alergenima i sastojcima, pitajte naše osoblje. Sve cene su u dinarima (RSD) i uključuju PDV. Cene su podložne promeni.', 'For more information about allergens and ingredients, please ask our staff. Prices are in Serbian dinars (RSD) and may change.')}
        </div>
      </div>
      <Footer />
    </div>
  );
}
