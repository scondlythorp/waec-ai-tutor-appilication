import React, { useState } from 'react';
import { GraduationCap, Wifi, WifiOff, User, LogOut, LayoutDashboard, Settings, BookOpen, Sparkles, Menu, X, Shield, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLowData } from '../../hooks/useLowData';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { lowDataMode, toggleLowDataMode } = useLowData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const guestNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'faq', label: 'FAQ' },
  ];

  const userNavLinks = [
    { id: user?.role === 'admin' ? 'admin' : user?.role === 'teacher' ? 'teacher' : 'dashboard', label: 'Dashboard' },
    { id: 'tutor', label: 'AI Tutor' },
    { id: 'practice', label: 'Practice' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'study-plan', label: 'Study Plan' },
  ];

  const navLinks = user ? userNavLinks : guestNavLinks;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate(user ? 'dashboard' : 'home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-bold text-lg tracking-tight text-slate-800 leading-tight block">
              WAEC AI Tutor
            </span>
            <span className="block text-[10px] text-blue-600 font-bold tracking-wider uppercase">
              Beta v2.0.4 • WASSCE
            </span>
          </div>
        </button>

        {/* Desktop & Tablet Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1.5 lg:gap-4 text-xs lg:text-sm font-semibold text-slate-600"
        >
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={`desktop-${link.id}`}
                onClick={() => onNavigate(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`transition-all duration-150 px-3 py-2 min-h-[44px] flex items-center rounded-xl ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 font-bold'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Low Data Mode Toggle */}
          <button
            onClick={toggleLowDataMode}
            aria-pressed={lowDataMode}
            aria-label={`Low Data Mode ${lowDataMode ? 'Active' : 'Inactive'}`}
            title={lowDataMode ? 'Low Data Mode Active (Reduced Animations & Assets)' : 'Switch to Low Data Mode'}
            className={`flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl border text-xs font-semibold transition-all ${
              lowDataMode
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lowDataMode ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="hidden sm:inline">Low-Data: {lowDataMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* User Logged In State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="User Account Menu"
                className="flex items-center gap-2 p-1.5 min-h-[44px] rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {user.fullName.substring(0, 2)}
                </div>
                <div className="hidden lg:block text-left text-xs pr-1">
                  <p className="font-bold text-slate-800 truncate max-w-[110px] leading-tight">{user.fullName}</p>
                  <p className="text-[10px] text-blue-600 font-semibold capitalize flex items-center gap-1">
                    {user.role === 'admin' && <Shield className="w-2.5 h-2.5 text-amber-500" />}
                    {user.role === 'teacher' && <Award className="w-2.5 h-2.5 text-blue-500" />}
                    {user.role}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate(user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    Settings
                  </button>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      onNavigate('home');
                    }}
                    className="w-full text-left px-3 py-2.5 min-h-[44px] text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Buttons */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-2 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-2 min-h-[44px] text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start Free
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={`mobile-${link.id}`}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 min-h-[48px] flex items-center text-sm font-semibold rounded-xl transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {user && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button
                onClick={() => {
                  onNavigate(user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 min-h-[48px] text-sm text-blue-600 font-bold rounded-xl hover:bg-blue-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
