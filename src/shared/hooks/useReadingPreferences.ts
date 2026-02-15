'use client';

import { useState, useEffect, useCallback } from 'react';
import { READING } from '@/shared/constants';

export interface ReadingPreferences {
  fontSize: number;
  lineHeight: number;
  fontFamily: 'sans' | 'serif';
  immersiveMode: boolean;
}

const STORAGE_KEY = 'pegriam-reading-preferences';

const defaultPrefs: ReadingPreferences = {
  fontSize: READING.defaultFontSize,
  lineHeight: READING.defaultLineHeight,
  fontFamily: 'serif',
  immersiveMode: false,
};

function load(): ReadingPreferences {
  if (typeof window === 'undefined') return defaultPrefs;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPrefs, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultPrefs;
}

export function useReadingPreferences() {
  const [prefs, setPrefs] = useState<ReadingPreferences>(defaultPrefs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setPrefs(load()); setMounted(true); }, []);

  const update = useCallback((partial: Partial<ReadingPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const increaseFontSize = useCallback(() => {
    update({ fontSize: Math.min(prefs.fontSize + READING.fontSizeStep, READING.maxFontSize) });
  }, [prefs.fontSize, update]);

  const decreaseFontSize = useCallback(() => {
    update({ fontSize: Math.max(prefs.fontSize - READING.fontSizeStep, READING.minFontSize) });
  }, [prefs.fontSize, update]);

  const increaseLineHeight = useCallback(() => {
    const v = Math.round((prefs.lineHeight + READING.lineHeightStep) * 10) / 10;
    update({ lineHeight: Math.min(v, READING.maxLineHeight) });
  }, [prefs.lineHeight, update]);

  const decreaseLineHeight = useCallback(() => {
    const v = Math.round((prefs.lineHeight - READING.lineHeightStep) * 10) / 10;
    update({ lineHeight: Math.max(v, READING.minLineHeight) });
  }, [prefs.lineHeight, update]);

  const toggleFontFamily = useCallback(() => {
    update({ fontFamily: prefs.fontFamily === 'serif' ? 'sans' : 'serif' });
  }, [prefs.fontFamily, update]);

  const toggleImmersiveMode = useCallback(() => {
    update({ immersiveMode: !prefs.immersiveMode });
  }, [prefs.immersiveMode, update]);

  const resetPreferences = useCallback(() => { update(defaultPrefs); }, [update]);

  return {
    prefs: mounted ? prefs : defaultPrefs,
    mounted,
    increaseFontSize,
    decreaseFontSize,
    increaseLineHeight,
    decreaseLineHeight,
    toggleFontFamily,
    toggleImmersiveMode,
    resetPreferences,
    updatePrefs: update,
  };
}
