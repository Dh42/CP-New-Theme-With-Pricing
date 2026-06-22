


# CP Custom Theme Layer — Development Context

This document captures all custom development work layered on top of the HDT Shopify theme for Canadian Protein. It is intended to give any future developer (or AI assistant) a complete picture of what was built, why, and how it works.

---

## Project Scope

A custom Shopify theme layer built on top of the existing HDT theme. The work spans three areas:

1. **Homepage redesign** — Conversion-optimized sections replacing the default index
2. **Category page redesign** — Globo Filter-compatible product grid with custom cards
3. **Product page overlay** — Nutrition data, info images, and trust elements injected into the existing HDT product template without forking it

---

## Key Files

| File | Purpose |
|---|---|
| `snippets/product-media.liquid` | Core of the product overlay — all CP-specific injection lives here |
| `templates/product.default-protein.json` | Protein product page template |
| `templates/product.creatine-monohydrate.json` | Creatine product page template |
| `snippets/cp-trust-bar.liquid` | 3-column trust bar ("Made in Canada", "Free shipping over $99", "Lab tested every batch") |
| `assets/cp-homepage.css` | Styles for homepage sections and Quick Add drawer |
| `assets/cp-homepage.js` | JS for homepage sections, Quick Add drawer, cart drawer integration |
| `assets/cp-category.css` | Styles for category page |
| `assets/cp-category.js` | JS for category page (Globo integration, in-grid injection) |
| `assets/cp-product-redesign.css` | Product page overlay styles (older layer) |
| `layout/theme.liquid` | Modified to load Globo product template + CP assets on collection pages |

---

## Product Page Overlay (`snippets/product-media.liquid`)

This is the most complex piece. It is **not** a fork of the HDT snippet — it is the original file with a custom block inserted at the top (`{% comment %} nemo {% endcomment %}` ... `{% comment %} endnemo {% endcomment %}`). All CP customisation lives between those markers.

### Which pages are affected

```liquid
{%- if template.suffix == 'default-protein'
    or template.suffix == 'dfltprdct-exclusion'
    or template.suffix == 'creatine-monohydrate' -%}
```

Only products using those three template suffixes get the overlay. All other products render the HDT default.

### Metafields required

Four custom metafields on the product (namespace `custom`):

| Key | Usage |
|---|---|
| `custom.front_image` | Info slide 1 / thumbnail 1 |
| `custom.back_image` | Info slide 2 / thumbnail 2 |
| `custom.scoop_image` | Info slide 3 / thumbnail 3 |
| `custom.lifestyle_image` | Info slide 4 / thumbnail 4 |

If any of the four are missing, `cp_has_all_images = false` and none of the overlay is rendered.

For **protein**: these four images are the usual "Why you'll love it / Transparency / When to use / How to use" info images.
For **creatine**: same four metafield keys, same four info images.

### What the overlay injects

**1. `nutrition_boxes_html`** — Captured HTML injected at the top of `.hdt-product-media__main`. Contains:
- BESTSELLER / sold-count badge (top left)
- LAB-TESTED badge (top right)
- Cost per serving box (updates on variant change via JS)
- For **protein**: Protein per serving + Servings per container (both from Nutrify metafields)
- For **creatine**: Servings per container only, calculated as `container_grams / 5g` (creatine serving size is always 5g)

**2. `cp_custom_slides_html`** — Four additional `hdt-slider__slide` elements appended inside the main `hdt-slider`. These are the full-size versions of the four info images, shown when the corresponding thumbnail is clicked.

**3. `cp_custom_block_html`** — A `<div id="cp-custom-thumbs">` row of four clickable thumbnail cards placed as the **last child of `hdt-product-media`**. Clicking a thumb seeks the main slider to the corresponding info slide and hides the nutrition overlay.

### Flex layout — critical behaviour

