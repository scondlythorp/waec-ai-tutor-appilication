import { QuestionHistoryItem, QuizAttempt, RevisionNote, StudyPlan, Flashcard, Classroom, ClassroomAssignment, AdminStats, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER_SESSION: 'waec_user_session',
  QUESTION_HISTORY: 'waec_question_history',
  FAVORITES: 'waec_favorites',
  QUIZ_ATTEMPTS: 'waec_quiz_attempts',
  STUDY_PLAN: 'waec_study_plan',
  FLASHCARDS: 'waec_flashcards',
  REVISION_NOTES: 'waec_revision_notes',
  CLASSROOMS: 'waec_classrooms',
  LOW_DATA_MODE: 'waec_low_data_mode',
};

export const storageService = {
  // Low Data Mode
  getLowDataMode(): boolean {
    const val = localStorage.getItem(STORAGE_KEYS.LOW_DATA_MODE);
    return val === 'true';
  },

  setLowDataMode(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.LOW_DATA_MODE, enabled ? 'true' : 'false');
  },

  // User Profile Session
  getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveUserSession(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  },

  clearUserSession(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  },

  // Question History
  getQuestionHistory(): QuestionHistoryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveQuestionHistoryItem(item: QuestionHistoryItem): QuestionHistoryItem[] {
    const existing = this.getQuestionHistory();
    const updated = [item, ...existing.filter((q) => q.id !== item.id)];
    localStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(updated.slice(0, 100)));
    return updated;
  },

  deleteQuestionHistoryItem(id: string): QuestionHistoryItem[] {
    const existing = this.getQuestionHistory();
    const updated = existing.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(updated));
    return updated;
  },

  toggleFavoriteQuestion(id: string): QuestionHistoryItem[] {
    const existing = this.getQuestionHistory();
    const updated = existing.map((q) => {
      if (q.id === id) {
        return { ...q, isFavorite: !q.isFavorite };
      }
      return q;
    });
    localStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(updated));
    return updated;
  },

  // Quiz Attempts
  getQuizAttempts(): QuizAttempt[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveQuizAttempt(attempt: QuizAttempt): QuizAttempt[] {
    const existing = this.getQuizAttempts();
    const updated = [attempt, ...existing];
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(updated));
    return updated;
  },

  // Study Plan
  getStudyPlan(): StudyPlan | null {
    const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveStudyPlan(plan: StudyPlan): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
  },

  updateLessonStatus(lessonId: string, status: 'completed' | 'in_progress' | 'skipped' | 'pending'): StudyPlan | null {
    const plan = this.getStudyPlan();
    if (!plan) return null;
    const updatedWeekly = plan.weeklyPlan.map((l) => (l.id === lessonId ? { ...l, status } : l));
    const updatedPlan = { ...plan, weeklyPlan: updatedWeekly };
    this.saveStudyPlan(updatedPlan);
    return updatedPlan;
  },

  // Flashcards
  getSavedFlashcards(): Flashcard[] {
    const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveFlashcards(cards: Flashcard[]): Flashcard[] {
    const existing = this.getSavedFlashcards();
    const mergedMap = new Map<string, Flashcard>();
    existing.forEach((c) => mergedMap.set(c.id, c));
    cards.forEach((c) => mergedMap.set(c.id, c));
    const updated = Array.from(mergedMap.values());
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(updated));
    return updated;
  },

  updateCardStatus(cardId: string, status: 'know' | 'review'): Flashcard[] {
    const cards = this.getSavedFlashcards();
    const updated = cards.map((c) => (c.id === cardId ? { ...c, status } : c));
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(updated));
    return updated;
  },

  // Revision Notes
  getSavedNotes(): RevisionNote[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVISION_NOTES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveNote(note: RevisionNote): RevisionNote[] {
    const existing = this.getSavedNotes();
    const updated = [note, ...existing.filter((n) => n.id !== note.id)];
    localStorage.setItem(STORAGE_KEYS.REVISION_NOTES, JSON.stringify(updated));
    return updated;
  },

  deleteNote(id: string): RevisionNote[] {
    const existing = this.getSavedNotes();
    const updated = existing.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVISION_NOTES, JSON.stringify(updated));
    return updated;
  },

  // Classrooms
  getClassrooms(): Classroom[] {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addClassroom(classroom: Classroom): Classroom[] {
    const existing = this.getClassrooms();
    const updated = [classroom, ...existing];
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(updated));
    return updated;
  },

  // Admin Stats Mock Data Generator
  getAdminStats(): AdminStats {
    const history = this.getQuestionHistory();
    const quizAttempts = this.getQuizAttempts();

    return {
      totalUsers: 1248,
      activeStudents: 1080,
      teachers: 162,
      questionsAsked: Math.max(1450, history.length + 1420),
      quizzesGenerated: Math.max(680, quizAttempts.length + 670),
      popularSubjects: [
        { subject: 'Mathematics', count: 520 },
        { subject: 'English Language', count: 410 },
        { subject: 'Chemistry', count: 290 },
        { subject: 'Physics', count: 240 },
        { subject: 'Biology', count: 210 },
      ],
      popularTopics: [
        { topic: 'Quadratic Equations', count: 180 },
        { topic: 'Essay Writing Techniques', count: 150 },
        { topic: 'Stoichiometry & Mole Concept', count: 130 },
        { topic: 'Kinematics & Equations of Motion', count: 110 },
      ],
      systemErrors: 0,
      systemHealth: 'Optimal',
    };
  },
};
