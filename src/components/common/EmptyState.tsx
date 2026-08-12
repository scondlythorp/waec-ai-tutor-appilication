import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div className="p-8 text-center flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800/80 my-4">
    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-emerald-400 flex items-center justify-center mb-4 border border-slate-700/50">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-base font-bold text-white mb-1">{title}</h3>
    <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-950"
      >
        {actionText}
      </button>
    )}
  </div>
);
