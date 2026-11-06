"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const DashboardThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => undefined,
});

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("shopkit-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
    setHasLoadedPreference(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference) return;
    window.localStorage.setItem("shopkit-theme", theme);
    document.documentElement.dataset.shopkitTheme = theme;
  }, [hasLoadedPreference, theme]);

  return (
    <DashboardThemeContext.Provider
      value={{
        theme,
        toggleTheme: () =>
          setTheme((current) => (current === "light" ? "dark" : "light")),
      }}
    >
      <div
        className={`dashboard-theme dashboard-theme-${theme}`}
        data-theme-ready={hasLoadedPreference ? "true" : "false"}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
