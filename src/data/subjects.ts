import { SubjectInfo } from '../types';

export const WAEC_SUBJECTS: SubjectInfo[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    category: 'Sciences',
    iconName: 'Calculator',
    description: 'Core mathematics syllabus covering Algebra, Geometry, Trigonometry, Statistics, Probability, and Calculus fundamentals.',
    topics: [
      'Number and Numeration',
      'Algebraic Expressions & Factorization',
      'Linear and Quadratic Equations',
      'Simultaneous Equations',
      'Surds and Logarithms',
      'Plane Geometry & Theorems',
      'Trigonometric Ratios & Angles',
      'Mensuration (Volume & Surface Area)',
      'Statistics (Mean, Median, Standard Deviation)',
      'Probability & Combinatorics',
      'Matrices and Transformations',
      'Vectors and Coordinate Geometry'
    ],
    sampleQuestionCount: 450
  },
  {
    id: 'english_language',
    name: 'English Language',
    category: 'Arts & Humanities',
    iconName: 'BookOpen',
    description: 'Master Essay Writing, Comprehension, Summary, Lexis and Structure, Oral English, and Grammar rules.',
    topics: [
      'Essay Writing (Narrative, Argumentative, Formal/Informal Letters)',
      'Reading Comprehension Strategies',
      'Summary Writing Techniques',
      'Lexis and Structure (Vocabulary, Synonyms, Antonyms)',
      'Grammar & Sentence Structures',
      'Prepositions & Phrasal Verbs',
      'Idiomatic Expressions',
      'Oral English (Vowels, Consonants, Rhymes, Stress & Intonation)',
      'Registers and Contextual Vocabulary'
    ],
    sampleQuestionCount: 520
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'Sciences',
    iconName: 'Zap',
    description: 'Mechanics, Heat, Waves, Optics, Electricity, Magnetism, and Atomic Physics.',
    topics: [
      'Units, Measurements & Vectors',
      'Kinematics & Equations of Motion',
      'Forces, Work, Energy & Power',
      'Momentum and Impulse',
      'Simple Harmonic Motion (SHM)',
      'Thermal Physics & Heat Capacity',
      'Waves, Sound & Reflection/Refraction',
      'Light & Optical Instruments',
      'Electrostatics & Electric Fields',
      'Current Electricity & Ohm’s Law',
      'Electromagnetism & Transformers',
      'Atomic & Nuclear Physics'
    ],
    sampleQuestionCount: 380
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    category: 'Sciences',
    iconName: 'FlaskConical',
    description: 'Atomic structure, Stoichiometry, Periodicity, Bonding, Acids & Bases, Energetics, Organic Chemistry.',
    topics: [
      'Atomic Structure & Chemical Bonding',
      'The Periodic Table & Trends',
      'Stoichiometry & Mole Concept',
      'States of Matter & Gas Laws',
      'Acids, Bases, Salts & Neutralization',
      'Oxidation-Reduction (Redox) Reactions',
      'Rates of Reaction & Chemical Equilibrium',
      'Thermodynamics & Energetics',
      'Electrochemistry & Electrolysis',
      'Hydrocarbons (Alkanes, Alkenes, Alkynes)',
      'Functional Groups (Alcohols, Organic Acids, Esters)',
      'Environmental Chemistry & Pollution'
    ],
    sampleQuestionCount: 410
  },
  {
    id: 'biology',
    name: 'Biology',
    category: 'Sciences',
    iconName: 'Dna',
    description: 'Cell biology, Plant & Animal Physiology, Genetics, Ecology, Evolution, and Microorganisms.',
    topics: [
      'Cell Structure and Organization',
      'Nutrition in Plants and Animals',
      'Transport Systems (Xylem, Phloem, Circulatory)',
      'Respiration and Gas Exchange',
      'Excretion and Homeostasis',
      'Reproduction in Flowering Plants & Mammals',
      'Genetics, Heredity & DNA',
      'Ecology, Ecosystems & Food Chains',
      'Adaptations and Evolution',
      'Microorganisms & Diseases'
    ],
    sampleQuestionCount: 490
  },
  {
    id: 'geography',
    name: 'Geography',
    category: 'Arts & Humanities',
    iconName: 'Globe',
    description: 'Physical geography, Map reading, Climate, Human geography, Economic activity in West Africa.',
    topics: [
      'Map Reading and Interpretation',
      'The Earth and Solar System',
      'Rocks and Weathering',
      'Landforms (Rivers, Coastal, Desert, Karst)',
      'Weather, Climate & Vegetation Zones',
      'Population and Settlement Patterns',
      'Agriculture and Industry in West Africa',
      'Transportation and Trade in West Africa',
      'Environmental Hazards & Management'
    ],
    sampleQuestionCount: 310
  },
  {
    id: 'economics',
    name: 'Economics',
    category: 'Commercial & Social Sciences',
    iconName: 'TrendingUp',
    description: 'Microeconomics, Demand & Supply, Elasticity, Market structures, Macroeconomics, Money & Banking.',
    topics: [
      'Basic Economic Concepts & Scarcity',
      'Demand, Supply and Price Determination',
      'Elasticity of Demand and Supply',
      'Theory of Production & Cost Curves',
      'Market Structures (Perfect Competition, Monopoly)',
      'National Income Accounting',
      'Money, Banking and Inflation',
      'Public Finance and Taxation',
      'International Trade & Balance of Payments',
      'Economic Integration in West Africa (ECOWAS)'
    ],
    sampleQuestionCount: 420
  },
  {
    id: 'government',
    name: 'Government',
    category: 'Commercial & Social Sciences',
    iconName: 'Landmark',
    description: 'Political concepts, Constitution, Organs of Government, Political Parties, West African Political History.',
    topics: [
      'Concepts of State, Nation, Power & Authority',
      'Types and Systems of Government',
      'Organs of Government (Executive, Legislature, Judiciary)',
      'Constitutions and Constitutionalism',
      'Electoral Systems and Franchise',
      'Public Administration & Civil Service',
      'Pre-Colonial Political Systems in West Africa',
      'Colonial Rule and Nationalism in West Africa',
      'Post-Independence Politics and Military Regimes',
      'Foreign Policy and International Organizations (UN, AU, ECOWAS)'
    ],
    sampleQuestionCount: 360
  },
  {
    id: 'history',
    name: 'History',
    category: 'Arts & Humanities',
    iconName: 'History',
    description: 'West African history, Ancient kingdoms, Trans-Saharan trade, Colonial era, and Modern statehood.',
    topics: [
      'Ancient Civilizations and Kingdoms of West Africa',
      'Trans-Saharan Trade & Islamic Influence',
      'Trans-Atlantic Slave Trade & Consequences',
      'Scramble for and Partition of Africa',
      'Colonial Administration (Indirect Rule vs Assimilation)',
      'Nationalist Movements and Independence',
      'Post-Independence Challenges & Economic Development'
    ],
    sampleQuestionCount: 280
  },
  {
    id: 'accounting',
    name: 'Accounting',
    category: 'Commercial & Social Sciences',
    iconName: 'CreditCard',
    description: 'Financial accounting, Ledger entries, Trial Balance, Final Accounts, Control Accounts, Partnership & Company accounts.',
    topics: [
      'Double Entry System and Books of Original Entry',
      'Ledger Posting and Trial Balance',
      'Control Accounts and Bank Reconciliation',
      'Final Accounts of a Sole Trader',
      'Adjustments in Final Accounts (Accruals & Prepayments)',
      'Partnership Accounts (Realization & Distribution)',
      'Company Accounts & Capital Structure',
      'Not-for-Profit Organization Accounts'
    ],
    sampleQuestionCount: 340
  },
  {
    id: 'commerce',
    name: 'Commerce',
    category: 'Commercial & Social Sciences',
    iconName: 'ShoppingBag',
    description: 'Trade, Business Organization, Banking, Insurance, Warehousing, Advertising, Consumer Protection.',
    topics: [
      'Introduction to Commerce and Production',
      'Home Trade (Wholesale & Retail)',
      'Foreign Trade (Import & Export procedures)',
      'Business Units (Sole Proprietorship, PLC, Cooperatives)',
      'Banking Services & Payment Instruments',
      'Insurance Principles and Types',
      'Transportation & Warehousing',
      'Advertising and Sales Promotion',
      'Consumer Protection & Business Law'
    ],
    sampleQuestionCount: 310
  },
  {
    id: 'ict',
    name: 'ICT / Computer Studies',
    category: 'Technical & Vocational',
    iconName: 'Laptop',
    description: 'Computer Hardware, Software, Networking, Database, Programming basics, Cyber Security, Web Tech.',
    topics: [
      'Fundamentals of Computing & Hardware',
      'System & Application Software',
      'Data Processing & Storage Systems',
      'Computer Networks and the Internet',
      'Database Management Systems (DBMS)',
      'Algorithms and Logic Diagrams',
      'Basic Programming Principles',
      'Cyber Security, Virus & Data Safety',
      'Societal Impacts of ICT'
    ],
    sampleQuestionCount: 330
  },
  {
    id: 'literature',
    name: 'Literature',
    category: 'Arts & Humanities',
    iconName: 'Feather',
    description: 'African and Non-African Prose, Drama, Poetry, Literary Devices, Unseen Prose & Poetry.',
    topics: [
      'Literary Terms and Figures of Speech',
      'African Prose Texts & Analysis',
      'Non-African Prose Texts & Analysis',
      'African Drama Texts & Analysis',
      'Non-African Drama Texts & Analysis',
      'African Poetry Analysis',
      'Non-African Poetry Analysis',
      'Unseen Prose & Poetry Techniques'
    ],
    sampleQuestionCount: 290
  },
  {
    id: 'integrated_science',
    name: 'Integrated Science',
    category: 'Sciences',
    iconName: 'Sparkles',
    description: 'Foundational concepts in Physics, Chemistry, Biology, Agriculture, and Environmental Science.',
    topics: [
      'Scientific Method & Laboratory Safety',
      'Matter, Elements & Compounds',
      'Living and Non-Living Systems',
      'Forces, Energy Forms & Conversion',
      'Soil Science & Agricultural Practices',
      'Human Health, Hygiene & Diseases',
      'Ecosystems & Environmental Conservation'
    ],
    sampleQuestionCount: 350
  }
];

export const WEST_AFRICAN_COUNTRIES = [
  'The Gambia',
  'Nigeria',
  'Ghana',
  'Sierra Leone',
  'Liberia'
];

export const SCHOOL_CLASSES = [
  'SSS 1 (Senior Secondary 1)',
  'SSS 2 (Senior Secondary 2)',
  'SSS 3 (WASSCE Candidate)',
  'Private / WAEC GCE Candidate',
  'Teacher / Educator'
];
