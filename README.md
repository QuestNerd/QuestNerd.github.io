# QuestNerd.github.io

The official QuestNerd website — a pure static HTML/CSS/JS site served from
GitHub Pages at <https://questnerd.github.io> (and the custom domain in
[`CNAME`](CNAME)).

This site replaces an older WordPress theme (preserved in the private
[`QuestNerd/Questnerdweb`](https://github.com/QuestNerd/Questnerdweb) repo).
The look-and-feel of that theme has been faithfully ported to plain HTML/CSS —
no PHP, no build step, no server runtime required.

## What's where

```
.
├── index.html             # Home page (hero, featured products, CTAs)
├── shop.html              # Full catalog
├── models.html            # 3D models (Cults3D + Etsy)
├── apps.html              # Android apps (Google Play)
├── downloads.html         # PC software/tools (free + Stripe paid)
├── portfolio.html         # Portfolio & case studies
├── about.html             # Creator info
├── contact.html           # Email + social/store links
├── success.html           # Stripe success page
├── cancel.html            # Stripe cancel page
├── 404.html               # Themed not-found page
├── privacy-policy.html    # Privacy policy
├── terms.html             # Terms of service
├── shipping-returns.html  # Shipping & returns
├── partials/
│   ├── header.html        # Shared header (loaded by every page via fetch)
│   └── footer.html        # Shared footer
├── assets/
│   ├── css/style.css      # Full site stylesheet (ported from the WP theme)
│   ├── js/
│   │   ├── config.js          # Stripe key + storefront URL placeholders (EDIT THIS)
│   │   ├── products.js        # SINGLE source of truth for every product (EDIT THIS)
│   │   ├── main.js            # Renders product grids, wires Stripe buttons
│   │   ├── stripe-checkout.js # Stripe Checkout redirect helper
│   │   ├── partials.js        # Injects partials/header.html + footer.html
│   │   └── nav.js             # Mobile menu toggle
│   └── img/                # Logo SVGs
├── CNAME                  # Custom domain for GitHub Pages
├── .nojekyll              # Tells GitHub Pages NOT to run Jekyll on this repo
├── STRIPE_SETUP.md        # How to wire up Stripe Checkout
└── README.md              # You are here
```

## Editing products

Every product, app, model and download is defined exactly once, in
[`assets/js/products.js`](assets/js/products.js). Every page renders a filtered
view of that one list, so to add or change an item you only edit that file.

Each entry has a `type` that controls where it appears:

| `type`        | Appears on               | Click behavior |
| ------------- | ------------------------ | -------------- |
| `cults3d`     | `models.html`, `shop.html` | Outbound link to your Cults3D listing |
| `etsy`        | `models.html`, `shop.html` | Outbound link to your Etsy listing |
| `googleplay`  | `apps.html`, `shop.html`   | Outbound link to your Google Play listing |
| `pc-download` | `downloads.html`           | Direct download / link to file |
| `stripe`      | `downloads.html`, `shop.html` | Opens Stripe Checkout (see `STRIPE_SETUP.md`) |

Mark anything `featured: true` to also surface it on the home page.

## Configuration

Open [`assets/js/config.js`](assets/js/config.js) and replace the placeholder
values:

- `STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key (`pk_test_…` /
  `pk_live_…`). See [`STRIPE_SETUP.md`](STRIPE_SETUP.md).
- `CULTS3D_URL`, `ETSY_URL`, `GOOGLE_PLAY_URL` — your storefront URLs (used by
  the header/footer and store-link buttons).
- `CONTACT_EMAIL` — used by every `mailto:` link.

> **NEVER commit a Stripe secret key (`sk_…`).** Only the publishable key is
> safe in client-side JavaScript.

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

## Deploying

This is a GitHub Pages **user site**, so any commit to the default branch is
automatically published to <https://questnerd.github.io>. The [`CNAME`](CNAME)
file points the site at the custom domain when configured in GitHub Pages
settings.

## License

Site content © QuestNerd. The theme this site was ported from is licensed
under GPL-2.0-or-later (see the original
[QuestNerd/Questnerdweb](https://github.com/QuestNerd/Questnerdweb) repo).
