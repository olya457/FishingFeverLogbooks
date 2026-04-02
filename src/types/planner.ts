export interface TripEntry {
  id: string;
  name: string;
  location: string;
  date: string;
  notes?: string;
  remindMe: boolean;
  status: 'upcoming' | 'today' | 'completed';
}