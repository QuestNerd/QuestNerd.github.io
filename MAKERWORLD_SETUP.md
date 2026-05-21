# MakerWorld Print Service — Setup

The `makerworld-prints.html` page lets visitors order any 3D model on
[makerworld.com](https://makerworld.com/) as a printed-and-shipped
service. They pick one of four print-time tiers, choose a filament
color, paste the model's URL, pay through Stripe, and you receive the
order with the URL attached so you can print and ship it.

There are three things to configure:

1. **Stripe prices** for the four hour tiers.
2. **(Optional) Stripe prices** for any filament color that carries an
   upcharge.
3. **(Recommended) A webhook** that emails you the order details
   instantly, including the buyer's MakerWorld URL.

Everything lives in plain JSON / JS — no backend.

---

## 1. Create the Stripe prices

This service uses Stripe Checkout in **client-only** mode, exactly like
the rest of the shop ([STRIPE_SETUP.md](STRIPE_SETUP.md)). Before
anything below works, finish steps 1–2 and 5 of `STRIPE_SETUP.md` —
namely, fill in `STRIPE_PUBLISHABLE_KEY` in `assets/js/config.js` and
allowlist your domain in the Stripe dashboard.

In the Stripe Dashboard create **one product per hour tier** (and one
per upcharged filament). Recommended structure:

| Stripe product | Stripe price ID env name | Default price |
| --- | --- | --- |
| QuestNerd MakerWorld — 1 hour or less | `mw-1h` | $8.00 |
| QuestNerd MakerWorld — 1 to 6 hour print | `mw-1to6h` | $18.00 |
| QuestNerd MakerWorld — 6 to 12 hour print | `mw-6to12h` | $32.00 |
| QuestNerd MakerWorld — 12 to 24 hour print | `mw-12to24h` | $58.00 |

For each upcharged filament (e.g. Silk Gold +$4.00) create another
Stripe product priced at the upcharge amount.

Copy each **Price ID** — it looks like `price_1NXXXXXXXXXX`.

---

## 2. Wire the prices into the site

Two equivalent options:

### Option A — through the browser admin UI (recommended)

1. Open `/admin/` and log in.
2. Pick **Site settings → MakerWorld print service**. Paste each tier's
   `stripePriceId` into the matching row, adjust labels/prices if you
   want different copy, and **Publish**.
3. Pick **Filament colors → New filament** for each color you offer:
   * **Display name** ("Silk Gold")
   * **Swatch color** (hex)
   * **Add-on price** ($0.00 for standard colors, e.g. $4.00 for silks)
   * **Stripe price ID** (only required when the add-on price isn't $0.00)
4. **Publish**.

This writes JSON to `content/settings/makerworld-print.json` and one
file per filament under `content/filaments/*.json`. The site picks them
up within ~30 seconds via
[`assets/js/content-loader.js`](assets/js/content-loader.js).

### Option B — by editing the JS file

Open [`assets/js/makerworld-config.js`](assets/js/makerworld-config.js)
and replace each `price_REPLACE_ME_*` placeholder with your real Stripe
price ID. Same file holds the starter filament list — add / remove
colors there.

---

## 3. (Recommended) Set up the email-notification webhook

Stripe's seller-receipt email does include the `client_reference_id`
(which encodes the buyer's MakerWorld URL), but it's easier to read the
URL in a plain email. Set up a free Formspree / Zapier / Make.com
webhook:

1. Sign up for [Formspree](https://formspree.io/) (or pick another
   webhook-to-email service). Create a form / webhook endpoint that
   forwards every JSON POST to your inbox.
2. Copy the endpoint URL — it looks like `https://formspree.io/f/XXXXXXXX`.
3. Paste it into [`assets/js/config.js`](assets/js/config.js):

   ```js
   MAKERWORLD_NOTIFY_URL: 'https://formspree.io/f/XXXXXXXX',
   ```

When a buyer clicks **Place order & pay**, the order form POSTs the
following JSON *before* redirecting to Stripe:

```json
{
  "product": "makerworld-print",
  "tier": { "id": "mw-1to6h", "label": "1 to 6 hour print", "maxHours": 6, "price": "$18.00" },
  "filament": { "id": "silk-gold", "name": "Silk Gold", "addOnPrice": "$4.00" },
  "makerWorldUrl": "https://makerworld.com/en/models/12345",
  "totalPriceCents": 2200,
  "totalPriceDisplay": "$22.00",
  "submittedAt": "2026-05-21T01:23:45.000Z"
}
```

You'll get this in your inbox the moment they click the button, so you
have the URL even if they bail out of the Stripe step. Stripe itself
will email you again when they actually pay.

---

## 4. How orders show up in Stripe

The order's `client_reference_id` looks like `mw_<base64>` and decodes
to the chosen tier, filament, and MakerWorld URL. Stripe shows it on
the order's detail page in your dashboard so you can confirm the URL
before printing.

---

## 5. Security notes

* The form only accepts URLs whose host matches `makerworld.com` (or
  `www.makerworld.com`) over `https://`. Other hosts are rejected.
* The Stripe publishable key is the only Stripe credential in client
  code — same as the rest of the site.
* The webhook URL must be `https://`. The order JSON contains no PII
  beyond what the buyer typed (the URL) and the chosen tier/color.
