import { useTheme } from '../context/ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500"
      aria-label="Toggle theme"
    >
      {/* Pallina che scorre */}
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}>
        {theme === 'light' ? (
          <span className="text-xs">☀️</span>
        ) : (
          <span className="text-xs">🌙</span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
