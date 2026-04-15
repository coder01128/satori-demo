/* =============================================================
   RESTAURANT PWA — app.js (menu.html only)
   Vanilla JS. No dependencies. Works with file:// and https.
   Cart state persists across sessions via sessionStorage.
   All restaurant-specific values come from config.js (CONFIG).
   ============================================================= */

'use strict';

/* ── Config helpers ─────────────────────────────────────────── */
const CFG = (typeof CONFIG !== 'undefined') ? CONFIG : {};

/* ── Menu data — use admin-imported version if available ─────── */
const ACTIVE_MENU = (function () {
  try {
    const s = localStorage.getItem('wl_imported_menu');
    if (s) return JSON.parse(s);
  } catch (_) {}
  return (typeof MENU_DATA !== 'undefined') ? MENU_DATA : { categories: [] };
})();
const CART_KEY    = CFG.storageKey || 'restaurant_cart';
const ORDER_PRE   = CFG.orderPrefix || 'ORD';
const WA_NUMBER   = CFG.whatsapp   || '';
const WA_GREETING = CFG.waGreeting || "Hi! I'd like to place an order:";
const WA_FOOTER   = CFG.waFooter   || '';
const CURRENCY    = CFG.currencySymbol || 'R';

/* ── State ──────────────────────────────────────────────────── */
let cart = {};
let modalItemId = null;

/* ── DOM references (populated after DOMContentLoaded) ──────── */
let elCartBadge, elCartCount, elCartTotalBadge;
let elCartOverlay, elCartDrawer, elCartItems;
let elCartSubtotal, elCartTotal;
let elCheckout, elCheckoutForm, elOrderTotalLabel;
let elConfirmation, elOrderNumber;
let elCategoryTabs, elMenuContainer;
let elItemModal, elItemModalOverlay;

/* ─────────────────────────────────────────────────────────────
   SESSION STORAGE
   ───────────────────────────────────────────────────────────── */
function saveCart() {
  try { sessionStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {}
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
function formatPrice(amount) {
  return CURRENCY + '\u00a0' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
}

/* ─────────────────────────────────────────────────────────────
   MENU RENDERING
   ───────────────────────────────────────────────────────────── */

/* Category → emoji mapping. Extend to match your category IDs in menu-data.js */
const CATEGORY_STYLES = {
  'starters':      { emoji: '🥗' },
  'mains':         { emoji: '🍽️' },
  'pasta':         { emoji: '🍝' },
  'baked-pasta':   { emoji: '🍝' },
  'pizza':         { emoji: '🍕' },
  'gourmet-pizza': { emoji: '🍕' },
  'burgers':       { emoji: '🍔' },
  'desserts':      { emoji: '🍰' },
  'beverages':     { emoji: '🥤' },
  'kids':          { emoji: '🧒' },
  'combos':        { emoji: '🍱' },
};

/* Category → modal placeholder gradient. Extend to match your category IDs. */
const CAT_GRADIENTS = {
  'starters':      'linear-gradient(135deg, #3D5A2C 0%, #6A8F40 100%)',
  'mains':         'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)',
  'pasta':         'linear-gradient(135deg, #8B6014 0%, #C49A30 100%)',
  'baked-pasta':   'linear-gradient(135deg, #7A5010 0%, #B08820 100%)',
  'pizza':         'linear-gradient(135deg, #C04A2B 0%, #E07850 100%)',
  'gourmet-pizza': 'linear-gradient(135deg, #8B2D1A 0%, #C04A2B 100%)',
  'burgers':       'linear-gradient(135deg, #A0522D 0%, #D2691E 100%)',
  'desserts':      'linear-gradient(135deg, #7B3F6E 0%, #C06090 100%)',
  'beverages':     'linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)',
  'kids':          'linear-gradient(135deg, #1A7A4A 0%, #27AE60 100%)',
  'combos':        'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)',
};

function renderMenu() {
  const categories = ACTIVE_MENU.categories;

  // Category tabs
  elCategoryTabs.innerHTML = '';
  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-tab' + (i === 0 ? ' is-active' : '');
    btn.dataset.catId = cat.id;
    btn.textContent = cat.name;
    btn.addEventListener('click', () => scrollToCategory(cat.id));
    elCategoryTabs.appendChild(btn);
  });

  // Menu items
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
    cat.items.forEach(item => grid.appendChild(buildItemCard(item, cat)));
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
        <span class="card-price">${formatPrice(item.price)}</span>
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
  for (const cat of ACTIVE_MENU.categories) {
    const item = cat.items.find(i => i.id === itemId);
    if (item) return item;
  }
  return null;
}

