import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TripEntry } from '../types/planner';

interface PlannerContextType {
  trips: TripEntry[];
  addTrip: (entry: TripEntry) => void;
  updateTrip: (id: string, data: Partial<TripEntry>) => void;
  deleteTrip: (id: string) => void;
}

const PlannerContext = createContext<PlannerContextType>({} as PlannerContextType);

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [trips, setTrips] = useState<TripEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('trips').then(data => {
      if (data) setTrips(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  const addTrip = (entry: TripEntry) =>
    setTrips(prev => [entry, ...prev]);

  const updateTrip = (id: string, data: Partial<TripEntry>) =>
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));

  const deleteTrip = (id: string) =>
    setTrips(prev => prev.filter(t => t.id !== id));

  return (
    <PlannerContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlannerStore = () => useContext(PlannerContext);