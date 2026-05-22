# Porting QuestNerd.github.io to WordPress

This guide walks you through moving the static site to a WordPress install
using the bundled `wordpress/themes/questnerd/` theme and
`wordpress/plugins/questnerd-content/` plugin. The original static site
keeps working in place; this is an additive port so you can cut over at
your own pace.

---

## 1. What you need before you start

- A WordPress host (Bluehost, SiteGround, Kinsta, WP Engine, your own
  LAMP/LEMP, etc.) — **WordPress 6.5+** and **PHP 7.4+**.
- HTTPS on the new domain (required for Stripe Checkout and
  `<model-viewer>`).
- Your Stripe **publishable** key (the existing site is Stripe
  client-only — see `STRIPE_SETUP.md`).
- FTP/SFTP or hosting file manager access to copy theme + plugin into
  `wp-content/`.

You do **not** need a server-side Stripe webhook; Checkout-only mode
works the same way it does on the static site.

---

## 2. Drop the theme and plugin into WordPress

From this repo:

```
wordpress/
├── themes/
│   └── questnerd/                ← copy to wp-content/themes/questnerd/
└── plugins/
    └── questnerd-content/        ← copy to wp-content/plugins/questnerd-content/
```

Steps:

1. Upload `wordpress/themes/questnerd/` to `wp-content/themes/` so the
   final path is `wp-content/themes/questnerd/style.css`.
2. Upload `wordpress/plugins/questnerd-content/` to
   `wp-content/plugins/` so the final path is
   `wp-content/plugins/questnerd-content/questnerd-content.php`.
3. In WP admin → **Plugins**, activate **QuestNerd Content**.
4. In WP admin → **Appearance → Themes**, activate **QuestNerd**.
5. In WP admin → **Settings → Permalinks**, choose **Post name** and
   save. (This is required for `/product/<slug>/` and
   `/project/<slug>/` URLs to resolve.)

The theme contains a verbatim copy of `assets/` (CSS, JS, images, GLB
models) so it does not depend on any external CDN apart from the ones
already used by the static site (Google Fonts, Stripe, model-viewer
module, Lunr).

---

## 3. Fill in the Customizer

WP admin → **Appearance → Customize → QuestNerd Settings**. Map the
values from `assets/js/config.js` (and any overrides) into the matching
Customizer fields:

| Customizer field            | Old config key                   |
| --------------------------- | -------------------------------- |
| Site URL                    | `SITE_URL`                       |
| Default OG image            | `DEFAULT_OG_IMAGE`               |
| Stripe publishable key      | `STRIPE_PUBLISHABLE_KEY`         |
| Cults3D URL                 | `CULTS3D_URL`                    |
| Etsy URL                    | `ETSY_URL`                       |
| Google Play URL             | `GOOGLE_PLAY_URL`                |
| Contact email               | `CONTACT_EMAIL`                  |
| MakerWorld notify URL       | `MAKERWORLD_NOTIFY_URL`          |
| Newsletter action URL       | `NEWSLETTER_ACTION` / provider   |
| Plausible analytics src/dom | `ANALYTICS_SRC` / `…_DOMAIN`     |

These values are piped through `wp_add_inline_script()` so the existing
`assets/js/*.js` modules see them on `window.QN_CONFIG`.

---

## 4. Create the WordPress Pages

Under **Pages → Add New**, create one page per dynamic section, and in
the right-hand **Template** picker pick the matching `QuestNerd —
<name>` template:

| Slug                  | Title                | Template                      |
| --------------------- | -------------------- | ----------------------------- |
| `/`                   | Home                 | QuestNerd — Home              |
| `shop`                | Shop                 | QuestNerd — Shop              |
| `models`              | 3D Models            | QuestNerd — 3D Models         |
| `apps`                | Apps                 | QuestNerd — Apps              |
| `downloads`           | Downloads            | QuestNerd — Downloads         |
| `portfolio`           | Portfolio            | QuestNerd — Portfolio         |
| `makerworld-prints`   | MakerWorld Prints    | QuestNerd — MakerWorld Prints |
| `success`             | Checkout Success     | QuestNerd — Checkout Success  |
| `cancel`              | Checkout Cancelled   | QuestNerd — Checkout Cancelled|

