/*!
 * CS Media & Production — BendyButton auto-init
 * Load AFTER the engine you want. Requires csmedia-bendy.css.
 *
 * TWO EFFECTS, pick one with the script tag:
 *   <script src="csmedia-bendy-init.js"></script>              → bend  (SVG silhouette)
 *   <script src="csmedia-bendy-init.js" data-mode="3d"></script> → 3d  (layered tilting key)
 * "3d" needs bendy3d.css + bendy3d.js loaded instead of bendy-button.*
 *
 * What it does, with zero changes to your HTML:
 *   1. Works out which version of the site it's on (professional / ai-presenter /
 *      casual / fun / gallery) and sets <html data-cs-bendy="..."> so the matching
 *      theme applies.
 *   2. Converts every real button on the page — <button>, [role=button], and the
 *      anchors each version styles as buttons — with the feel tuned for that version.
 *   3. Watches for buttons added later (modals, tabs, AJAX) and does them too.
 *
 * Override the detection any time:
 *   <html data-cs-bendy="presenter">     ← set it yourself and detection is skipped
 *   <script src="csmedia-bendy-init.js" data-selector=".btn, .cta"></script>
 *   <button class="btn" data-cs-skip>    ← leave this one alone
 */
(function () {
  'use strict';

  /* Feel per version. Same engine, five personalities. */
  var FEEL = {
    // Tight, expensive, barely wobbles. Reads as "we know what we're doing."
    pro:       { mode: 'bend', strength: 10, stiffness: 0.20, damping: 0.86, press: 0.970, label: 0.35 },
    // Alive and responsive without being silly. Maya's page.
    presenter: { mode: 'bend', strength: 16, stiffness: 0.16, damping: 0.74, press: 0.950, label: 0.45 },
    // Playful — bends far, bounces twice before settling.
    casual:    { mode: 'bend', strength: 20, stiffness: 0.13, damping: 0.64, press: 0.935, label: 0.55 },
    // fun.html is the loosest page on the site; let it bounce hardest.
    fun:       { mode: 'bend', strength: 22, stiffness: 0.12, damping: 0.60, press: 0.930, label: 0.58 },
    // The gallery is a working tool, not a showpiece. Keep it crisp.
    gallery:   { mode: 'bend', strength: 11, stiffness: 0.21, damping: 0.85, press: 0.975, label: 0.35 },
    // The cinematic version is a title sequence. Controls move like the type:
    // deliberate, weighted, no wobble.
    cinematic: { mode: 'bend', strength: 9,  stiffness: 0.22, damping: 0.88, press: 0.972, label: 0.32 }
  };

  /* 3D-key feel per version — tilt and wall height instead of bend strength. */
  var FEEL3D = {
    pro:       { tilt: 9,  depth: 4,  press: 0.985, gloss: 0.07, damping: 0.82 },
    presenter: { tilt: 12, depth: 7,  press: 0.975, gloss: 0.10, damping: 0.76 },
    casual:    { tilt: 16, depth: 10, press: 0.965, gloss: 0.13, damping: 0.70 },
    fun:       { tilt: 18, depth: 11, press: 0.960, gloss: 0.14, damping: 0.66 },
    gallery:   { tilt: 10, depth: 5,  press: 0.982, gloss: 0.08, damping: 0.84 },
    cinematic: { tilt: 11, depth: 6,  press: 0.980, gloss: 0.06, damping: 0.83 }
  };

  /* ------------------------------------------------------------- selectors */

  /* Every real button, whatever it is built from. <button> and [role=button]
     cover the tag-based ones on every page; the anchor classes are the ones
     each version of the site styles to look like a button. */
  var UNIVERSAL = 'button, [role="button"]';

  /* Controls the page builds out of a <span> rather than a <button>. These are
     real buttons to a visitor — the gallery's category filter pills are spans —
     so they are listed per version rather than left behind. */
  var SPAN_CONTROLS = {
    gallery: '.chip'
  };

  var ANCHORS = {
    // professional.html
    pro:       'a.btn, a.cta, a.start-btn',
    // /ai-presenter
    presenter: 'a.btn, a.btn-primary, a.btn-secondary, a.lb-btn, a.csl-nav',
    // the casual home
    casual:    'a.btn, a.ch-primary, a.ch-ghost, a.primary, a.ghost, a.cta, ' +
               'a.start-btn, a.modal-send, a.modal-cancel, a.fun-link',
    // fun.html
    fun:       'a.talk-cta, a.talk-link, a.appt-btn, a.floating-cta, a.fun-link, ' +
               'a.btn, a.cta',
    // gallery/
    gallery:   'a.btn, a.show-all, a.back, a.cta'
  };

  /* Structural exclusions only — these are not "buttons we would rather leave
     alone", they are elements that would either break or are not buttons:

       input/select/textarea — void or form controls; they cannot hold the
                               layer stack the engine builds inside a host.
       .brand/.site-logo     — wordmarks. A logo is a link, not a button.
       .skip-link            — the keyboard skip-to-content affordance.
       .project-card/.tile   — full content cards, not controls.
       [data-cs-skip]        — the manual escape hatch, kept for the site's use.  */
  var NEVER = 'input, select, textarea, .brand, .site-logo, .skip-link, ' +
              '.project-card, .tile, [data-cs-skip]';

  var script = document.currentScript;
  var OVERRIDE = script && script.dataset.selector;
  var EFFECT = (script && script.dataset.mode) === '3d' ? '3d' : 'bend';

  /* ------------------------------------------------------ which version? */
  function detect() {
    var html = document.documentElement;

    // 1. You said so explicitly.
    if (html.dataset.csBendy) return html.dataset.csBendy;

    // 2. The path is unambiguous where it exists, so trust it before styles.
    var p = location.pathname;
    if (/ai-presenter/i.test(p)) return 'presenter';
    if (/cinematic/i.test(p)) return 'cinematic';
    if (/professional/i.test(p)) return 'pro';
    if (/\bfun\b/i.test(p)) return 'fun';
    if (/gallery/i.test(p)) return 'gallery';

    // 3. Otherwise the page's own CSS variables are the most reliable tell.
    var cs = getComputedStyle(html);
    var has = function (name) { return cs.getPropertyValue(name).trim() !== ''; };

    if (has('--ap-orange') || has('--ap-teal')) return 'presenter';
    if (has('--cyan') && has('--font-display')) return 'pro';
    if (has('--accent') && has('--base')) return 'casual';

    // 4. Fall back to the site's own stored preference.
    try {
      var m = localStorage.getItem('cs_mode');
      if (m === 'professional') return 'pro';
      if (m === 'cinematic') return 'cinematic';
      if (m === 'casual') return 'casual';
    } catch (e) {}

    return 'casual';
  }

  var version = detect();
  document.documentElement.dataset.csBendy = version;
  var feel = FEEL[version] || FEEL.casual;

  function selectorFor(v) {
    return UNIVERSAL + ', ' + (ANCHORS[v] || ANCHORS.casual) +
           (SPAN_CONTROLS[v] ? ', ' + SPAN_CONTROLS[v] : '');
  }
  var SELECTOR = OVERRIDE || selectorFor(version);

  /* --------------------------------------------------------- apply to buttons */
  function bendify(root) {
    var engine = EFFECT === '3d' ? window.Bendy3D : window.BendyButton;
    if (!engine) return;
    var list = (root || document).querySelectorAll(SELECTOR);

    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.__bendy || el.__b3d) continue;
      if (el.matches(NEVER) || el.closest('[data-cs-skip]')) continue;
      // Never build a stack inside a stack.
      if (el.closest('.b3d__label') || el.closest('.bendy__label')) continue;

      var r = el.getBoundingClientRect();

      // Icon-only round buttons (play, close, burger) look wrong at full tilt,
      // so they are converted with a shorter throw rather than skipped.
      var iconish = r.width && r.height && r.width < 56 && Math.abs(r.width - r.height) < 8;
      // A little less travel on small buttons so the shape stays readable.
      var scale = iconish ? 0.5 : (r.width && r.width < 150 ? 0.72 : 1);

      if (EFFECT === '3d') {
        var f3 = FEEL3D[version] || FEEL3D.casual;
        el.classList.add('b3d');
        el.setAttribute('data-b3d', '');
        engine.create(el, {
          tilt: f3.tilt * scale,
          depth: iconish ? Math.max(2, Math.round(f3.depth * 0.6)) : f3.depth,
          press: f3.press,
          gloss: f3.gloss,
          damping: f3.damping
        });
      } else {
        el.classList.add('bendy');
        el.setAttribute('data-bendy', feel.mode);
        engine.create(el, {
          mode: feel.mode,
          strength: Math.round(feel.strength * scale),
          stiffness: feel.stiffness,
          damping: feel.damping,
          press: feel.press,
          label: feel.label
        });
      }
    }
  }

  function boot() {
    bendify(document);

    // Buttons that appear later — tab panels, modals, lazy sections.
    if (typeof MutationObserver !== 'undefined') {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { pending = false; bendify(document); });
      }).observe(document.body, { childList: true, subtree: true });
    }

    // Webfonts (IBM Plex Mono / Poppins / Archivo) land after first paint and
    // change button width — re-measure or the shape sits off the text.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        var engine = EFFECT === '3d' ? window.Bendy3D : window.BendyButton;
        if (engine) engine.refresh();
      });
    }

    // With four versions the switcher scrolls sideways on a phone, so the
    // version you are actually on can start off-screen. Bring it into view
    // inside its own track — never the page.
    var active = document.querySelector('.mode-toggle .mt-btn.active');
    if (active && active.scrollIntoView) {
      var track = active.parentElement;
      if (track && track.scrollWidth > track.clientWidth) {
        track.scrollLeft = active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* Expose for debugging: CSMediaBendy.version / .rescan() */
  window.CSMediaBendy = {
    version: version,
    effect: EFFECT,
    selector: SELECTOR,
    feel: EFFECT === '3d' ? (FEEL3D[version] || FEEL3D.casual) : feel,
    rescan: function () { bendify(document); },
    setVersion: function (v) {
      document.documentElement.dataset.csBendy = v;
      version = v;
      feel = FEEL[v] || FEEL.casual;
      SELECTOR = OVERRIDE || selectorFor(v);
      this.version = v;
      this.selector = SELECTOR;
      (EFFECT === '3d' ? window.Bendy3D : window.BendyButton).destroy();
      bendify(document);
    }
  };
})();
