import React, { createContext, useContext, useState } from 'react';

type AppState = {
  loading: boolean;
  setLoading: (v: boolean) => void;
  error?: string;
  setError: (msg?: string) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const value = { loading, setLoading, error, setError };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext 未初始化');
  return ctx;
}