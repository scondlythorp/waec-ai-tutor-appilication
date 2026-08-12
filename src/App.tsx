import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LowDataProvider } from './hooks/useLowData';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { Toast, ToastType } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';

import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AiTutorView } from './components/tutor/AiTutorView';
import { QuestionScannerView } from './components/tutor/QuestionScannerView';
import { VoiceTutorView } from './components/tutor/VoiceTutorView';
import { QuizGeneratorView } from './components/practice/QuizGeneratorView';
import { MockExamView } from './components/practice/MockExamView';
import { FlashcardsView } from './components/practice/FlashcardsView';
import { RevisionNotesView } from './components/practice/RevisionNotesView';
import { StudyPlanView } from './components/study/StudyPlanView';
import { ProgressTrackerView } from './components/progress/ProgressTrackerView';
import { SubjectsLibraryView } from './components/subjects/SubjectsLibraryView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewState, setViewState] = useState<any>(null);

  // Auth modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (view: string, state?: any) => {
    setCurrentView(view);
    setViewState(state || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Render View Switcher
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard onNavigate={handleNavigate} />;
      case 'tutor':
        return (
          <AiTutorView
            initialQuestionItem={viewState?.initialQuestionItem || viewState?.questionItem || null}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        );
      case 'scan':
        return <QuestionScannerView onNavigate={handleNavigate} showToast={showToast} />;
      case 'voice':
        return <VoiceTutorView onNavigate={handleNavigate} showToast={showToast} />;
      case 'quiz':
        return (
          <QuizGeneratorView
            initialSubject={viewState?.subject}
            initialTopic={viewState?.topic}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        );
      case 'mock-exam':
        return <MockExamView onNavigate={handleNavigate} showToast={showToast} />;
      case 'flashcards':
        return <FlashcardsView onNavigate={handleNavigate} showToast={showToast} />;
      case 'notes':
        return <RevisionNotesView onNavigate={handleNavigate} showToast={showToast} />;
      case 'study-plan':
        return <StudyPlanView onNavigate={handleNavigate} showToast={showToast} />;
      case 'progress':
      case 'history':
        return <ProgressTrackerView onNavigate={handleNavigate} />;
      case 'subjects':
        return <SubjectsLibraryView onNavigate={handleNavigate} />;
      case 'teacher':
        return <TeacherDashboard onNavigate={handleNavigate} showToast={showToast} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'profile':
      case 'settings':
        return <ProfileSettingsView onNavigate={handleNavigate} showToast={showToast} />;
      case 'home':
      default:
        return <LandingPage onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications */}
      {toasts.map((t, idx) => (
        <Toast key={`${t.id}-${idx}`} id={t.id} message={t.message} type={t.type} onClose={handleRemoveToast} />
      ))}

      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        <ErrorBoundary>{renderView()}</ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Touch Bottom Nav */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          showToast('Successfully authenticated!', 'success');
          handleNavigate('dashboard');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <LowDataProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LowDataProvider>
  );
}
