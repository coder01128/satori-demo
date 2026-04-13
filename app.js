/* =============================================================
   SATORI FAMILY RESTAURANT — app.js (menu.html only)
   Vanilla JS. No dependencies. Works with file:// and https.
   Cart state persists across sessions via sessionStorage.
   ============================================================= */

'use strict';

/* ── State ──────────────────────────────────────────────────── */
// cart: { [itemId]: { id, name, price, qty, notes } }
let cart = {};
let modalItemId = null; // currently open item in the detail modal

/* ── DOM references (populated after DOMContentLoaded) ──────── */
let elCartBadge, elCartCount, elCartTotalBadge;
let elCartOverlay, elCartDrawer, elCartItems;
let elCartSubtotal, elCartTotal;
let elCheckout, elCheckoutForm, elOrderTotalLabel;
let elConfirmation, elOrderNumber;
let elCategoryTabs, elMenuContainer;
let elItemModal, elItemModalOverlay;

/* ─────────────────────────────────────────────────────────────
   SESSION STORAGE — cart persists while browser tab is open
   ───────────────────────────────────────────────────────────── */
const CART_KEY = 'satori_cart';

function saveCart() {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (_) {}
}

function loadCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    if (raw) cart = JSON.parse(raw);
  } catch (_) { cart = {}; }
}

/* ─────────────────────────────────────────────────────────────
   FORMATTING
   ───────────────────────────────────────────────────────────── */
function formatRand(amount) {
  return 'R\u00a0' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
}

/* ─────────────────────────────────────────────────────────────
   MENU RENDERING
   ───────────────────────────────────────────────────────────── */

/* Category → emoji mapping (gradient handled in CSS) */
const CATEGORY_STYLES = {
  'starters-salads': { emoji: '🥗' },
  'pasta':           { emoji: '🍝' },
  'baked-pasta':     { emoji: '🍝' },
  'classic-pizzas':  { emoji: '🍕' },
  'gourmet-pizzas':  { emoji: '🍕' },
  'beverages':       { emoji: '🥤' },
  'family-combos':   { emoji: '🍽️' },
};

function renderMenu() {
  const categories = MENU_DATA.categories;

  // ── Category tabs
  elCategoryTabs.innerHTML = '';
  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-tab' + (i === 0 ? ' is-active' : '');
    btn.dataset.catId = cat.id;
    btn.textContent = cat.name;
    btn.addEventListener('click', () => scrollToCategory(cat.id));
    elCategoryTabs.appendChild(btn);
  });

  // ── Menu items
  elMenuContainer.innerHTML = '';
  categories.forEach(cat => {
    const section = document.createElement('section');
    section.className = 'menu-category';
    section.id = 'cat-' + cat.id;
    section.setAttribute('data-category', cat.id);

    const heading = document.createElement('h3');
    heading.className = 'menu-category-heading';
    heading.textContent = cat.name;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'menu-items-grid';

    cat.items.forEach(item => {
      grid.appendChild(buildItemCard(item, cat));
    });

    section.appendChild(grid);
    elMenuContainer.appendChild(section);
  });

  initScrollSpy();
}

function buildItemCard(item, cat) {
  const style = CATEGORY_STYLES[cat.id] || { emoji: '🍽️' };
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.dataset.itemId = item.id;

  card.innerHTML = `
    <div class="card-media card-media--${cat.id}">
      <div class="card-media-placeholder">
        <span class="card-emoji" aria-hidden="true">${style.emoji}</span>
      </div>
      <img class="card-media-img"
           src=""
           data-item-slug="${item.id}"
           alt="${escapeHtml(item.name)}"
           loading="lazy">
    </div>
    <div class="card-body">
      <h4 class="card-name">${escapeHtml(item.name)}</h4>
      <p class="card-desc">${escapeHtml(item.description)}</p>
      <div class="card-footer">
        <span class="card-price">${formatRand(item.price)}</span>
        <div class="menu-item-control" data-control="${item.id}">
          ${buildControlHtml(item.id)}
        </div>
      </div>
    </div>
  `;
  return card;
}

