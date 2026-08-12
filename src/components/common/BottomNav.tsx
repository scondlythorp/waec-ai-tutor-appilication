import React from 'react';
import { Home, Bot, BrainCircuit, BarChart3, User, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  action?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user } = useAuth();

  const userNavItems: NavItem[] = [
    {
      id: user?.role === 'admin' ? 'admin' : user?.role === 'teacher' ? 'teacher' : 'dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'tutor',
      label: 'AI Tutor',
      icon: Bot,
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: BrainCircuit,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  const guestNavItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'features',
      label: 'Features',
      icon: Sparkles,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookOpen,
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: HelpCircle,
    },
    {
      id: 'login',
      label: 'Sign In',
      icon: User,
      action: () => onOpenAuth?.('login'),
    },
  ];

  const navItems = user ? userNavItems : guestNavItems;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 pb-safe flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        const handleClick = () => {
          if (item.action) {
            item.action();
          } else {
            onNavigate(item.id);
          }
        };

        return (
          <button
            key={`bottom-${item.id}`}
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2.5 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'text-blue-600 font-bold bg-blue-50/90 scale-105 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 active:scale-95'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
            <span className={`text-[11px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-blue-600' : 'font-medium text-slate-600'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

