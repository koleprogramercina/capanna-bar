# Capanna Bar 🏖️☕

Sajt za Capanna Bar — Sremska Mitrovica. Zimi premium coffee lounge na Kuzminskoj 1, leti beach bar na Brioni plaži.

**Live:** https://koleprogramercina.github.io/capanna-bar/

## Šta sajt ima

- 3D hero (Three.js): šoljica espressa ↔ koktel, menja se sa sezonom
- Dve sezone (cafe / beach) sa različitim menijima, bojama i sadržajem
- Editabilan cenovnik — vlasnik menja proizvode, cene i kategorije iz staff panela
- Rezervacije stolova sa mapom plaže i validacijom (bez prošlih termina, min. 1h30 unapred)
- Staff panel: rezervacije, statistika, aktivna sezona, popup obaveštenja, licencni ključevi za osoblje
- Dvojezično (SR/EN), PWA (radi offline), SEO schema

## Pokretanje

```bash
npm install
npm run dev        # dev server → otvori /dev-index.html
npm run pages      # production build + priprema docs/ za GitHub Pages
```

> **Napomena o strukturi:** `index.html` u root-u i sadržaj `docs/` foldera su **build artefakti** (single-file bundle). Pravi izvorni entry je `dev-index.html`, a staff panel je `ops-7429x.html`. GitHub Pages se služi iz `main:/docs`.

## Deploy

```bash
npm run pages
git add -A && git commit -m "..." && git push
```

Pages se automatski osveži za ~1 minut.

## Konfiguracija (baza i email)

Sva podešavanja su u [`src/config.ts`](src/config.ts) — uputstvo korak po korak je u komentarima tog fajla:

- **Supabase** — kada se popune `SUPABASE_URL` i ključ, meni/rezervacije/sezona se dele između svih posetilaca (umesto localStorage režima)
- **EmailJS** — email potvrde rezervacija gostima
- **PUBLIC_SITE_URL** — promeniti kada stigne pravi domen