function buildControlHtml(itemId) {
  const qty = cart[itemId] ? cart[itemId].qty : 0;
  if (qty === 0) {
    return `<button class="btn-add" data-action="add" data-item-id="${itemId}" aria-label="Add to cart">+</button>`;
  }
  return `
    <div class="qty-stepper">
      <button class="qty-btn" data-action="decrease" data-item-id="${itemId}" aria-label="Remove one">−</button>
      <span class="qty-value">${qty}</span>
      <button class="qty-btn" data-action="increase" data-item-id="${itemId}" aria-label="Add one">+</button>
    </div>
  `;
}

function refreshItemControl(itemId) {
  const el = elMenuContainer.querySelector(`[data-control="${itemId}"]`);
  if (el) el.innerHTML = buildControlHtml(itemId);
}

/* ─────────────────────────────────────────────────────────────
   CART STATE
   ───────────────────────────────────────────────────────────── */
function findItem(itemId) {
  for (const cat of MENU_DATA.categories) {
    const item = cat.items.find(i => i.id === itemId);
    if (item) return item;
  }
  return null;
}

function findCategory(itemId) {
  for (const cat of MENU_DATA.categories) {
    if (cat.items.some(i => i.id === itemId)) return cat;
  }
  return null;
}

function addToCart(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  if (cart[itemId]) {
    cart[itemId].qty += 1;
  } else {
    cart[itemId] = { id: item.id, name: item.name, price: item.price, qty: 1, notes: '' };
  }
  saveCart();
  refreshItemControl(itemId);
  updateCartBadge(true);
}

function adjustQty(itemId, delta) {
  if (!cart[itemId]) return;
  cart[itemId].qty += delta;
  if (cart[itemId].qty <= 0) {
    delete cart[itemId];
  }
  saveCart();
  refreshItemControl(itemId);
  updateCartBadge(false);
  if (elCartDrawer.classList.contains('is-open')) {
    renderCartDrawer();
  }
}

function getCartCount() {
  return Object.values(cart).reduce((sum, line) => sum + line.qty, 0);
}

function getCartTotal() {
  return Object.values(cart).reduce((sum, line) => sum + line.price * line.qty, 0);
}

/* ─────────────────────────────────────────────────────────────
   CART BADGE
   ───────────────────────────────────────────────────────────── */
function updateCartBadge(animate) {
  const count = getCartCount();
  const total = getCartTotal();

  elCartCount.textContent = count;
  elCartTotalBadge.textContent = formatRand(total);

  if (count > 0) {
    elCartBadge.hidden = false;
    if (animate) {
      elCartBadge.classList.remove('bounce');
      void elCartBadge.offsetWidth;
      elCartBadge.classList.add('bounce');
    }
  } else {
    elCartBadge.hidden = true;
    elCartBadge.classList.remove('bounce');
  }
}

/* ─────────────────────────────────────────────────────────────
   CART DRAWER
   ───────────────────────────────────────────────────────────── */
function openCart() {
  renderCartDrawer();
  elCartOverlay.classList.add('is-visible');
  elCartDrawer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  elCartDrawer.classList.remove('is-open');
  elCartOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const lines = Object.values(cart);
  if (lines.length === 0) {
    elCartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    elCartItems.innerHTML = lines.map(line => `
      <div class="cart-line">
        <div class="cart-line-body">
          <p class="cart-line-name">${escapeHtml(line.name)}</p>
          <div class="qty-stepper" style="display:inline-flex; margin-top:0.35rem;">
            <button class="qty-btn" data-action="decrease" data-item-id="${line.id}" aria-label="Remove one">−</button>
            <span class="qty-value">${line.qty}</span>
            <button class="qty-btn" data-action="increase" data-item-id="${line.id}" aria-label="Add one">+</button>
          </div>
        </div>
        <span class="cart-line-subtotal">${formatRand(line.price * line.qty)}</span>
      </div>
    `).join('');
  }

  const total = getCartTotal();
  elCartSubtotal.textContent = formatRand(total);
  elCartTotal.textContent = formatRand(total);
}

