/*!
 * Bendy3D v1.0.0 — layered 3D-key buttons. Zero dependencies.
 * Written from scratch for CS Media & Production. MIT licensed.
 *
 * The surface tilts toward the cursor over a solid depth wall, specular
 * light/dark radials track the pointer, and the face sinks into the wall on
 * press. Spring physics on release.
 *
 *   <button class="b3d" data-b3d>Submit</button>
 *   <script src="bendy3d.js" defer></script>
 *
 * API: Bendy3D.init() | .create(el, opts) | .destroy(el) | .refresh()
 *      instance.update({ tilt: 16, depth: 10, surface: '#C1440E' })
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Bendy3D = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DEFAULTS = {
    tilt: 11,          // max degrees of rotation toward the cursor
    depth: 4,          // px of side wall
    perspective: 600,  // px
    press: 0.98,       // scale while held
    sinkRatio: 0.75,   // how much of the wall collapses on press
    stiffness: 0.17,
    damping: 0.76,
    gloss: 0.10,       // peak alpha of the cursor-tracked specular pair
    radius: null,      // px, null = leave it to CSS
    surface: null,     // colour overrides (optional — CSS vars are the main route)
    depthColor: null,
    shadowColor: null
  };

  var instances = [];
  var ticking = false;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function num(v, f) { var n = parseFloat(v); return isNaN(n) ? f : n; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ------------------------------------------------------------------ core */

  function B3D(el, options) {
    if (el.__b3d) return el.__b3d;

    var o = {};
    for (var k in DEFAULTS) o[k] = DEFAULTS[k];
    for (var k2 in (options || {})) if (options[k2] != null) o[k2] = options[k2];

    var d = el.dataset;
    if (d.tilt)        o.tilt        = num(d.tilt, o.tilt);
    if (d.depth)       o.depth       = num(d.depth, o.depth);
    if (d.perspective) o.perspective = num(d.perspective, o.perspective);
    if (d.press)       o.press       = num(d.press, o.press);
    if (d.stiffness)   o.stiffness   = num(d.stiffness, o.stiffness);
    if (d.damping)     o.damping     = num(d.damping, o.damping);
    if (d.gloss)       o.gloss       = num(d.gloss, o.gloss);
    if (d.radius)      o.radius      = num(d.radius, o.radius);
    if (d.surface)     o.surface     = d.surface;
    if (d.depthColor)  o.depthColor  = d.depthColor;

    this.el = el;
    this.o = o;

    // spring state: [current, velocity, target]
    this.sx = [0, 0, 0];   // -1..1 horizontal cursor position
    this.sy = [0, 0, 0];   // -1..1 vertical
    this.sp = [0, 0, 0];   // press 0..1
    this.sh = [0, 0, 0];   // hover 0..1 (fades the specular pair in)

    el.__b3d = this;
    el.classList.add('b3d-ready');
    this._build();
    this._applyVars();
    this._bind();
    this._paint();

    instances.push(this);
    return this;
  }

  /* Some of the host page's own handlers write content straight onto the
     button, e.g. on the casual home:

       b.classList.add('saved'); b.textContent = '✓';
       setTimeout(function () { b.textContent = b.dataset.rcSave; }, 900);

     Once a button is converted, that assignment wipes the whole layer stack
     and leaves a dead button with __b3d still set, so it never rebuilds.
     Redirecting the content accessors on the host into the label keeps every
     such handler working with no change to the page's own JavaScript.

     Reads stay truthful: el.textContent still returns the visible label text,
     which is what the site's [data-ap] tracker falls back to. */
  var CONTENT_PROPS = ['textContent', 'innerText', 'innerHTML'];

  function contentDescriptor(prop) {
    var protos = [Node.prototype, Element.prototype, HTMLElement.prototype];
    for (var i = 0; i < protos.length; i++) {
      var d = Object.getOwnPropertyDescriptor(protos[i], prop);
      if (d && d.get && d.set) return d;
    }
    return null;
  }

  B3D.prototype._shimContent = function () {
    var label = this.label;
    if (!label) return;
    var el = this.el;
    this._shimmed = [];
    for (var i = 0; i < CONTENT_PROPS.length; i++) {
      var prop = CONTENT_PROPS[i];
      var desc = contentDescriptor(prop);
      if (!desc) continue;
      try {
        Object.defineProperty(el, prop, {
          configurable: true,
          enumerable: false,
          get: (function (d) { return function () { return d.get.call(label); }; })(desc),
          set: (function (d) { return function (v) { d.set.call(label, v); }; })(desc)
        });
        this._shimmed.push(prop);
      } catch (e) { /* frozen element — leave it native */ }
    }
  };

  B3D.prototype._unshimContent = function () {
    var el = this.el;
    (this._shimmed || []).forEach(function (p) {
      try { delete el[p]; } catch (e) {}
    });
    this._shimmed = [];
  };

  B3D.prototype._build = function () {
    var el = this.el;
    if (el.querySelector(':scope > .b3d__surface')) {
      this.surface = el.querySelector(':scope > .b3d__surface');
      this.label = el.querySelector('.b3d__label');
      this._shimContent();
      return;
    }

    // Move whatever was inside into the label, then build the stack around it.
    var label = document.createElement('span');
    label.className = 'b3d__label';
    while (el.firstChild) label.appendChild(el.firstChild);

    var mk = function (cls) {
      var s = document.createElement('span');
      s.className = cls;
      s.setAttribute('aria-hidden', 'true');
      return s;
    };

    var shadow  = mk('b3d__shadow');
    var depth   = mk('b3d__depth');
    var surface = mk('b3d__surface');

    // Order matters: static lighting first, cursor-tracked on top, edge last.
    ['b3d__sheen', 'b3d__reflect', 'b3d__dark', 'b3d__light', 'b3d__dent', 'b3d__edge']
      .forEach(function (c) { surface.appendChild(mk(c)); });

    surface.appendChild(label);
    el.appendChild(shadow);
    el.appendChild(depth);
    el.appendChild(surface);

    this.shadow = shadow;
    this.depth = depth;
    this.surface = surface;
    this.label = label;
    this._shimContent();
  };

  B3D.prototype._applyVars = function () {
    var o = this.o, s = this.el.style;
    s.setProperty('--b3d-persp', o.perspective + 'px');
    s.setProperty('--b3d-depth-size', o.depth + 'px');
    s.setProperty('--b3d-tilt', o.tilt + 'deg');
    if (o.radius != null)    s.setProperty('--b3d-radius', o.radius + 'px');
    if (o.surface)           s.setProperty('--b3d-surface', o.surface);
    if (o.depthColor)        s.setProperty('--b3d-depth', o.depthColor);
    if (o.shadowColor)       s.setProperty('--b3d-shadow-color', o.shadowColor);
  };

  B3D.prototype._bind = function () {
    var self = this;

    this._onMove = function (e) {
      var r = self.el.getBoundingClientRect();
      self.sx[2] = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
      self.sy[2] = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
      self.sh[2] = 1;
      self._wake();
    };
    this._onLeave = function () {
      self.sx[2] = 0; self.sy[2] = 0; self.sp[2] = 0; self.sh[2] = 0; self._wake();
    };
    this._onDown = function () { self.sp[2] = 1; self.sh[2] = 1; self._wake(); };
    this._onUp   = function () { self.sp[2] = 0; self._wake(); };

    this.el.addEventListener('pointermove', this._onMove);
    this.el.addEventListener('pointerleave', this._onLeave);
    this.el.addEventListener('pointercancel', this._onLeave);
    this.el.addEventListener('pointerdown', this._onDown);
    window.addEventListener('pointerup', this._onUp);

    this._onKey = function (e) { if (e.key === ' ' || e.key === 'Enter') self._onDown(); };
    this.el.addEventListener('keydown', this._onKey);
    this.el.addEventListener('keyup', this._onUp);
    this.el.addEventListener('blur', this._onLeave);
  };

  B3D.prototype._wake = function () {
    if (reduced) { this._paint(); return; }
    this.awake = true;
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  };

  B3D.prototype._step = function () {
    var o = this.o, still = true;
    var springs = [this.sx, this.sy, this.sp, this.sh];
    for (var i = 0; i < springs.length; i++) {
      var s = springs[i];
      s[1] = (s[1] + (s[2] - s[0]) * o.stiffness) * o.damping;
      s[0] += s[1];
      if (Math.abs(s[1]) > 0.0004 || Math.abs(s[2] - s[0]) > 0.0004) still = false;
    }
    if (still) {
      for (var j = 0; j < springs.length; j++) { springs[j][0] = springs[j][2]; springs[j][1] = 0; }
      this.awake = false;
    }
    this._paint();
    return !still;
  };

  B3D.prototype._paint = function () {
    var o = this.o, s = this.el.style;
    var nx = this.sx[0], ny = this.sy[0], p = this.sp[0], hv = this.sh[0];

    // Tilt: leaning toward the cursor means rotating about X the opposite way.
    s.setProperty('--b3d-ry', (nx * o.tilt).toFixed(2) + 'deg');
    s.setProperty('--b3d-rx', (-ny * o.tilt).toFixed(2) + 'deg');

    // Press: shrink a touch, and let the face sink into the wall.
    var scale = 1 - (1 - o.press) * p;
    var wall = o.depth * (1 - o.sinkRatio * p);
    s.setProperty('--b3d-scale', scale.toFixed(4));
    s.setProperty('--b3d-wall', wall.toFixed(2) + 'px');
    s.setProperty('--b3d-sink', (o.depth - wall).toFixed(2) + 'px');
    s.setProperty('--b3d-press', p.toFixed(3));

    // The cast shadow slides opposite the tilt and tightens under pressure.
    s.setProperty('--b3d-shx', (-nx * o.depth * 0.9).toFixed(2) + 'px');
    this.shadow.style.opacity = (1 - p * 0.45).toFixed(3);

    // Specular pair follows the pointer; --b3d-light mirrors it in CSS.
    s.setProperty('--b3d-px', (50 + nx * 50).toFixed(2) + '%');
    s.setProperty('--b3d-py', (50 + ny * 50).toFixed(2) + '%');
    var a = o.gloss * (hv * 0.65 + p * 0.35);
    s.setProperty('--b3d-dark-a', a.toFixed(4));
    s.setProperty('--b3d-light-a', (a * 1.15).toFixed(4));
  };

  B3D.prototype.update = function (patch) {
    for (var k in (patch || {})) if (patch[k] != null) this.o[k] = patch[k];
    this._applyVars();
    this._paint();
    return this;
  };

  B3D.prototype.destroy = function () {
    this.el.removeEventListener('pointermove', this._onMove);
    this.el.removeEventListener('pointerleave', this._onLeave);
    this.el.removeEventListener('pointercancel', this._onLeave);
    this.el.removeEventListener('pointerdown', this._onDown);
    this.el.removeEventListener('keydown', this._onKey);
    this.el.removeEventListener('keyup', this._onUp);
    window.removeEventListener('pointerup', this._onUp);

    this._unshimContent();

    if (this.label) {
      while (this.label.firstChild) this.el.appendChild(this.label.firstChild);
    }
    [this.shadow, this.depth, this.surface].forEach(function (n) { if (n) n.remove(); });
    this.el.classList.remove('b3d-ready');
    ['--b3d-rx', '--b3d-ry', '--b3d-scale', '--b3d-sink', '--b3d-wall', '--b3d-px',
     '--b3d-py', '--b3d-press', '--b3d-dark-a', '--b3d-light-a', '--b3d-shx',
     '--b3d-persp', '--b3d-depth-size', '--b3d-tilt']
      .forEach(function (v) { this.el.style.removeProperty(v); }, this);
    instances.splice(instances.indexOf(this), 1);
    delete this.el.__b3d;
  };

  function tick() {
    var any = false;
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].awake && instances[i]._step()) any = true;
    }
    if (any) requestAnimationFrame(tick);
    else ticking = false;
  }

  /* ---------------------------------------------------------------- public */

  var API = {
    version: '1.0.0',
    defaults: DEFAULTS,
    create: function (el, opts) { return new B3D(el, opts); },
    init: function (target, opts) {
      var list;
      if (!target) list = document.querySelectorAll('[data-b3d]');
      else if (typeof target === 'string') list = document.querySelectorAll(target);
      else if (target.length != null) list = target;
      else list = [target];
      var made = [];
      for (var i = 0; i < list.length; i++) made.push(new B3D(list[i], opts));
      return made;
    },
    destroy: function (el) {
      if (el && el.__b3d) el.__b3d.destroy();
      else if (!el) instances.slice().forEach(function (b) { b.destroy(); });
    },
    refresh: function () { instances.forEach(function (b) { b._paint(); }); }
  };

  if (typeof document !== 'undefined') {
    var boot = function () { API.init(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }

  return API;
});
