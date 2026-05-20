/*
 * QuestNerd — single source of truth for every product/listing on the site.
 *
 * Each entry has a `type` that controls where it shows up and how the
 * "Buy / View" button behaves:
 *
 *   type: 'cults3d'      → 3D model on Cults3D (digital download). Shown on
 *                          models.html and shop.html. `url` is the listing URL.
 *   type: 'etsy'         → physical 3D print sold on Etsy. Shown on
 *                          models.html and shop.html. `url` is the listing URL.
 *   type: 'googleplay'   → Android app on Google Play. Shown on apps.html and
 *                          shop.html. `url` is the Play Store listing URL.
 *   type: 'pc-download'  → free or hosted PC download. Shown on downloads.html.
 *                          `url` is a direct link to the file or external host.
 *   type: 'stripe'       → paid PC download sold via Stripe Checkout. Shown on
 *                          downloads.html (and shop.html). Provide
 *                          `stripePriceId` (e.g. "price_XXXXXXXX") OR a full
 *                          `stripeLink` (Stripe Payment Link URL).
 *
 * To add a new item, copy one of the entries below and edit the fields.
 * Only this file needs to change — every page renders from it.
 */

window.QN_PRODUCTS = [
  // -------- 3D Models — Cults3D (digital downloads) --------
  {
    id: 'dragon-mini',
    type: 'cults3d',
    title: 'Tabletop Dragon Miniature',
    description: 'Highly detailed dragon miniature, pre-supported STL — perfect for tabletop RPGs.',
    image: 'assets/img/questnerd-mark.svg',
    price: '$8.00',
    url: 'https://cults3d.com/en/users/QuestNerd', // TODO replace with listing URL
    featured: true,
  },
  {
    id: 'mech-keychain',
    type: 'cults3d',
    title: 'Articulated Mech Keychain',
    description: 'Print-in-place articulated mech keychain. No supports needed.',
    image: 'assets/img/questnerd-mark.svg',
    price: '$4.00',
    url: 'https://cults3d.com/en/users/QuestNerd', // TODO replace with listing URL
    featured: true,
  },

  // -------- Physical prints — Etsy --------
  {
    id: 'desk-organizer',
    type: 'etsy',
    title: 'Modular Desk Organizer',
    description: 'Hand-printed modular desk organizer. Stackable, customizable, ships worldwide.',
    image: 'assets/img/questnerd-mark.svg',
    price: '$32.00',
    url: 'https://www.etsy.com/shop/QuestNerd', // TODO replace with listing URL
    featured: true,
  },
  {
    id: 'planter-pot',
    type: 'etsy',
    title: 'Low-Poly Planter Pot',
    description: 'Eye-catching low-poly planter pot, printed in matte PLA. Drainage tray included.',
    image: 'assets/img/questnerd-mark.svg',
    price: '$18.00',
    url: 'https://www.etsy.com/shop/QuestNerd', // TODO replace with listing URL
    featured: true,
  },

  // -------- Apps — Google Play --------
  {
    id: 'quest-runner',
    type: 'googleplay',
    title: 'Quest Runner',
    description: 'A pixel-art roguelike built in Godot. Quick runs, deep builds, big bosses.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Free',
    url: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO replace with app URL
  },
  {
    id: 'printpal',
    type: 'googleplay',
    title: 'PrintPal',
    description: 'Companion app for managing 3D print queues across multiple printers.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Free',
    url: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO replace with app URL
  },
  {
    id: 'nerdnotes',
    type: 'googleplay',
    title: 'NerdNotes',
    description: 'Minimalist note-taking PWA with end-to-end sync.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Free',
    url: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO replace with app URL
  },

  // -------- PC downloads (free) --------
  {
    id: 'slicer-presets',
    type: 'pc-download',
    title: 'QuestNerd Slicer Presets',
    description: 'Curated Cura / PrusaSlicer profiles tuned for QuestNerd models.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Free',
    url: '#', // TODO replace with file URL (or place a file in /downloads/ and link to it)
  },

  // -------- PC downloads (paid, via Stripe Checkout) --------
  {
    id: 'pro-tool',
    type: 'stripe',
    title: 'QuestNerd Pro Tool',
    description: 'Pro-grade utility for 3D print pipeline automation. One-time purchase.',
    image: 'assets/img/questnerd-mark.svg',
    price: '$19.00',
    // Provide ONE of the following:
    //   stripePriceId: 'price_XXXXXXXX'  // from Stripe dashboard → Products → Prices
    //   stripeLink:    'https://buy.stripe.com/XXXXXXXX' // a Stripe Payment Link
    stripePriceId: 'price_REPLACE_ME', // TODO replace with a real price ID
    // stripeLink: 'https://buy.stripe.com/REPLACE_ME', // optional alternative
  },
];
