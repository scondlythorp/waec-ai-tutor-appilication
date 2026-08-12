import React, { useState, useEffect } from 'react';
import { Bot, Camera, Mic, BrainCircuit, Award, Calendar, BookOpen, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Clock, Flame, CheckCircle2, Upload, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storageService } from '../../services/storage';
import { QuestionHistoryItem, QuizAttempt } from '../../types';

interface StudentDashboardProps {
  onNavigate: (view: string, extraState?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    setHistory(storageService.getQuestionHistory());
    setQuizAttempts(storageService.getQuizAttempts());
  }, []);

  // Performance calculations
  const totalQuestionsSolved = history.length;
  const totalQuizzesTaken = quizAttempts.length;
  const avgQuizScore = totalQuizzesTaken > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzesTaken)
    : 78;

  const weakSubjects = ['Chemistry', 'Physics'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* QUICK LAUNCH BENTO ROW 1: WELCOME BANNER + AI SCAN ASSISTANT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Welcome Hero Bento Card (Col 8) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-white shadow-lg shadow-blue-100 min-h-[260px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>WASSCE Candidate Portal • {user?.classGrade || 'SSS 3'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Student'} 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              You've completed 85% of your weekly study goal. Solve 3 more Chemistry questions to hit your WASSCE target!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blue-500/30 mt-4 relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-blue-200 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300" /> Study Streak
              </span>
              <span className="text-xl sm:text-2xl font-bold">12 Days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-blue-200 uppercase tracking-wider font-semibold">Cohort Rank</span>
              <span className="text-xl sm:text-2xl font-bold">Top 5%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-blue-200 uppercase tracking-wider font-semibold">Predicted Grade</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-300">A1 (Est.)</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Scan Card (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">AI Photo Scanner</h3>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Online
            </span>
          </div>

          <div
            onClick={() => onNavigate('scan')}
            className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl flex-1 my-2 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 text-blue-600 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">Scan your question</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Drop an image here or snap a photo</p>
          </div>

          <button
            onClick={() => onNavigate('tutor')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Open AI Tutor</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS BENTO ROW */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" /> Quick AI Study Launchpad
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('tutor')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-left transition-all group flex flex-col justify-between h-28 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600">Ask AI</span>
              <span className="text-[10px] text-slate-500">Solve text question</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-left transition-all group flex flex-col justify-between h-28 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600">Scan Photo</span>
              <span className="text-[10px] text-slate-500">Camera OCR OCR</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('voice')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 text-left transition-all group flex flex-col justify-between h-28 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-amber-600">Voice Tutor</span>
              <span className="text-[10px] text-slate-500">Speak & audio AI</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-400 text-left transition-all group flex flex-col justify-between h-28 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-purple-600">Practice Quiz</span>
              <span className="text-[10px] text-slate-500">Topic drills</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('mock-exam')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-rose-400 text-left transition-all group flex flex-col justify-between h-28 shadow-sm col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-rose-600">Mock Exam</span>
              <span className="text-[10px] text-slate-500">Full exam simulation</span>
            </div>
          </button>
        </div>
      </section>

      {/* BENTO GRID MAIN CONTENT: 3 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subjects Library Bento Card (Col 3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Subjects Library
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-bold text-sm">
                  M
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold text-slate-800">Mathematics</span>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('subjects')}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  P
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Physics</span>
                  <span className="text-[10px] text-slate-500">42 Topics • 65% Clear</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('subjects')}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                  C
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Chemistry</span>
                  <span className="text-[10px] text-slate-500">38 Topics • 22% Clear</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('subjects')}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="w-10 h-10 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                  E
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">English Lang</span>
                  <span className="text-[10px] text-slate-500">15 Topics • 89% Clear</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('subjects')}
            className="w-full text-center text-xs font-bold text-blue-600 hover:underline py-2"
          >
            View All 14 Subjects →
          </button>
        </div>

        {/* Performance Insight Bento Card (Col 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Performance Insight
              </h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Last 30 Days
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg. Score</span>
                <div className="text-2xl font-black text-slate-800 mt-1">{avgQuizScore}%</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ 12% from last week</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quizzes Done</span>
                <div className="text-2xl font-black text-slate-800 mt-1">{totalQuizzesTaken || 24}</div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">Total completed drills</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Weak Areas (Priority Attention)</span>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Logarithms & Indices (Maths)</span>
                  <span className="font-bold text-rose-500">38%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[38%] h-full bg-rose-400 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600 font-medium">Chemical Equilibrium (Chem)</span>
                  <span className="font-bold text-amber-500">52%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[52%] h-full bg-amber-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600 font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">New Mock Exam Ready</span>
                <span className="text-[10px] text-slate-500">Targeted to your weak syllabus topics</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('mock-exam')}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm shrink-0"
            >
              Start Exam
            </button>
          </div>
        </div>

        {/* Study Plan Bento Timeline Card (Col 3) */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl p-6 flex flex-col justify-between text-white shadow-lg space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" /> Today's Study Plan
              </h3>
              <button
                onClick={() => onNavigate('study-plan')}
                className="text-[10px] text-blue-400 hover:underline font-semibold"
              >
                Planner
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div className="w-0.5 h-10 bg-slate-700"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Trigonometry & Surds</span>
                  <span className="text-[10px] text-slate-400">09:00 - 10:30 AM</span>
                  <div className="mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold w-fit uppercase">
                    Completed
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                  <div className="w-0.5 h-10 bg-slate-700"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Organic Chemistry</span>
                  <span className="text-[10px] text-slate-400">11:00 - 12:30 PM</span>
                  <div className="mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold w-fit uppercase">
                    In Progress
                  </div>
                </div>
              </div>

              <div className="flex gap-3 opacity-50">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 border border-slate-500 rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">English Essay Summary</span>
                  <span className="text-[10px] text-slate-400">02:00 - 03:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 pt-2 border-t border-slate-800">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">67% of today's plan finished</span>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY BENTO CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> Recent Question History
          </h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View Full History →
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No recent question history yet. Ask a question to start building your record!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {history.slice(0, 4).map((item, idx) => (
              <div
                key={`dashboard-hist-${item.id || idx}-${idx}`}
                onClick={() => onNavigate('tutor', { questionItem: item })}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="space-y-1 truncate max-w-sm">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">{item.questionText}</p>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 inline-block">
                    {item.subject} • {item.topic}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
