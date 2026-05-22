/*
 * QuestNerd — detail page renderer (product.html + project.html).
 *
 * Reads the `id` query parameter, finds the matching item in either
 * window.QN_PRODUCTS or window.QN_PROJECTS, and renders a full-width detail
 * view into [data-qn-detail]. Also renders a related-items grid into
 * [data-qn-related].
 *
 * For products it injects JSON-LD (Product + FAQPage) for search engines.
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
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // The "story" / "longDescription" fields may contain modest inline HTML
  // authored by the site owner. We allow a small allowlist of tags + strip
  // anything else (no scripts, no event handlers, no style).
  var ALLOWED_TAGS = ['p','br','strong','em','b','i','u','ul','ol','li','h2','h3','h4','blockquote','code','pre','a'];
  function sanitizeHtml(html) {
    if (!html) return '';
    // Quickly strip any script/style blocks and on* attributes.
    var doc = document.implementation.createHTMLDocument('');
    var wrap = doc.createElement('div');
    wrap.innerHTML = String(html);
    (function walk(node) {
      var i, child, attrs, name;
      var children = Array.prototype.slice.call(node.childNodes);
      for (i = 0; i < children.length; i++) {
        child = children[i];
        if (child.nodeType === 1) {
          name = child.nodeName.toLowerCase();
          if (ALLOWED_TAGS.indexOf(name) === -1) {
            // Replace disallowed element with its text content.
            child.replaceWith(doc.createTextNode(child.textContent || ''));
            continue;
          }
          // Strip all attributes except href on <a>.
          attrs = Array.prototype.slice.call(child.attributes || []);
          for (var j = 0; j < attrs.length; j++) {
            var a = attrs[j];
            var keep = false;
            if (name === 'a' && a.name === 'href' && /^(https?:|mailto:|#|\/|[a-zA-Z0-9_\-./?=&%]+$)/.test(a.value)) keep = true;
            if (!keep) child.removeAttribute(a.name);
          }
          if (name === 'a') {
            child.setAttribute('target', '_blank');
            child.setAttribute('rel', 'noopener noreferrer');
          }
          walk(child);
        } else if (child.nodeType === 8) {
          child.remove(); // strip comments
        }
      }
    })(wrap);
    return wrap.innerHTML;
  }

  function getParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  }

  function ensureModelViewer() {
    if (window.customElements && window.customElements.get && window.customElements.get('model-viewer')) return;
    if (document.querySelector('script[data-qn-model-viewer]')) return;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
    s.setAttribute('data-qn-model-viewer', '1');
    document.head.appendChild(s);
  }

  function renderModelViewer(modelUrl, title) {
    ensureModelViewer();
    return '' +
      '<div class="model-viewer-wrap">' +
      '<model-viewer src="' + escapeHtml(modelUrl) + '" alt="' + escapeHtml(title) + '" ' +
      'camera-controls auto-rotate ar shadow-intensity="1" exposure="0.9" ' +
      'style="width:100%; height:420px; background:#061008;"></model-viewer>' +
      '</div>';
  }

  function renderGallery(images) {
    if (!images || !images.length) return '';
    return '<div class="qn-gallery">' + images.map(function (src) {
      return '<a class="qn-gallery-item" href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer">' +
        '<img loading="lazy" src="' + escapeHtml(src) + '" alt=""></a>';
    }).join('') + '</div>';
  }

  function renderSpecs(specs) {
    if (!specs || !specs.length) return '';
    return '<dl class="qn-specs">' + specs.map(function (s) {
      return '<dt>' + escapeHtml(s.label) + '</dt><dd>' + escapeHtml(s.value) + '</dd>';
    }).join('') + '</dl>';
  }

  function renderFiles(files) {
    if (!files || !files.length) return '';
    return '<ul class="qn-files">' + files.map(function (f) {
      var href = f.url ? '<a href="' + escapeHtml(f.url) + '">' + escapeHtml(f.name || f.url) + '</a>' : escapeHtml(f.name || '');
      var size = f.size ? ' <span class="meta">(' + escapeHtml(f.size) + ')</span>' : '';
      return '<li>' + href + size + '</li>';
    }).join('') + '</ul>';
  }

  function renderFaq(faq) {
    if (!faq || !faq.length) return '';
    return '<section class="qn-faq"><h2>Frequently asked</h2>' + faq.map(function (f) {
      return '<details><summary>' + escapeHtml(f.q) + '</summary><div>' + escapeHtml(f.a) + '</div></details>';
    }).join('') + '</section>';
  }

  function renderActionButton(product) {
    var label = STORE_LABELS[product.type] || 'View';
    if (product.type === 'stripe') {
      return '<button type="button" class="qn-button qn-buy" data-qn-buy="' + escapeHtml(product.id) + '">' +
        escapeHtml(label) + '</button>';
    }
    var href = product.url && product.url !== '#' ? product.url : '#';
    var rel = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a class="qn-button" href="' + escapeHtml(href) + '"' + rel + '>' + escapeHtml(label) + '</a>';
  }

  function injectProductJsonLd(product) {
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.title,
      'description': product.description || product.longDescription || '',
      'image': product.image ? [product.image] : undefined,
      'sku': product.id,
      'brand': { '@type': 'Brand', 'name': 'QuestNerd' },
    };
    if (product.price && /\$?[0-9]/.test(product.price)) {
      var amount = product.price.replace(/[^0-9.]/g, '');
      if (amount) {
        ld.offers = {
          '@type': 'Offer',
          'price': amount,
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
          'url': window.location.href,
        };
      }
    }
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    s.setAttribute('data-qn-ld', 'product');
    document.head.appendChild(s);

    if (product.faq && product.faq.length) {
      var faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': product.faq.map(function (f) {
          return {
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
          };
        })
      };
      var s2 = document.createElement('script');
      s2.type = 'application/ld+json';
      s2.textContent = JSON.stringify(faqLd);
      s2.setAttribute('data-qn-ld', 'faq');
      document.head.appendChild(s2);
    }
  }

  function renderProduct(container, product) {
    document.title = product.title + ' — QuestNerd';
    var titleSafe = escapeHtml(product.title);
    var heroMedia = product.model
      ? renderModelViewer(product.model, product.title)
      : '<div class="product-hero-img"><img src="' + escapeHtml(product.image || 'assets/img/questnerd-mark.svg') + '" alt="' + titleSafe + '"></div>';

    var html =
      '<article class="product-detail">' +
        '<div class="product-detail-grid">' +
          '<div class="product-detail-media">' +
            heroMedia +
            (product.model ? '<p class="meta">Drag to rotate · scroll to zoom · tap the AR icon on mobile.</p>' : '') +
            renderGallery(product.images) +
          '</div>' +
          '<div class="product-detail-body">' +
            '<h1>' + titleSafe + '</h1>' +
            (product.price ? '<p class="product-price">' + escapeHtml(product.price) + '</p>' : '') +
            (product.description ? '<p class="hero-lede">' + escapeHtml(product.description) + '</p>' : '') +
            '<div class="hero-cta-row">' + renderActionButton(product) + '</div>' +
            (product.longDescription ? '<div class="entry-content">' + sanitizeHtml(product.longDescription) + '</div>' : '') +
            renderSpecs(product.specs) +
            (product.story ? '<section class="qn-story"><h2>The story</h2><div class="entry-content">' + sanitizeHtml(product.story) + '</div></section>' : '') +
            (product.files && product.files.length ? '<section class="qn-files-section"><h2>What you get</h2>' + renderFiles(product.files) + '</section>' : '') +
            renderFaq(product.faq) +
          '</div>' +
        '</div>' +
      '</article>';
    container.innerHTML = html;
    injectProductJsonLd(product);
  }

  function renderProject(container, project) {
    document.title = project.title + ' — Portfolio — QuestNerd';
    var titleSafe = escapeHtml(project.title);
    var cover = project.image ? '<div class="product-hero-img"><img src="' + escapeHtml(project.image) + '" alt="' + titleSafe + '"></div>' : '';
    var html =
      '<article class="project-detail">' +
        '<div class="product-detail-grid">' +
          '<div class="product-detail-media">' +
            cover +
            renderGallery(project.images) +
          '</div>' +
          '<div class="product-detail-body">' +
            '<h1>' + titleSafe + '</h1>' +
            (project.date ? '<p class="meta">' + escapeHtml(project.date) + (project.role ? ' · ' + escapeHtml(project.role) : '') + '</p>' : '') +
            (project.summary ? '<p class="hero-lede">' + escapeHtml(project.summary) + '</p>' : '') +
            (project.outcome ? '<p class="qn-outcome"><strong>Outcome:</strong> ' + escapeHtml(project.outcome) + '</p>' : '') +
            renderSpecs([
              project.duration ? { label: 'Duration', value: project.duration } : null,
              project.moneySpent ? { label: 'Money spent', value: project.moneySpent } : null,
              project.moneySaved ? { label: 'Money saved', value: project.moneySaved } : null,
              project.tech && project.tech.length ? { label: 'Tech', value: project.tech.join(', ') } : null,
            ].filter(Boolean)) +
            (project.story ? '<section class="qn-story"><h2>The story</h2><div class="entry-content">' + sanitizeHtml(project.story) + '</div></section>' : '') +
            (project.links && project.links.length ?
              '<section class="qn-links"><h2>Links</h2><ul>' + project.links.map(function (l) {
                return '<li><a href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(l.label || l.url) + '</a></li>';
              }).join('') + '</ul></section>' : '') +
          '</div>' +
        '</div>' +
      '</article>';
    container.innerHTML = html;
  }

  function renderRelated(container, item, mode) {
    if (!container || !item) return;
    var pool = mode === 'project' ? (window.QN_PROJECTS || []) : (window.QN_PRODUCTS || []);
    var related = pool.filter(function (p) {
      if (p.id === item.id) return false;
      if (mode === 'project') return true;
      return p.type === item.type;
    });
    // Prefer items sharing tags.
    if (item.tags && item.tags.length) {
      related.sort(function (a, b) {
        var ai = (a.tags || []).filter(function (t) { return item.tags.indexOf(t) !== -1; }).length;
        var bi = (b.tags || []).filter(function (t) { return item.tags.indexOf(t) !== -1; }).length;
        return bi - ai;
      });
    }
    related = related.slice(0, 3);
    if (!related.length) { container.innerHTML = ''; return; }
    container.classList.add('product-grid');
    container.innerHTML = related.map(function (p) {
      var img = escapeHtml(p.image || 'assets/img/questnerd-mark.svg');
      var href = mode === 'project' ? 'project.html?id=' + encodeURIComponent(p.id) : 'product.html?id=' + encodeURIComponent(p.id);
      return '<a class="product-card" href="' + href + '" style="text-decoration:none;color:inherit;">' +
        '<div class="product-thumb"><img src="' + img + '" alt="' + escapeHtml(p.title) + '"></div>' +
        '<h3 class="product-title">' + escapeHtml(p.title) + '</h3>' +
        (p.price ? '<p class="product-price">' + escapeHtml(p.price) + '</p>' : '') +
        '</a>';
    }).join('');
  }

  function wireBuyButton() {
    document.querySelectorAll('[data-qn-buy]').forEach(function (btn) {
      if (btn.__qnWired) return;
      btn.__qnWired = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.getAttribute('data-qn-buy');
        var product = (window.QN_PRODUCTS || []).filter(function (p) { return p.id === id; })[0];
        if (!product) return;
        btn.disabled = true;
        var label = btn.textContent;
        btn.textContent = 'Loading…';
        Promise.resolve(window.QN_STRIPE ? window.QN_STRIPE.checkoutProduct(product) : Promise.reject(new Error('Stripe helper not loaded.')))
          .catch(function (err) { alert(err && err.message || 'Checkout failed.'); btn.disabled = false; btn.textContent = label; });
      });
    });
  }

  function render() {
    var container = document.querySelector('[data-qn-detail]');
    if (!container) return;
    var mode = container.getAttribute('data-qn-detail') || 'product';
    var id = getParam('id');
    var notFoundHtml = '<div class="card" style="text-align:center;">' +
      '<h1>Not found</h1>' +
      '<p class="meta">' + (mode === 'project' ? 'No project' : 'No product') + ' matches that id.</p>' +
      '<p><a class="qn-button" href="' + (mode === 'project' ? 'portfolio.html' : 'shop.html') + '">Back to ' +
      (mode === 'project' ? 'portfolio' : 'shop') + '</a></p></div>';
    if (!id) { container.innerHTML = notFoundHtml; return; }
    var pool = mode === 'project' ? (window.QN_PROJECTS || []) : (window.QN_PRODUCTS || []);
    var item = pool.filter(function (p) { return p.id === id; })[0];
    if (!item) { container.innerHTML = notFoundHtml; return; }

    if (mode === 'project') renderProject(container, item);
    else renderProduct(container, item);

    renderRelated(document.querySelector('[data-qn-related]'), item, mode);
    wireBuyButton();
    document.dispatchEvent(new CustomEvent('qn:content-rendered'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  document.addEventListener('qn:content-loaded', render);
  document.addEventListener('qn:partials-loaded', function () { /* no-op; render already done */ });
})();
