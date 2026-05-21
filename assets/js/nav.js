/*
 * QuestNerd — mobile menu toggle.
 * Wires up the `.menu-toggle` button to toggle the `.main-nav.open` class.
 * Runs on DOMContentLoaded AND after partials are injected (qn:partials-loaded).
 */
(function () {
  function wire() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav || toggle.__qnWired) return;
    toggle.__qnWired = true;
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      nav.classList.toggle('open');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
  document.addEventListener('qn:partials-loaded', wire);
})();
