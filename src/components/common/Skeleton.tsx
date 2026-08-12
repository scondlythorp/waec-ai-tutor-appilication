import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse space-y-4">
    <div className="h-4 bg-slate-800 rounded-lg w-1/3"></div>
    <div className="h-6 bg-slate-800 rounded-lg w-3/4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-800/60 rounded-lg w-full"></div>
      <div className="h-3 bg-slate-800/60 rounded-lg w-5/6"></div>
      <div className="h-3 bg-slate-800/60 rounded-lg w-4/6"></div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-4 border-b border-slate-800 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-800"></div>
      <div className="space-y-1">
        <div className="h-4 bg-slate-800 rounded w-32"></div>
        <div className="h-3 bg-slate-800/60 rounded w-20"></div>
      </div>
    </div>
    <div className="h-6 bg-slate-800 rounded w-16"></div>
  </div>
);
