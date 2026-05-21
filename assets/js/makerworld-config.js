/*
 * QuestNerd — MakerWorld print-time service: defaults.
 *
 * This file defines the four hour-tier "products" that the
 * makerworld-prints.html page sells, plus a default starter list of
 * filament colors. Each entry that needs to charge real money should be
 * wired to either a Stripe `stripePriceId` (recommended — line items can
 * be combined so the buyer pays base + filament in one checkout) OR a
 * Stripe Payment Link (`stripeLink`) per tier (filament upcharge cannot
 * be combined into a Payment Link automatically — see MAKERWORLD_SETUP.md).
 *
 * The /admin/ Decap UI can override / extend both lists:
 *   - content/settings/makerworld-print.json   — singleton: tier prices + copy
 *   - content/filaments/*.json                 — one file per filament color
 *
 * content-loader.js merges the admin-authored data on top of these defaults.
 */

window.QN_MAKERWORLD = {
  // -------- Page copy --------
  intro:
    'Pick any 3D print on makerworld.com, choose how long it takes to print, ' +
    'add your filament color, and paste the link. I print it on a QuestNerd ' +
    'printer and ship it to your door.',

  // -------- Hour tiers (base price options) --------
  // Order matters — this is the order tiers appear on the page.
  // Each tier needs ONE of: `stripePriceId` OR `stripeLink`. Until configured
  // the buy button shows a friendly "not configured" message instead of
  // sending the customer into a broken checkout.
  tiers: [
    {
      id: 'mw-1h',
      label: '1 hour or less',
      maxHours: 1,
      description: 'Small prints — keychains, dice, tabletop tokens, single articulated parts.',
      price: '$8.00',
      stripePriceId: 'price_REPLACE_ME_MW_1H',
      // stripeLink: 'https://buy.stripe.com/REPLACE_ME_MW_1H',
    },
    {
      id: 'mw-1to6h',
      label: '1 to 6 hour print',
      maxHours: 6,
      description: 'Medium prints — desk gadgets, small mech parts, mid-size minis.',
      price: '$18.00',
      stripePriceId: 'price_REPLACE_ME_MW_1TO6H',
    },
    {
      id: 'mw-6to12h',
      label: '6 to 12 hour print',
      maxHours: 12,
      description: 'Larger prints — multi-piece models, mid-size statues, full-size organizers.',
      price: '$32.00',
      stripePriceId: 'price_REPLACE_ME_MW_6TO12H',
    },
    {
      id: 'mw-12to24h',
      label: '12 to 24 hour print',
      maxHours: 24,
      description: 'Big builds — helmets, large display pieces, multi-day single prints.',
      price: '$58.00',
      stripePriceId: 'price_REPLACE_ME_MW_12TO24H',
    },
  ],

  // -------- Filament colors --------
  // Each filament adds its upcharge to the base tier price as an extra
  // Stripe line item (when `stripePriceId` is set). Hex swatches are used
  // for the on-page color preview only.
  //
  // Add new colors via the /admin/ UI or by appending to this array.
  filaments: [
    {
      id: 'pla-matte-black',
      name: 'Matte Black PLA',
      swatch: '#15181a',
      addOnPrice: '$0.00',
      // Set to '' if there is no upcharge (no extra Stripe line item is added).
      stripePriceId: '',
    },
    {
      id: 'pla-cool-white',
      name: 'Cool White PLA',
      swatch: '#f4f4f4',
      addOnPrice: '$0.00',
      stripePriceId: '',
    },
    {
      id: 'pla-quest-green',
      name: 'Quest Green PLA',
      swatch: '#3ee07a',
      addOnPrice: '$2.00',
      stripePriceId: 'price_REPLACE_ME_FIL_GREEN',
    },
    {
      id: 'silk-gold',
      name: 'Silk Gold',
      swatch: '#d4af37',
      addOnPrice: '$4.00',
      stripePriceId: 'price_REPLACE_ME_FIL_GOLD',
    },
  ],
};
