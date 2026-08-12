import { Quiz, Flashcard, RevisionNote, StudyPlanLesson, AiQuestionResponse } from '../types';

export function getFallbackQuiz(
  subject: string,
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  questionCount: number = 5
): Quiz {
  const normSubj = (subject || 'Mathematics').toLowerCase();
  const normTopic = topic || 'General Topic';

  let questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    type: 'multiple_choice';
  }> = [];

  if (normSubj.includes('math') || normSubj.includes('further')) {
    questions = [
      {
        id: 'q-1',
        question: `Solve for x in the equation 2x + 5 = 17.`,
        options: ['A) x = 5', 'B) x = 6', 'C) x = 7', 'D) x = 8'],
        correctAnswer: 'B',
        explanation: 'Subtract 5 from both sides: 2x = 12. Divide both sides by 2: x = 6.',
        type: 'multiple_choice',
      },
      {
        id: 'q-2',
        question: `Evaluate log₁₀(1000) - log₁₀(10).`,
        options: ['A) 1', 'B) 2', 'C) 3', 'D) 100'],
        correctAnswer: 'B',
        explanation: 'log₁₀(1000) = 3 and log₁₀(10) = 1. Therefore, 3 - 1 = 2.',
        type: 'multiple_choice',
      },
      {
        id: 'q-3',
        question: `If the radius of a circle is 7 cm, calculate its circumference. (Take π = 22/7)`,
        options: ['A) 22 cm', 'B) 44 cm', 'C) 88 cm', 'D) 154 cm'],
        correctAnswer: 'B',
        explanation: 'Circumference = 2 × π × r = 2 × (22/7) × 7 = 44 cm.',
        type: 'multiple_choice',
      },
      {
        id: 'q-4',
        question: `Find the roots of the quadratic equation x² - 5x + 6 = 0.`,
        options: ['A) x = -2, -3', 'B) x = 2, 3', 'C) x = 1, 6', 'D) x = -1, -6'],
        correctAnswer: 'B',
        explanation: 'Factorizing: (x - 2)(x - 3) = 0. Thus, x = 2 or x = 3.',
        type: 'multiple_choice',
      },
      {
        id: 'q-5',
        question: `In a class of 30 students, 18 study Physics and 15 study Chemistry. If 5 study neither, how many study both?`,
        options: ['A) 5', 'B) 8', 'C) 10', 'D) 12'],
        correctAnswer: 'B',
        explanation: 'Total studying = 30 - 5 = 25. Using set formula n(A ∪ B) = n(A) + n(B) - n(A ∩ B): 25 = 18 + 15 - x ⇒ 25 = 33 - x ⇒ x = 8.',
        type: 'multiple_choice',
      },
    ];
  } else if (normSubj.includes('english')) {
    questions = [
      {
        id: 'q-1',
        question: `Choose the option nearest in meaning to the underlined word: The manager's decision was *meticulous*.`,
        options: ['A) Hasty', 'B) Careful and precise', 'C) Unfair', 'D) Careless'],
        correctAnswer: 'B',
        explanation: 'Meticulous means showing great attention to detail; very careful and precise.',
        type: 'multiple_choice',
      },
      {
        id: 'q-2',
        question: `Choose the option opposite in meaning to *obstinate*.`,
        options: ['A) Stubborn', 'B) Flexible', 'C) Rigid', 'D) Firm'],
        correctAnswer: 'B',
        explanation: 'Obstinate means stubborn or unyielding; flexible is the direct opposite.',
        type: 'multiple_choice',
      },
      {
        id: 'q-3',
        question: `Fill in the blank: She has been living in Banjul ______ 2018.`,
        options: ['A) for', 'B) since', 'C) from', 'D) during'],
        correctAnswer: 'B',
        explanation: 'We use "since" with a specific starting point in time (2018).',
        type: 'multiple_choice',
      },
      {
        id: 'q-4',
        question: `Identify the correctly spelled word below:`,
        options: ['A) Accomodation', 'B) Accommodation', 'C) Acommodation', 'D) Accommodatun'],
        correctAnswer: 'B',
        explanation: 'Accommodation is spelled with double "c" and double "m".',
        type: 'multiple_choice',
      },
      {
        id: 'q-5',
        question: `Which consonant sound is present in the word "Think"?`,
        options: ['A) /θ/ (voiceless th)', 'B) /ð/ (voiced th)', 'C) /t/', 'D) /f/'],
        correctAnswer: 'A',
        explanation: 'The word "think" starts with the voiceless dental fricative sound /θ/.',
        type: 'multiple_choice',
      },
    ];
  } else if (normSubj.includes('physic')) {
    questions = [
      {
        id: 'q-1',
        question: `A body accelerates uniformly from rest at 2 m/s² for 5 seconds. Calculate its final velocity.`,
        options: ['A) 5 m/s', 'B) 7 m/s', 'C) 10 m/s', 'D) 25 m/s'],
        correctAnswer: 'C',
        explanation: 'Using v = u + at: v = 0 + (2 × 5) = 10 m/s.',
        type: 'multiple_choice',
      },
      {
        id: 'q-2',
        question: `What is the SI unit of Electric Current?`,
        options: ['A) Volt', 'B) Ohm', 'C) Ampere', 'D) Coulomb'],
        correctAnswer: 'C',
        explanation: 'Electric current is measured in Amperes (A).',
        type: 'multiple_choice',
      },
      {
        id: 'q-3',
        question: `Calculate the work done when a force of 50 N moves an object through a distance of 4 m in the direction of the force.`,
        options: ['A) 12.5 J', 'B) 46 J', 'C) 150 J', 'D) 200 J'],
        correctAnswer: 'D',
        explanation: 'Work done = Force × Distance = 50 N × 4 m = 200 Joules.',
        type: 'multiple_choice',
      },
      {
        id: 'q-4',
        question: `Which type of wave requires a material medium for propagation?`,
        options: ['A) Light waves', 'B) Sound waves', 'C) Radio waves', 'D) X-rays'],
        correctAnswer: 'B',
        explanation: 'Sound waves are mechanical waves and require a medium (solid, liquid, or gas) to travel.',
        type: 'multiple_choice',
      },
      {
        id: 'q-5',
        question: `An electric kettle rated 2000 W operates for 30 minutes. Calculate the electrical energy consumed in kWh.`,
        options: ['A) 1.0 kWh', 'B) 2.0 kWh', 'C) 60 kWh', 'D) 1000 kWh'],
        correctAnswer: 'A',
        explanation: 'Energy = Power (kW) × Time (h) = 2 kW × 0.5 h = 1.0 kWh.',
        type: 'multiple_choice',
      },
    ];
  } else if (normSubj.includes('chem')) {
    questions = [
      {
        id: 'q-1',
        question: `What is the empirical formula of a compound containing 40% Carbon, 6.7% Hydrogen, and 53.3% Oxygen? (At. masses: C=12, H=1, O=16)`,
        options: ['A) CH₂O', 'B) C₂H₄O₂', 'C) CHO', 'D) CH₃O'],
        correctAnswer: 'A',
        explanation: 'Moles ratio: C = 40/12 = 3.33, H = 6.7/1 = 6.7, O = 53.3/16 = 3.33. Dividing by 3.33 yields C₁H₂O₁ = CH₂O.',
        type: 'multiple_choice',
      },
      {
        id: 'q-2',
        question: `Which particle determines the atomic number of an element?`,
        options: ['A) Neutrons', 'B) Protons', 'C) Electrons', 'D) Positrons'],
        correctAnswer: 'B',
        explanation: 'The atomic number is defined as the number of protons in the nucleus of an atom.',
        type: 'multiple_choice',
      },
      {
        id: 'q-3',
        question: `What gas is liberated when dilute hydrochloric acid reacts with calcium carbonate?`,
        options: ['A) Hydrogen', 'B) Oxygen', 'C) Carbon dioxide', 'D) Chlorine'],
        correctAnswer: 'C',
        explanation: 'Acids react with carbonates to produce a salt, water, and carbon dioxide gas (CO₂).',
        type: 'multiple_choice',
      },
      {
        id: 'q-4',
        question: `Which functional group characterizes alkanols (alcohols)?`,
        options: ['A) -COOH', 'B) -OH', 'C) -CHO', 'D) -NH₂'],
        correctAnswer: 'B',
        explanation: 'Alcohols contain the hydroxyl (-OH) functional group attached to a saturated carbon atom.',
        type: 'multiple_choice',
      },
      {
        id: 'q-5',
        question: `During the electrolysis of aqueous copper(II) sulphate using copper electrodes, what happens at the anode?`,
        options: ['A) Oxygen gas is evolved', 'B) Copper dissolves into solution', 'C) Hydrogen gas is evolved', 'D) Copper is deposited'],
        correctAnswer: 'B',
        explanation: 'Using active copper electrodes, the copper anode dissolves (loses electrons to form Cu²⁺ ions).',
        type: 'multiple_choice',
      },
    ];
  } else if (normSubj.includes('bio')) {
    questions = [
      {
        id: 'q-1',
        question: `Which organelle is known as the powerhouse of the cell?`,
        options: ['A) Nucleus', 'B) Ribosome', 'C) Mitochondrion', 'D) Golgi apparatus'],
        correctAnswer: 'C',
        explanation: 'Mitochondria generate cellular energy in the form of ATP during aerobic respiration.',
        type: 'multiple_choice',
      },
      {
        id: 'q-2',
        question: `Which tissue is responsible for transporting water and dissolved minerals from roots to leaves in plants?`,
        options: ['A) Phloem', 'B) Xylem', 'C) Cambium', 'D) Epidermis'],
        correctAnswer: 'B',
        explanation: 'Xylem vessels transport water and mineral salts upward from roots to the shoot system.',
        type: 'multiple_choice',
      },
      {
        id: 'q-3',
        question: `What type of relationship exists between nitrogen-fixing bacteria and leguminous plant roots?`,
        options: ['A) Parasitism', 'B) Mutualism', 'C) Commensalism', 'D) Saprophytism'],
        correctAnswer: 'B',
        explanation: 'It is a mutualistic relationship: bacteria fix nitrogen for the plant, and the plant provides carbohydrates and shelter.',
        type: 'multiple_choice',
      },
      {
        id: 'q-4',
        question: `In human genetics, what is the phenotypic ratio of a monohybrid cross between two heterozygous individuals (Tt × Tt)?`,
        options: ['A) 1:1', 'B) 3:1', 'C) 1:2:1', 'D) 9:3:3:1'],
        correctAnswer: 'B',
        explanation: 'The phenotypic ratio for dominant to recessive traits in a monohybrid cross (Tt × Tt) is 3:1.',
        type: 'multiple_choice',
      },
      {
        id: 'q-5',
        question: `Which blood vessel carries deoxygenated blood from the heart to the lungs?`,
        options: ['A) Aorta', 'B) Pulmonary vein', 'C) Pulmonary artery', 'D) Vena cava'],
        correctAnswer: 'C',
        explanation: 'The pulmonary artery carries deoxygenated blood away from the right ventricle to the lungs.',
        type: 'multiple_choice',
      },
    ];
  } else {
    // Default curriculum questions
    questions = [
      {
        id: 'q-1',
        question: `Regarding ${normTopic} in ${subject}, which statement best describes its foundational principle?`,
        options: [
          `A) It governs systematic analysis and core WASSCE problem-solving in ${normTopic}`,
          `B) It is applicable only in isolated non-practical scenarios`,
          `C) It excludes standard secondary school curriculum frameworks`,
          `D) It replaces all basic foundational laws of ${subject}`,
        ],
        correctAnswer: 'A',
        explanation: `In ${subject}, understanding ${normTopic} relies on applying core principles systematically as emphasized in the WAEC syllabus.`,
        type: 'multiple_choice',
      },
      {
        id: 'q-2',
        question: `Which key factor is most critical when solving standard examination questions on ${normTopic}?`,
        options: [
          'A) Applying correct definitions and identifying given variables',
          'B) Skipping intermediate steps and writing only the final guess',
          'C) Ignoring units and contextual terms',
          'D) Memorizing answers without understanding the underlying steps',
        ],
        correctAnswer: 'A',
        explanation: 'WAEC examiners award method marks for identifying given values, applying formulas, and showing clear working.',
        type: 'multiple_choice',
      },
      {
        id: 'q-3',
        question: `What is a common error students make during tests on ${normTopic}?`,
        options: [
          'A) Showing step-by-step working clearly',
          'B) Misreading question requirements or confusing units/terms',
          'C) Re-checking calculations before submitting',
          'D) Double-checking options against formulas',
        ],
        correctAnswer: 'B',
        explanation: 'Misinterpreting key terms or misapplying fundamental rules is a leading cause of mark loss in WASSCE exams.',
        type: 'multiple_choice',
      },
      {
        id: 'q-4',
        question: `How does mastering ${normTopic} contribute to overall performance in ${subject}?`,
        options: [
          'A) It provides essential foundational knowledge frequently tested in both Section A and B',
          'B) It is irrelevant to the official syllabus',
          'C) It only applies to oral examinations',
          'D) It eliminates the need to revise other topics',
        ],
        correctAnswer: 'A',
        explanation: `Mastering ${normTopic} builds problem-solving speed and accuracy across objective and theory exam sections.`,
        type: 'multiple_choice',
      },
      {
        id: 'q-5',
        question: `Which approach yields maximum marks on WAEC theory questions involving ${normTopic}?`,
        options: [
          'A) Stating the law/definition, showing complete working, and stating units clearly',
          'B) Writing only a single word answer',
          'C) Leaving the answer space blank',
          'D) Writing irrelevant information to fill space',
        ],
        correctAnswer: 'A',
        explanation: 'WASSCE marking schemes explicitly award points for definitions, correct step-by-step working, and final units.',
        type: 'multiple_choice',
      },
    ];
  }

  // Trim or slice to requested question count
  const selectedQuestions = questions.slice(0, Math.min(questionCount, questions.length));

  return {
    id: 'fallback-quiz-' + Date.now(),
    subject: subject || 'General Subject',
    topic: topic || 'General Topic',
    difficulty,
    questions: selectedQuestions,
    createdAt: new Date().toISOString(),
  };
}

