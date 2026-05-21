# QuestNerd.github.io

The official QuestNerd website — a pure static HTML/CSS/JS site served from
GitHub Pages at <https://questnerd.github.io> (and the custom domain in
[`CNAME`](CNAME)).

No build step, no server runtime, no PHP. Editing happens either by hand in
the JS data files, or through the browser admin UI at `/admin/` (Decap CMS,
see [`ADMIN.md`](ADMIN.md)).

## What's where

```
.
├── index.html             # Home page (hero, featured products, model-viewer demo, CTAs)
├── shop.html              # Full catalog
├── models.html            # 3D models (Cults3D + Etsy)
├── apps.html              # Android apps (Google Play)
├── downloads.html         # PC software/tools (free + Stripe paid)
├── makerworld-prints.html # MakerWorld print-and-ship service (4 hour tiers + filament picker)
├── portfolio.html         # Portfolio & case studies (data-driven)
├── product.html           # Per-item detail page (?id=…)
├── project.html           # Per-project detail page (?id=…)
├── about.html             # Creator info
├── contact.html           # Email + social/store links
├── success.html           # Stripe success (with order id + cross-sells)
├── cancel.html            # Stripe cancel page
├── 404.html               # Themed not-found page
├── privacy-policy.html    # Privacy policy
├── terms.html             # Terms of service
├── shipping-returns.html  # Shipping & returns
├── sitemap.xml            # Hand-maintained sitemap
├── robots.txt             # Robots / sitemap pointer
├── landing/               # Ad-traffic landing pages (no global nav, sticky CTA)
│   ├── _template.html
│   └── print-pipeline.html
├── admin/                 # Decap CMS browser admin UI
│   ├── index.html
│   └── config.yml
├── content/
│   ├── products/*.json    # Decap-authored product files (auto-discovered)
│   ├── projects/*.json    # Decap-authored portfolio files (auto-discovered)
│   ├── filaments/*.json   # Decap-authored filament colors for the MakerWorld service
│   └── settings/          # Singleton site settings (e.g. makerworld-print.json)
├── partials/
│   ├── header.html        # Shared header (loaded via fetch)
│   └── footer.html        # Shared footer
├── assets/
│   ├── css/style.css
│   ├── img/               # Logo SVGs + og:image
│   ├── models/            # Sample .glb for the model-viewer demo
│   ├── uploads/           # Decap CMS uploads land here
│   └── js/
│       ├── config.js          # Stripe key, storefronts, analytics, newsletter (EDIT THIS)
│       ├── products.js        # Legacy hand-edited product data (still works)
│       ├── projects.js        # Legacy hand-edited portfolio data
│       ├── makerworld-config.js # Defaults for the MakerWorld print service (tiers + filaments)
│       ├── makerworld.js      # MakerWorld order-form logic (validates URL, totals, Stripe)
│       ├── content-loader.js  # Merges /content/*.json files in at page load
│       ├── main.js            # Renders product/project grids, wires Stripe buttons
│       ├── detail.js          # Renders product/project detail pages + JSON-LD
│       ├── stripe-checkout.js # Stripe Checkout redirect helper
│       ├── newsletter.js      # Formspree/Buttondown/Mailchimp/ConvertKit handler
│       ├── search.js          # Lunr in-browser search ( "/" to open )
│       ├── utm.js             # First-touch UTM capture + propagation
│       ├── analytics.js       # Privacy-friendly Plausible loader
│       ├── partials.js        # Injects partials/header.html + footer.html
│       └── nav.js             # Mobile menu toggle
├── CNAME                  # Custom domain for GitHub Pages
├── .nojekyll              # Tells GitHub Pages NOT to run Jekyll on this repo
├── STRIPE_SETUP.md        # How to wire up Stripe Checkout
├── MAKERWORLD_SETUP.md    # How to configure the MakerWorld print-and-ship service
├── ADMIN.md               # How to use the /admin/ browser UI (Decap CMS)
└── README.md              # You are here
```

## Editing products & projects

