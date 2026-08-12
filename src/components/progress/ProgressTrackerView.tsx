import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Bot, ArrowLeft, BrainCircuit, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storage';
import { QuestionHistoryItem, QuizAttempt } from '../../types';

interface ProgressTrackerViewProps {
  onNavigate: (view: string, state?: any) => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({ onNavigate }) => {
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    setHistory(storageService.getQuestionHistory());
    setQuizAttempts(storageService.getQuizAttempts());
  }, []);

  const totalQuestions = history.length;
  const totalQuizzes = quizAttempts.length;

  const subjectStats = [
    { name: 'Mathematics', score: 85, status: 'Strong' },
    { name: 'English Language', score: 80, status: 'Strong' },
    { name: 'Biology', score: 72, status: 'Average' },
    { name: 'Chemistry', score: 54, status: 'Weak' },
    { name: 'Physics', score: 48, status: 'Weak' },
  ];

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
            <BarChart3 className="w-6 h-6 text-cyan-400" /> Student Progress & Analytics
          </h1>
          <p className="text-xs text-slate-400">Track subject mastery, exam readiness, and recent quiz scores.</p>
        </div>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Questions Solved</span>
          <p className="text-3xl font-extrabold text-white">{totalQuestions}</p>
          <span className="text-[11px] text-emerald-400">Recorded in history</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Practice Quizzes</span>
          <p className="text-3xl font-extrabold text-white">{totalQuizzes}</p>
          <span className="text-[11px] text-blue-400">Completed attempts</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">WASSCE Readiness</span>
          <p className="text-3xl font-extrabold text-emerald-400">76%</p>
          <span className="text-[11px] text-slate-400">On track for Grade B2/A1</span>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Subject Mastery Breakdown
        </h2>

        <div className="space-y-4">
          {subjectStats.map((subj, idx) => (
            <div key={`subj-stat-${subj.name}-${idx}`} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{subj.name}</span>
                <span className={`font-bold ${subj.score < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {subj.score}% ({subj.status})
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    subj.score < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${subj.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Quiz Attempts List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-purple-400" /> Recent Practice Quiz Attempts
        </h2>

        {quizAttempts.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No quiz attempts recorded yet. Generate your first practice quiz!
          </div>
        ) : (
          <div className="space-y-2">
            {quizAttempts.map((q, idx) => (
              <div key={`qa-${q.id || idx}-${idx}`} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{q.subject}</span>
                  <span className="text-[10px] text-slate-400">{q.topic}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-400 block">{q.percentage}%</span>
                  <span className="text-[10px] text-slate-500">{q.score}/{q.totalQuestions} Correct</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
