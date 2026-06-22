/* Canadian Protein — Homepage JS (cp-homepage.js) */
(function () {
  'use strict';

  /* ── SVG icons ── */
  const SVG = {
    arrow:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    cart:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    close:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>',
    truck:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    shield: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    maple:  '<svg width="26" height="26" viewBox="0 0 512 512" fill="currentColor"><path d="M256 24l-22 78c-3 11-15 9-24 4l-34-19 25 140c5 26-12 26-20 15l-59-69-10 35c-2 8-7 11-14 9l-75-16 20 75c4 17 7 23-4 28l-13 5 129 109c8 6 7 11 6 18l-11 39 128-15c4 0 11 3 10 8l-6 142h32l-3-142c0-5 6-9 10-8l128 15-11-39c-2-7-2-12 6-18l129-109-13-5c-12-5-9-11-5-28l20-75-75 16c-7 2-12-1-14-9l-10-35-59 69c-8 11-25 11-20-15l25-140-34 19c-9 5-21 7-24-4z"/></svg>',
  };

  /* ── Announcement Bar ── */
  function initAnnouncement() {
    const bar = document.querySelector('.cp-ann');
    if (!bar) return;
    const msgs = bar.querySelectorAll('.cp-ann-msg-item');
    const dots = bar.querySelectorAll('.cp-ann-dot');
    if (msgs.length <= 1) return;
    let idx = 0;
    function show(i) {
      msgs.forEach((m, k) => {
        m.style.display = k === i ? 'block' : 'none';
        m.style.animation = k === i ? 'cpFade .5s ease' : 'none';
      });
      dots.forEach((d, k) => d.classList.toggle('active', k === i));
      idx = i;
    }
    dots.forEach((d, k) => d.addEventListener('click', () => { clearInterval(timer); show(k); timer = setInterval(next, 4200); }));
    function next() { show((idx + 1) % msgs.length); }
    let timer = setInterval(next, 4200);
    show(0);
  }

  /* ── Quiz ── */
  const QUIZ_DATA = [
    { q: "What's your main goal?", opts: [
      { label: 'Build muscle',       icon: 'scale',  handle: 'whey-protein-concentrate'  },
      { label: 'Get lean & toned',   icon: 'bolt',   handle: '100-whey-protein-isolate'  },
      { label: 'Everyday wellness',  icon: 'heart',  handle: 'economy-whey'              },
    ]},
    { q: "How's your stomach with dairy?", opts: [
      { label: 'A bit sensitive to lactose', icon: 'shield', handle: '100-whey-protein-isolate' },
      { label: 'No problems at all',         icon: 'check',  handle: 'whey-protein-concentrate' },
    ]},
    { q: "What matters more to you?", opts: [
      { label: 'Best value for money',      icon: 'scale', handle: 'economy-whey' },
      { label: 'Premium, cleanest formula', icon: 'spark', handle: 'iso90'        },
    ]},
  ];
  const QUIZ_ICONS = {
    scale:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M7 8h10M7 8l-3 6h6zM17 8l3 6h-6z"/></svg>',
    bolt:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z"/></svg>',
    heart:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    check:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>',
    spark:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/></svg>',
  };

  function initQuiz() {
    const quizEl = document.getElementById('cp-quiz');
    if (!quizEl) return;
    const questionEl  = quizEl.querySelector('.cp-quiz-question-area');
    const resultEl    = quizEl.querySelector('.cp-quiz-result-area');
    const h2          = quizEl.querySelector('.cp-quiz__h2');
    const progressEl  = quizEl.querySelector('.cp-quiz__progress');

    if (!questionEl || !resultEl) return;

    const configEl = document.getElementById('cp-quiz-config');
    let quizData = QUIZ_DATA;
    if (configEl) {
      try { quizData = JSON.parse(configEl.textContent); } catch(e) { /* fall back to QUIZ_DATA */ }
    }
    let step = 0;
    let votes = [];

    function renderProgress() {
      progressEl.innerHTML = quizData.map((_, i) =>
        `<div class="cp-quiz__dot${i <= step ? ' active' : ''}"></div>`
      ).join('');
    }

    function renderStep() {
      const q = quizData[step];
      const optCols = q.opts.length === 2 ? 'cp-quiz__options--2' : q.opts.length === 3 ? 'cp-quiz__options--3' : '';
      questionEl.innerHTML = `
        <h3 class="cp-quiz__question">${q.q}</h3>
        <div class="cp-quiz__options ${optCols}">
          ${q.opts.map(o => `
            <button class="cp-quiz__opt" data-handle="${o.handle}">
              <span class="cp-quiz__opt-icon">${QUIZ_ICONS[o.icon] || ''}</span>
              <span class="cp-quiz__opt-label">${o.label}</span>
            </button>
          `).join('')}
        </div>
        ${step > 0 ? '<div class="cp-quiz__back"><button type="button">← Back</button></div>' : ''}
      `;
      questionEl.style.display = 'block';
      resultEl.style.display = 'none';
      h2.textContent = "Let's find your protein";
      renderProgress();
      questionEl.querySelectorAll('.cp-quiz__opt').forEach(btn => {
        btn.addEventListener('click', () => {
          votes.push(btn.dataset.handle);
          step++;
          if (step >= quizData.length) renderResult();
          else renderStep();
        });
      });
      const backBtn = questionEl.querySelector('.cp-quiz__back button');
      if (backBtn) backBtn.addEventListener('click', () => { step--; votes.pop(); renderStep(); });
    }

    function recommend() {
      const tally = {};
      votes.forEach(h => { tally[h] = (tally[h] || 0) + 1; });
      return Object.keys(tally).reduce((a, b) => tally[a] >= tally[b] ? a : b);
    }

    function renderResult() {
      const recId = recommend();
      const products = quizEl.querySelectorAll('[data-quiz-product]');
      let rec = null;
      products.forEach(p => { if (p.dataset.quizProduct === recId) rec = p; });
      if (!rec) { step = 0; votes = []; renderStep(); return; }

      const img    = rec.dataset.img;
      const name   = rec.dataset.name;
      const handle = rec.dataset.handle;
      const price  = rec.dataset.price;
      const why    = rec.dataset.why || '';

      h2.textContent = "Here's your match";
      questionEl.style.display = 'none';
      resultEl.style.display = 'block';
      resultEl.innerHTML = `
        <div class="cp-quiz__result">
          <div class="cp-quiz__result-img">
            <img src="${img}" alt="${name}" loading="lazy"/>
          </div>
          <div>
            <span class="cp-badge cp-badge--accent" style="margin-bottom:12px">Your best match</span>
            <div class="cp-quiz__result-name">${name}</div>
            <p class="cp-quiz__result-why">${why}</p>
            <div class="cp-quiz__result-actions">
              <button class="cp-btn-primary cp-quiz-add-btn" data-handle="${handle}" style="font-size:15px;padding:15px 22px">
                ${SVG.cart} Add to cart — from ${price}
              </button>
              <button class="cp-quiz__retake" type="button">Retake</button>
            </div>
          </div>
        </div>
      `;
      renderProgress();
      resultEl.querySelector('.cp-quiz__retake').addEventListener('click', () => { step = 0; votes = []; renderStep(); });
      resultEl.querySelector('.cp-quiz-add-btn').addEventListener('click', () => openQuickAdd(handle));
    }

    renderStep();
  }

  /* ── Quick Add Drawer ── */
  const drawer = {
    el: null,
    product: null,
    variants: [],
    selFlavour: null,
    selSize: null,
    selPlan: 'onetime', // 'subscribe' | 'onetime'
    qty: 1,

    init() {
      this.el = document.getElementById('cp-qa-overlay');
      if (!this.el) return;
      this.el.querySelector('.cp-qa-backdrop').addEventListener('click', () => this.close());
      this.el.querySelector('.cp-qa-close').addEventListener('click', () => this.close());
      document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
    },

    open(handle) {
      if (!this.el) return;
      this.el.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.load(handle);
    },

    close() {
      if (!this.el) return;
      this.el.classList.remove('open');
      document.body.style.overflow = '';
    },

    async load(handle) {
      const scroll = this.el.querySelector('.cp-qa-scroll');
      scroll.innerHTML = '<div style="padding:40px;text-align:center;color:var(--cp-muted)">Loading…</div>';
      const footer = this.el.querySelector('.cp-qa-footer');
      footer.style.display = 'none';

      // Read pre-embedded flavour image map (written by cp-product-card.liquid)
      const fiEl = document.querySelector(`script.cp-qa-fi[data-handle="${handle}"]`);
      this.flavourImgMap = {};
      if (fiEl) { try { this.flavourImgMap = JSON.parse(fiEl.textContent); } catch(e) {} }

      // Read pre-embedded servings-per-container map keyed by variant ID
      const svEl = document.querySelector(`script.cp-qa-sv[data-handle="${handle}"]`);
      this.servingsMap = {};
      if (svEl) { try { this.servingsMap = JSON.parse(svEl.textContent); } catch(e) {} }

      try {
        const res  = await fetch(`/products/${handle}.js`);
        const prod = await res.json();
        this.product  = prod;
        this.variants = prod.variants;

        const opts = prod.options.map(o => typeof o === 'string' ? o : (o.name || String(o)));
        const hasOptions = !(opts.length === 1 && opts[0] === 'Title');

        // Build per-option selection state
        this.selOpts    = {};
        this.flavourIdx = -1;
        this.sizeIdx    = -1;
        this.selFlavour = null;
        this.selSize    = null;
        opts.forEach((optName, i) => {
          const vals = [...new Set(this.variants.map(v => v[`option${i+1}`]))];
          this.selOpts[i+1] = vals[0] || null;
          if (/flavou?r|flavor/i.test(optName)) { this.flavourIdx = i; this.selFlavour = vals[0] || null; }
          if (/size|weight|lb|kg/i.test(optName)) { this.sizeIdx = i; this.selSize = vals[0] || null; }
        });

        // Category pages: cp-qa-fi tags may be absent for products loaded after filtering.
        // Fall back to variant featured_image keyed by flavour value string.
        if (Object.keys(this.flavourImgMap).length === 0 && this.flavourIdx >= 0) {
          const optKey = `option${this.flavourIdx + 1}`;
          const seen = {};
          prod.variants.forEach(v => {
            const flavourVal = v[optKey];
            if (flavourVal && !seen[flavourVal] && v.featured_image && v.featured_image.src) {
              seen[flavourVal] = true;
              this.flavourImgMap[flavourVal] = v.featured_image.src;
            }
          });
        }

        this.qty     = 1;
        this.selPlan = 'onetime';

        const hasSellingPlans = prod.selling_plan_groups && prod.selling_plan_groups.length > 0;
        this.hasSellingPlans = hasSellingPlans;
        this.plans = [];
        this.sellingPlanId = null;
        if (hasSellingPlans) {
          const parsePlan = (plan) => {
            const adj = plan.price_adjustments && plan.price_adjustments[0];
            const discount = (adj && adj.value_type === 'percentage') ? adj.value : 0;
            let interval = '';
            // 1. Find the "Order Frequency and Unit" option (Recharge) — value is "30-day", "60-day" etc.
            const freqOpt = plan.options && plan.options.find(o => /frequency|unit/i.test(o.name || ''));
            if (freqOpt && freqOpt.value) {
              interval = freqOpt.value.replace(/-day$/i, ' days').replace(/-week$/i, ' weeks').replace(/-month$/i, ' months');
            }
            // 2. Parse from plan name e.g. "Delivery every 30 days"
            if (!interval) {
              const m = plan.name && plan.name.match(/(\d+\s+(?:day|week|month|year)s?)/i);
              if (m) interval = m[1].toLowerCase();
            }
            // 3. Last resort
            if (!interval) interval = plan.name || '';
            return { id: plan.id, discount, interval };
          };

          const firstGroup = prod.selling_plan_groups[0];
          if (firstGroup.selling_plans.length > 1) {
            // All intervals live inside one group
            firstGroup.selling_plans.forEach(plan => this.plans.push(parsePlan(plan)));
          } else {
            // One group per interval (Recharge default)
            prod.selling_plan_groups.forEach(group => {
              if (group.selling_plans[0]) this.plans.push(parsePlan(group.selling_plans[0]));
            });
          }
          this.sellingPlanId = this.plans[0] ? this.plans[0].id : null;
        }

        this.renderContent({ hasOptions, hasSellingPlans, prod, opts });
        footer.style.display = 'block';
        this.updateFooter();
      } catch (e) {
        scroll.innerHTML = '<div style="padding:40px;text-align:center;color:#c0392b">Could not load product. Please try again.</div>';
      }
    },

    renderContent({ hasOptions, hasSellingPlans, prod, opts }) {
      const scroll = this.el.querySelector('.cp-qa-scroll');
      const img    = prod.featured_image || (prod.images[0] ? prod.images[0].src : '');

      let html = `
        <div class="cp-qa-product">
          <div class="cp-qa-thumb"><img src="${img}" alt="${this.escHtml(prod.title)}" loading="lazy"/></div>
          <div><div class="cp-qa-product-title">${this.escHtml(prod.title)}</div></div>
        </div>
      `;

      if (hasOptions) {
        opts.forEach((optName, i) => {
          const optPos = i + 1;
          const values = [...new Set(this.variants.map(v => v[`option${optPos}`]))];
          const isFlavour  = this.flavourIdx === i;
          const isSize     = this.sizeIdx === i;
          const selVal     = this.selOpts[optPos];
          const anyHaveImgs = isFlavour && values.length > 0 && values.some(f => this.flavourImgMap[f]);

          if (isFlavour && anyHaveImgs) {
            // Image swatches
            const FLAVOUR_LIMIT = 8;
            const hasMoreFlavours = values.length > FLAVOUR_LIMIT;
            html += `
              <div class="cp-qa-field">
                <div class="cp-qa-field-header">
                  <span class="cp-qa-field-label">${this.escHtml(optName)}</span>
                  <span class="cp-qa-sel-hint" id="cp-qa-sel-hint-${optPos}">${this.escHtml(selVal || '')}</span>
                </div>
                <div class="cp-qa-flavour-grid" data-opt-pos="${optPos}">
                  ${values.map((f, idx) => {
                    const imgSrc = this.flavourImgMap[f];
                    const hidden = hasMoreFlavours && idx >= FLAVOUR_LIMIT ? ' cp-flavour-hidden' : '';
                    return `<button class="cp-flavour-btn${f === selVal ? ' active' : ''}${hidden}" data-opt-pos="${optPos}" data-opt-val="${this.escHtml(f)}" title="${this.escHtml(f)}">
                      <span class="hdt-form-color-pattern">
                        ${imgSrc ? `<img src="${this.escHtml(imgSrc)}" alt="${this.escHtml(f)}" class="flavor-img" loading="lazy">` : ''}
                      </span>
                      <span class="cp-flavor-name">${this.escHtml(f)}</span>
                    </button>`;
                  }).join('')}
                </div>
                ${hasMoreFlavours ? `
                  <button class="cp-qa-see-more" type="button">
                    See More Flavours
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                  </button>` : ''}
              </div>
            `;
          } else if (isSize) {
            // Size grid — with servings count, cost-per-serving, and best-value badge
            const sizeData = values.map(s => {
              const testOpts = Object.assign({}, this.selOpts, {[optPos]: s});
              const v = this.findVariantByOpts(testOpts);
              const spc = v ? (this.servingsMap[String(v.id)] || 0) : 0;
              const cps = (v && spc > 0) ? v.price / spc : Infinity;
              return { s, v, spc, cps };
            });
            const minCPS = Math.min(...sizeData.map(x => x.cps));
            const hasCPS = minCPS < Infinity;
            html += `
              <div class="cp-qa-field">
                <div class="cp-qa-field-header">
                  <span class="cp-qa-field-label">${this.escHtml(optName)}</span>
                  <span class="cp-qa-sel-hint" id="cp-qa-sel-hint-${optPos}">${this.escHtml(selVal || '')}</span>
                </div>
                <div class="cp-size-grid" data-opt-pos="${optPos}">
                  ${sizeData.map(({s, v, spc, cps}) => {
                    const isBest = hasCPS && cps !== Infinity && cps === minCPS;
                    const price = v ? this.formatMoney(v.price) : '';
                    const cpsLabel = (v && spc > 0) ? this.formatMoney(Math.round(cps)) + '/serving' : price;
                    const sizeLabel = spc > 0 ? `${this.escHtml(s)} · ${spc} servings` : this.escHtml(s);
                    return `<button class="cp-size-btn${s === selVal ? ' active' : ''}" data-opt-pos="${optPos}" data-opt-val="${this.escHtml(s)}">
                      ${isBest ? '<span class="cp-size-btn__badge">BEST VALUE</span>' : ''}
                      <div class="cp-size-btn__label">${sizeLabel}</div>
                      <div class="cp-size-btn__info">${cpsLabel}</div>
                    </button>`;
                  }).join('')}
                </div>
              </div>
            `;
          } else {
            // Chips — fallback for flavour without images, or any unrecognised option
            html += `
              <div class="cp-qa-field">
                <div class="cp-qa-field-header"><span class="cp-qa-field-label">${this.escHtml(optName)}</span></div>
                <div class="cp-qa-chips" data-opt-pos="${optPos}">
                  ${values.map(v => `<button class="cp-chip${v === selVal ? ' active' : ''}" data-opt-pos="${optPos}" data-opt-val="${this.escHtml(v)}">${this.escHtml(v)}</button>`).join('')}
                </div>
              </div>
            `;
          }
        });
      }

      if (hasSellingPlans) {
        const baseVariant = this.currentVariant();
        const basePrice   = baseVariant ? this.formatMoney(baseVariant.price) : '';
        const selPlan     = this.plans.find(p => p.id === this.sellingPlanId) || this.plans[0];
        const subDiscount = selPlan ? selPlan.discount : 0;
        const subPrice    = baseVariant ? this.formatMoney(Math.round(baseVariant.price * (1 - subDiscount / 100))) : '';
        const isSub       = this.selPlan === 'subscribe';
        const checkSvg    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`;
        html += `
          <div class="cp-qa-field">
            <div class="cp-qa-field-header"><span class="cp-qa-field-label">Purchase option</span></div>
            <div class="cp-purch-opts">
              <div class="cp-purch-opt${!isSub ? ' active' : ''}" data-plan="onetime" role="radio" tabindex="0">
                <span class="cp-purch-opt__radio"></span>
                <div class="cp-purch-opt__info">
                  <div class="cp-purch-opt__title">One-time purchase</div>
                  <div class="cp-purch-opt__note">${basePrice}</div>
                </div>
              </div>
              <div class="cp-purch-opt cp-purch-opt--sub${isSub ? ' active' : ''}" data-plan="subscribe" role="radio" tabindex="0">
                <span class="cp-purch-opt__badge">Most Popular</span>
                <div class="cp-purch-opt__head">
                  <span class="cp-purch-opt__radio"></span>
                  <div>
                    <div class="cp-purch-opt__title">Subscribe for ${subDiscount}% OFF</div>
                    <div class="cp-purch-opt__prices">
                      <span class="cp-purch-opt__orig">${basePrice}</span>
                      <span class="cp-sub-price cp-purch-opt__subprice">${subPrice}</span>
                    </div>
                  </div>
                </div>
                <div class="cp-purch-opt__benefits">
                  <div class="cp-purch-opt__benefit">${checkSvg} Save ${subDiscount}% off on every order</div>
                  <div class="cp-purch-opt__benefit">${checkSvg} Swap flavours or products, or skip anytime</div>
                </div>
                ${this.plans.length > 1 ? `
                  <div class="cp-freq-wrap">
                    <div class="cp-freq-label">Deliver every:</div>
                    <div class="cp-freq-chips">
                      ${this.plans.map(p => `
                        <button class="cp-freq-chip${p.id === this.sellingPlanId ? ' active' : ''}" data-plan-id="${p.id}" type="button">
                          <span class="cp-freq-chip__days">${p.interval}</span>
                          ${p.discount > 0 ? `<span class="cp-freq-chip__save">Save ${p.discount}% off</span>` : ''}
                        </button>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }

      html += `
        <div class="cp-qa-field">
          <div class="cp-qa-field-header">
            <span class="cp-qa-field-label">Quantity</span>
            <span class="cp-qa-field-hint">Buy 2 save 10% · 3 save 15% · 4+ save 25%</span>
          </div>
          <div class="cp-qty-wrap">
            <button class="cp-qty-btn" id="cp-qty-minus">−</button>
            <span class="cp-qty-val" id="cp-qty-val">1</span>
            <button class="cp-qty-btn" id="cp-qty-plus">+</button>
          </div>
        </div>
      `;

      scroll.innerHTML = html;

      // Unified option binding — all selectable buttons use data-opt-pos + data-opt-val
      scroll.querySelectorAll('[data-opt-val]').forEach(btn => {
        btn.addEventListener('click', () => {
          const pos = parseInt(btn.dataset.optPos);
          const val = btn.dataset.optVal;
          this.selOpts[pos] = val;
          if (pos === this.flavourIdx + 1) { this.selFlavour = val; this.refreshSizePrices(); }
          if (pos === this.sizeIdx + 1)    { this.selSize = val; if (hasSellingPlans) this.refreshPlanPrices(); }
          // Update active state within this option group
          const group = btn.parentElement;
          group.querySelectorAll('[data-opt-val]').forEach(b => b.classList.toggle('active', b === btn));
          // Update flavour hint label
          const hintEl = scroll.querySelector(`#cp-qa-sel-hint-${pos}`);
          if (hintEl) hintEl.textContent = val;
          this.updateFooter();
        });
      });

      // See More Flavours
      scroll.querySelectorAll('.cp-qa-see-more').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.previousElementSibling.querySelectorAll('.cp-flavour-hidden').forEach(b => b.classList.remove('cp-flavour-hidden'));
          btn.remove();
        });
      });

      // Plan options (subscribe / onetime)
      scroll.querySelectorAll('[data-plan]').forEach(el => {
        el.addEventListener('click', () => {
          this.selPlan = el.dataset.plan;
          scroll.querySelectorAll('[data-plan]').forEach(b => b.classList.toggle('active', b === el));
          this.updateFooter();
        });
      });

      // Delivery frequency chips — stopPropagation so parent subscribe card click doesn't fire
      scroll.querySelectorAll('.cp-freq-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sellingPlanId = Number(btn.dataset.planId);
          scroll.querySelectorAll('.cp-freq-chip').forEach(b => b.classList.toggle('active', b === btn));
          const plan = this.plans.find(p => p.id === this.sellingPlanId);
          if (plan && this.currentVariant()) {
            const v = this.currentVariant();
            const subPriceEl = scroll.querySelector('.cp-sub-price');
            if (subPriceEl) subPriceEl.textContent = this.formatMoney(Math.round(v.price * (1 - plan.discount / 100)));
          }
          this.updateFooter();
        });
      });

      // Qty
      document.getElementById('cp-qty-minus').addEventListener('click', () => { if (this.qty > 1) { this.qty--; document.getElementById('cp-qty-val').textContent = this.qty; this.updateFooter(); } });
      document.getElementById('cp-qty-plus').addEventListener('click', () => { this.qty++; document.getElementById('cp-qty-val').textContent = this.qty; this.updateFooter(); });
    },

    refreshSizePrices() {
      if (this.sizeIdx < 0) return;
      const sizePos = this.sizeIdx + 1;
      this.el.querySelectorAll(`[data-opt-pos="${sizePos}"][data-opt-val]`).forEach(btn => {
        const testOpts = Object.assign({}, this.selOpts, {[sizePos]: btn.dataset.optVal});
        const v = this.findVariantByOpts(testOpts);
        const infoEl = btn.querySelector('.cp-size-btn__info');
        if (infoEl && v) {
          const spc = this.servingsMap[String(v.id)] || 0;
          infoEl.textContent = spc > 0
            ? this.formatMoney(Math.round(v.price / spc)) + '/serving'
            : this.formatMoney(v.price);
        }
      });
    },

    refreshPlanPrices() {
      const v = this.currentVariant();
      if (!v) return;
      const opts = this.el.querySelectorAll('[data-plan]');
      opts.forEach(btn => {
        const priceEl = btn.querySelector('.cp-purch-opt__price');
        if (!priceEl) return;
        if (btn.dataset.plan === 'subscribe') {
          const plan = this.plans && this.plans.find(p => p.id === this.sellingPlanId);
          const discount = plan ? plan.discount : 0;
          priceEl.textContent = this.formatMoney(Math.round(v.price * (1 - discount / 100)));
        }
        else priceEl.textContent = this.formatMoney(v.price);
      });
    },

    currentVariant() {
      return this.findVariantByOpts(this.selOpts);
    },

    findVariantByOpts(opts) {
      outer: for (const v of this.variants) {
        for (const [pos, val] of Object.entries(opts)) {
          if (val != null && v[`option${pos}`] !== val) continue outer;
        }
        return v;
      }
      return this.variants[0] || null;
    },

    findVariant(flavour, size) {
      const testOpts = Object.assign({}, this.selOpts);
      if (this.flavourIdx >= 0 && flavour) testOpts[this.flavourIdx+1] = flavour;
      if (this.sizeIdx    >= 0 && size)    testOpts[this.sizeIdx+1]    = size;
      return this.findVariantByOpts(testOpts);
    },

    updateFooter() {
      const v = this.currentVariant();
      if (!v) return;
      const basePrice = v.price;
      const unitPrice = this.selPlan === 'subscribe' ? Math.round(basePrice * 0.85) : basePrice;
      const total     = unitPrice * this.qty;

      const summaryParts = [];
      if (this.selFlavour) summaryParts.push(this.selFlavour);
      if (this.selSize)    summaryParts.push(this.selSize);
      if (this.selPlan === 'subscribe') summaryParts.push('Subscription');

      const summaryEl = this.el.querySelector('.cp-qa-summary');
      const priceEl   = this.el.querySelector('.cp-qa-price-total');
      if (summaryEl) summaryEl.textContent = summaryParts.join(' · ');
      if (priceEl)   priceEl.textContent   = this.formatMoney(total);

      const addBtn    = this.el.querySelector('.cp-qa-add-btn');
      const notifyBtn = this.el.querySelector('.cp-qa-notify-btn');
      if (addBtn) {
        addBtn.hidden   = !v.available;
        addBtn.disabled = !v.available;
      }
      if (notifyBtn) {
        notifyBtn.hidden              = v.available;
        notifyBtn.dataset.variantId   = v.id;
        notifyBtn.dataset.productId   = this.product ? this.product.id : '';
        notifyBtn.dataset.productUrl  = this.product ? '/products/' + this.product.handle : '';
      }
    },

    async addToCart() {
      const v = this.currentVariant();
      if (!v || !v.available) return;
      const addBtn  = this.el.querySelector('.cp-qa-add-btn');
      const errorEl = this.el.querySelector('.cp-qa-error');
      addBtn.disabled = true;
      addBtn.textContent = 'Adding…';
      errorEl && errorEl.classList.remove('visible');

      const body = { items: [{ id: v.id, quantity: this.qty }] };
      if (this.selPlan === 'subscribe' && this.sellingPlanId) {
        body.items[0].selling_plan = this.sellingPlanId;
      }

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Cart add failed');
        this.close();
        document.dispatchEvent(new CustomEvent('cart:drawer:change'));
      } catch (e) {
        if (errorEl) { errorEl.textContent = 'Could not add to cart. Please try again.'; errorEl.classList.add('visible'); }
        addBtn.disabled = false;
        addBtn.innerHTML = SVG.cart + ' Add to cart';
      }
    },

    starsHtml(prod) {
      if (!prod.metafields) return '';
      return '';
    },

    formatMoney(cents) {
      if (window.themeHDN && window.themeHDN.settings && window.themeHDN.settings.moneyFormat && typeof formatMoney === 'function') {
        return formatMoney(cents, window.themeHDN.settings.moneyFormat);
      }
      return '$' + (cents / 100).toFixed(2).replace('.00', '');
    },

    escHtml(str) {
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    },
  };

  function openQuickAdd(handle) {
    drawer.open(handle);
  }

  /* ── Newsletter Inline ── */
  function initNewsletterInline() {
    const form = document.getElementById('cp-nl-form');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email  = form.querySelector('input[type=email]').value;
      const btn    = form.querySelector('button[type=submit]');
      const success = document.getElementById('cp-nl-success');
      if (!email) return;
      btn.disabled = true;
      btn.textContent = 'Subscribing…';
      try {
        await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ form_type: 'customer', utf8: '✓', 'contact[email]': email, 'contact[tags]': 'newsletter,homepage-popup' }),
        });
      } catch (_) {}
      form.style.display = 'none';
      if (success) success.classList.add('visible');
    });
  }

  /* ── Newsletter Popup ── */
  function initNewsletterPopup() {
    const popup = document.getElementById('cp-nl-popup');
    if (!popup) return;
    if (sessionStorage.getItem('cp-nl-seen')) return;

    function openPopup() {
      popup.classList.add('open');
      sessionStorage.setItem('cp-nl-seen', '1');
    }

    const scrollPct  = parseFloat(popup.dataset.scrollPct  || '40') / 100;
    const delaySecs  = parseInt(popup.dataset.delaySecs  || '28', 10);

    let fired = false;
    function onScroll() {
      if (fired) return;
      const depth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (depth > scrollPct) { fired = true; openPopup(); window.removeEventListener('scroll', onScroll); }
    }
    if (delaySecs > 0) setTimeout(() => { if (!fired) { fired = true; openPopup(); } }, delaySecs * 1000);
    window.addEventListener('scroll', onScroll, { passive: true });

    const backdrop = popup.querySelector('.cp-nl-popup__backdrop') || popup.querySelector('.cp-nl-backdrop');
    const closeBtn = popup.querySelector('#cp-nl-popup-close') || popup.querySelector('.cp-nl-close');
    if (backdrop) backdrop.addEventListener('click', () => popup.classList.remove('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => popup.classList.remove('open'));

    const dismiss = popup.querySelector('.cp-nl-dismiss');
    if (dismiss) dismiss.addEventListener('click', () => popup.classList.remove('open'));

    const form = popup.querySelector('.cp-nl-form');
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = form.querySelector('input[type=email]').value;
        if (!email) return;
        try {
          await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ form_type: 'customer', utf8: '✓', 'contact[email]': email, 'contact[tags]': 'newsletter,homepage-popup' }),
          });
        } catch (_) {}
        const success = popup.querySelector('.cp-nl-success');
        form.style.display = 'none';
        if (success) success.classList.add('visible');
      });
    }
  }

  /* ── Mobile Shop Bar ── */
  function initShopBar() {
    const bar = document.querySelector('.cp-shop-bar');
    if (!bar) return;
    function check() { bar.classList.toggle('visible', window.scrollY > 560); }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ── Quick Add buttons (delegate) ── */
  function initQuickAddDelegation() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-quick-add]');
      if (!btn) return;
      e.preventDefault();
      openQuickAdd(btn.dataset.quickAdd);
    });
    // Add-to-cart in drawer
    document.addEventListener('click', e => {
      if (e.target.closest('.cp-qa-add-btn')) {
        e.preventDefault();
        drawer.addToCart();
      }
    });
    // Notify Me — SC Back in Stock fallback if their event delegation isn't loaded
    document.addEventListener('click', e => {
      const btn = e.target.closest('.cp-qa-notify-btn');
      if (!btn) return;
      const variantId = btn.dataset.variantId;
      const productId = btn.dataset.productId;
      const productUrl = btn.dataset.productUrl;
      // SC Back in Stock (Shop Circle) exposes a JS API; try both known namespaces
      if (window.SC_BIS?.openModal) { window.SC_BIS.openModal(variantId); return; }
      if (window.SCBackInStock?.openForm) { window.SCBackInStock.openForm(productId, variantId); return; }
      // Their app embed uses document-level delegation on .sc-back-in-stock-button — that
      // should already fire before this handler via the class. If we get here it means the
      // app script hasn't loaded; fall back to the product page where the app block lives.
      if (productUrl) window.location.href = productUrl + (variantId ? '?variant=' + variantId : '');
    });
    // Quiz add button
    document.addEventListener('click', e => {
      const btn = e.target.closest('.cp-quiz-add-btn');
      if (!btn) return;
      openQuickAdd(btn.dataset.handle);
    });
  }

  /* ── Hero slider ── */
  function initHeroSlider() {
    const hero = document.getElementById('cp-hero');
    if (!hero) return;
    const slides = Array.from(hero.querySelectorAll('.cp-hero__slide'));
    if (slides.length <= 1) return;

    const dots    = Array.from(hero.querySelectorAll('.cp-hero__dot'));
    const prevBtn = hero.querySelector('.cp-hero__prev');
    const nextBtn = hero.querySelector('.cp-hero__next');
    const interval = parseInt(hero.dataset.interval || '0');
    let current = 0;
    let timer = null;

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }

    function startTimer() {
      if (interval > 0) timer = setInterval(() => goTo(current + 1), interval);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

    // Touch swipe
    let touchX = 0;
    hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); resetTimer(); }
    }, { passive: true });

    startTimer();
  }

  /* ── Scroll to section ── */
  function initScrollTargets() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-scroll-to]');
      if (!btn) return;
      e.preventDefault();
      const target = document.getElementById(btn.dataset.scrollTo);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  /* ── Init ── */
  function init() {
    if (window._cpHomepageInit) return;
    window._cpHomepageInit = true;
    initAnnouncement();
    initQuiz();
    drawer.init();
    initQuickAddDelegation();
    initNewsletterInline();
    initNewsletterPopup();
    initShopBar();
    initScrollTargets();
    initHeroSlider();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose for inline handlers
  window.cpOpenQuickAdd = openQuickAdd;
})();
