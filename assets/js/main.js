/*
 * QuestNerd — main.js
 *
 * Renders product grids from window.QN_PRODUCTS into any container with
 * `data-qn-grid` (filters via `data-qn-type` / `data-qn-featured` /
 * `data-qn-limit`) and wires up Stripe "Buy" buttons.
 */

(function () {
  var STORE_LABELS = {
    'cults3d': 'View on Cults3D',
    'etsy': 'View on Etsy',
    'googleplay': 'Get it on Google Play',
    'pc-download': 'Download',
    'stripe': 'Buy now',
  };

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function filterProducts(opts) {
    var list = (window.QN_PRODUCTS || []).slice();
    if (opts.type) {
      var types = opts.type.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      list = list.filter(function (p) { return types.indexOf(p.type) !== -1; });
    }
    if (opts.featured) {
      list = list.filter(function (p) { return !!p.featured; });
    }
    if (opts.limit > 0) list = list.slice(0, opts.limit);
    return list;
  }

  function renderCard(product) {
    var title = escapeHtml(product.title || 'Untitled');
    var desc = escapeHtml(product.description || '');
    var price = escapeHtml(product.price || '');
    var img = escapeHtml(product.image || 'assets/img/questnerd-mark.svg');
    var typeLabel = STORE_LABELS[product.type] || 'View';

    var actionHtml;
    if (product.type === 'stripe') {
      actionHtml =
        '<button type="button" class="qn-button qn-buy" data-qn-buy="' + escapeHtml(product.id) + '">' +
        escapeHtml(typeLabel) +
        '</button>';
    } else {
      var href = product.url && product.url !== '#' ? product.url : '#';
      var rel = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      actionHtml =
        '<a class="qn-button ghost" href="' + escapeHtml(href) + '"' + rel + '>' +
        escapeHtml(typeLabel) + '</a>';
    }

    return (
      '<article class="product-card" aria-label="' + title + '">' +
        '<div class="product-thumb"><img src="' + img + '" alt=""></div>' +
        '<h3 class="product-title">' + title + '</h3>' +
        (desc ? '<p class="meta">' + desc + '</p>' : '') +
        (price ? '<p class="product-price">' + price + '</p>' : '') +
        actionHtml +
      '</article>'
    );
  }

  function renderEmpty(message) {
    return '<p class="meta">' + escapeHtml(message) + '</p>';
  }

  function renderGrids() {
    var grids = document.querySelectorAll('[data-qn-grid]');
    for (var i = 0; i < grids.length; i++) {
      var grid = grids[i];
      var products = filterProducts({
        type: grid.getAttribute('data-qn-type') || '',
        featured: grid.hasAttribute('data-qn-featured'),
        limit: parseInt(grid.getAttribute('data-qn-limit') || '0', 10) || 0,
      });
      if (!products.length) {
        var emptyMsg = grid.getAttribute('data-qn-empty') ||
          'No items yet. Add entries to assets/js/products.js to populate this grid.';
        grid.innerHTML = renderEmpty(emptyMsg);
        grid.classList.remove('product-grid');
        continue;
      }
      grid.classList.add('product-grid');
      grid.innerHTML = products.map(renderCard).join('');
    }
  }

  function wireBuyButtons() {
    document.querySelectorAll('[data-qn-buy]').forEach(function (btn) {
      if (btn.__qnWired) return;
      btn.__qnWired = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.getAttribute('data-qn-buy');
        var product = (window.QN_PRODUCTS || []).filter(function (p) { return p.id === id; })[0];
        if (!product) return;
        btn.disabled = true;
        var originalLabel = btn.textContent;
        btn.textContent = 'Loading…';
        Promise.resolve(window.QN_STRIPE ? window.QN_STRIPE.checkoutProduct(product) : Promise.reject(
          new Error('Stripe helper not loaded. Include assets/js/stripe-checkout.js before main.js.')
        )).catch(function (err) {
          alert(err && err.message ? err.message : 'Checkout failed.');
          btn.disabled = false;
          btn.textContent = originalLabel;
        });
      });
    });
  }

  function init() {
    renderGrids();
    wireBuyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-run if header/footer get injected after our initial pass.
  document.addEventListener('qn:partials-loaded', init);
})();
