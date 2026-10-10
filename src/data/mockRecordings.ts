import type { CourseItem, RecordingItem, UserStats } from "@/types/recording";

export const INITIAL_USER_STATS: UserStats = {
  totalHours: "24h 15m",
  totalRecordings: 18,
  insightsGenerated: 74,
  transcriptionAccuracy: "99.2%",
  storageUsedHours: 24.2,
  storageLimitHours: 60,
};

export const MOCK_RECORDINGS: RecordingItem[] = [
  {
    id: "rec-01",
    title: "Introduction to Economics: How Supply, Demand & Prices Work",
    course: "Economics 101",
    speaker: "Prof. David Miller",
    date: "Today · Oct 8, 2026",
    duration: "48m 20s",
    durationSeconds: 2900,
    type: "lecture",
    status: "ready",
    isStarred: true,
    waveform: [
      30, 45, 60, 80, 55, 40, 70, 95, 85, 60, 45, 65, 80, 75, 50, 60, 85, 90,
      70, 40, 35, 65, 80, 50,
    ],
    summary: {
      overview:
        "This lecture breaks down the fundamentals of market equilibrium and price formation. We covered why prices naturally rise when goods become scarce, how consumer demand reacts to price shifts, and why sudden events—such as unexpected weather or supply bottlenecks—influence what everyday items cost at the supermarket. Prof. Miller used relatable real-world examples including avocado harvests and smartphone releases to illustrate how buyers and sellers interact.",
      keyTakeaways: [
        "Market equilibrium is the sweet spot where the amount of goods shoppers want to buy perfectly matches what sellers produce.",
        "Price elasticity measures how sensitive consumers are to changes in price; daily necessities like milk and bread have low elasticity, while luxury items have high elasticity.",
        "When supply decreases unexpectedly while demand remains constant, prices rise until buyer demand rebalances with available supply.",
        "Government subsidies can make essential items more affordable, but price caps below equilibrium often lead to artificial shortages.",
      ],
      studyQuestions: [
        {
          question:
            "What happens to the market price if demand suddenly increases but supply stays constant?",
          answer:
            "The market price rises because more buyers are competing for the same fixed number of items, encouraging sellers to raise prices.",
        },
        {
          question:
            "Why do essential goods like medicines or staple foods have inelastic demand?",
          answer:
            "Because consumers cannot easily cut back on essentials or find immediate substitutes, they continue buying even when prices go up.",
        },
        {
          question:
            "What is the difference between a movement along a demand curve versus a shift of the demand curve?",
          answer:
            "A price change causes movement along the existing curve. A change in external factors (like consumer income, tastes, or population) shifts the entire curve.",
        },
      ],
      actionItems: [
        "Review textbook Chapter 3 problem sets on consumer surplus before Thursday's recitation.",
        "Complete the brief 5-question online quiz on supply and demand curves by Friday at 5:00 PM.",
      ],
    },
    transcript: [
      {
        id: "t1",
        speaker: "Prof. David Miller",
        timestamp: "00:01:15",
        seconds: 75,
        text: "Good morning, everyone. Welcome to Economics 101. Today we are tackling the engine that powers almost every market in the world: supply and demand.",
      },
      {
        id: "t2",
        speaker: "Prof. David Miller",
        timestamp: "00:04:30",
        seconds: 270,
        text: "Think about walking into a local coffee shop. If coffee beans double in price worldwide because of a drought, what does the café owner do? They either raise prices or take a loss.",
      },
      {
        id: "t3",
        speaker: "Sarah (Student)",
        timestamp: "00:09:45",
        seconds: 585,
        text: "Professor, wouldn't regular customers just stop buying coffee if the price goes up too high?",
      },
      {
        id: "t4",
        speaker: "Prof. David Miller",
        timestamp: "00:10:12",
        seconds: 612,
        text: "Exactly right, Sarah! That brings us to our core concept of the day: price elasticity. How sensitive are people to price tags? For morning coffee lovers, demand is surprisingly stubborn—at least up to a point.",
      },
      {
        id: "t5",
        speaker: "Prof. David Miller",
        timestamp: "00:22:40",
        seconds: 1360,
        text: "Now look at the graph on the board. The intersection of these two curves is what economists call market equilibrium. At this price, every cup made is a cup bought. No waste, no shortage.",
      },
      {
        id: "t6",
        speaker: "Marcus (Student)",
        timestamp: "00:35:10",
        seconds: 2110,
        text: "What happens if the city introduces a price ceiling to keep coffee affordable?",
      },
      {
        id: "t7",
        speaker: "Prof. David Miller",
        timestamp: "00:35:45",
        seconds: 2145,
        text: "It sounds helpful on paper, but if the ceiling is set below the equilibrium cost, shops can't afford to brew as much. You end up with long lines and empty counters by 9:00 AM.",
      },
      {
        id: "t8",
        speaker: "Prof. David Miller",
        timestamp: "00:46:15",
        seconds: 2775,
        text: "To wrap up today: keep an eye on how prices change in your daily life this week. On Thursday, we will look at elasticity formulas and real grocery store receipts. See you then!",
      },
    ],
  },
  {
    id: "rec-02",
    title: "Psychology & Habit Formation: How Daily Routines Shape the Brain",
    course: "Cognitive Psychology",
    speaker: "Dr. Sarah Jenkins",
    date: "Yesterday · Oct 7, 2026",
    duration: "52m 14s",
    durationSeconds: 3134,
    type: "lecture",
    status: "ready",
    isStarred: true,
    waveform: [
      40, 55, 70, 65, 50, 45, 60, 80, 85, 70, 55, 60, 75, 80, 65, 55, 70, 85,
      90, 60, 45, 55, 70, 45,
    ],
    summary: {
      overview:
        "Dr. Jenkins explored the psychology and neuroscience of habit loops. Rather than relying on raw willpower, which exhausts quickly as the day progresses, our brains automate familiar routines to save energy for unexpected challenges. The lecture explained the three components of any habit—the cue, the routine, and the reward—and offered practical, evidence-based methods for breaking unwanted behaviors and cementing healthy study routines.",
      keyTakeaways: [
        "Every habit consists of three linked steps: a cue (trigger), a routine (the behavior), and a reward (what the brain craves).",
        "Willpower acts like a muscle that fatigues over the course of the day; redesigning your physical environment is far more effective than trying to resist temptation.",
        "To replace a habit, keep the existing cue and reward, but intentionally change the middle routine (e.g. drinking sparkling water when stressed instead of soda).",
        "Habit stacking—attaching a new habit immediately onto an existing automatic routine—accelerates habit formation significantly.",
      ],
      studyQuestions: [
        {
          question:
            "Why does the human brain rely on habits instead of conscious decision-making for everyday tasks?",
          answer:
            "Conscious deliberation consumes significant glucose and mental energy. Automating repetitive behaviors into the basal ganglia frees up cognitive bandwidth for new problem-solving.",
        },
        {
          question:
            "What is the 'Golden Rule' of habit change according to behavioral psychologists?",
          answer:
            "You cannot erase an ingrained habit loop; you can only change it by keeping the cue and reward unchanged while substituting a new, healthier routine.",
        },
        {
          question: "Give an example of 'habit stacking' for a student.",
          answer:
            "Immediately after pouring morning coffee (existing habit), reading one chapter of the textbook for 15 minutes before opening social media (new habit).",
        },
      ],
      actionItems: [
        "Pick one daily study habit you want to build and write down its specific trigger cue.",
        "Read Chapter 4 of 'The Power of Habit' for Wednesday's seminar discussion.",
      ],
    },
    transcript: [
      {
        id: "t10",
        speaker: "Dr. Sarah Jenkins",
        timestamp: "00:02:10",
        seconds: 130,
        text: "Welcome back. Today we are answering a question that frustrates almost everyone: why is it so easy to start a bad habit, and so exhausting to stick to a good one?",
      },
      {
        id: "t11",
        speaker: "Dr. Sarah Jenkins",
        timestamp: "00:08:40",
        seconds: 520,
        text: "The secret is that your brain doesn't judge whether a routine is 'good' or 'bad' for your long-term career. It simply looks for efficiency. If a routine brings relief or pleasure quickly, the brain files it away as a shortcut.",
      },
      {
        id: "t12",
        speaker: "Alex (Student)",
        timestamp: "00:15:20",
        seconds: 920,
        text: "Does that mean people who wake up at 5 AM to study just have more willpower than the rest of us?",
      },
      {
        id: "t13",
        speaker: "Dr. Sarah Jenkins",
        timestamp: "00:16:05",
        seconds: 965,
        text: "Studies show the exact opposite! High achievers don't use more willpower throughout the day; they design their bedrooms, desks, and schedules so they rarely have to use willpower at all.",
      },
    ],
  },
  {
    id: "rec-03",
    title: "Modern World History: The Industrial Revolution & Rise of Cities",
    course: "History 204",
    speaker: "Prof. Robert Hastings",
    date: "Oct 5, 2026",
    duration: "1h 04m",
    durationSeconds: 3840,
    type: "lecture",
    status: "ready",
    isStarred: false,
    waveform: [
      25, 40, 50, 75, 80, 60, 50, 70, 85, 90, 75, 60, 55, 70, 80, 85, 70, 50,
      45, 60, 75, 70, 55, 40,
    ],
    summary: {
      overview:
        "Prof. Hastings reviewed how the transition from handcraft production to steam-powered factories reshaped world society between 1760 and 1850. The class examined how rural families migrated into crowded industrial cities, how new labor patterns replaced the rhythms of the farming calendar with clock time, and how early factory conditions prompted modern labor laws, public sanitation, and universal schooling.",
      keyTakeaways: [
        "The steam engine freed manufacturing from riverbanks, allowing factories to concentrate in growing urban hubs like Manchester and Birmingham.",
        "The concept of 'working by the clock' emerged directly from industrial production schedules, replacing seasonal farming rhythms.",
        "Rapid urbanization initially created severe public health crises, which ultimately spurred modern municipal water systems and health regulations.",
        "Social responses to factory conditions laid the groundwork for the modern weekend, child labor bans, and public primary education.",
      ],
      studyQuestions: [
        {
          question:
            "Why was the invention of James Watt's improved steam engine such a turning point for industrial locations?",
          answer:
            "Earlier water-powered mills had to be built alongside fast-flowing rivers. Steam engines could operate anywhere coal and water could be delivered, centering factories in growing cities.",
        },
        {
          question:
            "How did industrialization change the nature of daily work time for ordinary laborers?",
          answer:
            "Work was no longer governed by daylight or seasonal harvest cycles; it became strictly dictated by factory bells, shifts, and mechanical clock time.",
        },
      ],
    },
    transcript: [
      {
        id: "t20",
        speaker: "Prof. Robert Hastings",
        timestamp: "00:03:00",
        seconds: 180,
        text: "Before 1750, almost everyone alive lived within walking distance of where their food grew. By 1850, millions lived packed together in cities they had never seen as children.",
      },
    ],
  },
  {
    id: "rec-04",
    title: "Product Strategy & UX: Designing Apps People Love to Use",
    course: "Human-Computer Interaction",
    speaker: "Marcus Vance · Guest Speaker",
    date: "Oct 4, 2026",
    duration: "41m 30s",
    durationSeconds: 2490,
    type: "lecture",
    status: "ready",
    isStarred: true,
    waveform: [
      50, 65, 80, 70, 60, 75, 90, 85, 70, 60, 80, 95, 85, 70, 60, 75, 85, 90,
      75, 65, 55, 70, 80, 60,
    ],
    summary: {
      overview:
        "Marcus Vance delivered a talk on building intuitive software. He emphasized that clarity always wins over cleverness. When users struggle with an interface, it is almost never their fault; it is because the designer hid primary actions behind unnecessary layers or used confusing jargon. The lecture reviewed real case studies of simplifying navigation, setting clear visual hierarchy, and respecting user attention.",
      keyTakeaways: [
        "Clarity beats cleverness: users should never have to guess what a button does or where their data went.",
        "Reduce cognitive load by displaying only the information needed for the current step rather than cluttering the screen.",
        "Design for forgiving interactions: make 'Undo' prominent and easy, rather than showing frightening warning popups.",
        "Great typography and consistent spacing do 80% of the heavy lifting in creating a premium, trustworthy product feel.",
      ],
      studyQuestions: [
        {
          question:
            "What is cognitive load in interface design and why does it matter?",
          answer:
            "Cognitive load is the amount of mental effort required to use a system. When interfaces are crowded or confusing, users tire quickly and make more errors.",
        },
      ],
    },
    transcript: [
      {
        id: "t30",
        speaker: "Marcus Vance",
        timestamp: "00:01:45",
        seconds: 105,
        text: "If a user has to read a manual to figure out how to take a note in your app, you haven't built a tool—you've built an obstacle course.",
      },
    ],
  },
  {
    id: "rec-05",
    title: "Life Sciences: Cellular Energy, Mitochondria & Daily Metabolism",
    course: "Biology 102",
    speaker: "Dr. Elena Rostova",
    date: "Oct 3, 2026",
    duration: "56m 45s",
    durationSeconds: 3405,
    type: "lecture",
    status: "ready",
    isStarred: false,
    waveform: [
      35, 50, 65, 75, 60, 45, 55, 70, 80, 75, 60, 50, 65, 80, 85, 70, 60, 50,
      65, 75, 70, 55, 45, 35,
    ],
    summary: {
      overview:
        "A clear, practical breakdown of how human cells transform food into energy (ATP). Dr. Rostova compared cellular respiration to a city's miniature power grid, walking step-by-step through glycolysis and the mitochondria. She explained why oxygen is vital for cellular energy and how regular cardiovascular exercise stimulates cells to build more mitochondria, directly explaining why physical fitness increases everyday energy levels.",
      keyTakeaways: [
        "Mitochondria act like microscopic power generators inside our cells, turning nutrients and oxygen into ATP fuel.",
        "Without sufficient oxygen, cells switch to anaerobic metabolism, which produces far less energy and causes lactic acid buildup.",
        "Aerobic training signals cells to produce more mitochondria (mitochondrial biogenesis), leading to higher baseline stamina.",
      ],
      studyQuestions: [
        {
          question:
            "Why do cells produce significantly more energy with oxygen than without it?",
          answer:
            "Aerobic respiration inside mitochondria yields about 30 to 32 ATP molecules per glucose molecule, whereas anaerobic glycolysis yields only 2 ATP.",
        },
      ],
    },
    transcript: [
      {
        id: "t40",
        speaker: "Dr. Elena Rostova",
        timestamp: "00:02:00",
        seconds: 120,
        text: "Every breath you take right now is delivering oxygen to billions of tiny power stations inside your cells. Today, we see exactly how they keep the lights on.",
      },
    ],
  },
  {
    id: "rec-06",
    title: "Quick Voice Memo: Talking Points for Thursday's Presentation",
    course: "Human-Computer Interaction",
    speaker: "Elena Rostova",
    date: "Oct 2, 2026",
    duration: "04m 12s",
    durationSeconds: 252,
    type: "voice_memo",
    status: "ready",
    isStarred: true,
    waveform: [
      60, 75, 85, 90, 70, 55, 65, 80, 90, 75, 60, 70, 85, 80, 65, 50, 40, 30,
      20, 15, 10, 10, 10, 10,
    ],
    summary: {
      overview:
        "A quick personal memo recorded while walking to the library. Outlined three crucial guidelines for Thursday's team presentation: lead with the problem rather than the solution, show the working prototype within the first two minutes, and protect at least ten minutes for discussion.",
      keyTakeaways: [
        "Open with the core user frustration before introducing the app features.",
        "Keep the slide deck to fewer than 8 slides and spend the majority of the time in the live product.",
        "Anticipate the budget and timeline questions and prepare backup numbers in the appendix.",
      ],
      studyQuestions: [],
      actionItems: [
        "Send rehearsal invite to Maya and Jordan for Wednesday afternoon.",
        "Clean up mock data in the staging environment before the live walkthrough.",
      ],
    },
    transcript: [
      {
        id: "t50",
        speaker: "Elena Rostova",
        timestamp: "00:00:15",
        seconds: 15,
        text: "Quick note for Thursday's client pitch. Don't make the mistake of spending ten minutes talking about our team background. They already know who we are.",
      },
      {
        id: "t51",
        speaker: "Elena Rostova",
        timestamp: "00:01:20",
        seconds: 80,
        text: "Instead, open straight with the user problem. Tell the story of a college student overwhelmed by lectures. Then jump right into the live audio demo.",
      },
    ],
  },
  {
    id: "rec-07",
    title: "Creative Writing Workshop: Dialogue Pacing and Subtext",
    course: "Literature & Writing",
    speaker: "Elena Moretti",
    date: "Sep 30, 2026",
    duration: "38m 50s",
    durationSeconds: 2330,
    type: "lecture",
    status: "ready",
    isStarred: false,
    waveform: [
      30, 40, 55, 65, 50, 45, 60, 75, 70, 55, 65, 80, 75, 60, 50, 65, 75, 80,
      65, 55, 45, 50, 60, 40,
    ],
    summary: {
      overview:
        "A seminar on writing authentic dialogue. Elena Moretti demonstrated why characters in compelling fiction rarely say what they are truly thinking. True drama lives in subtext—the unspoken tension between what characters want, what they are afraid to admit, and the everyday words they use to shield themselves.",
      keyTakeaways: [
        "Subtext is the silent current running underneath spoken words: what is felt but not directly said.",
        "Avoid 'on-the-nose' dialogue where characters explain their internal psychology or summarize plot points to each other.",
        "Give characters competing goals in every conversation to keep the scene alive with subtle conflict.",
      ],
      studyQuestions: [
        {
          question:
            "What is 'on-the-nose' dialogue and why should writers avoid it?",
          answer:
            "On-the-nose dialogue occurs when a character states exactly what they feel, want, or intend without any nuance or subtext, which sounds robotic and artificial.",
        },
      ],
    },
    transcript: [
      {
        id: "t60",
        speaker: "Elena Moretti",
        timestamp: "00:01:30",
        seconds: 90,
        text: "Think about real arguments you have had. People almost never say 'I feel unappreciated and anxious.' They argue about whose turn it was to wash the dishes.",
      },
    ],
  },
  {
    id: "rec-08",
    title: "Environmental Science: Clean Energy Transitions & The Power Grid",
    course: "Earth & Environmental Studies",
    speaker: "Prof. James Thorne",
    date: "Sep 28, 2026",
    duration: "49m 10s",
    durationSeconds: 2950,
    type: "lecture",
    status: "ready",
    isStarred: false,
    waveform: [
      45, 60, 75, 85, 70, 55, 65, 80, 85, 70, 60, 70, 85, 90, 75, 60, 55, 70,
      80, 75, 60, 50, 65, 45,
    ],
    summary: {
      overview:
        "Prof. Thorne presented an overview of modern renewable energy systems and the engineering reality of updating regional power grids. While solar and wind prices have dropped rapidly, the primary bottleneck remains grid flexibility and high-capacity battery storage to balance fluctuating weather conditions across seasons.",
      keyTakeaways: [
        "Generating clean electricity is now cheaper than fossil fuels in most regions, but transmitting and storing that energy remains the chief engineering challenge.",
        "Grid modernization requires expanding high-voltage direct current (HVDC) transmission lines to move power from sunny or windy regions to high-demand cities.",
        "Grid-scale storage relies on a mix of chemical lithium batteries for fast response and pumped hydro or thermal storage for long-duration backup.",
      ],
      studyQuestions: [
        {
          question:
            "What is the primary difference between electricity generation and electricity transmission bottlenecks?",
          answer:
            "Even when ample renewable power is generated, older power grids lack the high-voltage transmission capacity to transport it from remote wind and solar farms to urban centers.",
        },
      ],
    },
    transcript: [
      {
        id: "t70",
        speaker: "Prof. James Thorne",
        timestamp: "00:02:40",
        seconds: 160,
        text: "The sun doesn't shine at midnight and the wind doesn't blow on command. That is why modern clean energy is fundamentally an energy storage and grid problem.",
      },
    ],
  },
];

export const INITIAL_COURSES: CourseItem[] = [
  { id: "all-courses", name: "All Courses", icon: "collection" },
  { id: "econ-101", name: "Economics 101", icon: "chart" },
  { id: "cog-psych", name: "Cognitive Psychology", icon: "brain" },
  { id: "hist-204", name: "History 204", icon: "landmark" },
  { id: "hci", name: "Human-Computer Interaction", icon: "cpu" },
  { id: "bio-102", name: "Biology 102", icon: "flask" },
  { id: "lit-writing", name: "Literature & Writing", icon: "pen" },
  { id: "earth-env", name: "Earth & Environmental Studies", icon: "leaf" },
];

export const AVAILABLE_COURSES = INITIAL_COURSES.map((c) => c.name);
