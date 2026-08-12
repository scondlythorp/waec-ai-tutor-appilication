import React, { useState, useEffect } from 'react';
import { Bot, Camera, Mic, Sparkles, Send, Volume2, VolumeX, Bookmark, BookmarkCheck, RefreshCw, ArrowLeft, Lightbulb, AlertTriangle, CheckCircle2, HelpCircle, BookOpen } from 'lucide-react';
import { WAEC_SUBJECTS } from '../../data/subjects';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storage';
import { AiQuestionResponse, QuestionHistoryItem } from '../../types';

interface AiTutorViewProps {
  initialQuestionItem?: QuestionHistoryItem | null;
  onNavigate: (view: string, state?: any) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({ initialQuestionItem, onNavigate, showToast }) => {
  const [selectedSubject, setSelectedSubject] = useState(WAEC_SUBJECTS[0].name);
  const [selectedTopic, setSelectedTopic] = useState(WAEC_SUBJECTS[0].topics[0]);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionText, setQuestionText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiQuestionResponse | null>(null);
  const [savedHistoryId, setSavedHistoryId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load selected subject topics dynamically
  const activeSubjectObj = WAEC_SUBJECTS.find((s) => s.name === selectedSubject) || WAEC_SUBJECTS[0];

  useEffect(() => {
    if (initialQuestionItem) {
      setQuestionText(initialQuestionItem.questionText);
      setSelectedSubject(initialQuestionItem.subject);
      setSelectedTopic(initialQuestionItem.topic);
      setResult({
        subject: initialQuestionItem.subject,
        topic: initialQuestionItem.topic,
        difficulty: initialQuestionItem.difficulty,
        questionType: 'structured',
        explanation: initialQuestionItem.response,
      });
      setSavedHistoryId(initialQuestionItem.id);
      setIsFavorite(!!initialQuestionItem.isFavorite);
    }
  }, [initialQuestionItem]);

  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    const matched = WAEC_SUBJECTS.find((s) => s.name === subj);
    if (matched && matched.topics.length > 0) {
      setSelectedTopic(matched.topics[0]);
    }
  };

  const handleSolve = async () => {
    if (!questionText.trim() && !imageBase64) {
      showToast('Please enter a question or upload an image first.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await aiService.solveQuestion({
        question: questionText,
        subject: selectedSubject,
        topic: selectedTopic,
        difficulty,
        imageBase64: imageBase64 || undefined,
      });

      setResult(res);

      // Auto-save to history
      const historyItem: QuestionHistoryItem = {
        id: 'q-' + Date.now(),
        userId: 'current-user',
        questionText: questionText || 'Image question solver',
        subject: res.subject || selectedSubject,
        topic: res.topic || selectedTopic,
        difficulty: (res.difficulty as any) || difficulty,
        response: res.explanation,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      storageService.saveQuestionHistoryItem(historyItem);
      setSavedHistoryId(historyItem.id);
      setIsFavorite(false);
      showToast('Explanation generated successfully!', 'success');
    } catch (err: any) {
      console.error('Solve error:', err);
      showToast(err.message || 'Could not process question. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        showToast('Image attached. Click "Solve Question" now.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFavorite = () => {
    if (!savedHistoryId) return;
    const updated = storageService.toggleFavoriteQuestion(savedHistoryId);
    const current = updated.find((q) => q.id === savedHistoryId);
    if (current) {
      setIsFavorite(!!current.isFavorite);
      showToast(current.isFavorite ? 'Saved to Favorites!' : 'Removed from Favorites.', 'info');
    }
  };

  const handleSpeakText = () => {
    if (!result) return;
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Subject: ${result.subject}. Topic: ${result.topic}. Question requirement: ${result.explanation.asking}. Final answer is: ${result.explanation.finalAnswer}. Explanation: ${result.explanation.explanation}. Exam tip: ${result.explanation.examTip}`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-speech is not supported on this browser.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" /> AI Question Solver
            </h1>
            <p className="text-xs text-slate-400">Ask any WAEC question in simple English for a step-by-step teacher explanation.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('scan')}
            className="px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera Scanner</span>
          </button>
          <button
            onClick={() => onNavigate('voice')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Tutor</span>
          </button>
        </div>
      </div>

      {/* INPUT CONTROLS CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        {/* Selectors row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {WAEC_SUBJECTS.map((s, idx) => (
                <option key={`tutor-sub-${s.id || idx}`} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Syllabus Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {activeSubjectObj.topics.map((t, idx) => (
                <option key={`tutor-topic-${t}-${idx}`} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Easy">Easy (Foundation)</option>
              <option value="Medium">Medium (WASSCE Standard)</option>
              <option value="Hard">Hard (Advanced / Challenge)</option>
            </select>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Enter Question Text</label>
          <textarea
            rows={4}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here (e.g. 'Solve 3x^2 + 5x - 2 = 0' or 'Explain the process of photosynthesis')..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
          />
        </div>

        {/* Image Attachment Preview */}
        {imageBase64 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <img src={imageBase64} alt="Attached question" className="w-12 h-12 object-cover rounded-lg border border-slate-700" />
              <span className="text-slate-300 font-medium">Image Question Attached</span>
            </div>
            <button
              onClick={() => setImageBase64(null)}
              className="text-xs text-rose-400 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <label className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Attach Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <button
            onClick={handleSolve}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-950 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Explanation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Solve Question</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULT EXPLANATION CARD */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl animate-in fade-in">
          {/* Header Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {result.subject}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-slate-800 text-slate-300">
                  {result.topic}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">WAEC-Style Practice Solution</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakText}
                className={`p-2 rounded-xl border transition-colors ${
                  isSpeaking
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title="Listen to Explanation (Audio Speech)"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title="Save to Favorites"
              >
                {isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 1. What the question asks */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> What the Question is Asking
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">{result.explanation.asking}</p>
          </div>

          {/* 2. Important Info / Key Concepts */}
          {result.explanation.importantInfo && result.explanation.importantInfo.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Key Rules & Formulas
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.explanation.importantInfo.map((info, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Step-by-Step Working */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Step-by-Step Working
            </h3>
            <div className="space-y-2">
              {result.explanation.stepByStep.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Final Answer Box */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Final Answer</span>
            <p className="text-base font-extrabold text-white">{result.explanation.finalAnswer}</p>
          </div>

          {/* 5. Detailed Explanation */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Detailed Explanation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{result.explanation.explanation}</p>
          </div>

          {/* 6 & 7. Exam Tip & Common Mistake Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-1">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> WASSCE Exam Tip
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">{result.explanation.examTip}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-1">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Common Student Mistake
              </h4>
              <p className="text-xs text-rose-200/90 leading-relaxed">{result.explanation.commonMistake}</p>
            </div>
          </div>

          {/* Practice Similar Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate('quiz', { subject: result.subject, topic: result.topic })}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Practice Similar Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
