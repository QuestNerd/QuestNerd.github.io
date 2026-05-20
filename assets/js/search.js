/*
 * QuestNerd — client-side search (Lunr).
 *
 * Lightweight in-memory search index over QN_PRODUCTS + QN_PROJECTS + a
 * static list of site pages. Surfaced via the header search icon (which
 * toggles an overlay). Lunr is loaded from a CDN the first time the
 * overlay opens, so the rest of the site has zero baseline cost.
 */
(function () {
  var LUNR_URL = 'https://cdn.jsdelivr.net/npm/lunr@2.3.9/lunr.min.js';
  var lunrPromise = null;
  var indexPromise = null;
  var STATIC_DOCS = [
    { id: 'page:home',       title: 'Home',           url: 'index.html',           body: 'QuestNerd home 3D prints apps games' },
    { id: 'page:shop',       title: 'Shop',           url: 'shop.html',            body: 'Shop all products catalog' },
    { id: 'page:models',     title: '3D Models',      url: 'models.html',          body: 'Digital STL OBJ 3D printable models Cults3D Etsy' },
    { id: 'page:apps',       title: 'Apps & Games',   url: 'apps.html',            body: 'Android apps games Google Play' },
    { id: 'page:downloads',  title: 'PC Downloads',   url: 'downloads.html',       body: 'PC downloads free paid Stripe tools software' },
    { id: 'page:portfolio',  title: 'Portfolio',      url: 'portfolio.html',       body: 'Portfolio case studies projects' },
    { id: 'page:about',      title: 'About',          url: 'about.html',           body: 'About QuestNerd creator workshop' },
    { id: 'page:contact',    title: 'Contact',        url: 'contact.html',         body: 'Contact email QuestNerd' },
  ];

  function loadLunr() {
    if (lunrPromise) return lunrPromise;
    lunrPromise = new Promise(function (resolve, reject) {
      if (window.lunr) return resolve(window.lunr);
      var s = document.createElement('script');
      s.src = LUNR_URL;
      s.onload = function () { resolve(window.lunr); };
      s.onerror = function () { reject(new Error('Failed to load Lunr.')); };
      document.head.appendChild(s);
    });
    return lunrPromise;
  }

  function gatherDocs() {
    var docs = STATIC_DOCS.slice();
    (window.QN_PRODUCTS || []).forEach(function (p) {
      docs.push({
        id: 'product:' + p.id,
        title: p.title || '',
        url: 'product.html?id=' + encodeURIComponent(p.id || ''),
        kind: 'Product',
        body: [p.description, p.longDescription, p.story, (p.tags || []).join(' ')].filter(Boolean).join(' ')
      });
    });
    (window.QN_PROJECTS || []).forEach(function (p) {
      docs.push({
        id: 'project:' + p.id,
        title: p.title || '',
        url: 'project.html?id=' + encodeURIComponent(p.id || ''),
        kind: 'Project',
        body: [p.summary, p.story, p.outcome, (p.tech || []).join(' '), (p.tags || []).join(' ')].filter(Boolean).join(' ')
      });
    });
    return docs;
  }

  function buildIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = loadLunr().then(function (lunr) {
      var docs = gatherDocs();
      var docMap = {};
      var idx = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 5 });
        this.field('body');
        docs.forEach(function (d) { docMap[d.id] = d; this.add(d); }, this);
      });
      return { idx: idx, docs: docMap };
    });
    return indexPromise;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function renderResults(overlay, query) {
    var out = overlay.querySelector('.qn-search-results');
    if (!query || query.length < 2) { out.innerHTML = '<p class="meta">Type at least 2 characters…</p>'; return; }
    out.innerHTML = '<p class="meta">Searching…</p>';
    buildIndex().then(function (b) {
      try {
        var hits = b.idx.search(query + '*').slice(0, 20);
        if (!hits.length) { out.innerHTML = '<p class="meta">No results for &ldquo;' + escapeHtml(query) + '&rdquo;.</p>'; return; }
        out.innerHTML = '<ul class="qn-search-hits">' + hits.map(function (h) {
          var d = b.docs[h.ref];
          if (!d) return '';
          return '<li><a href="' + escapeHtml(d.url) + '">' +
            (d.kind ? '<span class="qn-hit-kind">' + escapeHtml(d.kind) + '</span> ' : '') +
            '<strong>' + escapeHtml(d.title) + '</strong></a></li>';
        }).join('') + '</ul>';
      } catch (e) {
        out.innerHTML = '<p class="meta">Search error: ' + escapeHtml(e.message || 'unknown') + '</p>';
      }
    }).catch(function (err) {
      out.innerHTML = '<p class="meta">Could not load search: ' + escapeHtml(err.message || 'unknown') + '</p>';
    });
  }

  function ensureOverlay() {
    var overlay = document.querySelector('.qn-search-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'qn-search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Site search');
    overlay.hidden = true;
    overlay.innerHTML = '' +
      '<div class="qn-search-panel">' +
        '<div class="qn-search-bar">' +
          '<input type="search" class="qn-search-input" placeholder="Search products, projects, pages…" autocomplete="off" aria-label="Search query">' +
          '<button type="button" class="qn-search-close" aria-label="Close search">&times;</button>' +
        '</div>' +
        '<div class="qn-search-results"><p class="meta">Type at least 2 characters…</p></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.qn-search-input');
    var close = overlay.querySelector('.qn-search-close');
    var timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      timer = setTimeout(function () { renderResults(overlay, q); }, 120);
    });
    function shut() { overlay.hidden = true; document.body.classList.remove('qn-search-open'); }
    close.addEventListener('click', shut);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) shut(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) shut();
    });
    return overlay;
  }

  function open() {
    var overlay = ensureOverlay();
    overlay.hidden = false;
    document.body.classList.add('qn-search-open');
    var input = overlay.querySelector('.qn-search-input');
    setTimeout(function () { input.focus(); }, 0);
    // Warm the index.
    buildIndex().catch(function () {});
  }

  function wireTriggers() {
    document.querySelectorAll('[data-qn-search-open]').forEach(function (btn) {
      if (btn.__qnWired) return;
      btn.__qnWired = true;
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    // Keyboard shortcut: "/" focuses search if not in an input.
    if (!document.__qnSearchKey) {
      document.__qnSearchKey = true;
      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && !/^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '')) {
          e.preventDefault();
          open();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireTriggers);
  } else {
    wireTriggers();
  }
  document.addEventListener('qn:partials-loaded', wireTriggers);

  window.QN_SEARCH = { open: open };
})();