`hdt-product-media` is `display: flex; flex-direction: column` by default, and `flex-direction: row-reverse` at desktop (≥1150px) for `thumbnail_left` layout. The two expected children are `.hdt-product-media__main` (86% width) and `.hdt-product-media__thumb` (14% width) — together they fill exactly 100%.

Adding `cp_custom_block_html` as a third flex item would compress the main image. The fix is CSS-only:

```css
hdt-product-media:has(.cp-custom-thumbs-row) {
  flex-wrap: wrap;
}
.cp-custom-thumbs-row {
  width: 100%;
  order: 99;
  flex-shrink: 0;
}
```

`flex-wrap: wrap` is scoped to only containers that hold our row (via `:has()`), so other product pages are unaffected. The `width: 100%` + `order: 99` forces the thumbs row to wrap onto its own line below main+thumb.

**Why not outside `hdt-product-media`?** `hdt-product-media` has `position: sticky` from the theme. Anything placed outside it is not sticky, so as the user scrolls, the sticky product image slides over the non-sticky thumbs row. Placing the thumbs row inside keeps it sticky alongside the product image.

### `update-when-variant-change` attribute

`hdt-product-media` only receives this attribute when `variant_images.size > 0` (i.e. when product images are attached to specific variants). Protein products have flavour images attached to variants, so they get `update-when-variant-change`. Creatine only has size variants with no attached images, so it does **not** get `update-when-variant-change`. This was the root cause of several earlier image-blank bugs — without re-initialisation on variant change, any layout disruption from unexpected children was permanent on creatine.

### Nutrition JS (`#nutrition-data`)

A hidden `<div id="nutrition-data">` is rendered with one child `<div>` per variant, each carrying data attributes:

- `data-variant-id`
- `data-protein`
- `data-serving-size`
- `data-servings-fallback`
- `data-container-grams`
- `data-price` / `data-price-formatted`
- `data-subscription-price` / `data-subscription-price-formatted`

On variant change (detected via `change` event on `[name="id"]` inside the product form), the JS reads the matching data row and updates all annotated DOM nodes (`[data-cost]`, `[data-protein]`, `[data-servings]`).

**`servingsFor()` function:**
```js
function servingsFor(data) {
  const containerGrams = numberFrom(data.dataset.containerGrams);
  const servingSize    = numberFrom(data.dataset.servingSize);
  const fallback       = numberFrom(data.dataset.servingsFallback);
  if (containerGrams > 0 && servingSize > 0) return Math.round(containerGrams / servingSize);
  // creatine-only: serving size is always 5g, not in Nutrify metafields
  if (containerGrams > 0) return Math.round(containerGrams / 5);  // injected by Liquid only on creatine
  if (fallback > 0) return Math.round(fallback);
  return 0;
}
```

The creatine fallback line (`/ 5`) is injected by a Liquid conditional so it only appears in the creatine template's rendered output.

**Container grams parsing** is done purely from variant option/title strings (e.g. `contains '1 kg'` → 1000g). Sizes handled: 100g, 454g, 1kg, 2kg, 6kg, 10kg.

### Info thumbnail JS

```js
function seekToCustomSlide(customIndex) { ... }
function initCustomThumbs() { ... }
```

`initCustomThumbs()` attaches click handlers to `#cp-custom-thumbs .cp-custom-thumb`. On click:
1. Adds `cp-boxes-hidden` class to `#nutrition-boxes` (hides the overlay)
2. Marks the clicked thumb active
3. Calls `seekToCustomSlide(customIndex)` which finds `.cp-custom-media-slide` elements in the slider and calls `scrollToIndex`

Recovery path: the slider's `scroll` event handler checks whether the current slide is a `.cp-custom-media-slide`. If not (i.e. user navigated back to a product media slide), it removes `cp-boxes-hidden` to restore the nutrition overlay and clears the active thumb state.

### Slide index calculation

```liquid
{%- assign cp_slide0 = product.media.size -%}
{%- assign cp_slide1 = product.media.size | plus: 1 -%}
{%- assign cp_slide2 = product.media.size | plus: 2 -%}
{%- assign cp_slide3 = product.media.size | plus: 3 -%}
```

