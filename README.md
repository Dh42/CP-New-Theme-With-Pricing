# CP-HomePage-CategoryPage

Custom theme layer built on the HDT/Ecomus base theme for Canadian Protein. All custom files use the `cp-` prefix to distinguish them from base theme files.

---

## File Overview

| File | Type | Purpose |
|---|---|---|
| `assets/cp-homepage.css` | CSS | Styles for all homepage CP sections |
| `assets/cp-homepage.js` | JS | Announcement bar, Quick Add drawer, quiz, newsletter, hero slider |
| `assets/cp-category.css` | CSS | Styles for category page product cards, hero, in-grid block |
| `assets/cp-category.js` | JS | Globo flash prevention, in-grid injection, Notify Me handler |
| `sections/cp-announcement-bar.liquid` | Section | Cycling announcement bar |
| `sections/cp-collection-hero.liquid` | Section | Category page hero with trust pills and nav chips |
| `sections/cp-overlays.liquid` | Section | Quick Add drawer + newsletter popup (global CP overlay container) |
| `sections/cp-ingrid-block.liquid` | Section | Promo/banner injected into the product grid |
| `sections/cp-theme-config.liquid` | Section | Global brand accent colour control |
| `snippets/cp-product-card.liquid` | Snippet | Homepage product card |
| `snippets/cp-quick-add-drawer.liquid` | Snippet | Quick Add slide-in drawer markup |
| `snippets/cp-qa-data.liquid` | Snippet | Pre-embeds flavour icon + servings data for category page Quick Add |
| `snippets/globo.filter.product.liquid` | Snippet | Globo Smart Filter product card template |

---

## Features

### 1. CP Announcement Bar

**Section:** `cp-announcement-bar.liquid`

A slim bar at the top of pages that cycles through configurable messages.

- Messages are added as **blocks** in the theme editor — add, remove, and reorder freely
- Each message supports inline rich text (bold, italic, inline links)
- Dots indicate the current message and are clickable
- Auto-cycles every 4.2 seconds
- If only one message block exists, the dots are hidden

**Theme editor:** Add the section to any template → add "Message" blocks.

---

### 2. Quick Add Drawer

**Section:** `cp-overlays.liquid` → `cp-quick-add-drawer.liquid`  
**JS:** `cp-homepage.js`

A slide-in drawer triggered by any element with `data-quick-add="product-handle"`.

- Fetches product JSON on open — no pre-rendered HTML required
- Flavour selector with circular image swatches (images pulled from `custom.flavor_image` variant metafield, with fallback to variant featured image)
- Size/weight selector (detects the size option by name — "Size", "Weight", "lbs", "kg")
- Subscribe & Save toggle (detects selling plans automatically — shows 15% discount badge)
- Quantity stepper
- Live price total updates as options change
- "Add to cart" disabled when the selected variant is out of stock; replaced by **Notify Me** button
- Dispatches `cart:drawer:change` event on successful add (compatible with the HDT cart drawer)

**Notify Me (OOS variants):**  
When a variant is out of stock in the drawer, a "Notify Me When Back In Stock" button appears. It uses the SC Back in Stock (Shop Circle) `BIS_trigger` pattern. Requires the **SC Back in Stock App Embed** to be enabled in the theme editor (Shopify Admin → Online Store → Themes → Customize → App Embeds). If the embed is not enabled, clicking the button navigates to the product page where the app block is installed.

---

### 3. Category Page Hero

**Section:** `cp-collection-hero.liquid`  
**CSS:** `cp-category.css`

A hero section at the top of collection pages with:

- **Heading** — defaults to `collection.title` when left blank, so it works on any collection without manual setup
- **Subtext** paragraph
- **Eyebrow** label with maple leaf icon
- **CTA button** (optional)
- **Trust pills** (blocks) — icon + label, supports: Leaf, Flask, Truck, Shield, Star, Checkmark, Refresh
- **Quick nav chips** (blocks) — scrollable row of links to related collections
- **Social proof card** (optional, toggleable) — rating, review count, two stats, footer line

**Theme editor blocks:**
- `trust_pill` — add up to any number of trust signals
- `quick_nav_chip` — add links to sibling collections

---

### 4. Category Page Product Cards

**Snippet:** `globo.filter.product.liquid`  
**CSS:** `cp-category.css`

Custom product card template used by Globo Smart Filter to render products on collection pages.

- Product image with lazy loading
- Tag-based badges: Best Seller, Top Rated, New, Vegan, Grass-Fed, Sale
- Sold Out tag on unavailable products
- Junip star ratings (rendered client-side)
- Price display with sale strikethrough
- Size/weight pills (first 3 values, "+ N more" if additional)
- **Quick Add button** → opens Quick Add drawer
- **Notify Me button** → triggers SC Back in Stock for sold-out products

**Flavour & servings data for Quick Add:**  
On category pages, `cp-qa-data.liquid` is looped over `collection.products` in `theme.liquid` to pre-embed the flavour image map and servings-per-container map. These are read by the Quick Add drawer JS to populate the flavour swatches and cost-per-serving display.

---

### 5. In-Grid Promo Block