/* ─────────────────────────────────────────────────────────────
   SCREEN NAVIGATION (within menu.html)
   ───────────────────────────────────────────────────────────── */
function showScreen(name) {
  const menuSection = document.getElementById('menu');

  elCheckout.classList.remove('screen-visible');
  elConfirmation.classList.remove('screen-visible');
  if (menuSection) menuSection.style.display = '';

  if (name === 'checkout') {
    if (menuSection) menuSection.style.display = 'none';
    elCheckout.classList.add('screen-visible');
    window.scrollTo(0, 0);
    syncCheckoutTotal();
    renderCheckoutSummary();
  } else if (name === 'confirmation') {
    if (menuSection) menuSection.style.display = 'none';
    elConfirmation.classList.add('screen-visible');
    elOrderNumber.textContent = 'Order #SAT-' + (Math.floor(1000 + Math.random() * 9000));
    buildWhatsAppOrder();
    window.scrollTo(0, 0);
  }
}

function syncCheckoutTotal() {
  elOrderTotalLabel.textContent = formatRand(getCartTotal());
}

function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-summary-items');
  const totalEl   = document.getElementById('checkout-summary-total');
  if (!summaryEl || !totalEl) return;

  const lines = Object.values(cart);
  summaryEl.innerHTML = lines.map(line => `
    <div class="checkout-order-item">
      <span>${escapeHtml(line.name)} × ${line.qty}</span>
      <span>${formatRand(line.price * line.qty)}</span>
    </div>
  `).join('');
  totalEl.textContent = formatRand(getCartTotal());
}

/* ─────────────────────────────────────────────────────────────
   WHATSAPP ORDER BUILDER
   ───────────────────────────────────────────────────────────── */
function buildWhatsAppOrder() {
  const btn = document.getElementById('btn-whatsapp-order');
  if (!btn) return;

  let cartLines = {};
  try { cartLines = JSON.parse(sessionStorage.getItem('satori_cart_snapshot') || '{}'); } catch(_) {}

  let formData = { name: '', phone: '', address: '', notes: '' };
  try { formData = JSON.parse(sessionStorage.getItem('satori_form') || '{}'); } catch(_) {}

  const lines = Object.values(cartLines);
  if (!lines.length) {
    btn.style.display = 'none';
    return;
  }

  // Build item list (include per-item special instructions)
  const itemLines = lines.map(line => {
    const lineTotal = (line.price * line.qty).toFixed(0);
    let text = `• ${line.qty}x ${line.name} — R${lineTotal}`;
    if (line.notes) text += `\n  (${line.notes})`;
    return text;
  }).join('\n');

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const isCollect = formData.fulfillment === 'collect';

  const parts = [
    "Hi Satori! I'd like to place an order:",
    '',
    itemLines,
    '',
    `Subtotal: R${subtotal.toFixed(0)}`,
    '',
    `Order type: ${isCollect ? 'Collect in store' : 'Deliver'}`,
  ];
  if (!isCollect) parts.push(`Address: ${formData.address || 'Not provided'}`);
  parts.push('');
  parts.push(`Name: ${formData.name || 'Not provided'}`);
  parts.push(`Phone: ${formData.phone || 'Not provided'}`);
  if (formData.notes) parts.push(`Order notes: ${formData.notes}`);
  parts.push('');
  parts.push('Sent from satori.co.za');

  const msg = parts.join('\n');

  btn.href = 'https://wa.me/27118887452?text=' + encodeURIComponent(msg);
  btn.style.display = 'inline-flex';
}

/* ─────────────────────────────────────────────────────────────
   SCROLLSPY
   ───────────────────────────────────────────────────────────── */
function initScrollSpy() {
  const sections = elMenuContainer.querySelectorAll('.menu-category');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveTab(entry.target.dataset.category);
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
}

