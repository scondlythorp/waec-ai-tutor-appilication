import React, { useState } from 'react';
import { Bot, Camera, Mic, BrainCircuit, Award, BarChart3, ChevronDown, Sparkles, CheckCircle2, BookOpen, ShieldCheck, ArrowRight, Zap, Globe, Users } from 'lucide-react';
import { WAEC_SUBJECTS, WEST_AFRICAN_COUNTRIES } from '../../data/subjects';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const features = [
    {
      id: 'tutor',
      icon: Bot,
      title: 'AI Question Solver',
      description: 'Step-by-step breakdown of difficult WASSCE questions with formulas, exam tips, and common mistakes.',
      badge: 'Step-by-Step',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'scan',
      icon: Camera,
      title: 'Question Scanner',
      description: 'Upload a picture of any handwritten or printed past question to extract and solve it instantly.',
      badge: 'Vision AI',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'voice',
      icon: Mic,
      title: 'Voice Tutor',
      description: 'Speak your question out loud in natural English and hear interactive spoken explanations.',
      badge: 'Audio AI',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'quiz',
      icon: BrainCircuit,
      title: 'Quiz Generator',
      description: 'Generate customized practice quizzes by subject, topic, difficulty, and question type.',
      badge: 'Dynamic Practice',
      color: 'from-purple-500 to-violet-600',
    },
    {
      id: 'mock-exam',
      icon: Award,
      title: 'Mock Exams',
      description: 'Simulate full WASSCE exam conditions with official timers, question flags, and report cards.',
      badge: 'WASSCE Mode',
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'progress',
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Track your average score, study streak, weak topics, and personalized improvement roadmap.',
      badge: 'Analytics',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'UNDERSTAND',
      desc: 'Ask text, photo, or voice questions. Get crystal-clear step-by-step explanations with WASSCE exam tips.',
    },
    {
      step: '02',
      title: 'PRACTICE',
      desc: 'Generate targeted quizzes, flashcards, and mock exams specifically tailored to your syllabus.',
    },
    {
      step: '03',
      title: 'TRACK',
      desc: 'Monitor subject mastery percentages, identify weak topics, and log daily study time.',
    },
    {
      step: '04',
      title: 'IMPROVE',
      desc: 'Follow AI study plans and revision notes to turn weak areas into top exam scores.',
    },
  ];

  const faqs = [
    {
      q: 'Is WAEC AI Tutor affiliated with the official WAEC Council?',
      a: 'No. WAEC AI Tutor is an independent AI-powered educational platform designed to assist secondary school students in West Africa with exam preparation. All generated practice questions are clearly labeled as "WAEC-style practice questions".',
    },
    {
      q: 'Does it work for students across different West African countries?',
      a: 'Yes! Our syllabus covers core and elective subjects aligned with WASSCE requirements for The Gambia, Nigeria, Ghana, Sierra Leone, and Liberia.',
    },
    {
      q: 'How does the Image Question Scanner work?',
      a: 'Simply take a photo or upload an image of a question from your textbook or past paper. Our AI extracts the text, confirms accuracy with you, and generates a step-by-step working solution.',
    },
    {
      q: 'Can I use the application on a slow or low-data mobile connection?',
      a: 'Yes! Toggle "Low Data Mode" at any time. This compresses image payloads, disables unnecessary animations, and minimizes network usage for affordable studying.',
    },
    {
      q: 'Can teachers use WAEC AI Tutor?',
      a: 'Absolutely. Teachers can register for a Teacher Account to create virtual classrooms, share class codes with students, generate assignments, and monitor student progress.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered WASSCE Preparation Platform</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Understand WAEC questions.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Learn step by step.
            </span>{' '}
            Prepare with confidence.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            An AI-powered study companion that helps secondary school students master difficult questions, practice effectively, and improve exam scores.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Free Today</span>
            </button>
            <button
              onClick={() => onNavigate('tutor')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5 text-blue-600" />
              <span>Try AI Question Solver</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-200 max-w-2xl mx-auto font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>14 Core & Elective Subjects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Text, Photo & Voice AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Low-Data Compatible Mode</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Mastery Framework</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">UNDERSTAND → PRACTICE → TRACK → IMPROVE</p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Our structured 4-step framework helps students convert confusion into exam mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative group hover:border-blue-400 transition-all"
            >
              <span className="text-3xl font-black text-blue-100 group-hover:text-blue-500/30 transition-colors block mb-2">
                {s.step}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS BENTO GRID */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Comprehensive Toolkit</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">Built for West African Secondary School Success</p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Everything you need to excel in your SSS1-SSS3 coursework and WASSCE examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => onNavigate(f.id)}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-600">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{f.description}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUBJECTS SHOWCASE */}
      <section id="subjects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Covering 14 WAEC Subjects</h2>
              <p className="text-xs text-slate-500 mt-1">From Mathematics and English to Sciences, Arts, and Commercial subjects.</p>
            </div>
            <button
              onClick={() => onNavigate('subjects')}
              className="px-5 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100"
            >
              Browse Full Syllabus
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {WAEC_SUBJECTS.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onNavigate('subjects')}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-400 cursor-pointer text-center group transition-all"
              >
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-white text-blue-600 shadow-sm flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 truncate">{sub.name}</h4>
                <span className="text-[10px] text-slate-500 block truncate">{sub.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEST AFRICA REGIONAL REACH */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-blue-50/50 p-8 sm:p-10 rounded-3xl border border-blue-100">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Empowering West Africa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Built for Students Across the Region</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We understand the challenges faced by students preparing for the West African Senior School Certificate Examination: large class sizes, limited tutor access, expensive mobile data, and past question stress.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-lg font-bold text-slate-900 block">5 Countries</span>
                <span className="text-[11px] text-slate-500">Gambia, Nigeria, Ghana, Sierra Leone, Liberia</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-lg font-bold text-blue-600 block">Low Data Mode</span>
                <span className="text-[11px] text-slate-500">Optimized for 3G/4G bandwidth</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-800">Student Friendly</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Simple English explanation tone with step-by-step working so concepts stick naturally.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-800">Teacher Companion</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Teachers create class groups, generate quizzes, and monitor student weakness trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Have questions about WAEC AI Tutor? We've got answers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to pass your WAEC exams with top grades?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto font-normal">
            Join thousands of secondary school students using AI to understand questions and practice smarter every day.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 text-sm font-bold text-blue-700 bg-white hover:bg-slate-50 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
            >
              Start Free Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
