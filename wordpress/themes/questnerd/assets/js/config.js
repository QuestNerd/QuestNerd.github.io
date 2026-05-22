/*
 * QuestNerd — site configuration.
 *
 * This file is loaded by every page. Edit the placeholders below to wire up
 * Stripe Checkout, your external storefronts, the newsletter, and analytics.
 * NEVER put a Stripe secret key in this file — only the publishable key
 * (starts with `pk_`) is safe to ship in client-side JavaScript.
 */

window.QN_CONFIG = {
  // -------- Site metadata --------
  SITE_NAME: 'QuestNerd',
  SITE_TAGLINE: 'Print · Build · Play',
  SITE_URL: 'https://www.questnerd.com', // absolute URL used for og:image, sitemap, etc.
  OG_IMAGE: 'assets/img/og-image.svg',   // relative URL — resolved against SITE_URL for absolute meta tags
  CURRENT_YEAR: new Date().getFullYear(),

  // -------- Stripe --------
  // TODO: replace with your live publishable key from
  // https://dashboard.stripe.com/apikeys (e.g. "pk_live_XXXXXXXX").
  // Use a test key (pk_test_...) while developing.
  STRIPE_PUBLISHABLE_KEY: 'pk_test_REPLACE_ME',

  // -------- External storefronts --------
  // TODO: paste your storefront URLs here.
  CULTS3D_URL: 'https://cults3d.com/en/users/QuestNerd', // TODO update
  ETSY_URL: 'https://www.etsy.com/shop/QuestNerd',       // TODO update
  GOOGLE_PLAY_URL: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO update

  // -------- Contact --------
  CONTACT_EMAIL: 'hello@questnerd.com', // TODO update

  // -------- MakerWorld print service --------
  // Optional webhook that receives a POST with the full order details
  // (chosen tier, filament, makerworld.com URL, totals, timestamp) the
  // moment a buyer clicks "Place order & pay" — *before* they get
  // handed off to Stripe. Use a free Formspree, Zapier, or Make.com
  // webhook so the URL lands in your inbox even if Stripe's
  // seller-receipt doesn't include the client_reference_id field.
  //
  // Example: 'https://formspree.io/f/XXXXXXXX'
  // Leave empty to skip the webhook (Stripe's dashboard + receipt
  // still encode the URL via client_reference_id).
  MAKERWORLD_NOTIFY_URL: '',

  // -------- Newsletter --------
  // Submit the home-page signup form to one of the providers below.
  //   - Formspree:   'https://formspree.io/f/XXXXXXXX'
  //   - Buttondown:  'https://buttondown.email/api/emails/embed-subscribe/<username>'
  //   - Mailchimp:   'https://<dc>.list-manage.com/subscribe/post?u=...&id=...'
  //   - ConvertKit:  'https://app.convertkit.com/forms/<formId>/subscriptions'
  // Leave empty ('') to keep the form in "not configured yet" mode.
  NEWSLETTER_ACTION: '', // TODO set to your provider's form action URL
  NEWSLETTER_PROVIDER: '', // optional: 'formspree' | 'mailchimp' | 'buttondown' | 'convertkit'

  // -------- Analytics --------
  // Privacy-friendly Plausible analytics. Set ANALYTICS_DOMAIN to your bare
  // domain (e.g. 'questnerd.com') to enable. Leave empty to disable.
  // Self-hosted Plausible? Override ANALYTICS_SRC.
  ANALYTICS_DOMAIN: '', // TODO e.g. 'questnerd.com' to enable Plausible
  ANALYTICS_SRC: 'https://plausible.io/js/script.js',
};
