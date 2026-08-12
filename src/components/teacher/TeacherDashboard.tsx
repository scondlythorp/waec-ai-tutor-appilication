import React, { useState, useEffect } from 'react';
import { Users, Plus, Share2, Award, BookOpen, Sparkles, CheckCircle2, ArrowLeft, Copy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storageService } from '../../services/storage';
import { Classroom } from '../../types';

interface TeacherDashboardProps {
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate, showToast }) => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // New classroom modal states
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('SSS 3 (WASSCE)');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loaded = storageService.getClassrooms();
    if (loaded.length === 0) {
      // Bootstrap default sample classroom for demo
      const sampleClass: Classroom = {
        id: 'cls-001',
        name: 'SSS 3 WASSCE Mathematics Prep Group',
        subject: 'Mathematics',
        grade: 'SSS 3',
        code: 'WAEC-MATH-992',
        classCode: 'WAEC-MATH-992',
        teacherId: user?.uid || 'teacher-01',
        teacherName: user?.fullName || 'Teacher',
        studentCount: 38,
        createdAt: new Date().toISOString(),
      };
      storageService.addClassroom(sampleClass);
      setClassrooms([sampleClass]);
    } else {
      setClassrooms(loaded);
    }
  }, []);

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const codeStr = `WAEC-${subject.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newClass: Classroom = {
      id: 'cls-' + Date.now(),
      name,
      subject,
      grade,
      code: codeStr,
      classCode: codeStr,
      teacherId: user?.uid || 'teacher-01',
      teacherName: user?.fullName || 'Teacher',
      studentCount: 1,
      createdAt: new Date().toISOString(),
    };

    const updated = storageService.addClassroom(newClass);
    setClassrooms(updated);
    setShowCreateModal(false);
    setName('');
    showToast('Classroom created! Share the class code with your students.', 'success');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied Class Code: ${code}`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-400" /> Teacher & Educator Portal
            </h1>
            <p className="text-xs text-slate-400">Create virtual classrooms, generate assignments, and monitor student progress trends.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Classroom</span>
        </button>
      </div>

      {/* Classroom list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classrooms.map((cls, idx) => (
          <div key={`cls-${cls.id || idx}-${idx}`} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider block">{cls.subject} • {cls.grade}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{cls.name}</h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold text-white bg-slate-800 rounded-xl">
                {cls.studentCount} Students
              </span>
            </div>

            {/* Class Code Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class Join Code</span>
                <span className="text-base font-black text-emerald-400 tracking-widest font-mono">{cls.classCode}</span>
              </div>
              <button
                onClick={() => handleCopyCode(cls.classCode)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copy Code</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onNavigate('quiz', { subject: cls.subject })}
                className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Class Assignment</span>
              </button>
              <span className="text-xs text-slate-500">Active WASSCE Cohort</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white">Create Virtual Classroom</h2>
            <form onSubmit={handleCreateClassroom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Classroom Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SSS 3 WASSCE Chemistry Group"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Language">English Language</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