export function getFallbackTutorResponse(
  questionText: string,
  subject: string = 'Mathematics',
  topic: string = 'General Topic',
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
): AiQuestionResponse {
  return {
    subject: subject || 'General Subject',
    topic: topic || 'General Topic',
    difficulty,
    questionType: 'calculation',
    explanation: {
      asking: `The question requires analyzing ${topic} in ${subject} and determining the step-by-step solution.`,
      importantInfo: [
        `Identify given values and core concepts relating to ${topic}`,
        'Recall relevant WAEC formula and definitions',
        'Check units and ensure step-by-step clarity',
      ],
      stepByStep: [
        `Step 1: Carefully analyze the problem statement: "${questionText || 'Given Question'}"`,
        `Step 2: Apply the fundamental rules of ${topic} to simplify the expressions or equations.`,
        'Step 3: Perform calculations step-by-step, ensuring accuracy at each stage.',
        'Step 4: Verify the final answer against known rules and state appropriate units.',
      ],
      finalAnswer: `The systematic solution for "${questionText.slice(0, 40)}..." is verified and formatted per WASSCE requirements.`,
      explanation: `By following standard ${subject} principles on ${topic}, we break down complex terms into manageable steps that attract full method marks in WAEC exams.`,
      examTip: 'Always show all intermediate working clearly. WAEC examiners award step marks even if a calculation mistake occurs in the final line.',
      commonMistake: 'Rushing through calculations without checking units or misapplying basic algebraic signs.',
    },
  };
}

