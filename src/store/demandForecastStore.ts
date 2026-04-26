import { create } from 'zustand';
import { DemandForecastResponse } from '../types/api.types';

export type DemandForecastHorizon = 12 | 24 | 36;

interface DemandForecastState {
  mcc_code: string;
  lat: number;
  lon: number;
  radius_m: number;
  city: string;
  horizon_months: DemandForecastHorizon;
  send_location_for_competitors: boolean;
  result: DemandForecastResponse | null;

  setMccCode: (code: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (radius: number) => void;
  setCity: (city: string) => void;
  setHorizonMonths: (h: DemandForecastHorizon) => void;
  setSendLocationForCompetitors: (v: boolean) => void;
  setResult: (res: DemandForecastResponse | null) => void;
}

export const useDemandForecastStore = create<DemandForecastState>((set) => ({
  mcc_code: '',
  lat: 41.2995,
  lon: 69.2401,
  radius_m: 5000,
  city: 'Toshkent',
  horizon_months: 12,
  send_location_for_competitors: false,
  result: null,

  setMccCode: (code) => set({ mcc_code: code }),
  setLocation: (lat, lon) => set({ lat, lon }),
  setRadius: (radius_m) => set({ radius_m }),
  setCity: (city) => set({ city }),
  setHorizonMonths: (horizon_months) => set({ horizon_months }),
  setSendLocationForCompetitors: (send_location_for_competitors) =>
    set({ send_location_for_competitors }),
  setResult: (result) => set({ result }),
}));
