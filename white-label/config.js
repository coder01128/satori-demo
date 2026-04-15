/* ================================================================
   RESTAURANT CONFIG
   ----------------------------------------------------------------
   This is the only file you need to edit for basic setup.
   Replace every placeholder value with your restaurant's details.
   ================================================================ */

const CONFIG = {

  /* ── Identity ─────────────────────────────────────────────── */
  name:        'Your Restaurant',       // Full name shown everywhere
  shortName:   'YourRest',             // PWA home-screen label (≤12 chars)
  tagline:     'Great food. Great people.',
  location:    'Suburb, City',         // Shown in hero eyebrow
  orderPrefix: 'ORD',                  // Order number prefix → ORD-1042

  /* ── Contact ──────────────────────────────────────────────── */
  // WhatsApp number in international format — no +, no spaces
  // e.g. South Africa 082 123 4567 → '27821234567'
  whatsapp:  '27000000000',

  // Full Instagram profile URL, or '' to hide the button
  instagram: 'https://www.instagram.com/yourhandle',

  /* ── Address & hours ──────────────────────────────────────── */
  addressLine1: '123 Main Street, Suburb',
  addressLine2: 'City, Province',
  hours:        'Mon – Sun  11:00 – 21:30',

  /* ── Hero section ─────────────────────────────────────────── */
  heroImage: 'assets/Hero.jpg',        // Replace with your hero photo
  heroAlt:   'Food at Your Restaurant',

  /* ── About / "Meet the team" section ─────────────────────── */
  aboutHeading:   'Our Story',
  aboutPhoto:     'assets/team.png',   // Replace with your team photo
  aboutPhotoAlt:  'The team',
  // Each string becomes one paragraph. Add or remove as needed.
  aboutBody: [
    'Tell your restaurant\'s story here — how it started, what makes it special.',
    'Talk about your team, your philosophy, or your signature dishes.',
    'A third paragraph is optional — delete this entry if you don\'t need it.',
  ],

  /* ── Menu CTA section ─────────────────────────────────────── */
  ctaEyebrow:  '65 items · Starters, Mains, Pizza & more', // update item count
  ctaHeading:  'Ready to order?',
  ctaSub:      'Browse the full menu and order directly — no middlemen, no fuss.',

  /* ── WhatsApp message copy ────────────────────────────────── */
  // Opening line of the WhatsApp order message
  waGreeting: "Hi! I'd like to place an order:",
  // Footer line at the end of the message (or '' to omit)
  waFooter:   '',

  /* ── Currency ─────────────────────────────────────────────── */
  // Symbol prepended to all prices (with a non-breaking space)
  currencySymbol: 'R',

  /* ── Brand colours ────────────────────────────────────────── */
  // These map to CSS custom properties in style.css.
  // Change primary to your brand colour; the rest can stay as-is.
  colors: {
    primary:     '#C04A2B',   // --terracotta      (buttons, accents)
    primaryDark: '#8B2D1A',   // --terracotta-dark  (hover states)
    primaryMid:  '#A33A1E',   // --terracotta-mid
    cream:       '#FAF3E7',   // --cream            (page background)
    creamDark:   '#F0E6D2',   // --cream-dark       (cards, sections)
    creamBorder: '#E2D6C4',   // --cream-border     (dividers)
    charcoal:    '#1E1E1E',   // --charcoal         (headings)
    textBody:    '#2C2C2C',   // --text-body
    textMuted:   '#6B6B6B',   // --text-muted
  },

  /* ── Internal storage key ─────────────────────────────────── */
  // Change only if running two restaurants on the same domain.
  storageKey: 'restaurant_cart',
};