The four info slides are appended after all product media slides. `data-slide-index` on each thumb uses these values so the thumbnail click can target the correct slider position.

---

## Creatine Template (`templates/product.creatine-monohydrate.json`)

Uses `template.suffix` = `creatine-monohydrate`. Differences from the protein template:

- **Servings calculation**: Protein uses Nutrify's `servingsPerContainer` and `ssize` fields. Creatine only sells three sizes (100g, 454g, 1kg) and the serving size (5g) is not in Nutrify — it is hard-coded in both the Liquid initial render and the JS runtime.
- **Trust bar**: Added `custom_liquid_TrustBar` block (renders `{% render 'cp-trust-bar' %}`) in `block_order` after `custom_liquid_MmfwLt` (VerifyPass block).
- **No flavor variants**: Only size variants → no flavor-image-attached-to-variant → no `update-when-variant-change` attribute on `hdt-product-media`.

---

## Homepage Sections

All custom homepage sections use the `cp-` prefix.

**New files:**
- `sections/cp-hero.liquid` — Full-width hero with trust pills
- `sections/cp-comparison-grid.liquid` — Product comparison grid, blocks-based (`type: product_card`)
- `sections/cp-quiz.liquid` — Product finder quiz, blocks-based (`type: question`)
- `sections/cp-stack-save.liquid` — Stack & Save tier mechanic section
- `sections/cp-ugc-bar.liquid` — UGC/social proof bar
- `sections/cp-theme-config.liquid` — CSS custom properties for brand accent + CTA colours
- `snippets/cp-product-card.liquid` — Product card used by comparison grid
- `snippets/cp-quick-add-drawer.liquid` — Quick Add slide-out drawer

**Cart drawer integration:** After adding to cart via `/cart/add.js`, dispatch:
```js
document.dispatchEvent(new CustomEvent('cart:drawer:change'));
```
This opens the existing HDT cart drawer without duplicating it.

**Brand colour tokens** (set in `cp-theme-config.liquid`, overridable per-page via `?accent=#hex` query param + cookie):
- `--cp-brand-accent` — badges, trust pills, active chips
- `--cp-brand-cta` — all Add to Cart / Quick Add buttons

---

## Category Page

Template: `templates/collection.cp-collection.json`

**Globo Filter integration** — the product card template for Globo is in `snippets/globo.filter.product.liquid`. It must be wrapped in `{% raw %}` because Globo processes it client-side via AJAX and Shopify metafields are not available at render time. Tag-based logic is used for badges; Junip stars are included via a `<span class="junip-product-rating">` hook.

**In-grid injection** (`sections/cp-ingrid-block.liquid`) — a promotional block that `cp-category.js` injects into the product grid after a configurable `insert_after` product count. Uses `MutationObserver` + Globo render events to re-inject after filter changes.

**`layout/theme.liquid` modification** — The Globo product template capture script was added here so it applies across all collection pages:
```liquid
{%- capture productTemplate -%}{% render 'globo.filter.product' ... %}{%- endcapture -%}
{%- unless productTemplate contains 'Liquid error' -%}
  <script id="gspfProduct" type="template/html">...</script>
{%- endunless -%}
```
CP category CSS/JS is also loaded here for all `collection` page types.

---

## Deployment Notes

- All `cp-` section/snippet/asset files are new — safe to deploy without affecting existing theme sections.
- `snippets/product-media.liquid` is a modified copy of the HDT original. If HDT releases a theme update that changes this file, the update must be merged manually (custom block is clearly delimited by `{% comment %} nemo {% endcomment %}` markers).
- `layout/theme.liquid` has been modified. Any HDT theme update to this file must also be manually merged.
- `templates/product.creatine-monohydrate.json` and `templates/product.default-protein.json` are managed via the Shopify theme editor and git. The Shopify admin theme editor can overwrite these — always pull before editing locally.
