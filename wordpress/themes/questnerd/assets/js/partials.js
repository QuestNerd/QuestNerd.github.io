/*
 * QuestNerd — partial loader.
 *
 * Loads partials/header.html and partials/footer.html into elements with
 * `data-include="header"` / `data-include="footer"`. After insertion it
 * dispatches a `qn:partials-loaded` event so other scripts (e.g. nav.js,
 * main.js) can wire themselves up to freshly-injected DOM.
 */

(function () {
  function include(el) {
    var name = el.getAttribute('data-include');
    if (!name) return Promise.resolve();
    // Use repo-relative URLs so this works at the site root, under a
    // custom domain, and under any /branch/ preview path.
    return fetch('partials/' + name + '.html', { credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load partial: ' + name);
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      })
      .catch(function (err) {
        console.error('[QuestNerd partials]', err);
      });
  }

  function loadAll() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    return Promise.all(nodes.map(include)).then(function () {
      // Mark current page in nav.
      var path = window.location.pathname.split('/').pop() || 'index.html';
      var links = document.querySelectorAll('.main-nav a[href]');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href') || '';
        if (href === path || (path === '' && href === 'index.html')) {
          links[i].setAttribute('aria-current', 'page');
          var parent = links[i].parentElement;
          if (parent) parent.classList.add('current-menu-item');
        }
      }

      // Apply config-driven URLs/text to anything tagged data-config-*.
      var cfg = window.QN_CONFIG || {};
      document.querySelectorAll('[data-config-href]').forEach(function (a) {
        var key = a.getAttribute('data-config-href');
        if (cfg[key]) a.setAttribute('href', cfg[key]);
      });
      document.querySelectorAll('[data-config-text]').forEach(function (n) {
        var key = n.getAttribute('data-config-text');
        if (cfg[key] != null) n.textContent = String(cfg[key]);
      });
      document.querySelectorAll('[data-config-mailto]').forEach(function (a) {
        if (cfg.CONTACT_EMAIL) a.setAttribute('href', 'mailto:' + cfg.CONTACT_EMAIL);
      });

      document.dispatchEvent(new CustomEvent('qn:partials-loaded'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }
})();
