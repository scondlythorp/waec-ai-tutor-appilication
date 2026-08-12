import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Clock, CheckCircle2, RefreshCw, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WAEC_SUBJECTS } from '../../data/subjects';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storage';
import { StudyPlan, StudyPlanLesson } from '../../types';

interface StudyPlanViewProps {
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ onNavigate, showToast }) => {
  const { user } = useAuth();
  const [examDate, setExamDate] = useState('2026-05-15');
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Chemistry', 'Physics']);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    const saved = storageService.getStudyPlan();
    if (saved) {
      setPlan(saved);
    }
  }, []);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const lessons = await aiService.generateStudyPlan({
        examDate,
        subjects: user?.subjects || ['Mathematics', 'English Language', 'Chemistry', 'Physics', 'Biology'],
        dailyStudyMinutes: dailyMinutes,
        weakSubjects,
        strongSubjects: ['Mathematics', 'English Language'],
      });

      const newPlan: StudyPlan = {
        id: 'plan-' + Date.now(),
        userId: user?.uid || 'guest',
        examDate,
        dailyStudyMinutes: dailyMinutes,
        weakSubjects,
        weeklyPlan: lessons,
        createdAt: new Date().toISOString(),
      };

      storageService.saveStudyPlan(newPlan);
      setPlan(newPlan);
      showToast('New AI Study Plan generated and scheduled!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate study plan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLessonStatus = (lessonId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const updatedPlan = storageService.updateLessonStatus(lessonId, nextStatus);
    if (updatedPlan) {
      setPlan(updatedPlan);
      showToast(nextStatus === 'completed' ? 'Lesson marked complete! Great progress 🎉' : 'Lesson reset to pending.', 'info');
    }
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
            <Calendar className="w-6 h-6 text-emerald-400" /> Personalized AI Study Planner
          </h1>
          <p className="text-xs text-slate-400">Custom timetable calculated around your examination date, available daily time, and weak topics.</p>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Schedule Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Exam Start Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Daily Study Budget</label>
            <select
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value={30}>30 Minutes / Day</option>
              <option value={60}>1 Hour / Day</option>
              <option value={90}>1.5 Hours / Day</option>
              <option value={120}>2 Hours / Day</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Focus Weak Subject</label>
            <select
              value={weakSubjects[0]}
              onChange={(e) => setWeakSubjects([e.target.value])}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {WAEC_SUBJECTS.map((s, idx) => (
                <option key={`sp-sub-${s.id || idx}`} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate Timetable & Lessons</span>
        </button>
      </div>

      {/* PLAN DISPLAY */}
      {plan && plan.weeklyPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base font-bold text-white">Your Weekly Study Timetable</h3>
            <span className="text-xs text-emerald-400 font-semibold">{plan.dailyStudyMinutes} mins/day study plan</span>
          </div>

          <div className="space-y-3">
            {plan.weeklyPlan.map((lesson, idx) => {
              const isCompleted = lesson.status === 'completed';
              return (
                <div
                  key={`sp-lesson-${lesson.id || idx}-${idx}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-800/40 opacity-80'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-800 text-slate-300">
                        Day {lesson.dayNumber}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-300">
                        {lesson.subject}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{lesson.topic}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{lesson.tasks}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lesson.estimatedMinutes} mins</span>
                    </span>

                    <button
                      onClick={() => handleToggleLessonStatus(lesson.id, lesson.status)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
