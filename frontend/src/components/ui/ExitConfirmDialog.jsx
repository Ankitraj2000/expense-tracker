import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

/**
 * ExitConfirmDialog — Shows "Exit App?" dialog when user presses back
 * while there's no more React Router history to go back to.
 * Must be rendered INSIDE <BrowserRouter> to use useLocation.
 * Works on Android back button & Windows PWA back button.
 */
export default function ExitConfirmDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const pendingBackRef = useRef(false);

  const isStandalone =
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;

  // Push a guard history entry on mount to intercept the "close" back press
  useEffect(() => {
    if (!isStandalone) return;
    window.history.pushState({ __pwaGuard: true }, '');

    const handlePopState = () => {
      // Always re-push guard so app doesn't close
      window.history.pushState({ __pwaGuard: true }, '');
      pendingBackRef.current = true;

      // Give React Router ~50ms to process its own navigation
      setTimeout(() => {
        if (pendingBackRef.current) {
          // React Router did NOT navigate → user wants to exit
          setShowDialog(true);
          pendingBackRef.current = false;
        }
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isStandalone]);

  // If React Router navigated (location changed), it handled the back press — cancel exit check
  useEffect(() => {
    if (pendingBackRef.current && location.pathname !== prevPathRef.current) {
      pendingBackRef.current = false;
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  const handleExit = () => {
    window.close();
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 100);
  };

  const handleCancel = () => setShowDialog(false);

  if (!showDialog) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleCancel}
      />

      {/* Dialog — slides up from bottom on mobile */}
      <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

          {/* Header */}
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
