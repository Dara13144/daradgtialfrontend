import React, { useState } from 'react';
import {
  Download,
  Share,
  PlusSquare,
  Monitor,
  Smartphone,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { useInstallApp } from '../../context/InstallAppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTelegram } from '../../hooks/useTelegram.js';

export function InstallAppModal() {
  const { isModalOpen, closeInstallModal, platform, triggerInstall, isStandalone } = useInstallApp();
  const { lang, t } = useLanguage();
  const { haptic } = useTelegram();

  // Active guide tab
  const [activeTab, setActiveTab] = useState(
    platform === 'ios' ? 'ios' : platform === 'android' ? 'android' : 'desktop'
  );

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#1e0208] border border-rose-500/40 shadow-2xl p-5 sm:p-6 text-slate-100 overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            haptic('light');
            closeInstallModal();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Info Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-rose-900/40">
          <img
            src="/maiser_logo.png"
            alt="Maiser Store App"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-500/50 shadow-lg shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-base sm:text-lg text-white">𝑀𝑎𝑖𝑠𝑒𝑟 𝑆𝑡𝑜𝑟𝑒</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-300">Official Web App (Phone & PC)</p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-amber-300 font-bold">
              <span>⭐⭐⭐⭐⭐ 5.0</span>
              <span>•</span>
              <span className="text-emerald-400">Fast & Secure</span>
            </div>
          </div>
        </div>

        {/* Already Installed Notice */}
        {isStandalone ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-white">App Already Installed!</h4>
            <p className="text-xs text-slate-300">
              You are currently browsing inside the official standalone Maiser Store App.
            </p>
            <button
              onClick={closeInstallModal}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Platform Selector Tabs */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-rose-900/40 my-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'ios'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'android'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Computer / PC</span>
              </button>
            </div>

            {/* Tab 1: iOS iPhone/iPad Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-3 py-1">
                <p className="text-xs text-slate-300 font-semibold">
                  Install on your iPhone or iPad using Safari:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 font-black flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200">
                        Tap the <strong className="text-pink-300 inline-flex items-center gap-1">Share <Share className="w-3 h-3 inline" /></strong> button in Safari toolbar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 font-black flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200">
                        Scroll down and tap <strong className="text-emerald-400 inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3 h-3 inline" /></strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 font-black flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200">
                        Tap <strong className="text-amber-300">Add</strong> at top right. Maiser Store will appear on your Home Screen!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Android Instructions & 1-Click Button */}
            {activeTab === 'android' && (
              <div className="space-y-3 py-1">
                <p className="text-xs text-slate-300 font-semibold">
                  Install instantly on Android phones (Samsung, Xiaomi, Oppo, etc.):
                </p>

                <button
                  onClick={() => {
                    haptic('medium');
                    triggerInstall();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-glow-green transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App on Android Now</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Or tap Chrome menu (⋮) ➔ <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>
            )}

            {/* Tab 3: Desktop PC / Windows / Mac */}
            {activeTab === 'desktop' && (
              <div className="space-y-3 py-1">
                <p className="text-xs text-slate-300 font-semibold">
                  Install as a desktop application on Windows, Mac, or ChromeOS:
                </p>

                <button
                  onClick={() => {
                    haptic('medium');
                    triggerInstall();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Install to Windows / Mac Desktop</span>
                </button>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p>💡 <strong>Shortcut:</strong> Look for the <strong>Install App icon (⊕)</strong> on the right side of your browser URL search bar (Chrome, Edge, Brave).</p>
                </div>
              </div>
            )}

            {/* Bottom Benefit Highlights */}
            <div className="pt-3 border-t border-rose-900/40 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900/50">
                <span className="block font-black text-emerald-400">⚡ 1-Tap</span>
                <span>Fast Launch</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/50">
                <span className="block font-black text-pink-400">📱 Full Screen</span>
                <span>No URL Bar</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/50">
                <span className="block font-black text-amber-400">🔒 Secure</span>
                <span>Direct Access</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
