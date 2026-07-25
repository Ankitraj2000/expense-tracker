import { useEffect, useState } from 'react';
import { LogOut, X } from 'lucide-react';

/**
 * ExitConfirmDialog — Intercepts Android back-button in standalone PWA mode.
 * Shows a confirmation modal: "Exit App?" with Cancel / Exit buttons.
 * Only activates when running as an installed PWA (display-mode: standalone).
 */
export default function ExitConfirmDialog() {
  const [showDialog, setShowDialog] = useState(false);

  const isStandalone =
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    if (!isStandalone) return;

    // Push a dummy history state so we can catch the back press
    window.history.pushState({ pwaExit: true }, '');

    const handlePopState = (e) => {
      // Back button pressed — show exit dialog instead
      setShowDialog(true);
      // Push state again so next back press is also caught
      window.history.pushState({ pwaExit: true }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isStandalone]);

  const handleExit = () => {
    // Close the PWA window
    window.close();
    // Fallback for Android: navigate to a blank page
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 100);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

          {/* Icon header */}
          <div className="flex flex-col items-center pt-8 pb-4 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 mb-4">
              <LogOut size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
              Exit App?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
              Kya aap Expense Tracker se bahar jaana chahte hain?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 px-6 pb-8 pt-2">
            <button
              id="exit-cancel-btn"
              onClick={handleCancel}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              id="exit-confirm-btn"
              onClick={handleExit}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-500/30 hover:from-red-600 hover:to-rose-700 transition-all active:scale-95"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
