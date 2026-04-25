import { create } from 'zustand';
import { MarketSizingResponse } from '../types/api.types';

interface AnalysisState {
  mcc_code: string;
  niche: string;
  lat: number;
  lon: number;
  radius_m: number;
  city: string;
  capital_uzs: string;
  year: number;
  result: MarketSizingResponse | null;
  
  // Actions
  setMccCode: (code: string) => void;
  setNiche: (niche: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (radius: number) => void;
  setCity: (city: string) => void;
  setCapital: (capital: string) => void;
  setYear: (year: number) => void;
  setResult: (res: MarketSizingResponse | null) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  mcc_code: '',
  niche: '',
  lat: 41.2995, // Default Tashkent
  lon: 69.2401,
  radius_m: 1000,
  city: 'Toshkent',
  capital_uzs: '',
  year: new Date().getFullYear(),
  result: null,
  
  setMccCode: (code) => set({ mcc_code: code }),
  setNiche: (niche) => set({ niche }),
  setLocation: (lat, lon) => set({ lat, lon }),
  setRadius: (radius) => set({ radius_m: radius }),
  setCity: (city) => set({ city }),
  setCapital: (capital) => set({ capital_uzs: capital }),
  setYear: (year) => set({ year }),
  setResult: (res) => set({ result: res }),
}));
