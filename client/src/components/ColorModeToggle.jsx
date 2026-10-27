import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ColorModeToggle() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('app-color-mode') === 'dark');

  useEffect(() => {
    const mode = darkMode ? 'dark' : 'light';
    document.documentElement.dataset.colorMode = mode;
    localStorage.setItem('app-color-mode', mode);
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode((enabled) => !enabled)}
      className="theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={darkMode}
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
