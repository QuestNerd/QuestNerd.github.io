# Stripe Setup for QuestNerd

This site uses **Stripe Checkout in client-only mode**, which works perfectly on
GitHub Pages because Stripe itself hosts the checkout page — no server, no
serverless function, no backend required.

There are two ways to configure paid products. Pick whichever is easier:

| Option | Where the config lives | Best for |
| --- | --- | --- |
| **A. Stripe Payment Link** (recommended for non-developers) | `stripeLink` field per product in `assets/js/products.js` | Quick setup, no API keys in the repo |
| **B. Stripe.js + Price IDs** | `STRIPE_PUBLISHABLE_KEY` in `assets/js/config.js` + `stripePriceId` per product | Power users who want `redirectToCheckout` with success/cancel URLs back into this site |

---

## Option A — Stripe Payment Links (no code)

1. Sign in to the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Go to **Products** → **Add product**. Set the name, price, image, etc.
3. Open the product → click **Create payment link**. Configure
   * what to show after payment (Stripe-hosted confirmation or your own URL),
   * whether to collect address / promo codes / quantity,
   * etc.
4. Copy the URL — it looks like `https://buy.stripe.com/XXXXXXXXXXXX`.
5. Open [`assets/js/products.js`](assets/js/products.js) and edit the matching
   product entry:

   ```js
   {
     id: 'pro-tool',
     type: 'stripe',
     title: 'QuestNerd Pro Tool',
     description: '...',
     image: 'assets/img/questnerd-mark.svg',
     price: '$19.00',
     stripeLink: 'https://buy.stripe.com/XXXXXXXXXXXX',
   }
   ```

That's it. The **Buy now** button will navigate to the Stripe-hosted checkout.
You can leave `STRIPE_PUBLISHABLE_KEY` as `pk_test_REPLACE_ME` in this mode
because Stripe.js is never loaded.

---

## Option B — Stripe.js + Price IDs

This mode keeps users on your domain right up until Stripe takes over, and
returns them to your `success.html` / `cancel.html` automatically.

1. **Get your publishable key.** Stripe Dashboard → **Developers** →
   **API keys**. Copy the **Publishable key** (starts with `pk_test_…` while
   testing or `pk_live_…` in production).

   > ⚠️ **NEVER commit the secret key (`sk_…`).** Only the publishable key is
   > safe in client-side JavaScript.

2. **Add it to `assets/js/config.js`:**

   ```js
   window.QN_CONFIG = {
     STRIPE_PUBLISHABLE_KEY: 'pk_live_XXXXXXXX', // <- your key here
     // ...
   };
   ```

3. **Create products + prices** in the Stripe Dashboard (Products → Add
   product → set a price). Copy each **Price ID** — it looks like
   `price_1NXXXXXXXXXX`.

4. **Wire each paid item in `assets/js/products.js`:**

   ```js
   {
     id: 'pro-tool',
     type: 'stripe',
     title: 'QuestNerd Pro Tool',
     description: '...',
     image: 'assets/img/questnerd-mark.svg',
     price: '$19.00',
     stripePriceId: 'price_1NXXXXXXXXXX',
   }
   ```

5. **Enable Checkout client-only redirect.** In the Stripe Dashboard go to
   **Settings → Checkout and Payment Links → Checkout settings** and turn on
   **“Client-only integration”**. Then under **Domain allowlist**, add the
   domain you serve this site from, e.g.:

   * `questnerd.github.io`
   * `www.questnerd.com` (and `questnerd.com`) if you use a custom domain
   * `http://localhost:8000` for local testing

   Without these allowlist entries Stripe will reject `redirectToCheckout`.

6. **Success & cancel URLs.** The redirect uses
   `${window.location.origin}/success.html` and `/cancel.html` — these pages
   already exist in this repo and match the site's theme.

---

## Local testing

Run any static server from the repo root, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

You need a real HTTP server (not `file://`) because the header/footer are
loaded via `fetch('partials/...')`. Test the Stripe button with a test
publishable key and a test card such as `4242 4242 4242 4242`.

---

## Security checklist

- [ ] `STRIPE_PUBLISHABLE_KEY` in `assets/js/config.js` is a `pk_` key, never `sk_`.
- [ ] No webhook secret, restricted key, or other Stripe secret has been
      committed.
- [ ] Stripe domain allowlist includes every domain you serve the site from.
- [ ] You are NOT using a custom checkout form — Stripe Checkout hosts the
      payment form, so PCI scope stays minimal.
