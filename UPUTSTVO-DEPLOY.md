# 🚀 Uputstvo: postavljanje sajta na capannabar.rs

## Šta se upload-uje na hosting

**Sve iz foldera `ZA-HOSTING/`** — to je jedini folder koji te zanima. U njemu je
samo ono što ide na server, ništa više:

```
ZA-HOSTING/
├── index.html            ← glavni sajt (host ga čita kad neko otvori domen)
├── ops-7429x.html        ← admin panel (biće na capannabar.rs/ops-7429x.html)
├── images/               ← sve fotografije i ikonice
├── manifest.webmanifest  ← PWA (instalacija na telefon)
├── sw.js                 ← PWA (offline meni)
├── robots.txt            ← SEO
└── sitemap.xml           ← SEO
```

Kako: otvori `ZA-HOSTING`, selektuj **sav sadržaj** (ne sam folder!) i prebaci ga u
glavni folder hostinga — na cPanel-u je to `public_html`. `index.html` mora završiti
direktno u `public_html`, ne u podfolderu.

Napomene:
- **Ne zipuj ništa** — fajlovi i `images/` idu takvi kakvi jesu, u istoj strukturi.
- Nije potreban Node/PHP — čist statički sajt, radi na svakom hostingu.

## Posle svake izmene sajta

```bash
npm run pages
```

— to automatski osveži `ZA-HOSTING/` folder. Zatim ponovo prebaci `index.html` i
`ops-7429x.html` na hosting (i `images/` samo ako su menjane slike).

## Konfiguracija — POPUNJENO ✅

- **Supabase** URL + ključ uneti u `src/config.ts` — meni, rezervacije, sezona i
  događaji se sinhronizuju kroz bazu za sve posetioce (provereno u oba smera).
- **PUBLIC_SITE_URL** = https://capannabar.rs (QR meni).
- **EmailJS je izbačen iz projekta** — osoblje potvrđuje rezervacije telefonom.

## Preostalo pred zvanični start

1. Skloniti početni vlasnički ključ (`CAPANNA-OWNER-2026`) iz koda čim se vlasnik
   registruje na pravom domenu.

## Podsetnik za izmene koda

- Izvorni kod: `src/` · dev entry: `dev-index.html` (NE root `index.html` — to je build)
- Pokretanje lokalno: `npm run dev` pa otvori `/dev-index.html`
- GitHub Pages (probna verzija) se i dalje sam osvežava na push
