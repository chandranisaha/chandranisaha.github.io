// Everything personal lives in this one file. Edit here; the 3D site, the twin and the résumé view all read from it.

const GH = 'https://github.com/chandranisaha';

export const me = {
  name: 'Chandrani Saha',
  word: 'chandrani', // the word the particles spell
  role: 'Computer Science + Computational Natural Sciences, IIIT Hyderabad',
  tagline: 'I study science, build software, and spend the rest of my time on a stage or at an easel.',
  email: 'chandranisaha2006@gmail.com',
  location: 'Hyderabad, India',
  github: GH,
  linkedin: 'https://linkedin.com/in/chandranisaha',
  cv: '', // drop a PDF in /public and put its filename here, e.g. 'chandrani-saha-cv.pdf'
};

export const C = {
  cream: '#f4ecdf',
  gold: '#ffb347',
  teal: '#3ecfc0',
  red: '#ef5b4c',
  pink: '#ff7ab8',
  lav: '#b79cff',
};

export const ORDER = ['hero', 'about', 'science', 'build', 'lead', 'art', 'rhythm', 'twin', 'contact'];

// Short names used in the header and the command palette.
export const NAV = { about: 'hello', science: 'science', build: 'projects', lead: 'work', art: 'paint', rhythm: 'stage', twin: 'twin', contact: 'contact' };

export const about = {
  title: 'Part scientist, part builder, part artist.',
  lede: "I'm Chandrani, a dual-degree student at IIIT Hyderabad: a B.Tech in Computer Science with an MS in Computational Natural Sciences. I like problems where code meets the physical world, and I like making things people want to poke at.",
  more: 'This page is a molecule of me. Each atom is one part of my life. Scroll through it, or click an atom to jump there.',
  facts: ['Kolkata → Hyderabad', 'B.Tech CS + MS CNS, IIIT-H', 'systems · data · games', 'paint · music · theatre', 'English · বাংলা · हिन्दी'],
};

export const skills = [
  { label: 'Languages', items: ['C', 'C++', 'Python', 'Java', 'JavaScript', 'SQL', 'Bash', 'HTML/CSS'] },
  { label: 'Systems and CS fundamentals', items: ['Data Structures & Algorithms', 'Operating Systems', 'Distributed Systems', 'Databases', 'Computer Networks'] },
  { label: 'Frameworks and libraries', items: ['FastAPI', 'Flask', 'NumPy', 'Matplotlib', 'PyTorch', 'Pandas', 'LaTeX', 'VMD'] },
  { label: 'Developer tools', items: ['Git', 'Linux', 'MySQL', 'Docker', 'VS Code'] },
];