function findCategory(itemId) {
  for (const cat of ACTIVE_MENU.categories) {
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
  if (cart[itemId].qty <= 0) delete cart[itemId];
  saveCart();
  refreshItemControl(itemId);
  updateCartBadge(false);
  if (elCartDrawer.classList.contains('is-open')) renderCartDrawer();
}

function getCartCount() {
  return Object.values(cart).reduce((sum, l) => sum + l.qty, 0);
}

function getCartTotal() {
  return Object.values(cart).reduce((sum, l) => sum + l.price * l.qty, 0);
}

/* ─────────────────────────────────────────────────────────────
   CART BADGE
   ───────────────────────────────────────────────────────────── */
function updateCartBadge(animate) {
  const count = getCartCount();
  const total = getCartTotal();

  elCartCount.textContent    = count;
  elCartTotalBadge.textContent = formatPrice(total);

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
    elCartSubtotal.textContent = formatPrice(0);
    elCartTotal.textContent    = formatPrice(0);
    return;
  }

  elCartItems.innerHTML = lines.map(line => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${escapeHtml(line.name)}</span>
        ${line.notes ? `<span class="cart-item-notes">${escapeHtml(line.notes)}</span>` : ''}
        <span class="cart-item-unit">${formatPrice(line.price)} each</span>
      </div>
      <div class="cart-item-controls">
        <div class="qty-stepper qty-stepper--sm">
          <button class="qty-btn" data-action="decrease" data-item-id="${line.id}" aria-label="Remove one">−</button>
          <span class="qty-value">${line.qty}</span>
          <button class="qty-btn" data-action="increase" data-item-id="${line.id}" aria-label="Add one">+</button>
        </div>
        <span class="cart-item-total">${formatPrice(line.price * line.qty)}</span>
      </div>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  elCartSubtotal.textContent = formatPrice(subtotal);
  elCartTotal.textContent    = formatPrice(subtotal);
}

/* ─────────────────────────────────────────────────────────────
   SCREENS
   ───────────────────────────────────────────────────────────── */
function showScreen(name) {
  const menuSection    = document.getElementById('menu');
  const checkoutSection = elCheckout;
  const confirmSection  = elConfirmation;

  menuSection.style.display     = '';
  checkoutSection.hidden        = true;
  confirmSection.hidden         = true;
  checkoutSection.classList.remove('screen-visible');
  confirmSection.classList.remove('screen-visible');

  if (name === 'menu') {
    menuSection.style.display = '';
    window.scrollTo(0, 0);
  } else if (name === 'checkout') {
    menuSection.style.display = 'none';
    elCheckout.hidden = false;
    elCheckout.classList.add('screen-visible');
    syncCheckoutTotal();
    renderCheckoutSummary();
  } else if (name === 'confirmation') {
    if (menuSection) menuSection.style.display = 'none';
    elConfirmation.classList.add('screen-visible');
    elOrderNumber.textContent = 'Order #' + ORDER_PRE + '-' + (Math.floor(1000 + Math.random() * 9000));
    buildWhatsAppOrder();
    window.scrollTo(0, 0);
  }
}

function syncCheckoutTotal() {
  const total = getCartTotal();
  if (elOrderTotalLabel) elOrderTotalLabel.textContent = formatPrice(total);
  const summaryTotal = document.getElementById('checkout-summary-total');
  if (summaryTotal) summaryTotal.textContent = formatPrice(total);
}

function renderCheckoutSummary() {
  const el = document.getElementById('checkout-summary-items');
  if (!el) return;
  el.innerHTML = Object.values(cart).map(line =>
    `<div class="checkout-order-row">
       <span>${escapeHtml(line.name)} × ${line.qty}</span>
       <span>${formatPrice(line.price * line.qty)}</span>
     </div>`
  ).join('');
}

/* ─────────────────────────────────────────────────────────────
   WHATSAPP ORDER BUILDER
   ───────────────────────────────────────────────────────────── */
function buildWhatsAppOrder() {
  const btn = document.getElementById('btn-whatsapp-order');
  if (!btn) return;

  let cartLines = {};
  try { cartLines = JSON.parse(sessionStorage.getItem(CART_KEY + '_snapshot') || '{}'); } catch (_) {}

  let formData = { name: '', phone: '', address: '', notes: '' };
  try { formData = JSON.parse(sessionStorage.getItem(CART_KEY + '_form') || '{}'); } catch (_) {}

  const lines = Object.values(cartLines);
  if (!lines.length) { btn.style.display = 'none'; return; }

  const itemLines = lines.map(line => {
    const lineTotal = (line.price * line.qty).toFixed(0);
    let text = `• ${line.qty}x ${line.name} — ${CURRENCY}${lineTotal}`;
    if (line.notes) text += `\n  (${line.notes})`;
    return text;
  }).join('\n');

  const subtotal  = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const isCollect = formData.fulfillment === 'collect';

  const parts = [
    WA_GREETING,
    '',
    itemLines,
    '',
    `Subtotal: ${CURRENCY}${subtotal.toFixed(0)}`,
    '',
    `Order type: ${isCollect ? 'Collect in store' : 'Deliver'}`,
  ];
  if (!isCollect) parts.push(`Address: ${formData.address || 'Not provided'}`);
  parts.push('');
  parts.push(`Name: ${formData.name   || 'Not provided'}`);
  parts.push(`Phone: ${formData.phone || 'Not provided'}`);
  if (formData.notes) parts.push(`Order notes: ${formData.notes}`);
  if (WA_FOOTER) { parts.push(''); parts.push(WA_FOOTER); }

  const msg = parts.join('\n');
  btn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
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
      if (entry.isIntersecting) setActiveTab(entry.target.dataset.category);
    });
  }, { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

function setActiveTab(catId) {
  elCategoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    const active = tab.dataset.catId === catId;
    tab.classList.toggle('is-active', active);
    if (active) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
}

function scrollToCategory(catId) {
  const section    = document.getElementById('cat-' + catId);
  if (!section) return;
  const tabsHeight   = elCategoryTabs.offsetHeight;
  const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
  const top = section.getBoundingClientRect().top + window.scrollY - tabsHeight - headerHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────────────
   ITEM DETAIL MODAL
   ───────────────────────────────────────────────────────────── */
function openItemModal(itemId) {
  const item = findItem(itemId);
  const cat  = findCategory(itemId);
  if (!item || !cat) return;

  modalItemId = itemId;

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

  document.getElementById('item-modal-name').textContent  = item.name;
  document.getElementById('item-modal-desc').textContent  = item.description;
  document.getElementById('item-modal-price').textContent = formatPrice(item.price);
  document.getElementById('modal-instructions').value =
    (cart[itemId] && cart[itemId].notes) ? cart[itemId].notes : '';

  updateModalQty();

  elItemModalOverlay.classList.add('is-visible');
  elItemModal.removeAttribute('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    elItemModal.classList.add('is-open');
  }));
  document.body.style.overflow = 'hidden';
}