For these static-content pages, paste the body HTML from the matching
file in this repo straight into the WP page editor (Block editor → top
right ⋮ → "Code editor"):

| WP Slug             | Source file                      |
| ------------------- | -------------------------------- |
| `about`             | `about.html`                     |
| `contact`           | `contact.html`                   |
| `privacy-policy`    | `privacy-policy.html`            |
| `terms`             | `terms.html`                     |
| `shipping-returns`  | `shipping-returns.html`          |

Each of those just uses the default `page.php` template, so no template
needs to be assigned manually — just publish the page.

Then **Settings → Reading**:

- "Your homepage displays" → **A static page**
- Homepage → **Home**
- Posts page → leave empty (the site has no blog).

---

## 5. Build the navigation menus

**Appearance → Menus**. Create four menus and assign them to the
locations the theme exposes:

| Menu                       | Theme location  | Items                                          |
| -------------------------- | --------------- | ---------------------------------------------- |
| Primary                    | `primary`       | Home, Shop, 3D Models, Apps, Downloads, MakerWorld Prints, Portfolio, About, Contact |
| Footer — Shop              | `footer-shop`   | Shop, 3D Models, Apps, Downloads, MakerWorld Prints |
| Footer — Explore           | `footer-explore`| Portfolio, About, Contact                      |
| Footer — Legal             | `footer-legal`  | Privacy Policy, Terms of Service, Shipping & Returns |

If you skip this step, `footer.php` / `header.php` fall back to the same
hardcoded lists that ship in the static `partials/`.

---

## 6. Import the existing content (products / projects / filaments)

You have two options.

### Option A — Admin UI

1. SFTP-upload the static site's `content/` directory anywhere readable
   by PHP on the server (e.g. `/var/www/qn-content/`).
2. WP admin → **QuestNerd → Import**.
3. Enter the absolute server path to the `content/` directory.
4. Tick **Update existing** if you're re-running.
5. Click **Run import**.

### Option B — WP-CLI

```bash
wp questnerd import --dir=/var/www/qn-content
# add --update to overwrite existing posts
```

The importer reads:

- `content/products/*.json` → creates/updates **qn_product** posts
- `content/projects/*.json` → creates/updates **qn_project** posts
- `content/filaments/*.json` → creates/updates **qn_filament** posts
- `content/settings/makerworld-print.json` → stored in
  the `qn_makerworld_settings` option.

It's idempotent: posts are keyed by their JSON `id` (which becomes the
`post_name` / URL slug). Tags become `qn_tag` taxonomy terms.

> **Images**: the importer keeps the relative paths from your JSON
> (`assets/img/...`). Since the theme ships a copy of `assets/`, these
> still resolve. If you'd rather have them in WP's Media Library, open
> each item and set a **Featured Image**; the theme prefers the Featured
> Image when present.

---

## 7. Configure Stripe and MakerWorld

### Stripe Checkout

1. In the Stripe dashboard, create one **Price** per paid product (the
   exact procedure is in `STRIPE_SETUP.md`).
2. Edit each `qn_product`, set **Type** = `stripe`, and paste the
   `price_…` ID into the **Stripe Price ID** field.
3. Put your **publishable** key in Customizer → Stripe publishable key.

The Buy buttons rendered by the theme keep the `data-qn-buy`,
`data-stripe-price-id`, etc. attributes, so the existing
`assets/js/stripe-checkout.js` handler wires them up automatically.

### MakerWorld order form

1. WP admin → **QuestNerd → MakerWorld**.
2. Set the **Intro** copy and **Tiers** JSON. Example tier:
   ```json
   { "label": "Small print", "price": "$8", "maxHours": 4, "stripePriceId": "price_..." }
   ```
3. Add filament colours under **QuestNerd → Filaments** (each post is
   one swatch with hex/material/availability).
4. Set Customizer → **MakerWorld notify URL** (Formspree/Zapier/etc.)
   if you want server-side notifications. See `MAKERWORLD_SETUP.md`.

---

## 8. Search

`assets/js/search.js` (Lunr in-browser) keeps working as-is — it just
indexes whatever is in `window.QN_PRODUCTS` / `QN_PROJECTS`, which the
theme now populates from WordPress. No separate WP search plugin is
needed.

---

## 9. DNS cutover and redirects

