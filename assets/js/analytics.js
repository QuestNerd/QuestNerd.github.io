/*
 * QuestNerd — privacy-friendly analytics loader.
 *
 * Reads QN_CONFIG.ANALYTICS_DOMAIN; if set, injects the Plausible script tag.
 * Designed for Plausible (no cookies, no consent banner needed in most
 * jurisdictions). Override ANALYTICS_SRC in config.js for self-hosted.
 */
(function () {
  function init() {
    var cfg = window.QN_CONFIG || {};
    var domain = (cfg.ANALYTICS_DOMAIN || '').trim();
    var src = (cfg.ANALYTICS_SRC || 'https://plausible.io/js/script.js').trim();
    if (!domain) return;
    if (document.querySelector('script[data-qn-analytics]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = src;
    s.setAttribute('data-domain', domain);
    s.setAttribute('data-qn-analytics', '1');
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
