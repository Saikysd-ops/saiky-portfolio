/* ORBIT · entry point. The only file index.html references.
   Adds one fixed launcher dot. Everything else (panel, data, engine) loads the first time
   the visitor hovers, focuses, touches or clicks it. No network calls beyond this site's own files. */
(function () {
  'use strict';
  if (window.__ORBIT_BOOT__) return;
  window.__ORBIT_BOOT__ = true;

  var self = document.currentScript;
  var base = self && self.src ? self.src.replace(/[^\/]*$/, '') : 'orbit/';
  var FILES = ['data/knowledge.js', 'data/intents.js', 'data/responses.js', 'engine.js', 'ui.js'];
  var loading = null;

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
    var dot = document.createElement('span'); dot.className = 'orbit-launcher__dot'; dot.setAttribute('aria-hidden', 'true');
    var label = document.createElement('span'); label.className = 'orbit-launcher__label'; label.setAttribute('aria-hidden', 'true'); label.textContent = 'ORBIT';
    btn.appendChild(dot); btn.appendChild(label);
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
