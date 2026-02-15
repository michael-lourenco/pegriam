'use client';

import { useState, useEffect, useCallback } from 'react';

const PREFIX = 'pegriam-reading-progress-';

interface ChapterProgress {
  scrollPosition: number;
  percentage: number;
  completed: boolean;
  lastRead: string;
}

export function useReadingProgress(storyId: string, chapterId: string) {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const key = `${PREFIX}${storyId}-${chapterId}`;

  useEffect(() => {
    function onScroll() {
      const top = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min((top / total) * 100, 100) : 0;
      setScrollPercentage(pct);
      if (pct >= 95) setCompleted(true);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (scrollPercentage <= 0) return;
    const t = setTimeout(() => {
      try {
        const p: ChapterProgress = { scrollPosition: window.scrollY, percentage: scrollPercentage, completed, lastRead: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify(p));
      } catch { /* ignore */ }
    }, 1000);
    return () => clearTimeout(t);
  }, [scrollPercentage, completed, key]);

  const restoreProgress = useCallback(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) {
        const p: ChapterProgress = JSON.parse(s);
        if (p.scrollPosition > 100) window.scrollTo({ top: p.scrollPosition, behavior: 'smooth' });
        return p;
      }
    } catch { /* ignore */ }
    return null;
  }, [key]);

  const isChapterRead = useCallback((sId: string, cId: string): boolean => {
    try {
      const s = localStorage.getItem(`${PREFIX}${sId}-${cId}`);
      if (s) return JSON.parse(s).completed === true;
    } catch { /* ignore */ }
    return false;
  }, []);

  return { scrollPercentage, completed, restoreProgress, isChapterRead };
}