function closeItemModal() {
  if (modalItemId && cart[modalItemId]) {
    cart[modalItemId].notes = document.getElementById('modal-instructions').value.trim();
    saveCart();
  }
  elItemModal.classList.remove('is-open');
  elItemModalOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
  setTimeout(() => { elItemModal.setAttribute('hidden', ''); modalItemId = null; }, 380);
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

  document.getElementById('item-modal-qty').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || !modalItemId) return;
    const action = btn.dataset.action;
    if (action === 'increase') {
      if (cart[modalItemId]) adjustQty(modalItemId, 1);
      else addToCart(modalItemId);
    } else if (action === 'decrease') {
      adjustQty(modalItemId, -1);
    }
    updateModalQty();
  });

  document.getElementById('item-modal-done').addEventListener('click', closeItemModal);
}

/* ─────────────────────────────────────────────────────────────
   EVENT DELEGATION
   ───────────────────────────────────────────────────────────── */
function setupMenuEvents() {
  elMenuContainer.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (btn) {
      const action = btn.dataset.action;
      const itemId = btn.dataset.itemId;
      if (action === 'add')      addToCart(itemId);
      if (action === 'increase') { cart[itemId] ? adjustQty(itemId, 1) : addToCart(itemId); }
      if (action === 'decrease') adjustQty(itemId, -1);
      return;
    }
    const card = e.target.closest('.menu-card');
    if (card && card.dataset.itemId) openItemModal(card.dataset.itemId);
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
    const formData = {
      name:        document.getElementById('field-name').value.trim(),
      phone:       document.getElementById('field-phone').value.trim(),
      address:     document.getElementById('field-address').value.trim(),
      notes:       document.getElementById('field-notes').value.trim(),
      fulfillment,
    };
    try { sessionStorage.setItem(CART_KEY + '_form', JSON.stringify(formData)); } catch (_) {}

    const cartSnapshot = JSON.parse(JSON.stringify(cart));
    try { sessionStorage.setItem(CART_KEY + '_snapshot', JSON.stringify(cartSnapshot)); } catch (_) {}

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
    const url = 'assets/menu/' + slug + '.jpg';

    img.onload = () => {
      const mediaDiv = img.parentElement;
      if (mediaDiv) {
        mediaDiv.style.backgroundImage    = "url('" + url + "')";
        mediaDiv.style.backgroundSize     = 'contain';
        mediaDiv.style.backgroundPosition = 'center';
        mediaDiv.style.backgroundRepeat   = 'no-repeat';
        const placeholder = mediaDiv.querySelector('.card-media-placeholder');
        if (placeholder) placeholder.style.display = 'none';
      }
      img.style.display = 'none';
    };

    img.onerror = () => { img.classList.add('img-error'); };
    img.src = url;
  });
}