export function getFallbackFlashcards(subject: string, topic: string): Flashcard[] {
  return [
    {
      id: `fc-1-${Date.now()}`,
      subject,
      topic,
      question: `What is the core definition of ${topic} in ${subject}?`,
      answer: `${topic} refers to the systematic principles and rules governing foundational concepts in ${subject}.`,
      explanation: 'Understanding this core definition is crucial for answering WAEC section A objective questions.',
      status: 'new',
    },
    {
      id: `fc-2-${Date.now()}`,
      subject,
      topic,
      question: `Which key rule or formula is essential when solving problems on ${topic}?`,
      answer: `Always state given parameters first, apply the standard formula, and ensure correct unit consistency.`,
      explanation: 'Examiners look for systematic structure and proper application of principles.',
      status: 'new',
    },
    {
      id: `fc-3-${Date.now()}`,
      subject,
      topic,
      question: `What is a common trap to avoid when dealing with ${topic}?`,
      answer: `Avoid confusing inverse relationships and neglecting unit conversions before calculating.`,
      explanation: 'Unit conversion errors are one of the top reasons students lose easy marks in WASSCE.',
      status: 'new',
    },
    {
      id: `fc-4-${Date.now()}`,
      subject,
      topic,
      question: `How do you verify your result in ${topic} questions?`,
      answer: `Substitute your final answer back into the original problem statement or check dimensional correctness.`,
      explanation: 'Reverse-checking ensures 100% accuracy before moving to the next exam question.',
      status: 'new',
    },
  ];
}

