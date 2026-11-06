"use client";

import { useDashboardTheme } from "@/components/dashboard/dashboard-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useDashboardTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      title={`Switch to ${isLight ? "dark" : "light"} theme`}
    >
      <span aria-hidden="true">{isLight ? "☀" : "☾"}</span>
      <span>{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
