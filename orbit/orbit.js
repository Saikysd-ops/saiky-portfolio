/* ORBIT · entry point. The only file index.html references.
   Adds one fixed launcher. Everything else (panel, data, engine) loads the first time
   the visitor hovers, focuses, touches or clicks it. No network calls beyond this site's own files. */
(function () {
  'use strict';
  if (window.__ORBIT_BOOT__) return;
  window.__ORBIT_BOOT__ = true;
  var ORBIT = (window.ORBIT = window.ORBIT || {});

  var self = document.currentScript;
  var base = self && self.src ? self.src.replace(/[^\/]*$/, '') : 'orbit/';
  var FILES = ['data/knowledge.js', 'data/intents.js', 'data/responses.js', 'engine.js', 'ui.js'];
  var loading = null;
  var NS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs) {
    var n = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  /* The ORBIT icon: a gradient ring with an orb on it. The orb sits in its own group (.orbit-mark__orb)
     so CSS can revolve it around the static ring. `id` keeps gradient/filter ids unique per instance. */
  ORBIT.mark = function (id) {
    var s = svgEl('svg', { viewBox: '0 0 512 512', 'class': 'orbit-mark', 'aria-hidden': 'true', focusable: 'false' });
    var defs = svgEl('defs');
    var lg = svgEl('linearGradient', { id: id + '-ring', x1: '90', y1: '70', x2: '430', y2: '440', gradientUnits: 'userSpaceOnUse' });
    var rg = svgEl('radialGradient', { id: id + '-orb', cx: '35%', cy: '28%', r: '78%' });
    [['0%', '#3157D5'], ['38%', '#7546D8'], ['70%', '#C54879'], ['100%', '#E46B5D']].forEach(function (t) {
      lg.appendChild(svgEl('stop', { offset: t[0], 'stop-color': t[1] }));
    });
    [['0%', '#3157D5'], ['45%', '#7546D8'], ['78%', '#C54879'], ['100%', '#E46B5D']].forEach(function (t) {
      rg.appendChild(svgEl('stop', { offset: t[0], 'stop-color': t[1] }));
    });
    var f = svgEl('filter', { id: id + '-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    f.appendChild(svgEl('feGaussianBlur', { stdDeviation: '8', result: 'blur' }));
    var m = svgEl('feMerge');
    m.appendChild(svgEl('feMergeNode', { 'in': 'blur' }));
    m.appendChild(svgEl('feMergeNode', { 'in': 'SourceGraphic' }));
    f.appendChild(m);
    defs.appendChild(lg); defs.appendChild(rg); defs.appendChild(f);
    s.appendChild(defs);
    s.appendChild(svgEl('circle', { cx: '256', cy: '256', r: '188', fill: 'none', stroke: 'url(#' + id + '-ring)', 'stroke-width': '16', 'stroke-linecap': 'round', filter: 'url(#' + id + '-glow)' }));
    var orb = svgEl('g', { 'class': 'orbit-mark__orb' });
    orb.appendChild(svgEl('circle', { cx: '382', cy: '118', r: '42', fill: 'url(#' + id + '-orb)', filter: 'url(#' + id + '-glow)' }));
    orb.appendChild(svgEl('circle', { cx: '382', cy: '118', r: '40', fill: 'url(#' + id + '-orb)' }));
    s.appendChild(orb);
    return s;
  };

  function css(href, onload) {
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + href;
    if (onload) l.onload = onload;
    document.head.appendChild(l);
    return l;
  }

  /* scripts download in parallel and execute in order */
  function loadAll() {
    if (loading) return loading;
    css('orbit.css');
    loading = new Promise(function (resolve, reject) {
      var left = FILES.length;
      FILES.forEach(function (f) {
        var s = document.createElement('script');
        s.src = base + f; s.async = false;
        s.onload = function () { if (--left === 0) resolve(); };
        s.onerror = function () { loading = null; reject(new Error('ORBIT: could not load ' + f)); };
        document.head.appendChild(s);
      });
    });
    return loading;
  }

  function start() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'orbit-launcher';
    btn.hidden = true;
    btn.setAttribute('aria-label', 'Open ORBIT, the portfolio guide');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    var mark = document.createElement('span'); mark.className = 'orbit-launcher__mark'; mark.setAttribute('aria-hidden', 'true');
    mark.appendChild(ORBIT.mark('orbit-l'));
    var label = document.createElement('span'); label.className = 'orbit-launcher__label'; label.setAttribute('aria-hidden', 'true'); label.textContent = 'ORBIT';
    btn.appendChild(mark); btn.appendChild(label);
    document.body.appendChild(btn);

    /* reveal only once its stylesheet is ready, so it never flashes unstyled */
    css('orbit-launcher.css', function () { btn.hidden = false; });

    var mounted = false;
    function ready() {
      return loadAll().then(function () {
        if (!mounted) { window.ORBIT.ui.mount(btn); mounted = true; }
      });
    }
    ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) {
      btn.addEventListener(ev, function () { ready().catch(function () {}); }, { once: true, passive: true });
    });
    btn.addEventListener('click', function () {
      if (mounted && window.ORBIT.ui.isOpen()) { window.ORBIT.ui.close(); return; }
      ready().then(function () { window.ORBIT.ui.open(); }).catch(function (e) { if (window.console) console.warn(e.message); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
