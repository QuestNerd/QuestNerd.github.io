/*
 * QuestNerd — UTM persistence + propagation.
 *
 * On first hit, captures any `utm_*` query parameters (and `gclid` / `fbclid`)
 * into localStorage. On every page load, rewrites outbound links to known
 * storefronts (Cults3D, Etsy, Google Play) and Stripe Payment Links to carry
 * the same params, so attribution survives the redirect off-site.
 */
(function () {
  var STORAGE_KEY = 'qn_utm';
  var CAPTURE_KEYS = [
    'utm_source','utm_medium','utm_campaign','utm_term','utm_content',
    'utm_id','gclid','fbclid','msclkid','ref','referrer'
  ];

  function readStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeStored(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function capture() {
    var params = new URLSearchParams(window.location.search);
    var picked = {};
    var has = false;
    CAPTURE_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { picked[k] = v; has = true; }
    });
    if (!has) return readStored() || {};
    // First-touch attribution: don't overwrite an existing record.
    if (!readStored()) {
      picked.ts = Date.now();
      picked.landing = window.location.pathname;
      writeStored(picked);
    }
    return readStored() || picked;
  }

  function decorate(href, attribution) {
    if (!href || !attribution) return href;
    if (!/^https?:\/\//.test(href)) return href;
    // Only decorate links to known external storefronts and Stripe.
    var ALLOW = [
      'cults3d.com', 'etsy.com', 'play.google.com',
      'buy.stripe.com', 'checkout.stripe.com'
    ];
    var ok = ALLOW.some(function (host) { return href.indexOf(host) !== -1; });
    if (!ok) return href;
    try {
      var u = new URL(href);
      Object.keys(attribution).forEach(function (k) {
        if (k === 'ts' || k === 'landing') return;
        if (!u.searchParams.has(k)) u.searchParams.set(k, attribution[k]);
      });
      return u.toString();
    } catch (e) { return href; }
  }

  function decorateAllLinks() {
    var attr = readStored();
    if (!attr) return;
    var anchors = document.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      if (a.__qnUtmDone) continue;
      var newHref = decorate(a.getAttribute('href'), attr);
      if (newHref && newHref !== a.getAttribute('href')) a.setAttribute('href', newHref);
      a.__qnUtmDone = true;
    }
  }

  // Expose for stripe-checkout.js (which can append UTM to successUrl / cancelUrl).
  window.QN_UTM = {
    get: readStored,
    decorate: decorate,
    decorateAllLinks: decorateAllLinks
  };

  capture();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateAllLinks);
  } else {
    decorateAllLinks();
  }
  document.addEventListener('qn:partials-loaded', decorateAllLinks);
  document.addEventListener('qn:content-rendered', decorateAllLinks);
})();