function setActiveTab(catId) {
  elCategoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    const active = tab.dataset.catId === catId;
    tab.classList.toggle('is-active', active);
    if (active) {
      tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  });
}

function scrollToCategory(catId) {
  const section = document.getElementById('cat-' + catId);
  if (!section) return;
  const tabsHeight = elCategoryTabs.offsetHeight;
  const headerHeight = document.querySelector('.page-header')
    ? document.querySelector('.page-header').offsetHeight : 0;
  const top = section.getBoundingClientRect().top + window.scrollY - tabsHeight - headerHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────────────
   ITEM DETAIL MODAL
   ───────────────────────────────────────────────────────────── */
const CAT_GRADIENTS = {
  'starters-salads': 'linear-gradient(135deg, #3D5A2C 0%, #6A8F40 100%)',
  'pasta':           'linear-gradient(135deg, #8B6014 0%, #C49A30 100%)',
  'baked-pasta':     'linear-gradient(135deg, #7A5010 0%, #B08820 100%)',
  'classic-pizzas':  'linear-gradient(135deg, #C04A2B 0%, #E07850 100%)',
  'gourmet-pizzas':  'linear-gradient(135deg, #8B2D1A 0%, #C04A2B 100%)',
  'beverages':       'linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)',
  'family-combos':   'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)',
};

function openItemModal(itemId) {
  const item = findItem(itemId);
  const cat  = findCategory(itemId);
  if (!item || !cat) return;

  modalItemId = itemId;

  // ── Populate media
  const placeholder = document.getElementById('item-modal-placeholder');
  const img         = document.getElementById('item-modal-img');
  const emoji       = document.getElementById('item-modal-emoji');
  const style       = CATEGORY_STYLES[cat.id] || { emoji: '🍽️' };

  placeholder.style.background = CAT_GRADIENTS[cat.id] || '#F0E6D2';
  placeholder.style.display    = '';
  emoji.textContent = style.emoji;

  img.classList.remove('img-error');
  img.alt = item.name;
  img.src = '';
  img.src = 'assets/menu/' + item.id + '.jpg';
  img.onload  = () => { placeholder.style.display = 'none'; };
  img.onerror = () => { img.classList.add('img-error'); placeholder.style.display = ''; };

  // ── Populate text
  document.getElementById('item-modal-name').textContent  = item.name;
  document.getElementById('item-modal-desc').textContent  = item.description;
  document.getElementById('item-modal-price').textContent = formatRand(item.price);

  // ── Restore saved notes for this item
  document.getElementById('modal-instructions').value =
    (cart[itemId] && cart[itemId].notes) ? cart[itemId].notes : '';

  // ── Render qty control
  updateModalQty();

  // ── Open
  elItemModalOverlay.classList.add('is-visible');
  elItemModal.removeAttribute('hidden');
  // Double rAF: let browser paint initial off-screen position before transitioning
  requestAnimationFrame(() => requestAnimationFrame(() => {
    elItemModal.classList.add('is-open');
  }));
  document.body.style.overflow = 'hidden';
}

function closeItemModal() {
  // Save special instructions if item is still in cart
  if (modalItemId && cart[modalItemId]) {
    const notes = document.getElementById('modal-instructions').value.trim();
    cart[modalItemId].notes = notes;
    saveCart();
  }

  elItemModal.classList.remove('is-open');
  elItemModalOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';

  setTimeout(() => {
    elItemModal.setAttribute('hidden', '');
    modalItemId = null;
  }, 380);
}

function buildModalQtyHtml(itemId) {
  const qty = cart[itemId] ? cart[itemId].qty : 0;
  return `
    <div class="qty-stepper">
      <button class="qty-btn" data-action="decrease" data-item-id="${itemId}" aria-label="Remove one">−</button>
      <span class="qty-value">${qty}</span>
      <button class="qty-btn" data-action="increase" data-item-id="${itemId}" aria-label="Add one">+</button>
    </div>
  `;
}

function updateModalQty() {
  const el = document.getElementById('item-modal-qty');
  if (el && modalItemId) el.innerHTML = buildModalQtyHtml(modalItemId);
}

function setupModalEvents() {
  document.getElementById('item-modal-close').addEventListener('click', closeItemModal);
  elItemModalOverlay.addEventListener('click', closeItemModal);

  // Qty controls inside modal
  document.getElementById('item-modal-qty').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || !modalItemId) return;
    const action = btn.dataset.action;
    if (action === 'add')      addToCart(modalItemId);
    else if (action === 'increase') adjustQty(modalItemId, 1);
    else if (action === 'decrease') adjustQty(modalItemId, -1);
    updateModalQty();
  });

  // Done button — saves notes and closes
  document.getElementById('item-modal-done').addEventListener('click', closeItemModal);
}