You have **two equivalent ways** to add or change content. Pick whichever
you prefer; they coexist.

### 1. Browser admin UI (recommended)

Go to `/admin/`, log in with GitHub, and use the form-based UI. Each save
commits a JSON file to `content/products/` or `content/projects/` and any
uploads to `assets/uploads/`. New entries show up on the site within ~30s.

Full setup (OAuth, etc.) and per-field reference are in [`ADMIN.md`](ADMIN.md).

### 2. Hand-edit the JS files

[`assets/js/products.js`](assets/js/products.js) and
[`assets/js/projects.js`](assets/js/projects.js) are the legacy source of
truth. Adding an entry there works just as well — they load before
`content-loader.js` does, and the CMS entries are merged in on top.

### Product types

| `type`        | Appears on               | Click behavior |
| ------------- | ------------------------ | -------------- |
| `cults3d`     | `models.html`, `shop.html` | Outbound link to your Cults3D listing |
| `etsy`        | `models.html`, `shop.html` | Outbound link to your Etsy listing |
| `googleplay`  | `apps.html`, `shop.html`   | Outbound link to your Google Play listing |
| `pc-download` | `downloads.html`           | Direct download / link to file |
| `stripe`      | `downloads.html`, `shop.html` | Opens Stripe Checkout (see [`STRIPE_SETUP.md`](STRIPE_SETUP.md)) |

Mark anything `featured: true` to also surface it on the home page.

Set a `model` field (path to a `.glb` / `.gltf`) on any product to enable
an interactive 3D viewer on its detail page — and a "3D" badge on its card.

## Configuration

Open [`assets/js/config.js`](assets/js/config.js) and fill in:

- `STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key (`pk_test_…` /
  `pk_live_…`). See [`STRIPE_SETUP.md`](STRIPE_SETUP.md).
- `CULTS3D_URL`, `ETSY_URL`, `GOOGLE_PLAY_URL` — your storefront URLs.
- `CONTACT_EMAIL` — used by every `mailto:` link.
- `NEWSLETTER_ACTION` — Formspree / Buttondown / Mailchimp / ConvertKit URL.
- `ANALYTICS_DOMAIN` — set to your bare domain to enable Plausible.
- `SITE_URL` / `OG_IMAGE` — used by social share metadata.

> **NEVER commit a Stripe secret key (`sk_…`).** Only the publishable key is
> safe in client-side JavaScript.

## Ad-traffic landing pages

Strip-down pages designed for paid social / search traffic live in
[`landing/`](landing/). Start from [`landing/_template.html`](landing/_template.html);
[`landing/print-pipeline.html`](landing/print-pipeline.html) is a working
example. UTM parameters from the ad URL are captured by
[`utm.js`](assets/js/utm.js) and appended to outbound storefront and Stripe
links so attribution survives the redirect off-site.

## Stripe Checkout

Paid PC downloads use Stripe Checkout in **client-only mode**, which works
fine on GitHub Pages because Stripe hosts the checkout form itself. See
[`STRIPE_SETUP.md`](STRIPE_SETUP.md) for the step-by-step setup.

## Running locally

The header/footer are loaded via `fetch('partials/...')`, so you need a real
HTTP server (not `file://`):

```bash
python3 -m http.server 8000
# or:
npx serve .
```

Then open <http://localhost:8000>.

> The browser admin at `/admin/` requires GitHub OAuth, which won't work
> against `localhost`. Use the deployed site to author content.

## Deploying

This is a GitHub Pages **user site**, so any commit to the default branch is
automatically published to <https://questnerd.github.io>. The [`CNAME`](CNAME)
file points the site at the custom domain when configured in GitHub Pages
settings.

When you add a product in `/admin/`, the deploy is automatic — Decap commits
your edits straight to the default branch (or to a draft branch if the
editorial workflow is enabled in `admin/config.yml`).

## License

Site content © QuestNerd. The theme this site was ported from is licensed
under GPL-2.0-or-later (see the original
[QuestNerd/Questnerdweb](https://github.com/QuestNerd/Questnerdweb) repo).
