export interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  descEn?: string;
  ingredients?: string;
  ingredientsEn?: string;
  allergens?: string;
  allergensEn?: string;
  badge?: string;
  badgeEn?: string;
  emoji?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  labelEn?: string;
  emoji: string;
  season: 'city' | 'beach' | 'both';
  items: MenuItem[];
}

export const defaultCityMenu: MenuCategory[] = [
  {
    id: 'kafa',
    label: 'Kafa',
    emoji: '☕',
    season: 'city',
    items: [
      { name: 'Espresso', price: '180 din', desc: 'Dvostruki Arabica blend', ingredients: 'Arabica 100%, fine grind', allergens: 'Nema', badge: 'Bestseller', emoji: '☕' },
      { name: 'Cappuccino', price: '230 din', desc: 'Kremasto mleko, savršena pena', ingredients: 'Espresso, steamed milk', allergens: 'Mleko', emoji: '🥛' },
      { name: 'Flat White', price: '250 din', desc: 'Australijski stil, dvostruki shot', ingredients: 'Double espresso, microfoam', allergens: 'Mleko', badge: 'Premium', emoji: '☕' },
      { name: 'Irish Coffee', price: '580 din', desc: 'Jameson whiskey, kafa, šlag', ingredients: 'Espresso, Jameson, whipped cream, brown sugar', allergens: 'Mleko, gluten', badge: 'Signature', emoji: '🥃' },
      { name: 'Affogato', price: '320 din', desc: 'Vanila sladoled sa espressom', ingredients: 'Espresso, vanilla ice cream', allergens: 'Mleko, jaja', emoji: '🍨' },
      { name: 'Cold Brew', price: '280 din', desc: '24h hladna ekstrakcija', ingredients: 'Cold brew concentrate, water', allergens: 'Nema', emoji: '🧊' },
    ],
  },
  {
    id: 'zestina',
    label: 'Žestina',
    emoji: '🥃',
    season: 'city',
    items: [
      { name: 'Jameson', price: '350 din', desc: 'Irski whiskey 40ml', allergens: 'Gluten', badge: 'Top Izbor', emoji: '🥃' },
      { name: 'Jack Daniels', price: '380 din', desc: 'Tennessee whiskey 40ml', allergens: 'Gluten', emoji: '🥃' },
      { name: 'Hendricks Gin', price: '420 din', desc: 'Premium Scottish gin 40ml', allergens: 'Nema', badge: 'Premium', emoji: '🫙' },
      { name: 'Grey Goose Vodka', price: '450 din', desc: 'French premium vodka 40ml', allergens: 'Nema', emoji: '🫙' },
      { name: 'Aperol Spritz', price: '480 din', desc: 'Aperol, prosecco, soda, narandža', allergens: 'Sumpor-dioksid', badge: 'Popularno', emoji: '🍊' },
      { name: 'Negroni', price: '550 din', desc: 'Gin, Campari, vermouth', allergens: 'Sumpor-dioksid', emoji: '🍸' },
    ],
  },
  {
    id: 'pivo',
    label: 'Pivo',
    emoji: '🍺',
    season: 'both',
    items: [
      { name: 'Jelen Točeno', price: '200 din', desc: '0.4l / točeno', allergens: 'Gluten, ječam', badge: 'Draft', emoji: '🍺' },
      { name: 'Corona Extra', price: '280 din', desc: '0.33l boca', allergens: 'Gluten', emoji: '🍺' },
      { name: 'Heineken', price: '260 din', desc: '0.33l boca', allergens: 'Gluten', emoji: '🍺' },
      { name: 'Paulaner Weizen', price: '320 din', desc: 'Nemačko pšenično', allergens: 'Gluten, pšenica', badge: 'Craft', emoji: '🍺' },
    ],
  },
  {
    id: 'bezalkoholna',
    label: 'Bezalkoholna',
    emoji: '🥤',
    season: 'both',
    items: [
      { name: 'Limonada Domaća', price: '250 din', desc: 'Svež limun, menta, med', allergens: 'Nema', badge: 'Fresh', emoji: '🍋' },
      { name: 'Coca-Cola', price: '180 din', desc: '0.25l', allergens: 'Nema', emoji: '🥤' },
      { name: 'Sok od Jabuke', price: '180 din', desc: '0.2l, prirodni', allergens: 'Nema', emoji: '🍎' },
      { name: 'San Pellegrino', price: '200 din', desc: 'Mineralna voda 0.25l', allergens: 'Nema', emoji: '💧' },
    ],
  },
  {
    id: 'hrana',
    label: 'Hrana za poneti',
    labelEn: 'Food to go',
    emoji: '🥪',
    season: 'both',
    items: [
      { name: 'Capanna Sendvič', price: 'na upit', desc: 'Poruči telefonom na 060 3663205 za poneti ili brzo posluženje', descEn: 'Order by phone at 060 3663205 for take-away or quick dine-in service', allergens: 'Pitati osoblje', allergensEn: 'Ask staff', badge: 'Take-away', emoji: '🥪' },
      { name: 'Doručak paket', price: 'na upit', desc: 'Kafa i lagani obrok za poneti, porudžbine na 060 3663205', descEn: 'Coffee and a light meal to go, orders at 060 3663205', allergens: 'Pitati osoblje', allergensEn: 'Ask staff', emoji: '☕' },
      { name: 'Sezonski zalogaji', price: 'na upit', desc: 'Dnevna ponuda zavisi od dostupnosti, pozovi 060 3663205', descEn: 'Daily offer depends on availability, call 060 3663205', allergens: 'Pitati osoblje', allergensEn: 'Ask staff', badge: 'Daily', badgeEn: 'Daily', emoji: '🍽️' },
    ],
  },
];

