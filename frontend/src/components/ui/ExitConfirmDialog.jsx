import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

/**
 * ExitConfirmDialog — Traps the mobile/desktop back button so it CANNOT close the app automatically.
 * Back button will ALWAYS trigger this confirmation dialog.
 * Only clicking the "Exit App" button inside the modal will exit the app.
 */
export default function ExitConfirmDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Push guard state to prevent back button from exiting app directly
    window.history.pushState({ appLock: true }, '', window.location.href);

    const handlePopState = () => {
      // Re-push guard state immediately so browser NEVER closes app on back button
      window.history.pushState({ appLock: true }, '', window.location.href);
      // Show confirmation dialog
      setShowDialog(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  const handleExit = () => {
    setShowDialog(false);
    
    // Attempt 1: Standard PWA window close (Works in installed Android & Windows PWA)
    try {
      window.close();
    } catch (e) {}

    // Attempt 2: Self close for webview / browser tabs
    try {
      self.close();
    } catch (e) {}

    // Fallback: If browser prevents script closing, navigate out to exit
    setTimeout(() => {
      if (!window.closed) {
        window.location.replace('about:blank');
      }
    }, 100);
  };

  const handleCancel = () => {
    setShowDialog(false);
    // Ensure history lock stays active
    window.history.pushState({ appLock: true }, '', window.location.href);
  };

  if (!showDialog) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md animate-fade-in"
        onClick={handleCancel}
      />

      {/* Dialog Modal */}
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">

          {/* Header */}
          <div className="flex flex-col items-center pt-7 pb-3 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 mb-3">
              <LogOut size={26} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Exit App?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kya aap Expense Tracker app se bahar jaana chahte hain?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 pb-6 pt-3">
            <button
              id="exit-cancel-btn"
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="exit-confirm-btn"
              type="button"
              onClick={handleExit}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm shadow-md shadow-red-500/30 hover:from-red-600 hover:to-rose-700 transition-all active:scale-95 cursor-pointer"
            >
              Exit App
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