**Section:** `cp-ingrid-block.liquid`  
**JS:** `cp-category.js`

A full-width promo block injected into the product grid after a configurable Nth product.

- **Insert after** — theme editor setting controls which position (e.g., after product 8)
- **Block types:** Promo (headline + subtext + CTA) or Image
- Re-injects automatically when Globo Smart Filter updates the grid (filter, sort, pagination)
- Uses MutationObserver + Globo event listeners to handle async product rendering

**Theme editor:** Add the `cp-ingrid-block` section to the collection template and set "Insert after" to the desired product position.

---

### 6. Globo Smart Filter — Flash Prevention

**JS:** `cp-category.js`  
**CSS:** Inline `<style>` in `theme.liquid` `<head>`

The HDT theme renders products server-side before Globo replaces them asynchronously, causing a visible flash. The fix:

- An inline `<style>` in `<head>` sets `opacity: 0` on the product grid for all collection pages before first paint
- `cp-category.js` adds the `cp-grid-ready` class to `<body>` when any Globo render event fires, transitioning the grid to `opacity: 1`
- An 800 ms safety timeout adds `cp-grid-ready` on pages that use the native grid (no Globo), so those pages are never blocked

---

### 7. CP Theme Config — Brand Accent Colour

**Section:** `cp-theme-config.liquid`  
**Loaded via:** `system-group.json` (renders on every page)

A single colour picker that controls the brand accent colour across all CP sections — badges, buttons, trust pill icons, price highlights, active chips, hover states, and more.

**How it works:**  
The section sets `--cp-brand-accent` on `:root`. Both `cp-homepage.css` and `cp-category.css` reference this variable with `var(--cp-brand-accent, #D81E2B)` fallbacks, so changing one colour cascades everywhere. Derived variants (hover/pressed, light tint, on-dark) are auto-computed with CSS `color-mix()`.

**Settings:**
- **Accent colour** — the main brand colour (default: `#D81E2B`)
- **Text on accent** — text colour used on accent-coloured buttons/badges (default: white; switch to black for light accent colours)

**Theme editor:** Themes → Customize → scroll to the global sections sidebar and find "CP Theme Config".

---

### 8. A/B Colour Testing via Query String

**Implemented in:** `theme.liquid` `<head>`

The brand accent colour can be overridden per-visit using the `?accent=` query parameter. This is designed for ad campaign A/B testing.

**URL format:**
```
https://canadianprotein.com/collections/whey-protein?accent=%23E87722
```
(`%23` is URL-encoded `#`)

**Persistence:** When a visitor lands with `?accent=`, the colour is stored in a cookie (`cp_accent`) for **7 days**. On return visits without the query parameter the cookie is read and the same colour variant is shown. A new `?accent=` parameter on any subsequent visit overwrites the cookie and resets the 7-day window.

**Example variants:**
| Colour | Parameter |
|---|---|
| Red (control) | `?accent=%23D81E2B` or omit |
| Orange | `?accent=%23E87722` |
| Blue | `?accent=%230057FF` |
| Green | `?accent=%2300A651` |

---

## Architecture Notes

### CSS Variables

All CP components share a set of CSS custom properties. `cp-theme-config.liquid` is the single source of truth:

```
--cp-brand-accent        → set by theme editor or ?accent= param
--cp-brand-accent-strong → auto: color-mix(accent, 22% black)
--cp-brand-accent-tint   → auto: color-mix(accent, 10% white)
--cp-brand-accent-dark   → auto: color-mix(accent, 35% white)
--cp-brand-accent-ink    → set by theme editor (text on accent)
```

These feed into `--cp-accent`, `--cp-accent-strong` etc. in both CSS files via `var()` references.

### Quick Add Data Flow

```
Server-side (Liquid)
  cp-product-card.liquid       → <script class="cp-qa-fi"> (homepage)
  cp-qa-data.liquid loop       → <script class="cp-qa-fi"> (category pages)

Client-side (JS)
  openQuickAdd(handle)
    → reads cp-qa-fi / cp-qa-sv script tags by handle
    → fetches /products/{handle}.js
    → builds flavour swatches, size buttons, selling plans
```

### Asset Loading

Assets are centralised in `theme.liquid` for collection pages:

```
theme.liquid (template.name == 'collection')
  → cp-category.css
  → cp-category.js
  → cp-homepage.js

cp-overlays.liquid (homepage + collection via section)
  → cp-homepage.css
  → cp-homepage.js  (duplicate on collection pages — harmless, guarded)
```

`cp-homepage.js` and `cp-category.js` both guard against double-initialisation with `window._cpHomepageInit` and `window._cpCatInit` flags.

---

## Default Collection Template

`templates/collection.json` is the default template used by all collections. It includes:

1. `cp-overlays` — Quick Add drawer + newsletter popup
2. `cp-collection-hero` — hero with trust pills and nav chips (heading defaults to collection title)
3. `main-collection` — HDT product grid (targeted by Globo Smart Filter)
4. `cp-ingrid-block` — in-grid promo ("Find your perfect protein" quiz CTA, after product 8)

Collections that need a custom hero or different nav chips can override settings in the theme editor per-collection without changing the template.
