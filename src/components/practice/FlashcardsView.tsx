import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, RefreshCw, ArrowLeft, Check, RotateCw, BookOpen } from 'lucide-react';
import { WAEC_SUBJECTS } from '../../data/subjects';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storage';
import { Flashcard } from '../../types';

interface FlashcardsViewProps {
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onNavigate, showToast }) => {
  const [selectedSubject, setSelectedSubject] = useState(WAEC_SUBJECTS[0].name);
  const activeSubjObj = WAEC_SUBJECTS.find((s) => s.name === selectedSubject) || WAEC_SUBJECTS[0];
  const [selectedTopic, setSelectedTopic] = useState(activeSubjObj.topics[0]);

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Load existing saved flashcards
    const saved = storageService.getSavedFlashcards();
    if (saved.length > 0) {
      setCards(saved);
    }
  }, []);

  const handleGenerateCards = async () => {
    setLoading(true);
    try {
      const generated = await aiService.generateFlashcards(selectedSubject, selectedTopic);
      setCards(generated);
      storageService.saveFlashcards(generated);
      setCurrentIndex(0);
      setIsFlipped(false);
      showToast(`Generated ${generated.length} flashcards!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not generate flashcards.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (status: 'know' | 'review') => {
    if (!cards[currentIndex]) return;
    const updated = storageService.updateCardStatus(cards[currentIndex].id, status);
    setCards(updated);
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
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
            <Layers className="w-6 h-6 text-teal-400" /> Interactive Flashcards Deck
          </h1>
          <p className="text-xs text-slate-400">Master definitions, formulas, and terminology with active recall flashcards.</p>
        </div>
      </div>

      {/* Generator bar */}
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
                <option key={`fc-sub-${s.id || idx}`} value={s.name}>{s.name}</option>
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
                <option key={`fc-topic-${t}-${idx}`} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateCards}
          disabled={loading}
          className="w-full py-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate AI Flashcard Deck</span>
        </button>
      </div>

      {/* FLASHCARD INTERACTIVE DISPLAY */}
      {cards.length > 0 && cards[currentIndex] && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="text-teal-400">{cards[currentIndex].subject} • {cards[currentIndex].topic}</span>
          </div>

          {/* FLIP CARD */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-8 sm:p-12 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-teal-500/50 cursor-pointer min-h-[260px] flex flex-col justify-between items-center text-center transition-all shadow-2xl relative group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-teal-400 transition-colors">
              {isFlipped ? 'ANSWER & EXPLANATION' : 'QUESTION / PROMPT (TAP TO FLIP)'}
            </span>

            <div className="my-auto space-y-3 max-w-lg">
              {!isFlipped ? (
                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">{cards[currentIndex].question}</h2>
              ) : (
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-bold text-emerald-400 leading-relaxed">{cards[currentIndex].answer}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{cards[currentIndex].explanation}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap card to reveal answer</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleStatusUpdate('review')}
              className="px-6 py-3 text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 rounded-xl transition-all shadow-md"
            >
              Need to Review
            </button>
            <button
              onClick={() => handleStatusUpdate('know')}
              className="px-6 py-3 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>I Know This!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
