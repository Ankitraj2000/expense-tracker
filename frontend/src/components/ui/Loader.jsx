import { Loader2 } from 'lucide-react';

/**
 * Full-page or inline loading spinner.
 * @param {'page'|'inline'|'sm'} variant
 * @param {string} text - Optional loading text
 */
export default function Loader({ variant = 'page', text = 'Loading...' }) {
  if (variant === 'page') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/25 animate-pulse-slow">
            <span className="text-2xl">💰</span>
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 opacity-20 animate-ping" />
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">{text}</span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <span className="text-sm text-slate-500 dark:text-slate-400">{text}</span>
        </div>
      </div>
    );
  }

  return <Loader2 size={16} className="animate-spin" />;
}
