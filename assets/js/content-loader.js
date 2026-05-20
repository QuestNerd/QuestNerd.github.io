/*
 * QuestNerd — content loader.
 *
 * On every page, after `assets/js/products.js` and `assets/js/projects.js`
 * have populated `window.QN_PRODUCTS` and `window.QN_PROJECTS`, this loader
 * tries to fetch additional entries that Decap CMS wrote into:
 *
 *   /content/products/index.json   (array of product objects, OR an array
 *                                   of filenames to fetch individually)
 *   /content/projects/index.json   (same, for portfolio entries)
 *
 * Either index file is OPTIONAL. If missing, the legacy hard-coded arrays
 * still drive the site. If present, its entries are merged in (CMS entries
 * win on id collision).
 *
 * Why an index file? GitHub Pages can't list a directory over HTTP. Decap
 * CMS is configured (admin/config.yml) to rewrite this index file whenever
 * a new product / project is added or removed.
 *
 * Once the merge is done we dispatch a `qn:content-rendered` event so other
 * scripts (main.js grid renderer, detail.js, search.js) can re-render.
 */
(function () {
  function fetchJson(url) {
    return fetch(url, { credentials: 'omit', cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); })
      .catch(function () { return null; });
  }

  function mergeById(base, extra) {
    var byId = {};
    (base || []).forEach(function (e) { if (e && e.id) byId[e.id] = e; });
    (extra || []).forEach(function (e) { if (e && e.id) byId[e.id] = e; });
    return Object.keys(byId).map(function (k) { return byId[k]; });
  }

  function loadCollection(dir) {
    return fetchJson(dir + '/index.json').then(function (data) {
      if (!data) return [];
      // Two supported shapes:
      //  1) [ { id, type, title, ... }, ... ]   — full inline
      //  2) [ "slug-a.json", "slug-b.json" ]   — list of filenames to fetch
      if (!Array.isArray(data)) return [];
      if (data.length === 0) return [];
      if (typeof data[0] === 'object') return data;
      return Promise.all(data.map(function (name) {
        return fetchJson(dir + '/' + name);
      })).then(function (arr) { return arr.filter(Boolean); });
    });
  }

  function init() {
    Promise.all([
      loadCollection('content/products'),
      loadCollection('content/projects')
    ]).then(function (results) {
      var cmsProducts = results[0] || [];
      var cmsProjects = results[1] || [];
      if (cmsProducts.length) {
        window.QN_PRODUCTS = mergeById(window.QN_PRODUCTS || [], cmsProducts);
      }
      if (cmsProjects.length) {
        window.QN_PROJECTS = mergeById(window.QN_PROJECTS || [], cmsProjects);
      }
      document.dispatchEvent(new CustomEvent('qn:content-loaded'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
