import { useEffect, useRef } from 'react';

export function useLocalStorage(key, value, setValue) {
  const isFirstRun = useRef(true);

  // Load from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValue((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore corrupted data
    }
    isFirstRun.current = false;
  }, [key, setValue]);

  // Save to localStorage on value change
  useEffect(() => {
    if (isFirstRun.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  }, [key, value]);

  const hasSavedDraft = () => {
    try {
      return !!localStorage.getItem(key);
    } catch {
      return false;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  };

  return { hasSavedDraft, clearDraft };
}
