import React, { useState } from 'react';
import { BrainCircuit, Sparkles, CheckCircle2, XCircle, Clock, RefreshCw, ArrowLeft, Award, HelpCircle, AlertCircle } from 'lucide-react';
import { WAEC_SUBJECTS } from '../../data/subjects';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storage';
import { Quiz, QuizQuestion, QuizAttempt } from '../../types';

interface QuizGeneratorViewProps {
  initialSubject?: string;
  initialTopic?: string;
  onNavigate: (view: string, state?: any) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const QuizGeneratorView: React.FC<QuizGeneratorViewProps> = ({
  initialSubject,
  initialTopic,
  onNavigate,
  showToast,
}) => {
  const [subject, setSubject] = useState(initialSubject || WAEC_SUBJECTS[0].name);
  const activeSubjectObj = WAEC_SUBJECTS.find((s) => s.name === subject) || WAEC_SUBJECTS[0];
  const [topic, setTopic] = useState(initialTopic || activeSubjectObj.topics[0]);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>('multiple_choice');

  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  // Active Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setQuiz(null);
    setQuizCompleted(false);
    setUserAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);

    try {
      const generatedQuiz = await aiService.generateQuiz({
        subject,
        topic,
        difficulty,
        questionCount,
        questionType,
      });

      setQuiz(generatedQuiz);
      showToast(`Generated ${generatedQuiz.questions.length} WAEC-style questions!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate quiz. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optionLetter: string) => {
    if (quizCompleted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optionLetter }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleFinishQuiz = () => {
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);

    const attempt: QuizAttempt = {
      id: 'attempt-' + Date.now(),
      quizId: quiz.id,
      subject: quiz.subject,
      topic: quiz.topic,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      timeSpentSeconds: 120,
      completedAt: new Date().toISOString(),
    };

    storageService.saveQuizAttempt(attempt);
    setAttemptResult(attempt);
    setQuizCompleted(true);
    showToast(`Quiz completed! Score: ${percentage}%`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" /> AI Practice Quiz Generator
          </h1>
          <p className="text-xs text-slate-400">Generate tailored practice questions with immediate answer feedback and explanations.</p>
        </div>
      </div>

      {!quiz ? (
        /* QUIZ SETUP CONFIG FORM */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Custom Quiz Setup
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  const m = WAEC_SUBJECTS.find((s) => s.name === e.target.value);
                  if (m && m.topics.length) setTopic(m.topics[0]);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {WAEC_SUBJECTS.map((s, idx) => (
                  <option key={`quiz-sub-${s.id || idx}`} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {activeSubjectObj.topics.map((t, idx) => (
                  <option key={`quiz-topic-${t}-${idx}`} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Easy">Easy (Foundation)</option>
                <option value="Medium">Medium (WASSCE Standard)</option>
                <option value="Hard">Hard (Challenging)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Number of Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={3}>3 Questions (Quick Quiz)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (In-Depth Drill)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating WAEC Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start Practice Quiz</span>
              </>
            )}
          </button>
        </div>
      ) : quizCompleted && attemptResult ? (
        /* QUIZ SCORE REPORT CARD */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Quiz Attempt Completed!</h2>
            <p className="text-xs text-slate-400 mt-1">{attemptResult.subject} • {attemptResult.topic}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-2">
            <span className="text-4xl font-black text-emerald-400">{attemptResult.percentage}%</span>
            <p className="text-xs text-slate-300 font-medium">
              You scored {attemptResult.score} out of {attemptResult.totalQuestions} questions correctly!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setQuiz(null);
                setQuizCompleted(false);
              }}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUIZ ENGINE */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-emerald-400">
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">{quiz.subject}</span>
          </div>

          {/* Current Question */}
          {quiz.questions[currentIndex] && (
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {quiz.questions[currentIndex].text}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5">
                {quiz.questions[currentIndex].options.map((opt, idx) => {
                  const letter = opt.substring(0, 1);
                  const isSelected = userAnswers[currentIndex] === letter;
                  const isCorrect = quiz.questions[currentIndex].correctAnswer === letter;
                  const isAnswered = !!userAnswers[currentIndex];

                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-200 font-bold';
                    }
                  }

                  return (
                    <button
                      key={`quiz-opt-${letter}-${idx}`}
                      onClick={() => handleSelectOption(currentIndex, letter)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {letter}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step explanation */}
              {showExplanation[currentIndex] && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Explanation</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {quiz.questions[currentIndex].explanation}
                  </p>
                </div>
              )}

              {/* Next/Finish Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 disabled:opacity-30 hover:text-white"
                >
                  Previous
                </button>

                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg"
                  >
                    Submit & View Score
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
