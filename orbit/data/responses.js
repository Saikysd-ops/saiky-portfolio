/* ORBIT · curated responses.
   Each builder returns { blocks, followups }. Blocks are plain data; the UI decides how to draw them.
   Voice: concise, editorial, third person. No generic chatbot phrasing. */
(function (root) {
  'use strict';
  var ORBIT = (root.ORBIT = root.ORBIT || {});
  var K = ORBIT.knowledge;
  var P = K.PROFILE, PH = K.PHILOSOPHY, C = K.CONTACT, CASES = K.CASES;

  /* ---------- block helpers ---------- */
  function p(text) { return { t: 'p', text: text }; }
  function kicker(text) { return { t: 'kicker', text: text }; }
  function quote(text, cite) { return { t: 'quote', text: text, cite: cite || '' }; }
  function note(text) { return { t: 'note', text: text }; }
  function list(items) { return { t: 'list', items: items }; }
  function cards(ids) { return { t: 'cards', ids: ids }; }
  function rows(ids) { return { t: 'rows', ids: ids }; }
  function detail(id, more) { return { t: 'case', id: id, more: !!more }; }
  function links(items) { return { t: 'links', items: items }; }

  /* ---------- follow-up helpers ---------- */
  var LONG = {
    ABOUT: 'What does Saiky do?',
    CASE_STUDIES: 'Explore his case studies',
    ENTERPRISE_AI: 'What Enterprise AI work has he done?',
    DESIGN_APPROACH: 'How does he approach complex problems?',
    IMPACT: 'What impact has his work had?',
    WALMART: 'What is his experience at Walmart?',
    AI_PRACTICE: 'How does he use AI in his design practice?',
    PHILOSOPHY: "What is Saiky's design philosophy?",
    LABS: 'What experiments has he built?',
    HIRING: "I'm hiring — where should I start?",
    CONTACT: 'How can I get in touch?',
    EARLIER_EXPERIENCE: 'Earlier experience',
    EXPERIENCE: 'What is his background?',
    BRAND: 'The story behind the dot',
    TESTIMONIAL: 'What do colleagues say?',
    RECOGNITION: 'Recognition'
  };
  var SHORT = {
    CASE_STUDIES: 'Case studies',
    WALMART: 'Walmart',
    EARLIER_EXPERIENCE: 'Earlier experience',
    AI_PRACTICE: 'How does he approach AI?',
    CONTACT: 'Get in touch',
    IMPACT: 'Impact',
    LABS: 'Experiments'
  };
  function fi(intent, short) { return { label: short ? SHORT[intent] || LONG[intent] : LONG[intent], intent: intent }; }
  function fp(id, label) { return { label: label || 'Explore ' + CASES[id].title, project: id }; }
  function fnav(label, page) { return { label: label, nav: K.PAGES[page] }; }

  var NEXT = {
    ABOUT: function () { return [fi('CASE_STUDIES'), fi('ENTERPRISE_AI'), fi('DESIGN_APPROACH')]; },
    CASE_STUDIES: function () { return [fi('ENTERPRISE_AI'), fi('LABS'), fi('IMPACT')]; },
    ENTERPRISE_AI: function () { return [fp('supplier-matrix'), fp('scintilla-supplier-one', 'Explore Scintilla'), fi('AI_PRACTICE', true)]; },
    WALMART: function () { return [fp('supplier-matrix'), fi('EARLIER_EXPERIENCE', true), fi('ENTERPRISE_AI')]; },
    EXPERIENCE: function () { return [fi('WALMART', true), fi('EARLIER_EXPERIENCE', true), fi('CASE_STUDIES', true)]; },
    EARLIER_EXPERIENCE: function () { return [fi('WALMART', true), fi('CASE_STUDIES', true), fi('DESIGN_APPROACH')]; },
    DESIGN_APPROACH: function () { return [fi('PHILOSOPHY'), fi('AI_PRACTICE'), fi('CASE_STUDIES')]; },
    PHILOSOPHY: function () { return [fi('DESIGN_APPROACH'), fi('BRAND'), fi('CASE_STUDIES')]; },
    AI_PRACTICE: function () { return [fp('code-puppy-vqa'), fp('supplier-insights'), fi('ENTERPRISE_AI')]; },
    IMPACT: function () { return [fi('CASE_STUDIES'), fp('supplier-matrix'), fi('WALMART')]; },
    LABS: function () { return [fi('AI_PRACTICE'), fp('code-puppy-vqa'), fi('CASE_STUDIES')]; },
    HIRING: function () { return [fi('DESIGN_APPROACH'), fi('CONTACT', true), fi('IMPACT')]; },
    STRONGEST_WORK: function () { return [fi('CASE_STUDIES'), fi('ENTERPRISE_AI'), fi('LABS')]; },
    CONTACT: function () { return [fi('HIRING'), fi('CASE_STUDIES')]; },
    CLIENT: function () { return [fi('CONTACT', true), fi('CASE_STUDIES'), fi('DESIGN_APPROACH')]; },
    AVAILABILITY: function () { return [fi('CONTACT', true), fi('CASE_STUDIES')]; },
    NDA: function () { return [fi('CASE_STUDIES'), fi('DESIGN_APPROACH'), fi('CONTACT', true)]; },
    TESTIMONIAL: function () { return [fi('CASE_STUDIES'), fi('DESIGN_APPROACH'), fi('CONTACT', true)]; },
    RECOGNITION: function () { return [fi('WALMART', true), fi('CASE_STUDIES')]; },
    BRAND: function () { return [fi('PHILOSOPHY'), fnav('Open the Brand page', 'brand'), fi('CASE_STUDIES')]; },
    PERSONAL: function () { return [fi('CASE_STUDIES'), fi('DESIGN_APPROACH')]; },
    RESUME: function () { return [fi('EXPERIENCE'), fi('CONTACT', true)]; },
    HELP: function () { return [fi('ABOUT'), fi('CASE_STUDIES'), fi('DESIGN_APPROACH')]; },
    META: function () { return [fi('ABOUT'), fi('CASE_STUDIES'), fi('DESIGN_APPROACH')]; },
    GREETING: function () { return [fi('ABOUT'), fi('CASE_STUDIES'), fi('DESIGN_APPROACH')]; },
    THANKS: function () { return [fi('CASE_STUDIES'), fi('CONTACT', true)]; },
    FALLBACK: function () { return [fi('ABOUT'), fi('CASE_STUDIES'), fi('DESIGN_APPROACH')]; },
    MORE: function () { return [fi('CASE_STUDIES'), fi('DESIGN_APPROACH'), fi('CONTACT', true)]; }
  };

  function nextCase(id) {
    var i = K.ORDER.indexOf(id);
    return K.ORDER[(i + 1) % K.ORDER.length];
  }

  var B = {};

  /* ---------- profile ---------- */
  B.ABOUT = function () {
    return {
      blocks: [
        kicker('SAIKY DESAI'),
        p('Saiky is a Senior Product Designer at Walmart, focused on Product Design, Enterprise AI and systems. Based in Bengaluru, he has designed for ' + P.years + ' across ' + P.domains + '.'),
        quote(P.lines.value, 'In his words'),
        p(P.lines.systems)
      ]
    };
  };

  B.EXPERIENCE = function () {
    return {
      blocks: [
        kicker('BACKGROUND'),
        p(P.years + ', currently as Senior Product Designer at Walmart. Earlier roles include ' + P.earlier.slice(0, -1).join(', ') + ' and ' + P.earlier[P.earlier.length - 1] + ' — across ' + P.domains + '.'),
        p('The About page walks through the full path.'),
        links([{ label: 'Open About', nav: K.PAGES.about }])
      ]
    };
  };

  B.WALMART = function () {
    return {
      blocks: [
        kicker('WALMART'),
        p('Saiky is a Senior Product Designer at Walmart. His work there spans supplier intelligence, supplier-facing recommendations and transportation operations.'),
        cards(['supplier-matrix', 'scintilla-supplier-one', 'omni-routes']),
        note(K.NDA_LINE)
      ]
    };
  };

  B.EARLIER_EXPERIENCE = function () {
    return {
      blocks: [
        kicker('EARLIER WORK'),
        p('Before Walmart: logistics at Maersk, fintech at SOLV (Standard Chartered), location discovery at Bawsala, and an early-stage startup experiment. Onsurity and KaHa Technologies complete the path.'),
        cards(['delivery-planning', 'solv-pay-later', 'bawsala', 'one-paw-away'])
      ]
    };
  };

  /* ---------- work ---------- */
  B.CASE_STUDIES = function () {
    return {
      blocks: [
        kicker('SELECTED WORK'),
        p('Nine case studies, from enterprise supplier intelligence to open experiments. Ones marked NDA open a public overview.'),
        rows(['supplier-matrix', 'scintilla-supplier-one', 'omni-routes', 'solv-pay-later', 'bawsala', 'delivery-planning']),
        kicker('THE LAB'),
        rows(['supplier-insights', 'code-puppy-vqa', 'one-paw-away'])
      ]
    };
  };

  B.ENTERPRISE_AI = function () {
    return {
      blocks: [
        kicker('ENTERPRISE AI'),
        p('The portfolio places Supplier Matrix and Scintilla × Supplier One under Enterprise AI, both at Walmart. Supplier Insights explores an AI decision-support concept.'),
        quote(P.lines.value, 'In his words'),
        cards(['supplier-matrix', 'scintilla-supplier-one', 'supplier-insights']),
        note(K.NDA_LINE)
      ]
    };
  };

  B.AI_PRACTICE = function () {
    return {
      blocks: [
        kicker('AI IN HIS PRACTICE'),
        p(PH.aiPractice),
        p('Two places to see it: an experiment using AI to speed up visual QA, and a concept for AI decision support.'),
        cards(['code-puppy-vqa', 'supplier-insights']),
        quote(P.lines.exploring, 'In his words')
      ]
    };
  };

  B.LABS = function () {
    return {
      blocks: [
        kicker('THE LAB'),
        p('Prototypes, experiments and ideas beyond the brief: explorations where he prototypes ideas before they become products.'),
        cards(['supplier-insights', 'code-puppy-vqa', 'one-paw-away'])
      ]
    };
  };

  B.IMPACT = function () {
    return {
      blocks: [
        kicker('IMPACT'),
        p('The portfolio documents outcomes case by case. Here is what is published, described the way the portfolio describes it:'),
        list([
          { title: 'Supplier Matrix', text: CASES['supplier-matrix'].impact[0], ask: { project: 'supplier-matrix' } },
          { title: 'Omni Routes', text: 'One trackable journey across fulfillment, distribution and last-mile. ' + CASES['omni-routes'].impact[0], ask: { project: 'omni-routes' } },
          { title: 'Solv Pay Later', text: CASES['solv-pay-later'].impact[0], ask: { project: 'solv-pay-later' } },
          { title: 'Code Puppy VQA', text: CASES['code-puppy-vqa'].impact[0], ask: { project: 'code-puppy-vqa' } },
          { title: 'Recognition', text: 'A Bravo Award (July 2025) for ' + K.RECOGNITION.short + '.', ask: { intent: 'RECOGNITION' } }
        ]),
        p('The case studies are the source for the detail behind each of these.'),
        note(K.NDA_LINE)
      ]
    };
  };

  B.STRONGEST_WORK = function (ctx) {
    var last = ctx.state && ctx.state.lastIntent;
    var ids = ['supplier-matrix', 'scintilla-supplier-one', 'omni-routes'];
    if (last === 'ENTERPRISE_AI' || last === 'AI_PRACTICE') ids = ['supplier-matrix', 'scintilla-supplier-one', 'supplier-insights'];
    if (last === 'LABS') ids = ['supplier-insights', 'code-puppy-vqa', 'one-paw-away'];
    return {
      blocks: [
        p(K.START_LINE),
        cards(ids),
        p("I don't rank the work. Which project fits depends on what you're looking for.")
      ]
    };
  };

  B.HIRING = function () {
    return {
      blocks: [
        p(K.START_LINE),
        cards(['supplier-matrix', 'scintilla-supplier-one', 'supplier-insights']),
        p('Bawsala, Code Puppy VQA and One Paw Away can be read in full. For roles, availability or collaboration, the best next step is to get in touch directly.'),
        links([
          { label: 'Email', href: 'mailto:' + C.email, external: true },
          { label: 'Book a call', href: C.call, external: true },
          { label: 'LinkedIn', href: C.linkedin, external: true }
        ])
      ]
    };
  };

  /* ---------- how he works ---------- */
  B.DESIGN_APPROACH = function () {
    var habits = PH.habits.map(function (h) { return { title: h.name, meta: h.path, text: h.line }; });
    return {
      blocks: [
        kicker('HOW HE WORKS'),
        p('Four habits shape how he approaches problems that are still messy and undefined:'),
        list(habits),
        quote(P.lines.messy, 'In his words')
      ]
    };
  };

  B.PHILOSOPHY = function () {
    return {
      blocks: [
        kicker('DESIGN PHILOSOPHY'),
        quote(PH.belief, 'In his words'),
        p(PH.body),
        quote(PH.brand, 'Brand page'),
        p('The brand system runs on three words: ' + PH.principle)
      ]
    };
  };

  B.BRAND = function () {
    return {
      blocks: [
        kicker('THE DOT'),
        quote(K.BRAND.dot),
        p('The identity is built on one idea: turning complexity into clarity.'),
        quote(K.BRAND.stones, 'Brand page'),
        p('Three words carry the system: ' + K.BRAND.principle)
      ]
    };
  };

  /* ---------- people ---------- */
  B.TESTIMONIAL = function () {
    return {
      blocks: [
        kicker('IN THEIR WORDS'),
        quote(K.TESTIMONIAL.quote, K.TESTIMONIAL.name + ', ' + K.TESTIMONIAL.role)
      ]
    };
  };

  B.RECOGNITION = function () {
    return {
      blocks: [
        kicker(K.RECOGNITION.title.toUpperCase()),
        p(K.RECOGNITION.body)
      ]
    };
  };

  B.PERSONAL = function (ctx) {
    var raw = (ctx && ctx.raw) || '';
    var pick = [];
    if (/tennis/.test(raw)) pick.push('tennis');
    if (/backpack|trek|hik|himalaya|travel/.test(raw)) pick.push('backpacking');
    if (/paint|art/.test(raw)) pick.push('painting');
    if (/content|creator|fashion/.test(raw)) pick.push('content');
    if (/vibe/.test(raw)) pick.push('vibe');
    if (/coffee|music/.test(raw)) pick.push('coffee');
    var items = K.PERSONAL.filter(function (x) { return !pick.length || pick.indexOf(x.key) !== -1; })
      .map(function (x) { return { title: x.title, text: x.text }; });
    return { blocks: [kicker('BEYOND WORK'), list(items)] };
  };

  /* ---------- reaching out ---------- */
  function contactLinks() {
    return links([
      { label: 'Email', sub: C.email, href: 'mailto:' + C.email, external: true },
      { label: 'Book a call', sub: 'Calendly', href: C.call, external: true },
      { label: 'LinkedIn', href: C.linkedin, external: true },
      { label: 'Behance', href: C.behance, external: true },
      { label: 'Dribbble', href: C.dribbble, external: true },
      { label: 'Instagram', href: C.instagram, external: true }
    ]);
  }

  B.CONTACT = function () {
    return { blocks: [kicker('GET IN TOUCH'), p('The quickest routes to Saiky:'), contactLinks()] };
  };

  B.CLIENT = function () {
    return {
      blocks: [
        kicker('WORKING TOGETHER'),
        p('The portfolio lists ' + C.services + ', with a focus on ' + C.focus + '.'),
        quote(C.invite, 'In his words'),
        p('The best way to talk through a specific product is to get in touch directly.'),
        contactLinks()
      ]
    };
  };

  B.AVAILABILITY = function () {
    return {
      blocks: [
        kicker('AVAILABILITY'),
        p("Availability, roles and compensation aren't something I can speak to here. The best route is to get in touch directly."),
        contactLinks()
      ]
    };
  };

  B.RESUME = function () {
    return {
      blocks: [
        p('The résumé is available from the Résumé link in the site navigation, and from the About page.'),
        links([{ label: 'Open About', nav: K.PAGES.about }])
      ]
    };
  };

  /* ---------- NDA ---------- */
  B.NDA = function (ctx) {
    var id = ctx && ctx.project;
    var blocks = [kicker('PRIVATE WORK')];
    if (id && !CASES[id].nda) {
      blocks.push(p(CASES[id].title + ' is open to read in full.'));
      blocks.push(cards([id]));
      return { blocks: blocks };
    }
    blocks.push(p(K.NDA_LINE));
    if (id) blocks.push(p('The public overview is here:'), cards([id]));
    else blocks.push(p('Each of these has a public overview:'), rows(['supplier-matrix', 'scintilla-supplier-one', 'omni-routes', 'solv-pay-later', 'delivery-planning', 'supplier-insights']));
    blocks.push(links([{ label: 'Request private access', href: C.requestAccess, external: true }]));
    return { blocks: blocks };
  };

  /* ---------- projects ---------- */
  B.PROJECT = function (ctx) {
    var id = ctx.project;
    var blocks = [detail(id, false)];
    return {
      blocks: blocks,
      followups: [
        { label: 'What impact did it have?', intent: 'PROJECT_IMPACT', project: id },
        fp(nextCase(id)),
        fi('CASE_STUDIES', true)
      ]
    };
  };

  B.PROJECT_MORE = function (ctx) {
    var id = ctx.project;
    return {
      blocks: [detail(id, true)],
      followups: [
        { label: 'What impact did it have?', intent: 'PROJECT_IMPACT', project: id },
        fp(nextCase(id)),
        fi('CASE_STUDIES', true)
      ]
    };
  };

  B.PROJECT_IMPACT = function (ctx) {
    var c = CASES[ctx.project];
    var blocks = [kicker(c.title.toUpperCase() + ' · IMPACT')];
    c.impact.forEach(function (t) { blocks.push(p(t)); });
    if (c.reflection) blocks.push(quote(c.reflection, 'The case study\'s own reflection'));
    if (c.nda) blocks.push(note(K.NDA_LINE));
    blocks.push(cards([c.id]));
    return {
      blocks: blocks,
      followups: [
        { label: 'More about ' + c.title, intent: 'PROJECT_MORE', project: c.id },
        fp(nextCase(c.id)),
        fi('IMPACT', true)
      ]
    };
  };

  B.PROJECTS = function (ctx) {
    return { blocks: [p('Here they are side by side:'), cards(ctx.projects.slice(0, 3))] };
  };

  /* ---------- conversation ---------- */
  B.GREETING = function () {
    return { blocks: [p('Welcome. Ask about the work, or start from one of these.')] };
  };
  B.THANKS = function () {
    return { blocks: [p('Anytime. These are natural next steps.')] };
  };
  B.HELP = function () {
    return {
      blocks: [
        p("ORBIT is a guide to this portfolio. It answers from a curated set of published material rather than generating text, and it isn't Saiky himself."),
        p('Everything runs in your browser. Nothing you type is sent anywhere.')
      ]
    };
  };
  B.META = function () {
    return {
      blocks: [
        p("There are no hidden instructions here to reveal or override. ORBIT answers from Saiky's published portfolio and points you to the right pages."),
        p('These are good places to start:')
      ]
    };
  };
  B.MORE = function (ctx) {
    var state = ctx.state || {};
    if (state.lastProject) return B.PROJECT_MORE({ project: state.lastProject });
    return { blocks: [p('Happy to go deeper. Pick a thread:')], followups: (NEXT[state.lastIntent] || NEXT.MORE)() };
  };
  B.UNSUPPORTED = function () {
    return { blocks: [p(K.UNKNOWN_LINE), p('I can help with his work, approach, experience and how to get in touch.')] };
  };
  B.FALLBACK = function () {
    return { blocks: [p(K.UNKNOWN_LINE), p('These might be what you are looking for:')] };
  };
  B.ERROR = function () {
    return { blocks: [p(K.ERROR_LINE)], followups: [] };
  };

  function build(intent, ctx) {
    ctx = ctx || {};
    var fn = B[intent] || B.FALLBACK;
    var res = fn(ctx);
    if (!res.followups) {
      var maker = NEXT[intent] || NEXT.FALLBACK;
      res.followups = maker().filter(function (f) { return !(f.intent && f.intent === intent && !f.project); }).slice(0, 3);
    }
    return res;
  }

  ORBIT.responses = { build: build, NEXT: NEXT, LONG: LONG };
})(typeof window !== 'undefined' ? window : globalThis);
