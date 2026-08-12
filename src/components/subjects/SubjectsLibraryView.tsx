import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowLeft, ArrowRight, BrainCircuit } from 'lucide-react';
import { WAEC_SUBJECTS } from '../../data/subjects';

interface SubjectsLibraryViewProps {
  onNavigate: (view: string, state?: any) => void;
}

export const SubjectsLibraryView: React.FC<SubjectsLibraryViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Core', 'Sciences', 'Arts & Social Studies', 'Commercial'];

  const filteredSubjects = selectedCategory === 'All'
    ? WAEC_SUBJECTS
    : WAEC_SUBJECTS.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            <BookOpen className="w-6 h-6 text-emerald-400" /> WAEC Syllabus & Subject Library
          </h1>
          <p className="text-xs text-slate-400">Explore 14 official WASSCE subjects, syllabus topics, and start targeted AI practice drills.</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat, idx) => (
          <button
            key={`lib-cat-${cat}-${idx}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub, sIdx) => (
          <div
            key={`lib-sub-${sub.id || sIdx}-${sIdx}`}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {sub.category}
                </span>
                <span className="text-xs text-slate-400">{sub.topics.length} Syllabus Topics</span>
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{sub.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{sub.description}</p>

              {/* Topics Pills */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Syllabus Topics</span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {sub.topics.map((t, tIdx) => (
                    <span key={`lib-topic-${sub.id}-${tIdx}`} className="px-2 py-0.5 text-[10px] rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={() => onNavigate('tutor', { initialSubject: sub.name })}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Ask Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('quiz', { subject: sub.name, topic: sub.topics[0] })}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md flex items-center gap-1"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Practice Quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
