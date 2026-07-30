/*!
 * CS Media & Production — shared hero lines
 *
 * One source of truth for the rotating landing headline. Every version of the
 * site reads this list and renders it in its own type, so the message is the
 * same whether a visitor lands on Professional, Cinematic or Casual.
 *
 *   <script src="/csmedia-hero-lines.js"></script>   ← load before your hero script
 *
 * Each entry is split the way all three versions already set their headline:
 *   lead   — plain, in the page's primary text colour
 *   accent — the part that carries the version's gradient
 *
 * Edit the copy here and it changes everywhere. Keep the lead short; it is the
 * line that has to survive a 380px phone without wrapping to three rows.
 */
(function (root) {
  'use strict';

  var LINES = [
    { lead: 'ONE BRIEF.',                              accent: 'A COMPLETE GROWTH SYSTEM.' },
    { lead: 'TURN YOUR BUSINESS INTO',                 accent: 'A SYSTEM THAT SELLS.' },
    { lead: 'AGENCIES SELL HOURS.',                    accent: 'YOU BUY OUTCOMES.' },
    { lead: 'YOUR BRAND, CONTENT, WEBSITE AND AI',     accent: 'WORKING AS ONE.' },
    { lead: 'TWELVE SERVICES.',                        accent: 'ONE ENGINE.' },
    { lead: 'STOP MANAGING VENDORS.',                  accent: 'START BUILDING MOMENTUM.' },
    { lead: 'NO STUDIO. NO CREW.',                     accent: 'NO RESHOOTS.' },
    { lead: 'OLD SCHOOL CRAFT.',                       accent: 'NEW ERA TECH.' },
    { lead: 'FROM INTAKE TO LAUNCH',                   accent: 'IN THREE DAYS.' },
    { lead: 'YOUR PRESENTER,',                         accent: 'RENDERED ON DEMAND.' },
    { lead: 'LEADS STOP LEAKING.',                     accent: 'THE LOOP KEEPS RUNNING.' },
    { lead: 'BUILD THE BRAND. CONNECT THE SYSTEM.',    accent: 'GROW FASTER.' },
    { lead: 'BRINGING YOUR',                           accent: 'BRAND TO LIFE.' }
  ];

  /* How long each line holds. One number, so the three versions cannot drift. */
  var INTERVAL = 5000;

  /* Auto-updating text has to be able to stop — a headline that rewrites itself
     every five seconds is exactly what WCAG 2.2.2 is about, and someone who has
     asked for reduced motion should get a headline that sits still. It also
     pauses on a hidden tab so a backgrounded page does not silently burn
     through the whole list. */
  function rotate(opts) {
    opts = opts || {};
    var lines    = opts.lines || LINES;
    var every    = opts.interval || INTERVAL;
    var onChange = opts.onChange;
    if (typeof onChange !== 'function' || !lines.length) return { stop: function () {} };

    var reduced = false;
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    if (reduced) return { stop: function () {} };   // entry 0 is already on screen

    var i = 0, timer = null;

    function tick() {
      i = (i + 1) % lines.length;
      onChange(lines[i], i);
    }
    function start() { if (!timer) timer = setInterval(tick, every); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();

    return { stop: stop, next: tick, index: function () { return i; } };
  }

  root.CSHero = { lines: LINES, interval: INTERVAL, rotate: rotate };
})(window);
