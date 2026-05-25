/*
 * QuestNerd — portfolio data source (single source of truth for case studies).
 *
 * WordPress theme seed mirror for public, resume-safe project cards.
 */

window.QN_PROJECTS = [
  {
    id: 'questnerd-site-static-wordpress-parity',
    title: 'QuestNerd site: static storefront + WordPress parity',
    date: '2026-05',
    role: 'Solo engineer',
    summary: 'Built the QuestNerd site so the GitHub Pages version and the WordPress theme/plugin mirror share the same products, projects, styling, and storefront structure.',
    story:
      '<p>The site is intentionally more than a landing page. It carries product cards, model listings, portfolio case studies, downloads/tool previews, a MakerWorld print quote flow, a WordPress theme mirror, and a content plugin structure.</p>' +
      '<p>The practical win is portability: QuestNerd can run as a static GitHub Pages site while still keeping a WordPress path available for a future self-hosted store. The same visual language, data shape, and rendering behavior are mirrored across both stacks.</p>',
    image: 'assets/img/questnerd-mark.svg',
    duration: 'Ongoing build-out',
    tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages', 'WordPress'],
    outcome: 'A public storefront and portfolio that can ship static now and migrate cleanly later.',
    links: [
      { label: 'Static home page', url: 'index.html' },
      { label: 'WordPress migration notes', url: 'WORDPRESS_MIGRATION.md' },
      { label: 'WordPress theme mirror', url: 'wordpress/themes/questnerd/' },
    ],
    tags: ['web', 'wordpress', 'github-pages', 'storefront', 'portfolio'],
  },
  {
    id: 'cults3d-model-storefront',
    title: 'Cults3D model storefront under QuestNerd',
    date: '2026-05',
    role: 'Designer, maker, storefront operator',
    summary: 'Replaced generic placeholder models with QuestNerd model/storefront cards, including practical prints and product stories.',
    story:
      '<p>The model section now reflects the actual direction of QuestNerd: practical prints, toy-storage helpers, wearable accessory experiments, and storefront links that point visitors to the QuestNerd Cults3D presence.</p>' +
      '<p>One example is the Magnetic Tile Storage Organizer with Accessory Bin — Mini Version, which turns toy cleanup into a designed storage object instead of a pile of loose pieces.</p>',
    image: 'assets/img/questnerd-mark.svg',
    duration: 'Active storefront build-out',
    tech: ['3D modeling', 'FDM printing', 'Cults3D', 'Product copywriting'],
    outcome: 'Real model/story cards now appear in the shop, models page, and featured home-page sections.',
    links: [
      { label: '3D Models page', url: 'models.html' },
      { label: 'QuestNerd Cults3D profile', url: 'https://cults3d.com/en/users/QuestNerd' },
      { label: 'Magnetic tile organizer listing', url: 'https://cults3d.com/en/3d-model/home/magnetic-tile-storage-organizer-with-accessory-bin-mini-version-magnet-tile' },
    ],
    tags: ['3d-printing', 'cults3d', 'product-design', 'maker-business'],
  },
  {
    id: 'makerworld-print-quote-flow',
    title: 'MakerWorld custom print quote flow',
    date: '2026-05',
    role: 'Product designer and site builder',
    summary: 'Built a structured quote flow for visitors who find a MakerWorld model and want QuestNerd to print it without a messy back-and-forth message thread.',
    story:
      '<p>The flow turns an open-ended custom-print request into a guided workflow: paste the model link, choose print options, understand the price factors, and move toward checkout once the job is clear.</p>' +
      '<p>That matters because custom 3D printing is full of hidden variables. The page makes the quoting logic visible enough for a customer while still keeping the maker workflow organized.</p>',
    image: 'assets/img/questnerd-mark.svg',
    duration: 'Site feature build-out',
    tech: ['HTML', 'CSS', 'JavaScript', '3D print quoting'],
    outcome: 'A customer-facing print request path now sits alongside the normal shop/model pages.',
    links: [
      { label: 'MakerWorld Prints page', url: 'makerworld-prints.html' },
      { label: 'Setup notes', url: 'MAKERWORLD_SETUP.md' },
    ],
    tags: ['3d-printing', 'makerworld', 'quote-flow', 'ecommerce'],
  },
  {
    id: 'skelepet-android-game',
    title: 'Skelepet: cozy skeleton pet Android game',
    date: '2026-04',
    role: 'Solo Android/game developer',
    summary: 'Designed a black-and-white Tamagotchi-style skeleton pet game with needs, minigames, Skelecoins, unlockables, and short daily play sessions.',
    story:
      '<p>Skelepet is a deliberately small game concept: a skeleton-head character starts in an egg, then grows through food, sleep, play, wellness checks, and tiny interactions.</p>' +
      '<p>The project is scoped around Android/Kotlin, low-framerate black-and-white visuals, simple navigation, and minigames like tic-tac-toe, hangman, and a slot machine.</p>',
    image: 'assets/img/questnerd-mark.svg',
    duration: 'Prototype / active development',
    tech: ['Kotlin', 'Android Studio', 'Game state loops', 'Pixel-style UI', 'Mobile UX'],
    outcome: 'A clear public game page and product card for the Skelepet concept, without claiming a finished store release.',
    links: [
      { label: 'Games page', url: 'games.html#skelepet' },
    ],
    tags: ['android', 'game', 'kotlin', 'skelepet', 'prototype'],
  },
  {
    id: 'bambu-filament-companion',
    title: 'Bambu Filament Manager Companion concept',
    date: '2026-04',
    role: 'Product workflow designer',
    summary: 'Outlined a desktop companion that tracks filament usage from print activity and keeps spool inventory current automatically.',
    story:
      '<p>The pain point is obvious to anyone printing often: slicers know how much filament a job uses, but spool inventory still tends to become a manual guessing game.</p>' +
      '<p>The companion app concept watches print starts, completions, cancellations, and usage values so remaining filament can be deducted consistently.</p>',
    image: 'assets/img/questnerd-mark.svg',
    duration: 'Concept to implementation planning',
    tech: ['Desktop workflow design', '3D printing operations', 'Inventory logic'],
    outcome: 'Added as a download/tool preview so the idea is visible without shipping an unfinished executable.',
    links: [
      { label: 'Downloads preview', url: 'downloads.html' },
      { label: 'Tools Lab', url: 'tools-lab.html' },
    ],
    tags: ['filament', 'inventory', 'desktop-tool', '3d-printing'],
  },
  {
    id: 'access-vba-operations',
    title: 'Microsoft Access / VBA production workflow tools',
    date: '2026-01',
    role: 'Database workflow developer',
    summary: 'Built practical Access/VBA workflow patterns for production forms, printer persistence, subform updates, record handling, and clean operator-facing behavior.',
    story:
      '<p>Some of the most useful software is not glamorous: it is the internal form that saves the record correctly, prints to the right device, updates the subform when the operator expects it, and stays maintainable.</p>',
    image: 'assets/img/questnerd-mark.svg',
    duration: 'Multi-project pattern library',
    tech: ['Microsoft Access', 'VBA', 'SQL-backed forms', 'Printer automation', 'Production workflows'],
    outcome: 'Added to the Downloads section as a preview-only operations toolbelt.',
    links: [
      { label: 'Access/VBA toolbelt preview', url: 'product.html?id=access-vba-toolbelt' },
    ],
    tags: ['access', 'vba', 'database', 'operations'],
  },
];
