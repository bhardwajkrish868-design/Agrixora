/**
 * AgriXora Instant Multi-Language Translation Service
 * Integrates Google Translate engine for full real-time DOM translation
 * supporting English, Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Gujarati, etc.
 */

import type { Language } from '../types';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

// Map app language codes to Google Translate codes
export const GOOGLE_LANG_MAP: Record<Language, string> = {
  en: 'en',
  hi: 'hi',
  hinglish: 'hi',
  mr: 'mr',
  bn: 'bn',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  gu: 'gu'
};

let isScriptInjected = false;

/**
 * Initialize Google Translate Script in the background
 */
export function initGoogleTranslator() {
  if (typeof window === 'undefined' || isScriptInjected) return;
  
  // Inject hidden container if not present
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // Define global init callback
  window.googleTranslateElementInit = () => {
    try {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,mr,bn,ta,te,kn,gu,pa,or,ur,ml,te,ta',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE || 0
        }, 'google_translate_element');
      }
    } catch (e) {
      console.warn('Google Translate initialization notice:', e);
    }
  };

  // Inject Script
  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  isScriptInjected = true;

  // Add CSS to hide Google's default top banner
  const style = document.createElement('style');
  style.id = 'goog-translate-custom-styles';
  style.innerHTML = `
    .goog-te-banner-frame.skiptranslate, 
    .goog-te-banner-frame, 
    iframe.goog-te-banner-frame,
    #goog-gt-tt, 
    .goog-te-balloon-frame, 
    .goog-tooltip, 
    .goog-tooltip:hover {
      display: none !important;
      visibility: hidden !important;
    }
    body {
      top: 0px !important;
      position: static !important;
    }
    .goog-text-highlight {
      background: transparent !important;
      box-shadow: none !important;
    }
    font {
      background-color: transparent !important;
      box-shadow: none !important;
    }
    .skiptranslate iframe {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Apply target language across the entire web page DOM
 */
export function applyPageLanguage(lang: Language) {
  if (typeof window === 'undefined') return;

  const targetCode = GOOGLE_LANG_MAP[lang] || 'en';

  // Update cookies
  const cookieValue = targetCode === 'en' ? '' : targetCode;
  const domain = window.location.hostname;
  
  if (targetCode === 'en') {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    document.cookie = `googtrans=/en/en; path=/;`;
    document.cookie = `googtrans=/en/en; path=/; domain=${domain};`;
  } else {
    document.cookie = `googtrans=/en/${cookieValue}; path=/;`;
    document.cookie = `googtrans=/en/${cookieValue}; path=/; domain=${domain};`;
  }

  // Trigger select element if already loaded
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = targetCode;
    select.dispatchEvent(new Event('change'));
  } else {
    // If not rendered yet, trigger retry or apply on script load
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (retrySelect) {
        retrySelect.value = targetCode;
        retrySelect.dispatchEvent(new Event('change'));
        clearInterval(interval);
      } else if (attempts > 15) {
        clearInterval(interval);
      }
    }, 200);
  }
}
