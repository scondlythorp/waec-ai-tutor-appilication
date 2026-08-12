import React, { useState, useEffect } from 'react';
import { Award, Clock, Flag, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, BarChart3, HelpCircle } from 'lucide-react';
import { WAEC_SUBJECTS } from '../../data/subjects';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storage';
import { Quiz, QuizAttempt } from '../../types';

interface MockExamViewProps {
  onNavigate: (view: string, state?: any) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({ onNavigate, showToast }) => {
  const [selectedSubject, setSelectedSubject] = useState(WAEC_SUBJECTS[0].name);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(30 * 60); // 30 mins
  const [timerInterval, setTimerInterval] = useState<any>(null);

  useEffect(() => {
    if (examStarted && !examCompleted && timeLeftSeconds > 0) {
      const interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [examStarted, examCompleted]);

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const generated = await aiService.generateQuiz({
        subject: selectedSubject,
        topic: 'Full Syllabus Mock',
        difficulty: 'Medium',
        questionCount: 10,
        questionType: 'multiple_choice',
      });

      setQuizData(generated);
      setExamStarted(true);
      setExamCompleted(false);
      setCurrentIndex(0);
      setUserAnswers({});
      setFlagged({});
      setTimeLeftSeconds(25 * 60); // 25 mins
      showToast('WASSCE Mock Exam Started! Timer ticking...', 'info');
    } catch (err: any) {
      showToast(err.message || 'Could not launch mock exam session.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFlag = (idx: number) => {
    setFlagged((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFinishExam = () => {
    if (timerInterval) clearInterval(timerInterval);
    setExamCompleted(true);

    if (quizData) {
      let correct = 0;
      quizData.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correctAnswer) correct++;
      });
      const pct = Math.round((correct / quizData.questions.length) * 100);

      storageService.saveQuizAttempt({
        id: 'mock-' + Date.now(),
        quizId: quizData.id,
        subject: quizData.subject,
        topic: 'Full Syllabus Mock',
        score: correct,
        totalQuestions: quizData.questions.length,
        percentage: pct,
        timeSpentSeconds: 25 * 60 - timeLeftSeconds,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            <Award className="w-6 h-6 text-rose-400" /> WASSCE Mock Exam Simulator
          </h1>
          <p className="text-xs text-slate-400">Simulate official WAEC exam room conditions with countdown timer & flag controls.</p>
        </div>
      </div>

      {!examStarted ? (
        /* SETUP START SCREEN */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-center max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Select Mock Subject</h2>
            <p className="text-xs text-slate-400 mt-1">Choose a core or elective subject for your timed 25-minute practice session.</p>
          </div>

          <div className="text-left space-y-2">
            <label className="block text-xs font-medium text-slate-300">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              {WAEC_SUBJECTS.map((s, idx) => (
                <option key={`mock-sub-${s.id || idx}`} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-rose-400 block uppercase tracking-wider text-[10px]">Mock Examination Rules</span>
            <p>• 10 Official-style multiple choice questions.</p>
            <p>• 25 minutes timer. Automatic submission when time expires.</p>
            <p>• You can flag questions and review your answers before submitting.</p>
          </div>

          <button
            onClick={handleStartExam}
            disabled={loading}
            className="w-full py-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Preparing Exam Paper...</span>
              </>
            ) : (
              <span>Begin Official Mock Exam</span>
            )}
          </button>
        </div>
      ) : examCompleted && quizData ? (
        /* FINAL SCORE REPORT */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
          <h2 className="text-2xl font-extrabold text-white">Official Score Report Card</h2>
          <p className="text-xs text-slate-400">{quizData.subject} Mock Examination</p>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-4xl font-black text-rose-400">
              {Math.round(
                (quizData.questions.filter((q, i) => userAnswers[i] === q.correctAnswer).length /
                  quizData.questions.length) *
                  100
              )}
              %
            </span>
            <p className="text-xs text-slate-300 font-semibold">
              Correct: {quizData.questions.filter((q, i) => userAnswers[i] === q.correctAnswer).length} / {quizData.questions.length}
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
          >
            Return to Student Portal
          </button>
        </div>
      ) : quizData ? (
        /* ACTIVE TIMED MOCK SIMULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel */}
          <div className="lg:col-span-3 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300">Question {currentIndex + 1} of {quizData.questions.length}</span>
              <button
                onClick={() => handleToggleFlag(currentIndex)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  flagged[currentIndex]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {quizData.questions[currentIndex].text}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {quizData.questions[currentIndex].options.map((opt, idx) => {
                const letter = opt.substring(0, 1);
                const isSelected = userAnswers[currentIndex] === letter;
                return (
                  <button
                    key={`mock-opt-${letter}-${idx}`}
                    onClick={() => setUserAnswers({ ...userAnswers, [currentIndex]: letter })}
                    className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-rose-950/80 border-rose-600 text-rose-100 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {letter}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-400 disabled:opacity-30 hover:text-white"
              >
                Previous
              </button>

              {currentIndex < quizData.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinishExam}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
                >
                  Submit Final Paper
                </button>
              )}
            </div>
          </div>

          {/* Right Question Palette & Timer */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 h-fit">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" /> Time Remaining
              </span>
              <span className="text-2xl font-black text-rose-400 block font-mono">{formatTime(timeLeftSeconds)}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Question Palette</span>
              <div className="grid grid-cols-5 gap-2">
                {quizData.questions.map((_, i) => {
                  const isAnswered = !!userAnswers[i];
                  const isFlagged = !!flagged[i];
                  const isCurrent = currentIndex === i;

                  return (
                    <button
                      key={`mock-palette-${i}`}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-9 rounded-xl font-bold text-xs border transition-all flex items-center justify-center relative ${
                        isCurrent
                          ? 'border-white text-white ring-2 ring-emerald-500/50'
                          : isAnswered
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{i + 1}</span>
                      {isFlagged && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleFinishExam}
              className="w-full py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md"
            >
              End Exam & Grade
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
