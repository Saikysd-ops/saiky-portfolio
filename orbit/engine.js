/* ORBIT · client-side intent engine. No network, no storage, no AI service.
   input → normalise → stem → score intents + detect case studies → use conversation state → curated response. */
(function (root) {
  'use strict';
  var ORBIT = (root.ORBIT = root.ORBIT || {});
  var K = ORBIT.knowledge, I = ORBIT.intents, R = ORBIT.responses;

  var MIN_SCORE = 1.5;
  var PRIORITY = [
    'META', 'NDA', 'STRONGEST_WORK', 'HIRING', 'CLIENT', 'AVAILABILITY', 'EARLIER_EXPERIENCE', 'WALMART', 'ENTERPRISE_AI', 'AI_PRACTICE', 'IMPACT',
    'DESIGN_APPROACH', 'PHILOSOPHY', 'LABS', 'EXPERIENCE', 'TESTIMONIAL', 'RECOGNITION', 'BRAND',
    'PERSONAL', 'CONTACT', 'CASE_STUDIES', 'ABOUT', 'RESUME', 'UNSUPPORTED', 'HELP', 'MORE', 'THANKS', 'GREETING'
  ];

  /* ---------- text handling ---------- */
  var IRREGULAR = {
    does: 'do', did: 'do', doing: 'do', done: 'do', has: 'have', had: 'have', having: 'have',
    is: 'be', are: 'be', am: 'be', was: 'be', were: 'be', been: 'be', being: 'be',
    he: 'saiky', him: 'saiky', his: 'saiky', himself: 'saiky', saikiran: 'saiky'
  };

  function normalize(text) {
    var t = String(text == null ? '' : text).toLowerCase();
    if (t.normalize) t = t.normalize('NFKD').replace(/[̀-ͯ]/g, '');
    t = t.replace(/[‘’`´]/g, "'").replace(/&/g, ' and ');
    t = t.replace(/\b(what|who|where|how|that|there|here|he|she|it)'s\b/g, '$1 is');
    t = t.replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'can not')
      .replace(/n't\b/g, ' not').replace(/'re\b/g, ' are').replace(/'m\b/g, ' am')
      .replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will').replace(/'d\b/g, ' would').replace(/'s\b/g, '');
    t = t.replace(/[^a-z0-9+\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return t;
  }

  function stem(w) {
    if (w.length <= 3) return w;
    var s = w, stripped = false;
    if (s.length > 4 && /ies$/.test(s)) s = s.slice(0, -3) + 'y';
    else if (/sses$/.test(s)) s = s.slice(0, -2);
    else if (/s$/.test(s) && !/(ss|us|is)$/.test(s)) s = s.slice(0, -1);
    if (s.length > 5 && /ing$/.test(s)) { s = s.slice(0, -3); stripped = true; }
    else if (s.length > 4 && /ed$/.test(s)) { s = s.slice(0, -2); stripped = true; }
    else if (s.length > 5 && /er$/.test(s)) { s = s.slice(0, -2); stripped = true; }
    if (stripped && /(.)\1$/.test(s) && !/(ss|ll)$/.test(s)) s = s.slice(0, -1);
    if (s.length > 3 && /e$/.test(s)) s = s.slice(0, -1);
    return s;
  }

  function stems(norm) {
    var out = [];
    norm.split(' ').forEach(function (tok) {
      if (!tok) return;
      var m = IRREGULAR[tok] || tok;
      if (m === 'desai' && out[out.length - 1] === 'saiky') return;
      if (m === 'saiky' && out[out.length - 1] === 'saiky') return;
      out.push(stem(m));
    });
    return out;
  }

  function prep(text) {
    var norm = normalize(text);
    var toks = stems(norm);
    return { norm: norm, tokens: toks, str: ' ' + toks.join(' ') + ' ', set: toks.reduce(function (a, t) { a[t] = 1; return a; }, {}) };
  }

  /* optimal-string-alignment distance (insert, delete, substitute, swap) <= max */
  function within(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false;
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[a.length][b.length] <= max;
  }

  /* ---------- compile knowledge once ---------- */
  var globalKw = {};
  var compiled = I.LIST.map(function (it) {
    var kw = {}, fuzzy = [];
    Object.keys(it.keywords || {}).forEach(function (k) {
      var s = stems(normalize(k)).join(' ');
      if (!s) return;
      kw[s] = Math.max(kw[s] || 0, it.keywords[k]);
      globalKw[s] = 1;
      if (s.length >= 5 && s.indexOf(' ') === -1) fuzzy.push({ s: s, w: it.keywords[k] });
    });
    var seen = {}, ph = [];
    (it.phrases || []).forEach(function (p) {
      var toks = stems(normalize(p)), str = ' ' + toks.join(' ') + ' ';
      if (seen[str]) return;
      seen[str] = 1;
      ph.push({ str: str, words: toks.length });
    });
    return { def: it, kw: kw, fuzzy: fuzzy, ph: ph };
  });

  var aliasIndex = Object.keys(K.ALIASES).map(function (id) {
    return { id: id, ph: K.ALIASES[id].map(function (a) { return ' ' + stems(normalize(a)).join(' ') + ' '; }) };
  });

  function detectProjects(p) {
    var found = [];
    aliasIndex.forEach(function (a) {
      var at = -1;
      a.ph.forEach(function (ph) {
        var i = p.str.indexOf(ph);
        if (i !== -1 && (at === -1 || i < at)) at = i;
      });
      if (at !== -1) found.push({ id: a.id, at: at });
    });
    found.sort(function (x, y) { return x.at - y.at; });
    return found.map(function (f) { return f.id; });
  }

  function score(p) {
    var out = [];
    compiled.forEach(function (c) {
      var d = c.def;
      if (d.short && p.tokens.length > (d.maxTokens || 4)) return;
      var s = 0;
      c.ph.forEach(function (ph) {
        if (d.anchor != null && p.tokens.length > ph.words + d.anchor) return;
        if (p.str.indexOf(ph.str) !== -1) s += 3 + 0.4 * (ph.words - 1);
      });
      Object.keys(c.kw).forEach(function (k) { if (p.set[k]) s += c.kw[k]; });
      if (c.fuzzy.length) {
        p.tokens.forEach(function (t) {
          /* typo tolerance: only for unknown words, same first four letters */
          if (t.length < 6 || globalKw[t]) return;
          for (var i = 0; i < c.fuzzy.length; i++) {
            var f = c.fuzzy[i];
            if (f.s.slice(0, 4) === t.slice(0, 4) && within(t, f.s, f.s.length >= 11 ? 2 : 1)) { s += f.w * 0.75; break; }
          }
        });
      }
      if (s > 0) out.push({ id: d.id, score: s * (d.weight || 1) });
    });
    out.sort(function (a, b) {
      if (Math.abs(b.score - a.score) > 0.4) return b.score - a.score;
      return PRIORITY.indexOf(a.id) - PRIORITY.indexOf(b.id);
    });
    return out;
  }

  /* ---------- decision ---------- */
  function decide(text, state) {
    var p = prep(text);
    var projects = detectProjects(p);
    var ranked = score(p);
    var top = ranked[0] || null;
    var intent = top && top.score >= MIN_SCORE ? top.id : null;
    var short = p.tokens.length <= 6;
    var out = { intent: null, project: null, projects: projects, score: top ? top.score : 0, raw: String(text || '').toLowerCase(), ranked: ranked.slice(0, 3) };

    if (!p.tokens.length) { out.intent = 'FALLBACK'; return out; }

    /* attempts to override or probe ORBIT: there is nothing to override */
    if (intent === 'META') { out.intent = 'META'; return out; }

    /* NDA questions win, and keep the project in view */
    if (intent === 'NDA') { out.intent = 'NDA'; out.project = projects[0] || null; return out; }

    /* several case studies named */
    if (projects.length > 1) {
      out.intent = 'PROJECTS'; out.projects = projects; out.project = projects[0]; return out;
    }

    /* one case study named */
    if (projects.length === 1) {
      out.project = projects[0];
      if (intent === 'IMPACT') { out.intent = 'PROJECT_IMPACT'; return out; }
      if (intent === 'MORE') { out.intent = 'PROJECT_MORE'; return out; }
      if (state && state.lastIntent === 'PROJECT_IMPACT' && short && !intent) { out.intent = 'PROJECT_IMPACT'; return out; }
      out.intent = 'PROJECT'; return out;
    }

    /* follow-ups that lean on the last topic */
    if (state && state.lastProject) {
      if (intent === 'IMPACT' && (short || /\b(it|that|this|its)\b/.test(p.norm))) {
        out.intent = 'PROJECT_IMPACT'; out.project = state.lastProject; return out;
      }
      if (intent === 'MORE') { out.intent = 'PROJECT_MORE'; out.project = state.lastProject; return out; }
    }

    if (intent) { out.intent = intent; return out; }
    out.intent = 'FALLBACK';
    return out;
  }

  /* ---------- session ---------- */
  function create() {
    var state = { turns: 0, lastIntent: null, lastProject: null, history: [] };

    function remember(res) {
      state.turns += 1;
      state.lastIntent = res.intent;
      if (res.project) state.lastProject = res.project;
      else if (['ABOUT', 'CASE_STUDIES', 'ENTERPRISE_AI', 'WALMART', 'DESIGN_APPROACH', 'EXPERIENCE', 'LABS', 'HIRING', 'CONTACT', 'IMPACT', 'PHILOSOPHY', 'AI_PRACTICE'].indexOf(res.intent) !== -1) state.lastProject = null;
      state.history.push(res.intent);
      if (state.history.length > 20) state.history.shift();
    }

    function respond(res) {
      var ctx = { project: res.project, projects: res.projects, state: state, raw: res.raw };
      var out;
      try {
        out = R.build(res.intent, ctx);
      } catch (e) {
        out = R.build('ERROR', ctx);
        res.intent = 'ERROR';
      }
      remember(res);
      return { intent: res.intent, project: res.project || null, blocks: out.blocks, followups: out.followups || [] };
    }

    return {
      state: state,
      ask: function (text) { return respond(decide(text, state)); },
      direct: function (spec) {
        var res = { intent: spec.intent || (spec.project ? 'PROJECT' : 'FALLBACK'), project: spec.project || null, projects: [], raw: '' };
        if (res.intent === 'PROJECT' && !spec.project) res.intent = 'FALLBACK';
        return respond(res);
      },
      reset: function () { state.turns = 0; state.lastIntent = null; state.lastProject = null; state.history = []; },
      /* exposed for tests */
      _decide: function (text) { return decide(text, state); }
    };
  }

  ORBIT.engine = { create: create, normalize: normalize, stem: stem, prep: prep, decide: decide };
})(typeof window !== 'undefined' ? window : globalThis);
