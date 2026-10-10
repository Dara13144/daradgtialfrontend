/**
 * Security & Mobile Viewport Protection Utility for Maiser Store
 * - Prevents F12, DevTools shortcuts (Ctrl+Shift+I/J/C, Ctrl+U, etc.)
 * - Protects contextmenu while preserving user typing & paste in input fields
 * - Handles Mobile Viewport Dynamic Height (--vh & 100dvh) fitting for phones
 */

export function initSecurityAndViewportFitting() {
  if (typeof window === 'undefined') return;

  // =========================================================================
  // 1. MOBILE PHONE VIEWPORT FITTER
  // =========================================================================
  const updateMobileViewportHeight = () => {
    try {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    } catch (e) {
      // Ignore
    }
  };

  updateMobileViewportHeight();
  window.addEventListener('resize', updateMobileViewportHeight, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(updateMobileViewportHeight, 200);
  });

  // =========================================================================
  // 2. ANTI-INSPECT & F12 DEVELOPER TOOLS RESTRICTION
  // =========================================================================
  const handleKeyDown = (e) => {
    // 1. F12 Key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // 2. Ctrl+Shift+I or Cmd+Option+I (Inspect Element)
    // 3. Ctrl+Shift+J or Cmd+Option+J (Console)
    // 4. Ctrl+Shift+C or Cmd+Option+C (Inspect Element Picker)
    if (isCtrlOrMeta && e.shiftKey) {
      const key = (e.key || '').toUpperCase();
      if (key === 'I' || key === 'J' || key === 'C') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // 5. Ctrl+U or Cmd+Option+U (View Page Source)
    if (isCtrlOrMeta && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 6. Ctrl+S or Cmd+S (Save Page)
    if (isCtrlOrMeta && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 7. Right-Click Context Menu Protection (Allow inside text inputs/textareas)
  const handleContextMenu = (e) => {
    const target = e.target;
    if (target) {
      const tagName = target.tagName ? target.tagName.toUpperCase() : '';
      const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput) {
        // Allow user to right-click to copy, cut, or paste inside form inputs
        return true;
      }
    }
    e.preventDefault();
    return false;
  };

  // 8. Prevent Dragging Images
  const handleDragStart = (e) => {
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
    }
  };

  // Attach event listeners
  window.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('dragstart', handleDragStart, true);

  // Friendly console warning for would-be attackers
  try {
    const stylesTitle = [
      'color: #f43f5e',
      'background: #1e0208',
      'font-size: 24px',
      'font-weight: 900',
      'padding: 8px 16px',
      'border-radius: 8px',
      'border: 2px solid #e11d48'
    ].join(';');

    const stylesText = [
      'color: #38bdf8',
      'font-size: 14px',
      'font-weight: 600',
      'margin-top: 6px'
    ].join(';');

    setTimeout(() => {
      console.log('%c⚠️ 𝑀𝑎𝑖𝑠𝑒𝑟 𝑆𝑡𝑜𝑟𝑒 - Protected System', stylesTitle);
      console.log(
        '%c🔒 Client-side security active. F12 and source tampering are restricted.',
        stylesText
      );
    }, 500);
  } catch (e) {
    // Ignore
  }

  // Cleanup handler for HMR / unmount
  return () => {
    window.removeEventListener('resize', updateMobileViewportHeight);
    window.removeEventListener('keydown', handleKeyDown, true);
    document.removeEventListener('contextmenu', handleContextMenu, true);
    document.removeEventListener('dragstart', handleDragStart, true);
  };
}
