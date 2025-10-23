"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonStarIcon, SunIcon } from "./icons";

export function ThemeSwitcher() {
  const { theme: activeTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    if (mounted && activeTheme) {
      setTheme(activeTheme === "light" ? "dark" : "light");
    }
  };

  const buttonClasses =
    "select-none inline-flex rounded-lg p-2 bg-transparent border-none cursor-pointer transition-all duration-200 ease-in-out text-gray-500 dark:text-gray-400 leading-none will-change-transform hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  if (!mounted) {
    return (
      <button
        disabled={true}
        aria-label='Loading theme'
        className={buttonClasses}
      >
        <span className='inline-block size-6 opacity-0' aria-hidden></span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-label='Change the theme'
      className={buttonClasses}
    >
      <div className='animate-fade-in'>
        {activeTheme === "light" ? <SunIcon /> : <MoonStarIcon />}
      </div>
    </button>
  );
}
