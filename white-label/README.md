# Restaurant PWA — White-Label Template

A zero-dependency, mobile-first Progressive Web App for restaurant ordering.
Customers browse the menu, build a cart, and send their order directly to you
on WhatsApp — no commission, no third-party platform.

---

## Quick start

### 1. Edit `config.js`

This is the **only file you must edit** for a basic deployment.

```js
const CONFIG = {
  name:        'Bella Cucina',
  shortName:   'Bella',
  tagline:     'Authentic Italian in the neighbourhood.',
  location:    'Linden, Randburg',
  orderPrefix: 'BC',           // order numbers become BC-1042
  whatsapp:    '27821234567',  // international format, no +
  instagram:   'https://www.instagram.com/bellacucina',
  addressLine1: '12 Main Road, Suburb',
  addressLine2: 'City, Province',
  hours:        'Mon – Sun  11:00 – 21:30',
  ...
};
```

See `config.js` for all available options with inline comments.

### 2. Edit `menu-data.js`

Replace the example menu with your real menu items. Each item needs:

| Field         | Type   | Notes                                    |
|---------------|--------|------------------------------------------|
| `id`          | string | Unique slug — also used as image filename|
| `name`        | string | Displayed on card and modal              |
| `price`       | number | No currency symbol                       |
| `description` | string | Short description (1–2 sentences)        |

```js
{ "id": "pasta-carbonara", "name": "Carbonara", "price": 165.00,
  "description": "Crispy pancetta, egg yolk, parmesan, black pepper." }
```

### 3. Add your images

| Path                         | Purpose                          |
|------------------------------|----------------------------------|
| `assets/Hero.jpg`            | Hero photo on the landing page   |
| `assets/team.png`            | Team/about photo                 |
| `assets/icons/icon-192.png`  | PWA icon (192 × 192 px)         |
| `assets/icons/icon-512.png`  | PWA icon (512 × 512 px)         |
| `assets/icons/icon.svg`      | SVG icon (any size)              |
| `assets/menu/<item-id>.jpg`  | Per-item product photo (optional)|

**Product photos** (`assets/menu/`) are optional. If a photo is missing,
the card shows a coloured gradient placeholder with a category emoji instead.
Best results with square images (e.g. 500 × 500 px) on a white or
transparent background — the app uses `background-size: contain` so the
full image is visible without cropping.

### 4. Update `manifest.json`

Change `name`, `short_name`, `theme_color`, and `background_color` to match
your brand. `theme_color` should match `CONFIG.colors.primary`.

### 5. Deploy

Drop all files onto any static host (GitHub Pages, Netlify, Vercel, Hostinger, etc.).
No server-side code required.

After each deployment, **bump the cache name** in `service-worker.js`:
```js
const CACHE_NAME = 'restaurant-pwa-v2'; // increment on every deploy
```

---

## File structure

```
white-label/
├── config.js          ← YOUR SETTINGS — edit this first
├── menu-data.js       ← YOUR MENU — replace with real items
├── index.html         ← Landing page (reads from config.js)
├── menu.html          ← Menu / cart / checkout / confirmation
├── app.js             ← All JS logic (reads from config.js)
├── style.css          ← All CSS (theme via :root variables)
├── service-worker.js  ← Offline / cache strategy
├── manifest.json      ← PWA manifest
└── assets/
    ├── Hero.jpg
    ├── team.png
    ├── icons/
    │   ├── icon.svg
    │   ├── icon-192.png
    │   └── icon-512.png
    └── menu/
        └── <item-id>.jpg   ← one file per menu item (optional)
```

---

## Theming

All colours are CSS custom properties set in `style.css :root {}`.
Override them via `CONFIG.colors` in `config.js` — values are applied
to `document.documentElement.style` before the first paint.

| CONFIG key      | CSS variable        | Used for                   |
|-----------------|---------------------|----------------------------|
| `primary`       | `--terracotta`      | Buttons, active states     |
| `primaryDark`   | `--terracotta-dark` | Hover / pressed states     |
| `cream`         | `--cream`           | Page background            |
| `creamDark`     | `--cream-dark`      | Card / section backgrounds |
| `creamBorder`   | `--cream-border`    | Dividers and borders       |
| `charcoal`      | `--charcoal`        | Headings                   |
| `textBody`      | `--text-body`       | Body text                  |
| `textMuted`     | `--text-muted`      | Secondary text             |

To add new category gradient colours, extend the `CAT_GRADIENTS` object
at the top of `app.js`.

---

## Features

- **PWA** — installable on iOS and Android home screens
- **Offline** — app shell cached for offline browsing
- **Cart** — persists across page reloads (sessionStorage)
- **Item detail modal** — photo, description, quantity, special instructions
- **Deliver / Collect toggle** — shows/hides address field dynamically
- **WhatsApp checkout** — order sent as a formatted WhatsApp message
- **Per-item notes** — special instructions saved per cart line
- **Category tabs** — sticky scrollspy navigation
- **Install banners** — Android (beforeinstallprompt) and iOS (manual)

---

## Updating after deployment

1. Edit the files you want to change
2. Bump `CACHE_NAME` in `service-worker.js` (e.g. `v2` → `v3`)
3. Deploy
4. Users will get the new version on their next visit once the old SW expires

If users report seeing stale content, they can unregister the service worker
from their browser DevTools → Application → Service Workers → Unregister.
