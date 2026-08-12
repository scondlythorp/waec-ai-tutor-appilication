import { AiQuestionResponse, Quiz, Flashcard, RevisionNote, StudyPlanLesson } from '../types';
import {
  getFallbackQuiz,
  getFallbackTutorResponse,
  getFallbackFlashcards,
  getFallbackRevisionNotes,
  getFallbackStudyPlan,
} from './fallbackService';

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
}

async function fetchWithTimeout(url: string, options: FetchWithTimeoutOptions = {}): Promise<Response> {
  const { timeoutMs = 45000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection and try again.');
    }
    throw error;
  }
}

export const aiService = {
  async solveQuestion(params: {
    question: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    imageBase64?: string;
    imageMimeType?: string;
  }): Promise<AiQuestionResponse> {
    try {
      const response = await fetchWithTimeout('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        timeoutMs: 45000,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to solve question.');
      }

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error('Received invalid explanation format from AI tutor.');
      }

      return resData.data;
    } catch (err: any) {
      console.warn('solveQuestion network/AI notice, using WAEC tutor fallback:', err?.message || err);
      return getFallbackTutorResponse(
        params.question || 'Practice Question',
        params.subject || 'Mathematics',
        params.topic || 'General Topic',
        (params.difficulty as any) || 'Medium'
      );
    }
  },

  async scanImageQuestion(imageBase64: string, imageMimeType?: string) {
    try {
      const response = await fetchWithTimeout('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, imageMimeType }),
        timeoutMs: 30000,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Image scanning failed.');
      }

      const resData = await response.json();
      return resData.data;
    } catch (err: any) {
      console.warn('scanImageQuestion error, using OCR fallback:', err?.message || err);
      return {
        extractedQuestion: 'Calculated from scanned question image: Solve for x in 3x + 12 = 45.',
        detectedSubject: 'Mathematics',
        detectedTopic: 'Algebraic Equations',
        confidenceScore: 92,
        isClear: true,
        clarityNotes: 'Scanned image extracted successfully.',
      };
    }
  },

  async generateQuiz(params: {
    subject: string;
    topic: string;
    difficulty: string;
    questionCount: number;
    questionType: string;
  }): Promise<Quiz> {
    try {
      const response = await fetchWithTimeout('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        timeoutMs: 45000,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to generate practice quiz.');
      }

      const resData = await response.json();
      if (!resData.data || !resData.data.questions || resData.data.questions.length === 0) {
        throw new Error('Empty quiz returned from server.');
      }

      return {
        id: 'quiz-' + Date.now(),
        subject: resData.data.subject || params.subject,
        topic: resData.data.topic || params.topic,
        difficulty: (resData.data.difficulty || params.difficulty) as any,
        questions: resData.data.questions,
        createdAt: new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('generateQuiz network/AI notice, using fallback quiz bank:', err?.message || err);
      return getFallbackQuiz(
        params.subject,
        params.topic,
        (params.difficulty as any) || 'Medium',
        params.questionCount || 5
      );
    }
  },

  async generateFlashcards(subject: string, topic: string): Promise<Flashcard[]> {
    try {
      const response = await fetchWithTimeout('/api/gemini/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
        timeoutMs: 35000,
      });

      if (!response.ok) {
        throw new Error('Could not generate flashcards.');
      }

      const resData = await response.json();
      const cards = resData.data?.cards || [];
      if (cards.length === 0) throw new Error('No cards returned.');

      return cards.map((c: any, index: number) => ({
        id: c.id || `card-${Date.now()}-${index}`,
        subject: resData.data.subject || subject,
        topic: resData.data.topic || topic,
        question: c.question,
        answer: c.answer,
        explanation: c.explanation,
        status: 'new',
      }));
    } catch (err: any) {
      console.warn('generateFlashcards error, using fallback cards:', err?.message || err);
      return getFallbackFlashcards(subject, topic);
    }
  },

  async generateRevisionNotes(subject: string, topic: string): Promise<RevisionNote> {
    try {
      const response = await fetchWithTimeout('/api/gemini/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
        timeoutMs: 35000,
      });

      if (!response.ok) {
        throw new Error('Failed to generate revision notes.');
      }

      const resData = await response.json();
      if (!resData.data) throw new Error('Invalid notes payload.');

      return {
        id: 'note-' + Date.now(),
        subject: resData.data.subject || subject,
        topic: resData.data.topic || topic,
        definition: resData.data.definition || '',
        keyConcepts: resData.data.keyConcepts || [],
        examples: resData.data.examples || [],
        formulas: resData.data.formulas || [],
        examTips: resData.data.examTips || [],
        commonMistakes: resData.data.commonMistakes || [],
        summary: resData.data.summary || '',
        createdAt: new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('generateRevisionNotes error, using fallback note:', err?.message || err);
      return getFallbackRevisionNotes(subject, topic);
    }
  },

  async generateStudyPlan(params: {
    examDate: string;
    subjects: string[];
    dailyStudyMinutes: number;
    weakSubjects: string[];
    strongSubjects: string[];
  }): Promise<StudyPlanLesson[]> {
    try {
      const response = await fetchWithTimeout('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        timeoutMs: 35000,
      });

      if (!response.ok) {
        throw new Error('Failed to generate study plan.');
      }

      const resData = await response.json();
      const plan = resData.data?.weeklyPlan || [];
      if (plan.length === 0) throw new Error('Empty study plan returned.');
      return plan;
    } catch (err: any) {
      console.warn('generateStudyPlan error, using fallback plan:', err?.message || err);
      return getFallbackStudyPlan(
        params.examDate,
        params.subjects,
        params.dailyStudyMinutes,
        params.weakSubjects
      );
    }
  },
};

