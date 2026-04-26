import { create } from 'zustand';
import { DemandForecastResponse } from '../types/api.types';

export type DemandForecastHorizon = 12 | 24 | 36;

interface DemandForecastState {
  mcc_code: string;
  niche: string;
  lat: number;
  lon: number;
  radius_m: number;
  city: string;
  horizon_months: DemandForecastHorizon;
  confidence_level: number;
  annual_inflation_rate_pct: string;
  annual_macro_growth_pct: string;
  use_holiday_adjustments: boolean;
  clean_anomalies: boolean;
  send_location_for_competitors: boolean;
  result: DemandForecastResponse | null;

  setMccCode: (code: string) => void;
  setNiche: (niche: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (radius: number) => void;
  setCity: (city: string) => void;
  setHorizonMonths: (h: DemandForecastHorizon) => void;
  setConfidenceLevel: (v: number) => void;
  setAnnualInflationPct: (v: string) => void;
  setAnnualMacroGrowthPct: (v: string) => void;
  setUseHolidayAdjustments: (v: boolean) => void;
  setCleanAnomalies: (v: boolean) => void;
  setSendLocationForCompetitors: (v: boolean) => void;
  setResult: (res: DemandForecastResponse | null) => void;
}

export const useDemandForecastStore = create<DemandForecastState>((set) => ({
  mcc_code: '',
  niche: '',
  lat: 41.2995,
  lon: 69.2401,
  radius_m: 5000,
  city: 'Toshkent',
  horizon_months: 12,
  confidence_level: 0.95,
  annual_inflation_rate_pct: '0.12',
  annual_macro_growth_pct: '0.03',
  use_holiday_adjustments: true,
  clean_anomalies: true,
  send_location_for_competitors: true,
  result: null,

  setMccCode: (code) => set({ mcc_code: code }),
  setNiche: (niche) => set({ niche }),
  setLocation: (lat, lon) => set({ lat, lon }),
  setRadius: (radius_m) => set({ radius_m }),
  setCity: (city) => set({ city }),
  setHorizonMonths: (horizon_months) => set({ horizon_months }),
  setConfidenceLevel: (confidence_level) => set({ confidence_level }),
  setAnnualInflationPct: (annual_inflation_rate_pct) => set({ annual_inflation_rate_pct }),
  setAnnualMacroGrowthPct: (annual_macro_growth_pct) => set({ annual_macro_growth_pct }),
  setUseHolidayAdjustments: (use_holiday_adjustments) => set({ use_holiday_adjustments }),
  setCleanAnomalies: (clean_anomalies) => set({ clean_anomalies }),
  setSendLocationForCompetitors: (send_location_for_competitors) =>
    set({ send_location_for_competitors }),
  setResult: (result) => set({ result }),
}));
