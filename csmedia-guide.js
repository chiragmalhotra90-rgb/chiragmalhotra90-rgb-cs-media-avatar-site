/*!
 * CS Media & Production — lightweight cross-site section guide.
 * Text-only, dependency-free, and intentionally hidden inside embedded pages.
 */
(function () {
  'use strict';

  try {
    if (window.self !== window.top) return;
  } catch (frameError) {
    return;
  }

  try {
    if (window.__csGuideBooted) return;
    window.__csGuideBooted = true;

    var DESTINATIONS = [
      ['Build a growth system', '/'],
      ['Explain and sell with AI', '/ai-presenter'],
      ['Create custom photo and video', '/cinematic.html'],
      ['Design a unique digital experience', '/casual.html'],
      ['Compare services and packages', '/services.html'],
      ['See client work', '/work.html'],
      ['Open Knowledge and tools', '/knowledge.html'],
      ['Explore Real Estate solutions', '/real-estate.html']
    ];

    function normalizedPath(pathname) {
      var path = String(pathname || '/').replace(/\/{2,}/g, '/');
      if (path.length > 1) path = path.replace(/\/+$/, '');

      if (
        path === '/' || path === '/index' || path === '/index.html' ||
        path === '/professional' || path === '/professional.html'
      ) return '/';

      if (
        path === '/ai-presenter' || path === '/ai-presenter/' ||
        path === '/ai-presenter/index.html'
      ) return '/ai-presenter';

      return path;
    }

    function make(tag, className, textValue) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (textValue != null) node.textContent = textValue;
      return node;
    }

    var CSS = [
      '.csg-backdrop[hidden],.csg-root[hidden],.csg-panel[hidden]{display:none!important}',
      '.csg-root,.csg-root *{box-sizing:border-box}',
      '.csg-backdrop{position:fixed;inset:0;z-index:88;background:rgba(0,0,0,.28);',
      ' -webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
      '.csg-root{position:fixed;left:max(16px,env(safe-area-inset-left));',
      ' bottom:calc(82px + env(safe-area-inset-bottom));z-index:89;',
      ' font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#f4f7f6}',
      '.csg-trigger{min-height:48px;padding:0 18px;border:1px solid rgba(255,255,255,.24);',
      ' border-radius:999px;background:rgba(8,11,13,.9);color:#fff;',
      ' -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);',
      ' box-shadow:0 12px 34px rgba(0,0,0,.34);font:700 13px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;',
      ' letter-spacing:.01em;cursor:pointer;transition:transform .2s,border-color .2s,background .2s}',
      '.csg-trigger:hover{transform:translateY(-1px);border-color:rgba(155,224,216,.7);background:rgba(13,19,21,.96)}',
      '.csg-panel{position:absolute;left:0;bottom:calc(100% + 12px);width:min(360px,calc(100vw - 32px));',
      ' padding:0;margin:0;box-sizing:border-box;',
      ' max-height:calc(100dvh - 186px);overflow:hidden;display:flex;flex-direction:column;',
      ' border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(8,12,14,.96);',
      ' -webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 24px 72px rgba(0,0,0,.55)}',
      '.csg-head{display:flex;align-items:center;justify-content:space-between;gap:14px;',
      ' padding:16px 14px 14px 18px;border-bottom:1px solid rgba(255,255,255,.1)}',
      '.csg-title{margin:0;font-size:15px;line-height:1.35;font-weight:750;color:#fff}',
      '.csg-subtitle{margin:3px 0 0;font-size:11px;line-height:1.4;color:rgba(255,255,255,.58)}',
      '.csg-close{min-width:52px;min-height:44px;padding:0 10px;border:1px solid rgba(255,255,255,.18);',
      ' border-radius:11px;background:transparent;color:#fff;font:650 12px/1 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;cursor:pointer}',
      '.csg-close:hover{background:rgba(255,255,255,.08)}',
      '.csg-nav{position:static;display:block;width:auto;height:auto;margin:0;box-sizing:border-box;',
      ' min-height:0;overflow:auto;padding:8px;overscroll-behavior:contain;background:transparent;border:0;transform:none}',
      '.csg-link{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:50px;margin:0;',
      ' padding:8px 11px;border:1px solid transparent;border-radius:11px;color:#f4f7f6;text-decoration:none;',
      ' font-size:14px;line-height:1.35}',
      '.csg-link:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.1)}',
      '.csg-link[aria-current="page"]{background:rgba(155,224,216,.11);border-color:rgba(155,224,216,.34)}',
      '.csg-status{flex:none;font-size:10px;line-height:1.2;font-weight:750;letter-spacing:.05em;',
      ' text-transform:uppercase;color:#9be0d8;text-align:right}',
      '.csg-trigger:focus-visible,.csg-close:focus-visible,.csg-link:focus-visible{outline:3px solid #9be0d8;outline-offset:2px}',
      '@media(max-width:480px){',
      ' .csg-root{left:12px;right:12px;bottom:calc(82px + env(safe-area-inset-bottom))}',
      ' .csg-trigger{max-width:100%}',
      ' .csg-panel{position:fixed;left:12px;right:12px;bottom:calc(142px + env(safe-area-inset-bottom));',
      ' width:auto;max-height:calc(100dvh - 230px - env(safe-area-inset-top));border-radius:16px}',
      ' .csg-link{min-height:52px}',
      '}',
      '@media(prefers-reduced-motion:reduce){.csg-trigger{transition:none}}'
    ].join('');

    var style = make('style');
    style.setAttribute('data-cs-guide-style', '');
    style.textContent = CSS;
    document.head.appendChild(style);

    var backdrop = make('div', 'csg-backdrop');
    backdrop.hidden = true;
    backdrop.setAttribute('data-cs-skip', '');

    var root = make('div', 'csg-root');
    root.setAttribute('data-cs-skip', '');

    var panel = make('section', 'csg-panel');
    panel.id = 'csmedia-guide-panel';
    panel.hidden = true;
    panel.setAttribute('inert', '');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'csmedia-guide-title');

    var head = make('div', 'csg-head');
    var headingWrap = make('div');
    var title = make('h2', 'csg-title', 'Choose what you need');
    title.id = 'csmedia-guide-title';
    headingWrap.appendChild(title);
    headingWrap.appendChild(make('p', 'csg-subtitle', 'Go straight to the right CS Media section.'));

    var closeButton = make('button', 'csg-close', 'Close');
    closeButton.type = 'button';
    closeButton.setAttribute('data-cs-skip', '');
    closeButton.setAttribute('aria-label', 'Close Explore CS Media');
    head.appendChild(headingWrap);
    head.appendChild(closeButton);
    panel.appendChild(head);

    var nav = make('nav', 'csg-nav');
    nav.setAttribute('aria-label', 'CS Media destinations');
    var currentPath = normalizedPath(window.location.pathname);

    DESTINATIONS.forEach(function (destination) {
      var link = make('a', 'csg-link');
      link.href = destination[1];
      link.setAttribute('data-cs-skip', '');
      link.appendChild(make('span', '', destination[0]));
      if (normalizedPath(destination[1]) === currentPath) {
        link.setAttribute('aria-current', 'page');
        link.appendChild(make('span', 'csg-status', 'You are here'));
      }
      nav.appendChild(link);
    });
    panel.appendChild(nav);

    var trigger = make('button', 'csg-trigger', 'Explore CS Media');
    trigger.type = 'button';
    trigger.setAttribute('data-cs-skip', '');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-haspopup', 'dialog');

    root.appendChild(panel);
    root.appendChild(trigger);
    document.body.appendChild(backdrop);
    document.body.appendChild(root);

    var isOpen = false;
    var restoreFocus = null;
    var savedOverflow = '';
    var scrollLocked = false;
    var layerSyncSoon = 0;
    var layerSyncLater = 0;

    function lockScroll() {
      if (scrollLocked || !window.matchMedia('(max-width: 480px)').matches) return;
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      scrollLocked = true;
    }

    function unlockScroll() {
      if (!scrollLocked) return;
      document.body.style.overflow = savedOverflow;
      scrollLocked = false;
    }

    function openGuide() {
      if (isOpen || root.hidden) return;
      isOpen = true;
      restoreFocus = document.activeElement;
      panel.hidden = false;
      panel.removeAttribute('inert');
      backdrop.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      lockScroll();
      var current = panel.querySelector('[aria-current="page"]');
      var firstLink = panel.querySelector('a[href]');
      (current || firstLink || closeButton).focus();
    }

    function closeGuide(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      panel.hidden = true;
      panel.setAttribute('inert', '');
      backdrop.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      unlockScroll();
      if (returnFocus !== false && restoreFocus && typeof restoreFocus.focus === 'function') {
        restoreFocus.focus();
      }
    }

    function foreignDialogOpen() {
      var candidates = document.querySelectorAll(
        '[role="dialog"],[aria-modal="true"],#csai,#modal,#aip-modal,#aip-demo,#lb,.panel.open'
      );
      for (var i = 0; i < candidates.length; i += 1) {
        var candidate = candidates[i];
        if (candidate === panel || panel.contains(candidate)) continue;
        if (candidate.hidden || candidate.getAttribute('aria-hidden') === 'true' || candidate.hasAttribute('inert')) continue;
        if (candidate.classList.contains('csm-drawer')) {
          if (candidate.classList.contains('open')) return true;
          continue;
        }
        var box = candidate.getBoundingClientRect();
        var visibleWidth = Math.min(box.right, window.innerWidth) - Math.max(box.left, 0);
        var visibleHeight = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
        if (visibleWidth > 16 && visibleHeight > 16) return true;
      }
      return false;
    }

    function syncWithPageLayers() {
      var suppress = foreignDialogOpen();
      if (suppress) closeGuide(false);
      root.hidden = suppress;
    }

    function queueLayerSync() {
      syncWithPageLayers();
      window.clearTimeout(layerSyncSoon);
      window.clearTimeout(layerSyncLater);
      layerSyncSoon = window.setTimeout(syncWithPageLayers, 0);
      layerSyncLater = window.setTimeout(syncWithPageLayers, 180);
    }

    trigger.addEventListener('click', function () {
      if (isOpen) closeGuide(true);
      else openGuide();
    });
    closeButton.addEventListener('click', function () { closeGuide(true); });
    backdrop.addEventListener('click', function () { closeGuide(true); });
    nav.addEventListener('click', function (event) {
      if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        closeGuide(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeGuide(true);
        return;
      }
      if (event.key !== 'Tab') return;

      var focusable = panel.querySelectorAll('a[href],button:not([disabled])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('click', function (event) {
      var menuButton = event.target.closest && event.target.closest('.csm-burger');
      if (menuButton) closeGuide(false);
      queueLayerSync();
    }, true);
    document.addEventListener('focusin', function () {
      queueLayerSync();
    }, true);

    syncWithPageLayers();
  } catch (guideError) {
    /* The guide is optional; existing page behavior must remain independent. */
  }
}());
