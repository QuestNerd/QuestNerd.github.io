/*
 * QuestNerd — content loader.
 *
 * Discovers content authored via the /admin/ (Decap CMS) browser UI and
 * merges it into window.QN_PRODUCTS / window.QN_PROJECTS so it appears
 * on the site within seconds of being published.
 *
 * Discovery happens in two passes:
 *
 *   1. Try a hand-maintained `content/<collection>/index.json`. Two shapes
 *      are supported:
 *        a) [ { id, type, title, ... }, ... ]  — full inline records
 *        b) [ "slug-a.json", "slug-b.json" ]  — list of filenames to fetch
 *
 *   2. If no index file exists, fall back to the public GitHub Contents API
 *      to list the directory, then fetch each `.json` file. The repo coords
 *      are read from QN_CONFIG.CONTENT_REPO (defaults to
 *      "QuestNerd/QuestNerd.github.io") and QN_CONFIG.CONTENT_BRANCH
 *      (default "main"). The API call is rate-limited to 60/hr/IP
 *      unauthenticated, but results are cached in sessionStorage so each
 *      visitor only hits it once per browsing session.
 *
 * Once the merge is done, a `qn:content-loaded` event is dispatched so
 * main.js / detail.js / search.js can re-render.
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

  function fromIndex(dir) {
    return fetchJson(dir + '/index.json').then(function (data) {
      if (!Array.isArray(data) || data.length === 0) return null;
      if (typeof data[0] === 'object') return data;
      return Promise.all(data.map(function (name) { return fetchJson(dir + '/' + name); }))
        .then(function (arr) { return arr.filter(Boolean); });
    });
  }

  function fromGithubApi(dir) {
    var cfg = window.QN_CONFIG || {};
    var repo = (cfg.CONTENT_REPO || 'QuestNerd/QuestNerd.github.io').trim();
    var branch = (cfg.CONTENT_BRANCH || 'main').trim();
    // Validate `owner/repo` strictly. GitHub usernames allow alphanumerics +
    // hyphens; repository names additionally allow dots and underscores. We
    // also explicitly reject any segment that contains `..` so a tampered
    // config.js can't construct a path-traversal payload.
    if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(repo) || repo.indexOf('..') !== -1) return Promise.resolve([]);
    // Branch names can contain slashes (e.g. "feature/foo") but must not
    // start with a dot or contain `..` per git-check-ref-format(1).
    if (!/^[A-Za-z0-9._\-\/]+$/.test(branch) || branch.indexOf('..') !== -1 || branch.charAt(0) === '.') return Promise.resolve([]);
    var cacheKey = 'qn_content:' + repo + ':' + branch + ':' + dir;
    var cached = null;
    try { cached = sessionStorage.getItem(cacheKey); } catch (e) {}
    if (cached) {
      try { return Promise.resolve(JSON.parse(cached)); } catch (e) {}
    }
    var api = 'https://api.github.com/repos/' + repo + '/contents/' + dir + '?ref=' + encodeURIComponent(branch);
    return fetch(api, { headers: { 'Accept': 'application/vnd.github.v3+json' }, credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error('GitHub API ' + r.status); return r.json(); })
      .then(function (entries) {
        if (!Array.isArray(entries)) return [];
        var jsons = entries.filter(function (e) {
          return e && e.type === 'file' && /\.json$/i.test(e.name) && e.name !== 'index.json';
        });
        return Promise.all(jsons.map(function (e) {
          // Prefer the repo-relative path so we hit the same CDN as the site,
          // and so this works on GitHub Pages preview branches.
          return fetchJson(dir + '/' + e.name);
        }));
      })
      .then(function (items) {
        var clean = (items || []).filter(Boolean);
        try { sessionStorage.setItem(cacheKey, JSON.stringify(clean)); } catch (e) {}
        return clean;
      })
      .catch(function () { return []; });
  }

  function loadCollection(dir) {
    return fromIndex(dir).then(function (idx) {
      if (idx && idx.length) return idx;
      return fromGithubApi(dir);
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