export const defaultBeachMenu: MenuCategory[] = [
  {
    id: 'kokteli',
    label: 'Kokteli',
    emoji: '🍹',
    season: 'beach',
    items: [
      { name: 'Mojito', price: '520 din', desc: 'Havana Club, svež limun, menta, soda', ingredients: 'Havana Club 3y, lime, mint, sugar, soda water', allergens: 'Nema', badge: 'Bestseller', emoji: '🍹' },
      { name: 'Sex on the Beach', price: '540 din', desc: 'Vodka, Malibu, ananas, breskva', ingredients: 'Vodka, Malibu, pineapple juice, peach schnapps', allergens: 'Nema', badge: 'Signature', emoji: '🏖️' },
      { name: 'Piña Colada', price: '560 din', desc: 'Kokos rum, svež ananas, kokos krem', ingredients: 'White rum, coconut cream, pineapple', allergens: 'Nema', emoji: '🍍' },
      { name: 'Capanna Sunrise', price: '580 din', desc: 'Naš signature koktel – tekila, tequila sunrise twist', ingredients: 'Tequila, orange juice, grenadine, lime', allergens: 'Nema', badge: '🌟 Naš Specijalitet', emoji: '🌅' },
      { name: 'Tropical Storm', price: '560 din', desc: 'Mango, kokos, rum, paprika twist', ingredients: 'White rum, mango, coconut water, chili', allergens: 'Nema', emoji: '🌀' },
      { name: 'Hugo Spritz', price: '500 din', desc: 'Elderflower, prosecco, menta, limun', ingredients: 'Prosecco, elderflower syrup, soda, mint', allergens: 'Sumpor-dioksid', emoji: '🌸' },
      { name: 'Frozen Strawberry Daiquiri', price: '540 din', desc: 'Rum, jagoda, limun – blended', ingredients: 'White rum, fresh strawberry, lime, sugar', allergens: 'Nema', badge: 'Frozen', emoji: '🍓' },
      { name: 'Blue Lagoon', price: '520 din', desc: 'Vodka, Curaçao, limunada', ingredients: 'Vodka, Blue Curaçao, lemonade', allergens: 'Nema', emoji: '💙' },
    ],
  },
  {
    id: 'smoothie',
    label: 'Smoothie & Lemonada',
    emoji: '🍋',
    season: 'beach',
    items: [
      { name: 'Svež Mango Smoothie', price: '380 din', desc: 'Svež mango, jogurt, med', allergens: 'Mleko', badge: 'Fresh', emoji: '🥭' },
      { name: 'Tropski Smoothie', price: '380 din', desc: 'Ananas, kokos voda, banana', allergens: 'Nema', emoji: '🍍' },
      { name: 'Lemonade Capanna', price: '280 din', desc: 'Domaća limonada sa mentom i bobicastim voćem', allergens: 'Nema', badge: 'Bestseller', emoji: '🍋' },
      { name: 'Watermelon Mint Fresh', price: '300 din', desc: 'Lubenica, menta, limun, soda', allergens: 'Nema', emoji: '🍉' },
      { name: 'Strawberry Lemonade', price: '290 din', desc: 'Sveže jagode, limun, med', allergens: 'Nema', emoji: '🍓' },
    ],
  },
  {
    id: 'iced',
    label: 'Iced Coffee',
    emoji: '🧊',
    season: 'beach',
    items: [
      { name: 'Iced Latte', price: '300 din', desc: 'Espresso, mleko na ledu', allergens: 'Mleko', badge: 'Top Prodaja', emoji: '🥛' },
      { name: 'Cold Brew Tonic', price: '340 din', desc: 'Cold brew, tonic voda, citrus', allergens: 'Nema', badge: 'Premium', emoji: '✨' },
      { name: 'Iced Matcha Latte', price: '350 din', desc: 'Japanski matcha, kokosovo mleko, led', allergens: 'Nema', emoji: '🍵' },
      { name: 'Frappuccino', price: '320 din', desc: 'Espresso blended sa ledom i mlekom', allergens: 'Mleko', emoji: '🥤' },
    ],
  },
  {
    id: 'pivo',
    label: 'Pivo',
    emoji: '🍺',
    season: 'both',
    items: [
      { name: 'Corona + Limun', price: '300 din', desc: '0.33l, serviran sa svežim limunom', allergens: 'Gluten', badge: 'Beach Classic', emoji: '🍺' },
      { name: 'Heineken', price: '270 din', desc: '0.33l boca, hladna', allergens: 'Gluten', emoji: '🍺' },
      { name: 'Točeno Draft', price: '220 din', desc: '0.4l, savski hlad', allergens: 'Gluten', emoji: '🍺' },
    ],
  },
  {
    id: 'hrana',
    label: 'Hrana za poneti',
    labelEn: 'Food to go',
    emoji: '🍽️',
    season: 'both',
    items: [
      { name: 'Beach Snack Box', price: 'na upit', desc: 'Praktično pakovanje za plažu ili šetnju pored Save, porudžbine na 060 3663205', descEn: 'Practical box for the beach or a walk by the Sava, orders at 060 3663205', allergens: 'Pitati osoblje', allergensEn: 'Ask staff', badge: 'Take-away', emoji: '🍽️' },
      { name: 'Capanna Wrap', price: 'na upit', desc: 'Lagan obrok koji možeš da pokupiš i poneseš, pozovi 060 3663205', descEn: 'A light meal you can pick up and take away, call 060 3663205', allergens: 'Pitati osoblje', allergensEn: 'Ask staff', emoji: '🌯' },
      { name: 'Sezonski zalogaji', price: 'na upit', desc: 'Dnevna ponuda hrane, idealna uz piće, porudžbine na 060 3663205', descEn: 'Daily food offer, ideal with drinks, orders at 060 3663205', allergens: 'Pitati osoblje', allergensEn: 'Ask staff', badge: 'Daily', badgeEn: 'Daily', emoji: '🍴' },
    ],
  },
];
