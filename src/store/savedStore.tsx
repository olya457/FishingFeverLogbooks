import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedContextType {
  savedGuideIds: string[];
  savedTipIds: string[];
  toggleGuide: (id: string) => void;
  toggleTip: (id: string) => void;
}

const defaultValue: SavedContextType = {
  savedGuideIds: [],
  savedTipIds: [],
  toggleGuide: () => {},
  toggleTip: () => {},
};

const SavedContext = createContext<SavedContextType>(defaultValue);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>([]);
  const [savedTipIds, setSavedTipIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('savedGuideIds').then(data => {
      if (data) setSavedGuideIds(JSON.parse(data));
    });
    AsyncStorage.getItem('savedTipIds').then(data => {
      if (data) setSavedTipIds(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('savedGuideIds', JSON.stringify(savedGuideIds));
  }, [savedGuideIds]);

  useEffect(() => {
    AsyncStorage.setItem('savedTipIds', JSON.stringify(savedTipIds));
  }, [savedTipIds]);

  const toggleGuide = (id: string) =>
    setSavedGuideIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const toggleTip = (id: string) =>
    setSavedTipIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  return (
    <SavedContext.Provider value={{ savedGuideIds, savedTipIds, toggleGuide, toggleTip }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSavedStore = () => useContext(SavedContext);