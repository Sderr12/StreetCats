import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  // Initialize state looking into localStorage;
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative inline-flex h-10 w-20 items-center rounded-full 
                 bg-gray-200 dark:bg-slate-800 
                 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
      aria-label="Toggle Dark Mode"
    >
      <span
        className={`${isDark ? 'translate-x-11 bg-slate-900' : 'translate-x-1 bg-white'
          } inline-block h-8 w-8 transform rounded-full transition-transform duration-300 flex items-center justify-center shadow-md`}
      >
        {isDark ? (
          <Moon size={18} className="text-yellow-400" />
        ) : (
          <Sun size={18} className="text-orange-500" />
        )}
      </span>

      {/* Testo di sfondo opzionale */}
      <span className="absolute left-3 dark:opacity-0 transition-opacity duration-300">
        <Sun size={14} className="text-orange-400" />
      </span>
      <span className="absolute right-3 opacity-0 dark:opacity-100 transition-opacity duration-300">
        <Moon size={14} className="text-slate-400" />
      </span>
    </button>
  );
};

export default DarkModeToggle;
