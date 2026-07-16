# 🚀 Uputstvo: postavljanje sajta na capannabar.rs

## Šta se upload-uje na hosting

**Kompletan sajt = sadržaj foldera `docs/`.** Sve iz njega ide u glavni folder hostinga
(na cPanel-u je to `public_html`). Host servira `index.html` kada neko otvori domen.
**Ne zipuj ništa** — prebaci fajlove i folder `images/` u istoj strukturi, takve kakvi jesu.

| Fajl / folder | Šta je | Obavezno? |
|---|---|---|
| `index.html` | Glavni sajt (sve u jednom fajlu) | ✅ |
| `images/` (ceo folder) | Fotografije, logo, PWA ikonice | ✅ |
| `ops-7429x.html` | Admin panel za osoblje (ne deliti link javno) | ✅ |
| `manifest.webmanifest`, `sw.js` | PWA — instalacija na telefon, offline meni | ✅ |
| `robots.txt`, `sitemap.xml` | SEO (već pokazuju na capannabar.rs) | ✅ |
| `.nojekyll` | Treba samo GitHub Pages-u | ⬜ svejedno |

Napomene:
- `index.html` mora biti direktno u root-u domena (ne u podfolderu).
- Nije potreban Node/PHP — čist statički sajt, radi na svakom hostingu.
- Admin panel će biti na `capannabar.rs/ops-7429x.html`.

## Posle svake izmene sajta

```bash
npm run pages
```

pa ponovo upload-uj `index.html` i `ops-7429x.html` iz `docs/` (i `images/` ako su
menjane slike).

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
