import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, ArrowLeft, Bookmark, Lightbulb, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { WAEC_SUBJECTS } from '../../data/subjects';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storage';
import { RevisionNote } from '../../types';

interface RevisionNotesViewProps {
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const RevisionNotesView: React.FC<RevisionNotesViewProps> = ({ onNavigate, showToast }) => {
  const [selectedSubject, setSelectedSubject] = useState(WAEC_SUBJECTS[0].name);
  const activeSubjObj = WAEC_SUBJECTS.find((s) => s.name === selectedSubject) || WAEC_SUBJECTS[0];
  const [selectedTopic, setSelectedTopic] = useState(activeSubjObj.topics[0]);

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<RevisionNote | null>(null);

  const handleGenerateNotes = async () => {
    setLoading(true);
    setNote(null);
    try {
      const generated = await aiService.generateRevisionNotes(selectedSubject, selectedTopic);
      setNote(generated);
      storageService.saveNote(generated);
      showToast('Revision note summary generated and saved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate revision note.', 'error');
    } finally {
      setLoading(false);
    }
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
            <BookOpen className="w-6 h-6 text-indigo-400" /> AI Revision Notes Generator
          </h1>
          <p className="text-xs text-slate-400">Generate structured syllabus summaries, definitions, formulas, and WASSCE exam tips.</p>
        </div>
      </div>

      {/* Selector Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                const m = WAEC_SUBJECTS.find((s) => s.name === e.target.value);
                if (m && m.topics.length) setSelectedTopic(m.topics[0]);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {WAEC_SUBJECTS.map((s, idx) => (
                <option key={`rn-sub-${s.id || idx}`} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {activeSubjObj.topics.map((t, idx) => (
                <option key={`rn-topic-${t}-${idx}`} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateNotes}
          disabled={loading}
          className="w-full py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate Revision Notes</span>
        </button>
      </div>

      {/* GENERATED REVISION NOTE CARD */}
      {note && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">{note.subject}</span>
              <h2 className="text-xl font-extrabold text-white">{note.topic} - Core Revision Summary</h2>
            </div>
            <button
              onClick={() => showToast('Revision note saved to offline notes library!', 'success')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 hover:bg-slate-800"
              title="Saved to Library"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Definition */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Core Definition</span>
            <p className="text-xs text-white font-medium leading-relaxed">{note.definition}</p>
          </div>

          {/* Key Concepts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Concepts to Remember</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {note.keyConcepts.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas if available */}
          {note.formulas && note.formulas.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Important Formulas / Equations</h3>
              <ul className="space-y-1 text-xs text-emerald-200 font-mono">
                {note.formulas.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Exam Tips & Common Mistakes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-1">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> WASSCE Exam Tip
              </h4>
              <ul className="space-y-1 text-xs text-amber-200/90">
                {note.examTips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-1">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Common Student Pitfalls
              </h4>
              <ul className="space-y-1 text-xs text-rose-200/90">
                {note.commonMistakes.map((m, idx) => (
                  <li key={idx}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Summary</span>
            <p className="text-xs text-slate-300 leading-relaxed">{note.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};
