/*
 * QuestNerd — MakerWorld print-time order form.
 *
 * Powers makerworld-prints.html. The buyer picks one of four hour tiers,
 * chooses a filament color, pastes a makerworld.com URL, and pays through
 * Stripe Checkout. The seller receives the order details (URL + chosen
 * color + tier) via:
 *
 *   1. Stripe Checkout's `clientReferenceId` — visible in the Stripe
 *      Dashboard and surfaced in seller-side receipt emails.
 *   2. Optional webhook (`QN_CONFIG.MAKERWORLD_NOTIFY_URL`) — a Formspree
 *      / Zapier / Make endpoint that the form POSTs to right before the
 *      Stripe redirect, so the seller gets a normal email with the URL
 *      and order details even if Stripe's receipt is stripped.
 *
 * No secrets are sent from the browser. Filament + tier pricing lives in
 * assets/js/makerworld-config.js (and can be overridden by the admin via
 * content/settings/makerworld-print.json and content/filaments/*.json).
 */

(function () {
  // The buyer-supplied URL is only ever accepted if it points at the
  // real MakerWorld domain — no schemes other than https, no userinfo,
  // no localhost. This both protects the seller from being asked to
  // print arbitrary URLs and stops the page being abused as an open
  // redirector.
  var MAKERWORLD_HOSTS = ['makerworld.com', 'www.makerworld.com'];

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

  function parsePriceCents(price) {
    if (price == null) return 0;
    var m = String(price).match(/([0-9]+(?:\.[0-9]+)?)/);
    if (!m) return 0;
    return Math.round(parseFloat(m[1]) * 100);
  }

  function formatCents(cents) {
    var sign = cents < 0 ? '-' : '';
    cents = Math.abs(cents);
    var dollars = Math.floor(cents / 100);
    var rem = String(cents % 100);
    if (rem.length < 2) rem = '0' + rem;
    return sign + '$' + dollars + '.' + rem;
  }

  function validateMakerWorldUrl(raw) {
    var url;
    try { url = new URL(String(raw || '').trim()); }
    catch (e) { return null; }
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    var host = url.hostname.toLowerCase();
    if (MAKERWORLD_HOSTS.indexOf(host) === -1) return null;
    return url.toString();
  }

  function getConfig() {
    var defaults = window.QN_MAKERWORLD || { tiers: [], filaments: [] };
    var overrides = window.QN_MAKERWORLD_OVERRIDES || {};
    var tiers = overrides.tiers && overrides.tiers.length ? overrides.tiers : (defaults.tiers || []);
    var filaments = overrides.filaments && overrides.filaments.length ? overrides.filaments : (defaults.filaments || []);
    var intro = overrides.intro || defaults.intro || '';
    return {
      intro: intro,
      tiers: tiers.slice(),
      filaments: filaments.slice(),
    };
  }

  function renderTierCard(tier, index) {
    var safeId = escapeHtml(tier.id);
    var safeLabel = escapeHtml(tier.label || '');
    var safeDesc = escapeHtml(tier.description || '');
    var safePrice = escapeHtml(tier.price || '');
    return (
      '<label class="mw-tier" for="mw-tier-' + safeId + '">' +
        '<input type="radio" name="mw-tier" id="mw-tier-' + safeId + '" ' +
          'value="' + safeId + '"' + (index === 0 ? ' checked' : '') + '>' +
        '<span class="mw-tier-body">' +
          '<span class="mw-tier-label">' + safeLabel + '</span>' +
          (safeDesc ? '<span class="mw-tier-desc">' + safeDesc + '</span>' : '') +
          '<span class="mw-tier-price">' + safePrice + '</span>' +
        '</span>' +
      '</label>'
    );
  }

  function renderFilamentOption(fil) {
    // Build the dropdown <option>. Add-on price is shown right in the
    // label so the buyer always sees the upcharge.
    var safeId = escapeHtml(fil.id);
    var safeName = escapeHtml(fil.name || fil.id);
    var addOnLabel = '';
    var cents = parsePriceCents(fil.addOnPrice);
    if (cents > 0) addOnLabel = ' (+' + formatCents(cents) + ')';
    return '<option value="' + safeId + '">' + safeName + addOnLabel + '</option>';
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }

  function buildClientReferenceId(payload) {
    // Stripe's client_reference_id is limited to ~200 chars and a small
    // alphabet. We pack a short, ASCII-only summary that the seller can
    // recognise in the dashboard.
    var raw = JSON.stringify(payload);
    var safe = '';
    try { safe = btoa(unescape(encodeURIComponent(raw))); }
    catch (e) { safe = ''; }
    // client_reference_id forbids most non-alphanumerics. Strip '/+=' to be safe.
    safe = safe.replace(/[^A-Za-z0-9_-]/g, '');
    if (safe.length > 180) safe = safe.slice(0, 180);
    return 'mw_' + safe;
  }

  function notifySeller(payload) {
    var cfg = window.QN_CONFIG || {};
    var url = cfg.MAKERWORLD_NOTIFY_URL || '';
    if (!url || !/^https:\/\//.test(url)) return Promise.resolve();
    // Send as JSON. Most form-to-email providers (Formspree, Make, Zapier
    // webhooks) accept application/json without preflight on simple POSTs;
    // we don't read the response, only fire-and-forget.
    return fetch(url, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function () { /* ignore */ }).catch(function () { /* ignore */ });
  }

  function disableForm(form, busy) {
    Array.prototype.forEach.call(form.querySelectorAll('input, select, button, textarea'), function (el) {
      el.disabled = !!busy;
    });
  }

  function showError(form, message) {
    var err = form.querySelector('[data-mw-error]');
    if (!err) return;
    err.textContent = message || '';
    err.hidden = !message;
  }

  function recalc(form, cfg) {
    var tierId = (form.querySelector('input[name="mw-tier"]:checked') || {}).value || '';
    var filId = (form.querySelector('select[name="mw-filament"]') || {}).value || '';
    var tier = findById(cfg.tiers, tierId) || cfg.tiers[0];
    var fil = findById(cfg.filaments, filId);
    var baseCents = tier ? parsePriceCents(tier.price) : 0;
    var addCents = fil ? parsePriceCents(fil.addOnPrice) : 0;
    var totalCents = baseCents + addCents;
    var totalEl = form.querySelector('[data-mw-total]');
    var baseEl = form.querySelector('[data-mw-base]');
    var addEl = form.querySelector('[data-mw-addon]');
    if (baseEl) baseEl.textContent = formatCents(baseCents);
    if (addEl) addEl.textContent = formatCents(addCents);
    if (totalEl) totalEl.textContent = formatCents(totalCents);
  }

  function startCheckout(form, cfg) {
    showError(form, '');
    var tierId = (form.querySelector('input[name="mw-tier"]:checked') || {}).value || '';
    var filId = (form.querySelector('select[name="mw-filament"]') || {}).value || '';
    var rawUrl = (form.querySelector('input[name="mw-url"]') || {}).value || '';
    var tier = findById(cfg.tiers, tierId);
    var fil = findById(cfg.filaments, filId);

    if (!tier) return showError(form, 'Please pick a print-time option.');
    var validUrl = validateMakerWorldUrl(rawUrl);
    if (!validUrl) {
      return showError(form,
        'Please paste a link to a print on makerworld.com — full https:// URL required.');
    }

    var basePriceId = tier.stripePriceId || '';
    var stripeLink = tier.stripeLink || '';
    var filPriceId = fil && parsePriceCents(fil.addOnPrice) > 0 ? (fil.stripePriceId || '') : '';

    var ready = (basePriceId && basePriceId.indexOf('REPLACE_ME') === -1)
      || (stripeLink && /^https?:\/\//.test(stripeLink) && stripeLink.indexOf('REPLACE_ME') === -1);
    if (!ready) {
      return showError(form,
        'This option is not configured yet. The shop owner needs to wire up a Stripe price ID or Payment Link — see MAKERWORLD_SETUP.md.');
    }
    if (fil && parsePriceCents(fil.addOnPrice) > 0 && (!filPriceId || filPriceId.indexOf('REPLACE_ME') !== -1) && !stripeLink) {
      return showError(form,
        'The chosen filament has an add-on price but no Stripe price ID. Pick a different color or ask the shop owner to wire one up.');
    }

    var basePriceCents = parsePriceCents(tier.price);
    var addCents = fil ? parsePriceCents(fil.addOnPrice) : 0;
    var payload = {
      product: 'makerworld-print',
      tier: { id: tier.id, label: tier.label, maxHours: tier.maxHours, price: tier.price },
      filament: fil ? { id: fil.id, name: fil.name, addOnPrice: fil.addOnPrice } : null,
      makerWorldUrl: validUrl,
      totalPriceCents: basePriceCents + addCents,
      totalPriceDisplay: formatCents(basePriceCents + addCents),
      submittedAt: new Date().toISOString(),
    };
    var clientReferenceId = buildClientReferenceId({
      // Keep it short — store an upper-cased recognisable summary plus
      // the URL. The full payload is also sent to MAKERWORLD_NOTIFY_URL.
      t: tier.id,
      f: fil ? fil.id : '',
      u: validUrl,
    });

    disableForm(form, true);
    var submitBtn = form.querySelector('[data-mw-submit]');
    var originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) submitBtn.textContent = 'Sending order…';

    notifySeller(payload).then(function () {
      // Branch on integration style.
      if (basePriceId && basePriceId.indexOf('REPLACE_ME') === -1) {
        // Use Stripe.js redirectToCheckout. Build lineItems with the
        // base tier and (optionally) the filament upcharge.
        if (!window.QN_STRIPE || !window.QN_STRIPE.checkoutProductCustom) {
          throw new Error('Stripe helper not loaded. Refresh the page and try again.');
        }
        return window.QN_STRIPE.checkoutProductCustom({
          lineItems: [{ price: basePriceId, quantity: 1 }].concat(
            filPriceId ? [{ price: filPriceId, quantity: 1 }] : []
          ),
          clientReferenceId: clientReferenceId,
        });
      }
      // Payment Link path: append client_reference_id so the seller
      // sees the order id (encodes the makerworld URL).
      var sep = stripeLink.indexOf('?') === -1 ? '?' : '&';
      window.location.href = stripeLink + sep + 'client_reference_id=' + encodeURIComponent(clientReferenceId);
      return null;
    }).catch(function (err) {
      disableForm(form, false);
      if (submitBtn) submitBtn.textContent = originalLabel;
      showError(form, (err && err.message) || 'Checkout failed.');
    });
  }

  function renderForm(host) {
    var cfg = getConfig();
    if (!cfg.tiers.length) {
      host.innerHTML = '<p class="meta">No print-time options configured yet. ' +
        'Edit <code>assets/js/makerworld-config.js</code> or use the /admin/ UI.</p>';
      return;
    }
    var tiersHtml = cfg.tiers.map(renderTierCard).join('');
    var filamentOptions = cfg.filaments.map(renderFilamentOption).join('');
    var filamentBlock = '';
    if (cfg.filaments.length) {
      filamentBlock =
        '<div class="mw-field">' +
          '<label for="mw-filament">Filament color</label>' +
          '<select id="mw-filament" name="mw-filament" required>' + filamentOptions + '</select>' +
          '<p class="mw-field-hint">Add-ons are charged on top of the print-time base price.</p>' +
        '</div>';
    }
    var introHtml = cfg.intro ? '<p class="hero-lede">' + escapeHtml(cfg.intro) + '</p>' : '';

    host.innerHTML =
      introHtml +
      '<form class="mw-form" data-mw-form novalidate>' +
        '<fieldset class="mw-tiers">' +
          '<legend>Print time</legend>' +
          tiersHtml +
        '</fieldset>' +
        filamentBlock +
        '<div class="mw-field">' +
          '<label for="mw-url">MakerWorld URL</label>' +
          '<input type="url" id="mw-url" name="mw-url" required ' +
            'placeholder="https://makerworld.com/en/models/…" ' +
            'autocomplete="off" inputmode="url" spellcheck="false">' +
          '<p class="mw-field-hint">Paste the link to the model you want printed. Must be on makerworld.com.</p>' +
        '</div>' +
        '<div class="mw-totals" aria-live="polite">' +
          '<div><span>Base print time</span><strong data-mw-base>$0.00</strong></div>' +
          '<div><span>Filament add-on</span><strong data-mw-addon>$0.00</strong></div>' +
          '<div class="mw-totals-grand"><span>Total today</span><strong data-mw-total>$0.00</strong></div>' +
        '</div>' +
        '<p class="mw-error" data-mw-error role="alert" hidden></p>' +
        '<div class="mw-actions">' +
          '<button class="qn-button" type="submit" data-mw-submit>Place order &amp; pay</button>' +
        '</div>' +
        '<p class="meta">Shipping address, taxes, and payment are collected by Stripe on the next step.</p>' +
      '</form>';

    var form = host.querySelector('[data-mw-form]');
    if (!form) return;
    form.addEventListener('change', function () { recalc(form, cfg); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      startCheckout(form, cfg);
    });
    recalc(form, cfg);
  }

  function init() {
    var host = document.querySelector('[data-mw-host]');
    if (!host) return;
    renderForm(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-render once admin-authored content is merged in.
  document.addEventListener('qn:content-loaded', init);
})();
