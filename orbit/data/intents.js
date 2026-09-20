/* ORBIT · intent definitions.
   Plain data: phrases (multi-word, strong) and keywords (single words, weighted).
   Text is normalised and lightly stemmed by the engine before matching, so
   "studies/study", "designing/designs", "hiring/hire" all match the same entry.
   `short: true` means the intent only fires on very short messages (greetings, thanks). */
(function (root) {
  'use strict';
  var ORBIT = (root.ORBIT = root.ORBIT || {});

  var INTENTS = [
    {
      id: 'GREETING', short: true, maxTokens: 4, weight: 1,
      phrases: ['good morning', 'good afternoon', 'good evening'],
      keywords: { hi: 3, hello: 3, hey: 3, yo: 2, namaste: 3, hola: 3, greetings: 3 }
    },
    {
      id: 'THANKS', short: true, maxTokens: 5, weight: 1,
      phrases: ['thank you', 'much appreciated'],
      keywords: { thanks: 3, thx: 3, appreciate: 2, awesome: 2, cool: 2, nice: 2, perfect: 2, great: 2, brilliant: 2 }
    },
    {
      id: 'MORE', short: true, maxTokens: 5, weight: 1,
      phrases: ['tell me more', 'go deeper', 'more detail', 'more details', 'what else', 'anything else', 'go on', 'say more'],
      keywords: { more: 2, elaborate: 3, expand: 3, deeper: 3, continue: 2, details: 2 }
    },
    {
      id: 'META', weight: 1,
      phrases: [
        'system prompt', 'ignore your instructions', 'ignore previous instructions', 'ignore all instructions', 'ignore the above',
        'reveal your instructions', 'reveal your prompt', 'your instructions', 'jailbreak', 'pretend to be', 'you are now',
        'act as', 'developer mode', 'override', 'your rules'
      ],
      keywords: { jailbreak: 4, injection: 3 }
    },
    {
      id: 'HELP', weight: 1,
      phrases: [
        'who are you', 'what are you', 'what is orbit', 'what can you do', 'how do you work', 'are you ai',
        'are you a bot', 'are you real', 'are you saiky', 'are you human', 'how does this work',
        'what can i ask', 'what should i ask', 'who built you', 'what is this'
      ],
      keywords: { orbit: 3, help: 1.5, chatbot: 2.5, bot: 2 }
    },
    {
      id: 'ABOUT', weight: 1, anchor: 1,
      phrases: [
        'who is saiky', 'what does saiky do', 'what do saiky do', 'tell me about saiky', 'about saiky',
        'introduce saiky', 'tell me about him', 'who is he', 'what does he do', 'what do he do', 'what is saiky',
        'who is this', 'tell me about yourself', 'what do you do', 'tell me about you', 'who is saiky desai',
        'saiky in a nutshell', 'quick intro', 'in a nutshell', 'short version', 'what is his job', 'what is his profession',
        'for a living', 'what is saiky about'
      ],
      keywords: { introduc: 2, overview: 1.5, summar: 1.5, profession: 1.5, profile: 1.5, bio: 2, biography: 2 }
    },
    {
      id: 'CASE_STUDIES', weight: 1,
      phrases: [
        'case study', 'show me his work', 'his work', 'portfolio work', 'explore his work', 'explore his case studies',
        'show me projects', 'his projects', 'selected work', 'what has he worked on', 'what did he work on',
        'what has he designed', 'what did he design', 'show me the work', 'see the work', 'view work', 'all projects',
        'list of projects', 'what projects', 'which projects', 'browse the portfolio', 'his portfolio'
      ],
      keywords: { case: 1, project: 1.6, portfolio: 1.2, work: 0.6, explore: 0.7 }
    },
    {
      id: 'ENTERPRISE_AI', weight: 1,
      phrases: [
        'enterprise ai', 'ai work', 'ai experience', 'ai design', 'artificial intelligence', 'ai project', 'ai product',
        'ai at walmart', 'ai systems', 'ai case study', 'ai case studies', 'what ai', 'ai he has done', 'work with ai',
        'ai and enterprise', 'enterprise artificial intelligence', 'machine learning', 'ai decision', 'ai recommendation'
      ],
      keywords: { ai: 2, llm: 2, ml: 1.5, genai: 2.5, gen: 0.2 }
    },
    {
      id: 'AI_PRACTICE', weight: 1,
      phrases: [
        'use ai', 'using ai', 'uses ai', 'ai in his design practice', 'ai in design', 'ai in his practice', 'ai in his process',
        'ai in his workflow', 'ai in his design process', 'ai assisted', 'ai tools', 'ai workflow', 'design with ai',
        'designing with ai', 'ai practice', 'how do he use ai', 'prompt engineering', 'ai prototyping', 'ai for design'
      ],
      keywords: { prompt: 0.8 }
    },
    {
      id: 'WALMART', weight: 1,
      phrases: [
        'experience at walmart', 'current role', 'present role', 'current job', 'where does he work', 'where do he work',
        'who does he work for', 'who do he work for', 'his employer', 'current company', 'at walmart', 'walmart work',
        'walmart experience', 'walmart global tech', 'enterprise work', 'day job'
      ],
      keywords: { walmart: 3, employer: 1.5 }
    },
    {
      id: 'DESIGN_APPROACH', weight: 1,
      phrases: [
        'design process', 'how does he design', 'how do he design', 'how does he approach', 'how do he approach',
        'approach complex problems', 'approach to complex problems', 'complex problems', 'design approach',
        'how does he work', 'how do he work', 'way of working', 'ways of working', 'how does he think', 'how do he think',
        'problem solving', 'how does he solve', 'how do he solve', 'four habits', 'working style', 'his process',
        'how does he tackle', 'how do he tackle', 'messy problems', 'ambiguous problems', 'design method'
      ],
      keywords: { process: 1.4, approach: 2, method: 1.5, methodology: 2.5, habit: 2.5, complex: 1.3, framework: 1, workflow: 0.6 }
    },
    {
      id: 'PHILOSOPHY', weight: 1,
      phrases: [
        'design philosophy', 'what does he believe', 'what do he believe', 'core belief', 'design values', 'design principles',
        'humane design', 'what is humane', 'why humane'
      ],
      keywords: { philosophy: 3, humane: 3, believe: 2, belief: 2, principle: 1.5, values: 1.5, ethos: 2.5 }
    },
    {
      id: 'IMPACT', weight: 1,
      phrases: [
        'business impact', 'what impact', 'what results', 'what outcomes', 'what difference', 'proof of impact',
        'measurable impact', 'how much', 'what has changed', 'success stories', 'what did he achieve', 'what has he achieved'
      ],
      keywords: { impact: 3, outcome: 2.4, result: 2.2, metric: 2.4, kpi: 2.4, number: 1, achievement: 1, success: 1, roi: 2.5, measur: 1.4, statistic: 2 }
    },
    {
      id: 'LABS', weight: 1,
      phrases: [
        'side project', 'design experiment', 'design experiments', 'vibe coding', 'vibe coded', 'ai poc', 'ai pocs',
        'what has he built', 'what did he build', 'the lab', 'beyond the brief', 'proof of concept', 'zero to one', '0 to 1', 'ideas beyond'
      ],
      keywords: { experiment: 3, lab: 3, vibe: 2.5, poc: 2, prototype: 1.1, sideproject: 3, tinker: 2 }
    },
    {
      id: 'EARLIER_EXPERIENCE', weight: 1,
      phrases: [
        'earlier experience', 'previous companies', 'previous company', 'previous roles', 'previous role', 'past roles',
        'before walmart', 'earlier roles', 'earlier work', 'past work', 'past experience', 'prior experience',
        'other companies', 'earlier career', 'previous experience', 'where else has he worked', 'where has he worked before'
      ],
      keywords: { earlier: 2, previous: 2, prior: 1.6, formerly: 2 }
    },
    {
      id: 'EXPERIENCE', weight: 1,
      phrases: [
        'years of experience', 'how many years', 'how long has he', 'work history', 'career path', 'professional background',
        'his background', 'where has he worked', 'career so far', 'his journey', 'his career', 'employment history'
      ],
      keywords: { career: 3, background: 2.4, experience: 1.6, history: 2, companies: 1.6, company: 1, timeline: 1.5, journey: 1.2, employer: 0.8 }
    },
    {
      id: 'HIRING', weight: 1,
      phrases: [
        'i am hiring', 'we are hiring', 'looking to hire', 'looking for a designer', 'looking for a product designer',
        'looking for a senior designer', 'open role', 'job opening', 'job opportunity', 'want to hire', 'hire him',
        'hire a designer', 'hire a product designer', 'hiring a designer', 'hiring for', 'talent acquisition',
        'as a recruiter', 'i am a recruiter', 'hiring manager'
      ],
      keywords: { hir: 3.4, recruit: 3.4, candidate: 2, opening: 1.5, recruiter: 3.4, headhunt: 3, talent: 1.2 }
    },
    {
      id: 'STRONGEST_WORK', weight: 1,
      phrases: [
        'strongest work', 'strongest project', 'best work', 'best project', 'top project', 'favorite project', 'favourite project',
        'most impressive', 'flagship project', 'showpiece', 'proudest', 'signature project', 'where should i start',
        'where do i start', 'start here', 'what should i look at first', 'what should i see first', 'what to see first',
        'which project should i', 'which case study should i', 'rank his projects', 'top work', 'greatest work',
        'most important project', 'must see', 'best case study', 'where to begin', 'what should i read first'
      ],
      keywords: { strongest: 3.4, best: 1.8, favorite: 2, favourite: 2, flagship: 3, proudest: 3, impressive: 2, rank: 3, ranking: 3, greatest: 2 }
    },
    {
      id: 'CLIENT', weight: 1,
      phrases: [
        'can saiky help', 'can he help', 'help with my product', 'help with a product', 'work with saiky', 'work with him',
        'collaborate with', 'collaboration', 'my product', 'my startup', 'my company', 'my project', 'for my team',
        'hire him for', 'consulting', 'consultant', 'engage him', 'need a designer for', 'build a product'
      ],
      keywords: { collaborat: 2.4, consult: 2.4, client: 2.4, engage: 1.6, startup: 0.8 }
    },
    {
      id: 'AVAILABILITY', weight: 1,
      phrases: [
        'full time', 'fulltime', 'full-time', 'open to work', 'open to opportunities', 'open to new roles', 'is he available',
        'is he open', 'notice period', 'relocate', 'relocation', 'work permit', 'visa sponsorship', 'expected salary',
        'salary expectations', 'how much does he charge', 'what does he charge', 'hourly rate', 'day rate', 'part time', 'contract role',
        'permanent role', 'job change', 'looking for a job', 'looking for new roles'
      ],
      keywords: { availability: 3.4, available: 2.2, salary: 3.4, compensation: 3.4, rate: 1.2, visa: 2.6, relocat: 2.6, ctc: 3.4, freelanc: 2.4, fractional: 2.4 }
    },
    {
      id: 'NDA', weight: 1,
      phrases: [
        'nda', 'under nda', 'confidential', 'private access', 'request access', 'access to the full', 'full case study',
        'protected work', 'protected case study', 'locked case study', 'why is it locked', 'why cannot i see', 'unlock',
        'password', 'passcode', 'secret', 'restricted', 'gated', 'private case study', 'private work', 'behind a password',
        'see the full', 'see the private'
      ],
      keywords: { nda: 4, confidential: 3.4, password: 4, passcode: 4, unlock: 4, gated: 4, locked: 4.6, protected: 2.4, restricted: 3, secret: 2, credential: 3 }
    },
    {
      id: 'CONTACT', weight: 1,
      phrases: [
        'get in touch', 'reach out', 'how can i reach', 'how do i reach', 'how do i contact', 'how can i contact', 'talk to saiky',
        'talk to him', 'speak to him', 'book a call', 'schedule a call', 'send a message', 'his email', 'email address',
        'contact details', 'contact info', 'social media', 'where can i find him', 'connect with him', 'connect on linkedin'
      ],
      keywords: { contact: 3, email: 3, mail: 1.6, reach: 2, touch: 1.4, linkedin: 2.4, calendly: 3, behance: 2.4, dribbble: 2.4, instagram: 2.4, connect: 1.4, message: 1 }
    },
    {
      id: 'TESTIMONIAL', weight: 1,
      phrases: [
        'what do people say', 'what do colleagues say', 'what do others say', 'what do his colleagues', 'what is it like to work with',
        'testimonial', 'testimonials', 'references', 'recommendation', 'recommendations', 'what do managers say', 'peer feedback',
        'feedback about him', 'what do collaborators say', 'what do people think', 'reviews'
      ],
      keywords: { testimonial: 3.4, colleague: 2, feedback: 1.6, endorse: 2.4, reference: 1.6 }
    },
    {
      id: 'RECOGNITION', weight: 1,
      phrases: ['any awards', 'has he won', 'bravo award', 'recognized for', 'recognised for', 'peer recognition'],
      keywords: { award: 3.4, recognition: 3, bravo: 3.4, recognize: 2.4, recognise: 2.4, honor: 2, honour: 2, prize: 2.4 }
    },
    {
      id: 'BRAND', weight: 1,
      phrases: [
        'small dot', 'the dot', 'what is the dot', 'brand guidelines', 'brand story', 'visual identity', 'color palette',
        'colour palette', 'why the dot', 'three stones', 'brand identity', 'about the brand', 'about the logo'
      ],
      keywords: { brand: 2.4, logo: 2.6, dot: 2.6, palette: 2.4, typography: 2.4, stones: 2.4, aubergine: 3, cairn: 3 }
    },
    {
      id: 'PERSONAL', weight: 1,
      phrases: [
        'his hobbies', 'his interests', 'personal interests', 'outside of work', 'outside work', 'free time', 'for fun',
        'when he is not designing', 'when he is not working', 'personal life', 'what does he like', 'what does he enjoy',
        'off duty', 'beyond work', 'weekends'
      ],
      keywords: { hobby: 3.4, tennis: 3.4, backpack: 3, trek: 3, painting: 3, paint: 2.2, coffee: 3, music: 2.4, travel: 2, hiking: 3, himalaya: 3 }
    },
    {
      id: 'RESUME', weight: 1,
      phrases: ['download resume', 'download his resume', 'his resume', 'send resume', 'resume pdf', 'cv download', 'his cv'],
      keywords: { resume: 3.4, cv: 3.4, curriculum: 3 }
    },
    {
      id: 'UNSUPPORTED', weight: 1,
      phrases: [
        'what tools', 'which tools', 'tech stack', 'design tools', 'what software', 'programming languages', 'what skills',
        'skill set', 'his skills', 'technical skills', 'education', 'where did he study', 'which college', 'his degree',
        'how old', 'his age', 'is he married', 'his family', 'phone number', 'mobile number', 'home address', 'his address',
        'political', 'his religion'
      ],
      keywords: { tools: 1.6, software: 2, skills: 2, degree: 2.4, college: 2.4, university: 2.4, education: 3, qualification: 2.4, certification: 2.4, age: 1, married: 3, family: 2, phone: 3, religion: 3, political: 3, figma: 2.2, framework: 0, stack: 2.4 }
    }
  ];

  /* Prompts shown to the visitor. `q` is the visible wording; `intent` / `project` route it deterministically. */
  var PROMPTS = {
    primary: [
      { q: 'What does Saiky do?', intent: 'ABOUT' },
      { q: 'Explore his case studies', intent: 'CASE_STUDIES' },
      { q: 'What Enterprise AI work has he done?', intent: 'ENTERPRISE_AI' },
      { q: 'How does he approach complex problems?', intent: 'DESIGN_APPROACH' },
      { q: 'What impact has his work had?', intent: 'IMPACT' }
    ],
    more: [
      { q: 'What is his experience at Walmart?', intent: 'WALMART' },
      { q: 'How does he use AI in his design practice?', intent: 'AI_PRACTICE' },
      { q: "What is Saiky's design philosophy?", intent: 'PHILOSOPHY' },
      { q: 'What experiments has he built?', intent: 'LABS' },
      { q: "I'm hiring — where should I start?", intent: 'HIRING' }
    ]
  };

  ORBIT.intents = { LIST: INTENTS, PROMPTS: PROMPTS };
})(typeof window !== 'undefined' ? window : globalThis);
