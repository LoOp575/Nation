"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

export type WorkspaceContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
  fiscalYear: string;
  setFiscalYear: (year: string) => void;
  regionScope: string;
  setRegionScope: (region: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const REGION_SCOPES = [
  { code: "ID", label: "Indonesia (Nasional)" },
  { code: "ID-JK", label: "DKI Jakarta" },
  { code: "ID-JB", label: "Jawa Barat" },
  { code: "ID-JT", label: "Jawa Tengah" },
  { code: "ID-JI", label: "Jawa Timur" },
  { code: "ID-SU", label: "Sumatera Utara" },
  { code: "ID-SN", label: "Sulawesi Selatan" },
  { code: "ID-KI", label: "Kalimantan Timur" },
  { code: "ID-PA", label: "Papua" },
];

export const FISCAL_YEARS = ["APBN 2026", "APBN 2025", "APBN 2024"];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [fiscalYear, setFiscalYear] = useState<string>("APBN 2026");
  const [regionScope, setRegionScope] = useState<string>("ID");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("np-theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("np-theme", next);
      } catch {
        // Ignore storage write errors in restricted browsing modes.
      }
      return next;
    });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        theme,
        toggleTheme,
        fiscalYear,
        setFiscalYear,
        regionScope,
        setRegionScope,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
