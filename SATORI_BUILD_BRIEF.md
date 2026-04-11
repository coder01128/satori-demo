# SATORI PWA — BUILD BRIEF FOR SONNET

## Context (read first, this matters)

You are Claude Sonnet acting as senior dev for **DarkLoud Digital**, a Johannesburg SaaS/web dev shop. The CEO is DarkCloud (the user). This is a **OneShot Web** client deliverable with a hard deadline.

**Client:** Satori Family Restaurant — a beloved family Italian restaurant in Linden, Randburg. Owner is **Lloyd Newton**. Address: 61 4th Ave, Linden. Phone: 011 888 7452. They are 4.4–4.5 stars on Google with 700+ reviews and have won "Best Neighbourhood Restaurant" awards. They currently take orders via Mr D and Uber Eats and pay 25–35% commission per order.

**Why we are building this:** The CEO has a meeting with Lloyd on **Tuesday next week**. The goal is to walk in, install this PWA on Lloyd's phone live in front of him, and close the deal. This is a demo, not a production system — but it must look and feel completely real.

**The pitch angle (do not put this in the UI, but let it inform tone):** "Order direct, save the commission." Lloyd is currently losing 25–35% to delivery platforms. A direct-order PWA on his customers' home screens cuts those middlemen out.

**The CEO's livelihood depends on closing this deal.** Treat this build with appropriate seriousness. No shortcuts on polish.

---

## Hard constraints

- **Tech stack:** Vanilla HTML, CSS, JavaScript. **No build tooling. No npm. No frameworks.** Single folder, opens in any browser by double-clicking `index.html`.
- **Operating system:** Windows. All paths use backslashes. No bash-only commands in any docs you write.
- **Project folder:** `C:\ccode\projects\oneshot-web\clients\satori` (already created)
- **Deployment:** GitHub Pages under the existing `coder01128` GitHub account (same setup used for the Tyres Now! PWA at `coder01128.github.io/tyresnow`). Repo name suggestion: `satori-demo`.
- **Must be installable as a PWA** on Android and iOS — manifest.json + service worker + icons.
- **Mobile-first.** Lloyd will see this on a phone first. Desktop layout is secondary.

---

## Files already in the project folder

1. `menu-raw.txt` — pasted directly from the Satori Uber Eats page. Contains the full menu with prices in ZAR. **Your first job is to parse this into a clean `menu.json` file.** Categories likely include: Starters, Salads, Pizzas, Pastas, Mains, Desserts, Drinks. Preserve exact prices (e.g. `R 165,00` → `165.00`). Preserve item descriptions exactly — they are part of the charm.
2. `assets/satori-team.jpg` — a group photo of Lloyd's team and family at the restaurant. Bland as a hero, but authentic. Use it in an "About" / "Meet the family" section, NOT as the primary hero. For the actual hero, use a CSS gradient + a food emoji pattern, OR if you can find a usable food image already in assets, use that.

---

## What to build

A single PWA with these screens/sections, all in one `index.html` (or split into a few files if it stays clean):

### 1. Hero / landing
- Restaurant name "Satori" in a confident serif (try Playfair Display or similar via Google Fonts)
- Tagline: something like "Authentic Italian. Linden's family table since [year if you can find it, otherwise just 'for over a decade']."
- A prominent "Order Now" button that scrolls to the menu
- Address, phone, hours visible
- Warm Italian palette: deep terracotta (#C04A2B ish), cream (#FAF3E7), basil green (#3D5A2C), charcoal text. Avoid neon. Avoid generic SaaS gradients.

### 2. Menu browser
- Categories as horizontal scrollable tabs OR sticky section headers
- Each item: name, description, price, "+" button to add to cart
- Quantities update inline when added
- Cart count badge floats in a corner — shows total items + total ZAR

### 3. Cart drawer (slides up from bottom)
- List of items with qty +/- buttons
- Subtotal, "Delivery" (R0 — "We'll WhatsApp you to confirm"), Total
- Big "Checkout" button

### 4. Checkout screen
- Fields: Name, phone, address, order notes (all simple, no real validation drama)
- Payment method tiles: "Card" (selected by default), "EFT", "Cash on delivery"
- Big "Place Order — R[total]" button
- **No real payment integration.** This is a visual demo only.

### 5. Order confirmation
- Big green checkmark
- "Order received! Lloyd and the team will WhatsApp you shortly to confirm."
- Fake order number (e.g. "Order #SAT-" + random 4 digits)
- "Back to menu" button

### 6. About section (footer area)
- Use the team photo here
- 2–3 sentence story about Satori being a Linden institution
- Address, hours, phone, "Find us on" links (Facebook only — they don't have a website)

---

## PWA requirements

- `manifest.json` with name, short_name, theme color (terracotta), background color (cream), display: standalone, start_url, icons (192x192 and 512x512 minimum — generate these as simple SVG-to-PNG with "S" monogram on terracotta if no logo exists)
- `service-worker.js` that caches the shell for offline use
- `<link rel="manifest">` and service worker registration in `index.html`
- Apple touch icon meta tags for iOS install
- Test the install prompt before declaring done

---

## Build sequence (do it in this order)

1. Read `menu-raw.txt`, parse into `menu.json`. Show the user the parsed result and confirm before continuing.
2. Build the static HTML structure with all sections, no styling yet
3. Add the CSS — mobile first, then desktop
4. Wire up the JavaScript: cart state, add/remove, checkout flow, confirmation
5. Add PWA manifest, icons, service worker
6. Test locally — open in browser, click through entire flow
7. Initialise git repo, push to a new `satori-demo` repo under `coder01128`
8. Enable GitHub Pages on the repo, confirm the live URL works
9. Test the install flow on the live URL using DevTools mobile emulator
10. Hand back to the CEO with: live URL, install instructions, and a 60-second meeting script

---

## Things to AVOID

- Generic SaaS aesthetic (no purple gradients, no "Get started for free" energy)
- Stock-photo restaurant clichés
- Any text that sounds AI-generated ("Experience the finest…", "We pride ourselves on…")
- Lorem ipsum anywhere — every word must be real
- The phrase "commission" or "Mr D" or "Uber Eats" anywhere in the UI — that's the CEO's spoken pitch, not on the screen
- Build tooling, package.json, anything that requires `npm install`
- Asking the CEO clarifying questions about scope — the spec above is final. Only ask about things genuinely missing (e.g. hours of operation if not in menu-raw.txt).

---

## Done criteria

- Live URL works on mobile
- Installs to home screen with Satori icon and name
- Full order flow works end-to-end without errors
- All menu items from `menu-raw.txt` present with correct prices
- Looks like something Lloyd would be proud to show his customers
- CEO has a one-page "how to demo this in the meeting" script

---

## A note on tone for the build session

The CEO is a beginner coder. When you explain things, be clear and step-by-step. When you give terminal commands, give them as Windows commands (use `cd C:\ccode\...`, not `cd ~/...`). When something needs the CEO's input (like enabling GitHub Pages in repo settings), give exact click-by-click instructions.

Good luck. Tuesday is real. Ship it.
