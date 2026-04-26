import { create } from 'zustand';
import { ChurnPredictionResponse } from '../types/api.types';

export type ChurnHorizonMonths = number;

interface ChurnPredictionState {
  mcc_code: string;
  niche: string;
  city: string;
  district: string;
  business_id: string;
  lat: number;
  lon: number;
  radius_m: number;
  send_location: boolean;
  as_of_date: string;
  prediction_horizon_months: ChurnHorizonMonths;

  business_age_months: string;
  employee_count_est: string;
  area_sqm: string;

  revenue_3m_avg_uzs: string;
  revenue_6m_avg_uzs: string;
  revenue_12m_avg_uzs: string;
  revenue_trend_6m_pct: string;
  revenue_volatility_12m_pct: string;
  revenue_drop_last_3m_pct: string;
  zero_revenue_months_12m: string;

  tx_count_3m_avg: string;
  tx_count_12m_avg: string;
  tx_count_trend_6m_pct: string;
  avg_ticket_3m_uzs: string;
  avg_ticket_change_6m_pct: string;
  active_days_last_90d: string;
  inactive_days_last_90d: string;
  online_share_12m_pct: string;

  competitor_count_radius: string;
  competitor_density_score: string;
  nearby_closed_businesses_24m: string;
  district_failure_rate_24m_pct: string;
  macro_risk_score: string;
  seasonality_risk_score: string;
  data_quality_score: string;

  result: ChurnPredictionResponse | null;

  setMccCode: (v: string) => void;
  setNiche: (v: string) => void;
  setCity: (v: string) => void;
  setDistrict: (v: string) => void;
  setBusinessId: (v: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (v: number) => void;
  setSendLocation: (v: boolean) => void;
  setAsOfDate: (v: string) => void;
  setPredictionHorizon: (v: ChurnHorizonMonths) => void;

  setField: <K extends keyof ChurnPredictionState>(
    key: K,
    value: ChurnPredictionState[K]
  ) => void;

  setResult: (r: ChurnPredictionResponse | null) => void;
}

export const useChurnPredictionStore = create<ChurnPredictionState>((set) => ({
  mcc_code: '',
  niche: '',
  city: 'Toshkent',
  district: '',
  business_id: '',
  lat: 41.2995,
  lon: 69.2401,
  radius_m: 1000,
  send_location: false,
  as_of_date: '',
  prediction_horizon_months: 24,

  business_age_months: '',
  employee_count_est: '',
  area_sqm: '',

  revenue_3m_avg_uzs: '',
  revenue_6m_avg_uzs: '',
  revenue_12m_avg_uzs: '',
  revenue_trend_6m_pct: '',
  revenue_volatility_12m_pct: '',
  revenue_drop_last_3m_pct: '',
  zero_revenue_months_12m: '',

  tx_count_3m_avg: '',
  tx_count_12m_avg: '',
  tx_count_trend_6m_pct: '',
  avg_ticket_3m_uzs: '',
  avg_ticket_change_6m_pct: '',
  active_days_last_90d: '',
  inactive_days_last_90d: '',
  online_share_12m_pct: '',

  competitor_count_radius: '',
  competitor_density_score: '',
  nearby_closed_businesses_24m: '',
  district_failure_rate_24m_pct: '',
  macro_risk_score: '',
  seasonality_risk_score: '',
  data_quality_score: '',

  result: null,

  setMccCode: (mcc_code) => set({ mcc_code }),
  setNiche: (niche) => set({ niche }),
  setCity: (city) => set({ city }),
  setDistrict: (district) => set({ district }),
  setBusinessId: (business_id) => set({ business_id }),
  setLocation: (lat, lon) => set({ lat, lon }),
  setRadius: (radius_m) => set({ radius_m }),
  setSendLocation: (send_location) => set({ send_location }),
  setAsOfDate: (as_of_date) => set({ as_of_date }),
  setPredictionHorizon: (prediction_horizon_months) =>
    set({ prediction_horizon_months }),

  setField: (key, value) => set({ [key]: value } as Partial<ChurnPredictionState>),

  setResult: (result) => set({ result }),
}));