export const chapters = [
  {
    key: 'science', no: '01', label: 'science', color: C.teal, side: 'right', atom: [-3.3, 1.9, 0.4],
    title: 'I think in science.',
    lede: 'My master’s side is Computational Natural Sciences: physics, chemistry and biology done with algorithms. It taught me to model a problem before touching the keyboard.',
    items: [
      { title: 'IIIT Hyderabad', meta: '2024 – present', text: 'B.Tech in Computer Science with an MS in Computational Natural Sciences. Coursework: Data Structures & Algorithms, Algorithm Analysis & Design, Discrete Structures, Automata Theory, Probability & Random Processes, Linear Algebra, Data & Applications.' },
      { title: 'All India Rank 4', meta: 'ISC board examinations', text: 'Fourth in the country in the Class XII boards, with 99%.' },
      { title: 'JBNSTS Scholar', meta: 'Govt. of West Bengal', text: 'Jagadis Bose National Science Talent Search scholar.' },
      { title: 'INSPIRE Scholarship', meta: 'DST, Govt. of India', text: 'Qualified for the scholarship awarded to the top 1% of students nationwide.' },
      { title: 'G.D. Birla Centre for Education, Kolkata', meta: 'Graduated 2024', text: 'ISC 99% · ICSE 98%.' },
    ],
  },
  {
    key: 'build', no: '02', label: 'projects', color: C.gold, side: 'left', atom: [3.1, 2.0, -0.6],
    title: 'Selected work.',
    lede: 'Systems code, a game, a desktop app and a solver. Each one is something you can open and run.',
    projects: [
      { id: 'minar', name: 'Minar', what: 'Runners-up · Megathon 2026',
        text: 'A financial-literacy game for Indian students. You leave the Charminar with a small bundle and a goal, walk a floating island, and learn to plan, save, invest and stay safe by playing.',
        media: { type: 'images', images: [
          { src: 'projects/minar-home.jpg', cap: 'The island: four places, four lessons' },
          { src: 'projects/minar-story.jpg', cap: 'Ammamma’s story sets the goal' },
          { src: 'projects/minar-play-invest.jpg', cap: 'Deal Board, the investing game I built' },
          { src: 'projects/minar-play-save.jpg', cap: 'Pocket Panic: one month, ₹600' },
          { src: 'projects/minar-play-safe.jpg', cap: 'Case Files: spot the scam' },
          { src: 'projects/minar-ngo-demo.jpg', cap: 'Minar Insights for teachers and NGOs' },
        ] },
        points: [
          'Four short games on one island: budgeting a festival, surviving a month on ₹600, backing made-up companies, and spotting scams.',
          'Plays in English, Hindi and Telugu, on a phone or a laptop.',
          'Students never sign in. Progress stays on the device and every amount is made up, for practice.',
          'Minar Insights gives teachers and NGOs a dashboard of class progress.',
        ],
        hood: [
          'I built Deal Board, the investing game: you question companies before backing them and are scored on judgement, never profit.',
          'React, TypeScript and Tailwind on Vite; Supabase only for the optional teacher sign-in.',
          'Unit and integration tests in Vitest, plus a Playwright smoke test of the core loop.',
          'Built by a team of five (Sushi Aur Ek) for Vanguard’s community stewardship brief.',
        ],
        stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Supabase'],
        links: [{ label: 'Play it', href: 'https://minar-tau.vercel.app/' }, { label: 'GitHub', href: `${GH}/minar` }] },
      { id: 'pixel', name: 'Pixel Room', what: 'Desktop app · solo',
        text: 'A pixel-art lofi bedroom that lives on your Windows desktop and does real work, because I was tired of wallpapers that just sit there.',
        media: { type: 'images', images: [{ src: 'projects/pixel-room.png', cap: 'The room, running as a live wallpaper' }] },
        points: [
          'The window shows your real weather. If it rains outside, it rains in the room.',
          'A focus timer brings a study buddy to the desk; finished tasks crumple into the bin.',
          'A plant that grows when you work, and a cat that gets judgy when you do not.',
          'Your Google Calendar, Outlook, Windows sticky notes and Spotify all show up as objects in the room.',
        ],
        hood: [
          'Runs inside Lively Wallpaper as a web page, synced across two monitors.',
          'A small local helper does what a wallpaper cannot: hide desktop icons, read sticky notes, open apps. It listens only on localhost and needs a token.',
          'Spotify control uses Windows’ own media keys, so there is no login.',
          'Ships with a Claude Code skill that can set up and redecorate the room for you.',
        ],
        stack: ['JavaScript', 'Three.js', 'Lively Wallpaper', 'Windows helper'],
        links: [{ label: 'GitHub', href: `${GH}/pixel-room` }] },
      { id: 'shell', name: 'C Shell + xv6 scheduler', what: 'Systems · C',
        text: 'A Unix shell written from scratch in modular C, and a multi-level feedback queue scheduler added to the xv6 kernel.',
        media: { type: 'terminal' },
        points: [
          'The shell tokenises each line and checks it against a grammar before running anything.',
          'I/O redirection, piping, background and foreground processes, signals and stored command history.',
          'Its own built-ins: hop, reveal, peek, locate, activities, resume, ping.',
          'Two process tools: spy lists open files like lsof, and snoop counts system calls like strace.',
        ],
        hood: [
          'Written with only POSIX headers and functions; external programs run through execve.',
          'In xv6-riscv: an MLFQ scheduler, a FIFO scheduler to compare against, and a new waitx system call.',
          'A schedulertest workload and plotting script produce the figures in the written report.',
        ],
        stack: ['C', 'POSIX', 'xv6-riscv', 'ptrace'],
        links: [{ label: 'GitHub', href: `${GH}/c-shell-and-xv6-mlfq-scheduler` }] },
      { id: 'sat', name: 'SAT & CSP Solver Engine', what: 'Algorithms · C++',
        text: 'A general-purpose SAT solver that cracks Sudoku of any size, N-Queens and graph colouring, with benchmarks showing which heuristics earn their keep.',
        media: { type: 'sudoku' },
        points: [
          'Solves N × N Sudoku, N-Queens and graph K-colouring by encoding each as a CNF formula.',
          'A second, dedicated backtracking solver for comparison.',
          'Benchmarking infrastructure that evaluates and compares solver configurations.',
        ],
        hood: [
          'DPLL with unit propagation, pure literal elimination and VSIDS heuristics.',
          'The backtracking solver uses Minimum Remaining Values and forward checking.',
          'CNF encoders for each problem, and a Python pipeline that turns benchmark runs into charts.',
        ],
        stack: ['C++', 'Python', 'CNF encodings'],
        links: [{ label: 'GitHub', href: `${GH}/DPLL-SAT-Solver` }] },
    ],
    more: [
      { name: 'Network File System', stack: 'C · TCP', href: `${GH}/network-file-system`, text: 'An NFS-style distributed file system: a central naming server as the gateway between clients and storage servers, with concurrency and persistence.' },
      { name: 'Document Question-Answering System', stack: 'Python · JavaScript · FastAPI', href: `${GH}/pdf-qa-app`, text: 'Answers questions over your documents, with embedding caching and context-aware retrieval for more reliable responses.' },
      { name: 'StrangerDB', stack: 'Python · MySQL', href: `${GH}/StrangerDB-DNA-project`, text: 'A terminal operations console over a relational database with normalised schemas and integrity constraints.' },
      { name: 'Felicity Event System', stack: 'MERN', href: `${GH}/felicity-event-system`, text: 'Event platform for the college fest with role-based portals, QR tickets and a real-time forum.' },
    ],
    tags: skills[0].items.concat(skills[2].items, skills[3].items),
  },
  {
    key: 'lead', no: '03', label: 'work', color: C.red, side: 'right', atom: [4.0, -1.3, -1.2],
    title: 'Where I’ve worked.',
    lede: 'Two internships so far: one in enterprise data at Chubb, one in product at a startup. Plus a hackathon podium and a startup idea.',
    items: [
      { title: 'Chubb Business Services India', meta: 'Summer Technology Intern · Jun – Jul 2026', text: 'Worked on JustAsk, a GenBI platform that turns natural-language business questions into SQL over enterprise insurance datasets using semantic modelling. I built business glossaries, metrics, relationships and metadata with engineering teams across India and Thailand to improve NL-to-SQL accuracy and query reliability.' },
      { title: 'Typeflo.io', meta: 'Product & Growth Intern · May – Oct 2025', text: 'Analysed search performance, indexing and engagement with Google Analytics and Search Console, and worked with the product team on discoverability, site structure and user engagement.' },
      { title: 'Megathon 2026', meta: 'Runners-up', text: 'Team Sushi Aur Ek built Minar for Vanguard’s community stewardship brief.' },
      { title: 'Rexwo', meta: 'Startup idea', text: 'An AI healthcare idea developed with a team and approved by 15+ industry professionals.' },
    ],
  },
  {
    key: 'art', no: '04', label: 'paint', color: C.pink, side: 'left', atom: [-3.6, -1.6, -0.8],
    title: 'I paint.',
    lede: 'I hold a senior diploma in art, and painting is still my reset button. It leaks into what I build: Pixel Room is a pixel-art bedroom and Minar is a painted island.',
    cta: { action: 'paint', label: 'Turn your cursor into a brush', hint: 'or press P' },
  },
  {
    key: 'rhythm', no: '05', label: 'stage', color: C.lav, side: 'right', atom: [-0.6, -3.5, 0.6],
    title: 'Music, dance, dramatics.',
    lede: 'The other half of my week happens on a stage. Pick an act.',
    acts: [
      { id: 'drama', label: 'Dramatics', title: 'Coordinator of Cyclorama.', text: 'I coordinate Cyclorama, the dramatics club at IIIT Hyderabad, after starting out on its performance team. Away from the stage I am a district-level debater and orator, which is the same skill with fewer costumes.' },
      { id: 'music', label: 'Music', title: 'Trained in classical music.', text: 'I hold a senior diploma in classical music. It is also why this page makes sound: every atom plays a note.', cta: { action: 'sound', label: 'Turn sound on' } },
      { id: 'dance', label: 'Dance', title: 'Dance, on campus and off.', text: 'Dance has been with me for as long as music has. At IIIT-H I worked with The Dance Crew on how their performances reach people.', cta: { action: 'dance', label: 'Start a dance break' } },
    ],
    roles: [
      ['Coordinator', 'Cyclorama, the dramatics club'],
      ['Core member', 'E-Cell, IIIT Hyderabad'],
      ['Mentor', 'Apex'],
      ['Debater and orator', 'District level'],
      ['Senior diploma', 'Art and classical music'],
      ['Social media', 'ArtSociety · The Dance Crew · Felicity'],
      ['Marketing', 'Ping!'],
      ['Volunteer', 'ISKCON Kolkata'],
    ],
  },
];

