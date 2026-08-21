/*!
 * CS Media & Production — the common site menu.
 * One standard hamburger on the right of every page, opening one drawer
 * with the whole site grouped by topic. Include it with:
 *
 *   <script>window.CSMenuPage = {
 *     current: 'aipresenter' | 'professional' | 'cinematic' | 'casual',
 *     sections: [['Label', '#anchor'], ...]        // this page's own sections
 *   };</script>
 *   <script src="/csmedia-menu.js" defer></script>
 *
 * If the page's nav contains <span class="cs-menu-slot"></span> the burger
 * is placed there (so it rides the nav); otherwise it fixes to the top-right.
 * The drawer is deliberately brand-neutral — the four versions each have
 * their own theme, and the one shared control has to sit on all of them.
 */
(function () {
  'use strict';
  if (window.__csMenuBooted) return; window.__csMenuBooted = true;

  var PAGE = window.CSMenuPage || {};
  var CUR = PAGE.current || '';

  var VERSIONS = [
    ['aipresenter',  'AI Presenter', '/ai-presenter',      'avatar · presenter-led content'],
    ['professional', 'Professional', '/professional.html', 'websites · CRM · automation · growth'],
    ['cinematic',    'Cinematic',    '/cinematic.html',    'custom shoots · film · campaigns'],
    ['casual',       'Casual',       '/casual.html',        'UI/UX · creative service experiences']
  ];
  var EXPLORE = [
    ['Services & Packages', '/services.html', 'choose the right world'],
    ['See Our Work', '/work.html', '8 selected cases']
  ];
  var INDUSTRIES = [
    ['Real Estate', '/real-estate.html', 'videos · content · AI']
  ];
  var KNOWLEDGE = [
    ['The Digital Marketing Map', '/knowledge.html#map'],
    ['Creative Knowledge Library', '/knowledge.html#creative-library', '51 quick links'],
    ['Knowledge Nexus', '/knowledge.html#nexus', 'coming soon']
  ];
  var ACTIONS = [
    ['Watch Maya explain AI Presenter', '/ai-presenter#watch'],
    ['Book a business demo', '/ai-presenter#contact'],
    ['Email us', 'mailto:info@csmediaandproduction.in']
  ];

  var CSS = [
    '.csm-burger{width:42px;height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.24);',
    ' background:rgba(8,10,12,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
    ' cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0;',
    ' transition:background .25s,border-color .25s;pointer-events:auto}',
    '.csm-burger:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.4)}',
    '.csm-burger svg{width:20px;height:20px;stroke:#fff;stroke-width:2;stroke-linecap:round}',
    '.csm-burger.csm-fixed{position:fixed;top:18px;right:18px;z-index:8990}',
    '.csm-ovl{position:fixed;inset:0;background:rgba(0,0,0,.55);opacity:0;pointer-events:none;transition:opacity .3s;z-index:9000}',
    '.csm-ovl.open{opacity:1;pointer-events:auto}',
    '.csm-drawer{position:fixed;top:0;right:0;bottom:0;width:min(400px,94vw);z-index:9001;',
    ' background:rgba(9,12,14,.93);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);',
    ' border-left:1px solid rgba(255,255,255,.12);transform:translateX(103%);',
    ' transition:transform .35s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;',
    ' font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#f2f5f4}',
    '.csm-drawer.open{transform:none}',
    '@media (prefers-reduced-motion:reduce){.csm-drawer,.csm-ovl{transition:none}}',
    '.csm-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px 22px 14px 26px;border-bottom:1px solid rgba(255,255,255,.1)}',
    '.csm-brand{font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.85)}',
    '.csm-brand small{display:block;font-size:9px;letter-spacing:.28em;color:rgba(255,255,255,.4);margin-top:3px}',
    '.csm-close{width:38px;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-size:16px;cursor:pointer;flex:none}',
    '.csm-close:hover{background:rgba(255,255,255,.1)}',
    '.csm-body{overflow-y:auto;padding:6px 26px 44px;flex:1;overscroll-behavior:contain}',
    '.csm-g{margin-top:26px}',
    '.csm-gt{font-size:10.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-bottom:8px}',
    '.csm-a{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 12px;margin:0 -12px;',
    ' border-radius:10px;color:#f2f5f4;text-decoration:none;font-size:15px;line-height:1.35}',
    '.csm-a:hover{background:rgba(255,255,255,.08)}',
    '.csm-a small{color:rgba(255,255,255,.42);font-size:11.5px;text-align:right;flex:none}',
    '.csm-a.cur{background:rgba(255,255,255,.09)}',
    '.csm-a.cur small{color:#9be0d8}',
    '.csm-a:focus-visible,.csm-close:focus-visible,.csm-burger:focus-visible{outline:2px solid #9be0d8;outline-offset:2px}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var burger = el('button', 'csm-burger');
  burger.type = 'button';
  // the BendyButton engine converts loose <button>s into 3D keys; the one
  // shared menu must look identical on every version, so opt everything out
  burger.setAttribute('data-cs-skip', '');
  burger.setAttribute('aria-label', 'Open menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

  var ovl = el('div', 'csm-ovl');
  var drawer = el('aside', 'csm-drawer');
  drawer.setAttribute('data-cs-skip', '');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Site menu');

  var head = el('div', 'csm-head');
  head.appendChild(el('div', 'csm-brand', 'CS Media &amp; Production<small>Site menu</small>'));
  var closeBtn = el('button', 'csm-close', '✕');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close menu');
  head.appendChild(closeBtn);
  drawer.appendChild(head);

  var body = el('div', 'csm-body');

  function group(title) {
    var g = el('div', 'csm-g');
    g.appendChild(el('div', 'csm-gt', esc(title)));
    body.appendChild(g);
    return g;
  }
  function row(g, label, href, note, cls) {
    var a = el('a', 'csm-a' + (cls ? ' ' + cls : ''));
    a.href = href;
    a.innerHTML = '<span>' + esc(label) + '</span>' + (note ? '<small>' + esc(note) + '</small>' : '');
    g.appendChild(a);
    return a;
  }

  if (PAGE.sections && PAGE.sections.length) {
    var gs = group('On this page');
    PAGE.sections.forEach(function (s) { row(gs, s[0], s[1]); });
  }

  var gv = group('Website versions');
  VERSIONS.forEach(function (v) {
    var here = v[0] === CUR;
    var a = row(gv, v[1], v[2], here ? 'You are here' : v[3], here ? 'cur' : '');
    if (here) a.setAttribute('aria-current', 'page');
    a.addEventListener('click', function () {
      try { localStorage.setItem('cs_mode', v[0]); } catch (e) {}
    });
  });

  var ge = group('Explore');
  EXPLORE.forEach(function (k) { row(ge, k[0], k[1], k[2]); });

  var gi = group('Industries');
  INDUSTRIES.forEach(function (k) { row(gi, k[0], k[1], k[2]); });

  var gk = group('Knowledge');
  KNOWLEDGE.forEach(function (k) { row(gk, k[0], k[1], k[2]); });

  var ga = group('Get started');
  ACTIONS.forEach(function (k) { row(ga, k[0], k[1]); });

  drawer.appendChild(body);

  var open = false, prevOverflow = '';
  function setOpen(v) {
    open = v;
    ovl.classList.toggle('open', v);
    drawer.classList.toggle('open', v);
    burger.setAttribute('aria-expanded', String(v));
    if (v) {
      prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      closeBtn.focus();
    } else {
      document.documentElement.style.overflow = prevOverflow;
      burger.focus();
    }
  }
  burger.addEventListener('click', function () { setOpen(true); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  ovl.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
  // same-page anchors should close the drawer and scroll, not leave it parked open
  body.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a && a.getAttribute('href') && a.getAttribute('href').charAt(0) === '#') setOpen(false);
  });

  function place() {
    var slot = document.querySelector('.cs-menu-slot');
    if (slot) slot.appendChild(burger);
    else { burger.classList.add('csm-fixed'); document.body.appendChild(burger); }
    document.body.appendChild(ovl);
    document.body.appendChild(drawer);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place);
  else place();
})();
