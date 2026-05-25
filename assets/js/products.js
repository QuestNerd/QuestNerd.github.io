/*
 * QuestNerd — single source of truth for every product/listing on the site.
 *
 * These are public-facing cards only. Checkout/download links can stay disabled
 * until the live packages and storefront listings are ready.
 */

window.QN_PRODUCTS = [
  // -------- 3D Models — Cults3D (digital downloads) --------
  {
    id: 'magnetic-tile-storage-organizer-mini',
    type: 'cults3d',
    title: 'Magnetic Tile Storage Organizer with Accessory Bin — Mini Version',
    description: 'A QuestNerd Cults3D model for turning loose magnetic tiles and accessories into a clean, kid-friendly storage-and-play setup.',
    longDescription:
      'This is the kind of practical toy-room print QuestNerd is built around: a useful object that also looks intentional enough to leave out. ' +
      'The organizer is designed for magnetic tile play sets, with a mini footprint, accessory storage, and a layout that keeps the pieces easy to grab instead of buried in a bin.',
    story:
      'The design started from a real-world problem: magnetic tiles are fun until the cleanup turns into a pile of mixed pieces, accessories, and half-built ideas. ' +
      'The goal was to make storage feel like part of the toy rather than a punishment after playtime.',
    specs: [
      { label: 'Category', value: 'Home / toy storage' },
      { label: 'Use case', value: 'Magnetic tile organization and accessory sorting' },
      { label: 'Storefront', value: 'Cults3D listing under QuestNerd' },
    ],
    image: 'assets/img/questnerd-mark.svg',
    price: 'View on Cults3D',
    url: 'https://cults3d.com/en/3d-model/home/magnetic-tile-storage-organizer-with-accessory-bin-mini-version-magnet-tile',
    featured: true,
    tags: ['cults3d', 'magnetic tiles', 'toy storage', 'organizer', 'kids', '3d-printing'],
    faq: [
      { q: 'Is this a physical product?', a: 'This listing points to the digital Cults3D model. Physical-print options can be handled separately through the shop or contact form.' },
      { q: 'Why is it on the QuestNerd site too?', a: 'The site keeps the portfolio, shop cards, and external storefront links in one place so visitors can see the work without hunting across platforms.' },
    ],
  },
  {
    id: 'viture-xr-light-blocker',
    type: 'cults3d',
    title: 'VITURE XR Glasses Light Blocker / Nose-Piece Fit Project',
    description: 'A practical QuestNerd wearable-accessory model focused on blocking more light and improving the fit around XR glasses.',
    longDescription:
      'A small utility print can make expensive hardware feel dramatically better. This model project focuses on improving the light-blocking and nose-area fit around VITURE-style XR glasses without making the accessory bulky or flashy.',
    story:
      'The design challenge was not just “make a cover.” It had to block more light, respect the glasses geometry, avoid interfering with the wearable, and still be printable without turning into a fragile support nightmare.',
    specs: [
      { label: 'Category', value: 'Wearable accessory / XR comfort' },
      { label: 'Design focus', value: 'Light blocking, nose fit, printability' },
      { label: 'Status', value: 'QuestNerd model project / storefront profile item' },
    ],
    image: 'assets/img/questnerd-mark.svg',
    price: 'View QuestNerd on Cults3D',
    url: 'https://cults3d.com/en/users/QuestNerd',
    featured: true,
    tags: ['cults3d', 'viture', 'xr glasses', 'accessory', 'light blocker', '3d-printing'],
  },
  {
    id: 'questnerd-cults3d-profile',
    type: 'cults3d',
    title: 'QuestNerd Cults3D Model Profile',
    description: 'The central Cults3D profile for QuestNerd model drops, functional prints, accessories, and experiment releases.',
    longDescription:
      'Some models deserve their own product card, and some are better browsed directly from the storefront. This profile card keeps the QuestNerd Cults3D presence visible from the main shop, model page, and home-page feature grid.',
    story:
      'The point of the profile card is simple: when a model listing changes, the site still gives visitors one reliable place to jump into the current QuestNerd storefront.',
    specs: [
      { label: 'Storefront', value: 'Cults3D' },
      { label: 'Creator name', value: 'QuestNerd' },
      { label: 'Content type', value: 'Digital 3D-printable models' },
    ],
    image: 'assets/img/questnerd-mark.svg',
    price: 'Browse profile',
    url: 'https://cults3d.com/en/users/QuestNerd',
    featured: false,
    tags: ['cults3d', 'questnerd', 'stl', '3d models', 'digital downloads'],
  },

  // -------- Physical prints / service cards --------
  {
    id: 'makerworld-print-request',
    type: 'etsy',
    title: 'Custom 3D Print Request / MakerWorld Quote Flow',
    description: 'A quote flow for people who find a MakerWorld model and want QuestNerd to print it cleanly instead of guessing settings themselves.',
    longDescription:
      'This is not a generic “send me a file” form. The quote flow is built around the actual print variables that matter: model URL, filament, material, quality tier, size, and checkout handoff.',
    story:
      'The idea came from a common customer problem: people can find models they love, but they do not always own a printer or know which filament/settings make sense. The flow turns that into a structured request instead of a messy message thread.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Quote flow',
    url: 'makerworld-prints.html',
    featured: true,
    tags: ['3d printing service', 'makerworld', 'quote flow', 'custom print'],
  },

  // -------- Apps & Games --------
  {
    id: 'skelepet',
    type: 'googleplay',
    title: 'Skelepet',
    description: 'A black-and-white skeleton pet game prototype: tiny daily check-ins, needs, minigames, unlockables, and Skelecoins.',
    longDescription:
      'Skelepet is a Tamagotchi-style Android game built around a skeleton-head character that starts in an egg, grows through care loops, and stays intentionally lightweight. ' +
      'The design uses low-framerate black-and-white charm, small daily actions, wellness stats, minigames, unlockable backgrounds, and a playful currency called Skelecoins.',
    story:
      'The goal is cozy instead of demanding: a little companion game that rewards consistency without punishing people for having a real life. The feature plan includes food, sleep, play, stats, settings, extras, tic-tac-toe, hangman, and a slot-machine minigame.',
    specs: [
      { label: 'Platform', value: 'Android prototype' },
      { label: 'Stack', value: 'Kotlin / Android Studio' },
      { label: 'Style', value: 'Black-and-white, 1 fps skeleton-pet charm' },
    ],
    image: 'assets/img/questnerd-mark.svg',
    price: 'In development',
    url: 'games.html#skelepet',
    featured: true,
    tags: ['game', 'android', 'kotlin', 'tamagotchi', 'skeleton', 'skelepet'],
    faq: [
      { q: 'Is Skelepet downloadable right now?', a: 'Not yet. This card is here as a public project preview while the game is in development.' },
      { q: 'What makes it different?', a: 'The focus is low-pressure daily interaction, readable retro visuals, and small minigames rather than aggressive streak mechanics.' },
    ],
  },
  {
    id: 'questnerd-game-lab',
    type: 'googleplay',
    title: 'QuestNerd Game Lab',
    description: 'A public home for small game prototypes, Android experiments, and mechanics that may become full releases.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Devlog',
    url: 'games.html',
    featured: false,
    tags: ['games', 'prototype', 'android', 'devlog'],
  },

  // -------- Tool previews (not downloadable yet) --------
  {
    id: 'bambu-filament-manager-companion',
    type: 'pc-download',
    title: 'Bambu Filament Manager Companion',
    description: 'A planned desktop companion that watches print usage and helps keep spool remaining amounts in sync instead of relying on manual updates.',
    longDescription:
      'Bambu Studio can show filament usage for a sliced job, but a practical shop needs that number to feed inventory automatically. This tool preview captures the workflow: sync spool data, observe started/stopped prints, deduct completed usage, and handle canceled prints by layer progress when possible.',
    story:
      'The tool exists because filament inventory is one of those tiny chores that becomes a big operational drag when you print often. The goal is to make the spool count update itself from real print activity.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Preview only',
    url: '#',
    files: [],
    featured: true,
    tags: ['bambu studio', 'filament manager', 'inventory', 'desktop tool', '3d printing'],
    faq: [
      { q: 'Can I download it?', a: 'Not yet. Downloads are intentionally disabled while the package is being built and tested.' },
      { q: 'What problem does it solve?', a: 'It turns slicer/print usage into spool inventory updates so remaining filament does not have to be guessed by hand.' },
    ],
  },
  {
    id: 'pwagent-director-hub',
    type: 'pc-download',
    title: 'PWAgent Director Hub',
    description: 'A local multi-agent development dashboard concept for turning app ideas into planned, coded, tested, and reviewed builds.',
    longDescription:
      'Director Hub is a local orchestration layer for autonomous development workflows: intake, spec, implementation, debugging, two-pass verification, and final review. It is designed around visible logs, explicit status, and a “single truth” document set so the work does not disappear into a black box.',
    story:
      'The useful part is not “AI writes code.” The useful part is making the process inspectable: roles, decisions, risks, task lists, CI gates, and live run reports that make it clear what happened and why.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Preview only',
    url: '#',
    files: [],
    featured: false,
    tags: ['ai dev tools', 'automation', 'pwa', 'local llm', 'developer tools'],
  },
  {
    id: 'ipfire-rules-audit-kit',
    type: 'pc-download',
    title: 'Firewall Rule Audit Kit',
    description: 'A practical checklist-style helper for reviewing rule order, source/destination scope, ports, and proof-of-connectivity before changing firewall configs.',
    longDescription:
      'Firewall work fails when assumptions are not checked. This kit is planned as a plain-language audit workflow: confirm connectivity first, identify rule order, verify source/destination direction, document ports, and capture what each rule is supposed to prove.',
    story:
      'It grew out of real troubleshooting where one wrong assumption about traffic direction can waste hours. The workflow forces the boring checks to happen first.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Preview only',
    url: '#',
    files: [],
    featured: false,
    tags: ['firewall', 'ipfire', 'networking', 'audit', 'checklist'],
  },
  {
    id: 'access-vba-toolbelt',
    type: 'pc-download',
    title: 'Access/VBA Operations Toolbelt',
    description: 'Small, practical Microsoft Access helpers for forms, printing, record updates, and production-floor workflows.',
    longDescription:
      'A collection of hard-won Access/VBA patterns: explicit record saves, printer selection persistence, subform refresh timing, record deletion commands, and tidy code that avoids ambiguous references.',
    story:
      'These helpers come from production-style database work where the form has to behave correctly for real users, not just work once on the developer machine.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Preview only',
    url: '#',
    files: [],
    featured: false,
    tags: ['microsoft access', 'vba', 'database', 'operations', 'printing'],
  },

  // -------- Premium placeholders (checkout disabled) --------
  {
    id: 'systems-rescue-playbook',
    type: 'stripe',
    title: 'Systems Rescue Playbook',
    description: 'A future paid playbook for PC setup, remote-access fixes, network checks, backups, and practical troubleshooting workflows.',
    longDescription:
      'This is a placeholder for a polished, paid troubleshooting playbook. It is listed for portfolio visibility only; checkout is disabled until the product is real, reviewed, and ready.',
    image: 'assets/img/questnerd-mark.svg',
    price: 'Waitlist',
    stripePriceId: '',
    files: [],
    tags: ['pc setup', 'troubleshooting', 'systems', 'playbook', 'premium'],
  },
];
