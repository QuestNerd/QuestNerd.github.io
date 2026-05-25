/*
 * QuestNerd — portfolio data source (single source of truth for case studies).
 *
 * Each entry describes a public, resume-safe project shown on portfolio.html
 * and on `project.html?id=…` detail pages.
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
      '<p>The practical win is portability: QuestNerd can run as a static GitHub Pages site while still keeping a WordPress path available for a future self-hosted store. The same visual language, data shape, and rendering behavior are mirrored across both stacks.</p>' +
      '<p><strong>Proof:</strong> this repository contains the static pages at the root and the matching WordPress theme/plugin under <code>wordpress/</code>.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: '$0 platform cost for the static side',
    moneySaved: 'Avoids being locked into one CMS or plugin stack',
    duration: 'Ongoing build-out',
    tech: ['HTML', 'CSS', 'Vanilla JS', 'GitHub Pages', 'WordPress theme', 'WordPress plugin', 'Stripe-ready structure'],
    outcome: 'A public portfolio/storefront that can ship static now and migrate to WordPress later without throwing away the work.',
    links: [
      { label: 'Static home page', url: 'index.html' },
      { label: 'WordPress migration notes', url: 'WORDPRESS_MIGRATION.md' },
      { label: 'WordPress theme mirror', url: 'wordpress/themes/questnerd/' },
      { label: 'WordPress content plugin', url: 'wordpress/plugins/questnerd-content/' },
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
      '<p>One example is the Magnetic Tile Storage Organizer with Accessory Bin — Mini Version, which turns toy cleanup into a designed storage object instead of a pile of loose pieces.</p>' +
      '<p>The point is not just publishing STLs. It is showing that the work starts from a real use case, considers printability, and gets packaged so someone else can actually use it.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: 'Mostly design and test-print time',
    moneySaved: 'Creates reusable product cards across static + WordPress',
    duration: 'Active storefront build-out',
    tech: ['3D modeling', 'FDM printing', 'Cults3D', 'Product copywriting', 'Responsive product cards'],
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
    moneySpent: '$0 beyond site build time',
    moneySaved: 'Cuts down on unstructured quote messages',
    duration: 'Site feature build-out',
    tech: ['HTML', 'CSS', 'JavaScript', 'Stripe-ready checkout flow', '3D print quoting'],
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
      '<p>The project is scoped around Android/Kotlin, low-framerate black-and-white visuals, simple navigation, and minigames like tic-tac-toe, hangman, and a slot machine. The important product decision is tone: cozy, funny, and low-pressure instead of demanding.</p>' +
      '<p>It belongs on the public portfolio because it shows product thinking, UI structure, game loops, and the ability to turn a weird concept into a buildable plan.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: 'Time and prototype work',
    moneySaved: 'n/a',
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
    role: 'Product architect / desktop workflow designer',
    summary: 'Outlined a desktop companion that tracks filament usage from Bambu Studio/print activity and keeps spool inventory current automatically.',
    story:
      '<p>The pain point is obvious to anyone printing often: slicers know how much filament a job uses, but spool inventory still tends to become a manual guessing game.</p>' +
      '<p>The companion app concept watches print starts, completions, cancellations, and usage values so remaining filament can be deducted consistently. For canceled prints, the plan accounts for partial progress instead of pretending the full job was used.</p>' +
      '<p>This is a strong portfolio story because it connects a real operator problem with automation, data sync, edge cases, and user trust.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: 'Design/prototype time',
    moneySaved: 'Reduces manual spool tracking and failed print planning',
    duration: 'Concept to implementation planning',
    tech: ['Desktop app design', 'Bambu Studio workflow', 'File/event watching', 'Inventory logic', '3D printing operations'],
    outcome: 'Added as a download/tool preview so the idea is visible without shipping an unfinished executable.',
    links: [
      { label: 'Downloads preview', url: 'downloads.html' },
      { label: 'Tools Lab', url: 'tools-lab.html' },
    ],
    tags: ['bambu', 'filament', 'inventory', 'desktop-tool', '3d-printing'],
  },
  {
    id: 'pwagent-director-hub',
    title: 'PWAgent Director Hub: local workflow orchestration',
    date: '2026-03',
    role: 'Systems designer / full-stack builder',
    summary: 'Designed a local dashboard concept that breaks complex app builds into intake, spec, implementation, debugging, repeat verification, and final review.',
    story:
      '<p>Director Hub is built around a simple belief: automation is only useful if the operator can see what happened. The workflow separates intake, spec, coding, debugging, verification, and final review into visible phases.</p>' +
      '<p>The architecture uses a local dashboard, role routing, project artifacts like <code>ROADMAP.md</code> and <code>DECISIONS.md</code>, and pass/fail gates before a project is considered done.</p>' +
      '<p>For a resume-style portfolio, it shows API design, local tooling, UI parity planning, error handling, and operational discipline.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: 'Local hardware and build time',
    moneySaved: 'Aims to reduce manual copy/paste development loops',
    duration: 'Ongoing platform project',
    tech: ['FastAPI', 'PWA', 'Docker', 'Local services', 'CI workflow design'],
    outcome: 'Documented as a tool preview and case study without exposing private infrastructure details.',
    links: [
      { label: 'Tools preview', url: 'downloads.html' },
    ],
    tags: ['developer-tools', 'docker', 'pwa', 'automation', 'workflow'],
  },
  {
    id: 'access-vba-operations',
    title: 'Microsoft Access / VBA production workflow tools',
    date: '2026-01',
    role: 'Database workflow developer',
    summary: 'Built practical Access/VBA workflow patterns for production forms, printer persistence, subform updates, record handling, and clean operator-facing behavior.',
    story:
      '<p>Some of the most useful software is not glamorous: it is the internal form that saves the record correctly, prints to the right device, updates the subform when the operator expects it, and does not break because a reference was ambiguous.</p>' +
      '<p>This project area captures those patterns as a public-safe toolbelt: explicit object qualification, minimal refreshes, reliable print selection, safe record operations, and comments that make maintenance easier later.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: 'Time and maintenance effort',
    moneySaved: 'Reduces repeated manual fixes and operator confusion',
    duration: 'Multi-project pattern library',
    tech: ['Microsoft Access', 'VBA', 'SQL-backed forms', 'Printer automation', 'Production workflows'],
    outcome: 'Added to the Downloads section as a preview-only operations toolbelt.',
    links: [
      { label: 'Access/VBA toolbelt preview', url: 'product.html?id=access-vba-toolbelt' },
    ],
    tags: ['access', 'vba', 'database', 'operations', 'automation'],
  },
];
