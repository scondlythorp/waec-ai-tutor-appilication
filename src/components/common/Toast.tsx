import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type = 'info', onClose, durationMs = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [id, durationMs, onClose]);

  const bgStyles = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50',
    error: 'bg-rose-900/90 text-rose-100 border-rose-700/50',
    info: 'bg-slate-900/90 text-slate-100 border-slate-700/50',
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg max-w-md animate-in fade-in slide-in-from-top-2 text-sm font-medium ${bgStyles}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
