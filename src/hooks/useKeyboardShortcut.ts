import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export const useKeyboardShortcut = (
  key: string,
  handler: KeyHandler,
  options: ShortcutOptions = {}
) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { ctrl = false, alt = false, shift = false, meta = false } = options;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.altKey === alt &&
        event.shiftKey === shift &&
        event.metaKey === meta
      ) {
        event.preventDefault();
        handler(event);
      }
    },
    [key, handler, options]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};

// Example usage:
// useKeyboardShortcut('s', () => save(), { ctrl: true }); // Ctrl+S
// useKeyboardShortcut('/', () => search()); // Press /
// useKeyboardShortcut('p', () => print(), { ctrl: true, shift: true }); // Ctrl+Shift+P
