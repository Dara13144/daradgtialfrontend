import React, { createContext, useContext, useState, useEffect } from 'react';

const InstallAppContext = createContext();

export function InstallAppProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState('unknown'); // 'ios' | 'android' | 'desktop'

  useEffect(() => {
    // 1. Detect if already installed / standalone
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // 2. Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    if (isIOS) {
      setPlatform('ios');
      setCanInstall(true); // iOS can always install via Add to Home Screen
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // 3. Native PWA Install Prompt Listener (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsStandalone(true);
      setIsModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Service worker active
          })
          .catch(() => {
            // Silent fallback
          });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    // If native prompt is available (Android / Windows / Chrome / Edge)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          setCanInstall(false);
          setIsModalOpen(false);
        }
      } catch (err) {
        // Fallback to instructions modal
        setIsModalOpen(true);
      }
      return;
    }

    // Otherwise open the guide modal (iOS Safari or desktop instructions)
    setIsModalOpen(true);
  };

  const openInstallModal = () => setIsModalOpen(true);
  const closeInstallModal = () => setIsModalOpen(false);

  return (
    <InstallAppContext.Provider
      value={{
        canInstall,
        isStandalone,
        platform,
        triggerInstall,
        isModalOpen,
        openInstallModal,
        closeInstallModal
      }}
    >
      {children}
    </InstallAppContext.Provider>
  );
}

export function useInstallApp() {
  const context = useContext(InstallAppContext);
  if (!context) {
    throw new Error('useInstallApp must be used within an InstallAppProvider');
  }
  return context;
}