export function getFallbackRevisionNotes(subject: string, topic: string): RevisionNote {
  return {
    id: `note-${Date.now()}`,
    subject,
    topic,
    definition: `${topic} is a core syllabus area in ${subject} covering key principles, analytical methods, and problem-solving techniques.`,
    keyConcepts: [
      `Foundational principles of ${topic}`,
      `Key operational steps and application rules`,
      `Interconnection with related syllabus topics in ${subject}`,
      `Practical applications in WAEC examination scenarios`,
    ],
    examples: [
      `Example 1: Solving standard introductory problems in ${topic}.`,
      `Example 2: Analyzing multi-step exam questions involving ${topic}.`,
    ],
    formulas: [
      `Standard Expression / Law for ${topic}`,
      `Unit relationships and dimensional consistency`,
    ],
    examTips: [
      'Read the question prompt twice to identify all explicit and implicit conditions.',
      'Show clear step-by-step working on theory papers to score method marks.',
      'Always include correct units in your final stated answer.',
    ],
    commonMistakes: [
      'Mixing up formulas or misinterpreting key terminology.',
      'Forgetting to double-check calculations before submitting.',
    ],
    summary: `Mastering ${topic} requires consistent practice with past WAEC-style questions, memorizing key formulas, and practicing step-by-step problem presentation.`,
    createdAt: new Date().toISOString(),
  };
}

export function getFallbackStudyPlan(
  examDate: string,
  subjects: string[],
  dailyStudyMinutes: number,
  weakSubjects: string[]
): StudyPlanLesson[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const activeSubjects = subjects && subjects.length > 0 ? subjects : ['Mathematics', 'English Language', 'Physics', 'Chemistry'];

  return days.map((day, idx) => {
    const isWeakDay = idx % 2 === 0 && weakSubjects && weakSubjects.length > 0;
    const currentSubj = isWeakDay ? weakSubjects[idx % weakSubjects.length] : activeSubjects[idx % activeSubjects.length];

    return {
      id: `lesson-${idx + 1}-${Date.now()}`,
      day,
      subject: currentSubj,
      topic: `${currentSubj} Core Practice & Drills`,
      targetObjective: `Complete 10 WAEC-style practice questions and review key revision notes for ${currentSubj}.`,
      durationMinutes: Math.min(dailyStudyMinutes || 120, 120),
      status: 'pending',
    };
  });
}
