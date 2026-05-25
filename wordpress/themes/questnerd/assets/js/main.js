/*
 * QuestNerd — main.js
 *
 * Renders product grids from window.QN_PRODUCTS into any container with
 * `data-qn-grid` (filters via `data-qn-type` / `data-qn-featured` /
 * `data-qn-limit`) and wires up Stripe "Buy" buttons.
 *
 * Also renders portfolio grids from window.QN_PROJECTS into any container
 * with `data-qn-projects`.
 *
 * Re-renders on:
 *   - DOMContentLoaded
 *   - qn:partials-loaded   (header/footer just injected)
 *   - qn:content-loaded    (Decap-authored content just merged in)
 */

(function () {
  var STORE_LABELS = {
    'cults3d': 'View on Cults3D',
    'etsy': 'View project',
    'googleplay': 'View project',
    'pc-download': 'Preview',
    'stripe': 'View waitlist',
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
    var detailHref = '/product/' + encodeURIComponent(product.id || '') + '/';

    var actionHtml;
    if (product.type === 'stripe') {
      if (product.stripePriceId || product.stripeLink) {
        actionHtml =
          '<button type="button" class="qn-button qn-buy" data-qn-buy="' + escapeHtml(product.id) + '">' +
          'Buy now' +
          '</button>';
      } else {
        actionHtml = '<a class="qn-button ghost" href="' + detailHref + '">View waitlist</a>';
      }
    } else {
      var href = product.url && product.url !== '#' ? product.url : detailHref;
      var rel = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      actionHtml =
        '<a class="qn-button ghost" href="' + escapeHtml(href) + '"' + rel + '>' +
        escapeHtml(typeLabel) + '</a>';
    }

    var badge = product.model ? '<span class="qn-badge-3d" title="Interactive 3D preview available">3D</span>' : '';

    return (
      '<article class="product-card" aria-label="' + title + '">' +
        '<a class="product-thumb-link" href="' + detailHref + '" aria-label="View details for ' + title + '">' +
          '<div class="product-thumb">' + badge +
            '<img src="' + img + '" alt="' + title + '">' +
          '</div>' +
        '</a>' +
        '<h3 class="product-title"><a href="' + detailHref + '">' + title + '</a></h3>' +
        (desc ? '<p class="meta">' + desc + '</p>' : '') +
        (price ? '<p class="product-price">' + price + '</p>' : '') +
        '<div class="product-card-actions">' +
          actionHtml +
          '<a class="qn-button ghost" href="' + detailHref + '">Details</a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderProjectCard(project) {
    var title = escapeHtml(project.title || 'Untitled project');
    var summary = escapeHtml(project.summary || '');
    var date = escapeHtml(project.date || '');
    var img = escapeHtml(project.image || 'assets/img/questnerd-mark.svg');
    var href = '/project/' + encodeURIComponent(project.id || '') + '/';
    return (
      '<article class="product-card" aria-label="' + title + '">' +
        '<a class="product-thumb-link" href="' + href + '">' +
          '<div class="product-thumb"><img src="' + img + '" alt="' + title + '"></div>' +
        '</a>' +
        '<h3 class="product-title"><a href="' + href + '">' + title + '</a></h3>' +
        (date ? '<p class="meta">' + date + '</p>' : '') +
        (summary ? '<p class="meta">' + summary + '</p>' : '') +
        '<a class="qn-button ghost" href="' + href + '">Read case study</a>' +
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
          'No items yet. Add entries to assets/js/products.js (or via /admin/) to populate this grid.';
        grid.innerHTML = renderEmpty(emptyMsg);
        grid.classList.remove('product-grid');
        continue;
      }
      grid.classList.add('product-grid');
      grid.innerHTML = products.map(renderCard).join('');
    }

    var projectGrids = document.querySelectorAll('[data-qn-projects]');
    for (var k = 0; k < projectGrids.length; k++) {
      var pg = projectGrids[k];
      var limit = parseInt(pg.getAttribute('data-qn-limit') || '0', 10) || 0;
      var projects = (window.QN_PROJECTS || []).slice();
      projects.sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      });
      if (limit > 0) projects = projects.slice(0, limit);
      if (!projects.length) {
        pg.innerHTML = renderEmpty(pg.getAttribute('data-qn-empty') ||
          'No projects yet. Add entries to assets/js/projects.js (or via /admin/) to populate this grid.');
        pg.classList.remove('product-grid');
        continue;
      }
      pg.classList.add('product-grid');
      pg.innerHTML = projects.map(renderProjectCard).join('');
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
    document.dispatchEvent(new CustomEvent('qn:content-rendered'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('qn:partials-loaded', init);
  document.addEventListener('qn:content-loaded', init);
})();