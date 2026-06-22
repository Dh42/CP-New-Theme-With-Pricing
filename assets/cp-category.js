/* ============================================================
   CP Category Page — in-grid block injection
   Listens for Globo Smart Filter events + MutationObserver;
   injects .cp-ingrid-source elements into the product grid
   after the configured Nth product card.
   ============================================================ */

(function () {
  'use strict';

  if (window._cpCatInit) return;
  window._cpCatInit = true;

  /* ── SC Back in Stock — Notify Me handler ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.cp-cat-card__notify-btn');
    if (!btn) return;

    var variantId  = btn.dataset.variantId;
    var productUrl = btn.dataset.productUrl;

    // If the SC BIS App Embed is enabled, their script adds a document-level listener
    // for clicks on #BIS_trigger. We create a hidden element with that ID, click it,
    // then clean up. If no modal opens (embed not yet enabled), we fall back to the
    // product page where the app block is already installed.
    if (variantId) {
      var trigger = document.createElement('button');
      trigger.id = 'BIS_trigger';
      trigger.setAttribute('data-variant-id', variantId);
      trigger.setAttribute('type', 'button');
      trigger.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;top:-9999px';
      document.body.appendChild(trigger);
      trigger.click();

      // Give the app 400 ms to open its modal before falling back
      setTimeout(function () {
        trigger.remove();
        // Check for any visible SC BIS modal/overlay
        var modal = document.querySelector(
          '[id*="BIS_"]:not([id="BIS_trigger"]), [class*="sc-bis"], [class*="BIS_"], [id*="sc-bis"]'
        );
        var modalVisible = modal && getComputedStyle(modal).display !== 'none'
                                 && getComputedStyle(modal).visibility !== 'hidden';
        if (!modalVisible && productUrl) {
          window.location.href = productUrl + (variantId ? '?variant=' + variantId : '');
        }
      }, 400);
    } else if (productUrl) {
      window.location.href = productUrl;
    }
  });

  var injectTimer = null;
  var busy = false;

  /* Find the Globo product grid container */
  function getGrid() {
    var card = document.querySelector('[class*="spf-col"]:not(.cp-ingrid-injected)');
    return card ? card.parentElement : null;
  }

  /* Main injection routine */
  function doInject() {
    if (busy) return;
    busy = true;

    var sources = document.querySelectorAll('.cp-ingrid-source');
    if (!sources.length) { busy = false; return; }

    var grid = getGrid();
    if (!grid) { busy = false; return; }

    /* Remove previous injections */
    var old = grid.querySelectorAll('.cp-ingrid-injected');
    for (var i = 0; i < old.length; i++) old[i].remove();

    /* Get current product cards (not our wrappers) */
    var allChildren = grid.children;
    var cards = [];
    for (var j = 0; j < allChildren.length; j++) {
      var el = allChildren[j];
      if (
        el.className &&
        typeof el.className === 'string' &&
        el.className.indexOf('spf-col') !== -1 &&
        !el.classList.contains('cp-ingrid-injected')
      ) {
        cards.push(el);
      }
    }

    if (!cards.length) { busy = false; return; }

    /* Sort sources by insert_after ascending so injections don't shift indices */
    var sortedSources = Array.prototype.slice.call(sources).sort(function (a, b) {
      return (parseInt(a.dataset.insertAfter, 10) || 0) - (parseInt(b.dataset.insertAfter, 10) || 0);
    });

    var offset = 0; /* track injections that shift subsequent card positions */
    sortedSources.forEach(function (source) {
      var n = parseInt(source.dataset.insertAfter, 10);
      if (!n || n < 1) return;

      /* Re-query cards after prior injections to get correct DOM order */
      var freshChildren = grid.children;
      var freshCards = [];
      for (var k = 0; k < freshChildren.length; k++) {
        var c = freshChildren[k];
        if (
          c.className &&
          typeof c.className === 'string' &&
          c.className.indexOf('spf-col') !== -1 &&
          !c.classList.contains('cp-ingrid-injected')
        ) {
          freshCards.push(c);
        }
      }

      var target = freshCards[n - 1];
      if (!target) return;

      var block = document.createElement('div');
      block.className = 'cp-ingrid-injected';
      block.innerHTML = source.innerHTML;
      target.insertAdjacentElement('afterend', block);
      offset++;
    });

    busy = false;
  }

  function scheduleInject() {
    clearTimeout(injectTimer);
    injectTimer = setTimeout(doInject, 220);
  }

  /* ── Reveal grid (undo flash-prevention hiding) ── */
  var gridRevealed = false;
  function revealGrid() {
    if (gridRevealed) return;
    gridRevealed = true;
    document.body.classList.add('cp-grid-ready');
  }
  // 800 ms safety fallback for pages that use the native grid without Globo
  setTimeout(revealGrid, 800);

  /* ── Globo event listeners ── */
  var globoEvents = [
    'gf:init', 'gf:page', 'gf:filter', 'gf:sort',
    'globo:loaded', 'globo:filter', 'globo:page', 'globo:sort',
    'spf:loaded', 'spf:filter', 'spf:page'
  ];
  globoEvents.forEach(function (name) {
    document.addEventListener(name, function () {
      revealGrid();
      scheduleInject();
    });
  });

  /* ── MutationObserver — fires on any childList change in the product area ── */
  var observer = new MutationObserver(scheduleInject);

  function startObserver() {
    /* Prefer the known HDT product grid container; fall back to body */
    var container =
      document.querySelector('.hdt-collection-products') ||
      document.querySelector('[class*="gf-product"]') ||
      document.querySelector('[class*="globo-filter"]') ||
      document.querySelector('.main-collection-products') ||
      document.querySelector('[id*="gf_products"]') ||
      document.body;

    observer.observe(container, { childList: true, subtree: true });
  }

  /* ── Boot ── */
  function init() {
    startObserver();
    scheduleInject();
    /* Retry injection to handle slow Globo AJAX rendering */
    setTimeout(scheduleInject, 600);
    setTimeout(scheduleInject, 1400);
    setTimeout(scheduleInject, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
