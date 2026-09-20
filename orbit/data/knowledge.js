/* ORBIT · approved knowledge (client-side, static, public-safe).
   Every string here is copied or lightly adapted from pages any visitor can read on saiky.in.
   Nothing from behind an NDA gate. Nothing that is still an open question is included. */
(function (root) {
  'use strict';
  var ORBIT = (root.ORBIT = root.ORBIT || {});

  var SITE = 'https://saiky.in';
  var NDA_LINE = 'Some work cannot be shared publicly due to NDA restrictions.';
  var UNKNOWN_LINE = "I don't have enough information about that in Saiky's portfolio.";
  var ERROR_LINE = 'Something went wrong. Try again.';
  var START_LINE = "Based on how the portfolio is presented, I'd start here:";

  var PROFILE = {
    name: 'Saiky Desai',
    fullName: 'Saikiran Desai',
    title: 'Senior Product Designer at Walmart',
    location: 'Bengaluru, India',
    years: '9+ years',
    positioning: 'Product Design · Enterprise AI · Systems',
    domains: 'global enterprise, financial services, logistics and startups',
    companies: ['Walmart', 'Maersk', 'SOLV (Standard Chartered)', 'Bawsala', 'Onsurity', 'KaHa Technologies'],
    earlier: ['Onsurity', 'Maersk', 'SOLV (Standard Chartered)', 'Bawsala', 'KaHa Technologies'],
    lines: {
      value: 'I turn complex workflows, data and AI into clearer decisions.',
      tagline: 'Complex problems. Clear systems. Meaningful decisions.',
      systems: "A systems thinker who enjoys working where products, technology, and business get complicated.",
      messy:
        "I'm drawn to problems that are still messy and undefined. I like understanding how the pieces connect, finding what's getting in the way, and bringing clarity to experiences without oversimplifying the system behind them.",
      exploring:
        "Right now, I'm exploring how AI is changing the way we design, build, and interact with products — and what that means for the future of product design.",
      titles: "I don't define myself by titles — I define myself by the products I help build.",
      audiences: 'Associates · Sourcing Managers · Merchants · Business Teams'
    }
  };

  var PHILOSOPHY = {
    belief: 'I believe good design should be humane.',
    body:
      "People aren't perfect users. They're distracted, under pressure, learning, making mistakes, and trying to get things done. Humane design respects that reality — giving people clarity, control, and a way forward.",
    brand: 'I believe humane design starts with understanding people.',
    principle: 'Understand. Structure. Simplify.',
    habits: [
      { name: 'Frame', path: 'WHY? → WHO? → WHAT IF?', line: 'Frame the problem before framing the solution.' },
      { name: 'Make visible', path: 'ROUGH → SHARE → REFINE', line: 'Make thinking visible while it is still cheap to change.' },
      { name: 'Prototype', path: 'PROMPT → PROTOTYPE → LEARN', line: 'Turn ideas into something real enough to test.' },
      { name: 'Measure', path: 'USER → SYSTEM → OUTCOME', line: 'Design beyond the screen. Measure what changes.' }
    ],
    aiPractice:
      "He uses AI-assisted tools to turn ideas into working prototypes, test interactions early, and learn faster. The goal isn't to replace design thinking — it's to make ideas tangible sooner."
  };

  var BRAND = {
    dot: 'A small dot can change perspective.',
    stones: 'Three stones represent how I turn complexity into clarity.',
    principle: 'Understand. Structure. Simplify.'
  };

  var RECOGNITION = {
    title: 'Bravo Award · July 2025',
    body:
      'Recognized by Pratik Shah for exceptional ownership, agility, and high-quality outcomes across Supplier and Quality domains — for quickly ramping up in an unfamiliar domain, maintaining strong standards, and creating consistent impact across multiple streams.',
    short: 'exceptional ownership, agility, and high-quality outcomes across Supplier and Quality domains'
  };

  var TESTIMONIAL = {
    quote:
      'Saiky inspires me. He thinks deeply through complex problems to ensure his solutions align perfectly with both user needs and business goals. He is a phenomenal collaborator across teams who brings boundless creativity, genuine humility, and a constant willingness to learn.',
    name: 'Gary Davis',
    role: 'Senior Manager · Sourcing'
  };

  var PERSONAL = [
    { key: 'tennis', title: 'Tennis', text: 'Most weekends, whatever the heat.' },
    { key: 'backpacking', title: 'Solo backpacking', text: 'Himalayas, Nepal — usually with one backpack and no fixed plan.' },
    { key: 'painting', title: 'Acrylic painting', text: 'Mostly abstract. Occasionally something that actually looks intentional.' },
    { key: 'content', title: 'Content creator', text: 'Travel, fashion, lifestyle, and whatever catches his eye.' },
    { key: 'vibe', title: 'Vibe-coding', text: 'Building the thing instead of just describing it.' },
    { key: 'coffee', title: 'Music & coffee', text: 'South Indian filter coffee. Good music. Repeat.' }
  ];

  var CONTACT = {
    email: 'saikirandesai7@gmail.com',
    call: 'https://calendly.com/saikirandesai7/30min',
    linkedin: 'https://www.linkedin.com/in/saikiran-desai-33103764/',
    behance: 'https://www.behance.net/saikiran_Desai',
    dribbble: 'https://dribbble.com/saikysd',
    instagram: 'https://www.instagram.com/saiky__desai/',
    requestAccess:
      'mailto:saikirandesai7@gmail.com?subject=Requesting%20access%20to%20full%20case%20study&body=Hi%20Saiky%2C%0A%0AI%27d%20like%20to%20request%20access%20to%20the%20full%20case%20study%20walkthrough.',
    open: 'Open to select collaborations',
    services: 'Freelance · Fractional · 0→1 Product Design',
    focus: 'Product · Enterprise · AI · Decision Systems',
    invite: "Bring me the messy part. I'll help make sense of it."
  };

  /* Site pages ORBIT may open (existing routes on saiky.in). */
  var PAGES = {
    home: { title: 'Home', view: 'home', hash: '' },
    work: { title: 'Work', view: 'work', hash: '#work' },
    about: { title: 'About', view: 'about', hash: '#about' },
    brand: { title: 'Brand', view: 'brand', hash: '#brand' }
  };

  /* Case studies. `order` is the order the site itself presents them (Home > Selected work, then the Lab).
     `impact` items are stated only with the basis the site itself gives. */
  var CASES = {
    'supplier-matrix': {
      id: 'supplier-matrix', order: 1, group: 'selected', nda: true,
      title: 'Supplier Matrix',
      meta: 'Enterprise Supplier Intelligence · Walmart',
      desc: 'Turning fragmented supplier data and inconsistent evaluation into a trusted enterprise decision system.',
      tags: ['Enterprise AI', 'Product Strategy', 'System Design'],
      view: 'case-supplier', hash: '#case-supplier-matrix',
      problem: 'Everyone had supplier data. Nobody had one way to make supplier decisions.',
      decision:
        'One decision model for supplier discovery, evaluation and assessment, built with business, data and product teams around a three-part framework: Performance · Risk · Capability.',
      impact: [
        'From fragmented supplier signals to a trusted decision layer for supplier discovery, evaluation, and monitoring.'
      ],
      facts: ['Discovery included a workshop with 25 SMEs across 9 functions.']
    },
    'scintilla-supplier-one': {
      id: 'scintilla-supplier-one', order: 2, group: 'selected', nda: true,
      title: 'Scintilla × Supplier One',
      meta: 'Enterprise AI · Walmart',
      desc: 'Connecting Scintilla In-stock Recommendations with Supplier One so suppliers can understand inventory risk, validate what is happening, and move directly into replenishment.',
      tags: ['Enterprise AI', 'Recommendations', 'Insight to action'],
      view: 'case-scintilla', hash: '#case-scintilla',
      problem: 'Inventory gaps needed to become explainable recommendations that suppliers can act on.',
      decision: 'A flow from Alert → Insight → Recommendation → Action, connecting Top Tasks to Order Management.',
      impact: ['From inventory gaps to explainable recommendations and action.'],
      facts: []
    },
    'omni-routes': {
      id: 'omni-routes', order: 3, group: 'selected', nda: true,
      title: 'Omni Routes',
      meta: 'Walmart · Transportation Ops · Mexico',
      desc: 'Real-time shipment visibility across fulfillment, distribution and last-mile operations — because teams lost visibility across every handoff.',
      tags: ['Operations', 'Visibility', 'Optimization'],
      view: 'case-omni', hash: '#case-omni-routes',
      problem: 'Every handoff was a black box.',
      decision:
        "One trackable journey, start to finish, with an Associate Tracking Dashboard as the daily operating view for the Transportation Operations team.",
      impact: ['The portfolio lists expected savings of $1.33M. It describes this as an expected figure.'],
      facts: []
    },
    'solv-pay-later': {
      id: 'solv-pay-later', order: 4, group: 'selected', nda: true,
      title: 'Solv Pay Later',
      meta: 'B2B Finance · MSME Lending · Buy Now, Pay Later',
      desc: "Designed the digital credit and Buy Now, Pay Later experience for buyers and sellers on Solv's B2B marketplace — bringing short-term revolving credit, invoice financing and repayment into a clearer working-capital journey.",
      tags: ['Fintech', 'BNPL', 'MSME'],
      view: 'case-solv', hash: '#case-solv-paylater',
      problem: 'Small businesses could be short on cash while still needing to finance inventory and day-to-day operations.',
      decision:
        'Make the financing choice, credit state and repayment journey understandable at the moments a small business needed to act.',
      impact: [
        "Figures reported in Solv's own public announcements (2021): a 15–60 day BNPL credit period, credit limits up to ₹25,00,000, invoice financing from ₹3,000, and roughly 100% average monthly growth in credit lines extended."
      ],
      facts: ['The product launched on 18 Jan 2021.']
    },
    'delivery-planning': {
      id: 'delivery-planning', order: 5, group: 'selected', nda: true,
      title: 'Delivery Planning',
      meta: 'Maersk · Enterprise Delivery Planning · Demurrage & Detention',
      desc: 'Making shipment deadlines, D&D exposure and planning priority visible in the workflow where Customer Service Agents already make delivery decisions.',
      tags: ['Logistics', 'Enterprise', 'Decision system'],
      view: 'case-delivery', hash: '#case-delivery-dnd',
      problem: 'Delivery milestones were fragmented, so shipment deadlines, D&D exposure and planning priority were not visible where agents make delivery decisions.',
      decision: 'Delivery planning became a decision system for D&D, inside the workflow agents already use.',
      impact: ['Turning scattered milestones into one plan teams can act on.'],
      facts: [
        'Research included 10 interviews with destination CSAs.',
        'Some users spent about 5 hours a week validating incoming ETAs.'
      ]
    },
    'supplier-insights': {
      id: 'supplier-insights', order: 6, group: 'lab', nda: true, concept: true,
      title: 'Supplier Insights',
      meta: 'Enterprise AI · Decision Systems · Concept POC',
      desc: 'A decision-support concept for Supplier Matrix. Surety turns a quiet supplier signal into a negotiation-ready plan, and the merchant still makes the call.',
      tags: ['AI POC', 'Decision support', 'Concept'],
      view: 'case-supplier-insights', hash: '#case-supplier-insights',
      problem: "Supplier intelligence was everywhere. The decision path wasn't.",
      decision: 'AI proposes. The merchant decides. Surety surfaces the evidence and a recommended path; the final decision stays with the merchant.',
      impact: [
        "It is a concept, not a shipped product, so there are no outcome claims. The aim: a Sourcing Manager can act in minutes instead of investigating for days."
      ],
      facts: ['Self-directed exploration, not a commissioned project.']
    },
    bawsala: {
      id: 'bawsala', order: 7, group: 'selected', nda: false,
      title: 'Bawsala',
      meta: 'Location Discovery · Navigation · Saudi Arabia',
      desc: 'Bawsala turns complex addresses into a searchable identity for the exact entrance people need to reach.',
      tags: ['Navigation', 'Location', 'Mobile'],
      view: 'case-bawsala', hash: '#case-bawsala',
      problem: 'One address can contain many entrances, so an address was not always the destination.',
      decision:
        "Treat the code as a persistent location identity, not just a search key, so it carries through search, confirmation, navigation, sharing and reuse.",
      impact: [
        'Bawsala turned a long address into a simple code that could identify an entrance, support search, navigation and sharing.'
      ],
      reflection:
        'The UX solved a real address problem. The market increasingly standardized the underlying solution. The lesson: solving a user problem does not always create lasting product differentiation.',
      facts: [
        'He joined as the first and only designer; the team later grew to 5–6.'
      ]
    },
    'code-puppy-vqa': {
      id: 'code-puppy-vqa', order: 8, group: 'lab', nda: false,
      title: 'Code Puppy VQA',
      meta: 'AI-Assisted UX Practice · Supplier One · Dev vs. Figma',
      desc: 'A small experiment to test whether AI could take the repetitive screen-by-screen comparison work out of visual QA, while keeping design judgment with the designer.',
      tags: ['Vibe coded', 'AI-assisted QA', 'Lab'],
      view: 'case-code-puppy', hash: '#case-code-puppy',
      problem: 'Visual QA meant manually jumping between the implemented experience and Figma for every screen.',
      decision: 'A structured first pass: Dev → Figma → Compare → Report → Validate, with the designer removing false positives.',
      impact: [
        'In one experiment the AI flagged 12 potential fidelity issues, and roughly 80% were accurate after manual validation. It is a self-directed exploration, not a claim of production tooling.'
      ],
      facts: []
    },
    'one-paw-away': {
      id: 'one-paw-away', order: 9, group: 'lab', nda: false,
      title: 'One Paw Away',
      meta: 'Early-stage startup experiment · Mobile · Pet care',
      desc: "A broad pet-care vision turned into a focused product direction: mapping the experience, defining the MVP, and prototyping what could come next.",
      tags: ['0→1', 'Startup', 'MVP'],
      view: 'case-onepaw', hash: '#case-one-paw-away',
      problem: 'A broad vision — food, services and community in one place — that the founding team needed to see concretely before committing engineering time.',
      decision: 'Give the idea structure before building it: map the core experience and define the MVP first.',
      impact: [
        'A clearer product direction and a tangible starting point for turning the startup vision into an MVP. It is concept and direction work, not a shipped product.'
      ],
      facts: []
    }
  };

  /* Site's own presentation order: Home > Selected work (6 cards), then The lab (3). */
  var ORDER = [
    'supplier-matrix', 'scintilla-supplier-one', 'omni-routes', 'solv-pay-later', 'bawsala', 'delivery-planning',
    'supplier-insights', 'code-puppy-vqa', 'one-paw-away'
  ];

  /* Words that identify a case study in a visitor's message. */
  var ALIASES = {
    'supplier-matrix': ['supplier matrix', 'matrix'],
    'scintilla-supplier-one': ['scintilla'],
    'omni-routes': ['omni routes', 'omni', 'shipment tracking'],
    'solv-pay-later': ['solv', 'pay later', 'paylater', 'bnpl', 'buy now pay later', 'sme pay later', 'fintech'],
    'delivery-planning': ['delivery planning', 'delivery', 'demurrage', 'detention', 'dnd', 'd and d', 'maersk'],
    'supplier-insights': ['supplier insights', 'surety'],
    bawsala: ['bawsala', 'saudi'],
    'code-puppy-vqa': ['code puppy', 'vqa', 'visual qa'],
    'one-paw-away': ['one paw away', 'one paw', 'onepaw', 'pet care']
  };

  ORBIT.knowledge = {
    SITE: SITE,
    NDA_LINE: NDA_LINE,
    UNKNOWN_LINE: UNKNOWN_LINE,
    ERROR_LINE: ERROR_LINE,
    START_LINE: START_LINE,
    PROFILE: PROFILE,
    PHILOSOPHY: PHILOSOPHY,
    BRAND: BRAND,
    RECOGNITION: RECOGNITION,
    TESTIMONIAL: TESTIMONIAL,
    PERSONAL: PERSONAL,
    CONTACT: CONTACT,
    PAGES: PAGES,
    CASES: CASES,
    ORDER: ORDER,
    ALIASES: ALIASES
  };
})(typeof window !== 'undefined' ? window : globalThis);
