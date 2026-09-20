/* ORBIT · panel UI. Builds its own DOM with textContent only (no innerHTML), lives in one fixed element,
   and never touches the page underneath. */
(function (root) {
  'use strict';
  var ORBIT = (root.ORBIT = root.ORBIT || {});
  var K = ORBIT.knowledge, I = ORBIT.intents;
  var doc = root.document;

  var NS = 'http://www.w3.org/2000/svg';
  var state = { built: false, open: false, busy: false, launcher: null, engine: null };
  var refs = {};
  var mqMobile = root.matchMedia ? root.matchMedia('(max-width: 640px)') : { matches: false, addEventListener: function () {} };
  var mqReduce = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var mqCoarse = root.matchMedia ? root.matchMedia('(pointer: coarse)') : { matches: false };

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(path, size) {
    var s = doc.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('aria-hidden', 'true');
    var p = doc.createElementNS(NS, 'path');
    p.setAttribute('d', path); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2');
    p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    s.appendChild(p);
    if (size) { s.setAttribute('width', size); s.setAttribute('height', size); }
    return s;
  }
  function arrow() { return el('span', 'orbit-arrow', '→'); }
  function reduced() { return !!mqReduce.matches; }

  /* ---------- navigation into the existing site ---------- */
  function goTo(page) {
    close({ restoreFocus: false });
    var node = doc.querySelector('[data-view="' + page.view + '"]');
    if (node) { node.click(); return; }
    root.location.hash = page.hash || '#';
  }
  function bindNav(node, page) {
    node.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault();
      goTo(page);
    });
  }
  function caseHref(c) { return c.hash; }

  /* ---------- block renderers ---------- */
  function renderCard(id, opts) {
    var c = K.CASES[id];
    var card = el('div', 'orbit-card');
    card.appendChild(el('div', 'orbit-card-t', c.title));
    card.appendChild(el('span', 'orbit-card-m', c.meta));
    if (opts && opts.detail) {
      card.appendChild(el('p', 'orbit-card-d', c.desc));
      var pdi = el('div', 'orbit-pdi');
      [['Problem', c.problem], ['Decision', c.decision], ['Impact', c.impact.join(' ')]].forEach(function (r) {
        var row = el('div');
        row.appendChild(el('b', null, r[0]));
        row.appendChild(el('span', null, r[1]));
        pdi.appendChild(row);
      });
      if (opts.more) {
        var extra = (c.facts || []).map(function (t) { return ['Also', t]; });
        if (c.reflection) extra.push(['Reflection', '“' + c.reflection + '”']);
        extra.forEach(function (r) {
          var row = el('div');
          row.appendChild(el('b', null, r[0]));
          row.appendChild(el('span', null, r[1]));
          pdi.appendChild(row);
        });
      }
      card.appendChild(pdi);
    } else {
      card.appendChild(el('p', 'orbit-card-d', c.desc));
    }
    card.appendChild(el('div', 'orbit-card-tags', c.tags.join(' · ')));
    if (c.nda) card.appendChild(el('span', 'orbit-nda', 'NDA · public overview'));
    var a = el('a', 'orbit-cta');
    a.setAttribute('href', caseHref(c));
    a.appendChild(document.createTextNode('→ Explore case study'));
    a.setAttribute('aria-label', 'Explore case study: ' + c.title);
    bindNav(a, { view: c.view, hash: c.hash });
    card.appendChild(a);
    return card;
  }

  function renderBlock(b) {
    var n, ul, li;
    switch (b.t) {
      case 'kicker': return el('div', 'orbit-kicker', b.text);
      case 'p': return el('p', 'orbit-p', b.text);
      case 'note': return el('p', 'orbit-note', b.text);
      case 'quote':
        n = el('blockquote', 'orbit-quote'); n.style.margin = '0';
        n.appendChild(el('p', null, '“' + b.text + '”'));
        if (b.cite) n.appendChild(el('span', 'orbit-cite', b.cite));
        return n;
      case 'list':
        ul = el('ul', 'orbit-list');
        b.items.forEach(function (it) {
          li = el('li');
          var inner = it.ask ? el('button', 'orbit-li-btn') : el('div');
          if (it.ask) { inner.type = 'button'; inner.addEventListener('click', function () { askDirect(it.title, it.ask); }); }
          inner.appendChild(el('div', 'orbit-li-t', it.title));
          if (it.meta) inner.appendChild(el('span', 'orbit-li-m', it.meta));
          if (it.text) inner.appendChild(el('p', 'orbit-li-d', it.text));
          li.appendChild(inner); ul.appendChild(li);
        });
        return ul;
      case 'cards':
        n = el('div', 'orbit-cards');
        b.ids.forEach(function (id) { n.appendChild(renderCard(id)); });
        return n;
      case 'case':
        return renderCard(b.id, { detail: true, more: b.more });
      case 'rows':
        ul = el('ul', 'orbit-rows');
        b.ids.forEach(function (id) {
          var c = K.CASES[id];
          li = el('li');
          var a = el('a', 'orbit-row');
          a.setAttribute('href', caseHref(c));
          var left = el('span');
          left.appendChild(el('span', 'orbit-row-t', c.title));
          left.appendChild(el('span', 'orbit-row-m', c.meta + (c.nda ? ' · NDA' : '')));
          a.appendChild(left); a.appendChild(arrow());
          a.setAttribute('aria-label', c.title + (c.nda ? ' (public overview)' : ''));
          bindNav(a, { view: c.view, hash: c.hash });
          li.appendChild(a); ul.appendChild(li);
        });
        return ul;
      case 'links':
        n = el('div', 'orbit-links');
        b.items.forEach(function (it) {
          var a = el('a', 'orbit-link');
          a.appendChild(el('span', null, it.label));
          if (it.sub) a.appendChild(el('small', null, it.sub));
          if (it.external) {
            a.setAttribute('href', it.href);
            if (!/^mailto:/.test(it.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
            a.appendChild(el('span', 'orbit-arrow', /^mailto:/.test(it.href) ? '→' : '↗'));
          } else {
            a.setAttribute('href', it.nav.hash || '#');
            a.appendChild(arrow()); bindNav(a, it.nav);
          }
          n.appendChild(a);
        });
        return n;
    }
    return el('span');
  }

  function renderFollowups(list) {
    if (!list || !list.length) return null;
    var wrap = el('div', 'orbit-next');
    wrap.appendChild(el('span', 'orbit-kicker', 'Next'));
    list.forEach(function (f) {
      var b;
      if (f.nav) {
        b = el('a'); b.setAttribute('href', f.nav.hash || '#'); bindNav(b, f.nav);
      } else {
        b = el('button'); b.type = 'button';
        b.addEventListener('click', function () { askDirect(f.label, f); });
      }
      b.appendChild(el('span', null, f.label));
      b.appendChild(arrow());
      wrap.appendChild(b);
    });
    return wrap;
  }

  /* ---------- conversation ---------- */
  function scrollToTurn(turn) {
    /* skip the turn's own hairline + padding so it never doubles up with the header rule */
    var top = Math.max(0, turn.offsetTop + 7);
    if (refs.body.scrollTo) refs.body.scrollTo({ top: top, behavior: reduced() ? 'auto' : 'smooth' });
    else refs.body.scrollTop = top;
  }

  function announce(text) { refs.status.textContent = ''; root.setTimeout(function () { refs.status.textContent = text; }, 30); }

  function show(q, produce) {
    if (state.busy) return;
    state.busy = true;
    refs.send.disabled = true;
    refs.reset.hidden = false;

    var turn = el('div', 'orbit-turn');
    turn.appendChild(el('p', 'orbit-q', q));
    var a = el('div', 'orbit-a is-thinking');
    a.appendChild(el('span', 'orbit-thinking'));
    turn.appendChild(a);
    refs.turns.appendChild(turn);
    scrollToTurn(turn);

    root.setTimeout(function () {
      var out;
      try { out = produce(); } catch (e) { out = { blocks: [{ t: 'p', text: K.ERROR_LINE }], followups: [] }; }
      var ans = el('div', 'orbit-a');
      var body = el('div', 'orbit-a-body');
      out.blocks.forEach(function (b) { body.appendChild(renderBlock(b)); });
      ans.appendChild(body);
      turn.replaceChild(ans, a);
      var next = renderFollowups(out.followups);
      if (next) turn.appendChild(next);
      scrollToTurn(turn);
      announce(out.blocks.map(function (b) { return b.text || ''; }).join(' ').trim() || 'Answer ready');
      state.busy = false;
      refs.send.disabled = !refs.input.value.trim();
    }, reduced() ? 0 : 380);
  }

  function askText(text) {
    text = String(text || '').trim();
    if (!text) return;
    show(text, function () { return state.engine.ask(text); });
  }
  function askDirect(label, spec) {
    if (spec && spec.nav) { goTo(spec.nav); return; }
    show(label, function () { return state.engine.direct(spec); });
  }

  function resetConversation() {
    refs.turns.textContent = '';
    state.engine.reset();
    refs.reset.hidden = true;
    refs.body.scrollTop = 0;
    refs.input.value = '';
    refs.send.disabled = true;
    announce('Conversation cleared');
    if (!mqCoarse.matches) refs.input.focus();
  }

  /* ---------- build ---------- */
  function promptList(items) {
    var ul = el('ul', 'orbit-prompts');
    items.forEach(function (p) {
      var li = el('li');
      var b = el('button', 'orbit-prompt'); b.type = 'button';
      b.appendChild(el('span', null, p.q)); b.appendChild(arrow());
      b.addEventListener('click', function () { askDirect(p.q, { intent: p.intent }); });
      li.appendChild(b); ul.appendChild(li);
    });
    return ul;
  }

  function build() {
    var panel = el('div', 'orbit-panel');
    panel.id = 'orbit-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'orbit-title');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('inert', '');

    var head = el('div', 'orbit-head');
    var left = el('div');
    var brand = el('div', 'orbit-brand');
    brand.appendChild(el('span', 'orbit-dot'));
    var title = el('span', 'orbit-title', 'ORBIT'); title.id = 'orbit-title';
    brand.appendChild(title);
    left.appendChild(brand);
    left.appendChild(el('span', 'orbit-label', 'PORTFOLIO GUIDE'));
    var tools = el('div', 'orbit-tools');
    var reset = el('button', 'orbit-reset', 'Start over'); reset.type = 'button'; reset.hidden = true;
    var close_ = el('button', 'orbit-close'); close_.type = 'button'; close_.setAttribute('aria-label', 'Close ORBIT');
    close_.appendChild(svg('M6 6l12 12M18 6L6 18'));
    tools.appendChild(reset); tools.appendChild(close_);
    head.appendChild(left); head.appendChild(tools);

    var body = el('div', 'orbit-body');
    var intro = el('div', 'orbit-intro');
    intro.appendChild(el('p', 'orbit-tagline', 'A different way to navigate my work.'));
    intro.appendChild(el('p', 'orbit-ask', 'Curious about my work?'));
    intro.appendChild(promptList(I.PROMPTS.primary));
    var more = el('button', 'orbit-more', 'More ways in'); more.type = 'button';
    more.setAttribute('aria-expanded', 'false'); more.setAttribute('aria-controls', 'orbit-morelist');
    var moreList = promptList(I.PROMPTS.more); moreList.classList.remove('orbit-prompts'); moreList.classList.add('orbit-morelist');
    moreList.id = 'orbit-morelist'; moreList.hidden = true;
    more.addEventListener('click', function () {
      var openNow = moreList.hidden;
      moreList.hidden = !openNow;
      more.setAttribute('aria-expanded', String(openNow));
      more.textContent = openNow ? 'Fewer' : 'More ways in';
    });
    intro.appendChild(more); intro.appendChild(moreList);
    var turns = el('div', 'orbit-turns');
    turns.setAttribute('role', 'log'); turns.setAttribute('aria-live', 'off');
    var status = el('div', 'orbit-sr'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    body.appendChild(intro); body.appendChild(turns); body.appendChild(status);

    var form = el('form', 'orbit-form'); form.setAttribute('autocomplete', 'off'); form.noValidate = true;
    var input = el('input', 'orbit-input'); input.type = 'text'; input.name = 'orbit-q'; input.maxLength = 200;
    input.placeholder = 'Ask Orbit anything...'; input.setAttribute('aria-label', 'Ask ORBIT a question');
    input.setAttribute('enterkeyhint', 'send'); input.setAttribute('autocapitalize', 'sentences'); input.setAttribute('spellcheck', 'true');
    var send = el('button', 'orbit-send'); send.type = 'submit'; send.setAttribute('aria-label', 'Send'); send.disabled = true;
    send.appendChild(svg('M5 12h14M13 6l6 6-6 6'));
    form.appendChild(input); form.appendChild(send);
    var foot = el('p', 'orbit-foot', "Answers come from Saiky's published portfolio.");

    panel.appendChild(head); panel.appendChild(body); panel.appendChild(form); panel.appendChild(foot);
    doc.body.appendChild(panel);

    refs = { panel: panel, body: body, turns: turns, status: status, input: input, send: send, reset: reset, close: close_ };

    close_.addEventListener('click', function () { close(); });
    reset.addEventListener('click', resetConversation);
    input.addEventListener('input', function () { send.disabled = state.busy || !input.value.trim(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      if (!v.trim() || state.busy) return;
      input.value = ''; send.disabled = true;
      askText(v);
    });
    panel.addEventListener('keydown', trapFocus);

    /* the on-screen keyboard: keep the input visible on phones */
    if (root.visualViewport) {
      var sync = function () {
        if (!state.open || !mqMobile.matches) { panel.style.removeProperty('--orbit-vh'); panel.style.removeProperty('--orbit-top'); return; }
        panel.style.setProperty('--orbit-vh', root.visualViewport.height + 'px');
        panel.style.setProperty('--orbit-top', root.visualViewport.offsetTop + 'px');
      };
      root.visualViewport.addEventListener('resize', sync);
      root.visualViewport.addEventListener('scroll', sync);
      panel._sync = sync;
    }
    state.built = true;
  }

  /* ---------- focus + keyboard ---------- */
  function focusables() {
    return Array.prototype.filter.call(
      refs.panel.querySelectorAll('button:not([disabled]):not([hidden]), a[href], input:not([disabled])'),
      function (n) { return !n.closest('[hidden]') && n.offsetParent !== null; }
    );
  }
  function trapFocus(e) {
    if (e.key !== 'Tab' || !mqMobile.matches) return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function onDocKey(e) {
    if (e.key === 'Escape' && state.open) { e.stopPropagation(); close(); }
  }

  /* ---------- open / close ---------- */
  function open() {
    if (!state.built) build();
    if (state.open) return;
    state.open = true;
    refs.panel.removeAttribute('inert');
    refs.panel.setAttribute('aria-modal', mqMobile.matches ? 'true' : 'false');
    if (refs.panel._sync) refs.panel._sync();
    void refs.panel.offsetWidth; /* flush styles so the entrance transition plays */
    refs.panel.classList.add('is-open');
    if (state.launcher) state.launcher.setAttribute('aria-expanded', 'true');
    doc.addEventListener('keydown', onDocKey, true);
    root.setTimeout(function () {
      if (mqCoarse.matches) refs.panel.focus(); else refs.input.focus();
    }, 60);
  }

  function close(opts) {
    if (!state.built || !state.open) return;
    state.open = false;
    refs.panel.classList.remove('is-open');
    refs.panel.setAttribute('inert', '');
    if (refs.panel._sync) refs.panel._sync();
    if (state.launcher) state.launcher.setAttribute('aria-expanded', 'false');
    doc.removeEventListener('keydown', onDocKey, true);
    if (!opts || opts.restoreFocus !== false) { if (state.launcher) state.launcher.focus(); }
  }

  ORBIT.ui = {
    mount: function (launcher) {
      state.launcher = launcher;
      state.engine = ORBIT.engine.create();
      launcher.setAttribute('aria-controls', 'orbit-panel');
    },
    open: open,
    close: close,
    isOpen: function () { return state.open; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
