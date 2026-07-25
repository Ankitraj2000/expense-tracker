import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * ExitConfirmDialog — Intercepts back button on root/dashboard pages
 * to ask "Exit App?" instead of closing or showing a blank screen.
 */
export default function ExitConfirmDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Only intercept back button when user is on dashboard or root landing page
    const isRoot = location.pathname === '/dashboard' || location.pathname === '/';
    if (!isRoot) return;

    // Push guard state once on root mount to catch back press
    window.history.pushState({ pwaGuard: true }, '', window.location.href);

    const handlePopState = () => {
      // Show confirmation dialog when user presses back on root page
      setShowDialog(true);
      // Re-push state so user doesn't exit immediately if they hit back again
      window.history.pushState({ pwaGuard: true }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  const handleExit = () => {
    setShowDialog(false);
    
    // Check if running as installed standalone PWA
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) {
      // In installed PWA, close window
      try {
        window.close();
      } catch (e) {}
    } else {
      // In browser mode, log out cleanly and redirect to login page (NO BLANK SCREEN!)
      logout();
      navigate('/login', { replace: true });
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
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
