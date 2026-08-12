import React, { useState } from 'react';
import { User, Globe, School, BookOpen, Wifi, WifiOff, LogOut, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLowData } from '../../hooks/useLowData';
import { WEST_AFRICAN_COUNTRIES, SCHOOL_CLASSES, WAEC_SUBJECTS } from '../../data/subjects';
import { storageService } from '../../services/storage';

interface ProfileSettingsViewProps {
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ onNavigate, showToast }) => {
  const { user, logout, updateUserSubjects } = useAuth();
  const { lowDataMode, toggleLowDataMode } = useLowData();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    user?.subjects || ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology']
  );

  const handleSubjectToggle = (subjName: string) => {
    let updated: string[];
    if (selectedSubjects.includes(subjName)) {
      if (selectedSubjects.length <= 1) return;
      updated = selectedSubjects.filter((s) => s !== subjName);
    } else {
      updated = [...selectedSubjects, subjName];
    }
    setSelectedSubjects(updated);
    updateUserSubjects(updated);
    showToast('Saved subject preferences!', 'success');
  };

  const handleExportData = () => {
    const history = storageService.getQuestionHistory();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `WAEC_Tutor_History_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported your question history!', 'success');
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
            <User className="w-6 h-6 text-emerald-400" /> Account & Study Settings
          </h1>
          <p className="text-xs text-slate-400">Manage your profile, registered WAEC subjects, and data saver preferences.</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Student Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">Full Name</span>
            <span className="font-bold text-white text-sm">{user?.fullName || 'Student'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">Email Address</span>
            <span className="font-bold text-white text-sm">{user?.email || 'student@school.edu'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">Country & Region</span>
            <span className="font-bold text-white text-sm">{user?.country || 'The Gambia'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">School & Class</span>
            <span className="font-bold text-white text-sm">{user?.school || 'Secondary School'} • {user?.classGrade || 'SSS 3'}</span>
          </div>
        </div>
      </div>

      {/* Low Data Mode Toggle Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            {lowDataMode ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            Low-Data Saver Mode
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Compresses images, minimizes payload transfers, and optimizes layout speed for 3G/4G mobile networks.
          </p>
        </div>

        <button
          onClick={toggleLowDataMode}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
            lowDataMode
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          {lowDataMode ? 'Low Data Enabled' : 'Enable Low Data'}
        </button>
      </div>

      {/* Selected WAEC Subjects Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" /> My WAEC Subjects ({selectedSubjects.length})
          </h3>
          <span className="text-xs text-slate-400">Tap subject to toggle</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {WAEC_SUBJECTS.map((sub, idx) => {
            const isSelected = selectedSubjects.includes(sub.name);
            return (
              <button
                key={`profile-sub-${sub.id || idx}-${idx}`}
                onClick={() => handleSubjectToggle(sub.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Export & Logout Actions */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleExportData}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Question History (JSON)</span>
        </button>

        <button
          onClick={() => {
            logout();
            onNavigate('home');
          }}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </div>
  );
};