/* ─────────────────────────────────────────────────────────────
   EVENT DELEGATION
   ───────────────────────────────────────────────────────────── */
function setupMenuEvents() {
  elMenuContainer.addEventListener('click', e => {
    // Handle qty/add button clicks first
    const btn = e.target.closest('[data-action]');
    if (btn) {
      const action = btn.dataset.action;
      const itemId = btn.dataset.itemId;
      if (action === 'add')      addToCart(itemId);
      if (action === 'increase') { cart[itemId] ? adjustQty(itemId, 1) : addToCart(itemId); }
      if (action === 'decrease') adjustQty(itemId, -1);
      return; // don't open modal when a button was clicked
    }
    // Click anywhere else on the card → open item detail modal
    const card = e.target.closest('.menu-card');
    if (card && card.dataset.itemId) {
      openItemModal(card.dataset.itemId);
    }
  });
}

function setupCartEvents() {
  elCartBadge.addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  elCartOverlay.addEventListener('click', closeCart);

  elCartItems.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const itemId = btn.dataset.itemId;
    if (action === 'increase') adjustQty(itemId, 1);
    if (action === 'decrease') adjustQty(itemId, -1);
    renderCartDrawer();
    updateCartBadge(false);
  });

  document.getElementById('btn-checkout').addEventListener('click', () => {
    if (getCartCount() === 0) return;
    closeCart();
    setTimeout(() => showScreen('checkout'), 200);
  });
}

function setupCheckoutEvents() {
  document.getElementById('btn-back-to-menu').addEventListener('click', () => showScreen('menu'));

  // ── Deliver / Collect toggle
  const addressGroup = document.getElementById('address-field-group');
  const addressInput = document.getElementById('field-address');
  document.querySelectorAll('input[name="fulfillment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isDeliver = document.querySelector('input[name="fulfillment"]:checked')?.value === 'deliver';
      if (addressGroup) {
        addressGroup.style.display = isDeliver ? '' : 'none';
        addressInput.required = isDeliver;
        if (!isDeliver) addressInput.value = '';
      }
    });
  });

  elCheckoutForm.addEventListener('submit', e => {
    e.preventDefault();
    const fulfillment = document.querySelector('input[name="fulfillment"]:checked')?.value || 'deliver';
    // Save form data before clearing cart so confirmation can use it
    const formData = {
      name:        document.getElementById('field-name').value.trim(),
      phone:       document.getElementById('field-phone').value.trim(),
      address:     document.getElementById('field-address').value.trim(),
      notes:       document.getElementById('field-notes').value.trim(),
      fulfillment,
    };
    try { sessionStorage.setItem('satori_form', JSON.stringify(formData)); } catch(_) {}

    // Snapshot cart for WA message before clearing
    const cartSnapshot = JSON.parse(JSON.stringify(cart));
    try { sessionStorage.setItem('satori_cart_snapshot', JSON.stringify(cartSnapshot)); } catch(_) {}

    cart = {};
    saveCart();
    updateCartBadge(false);
    showScreen('confirmation');
  });

  elCheckoutForm.addEventListener('input', syncCheckoutTotal);

  document.querySelectorAll('.payment-tile input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-tile').forEach(tile => {
        tile.classList.toggle('selected', tile.querySelector('input').checked);
      });
    });
  });
}

