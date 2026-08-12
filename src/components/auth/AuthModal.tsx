import React, { useState } from 'react';
import { X, Mail, Lock, User, School, Globe, BookOpen, ShieldAlert, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WEST_AFRICAN_COUNTRIES, SCHOOL_CLASSES, WAEC_SUBJECTS } from '../../data/subjects';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'forgot';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [classGrade, setClassGrade] = useState(SCHOOL_CLASSES[2]);
  const [country, setCountry] = useState(WEST_AFRICAN_COUNTRIES[0]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubjectToggle = (subjName: string) => {
    if (selectedSubjects.includes(subjName)) {
      if (selectedSubjects.length <= 1) return; // Keep at least 1
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }
        await login(email, password);
        onSuccess();
        onClose();
      } else if (mode === 'register') {
        if (!fullName || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        // Security requirement: Ensure user cannot assign themselves Admin role
        const safeRole: UserRole = selectedRole === 'admin' ? 'student' : selectedRole;

        await register({
          fullName,
          email,
          password,
          school: school || 'Secondary School',
          classGrade,
          country,
          subjects: selectedSubjects,
          role: safeRole,
        });
        onSuccess();
        onClose();
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Please enter your email address.');
        }
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome back to WAEC AI Tutor' : mode === 'register' ? 'Create Student/Teacher Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Enter your account email to access your study portal.'
              : mode === 'register'
              ? 'Join thousands of West African secondary school students.'
              : 'Enter your email and we will send a password reset link.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'forgot' && resetSent ? (
          <div className="text-center p-6 space-y-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Reset Link Sent</h3>
            <p className="text-xs text-slate-300">
              We have sent password recovery instructions to <span className="font-semibold text-emerald-300">{email}</span>. Please check your inbox.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* REGISTER EXTRA FIELDS */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Modou Lamin Thorp"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">I am registering as *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        selectedRole === 'student'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        selectedRole === 'teacher'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Teacher
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" /> Admin accounts require server authorization.
                  </p>
                </div>

                {/* Country & Class */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        {WEST_AFRICAN_COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Class / Grade</label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <select
                        value={classGrade}
                        onChange={(e) => setClassGrade(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        {SCHOOL_CLASSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">School Name</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. Gambia Senior Secondary School"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Subjects Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Your WAEC Subjects ({selectedSubjects.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    {WAEC_SUBJECTS.map((sub) => {
                      const isSelected = selectedSubjects.includes(sub.name);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubjectToggle(sub.name)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">Password *</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-950 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'login' ? (
                <span>Sign In to Portal</span>
              ) : mode === 'register' ? (
                <span>Complete Registration</span>
              ) : (
                <span>Send Password Reset Link</span>
              )}
            </button>
          </form>
        )}

        {/* Switch Mode Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button onClick={() => setMode('register')} className="font-bold text-emerald-400 hover:underline">
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="font-bold text-emerald-400 hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
