import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatchEntry } from '../types/logbook';

interface LogbookContextType {
  catches: CatchEntry[];
  addCatch: (entry: CatchEntry) => void;
  updateCatch: (id: string, data: Partial<CatchEntry>) => void;
  deleteCatch: (id: string) => void;
}

const LogbookContext = createContext<LogbookContextType>({} as LogbookContextType);

export const LogbookProvider = ({ children }: { children: React.ReactNode }) => {
  const [catches, setCatches] = useState<CatchEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('catches').then(data => {
      if (data) setCatches(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('catches', JSON.stringify(catches));
  }, [catches]);

  const addCatch = (entry: CatchEntry) =>
    setCatches(prev => [entry, ...prev]);

  const updateCatch = (id: string, data: Partial<CatchEntry>) =>
    setCatches(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));

  const deleteCatch = (id: string) =>
    setCatches(prev => prev.filter(c => c.id !== id));

  return (
    <LogbookContext.Provider value={{ catches, addCatch, updateCatch, deleteCatch }}>
      {children}
    </LogbookContext.Provider>
  );
};

export const useLogbookStore = () => useContext(LogbookContext);