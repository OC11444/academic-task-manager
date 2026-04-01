import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  // 1. "State" is the app's memory. We check if the user previously chose dark mode.
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  // 2. This "Effect" runs whenever isDark changes, adding or removing the .dark class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full transition-colors hover:bg-accent/20 text-foreground"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
};