import React from 'react';
import { GraduationCap, ShieldCheck, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-base">WAEC AI Tutor</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Empowering secondary school students across West Africa to master WASSCE subjects, understand difficult questions step-by-step, and pass exams with confidence.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full w-fit font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI-Powered Study Companion</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Study Tools</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li><button onClick={() => onNavigate('tutor')} className="hover:text-blue-600 transition-colors">AI Question Solver</button></li>
            <li><button onClick={() => onNavigate('scan')} className="hover:text-blue-600 transition-colors">Image Question Scanner</button></li>
            <li><button onClick={() => onNavigate('voice')} className="hover:text-blue-600 transition-colors">Voice Tutor</button></li>
            <li><button onClick={() => onNavigate('quiz')} className="hover:text-blue-600 transition-colors">AI Quiz Generator</button></li>
            <li><button onClick={() => onNavigate('mock-exam')} className="hover:text-blue-600 transition-colors">WASSCE Mock Exam</button></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Syllabus & Notes</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li><button onClick={() => onNavigate('subjects')} className="hover:text-blue-600 transition-colors">14 WAEC Subjects</button></li>
            <li><button onClick={() => onNavigate('flashcards')} className="hover:text-blue-600 transition-colors">Flashcard Decks</button></li>
            <li><button onClick={() => onNavigate('notes')} className="hover:text-blue-600 transition-colors">Revision Notes Generator</button></li>
            <li><button onClick={() => onNavigate('study-plan')} className="hover:text-blue-600 transition-colors">Personalized Study Plan</button></li>
            <li><button onClick={() => onNavigate('progress')} className="hover:text-blue-600 transition-colors">Performance Tracker</button></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">West Africa Reach</h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Designed specifically for students in The Gambia, Nigeria, Ghana, Sierra Leone, and Liberia preparing for WASSCE & WAEC GCE.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Low-Data & Offline Compatible Mode</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} WAEC AI Tutor. All rights reserved. Not affiliated with WAEC Council.</p>
        <p className="flex items-center gap-1">
          Built for student success in West Africa <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </p>
      </div>
    </footer>
  );
};
