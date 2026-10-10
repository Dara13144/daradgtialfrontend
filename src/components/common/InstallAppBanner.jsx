import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { useInstallApp } from '../../context/InstallAppContext.jsx';
import { useTelegram } from '../../hooks/useTelegram.js';

export function InstallAppBanner() {
  const { isStandalone, triggerInstall } = useInstallApp();
  const { haptic } = useTelegram();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if dismissed recently (within 48 hours)
    try {
      const dismissedUntil = localStorage.getItem('daramini_pwa_dismissed_until');
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        setDismissed(true);
        return;
      }
    } catch (e) {
      // Ignore
    }

    // Show after 3 seconds of browsing
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setDismissed(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isStandalone]);

  if (dismissed || isStandalone) return null;

  const handleDismiss = () => {
    haptic('light');
    setDismissed(true);
    try {
      // Don't show again for 48 hours
      localStorage.setItem('daramini_pwa_dismissed_until', String(Date.now() + 48 * 3600 * 1000));
    } catch (e) {
      // Ignore
    }
  };

  return (
    <aside
      aria-label="Install Maiser Store application banner"
      className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-40 p-3 sm:p-3.5 rounded-2xl bg-[#1c0208]/95 backdrop-blur-md border border-rose-500/40 shadow-2xl animate-in slide-in-from-bottom duration-300 text-slate-100"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/maiser_logo.png"
            alt="Maiser Store App"
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-pink-500/40 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-white truncate">Install Maiser Store</h4>
            <p className="text-[11px] text-slate-300 truncate">
              Install on Phone & PC for 1-tap access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              haptic('medium');
              triggerInstall();
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            title="Dismiss banner"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
