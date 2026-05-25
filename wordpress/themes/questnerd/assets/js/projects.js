/*
 * QuestNerd — portfolio data source (single source of truth for case studies).
 *
 * Each entry describes a project shown on portfolio.html and on
 * `project.html?id=…` detail pages. Schema (all optional unless noted):
 *
 *   id            (required) URL-safe slug, used in `project.html?id=…`
 *   title         (required) human-readable project name
 *   date          ISO-like string (e.g. "2026-05") used for sorting + display
 *   role          your role on the project ("Lead engineer", "Solo dev"…)
 *   summary       short blurb for the card (1–2 sentences)
 *   story         long-form narrative — full case study (HTML allowed)
 *   image         cover image shown on cards + detail hero
 *   images        gallery (array of additional image URLs)
 *   moneySpent    free-form string ("$1,240", "Time, mostly")
 *   moneySaved    free-form string ("$8,000 / yr", "n/a")
 *   duration      how long the project took ("3 months", "90 days")
 *   tech          array of tech / tools used (also surfaced as JSON-LD keywords)
 *   outcome       1-line headline result ("Shipped to 1.4k installs in 30 days")
 *   links         array of { label, url } for live demos, repos, store pages…
 *   tags          free-form tags used by search + related-projects
 *
 * Add new projects either by hand here, or via the browser admin UI at
 * /admin/ (Decap CMS), which writes JSON files into /content/projects/ that
 * are auto-discovered at page load.
 */

window.QN_PROJECTS = [
  {
    id: 'print-on-demand-pipeline',
    title: 'Designing a print-on-demand pipeline',
    date: '2026-05',
    role: 'Solo engineer & operator',
    summary: 'How I scaled a single-printer hobby into a multi-machine queue with automated slicing and inventory.',
    story:
      '<p>The shop was bottlenecked by manual slicing and an inbox of "is it ready yet?" messages. ' +
      'I built a small pipeline that ingests orders from Etsy + Cults3D, slices STLs with consistent ' +
      'profiles, queues jobs across three printers, and emits a webhook when a build finishes so the ' +
      'storefront UI updates in real time.</p>' +
      '<p>The biggest win was idempotency: every job carries a content hash, so duplicate orders never ' +
      'reprint and printer crashes resume cleanly.</p>',
    image: 'assets/img/questnerd-mark.svg',
    images: [],
    moneySpent: '$640 (mostly resin + a Klipper toolhead)',
    moneySaved: '~12 hrs/week of manual slicing & queue juggling',
    duration: '6 weeks',
    tech: ['Python', 'PrusaSlicer CLI', 'Klipper', 'OctoPrint', 'SQLite', 'Webhooks'],
    outcome: 'Cut order-to-ship time from 4 days to 36 hours.',
    links: [
      { label: 'Workflow write-up', url: '/landing/print-pipeline.html' },
      { label: 'MakerWorld setup notes', url: '/MAKERWORLD_SETUP.md' },
    ],
    tags: ['3d-printing', 'automation', 'pipeline', 'devops'],
  },
  {
    id: 'godot-90-day-ship',
    title: 'Shipping a Godot game in 90 days',
    date: '2026-04',
    role: 'Solo dev',
    summary: 'Scope, tooling, and the brutal cut list that made Quest Runner ship on time.',
    story:
      '<p>Quest Runner started as a 7-day game jam and threatened to balloon into an open-ended ' +
      'roguelike. I scoped it to three biomes, eight bosses, and twenty relics, then wrote a ' +
      'cut-list every Friday — anything not strictly needed to make those numbers shipped to a ' +
      '"post-launch" branch and stopped blocking the release.</p>' +
      '<p>The thing I learned hardest: a publishable game has 70% less content than a fun game.</p>',
    image: 'assets/img/questnerd-mark.svg',
    images: [],
    moneySpent: '$120 (assets, sound, store fees)',
    moneySaved: 'n/a — first revenue project, broke even at ~480 sales',
    duration: '90 days',
    tech: ['Godot 4', 'GDScript', 'Aseprite', 'FMOD'],
    outcome: 'Shipped on time; 1.4k installs in the first 30 days.',
    links: [
      { label: 'Games page', url: '/games.html' },
    ],
    tags: ['gamedev', 'godot', 'roguelike', 'launch'],
  },
  {
    id: 'wp-to-static',
    title: 'From WordPress to fully static GitHub Pages',
    date: '2026-03',
    role: 'Solo engineer',
    summary: 'Why the QuestNerd site moved off PHP entirely, and how the green/black theme survived the port.',
    story:
      '<p>This repo now carries both a static build and a WordPress theme/plugin mirror so features can be developed once and migrated safely. ' +
      'Core storefront flows, theme assets, and content loaders were normalized across both stacks.</p>' +
      '<p>Proof is in the migration docs and mirrored theme files committed in this codebase.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: '$0',
    moneySaved: '~$240/yr in hosting + plugin fees',
    duration: '2 weekends',
    tech: ['HTML', 'CSS', 'Vanilla JS', 'Stripe Checkout', 'GitHub Pages'],
    outcome: 'Static + WordPress parity established with documented migration path.',
    links: [
      { label: 'WordPress migration plan', url: '/WORDPRESS_MIGRATION.md' },
      { label: 'Theme mirror (wordpress/themes/questnerd)', url: '/wordpress/themes/questnerd/' },
    ],
    tags: ['web', 'static', 'wordpress', 'migration'],
  },
  {
    id: 'maker-brand-in-public',
    title: 'Building a maker brand in public',
    date: '2026-02',
    role: 'Founder',
    summary: 'Lessons from running a Cults3D shop, an Etsy storefront, and a Google Play developer page side by side.',
    story:
      '<p>Three storefronts, one brand, and very different audiences. I document what worked, what ' +
      'didn\'t, and the small recurring rituals (Friday shipping day, monthly model drops) that kept ' +
      'the whole thing moving when I had a real job to do too.</p>',
    image: 'assets/img/questnerd-mark.svg',
    moneySpent: 'mostly time',
    moneySaved: 'n/a',
    duration: 'ongoing',
    tech: ['Cults3D', 'Etsy', 'Google Play', 'social'],
    outcome: 'Three revenue channels, none dependent on the others.',
    tags: ['brand', 'creator', 'storefronts'],
  },
];
