import React, { useState, useEffect } from 'react';
import { Shield, Users, Bot, BrainCircuit, Activity, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storage';
import { AdminStats } from '../../types';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    setStats(storageService.getAdminStats());
  }, []);

  if (!stats) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            <Shield className="w-6 h-6 text-amber-400" /> Platform Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400">System health telemetry, user activity metrics, and AI API usage metrics.</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
            Total Registered Users <Users className="w-4 h-4 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-white">{stats.totalUsers.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400">{stats.activeStudents} active students • {stats.teachers} teachers</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
            Questions Solved <Bot className="w-4 h-4 text-blue-400" />
          </span>
          <p className="text-2xl font-black text-white">{stats.questionsAsked.toLocaleString()}</p>
          <span className="text-[10px] text-blue-400">Step-by-step AI explanations</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
            Quizzes Generated <BrainCircuit className="w-4 h-4 text-purple-400" />
          </span>
          <p className="text-2xl font-black text-white">{stats.quizzesGenerated.toLocaleString()}</p>
          <span className="text-[10px] text-purple-400">Dynamic practice drills</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
            System Status <Activity className="w-4 h-4 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Optimal
          </p>
          <span className="text-[10px] text-slate-400">0 critical runtime exceptions</span>
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Most Requested Subjects</h3>
          <div className="space-y-2">
            {stats.popularSubjects.map((s, idx) => (
              <div key={`admin-pop-sub-${s.subject}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-200">{s.subject}</span>
                <span className="font-bold text-emerald-400">{s.count} requests</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Popular Syllabus Topics</h3>
          <div className="space-y-2">
            {stats.popularTopics.map((t, idx) => (
              <div key={`admin-pop-top-${t.topic}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-200">{t.topic}</span>
                <span className="font-bold text-blue-400">{t.count} drills</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