You can leave the static GitHub Pages site live while you build out
WordPress on a staging hostname. When you're ready to switch:

1. Point the domain at the WordPress host (update A/AAAA or CNAME
   records).
2. Confirm HTTPS resolves.
3. Add the following redirects so old links don't 404. With Apache use
   `.htaccess`; with Nginx use `rewrite … permanent;`. Apache example:

   ```apache
   # Static pages → WP pretty permalinks
   Redirect 301 /shop.html              /shop/
   Redirect 301 /models.html            /models/
   Redirect 301 /apps.html              /apps/
   Redirect 301 /downloads.html         /downloads/
   Redirect 301 /portfolio.html         /portfolio/
   Redirect 301 /makerworld-prints.html /makerworld-prints/
   Redirect 301 /about.html             /about/
   Redirect 301 /contact.html           /contact/
   Redirect 301 /privacy-policy.html    /privacy-policy/
   Redirect 301 /terms.html             /terms/
   Redirect 301 /shipping-returns.html  /shipping-returns/
   Redirect 301 /success.html           /success/
   Redirect 301 /cancel.html            /cancel/

   # Detail-page query strings → CPT permalinks
   RewriteEngine On
   RewriteCond %{QUERY_STRING} ^id=([^&]+)$
   RewriteRule ^product\.html$  /product/%1/?     [R=301,L]
   RewriteCond %{QUERY_STRING} ^id=([^&]+)$
   RewriteRule ^project\.html$  /project/%1/?     [R=301,L]
   ```

4. WordPress generates its own `sitemap.xml` at `/wp-sitemap.xml`. Submit
   it to Google Search Console after cutover so 301s are picked up.

If you want to keep GitHub Pages as a passive backup, just leave the
repo in place but stop pointing DNS at it; the `*.github.io` URL still
works.

---

## 10. What happens to Decap CMS?

The `admin/` Decap CMS folder is no longer needed once you're on
WordPress — the WP admin replaces it. You can either delete the folder
or leave it; nothing in the theme/plugin uses it. If you keep the
static repo around for backup, Decap will continue editing the JSON
files there in parallel (those changes won't sync into WP unless you
re-run the importer).

---

## 11. Smoke-test checklist

After cutover, walk through:

- [ ] Home page renders hero + featured grid + apps + portfolio teaser.
- [ ] `/shop/` shows the four sub-grids and the MakerWorld blurb.
- [ ] `/models/` and `/apps/` populate.
- [ ] Buy buttons (Stripe products) open Stripe Checkout in **test mode**.
- [ ] `/product/<slug>/` renders the detail page with images, specs, FAQ.
- [ ] `/project/<slug>/` renders the portfolio case study.
- [ ] `<model-viewer>` loads on the homepage and on product detail pages
      that have a `_qn_model` URL.
- [ ] `/makerworld-prints/` shows the order form; submitting it posts to
      your notify URL.
- [ ] Newsletter signup posts to the configured action URL.
- [ ] Search overlay opens on the homepage and returns matches.
- [ ] Plausible/analytics requests fire (if configured).
- [ ] 404 page styling matches the rest of the site.

---

## 12. Troubleshooting

- **CSS/JS 404s after activation** — confirm the theme folder is named
  exactly `questnerd` and that `wp-content/themes/questnerd/assets/`
  exists. The theme enqueues from `get_stylesheet_directory_uri() .
  '/assets/...'`.
- **CPT URLs 404** — visit Settings → Permalinks and click Save (this
  re-flushes rewrite rules; activation already does it once but a stale
  cache occasionally lingers).
- **`window.QN_CONFIG is undefined`** — make sure the QuestNerd theme is
  the active theme, not a child theme that has reset enqueues.
- **Stripe button does nothing** — open DevTools console. Either the
  publishable key isn't set in Customizer, or the product's
  **Stripe Price ID** is empty.
- **Importer reports "Directory not found"** — the path is on the
  **server**, not your laptop. SFTP the `content/` folder over first.
- **Old URLs still 404** — the redirects in step 9 only work on Apache;
  for Nginx use a `location ~ \.html$` map. For Cloudflare Workers or a
  reverse proxy, replicate the same mapping table.

That's it. The static repo can stay as a backup; everything in WP is
driven by the same JSON shapes you've been editing all along.