function setupConfirmationEvents() {
  document.getElementById('btn-new-order').addEventListener('click', () => {
    elCheckoutForm.reset();
    showScreen('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────────
   MENU IMAGE LOADER
   ───────────────────────────────────────────────────────────── */
function initMenuImages() {
  elMenuContainer.querySelectorAll('.card-media-img').forEach(img => {
    const slug = img.dataset.itemSlug;
    if (!slug) return;
    img.src = 'assets/menu/' + slug + '.jpg';
    img.onload = () => {
      // Hide the gradient placeholder once a real image loads
      const placeholder = img.previousElementSibling;
      if (placeholder) placeholder.style.display = 'none';
    };
    img.onerror = () => {
      img.classList.add('img-error');
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   PWA INSTALL BANNER
   ───────────────────────────────────────────────────────────── */
function initInstallBanner() {
  // Skip entirely if already running as a standalone PWA
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (navigator.standalone === true) return; // iOS

  const bannerAndroid = document.getElementById('install-banner');
  const bannerIOS     = document.getElementById('install-banner-ios');
  const btnInstall    = document.getElementById('install-btn');
  const btnDismiss    = document.getElementById('install-dismiss');
  const btnDismissIOS = document.getElementById('install-dismiss-ios');

  if (!bannerAndroid) return; // Not on menu.html

  let deferredPrompt = null;

  // ── Android / Chrome: beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    bannerAndroid.style.display = 'flex';
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') bannerAndroid.style.display = 'none';
      deferredPrompt = null;
    });
  }

  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      bannerAndroid.style.display = 'none';
    });
  }

  // ── iOS Safari: no beforeinstallprompt support
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isInBrowser = !navigator.standalone;

  if (isIOS && isInBrowser && bannerIOS) {
    bannerIOS.style.display = 'flex';
    if (btnDismissIOS) {
      btnDismissIOS.addEventListener('click', () => {
        bannerIOS.style.display = 'none';
      });
    }
  }

  // ── If user installs while banner is showing, hide it
  window.addEventListener('appinstalled', () => {
    bannerAndroid.style.display = 'none';
    if (bannerIOS) bannerIOS.style.display = 'none';
  });
}

/* ─────────────────────────────────────────────────────────────
   SERVICE WORKER REGISTRATION
   ───────────────────────────────────────────────────────────── */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .catch(() => {});
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   SECURITY HELPERS
   ───────────────────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
function init() {
  loadCart();

  elCartBadge       = document.getElementById('cart-badge');
  elCartCount       = document.getElementById('cart-count');
  elCartTotalBadge  = document.getElementById('cart-total-badge');
  elCartOverlay     = document.getElementById('cart-overlay');
  elCartDrawer      = document.getElementById('cart-drawer');
  elCartItems       = document.getElementById('cart-items');
  elCartSubtotal    = document.getElementById('cart-subtotal');
  elCartTotal       = document.getElementById('cart-total');
  elCheckout        = document.getElementById('checkout');
  elCheckoutForm    = document.getElementById('checkout-form');
  elOrderTotalLabel = document.getElementById('order-total-label');
  elConfirmation    = document.getElementById('confirmation');
  elOrderNumber     = document.getElementById('order-number');
  elCategoryTabs    = document.getElementById('category-tabs');
  elMenuContainer   = document.getElementById('menu-container');
  elItemModal       = document.getElementById('item-modal');
  elItemModalOverlay = document.getElementById('item-modal-overlay');

  renderMenu();
  initMenuImages();
  updateCartBadge(false); // restore badge from sessionStorage
  setupMenuEvents();
  setupCartEvents();
  setupCheckoutEvents();
  setupConfirmationEvents();
  setupModalEvents();
  initInstallBanner();
  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', init);
