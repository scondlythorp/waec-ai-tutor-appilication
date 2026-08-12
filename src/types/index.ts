export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  school?: string;
  classGrade?: string; // SSS1, SSS2, SSS3
  country?: string; // Gambia, Nigeria, Ghana, Sierra Leone, Liberia
  subjects?: string[];
  createdAt: string;
  lowDataMode?: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'structured' | 'calculation';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ExplanationBreakdown {
  asking: string;
  importantInfo: string[];
  stepByStep: string[];
  finalAnswer: string;
  explanation: string;
  examTip: string;
  commonMistake: string;
}

export interface AiQuestionResponse {
  subject: string;
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionType;
  explanation: ExplanationBreakdown;
  rawResponse?: string;
}

export interface QuestionHistoryItem {
  id: string;
  userId: string;
  questionText: string;
  imageUrl?: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  response: ExplanationBreakdown;
  createdAt: string;
  isFavorite?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  type: QuestionType;
}

export interface Quiz {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId?: string;
  quizId: string;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds?: number;
  timeSpentSeconds?: number;
  userAnswers?: Record<string, string | number>;
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: string[];
    revisionTips: string[];
  };
  createdAt?: string;
  completedAt?: string;
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  question: string;
  answer: string;
  explanation: string;
  status?: 'know' | 'review' | 'new';
}

export interface RevisionNote {
  id: string;
  subject: string;
  topic: string;
  definition: string;
  keyConcepts: string[];
  examples: string[];
  formulas?: string[];
  examTips: string[];
  commonMistakes: string[];
  summary: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface StudyPlanLesson {
  id: string;
  day: string; // e.g., 'Monday', 'Day 1'
  subject: string;
  topic: string;
  targetObjective: string;
  durationMinutes: number;
  status: 'completed' | 'in_progress' | 'skipped' | 'pending';
}

export interface StudyPlan {
  id: string;
  userId?: string;
  examDate: string;
  subjects?: string[];
  dailyStudyMinutes: number;
  weakSubjects?: string[];
  strongSubjects?: string[];
  weeklyPlan: StudyPlanLesson[];
  createdAt: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  category: 'Sciences' | 'Arts & Humanities' | 'Commercial & Social Sciences' | 'Technical & Vocational';
  iconName: string;
  description: string;
  topics: string[];
  sampleQuestionCount: number;
}

export interface Classroom {
  id: string;
  code: string;
  classCode?: string;
  name: string;
  subject: string;
  grade?: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  createdAt: string;
}

export interface ClassroomAssignment {
  id: string;
  classId: string;
  title: string;
  subject: string;
  topic: string;
  dueDate: string;
  instructions: string;
  questionCount: number;
  submissionsCount: number;
}

export interface AdminStats {
  totalUsers: number;
  activeStudents: number;
  teachers: number;
  questionsAsked: number;
  quizzesGenerated: number;
  popularSubjects: { subject: string; count: number }[];
  popularTopics: { topic: string; count: number }[];
  systemErrors: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Attention Required';
}
