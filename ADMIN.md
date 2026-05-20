# QuestNerd Admin (Decap CMS)

The QuestNerd site has a built-in browser admin at <https://www.questnerd.com/admin/>
(or `/admin/` on any host that serves this repo). It runs entirely in the
browser. There is no server.

When you "Save" in the admin, Decap commits a JSON file (and any uploaded
images / `.glb` models / downloadable files) directly to this GitHub repo.
GitHub Pages then rebuilds, and the new entry appears on the site within
~30 seconds.

## What you can manage

Two collections, defined in [`admin/config.yml`](admin/config.yml):

| Collection | Folder | Used by |
| ---------- | ------ | ------- |
| **Products** | `content/products/*.json` | `shop.html`, `models.html`, `apps.html`, `downloads.html`, `product.html?id=…` |
| **Projects** | `content/projects/*.json` | `portfolio.html`, `project.html?id=…` |

Each new entry is auto-discovered at page-load by
[`assets/js/content-loader.js`](assets/js/content-loader.js) (via the public
GitHub Contents API, results cached in `sessionStorage`), then rendered by
[`assets/js/main.js`](assets/js/main.js) and
[`assets/js/detail.js`](assets/js/detail.js).

## First-time setup (login)

Decap needs to authenticate against GitHub before it can write to the repo.
Two equally good options:

### Option 1 — Netlify's free OAuth broker (recommended, 5 minutes)

This is the path that needs no servers of your own.

1. Create a **free** Netlify account at <https://app.netlify.com/signup>.
2. In Netlify, click **Add new site → Import an existing project → GitHub**,
   choose this repo, and click **Deploy site** (you don't have to publish
   anything from Netlify — we only want the OAuth broker).
3. In the new site's settings, go to **Integrations** (or **Site
   configuration → OAuth → Install provider**) and add **GitHub** as an
   OAuth provider. You will need to register a new **GitHub OAuth App**:
   - **Homepage URL:** `https://www.questnerd.com`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
   Paste the resulting client ID and client secret into the Netlify form.
4. Visit `https://www.questnerd.com/admin/` and click **Login with GitHub**.
   You'll be sent through Netlify's OAuth flow, then dropped back in the
   admin UI.

Why this works on GitHub Pages: only the *OAuth handshake* runs on Netlify.
The site itself stays on GitHub Pages. Netlify is free at this volume
forever — they're effectively giving away a tiny stateless service.

### Option 2 — Self-host the OAuth broker

If you'd rather not depend on Netlify, deploy
[decaporg/decap-server](https://github.com/decaporg/decap-server) (or
[vencax/netlify-cms-github-oauth-provider](https://github.com/vencax/netlify-cms-github-oauth-provider))
on any free-tier host (Vercel, Cloudflare Workers, Render, Fly.io). Then
edit `admin/config.yml`:

```yaml
backend:
  name: github
  repo: QuestNerd/QuestNerd.github.io
  branch: main
  base_url: https://your-oauth-broker.example.com
```

## Adding a product

1. Go to <https://www.questnerd.com/admin/> and log in.
2. Click **Products → New Product**.
3. Fill in:
   - **URL slug (id)** — lowercase-with-dashes; becomes `product.html?id=…`
   - **Product type** — pick the dropdown that matches where the item lives
     (Cults3D, Etsy, Google Play, free PC download, or Stripe-paid).
   - **Title, description, long description, story** — the marketing copy.
   - **Main image** + **Gallery** — uploaded files go into `assets/uploads/`.
   - **3D model (.glb / .gltf)** — optional. If set, the product page shows
     an interactive 3D preview, and the card gets a green "3D" badge.
   - **Specs / FAQ / Tags** — repeat-fields for structured data.
   - **External URL** — for Cults3D / Etsy / Google Play / direct download
     items, paste the listing URL here.
   - **Stripe price ID** or **Stripe Payment Link** — for paid items.
   - **Downloadable files** — for free PC downloads, link directly. For
     Stripe items, list "what you get" (the actual delivery is via the
     Stripe receipt email).
4. Click **Publish → Publish Now** (or use the editorial workflow if it's
   enabled).
5. Wait ~30s for GitHub Pages to redeploy. The new product appears in the
   shop and at `product.html?id=<slug>`.

## Adding a portfolio project

1. Click **Portfolio → New Project**.
2. Fill in everything you want shown:
   - **Cover image** + **Gallery** for the visuals.
   - **The story** (markdown) — the full case study.
   - **Money spent / Money saved / Duration / Tech / Outcome** — surfaced
     as a structured specs block on the case-study page.
   - **Links** — live demos, GitHub repos, store pages…
3. Publish. The project appears on `portfolio.html` and at
   `project.html?id=<slug>`.

## Removing / editing

Open the entry in the admin and click **Delete** or edit the fields and
**Save**. Decap will commit the change to this repo.

## Image / file uploads

All uploads go into `assets/uploads/`. They're committed to the repo, so
they live forever and are versioned. No external storage required.

## What the editorial workflow does

`admin/config.yml` enables `publish_mode: editorial_workflow`, which means:
- Saving creates a **draft** (commits to a new branch).
- The admin UI has a "Workflow" view where drafts can be moved through
  "Drafts → In Review → Ready" and merged.
- Set `# publish_mode: editorial_workflow` (comment it out) for instant
  publishing.

## Troubleshooting

- **"Failed to load config.yml"** in the admin: clear the browser cache
  (Decap aggressively caches its config).
- **"Bad credentials"** when saving: your OAuth app has expired or been
  revoked. Re-run the Netlify auth setup.
- **New entries don't appear on the site:** the GitHub Pages build takes
  ~20–60s. Hard-refresh; `content-loader.js` caches the listing for the
  session in `sessionStorage`.
- **The admin says "60 / hour exceeded"**: that's GitHub's unauthenticated
  rate limit hitting the Contents API used for *visitor* listing — not the
  admin itself. Reduce the frequency of hard-refreshes or implement an
  `index.json` (see [`assets/js/content-loader.js`](assets/js/content-loader.js)
  — it prefers an `index.json` over the API if one is present).