/* ─────────────────────────────────────────────────────────────
   PWA INSTALL BANNER
   ───────────────────────────────────────────────────────────── */
function initInstallBanner() {
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (navigator.standalone === true) return;

  const bannerAndroid = document.getElementById('install-banner');
  const bannerIOS     = document.getElementById('install-banner-ios');
  const btnInstall    = document.getElementById('install-btn');
  const btnDismiss    = document.getElementById('install-dismiss');
  const btnDismissIOS = document.getElementById('install-dismiss-ios');

  if (!bannerAndroid) return;

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
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

  if (btnDismiss) btnDismiss.addEventListener('click', () => { bannerAndroid.style.display = 'none'; });

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && !navigator.standalone && bannerIOS) {
    bannerIOS.style.display = 'flex';
    if (btnDismissIOS) btnDismissIOS.addEventListener('click', () => { bannerIOS.style.display = 'none'; });
  }

  window.addEventListener('appinstalled', () => {
    bannerAndroid.style.display = 'none';
    if (bannerIOS) bannerIOS.style.display = 'none';
  });
}

/* ─────────────────────────────────────────────────────────────
   SERVICE WORKER
   ───────────────────────────────────────────────────────────── */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
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

  elCartBadge        = document.getElementById('cart-badge');
  elCartCount        = document.getElementById('cart-count');
  elCartTotalBadge   = document.getElementById('cart-total-badge');
  elCartOverlay      = document.getElementById('cart-overlay');
  elCartDrawer       = document.getElementById('cart-drawer');
  elCartItems        = document.getElementById('cart-items');
  elCartSubtotal     = document.getElementById('cart-subtotal');
  elCartTotal        = document.getElementById('cart-total');
  elCheckout         = document.getElementById('checkout');
  elCheckoutForm     = document.getElementById('checkout-form');
  elOrderTotalLabel  = document.getElementById('order-total-label');
  elConfirmation     = document.getElementById('confirmation');
  elOrderNumber      = document.getElementById('order-number');
  elCategoryTabs     = document.getElementById('category-tabs');
  elMenuContainer    = document.getElementById('menu-container');
  elItemModal        = document.getElementById('item-modal');
  elItemModalOverlay = document.getElementById('item-modal-overlay');

  renderMenu();
  initMenuImages();
  updateCartBadge(false);
  setupMenuEvents();
  setupCartEvents();
  setupCheckoutEvents();
  setupConfirmationEvents();
  setupModalEvents();
  initInstallBanner();
  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', init);
