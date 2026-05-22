/*
 * QuestNerd — newsletter form handler.
 *
 * Looks for a form with `data-qn-newsletter` on the page. Wires it up to
 * QN_CONFIG.NEWSLETTER_ACTION. Supports four providers:
 *
 *   formspree   — JSON POST, expects { email }
 *   buttondown  — form POST to /embed-subscribe (no JS needed but we hijack
 *                 for inline success messaging)
 *   mailchimp   — opens in a new tab (Mailchimp doesn't allow XHR posts
 *                 without their JS SDK)
 *   convertkit  — JSON POST, expects { email_address }
 *
 * If NEWSLETTER_ACTION is empty, the form shows a "not configured yet"
 * message instead of submitting.
 */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  function setMessage(form, message, tone) {
    var msg = form.querySelector('.qn-newsletter-msg');
    if (!msg) return;
    msg.textContent = message;
    msg.hidden = false;
    msg.classList.remove('error', 'success');
    if (tone) msg.classList.add(tone);
  }

  function submitFormspree(form, action, email) {
    return fetch(action, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then(function (r) { if (!r.ok) throw new Error('Subscription failed.'); });
  }

  function submitConvertKit(form, action, email) {
    var fd = new FormData();
    fd.append('email_address', email);
    return fetch(action, { method: 'POST', body: fd })
      .then(function (r) { if (!r.ok) throw new Error('Subscription failed.'); });
  }

  function submitButtondown(form, action, email) {
    var fd = new FormData();
    fd.append('email', email);
    return fetch(action, { method: 'POST', body: fd, mode: 'no-cors' });
  }

  function openMailchimp(action, email) {
    var u = new URL(action);
    u.searchParams.set('EMAIL', email);
    window.open(u.toString(), '_blank', 'noopener');
  }

  function wire() {
    var forms = document.querySelectorAll('form[data-qn-newsletter]');
    if (!forms.length) return;
    var cfg = window.QN_CONFIG || {};
    var action = (cfg.NEWSLETTER_ACTION || '').trim();
    var provider = (cfg.NEWSLETTER_PROVIDER || '').toLowerCase();
    if (!provider && action) {
      var host = '';
      try { host = new URL(action).hostname.toLowerCase(); } catch (e) { host = ''; }
      if (host === 'formspree.io' || host.endsWith('.formspree.io')) provider = 'formspree';
      else if (host === 'buttondown.email' || host.endsWith('.buttondown.email')) provider = 'buttondown';
      else if (host === 'list-manage.com' || host.endsWith('.list-manage.com')) provider = 'mailchimp';
      else if (host === 'convertkit.com' || host.endsWith('.convertkit.com')) provider = 'convertkit';
    }

    forms.forEach(function (form) {
      if (form.__qnWired) return;
      form.__qnWired = true;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var email = (input && input.value || '').trim();
        if (!email) { setMessage(form, 'Please enter your email address.', 'error'); return; }
        if (!action) {
          setMessage(form, 'Newsletter is not configured yet. Set NEWSLETTER_ACTION in assets/js/config.js.', 'error');
          return;
        }
        setMessage(form, 'Subscribing…', '');
        var p;
        if (provider === 'mailchimp') { openMailchimp(action, email); setMessage(form, 'Opening Mailchimp signup in a new window — finish there to subscribe.', 'success'); return; }
        if (provider === 'convertkit') p = submitConvertKit(form, action, email);
        else if (provider === 'buttondown') p = submitButtondown(form, action, email);
        else p = submitFormspree(form, action, email);

        p.then(function () {
          form.reset();
          setMessage(form, 'You\'re on the list! Check your inbox to confirm.', 'success');
        }).catch(function () {
          setMessage(form, 'Something went wrong. Please try again or email us directly.', 'error');
        });
      });
    });
  }

  ready(wire);
  document.addEventListener('qn:partials-loaded', wire);
})();
