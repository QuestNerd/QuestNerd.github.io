/*
 * QuestNerd — Stripe Checkout helper.
 *
 * Two checkout modes are supported per product (see assets/js/products.js):
 *
 *  1. `stripeLink` — a full Stripe Payment Link URL (recommended for
 *     no-JS-config setups). The button simply navigates the browser there.
 *
 *  2. `stripePriceId` — a Stripe Price ID (e.g. "price_XXXX"). The browser
 *     loads Stripe.js, then calls `stripe.redirectToCheckout`. This requires
 *     `QN_CONFIG.STRIPE_PUBLISHABLE_KEY` to be set in assets/js/config.js.
 *
 * Success / cancel URLs point at success.html and cancel.html in this repo.
 *
 * NEVER place a Stripe secret key in client-side code. Only publishable keys
 * (`pk_test_…` or `pk_live_…`) are safe to ship in JS.
 */

(function () {
  var STRIPE_JS_URL = 'https://js.stripe.com/v3/';
  var stripePromise = null;
  var stripeLoaded = false;

  function loadStripeJs() {
    if (stripePromise) return stripePromise;
    stripePromise = new Promise(function (resolve, reject) {
      if (window.Stripe) {
        stripeLoaded = true;
        resolve(window.Stripe);
        return;
      }
      var existing = document.querySelector('script[src="' + STRIPE_JS_URL + '"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(window.Stripe); });
        existing.addEventListener('error', function () { reject(new Error('Failed to load Stripe.js')); });
        return;
      }
      var s = document.createElement('script');
      s.src = STRIPE_JS_URL;
      s.async = true;
      s.onload = function () { stripeLoaded = true; resolve(window.Stripe); };
      s.onerror = function () { reject(new Error('Failed to load Stripe.js')); };
      document.head.appendChild(s);
    });
    return stripePromise;
  }

  /**
   * Begin a Stripe Checkout flow for the given product entry.
   * Returns a Promise that resolves when redirect kicks in, or rejects with
   * a human-readable error.
   */
  function checkoutProduct(product) {
    if (!product) return Promise.reject(new Error('No product provided.'));

    // Payment Link path: just navigate.
    if (product.stripeLink && /^https?:\/\//.test(product.stripeLink)) {
      window.location.href = product.stripeLink;
      return Promise.resolve();
    }

    var config = window.QN_CONFIG || {};
    var pubKey = config.STRIPE_PUBLISHABLE_KEY || '';
    var priceId = product.stripePriceId || '';

    if (!pubKey || pubKey.indexOf('REPLACE_ME') !== -1) {
      return Promise.reject(new Error(
        'Stripe is not configured yet. Set STRIPE_PUBLISHABLE_KEY in assets/js/config.js.'
      ));
    }
    if (!priceId || priceId.indexOf('REPLACE_ME') !== -1) {
      return Promise.reject(new Error(
        'This product has no Stripe price ID. Set `stripePriceId` (or `stripeLink`) in assets/js/products.js.'
      ));
    }

    return loadStripeJs().then(function (StripeCtor) {
      if (!StripeCtor) throw new Error('Stripe.js failed to initialise.');
      var stripe = StripeCtor(pubKey);
      var origin = window.location.origin;
      // Use repository-relative URLs so this works under both
      // questnerd.github.io and a custom domain (CNAME).
      return stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: origin + '/success.html',
        cancelUrl: origin + '/cancel.html',
      }).then(function (result) {
        if (result && result.error) throw new Error(result.error.message || 'Stripe redirect failed.');
      });
    });
  }

  window.QN_STRIPE = {
    checkoutProduct: checkoutProduct,
    isReady: function () {
      var c = window.QN_CONFIG || {};
      return !!c.STRIPE_PUBLISHABLE_KEY && c.STRIPE_PUBLISHABLE_KEY.indexOf('REPLACE_ME') === -1;
    },
  };
})();
