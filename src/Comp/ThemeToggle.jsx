import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`w-14 h-7 rounded-full border-2 flex items-center p-0.5 transition-all duration-500 ease-in-out hover:scale-105 shadow-md ${
        isDark ? 'border-white bg-black' : 'border-black bg-white'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <div 
        className={`w-5 h-5 rounded-full shadow-sm transition-transform duration-500 ease-in-out ${
          isDark ? 'bg-white translate-x-7' : 'bg-black translate-x-0'
        }`}
      ></div>
    </button>
  );
}