export const contact = {
  title: 'Start a conversation.',
  lede: 'Tell me what it is about and the particles will spell it out. Type your name and they will greet you.',
  reasons: [
    { id: 'hello', label: 'Just hello', word: 'say hello', subject: 'Hello' },
    { id: 'intern', label: 'An internship', word: 'internship', subject: 'Internship opportunity' },
    { id: 'research', label: 'Research', word: 'research', subject: 'Research collaboration' },
    { id: 'project', label: 'A project', word: 'build it', subject: 'A project idea' },
  ],
};

// The twin: a small retrieval script. It only knows what is written here.
export const twin = {
  topics: [
    { id: 'about', label: 'who', color: C.cream },
    { id: 'projects', label: 'projects', color: C.gold },
    { id: 'skills', label: 'skills', color: C.teal },
    { id: 'education', label: 'education', color: C.teal },
    { id: 'experience', label: 'work', color: C.red },
    { id: 'people', label: 'people', color: C.red },
    { id: 'offscreen', label: 'off-screen', color: C.pink },
    { id: 'cat', label: 'the cat', color: C.lav },
  ],
  cards: ['intro', 'chubb', 'proud', 'hire', 'skills', 'systems', 'drama', 'cat', 'science', 'team', 'offscreen', 'awards', 'pixel', 'sat'],
  greeting: 'Hi, I’m Chandrani’s twin. You ask, I answer. Pick a card to start.',
  fallback: 'That one is not in my notes. I am a small retrieval script, so I only know what Chandrani wrote down for me. The real one answers email.',
  entries: [
    { id: 'intro', topic: 'about', q: 'Tell me about yourself.', keywords: ['yourself', 'introduce', 'introduction', 'who', 'background', 'summary', 'bio'],
      a: 'I’m a dual-degree student at IIIT Hyderabad: a B.Tech in Computer Science with an MS in Computational Natural Sciences. I interned at Chubb on a natural-language-to-SQL platform, I have written a shell, a file system and a SAT solver, and off-screen I coordinate the dramatics club, paint and play classical music.',
      src: [{ label: 'About', to: 'about' }] },
    { id: 'chubb', topic: 'experience', q: 'What did you do at Chubb?', keywords: ['chubb', 'justask', 'genbi', 'sql', 'insurance', 'semantic', 'nl2sql', 'enterprise', 'thailand', 'summer', 'bi', 'analytics', 'data'],
      a: 'I was a Summer Technology Intern at Chubb in 2026, working on JustAsk, a GenBI platform that turns natural-language business questions into SQL over enterprise insurance datasets using semantic modelling. My part was the semantic layer: business glossaries, metrics, relationships and metadata, built with engineering teams across India and Thailand to make the generated queries more accurate and reliable.',
      src: [{ label: 'Work → Chubb', to: 'lead' }] },
    { id: 'intern', topic: 'experience', q: 'What work experience do you have?', keywords: ['experience', 'intern', 'internship', 'job', 'typeflo', 'seo', 'worked', 'employment', 'company', 'growth', 'product', 'startup'],
      a: 'Two internships. At Chubb (summer 2026) I worked on JustAsk, a natural-language-to-SQL platform for insurance data. At Typeflo.io (May to October 2025) I was a Product and Growth Intern: I analysed search performance, indexing and engagement with Google Analytics and Search Console, and worked with the product team on discoverability and site structure.',
      src: [{ label: 'Work', to: 'lead' }] },
    { id: 'proud', topic: 'projects', q: 'Which project are you proudest of?', keywords: ['project', 'projects', 'proud', 'proudest', 'portfolio', 'shipped', 'minar', 'megathon', 'hackathon', 'financial', 'finance', 'literacy', 'game', 'vanguard', 'telugu'],
      a: 'The one with a trophy: Minar. It is a financial-literacy game for Indian students that my team built at Megathon 2026 for Vanguard’s brief, and we were runners-up. You walk a floating island and play four short games about planning, saving, investing and staying safe, in English, Hindi and Telugu. You can play it in your browser right now.',
      src: [{ label: 'Projects → Minar', to: 'build' }] },
    { id: 'pixel', topic: 'projects', q: 'What is Pixel Room?', keywords: ['pixel', 'room', 'wallpaper', 'desktop', 'lofi', 'windows', 'lively', 'pomodoro', 'timer', 'bedroom', 'cozy'],
      a: 'A pixel-art lofi bedroom that lives on your Windows desktop. I was tired of generic wallpapers, so I built a room that does things: the window shows your real weather, a focus timer brings a study buddy to the desk, finished tasks crumple into the bin, and the cat gets judgy when you are idle. It reads your calendar, sticky notes and Spotify too.',
      src: [{ label: 'Projects → Pixel Room', to: 'build' }] },
    { id: 'systems', topic: 'projects', q: 'Have you done low-level work?', keywords: ['low', 'level', 'systems', 'system', 'shell', 'xv6', 'kernel', 'scheduler', 'mlfq', 'operating', 'os', 'posix', 'unix', 'linux', 'network', 'nfs', 'file', 'distributed', 'ptrace', 'tcp'],
      a: 'Yes. I wrote a shell from scratch in C with I/O redirection, piping, background and foreground processes, signals and command history. I added a multi-level feedback queue scheduler to the xv6-riscv kernel. And I built an NFS-style network file system in C over TCP, with a central naming server between clients and storage servers.',
      src: [{ label: 'Projects → C Shell + xv6', to: 'build' }] },
    { id: 'sat', topic: 'projects', q: 'Tell me about the SAT solver.', keywords: ['sat', 'csp', 'solver', 'dpll', 'sudoku', 'queens', 'algorithm', 'algorithms', 'cnf', 'vsids', 'heuristic', 'backtracking', 'graph', 'colouring', 'coloring'],
      a: 'I built a general-purpose SAT solver in C++ using DPLL with unit propagation, pure literal elimination and VSIDS. It solves Sudoku of any size, N-Queens and graph colouring by encoding them as CNF. The fun part was the benchmarking infrastructure: it measures how much each heuristic helps, against a backtracking solver with MRV and forward checking.',
      src: [{ label: 'Projects → SAT & CSP Solver', to: 'build' }] },
    { id: 'docqa', topic: 'projects', q: 'Have you built anything with LLMs?', keywords: ['pdf', 'qa', 'rag', 'llm', 'document', 'retrieval', 'embedding', 'ai', 'genai', 'chatbot', 'ml', 'pytorch'],
      a: 'Two things. At Chubb I worked on JustAsk, which turns natural-language questions into SQL. On my own I built a document question-answering system in Python and FastAPI, with embedding caching and context-aware retrieval to make its answers more reliable. This twin, for the record, is not an LLM.',
      src: [{ label: 'Work → Chubb', to: 'lead' }, { label: 'Projects → also built', to: 'build' }] },
    { id: 'skills', topic: 'skills', q: 'What is your tech stack?', keywords: ['skill', 'stack', 'tech', 'technology', 'language', 'programming', 'python', 'javascript', 'java', 'tool', 'framework', 'know', 'code', 'coding', 'docker'],
      a: 'Languages: C, C++, Python, Java, JavaScript, SQL and Bash. Fundamentals: data structures and algorithms, operating systems, distributed systems, databases and computer networks. Libraries: FastAPI, Flask, NumPy, PyTorch and Pandas. Tools: Git, Linux, MySQL and Docker.',
      src: [{ label: 'Projects → Toolbox', to: 'build' }] },
    { id: 'science', topic: 'education', q: 'What do you study?', keywords: ['study', 'degree', 'college', 'university', 'iiit', 'iiith', 'hyderabad', 'education', 'course', 'coursework', 'major', 'cns', 'computational', 'natural', 'science', 'graduate', 'graduation', 'year', 'computer'],
      a: 'A B.Tech in Computer Science with an MS in Computational Natural Sciences at IIIT Hyderabad, since 2024. Coursework so far: data structures and algorithms, algorithm analysis and design, discrete structures, automata theory, probability and random processes, linear algebra, and data and applications.',
      src: [{ label: 'Science → IIIT Hyderabad', to: 'science' }] },
    { id: 'awards', topic: 'education', q: 'Any scholarships or awards?', keywords: ['award', 'scholarship', 'scholar', 'achievement', 'inspire', 'jbnsts', 'honour', 'honor', 'marks', 'score', 'school', 'isc', 'icse', 'grade', 'won', 'prize', 'rank', 'air', 'topper'],
      a: 'All India Rank 4 in the ISC board examinations, with 99%. I am a JBNSTS scholar (Jagadis Bose National Science Talent Search, Government of West Bengal) and qualified for the INSPIRE scholarship, which goes to the top 1% of students nationwide. Most recently, runners-up at Megathon 2026 with Minar.',
      src: [{ label: 'Science → Honours', to: 'science' }, { label: 'Work → Megathon', to: 'lead' }] },
    { id: 'drama', topic: 'people', q: 'What do you do at Cyclorama?', keywords: ['cyclorama', 'drama', 'dramatics', 'theatre', 'theater', 'acting', 'stage', 'coordinator', 'club', 'debate', 'debater', 'orator', 'speaking'],
      a: 'I am the coordinator of Cyclorama, the dramatics club at IIIT Hyderabad. I started on the performance team and now run the club. I am also a district-level debater and orator, so I am comfortable with a room full of people looking at me.',
      src: [{ label: 'Stage', to: 'rhythm' }] },
    { id: 'team', topic: 'people', q: 'How are you in a team?', keywords: ['team', 'teamwork', 'leadership', 'lead', 'leader', 'ecell', 'cell', 'apex', 'mentor', 'ping', 'marketing', 'communication', 'volunteer', 'iskcon', 'extracurricular', 'collaborate', 'rexwo', 'startup'],
      a: 'I coordinate Cyclorama, the dramatics club, I am a core member of E-Cell and I mentor with Apex. At Chubb I worked with engineering teams across India and Thailand. And Minar was five people building one game in a hackathon, so I have merged a lot of branches under time pressure.',
      src: [{ label: 'Stage', to: 'rhythm' }, { label: 'Work', to: 'lead' }] },
    { id: 'hire', topic: 'about', q: 'Why should we hire you?', keywords: ['hire', 'hiring', 'strength', 'strengths', 'fit', 'candidate', 'recruit', 'unique'],
      a: 'Three things from my record. Range: enterprise NL-to-SQL at Chubb, a shell and a file system in C, a SAT solver, and a game in three languages. I finish: these are things you can open and run. And I can lead a room: I coordinate a dramatics club, which is project management with stage fright.',
      src: [{ label: 'Work', to: 'lead' }, { label: 'Projects', to: 'build' }, { label: 'Stage', to: 'rhythm' }] },
    { id: 'offscreen', topic: 'offscreen', q: 'What do you do outside of code?', keywords: ['outside', 'hobby', 'hobbies', 'interest', 'fun', 'paint', 'painting', 'art', 'dance', 'dancing', 'music', 'classical', 'diploma', 'creative', 'weekend', 'sing'],
      a: 'Music, dance and dramatics, plus a paintbrush. I hold senior diplomas in art and in classical music, I coordinate the dramatics club, and I dance. Press P on this page and your cursor becomes a brush.',
      src: [{ label: 'Stage', to: 'rhythm' }, { label: 'Paint', to: 'art' }] },
    { id: 'cat', topic: 'cat', q: 'Who is the cat?', keywords: ['cat', 'kitty', 'kitten', 'pet', 'tuxedo', 'meow', 'animal'],
      a: 'The tuxedo cat on this page is modelled on my real one. It follows you from atom to atom and slow-blinks if you pet it. It also lives in Pixel Room, where it judges you for being idle. It has final say on all design decisions.',
      src: [{ label: 'The cat-ion', to: 'hero' }, { label: 'Projects → Pixel Room', to: 'build' }] },
    { id: 'where', topic: 'about', q: 'Where are you based?', keywords: ['where', 'based', 'location', 'city', 'kolkata', 'hometown', 'relocate', 'bengali', 'hindi', 'english', 'speak', 'spoken'],
      a: 'I’m from Kolkata and based in Hyderabad for my degree. I speak English, Bengali and Hindi.',
      src: [{ label: 'About', to: 'about' }] },
    { id: 'contact', topic: 'about', q: 'How do I reach you?', keywords: ['contact', 'reach', 'email', 'mail', 'linkedin', 'github', 'connect', 'message', 'talk', 'call', 'schedule', 'available', 'availability'],
      a: 'Email is best: chandranisaha2006@gmail.com. I’m also on LinkedIn and GitHub as chandranisaha. The contact section at the bottom will even draft the email for you.',
      src: [{ label: 'Contact', to: 'contact' }] },
    { id: 'meta', topic: 'about', q: 'Are you a real AI?', keywords: ['bot', 'human', 'gpt', 'chatgpt', 'twin', 'robot', 'fake', 'script', 'real'],
      a: 'Honest answer: no LLM here. I am a small retrieval script running in your browser. I match your question against notes Chandrani wrote and show you which part of her CV each answer comes from.',
      src: [{ label: 'About', to: 'about' }] },
  ],
};
