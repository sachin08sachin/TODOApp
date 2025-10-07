'use client';

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // adjust the path as needed

export default function ThemeToggle({ className = '' }) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;
  const isDark = themeContext.theme === 'dark';

  return (
    <button
      onClick={themeContext.toggleTheme}
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
      className={`flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-offset-2
        transition
        w-7 h-7 p-1
        md:w-9 md:h-9 md:p-2
        hover:bg-gray-100 dark:hover:bg-gray-700
        ${className}`}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 md:h-6 md:w-6 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m7.071-9.071l.707.707M4.222 4.222l.707.707m12.728 12.728l.707.707M4.222 19.778l.707-.707M21 12h1M3 12H2m16.364 4.364l.707-.707M6.343 6.343l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 md:h-6 md:w-6 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 0112.21 3 7 7 0 009 17a7 7 0 009.79-4.21z" />
        </svg>
      )}
    </button>
  );
}
