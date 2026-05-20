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
 * Full schema (all optional unless noted):
 *
 *   id              (required) URL-safe slug, used in `product.html?id=…`
 *   type            (required) one of the values above
 *   title           (required) human-readable name
 *   description     short blurb shown on cards (1–2 sentences)
 *   longDescription full HTML/markdown-ish blurb for the detail page
 *   story           "behind the scenes" narrative for the detail page
 *   specs           array of { label, value } pairs (dimensions, file size…)
 *   image           main thumbnail (used on cards + detail hero)
 *   images          array of additional image URLs (gallery on detail page)
 *   price           display price string ("$8.00", "Free")
 *   featured        bool — also surface on the home page
 *   url             outbound link for non-Stripe types
 *   stripePriceId / stripeLink — for `type: 'stripe'`
 *   model           path to a `.glb` / `.gltf` file — enables an interactive
 *                   3D preview on the detail page (and a "3D" badge on cards)
 *   files           array of { name, url, size } — downloadable files shown
 *                   on the detail page for pc-download / stripe items
 *   faq             array of { q, a } — surfaced as a JSON-LD FAQ block and
 *                   rendered visually on the detail page
 *   tags            free-form tags (used by search + related-items)
 *
 * To add a new item, copy one of the entries below and edit the fields.
 * Only this file needs to change — every page renders from it. Or use the
 * browser admin UI at /admin/ (Decap CMS) to add items via a form; new entries
 * are written to /content/products/*.json and loaded automatically.
 */

window.QN_PRODUCTS = [
  // -------- 3D Models — Cults3D (digital downloads) --------
  {
    id: 'dragon-mini',
    type: 'cults3d',
    title: 'Tabletop Dragon Miniature',
    description: 'Highly detailed dragon miniature, pre-supported STL — perfect for tabletop RPGs.',
    longDescription:
      'A finely-detailed tabletop dragon miniature designed for 28mm and 32mm scale gaming. ' +
      'The STL ships pre-supported and split into print-friendly chunks, so a single resin ' +
      'printer can turn out a battle-ready mini in a few hours.',
    story:
      'I designed this dragon after a frustrating session where every off-the-shelf mini was either ' +
      'too small to read across the table or required nightmare supports. The pose was iterated 14 ' +
      'times in Blender before it printed cleanly without sagging wings.',
    specs: [
      { label: 'Scale', value: '28mm / 32mm' },
      { label: 'Files', value: 'STL (pre-supported) + raw OBJ' },
      { label: 'Print time', value: '~3h on resin (0.05mm)' },
    ],
    image: 'assets/img/questnerd-mark.svg',
    images: [],
    model: 'assets/models/sample-cube.glb', // TODO replace with the real dragon .glb
    price: '$8.00',
    url: 'https://cults3d.com/en/users/QuestNerd', // TODO replace with listing URL
    featured: true,
    tags: ['miniature', 'tabletop', 'rpg', 'dragon', 'resin'],
    faq: [
      { q: 'What scale is it?', a: '28mm / 32mm, suitable for D&D, Pathfinder, Frostgrave, and similar.' },
      { q: 'Do I need supports?', a: 'No — the STL ships pre-supported for resin printers.' },
    ],
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
    tags: ['keychain', 'articulated', 'print-in-place', 'mech'],
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
    tags: ['desk', 'organizer', 'modular', 'physical-print'],
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
    tags: ['planter', 'low-poly', 'home-decor'],
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
    tags: ['game', 'roguelike', 'godot', 'pixel-art'],
  },
  {
    id: 'printpal',
    type: 'googleplay',
    title: 'PrintPal',
    description: 'Companion app for managing 3D print queues across multiple printers.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Free',
    url: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO replace with app URL
    tags: ['app', 'utility', '3d-printing'],
  },
  {
    id: 'nerdnotes',
    type: 'googleplay',
    title: 'NerdNotes',
    description: 'Minimalist note-taking PWA with end-to-end sync.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Free',
    url: 'https://play.google.com/store/apps/dev?id=QuestNerd', // TODO replace with app URL
    tags: ['app', 'notes', 'pwa'],
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
    files: [
      // { name: 'QuestNerd-Cura.curaprofile', url: 'downloads/QuestNerd-Cura.curaprofile', size: '12 KB' },
      // { name: 'QuestNerd-PrusaSlicer.ini',  url: 'downloads/QuestNerd-PrusaSlicer.ini',  size: '9 KB' },
    ],
    tags: ['slicer', 'presets', 'free'],
  },

  // -------- PC downloads (paid, via Stripe Checkout) --------
  {
    id: 'pro-tool',
    type: 'stripe',
    title: 'QuestNerd Pro Tool',
    description: 'Pro-grade utility for 3D print pipeline automation. One-time purchase.',
    longDescription:
      'QuestNerd Pro Tool watches your slicer output folder, validates every G-code file ' +
      'against your printer\'s firmware, and pushes successful builds into a queue ready ' +
      'for OctoPrint or Klipper. Windows, macOS, and Linux builds included.',
    image: 'assets/img/questnerd-mark.svg',
    price: '$19.00',
    // Provide ONE of the following:
    //   stripePriceId: 'price_XXXXXXXX'  // from Stripe dashboard → Products → Prices
    //   stripeLink:    'https://buy.stripe.com/XXXXXXXX' // a Stripe Payment Link
    stripePriceId: 'price_REPLACE_ME', // TODO replace with a real price ID
    // stripeLink: 'https://buy.stripe.com/REPLACE_ME', // optional alternative
    files: [
      // After purchase, files are delivered by Stripe receipt. List "what you
      // get" here so buyers see the contents up front:
      // { name: 'QuestNerd-Pro-Tool-1.0-win.zip',   size: '24 MB' },
      // { name: 'QuestNerd-Pro-Tool-1.0-mac.dmg',   size: '28 MB' },
      // { name: 'QuestNerd-Pro-Tool-1.0-linux.tar.gz', size: '22 MB' },
    ],
    faq: [
      { q: 'Which platforms?', a: 'Windows 10+, macOS 12+, and Linux (x86_64).' },
      { q: 'Does it support Klipper?', a: 'Yes — Klipper and OctoPrint are both supported out of the box.' },
      { q: 'Is there a free trial?', a: 'Not yet — but the slicer presets above are free and demonstrate the core checks.' },
    ],
    tags: ['software', 'tool', 'automation', '3d-printing', 'paid'],
  },
];
