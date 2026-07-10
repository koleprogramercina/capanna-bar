# 🚀 Uputstvo: postavljanje sajta na domen

## Šta se upload-uje

Kompletan sajt spreman za hosting je **sadržaj foldera `docs/`** (isti taj folder služi i GitHub Pages).
Pripremljen je i gotov paket **`capanna-sajt-za-domen.zip`** u root-u projekta — raspakuj ga
direktno u `public_html` (cPanel) ili root domena.

Fajlovi u paketu:

| Fajl / folder | Šta je |
|---|---|
| `index.html` | Glavni sajt (sve u jednom fajlu) |
| `ops-7429x.html` | Admin panel za osoblje (ne deliti link javno) |
| `images/` | Sve fotografije, logo, ikonice |
| `manifest.webmanifest`, `sw.js` | PWA — instalacija na telefon i offline meni |
| `robots.txt`, `sitemap.xml` | SEO |
| `.nojekyll` | Potreban samo za GitHub Pages (na hostingu ne smeta) |

Nije potreban nikakav server/Node na hostingu — čist statički sajt, radi na svakom
shared hostingu (cPanel, Plesk, Netlify, Vercel, Cloudflare Pages...).

## Kada stigne domen — promeni na 4 mesta pa rebuild

Pretpostavimo da je domen `https://capannabar.rs`:

1. **`src/config.ts`** → `PUBLIC_SITE_URL = 'https://capannabar.rs'` (QR meni, email linkovi)
2. **`public/robots.txt`** → zameni github.io adresu u `Sitemap:` liniji
3. **`public/sitemap.xml`** → zameni github.io adrese u svim `<loc>` tagovima
4. **`dev-index.html`** → zameni github.io adrese u `og:image`, `og:url` i JSON-LD bloku

Zatim:

```bash
npm run pages
```

i upload-uj novi sadržaj `docs/` foldera na hosting. Gotovo.

## Posle domena — sledeći koraci (dogovoreno)

1. **Supabase baza** — da meni, rezervacije i sezona rade za sve posetioce
   (uputstvo korak po korak je u `src/config.ts`; publishable ključ je već unet,
   fali samo Project URL + SQL tabela)
2. **EmailJS** — email potvrde rezervacija (takođe u `src/config.ts`)
3. Skloniti početni vlasnički ključ iz koda posle registracije vlasnika

## Podsetnik za izmene sajta

- Izvorni kod: `src/` · dev entry: `dev-index.html` (NE root `index.html` — to je build)
- Pokretanje lokalno: `npm run dev` pa otvori `/dev-index.html`
- Objava: `npm run pages` → commit → push (GitHub Pages se sam osveži)
