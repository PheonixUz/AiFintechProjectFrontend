import { create } from 'zustand';
import type { OrchestratorInput, OrchestratorResult } from '../types/orchestrator.types';
import { runOrchestratorMock } from '../mock/orchestratorMock';

interface OrchestratorState {
  mcc_code: string;
  niche: string;
  city: string;
  lat: number;
  lon: number;
  radius_m: number;
  capital_uzs: string;
  year: number;

  result: OrchestratorResult | null;
  isRunning: boolean;
  error: string | null;

  setMccCode: (code: string) => void;
  setNiche: (niche: string) => void;
  setCity: (city: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (radius: number) => void;
  setCapital: (capital: string) => void;
  setYear: (year: number) => void;
  runAnalysis: () => Promise<void>;
  reset: () => void;
}

export const useOrchestratorStore = create<OrchestratorState>((set, get) => ({
  mcc_code: '',
  niche: '',
  city: 'Toshkent',
  lat: 41.2995,
  lon: 69.2401,
  radius_m: 1000,
  capital_uzs: '',
  year: new Date().getFullYear(),

  result: null,
  isRunning: false,
  error: null,

  setMccCode: (code) => set({ mcc_code: code }),
  setNiche: (niche) => set({ niche }),
  setCity: (city) => set({ city }),
  setLocation: (lat, lon) => set({ lat, lon }),
  setRadius: (radius) => set({ radius_m: radius }),
  setCapital: (capital) => set({ capital_uzs: capital }),
  setYear: (year) => set({ year }),

  runAnalysis: async () => {
    const s = get();
    if (s.isRunning) return;

    set({ isRunning: true, error: null, result: null });

    const input: OrchestratorInput = {
      niche: s.niche,
      mcc_code: s.mcc_code,
      city: s.city,
      lat: s.lat,
      lon: s.lon,
      radius_m: s.radius_m,
      capital_uzs: parseFloat(s.capital_uzs) || 0,
      year: s.year,
    };

    try {
      const res = await runOrchestratorMock(input);
      set({ result: res, isRunning: false });
    } catch (err) {
      set({
        isRunning: false,
        error: err instanceof Error ? err.message : 'Noma\'lum xatolik',
      });
    }
  },

  reset: () => set({ result: null, error: null, isRunning: false }),
}));
