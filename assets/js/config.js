/*
 * QuestNerd — site configuration.
 *
 * This file is loaded by every page. Edit the placeholders below to wire up
 * Stripe Checkout and your external storefronts. NEVER put a Stripe secret
 * key in this file — only the publishable key (starts with `pk_`) is safe to
 * ship in client-side JavaScript.
 */

window.QN_CONFIG = {
  // -------- Stripe --------
  // TODO: replace with your live publishable key from
  // https://dashboard.stripe.com/apikeys (e.g. "pk_live_XXXXXXXX").
  // Use a test key (pk_test_...) while developing.
  STRIPE_PUBLISHABLE_KEY: 'pk_test_REPLACE_ME',

  // -------- External storefronts --------
  // TODO: paste your storefront URLs here. They are used by the
  // header/footer and by store-link buttons throughout the site.
  CULTS3D_URL: 'https://cults3d.com/en/users/QuestNerd', // TODO update
  ETSY_URL: 'https://www.etsy.com/shop/QuestNerd',       // TODO update
  GOOGLE_PLAY_URL: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO update

  // -------- Contact --------
  CONTACT_EMAIL: 'hello@questnerd.com', // TODO update

  // -------- Site metadata --------
  SITE_NAME: 'QuestNerd',
  SITE_TAGLINE: 'Print · Build · Play',
  CURRENT_YEAR: new Date().getFullYear(),
};
