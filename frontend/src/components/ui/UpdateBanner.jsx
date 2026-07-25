import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

/**
 * UpdateBanner — Detects when a new PWA version / Service Worker is ready
 * or shows an update prompt to the user so they know new features/icons are available.
 */
export default function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    // Listen for Service Worker update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
                setShowBanner(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    window.location.reload();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9990] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/30 flex items-center justify-between gap-3 animate-bounce-short">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">New Version Available</h4>
          <p className="text-xs text-slate-300">Naya update mil gaya hai! App ko refresh karein.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleUpdate}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <RefreshCw size={12} className="animate-spin" />
          Update
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
