export interface MCCCategoryOut {
  mcc_code: string;
  category_name_en: string;
  niche_name_uz: string;
  niche_name_ru: string;
  parent_category: string;
  is_active: boolean;
}

/** POST /api/v1/models/demand-forecast (api_docs.json bilan sinxron) */
export interface DemandForecastRequest {
  /** MCC kod (4 raqam) */
  mcc_code: string;
  /** Shahar nomi (default: "Toshkent") */
  city?: string;
  /** API: 12, 24 yoki 36 oy (integer, default 12) */
  horizon_months?: number;
  /** Local competitor pressure uchun ixtiyoriy lokatsiya */
  lat?: number | null;
  lon?: number | null;
  /** 100 … 20000 m (ixtiyoriy) */
  radius_m?: number | null;
}

export interface DemandForecastPointOut {
  forecast_month: string;
  horizon_index: number;
  predicted_revenue_uzs: string;
  lower_revenue_uzs: string;
  upper_revenue_uzs: string;
  trend_component_uzs?: string | null;
  seasonal_component_uzs?: string | null;
  /** Schema default 0 */
  macro_adjustment_pct?: number;
  /** Schema default 0 */
  competitor_pressure_pct?: number;
  /** Schema default [] */
  event_flags?: string[];
  confidence_level: number;
}

export interface DemandForecastResponse {
  niche: string;
  mcc_code: string;
  city: string;
  horizon_months: number;
  confidence_level: number;
  confidence_score: number;
  training_sample_size: number;
  train_mape_pct?: number | null;
  train_rmse_uzs?: string | null;
  /** Schema default 0 */
  anomaly_count?: number;
  /** Schema default 0 */
  new_competitor_count_recent?: number;
  analysis_summary: string;
  methodology_notes: MethodologyNotes;
  points: DemandForecastPointOut[];
}

export interface MarketSizingRequest {
  mcc_code: string;
  lat: number;
  lon: number;
  radius_m?: number;
  city?: string;
  capital_uzs: number | string;
  year?: number;
}

export interface MethodologyNotes {
  tam_bottom_up_uzs?: string | number;
  tam_top_down_uzs?: string | number;
  sam_bottom_up_uzs?: string | number;
  sam_top_down_uzs?: string | number;
  bayesian_weight_top_down?: number;
  market_share_formula?: string;
  calculation_date?: string;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, unknown>
    | unknown[];
}

export interface MarketSizingResponse {
  mcc_code: string;
  city: string;
  /** Agar API alohida izoh qaytarsa — faqat tooltipda ko‘rsatiladi */
  analysis_summary_note?: string;
  tam_uzs: string;
  sam_uzs: string;
  som_uzs: string;
  tam_low_uzs: string;
  tam_high_uzs: string;
  sam_low_uzs: string;
  sam_high_uzs: string;
  som_low_uzs: string;
  som_high_uzs: string;
  market_share_pct: number;
  market_growth_rate_pct: number;
  gross_margin_pct: number;
  competitor_count_radius: number;
  confidence_score: number;
  data_weight: number;
  methodology_notes: MethodologyNotes;
  analysis_summary: string;
  from_cache?: boolean;
}

export interface BenchmarkOut {
  mcc_code: string;
  niche: string;
  city: string;
  avg_monthly_revenue_uzs: string;
  median_monthly_revenue_uzs: string;
  p25_monthly_revenue_uzs: string;
  p75_monthly_revenue_uzs: string;
  avg_monthly_transactions: number;
  avg_check_uzs: string;
  gross_margin_pct: number;
  avg_employee_count: number;
  revenue_per_sqm_monthly_uzs: string | null;
  annual_growth_rate_pct: number;
  data_year: number;
  data_source: string;
}

export interface CompetitorOut {
  id: number;
  name: string | null;
  niche: string;
  lat: number;
  lon: number;
  distance_m: number;
  district: string | null;
  city: string;
  is_active: boolean;
  registered_date: string;
  employee_count_est: number | null;
  monthly_revenue_est_uzs: string | null;
}

export interface CompetitorListOut {
  mcc_code: string;
  lat: number;
  lon: number;
  radius_m: number;
  total_count: number;
  competitors: CompetitorOut[];
}

export interface TransactionMonthOut {
  month: number;
  total_uzs: string;
  transaction_count: number;
}

export interface TransactionSummaryOut {
  mcc_code: string;
  city: string;
  year: number;
  annual_total_uzs: string;
  monthly_breakdown: TransactionMonthOut[];
  months_with_data: number;
}

export interface PopulationZoneOut {
  id: number;
  zone_name: string;
  district: string;
  city: string;
  lat: number;
  lon: number;
  radius_m: number;
  total_population: number;
  working_age_population: number;
  youth_population: number;
  avg_monthly_income_uzs: string;
  avg_monthly_spending_uzs: string;
  data_year: number;
}

export interface PopulationListOut {
  lat: number;
  lon: number;
  radius_m: number;
  zones_count: number;
  total_population: number;
  zones: PopulationZoneOut[];
}

export interface POIOut {
  id: number;
  name: string;
  poi_type: string;
  lat: number;
  lon: number;
  distance_m: number;
  district: string | null;
  city: string;
  capacity_est: number | null;
  daily_visitors_est: number | null;
  is_active: boolean;
}

export interface POIListOut {
  lat: number;
  lon: number;
  radius_m: number;
  poi_type: string | null;
  total_count: number;
  pois: POIOut[];
}

export interface CustomerSegmentOut {
  id: number;
  segment_name: string;
  district: string;
  city: string;
  lat: number;
  lon: number;
  radius_m: number;
  avg_monthly_spending_uzs: string;
  purchase_frequency_monthly: number;
  avg_check_uzs: string;
  top_mcc_categories: any[];
  spending_distribution: Record<string, any>;
  estimated_count: number;
  data_year: number;
}

export interface CustomerSegmentListOut {
  lat: number;
  lon: number;
  radius_m: number;
  segments_count: number;
  total_customers_est: number;
  segments: CustomerSegmentOut[];
}

export interface MarketEstimateOut {
  id: number;
  niche: string;
  mcc_code: string;
  city: string;
  lat: number;
  lon: number;
  radius_m: number;
  tam_uzs: string;
  sam_uzs: string;
  som_uzs: string;
  competitor_count: number;
  market_growth_rate_pct: number;
  confidence_score: number;
  calculation_date: string;
  created_at: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

/**
 * POST /api/v1/models/churn-prediction (M-E2)
 * api_docs.json -> ChurnPredictionRequest bilan sinxron.
 * Majburiy: business_id YOKI mcc_code. Qolganlari ixtiyoriy (bo‘sh bo‘lsa benchmark/feature pipeline ishlatadi).
 */
export type ChurnMoneyField = number | string;

export interface ChurnPredictionRequest {
  /** Mavjud biznes IDsi (>0). Berilsa backend biznesni DBdan oladi. */
  business_id?: number | null;
  /** 4 raqamli MCC kodi. business_id bo‘lmasa majburiy. */
  mcc_code?: string | null;
  /** Niche nomi. Berilmasa MCC yoki business orqali aniqlanadi. */
  niche?: string | null;
  city?: string;
  district?: string | null;
  /** -90 … 90 */
  lat?: number | null;
  /** -180 … 180 */
  lon?: number | null;
  /** 100 … 20000 m (default 1000) */
  radius_m?: number | null;
  /** YYYY-MM-DD. Berilmasa bugungi sana ishlatiladi. */
  as_of_date?: string | null;
  /** 6 … 36 oy (default 24) */
  prediction_horizon_months?: number;
  /** 0 … 600 */
  business_age_months?: number | null;
  /** 0 … 500 */
  employee_count_est?: number | null;
  /** 1 … 100000 */
  area_sqm?: number | null;
  revenue_3m_avg_uzs?: ChurnMoneyField | null;
  revenue_6m_avg_uzs?: ChurnMoneyField | null;
  revenue_12m_avg_uzs?: ChurnMoneyField | null;
  /** -1 … 2 */
  revenue_trend_6m_pct?: number | null;
  /** 0 … 3 */
  revenue_volatility_12m_pct?: number | null;
  /** 0 … 1 */
  revenue_drop_last_3m_pct?: number | null;
  /** 0 … 12 */
  zero_revenue_months_12m?: number | null;
  tx_count_3m_avg?: number | null;
  tx_count_12m_avg?: number | null;
  /** -1 … 2 */
  tx_count_trend_6m_pct?: number | null;
  avg_ticket_3m_uzs?: ChurnMoneyField | null;
  /** -1 … 2 */
  avg_ticket_change_6m_pct?: number | null;
  /** 0 … 90 */
  active_days_last_90d?: number | null;
  /** 0 … 90 */
  inactive_days_last_90d?: number | null;
  /** 0 … 1 */
  online_share_12m_pct?: number | null;
  /** 0 … 10000 */
  competitor_count_radius?: number | null;
  /** 0 … 1 */
  competitor_density_score?: number | null;
  /** 0 … 10000 */
  nearby_closed_businesses_24m?: number | null;
  /** 0 … 1 */
  district_failure_rate_24m_pct?: number | null;
  /** 0 … 1 */
  macro_risk_score?: number | null;
  /** 0 … 1 */
  seasonality_risk_score?: number | null;
  /** 0 … 1 */
  data_quality_score?: number | null;
}

export interface ChurnRiskFactorOut {
  rank: number;
  factor_name: string;
  factor_group: string;
  factor_value?: string | null;
  baseline_value?: string | null;
  impact_score: number;
  /** Masalan: "increase" / "decrease" */
  direction: string;
  explanation: string;
}

export interface ChurnPredictionResponse {
  run_id: number;
  feature_snapshot_id: number;
  model_version_id: number | null;
  business_id: number | null;
  niche: string;
  mcc_code: string;
  city: string;
  as_of_date: string;
  prediction_horizon_months: number;
  closure_probability_24m: number;
  survival_probability_24m: number;
  risk_bucket: string;
  risk_score: number;
  confidence_score: number;
  top_factors: ChurnRiskFactorOut[];
  prediction_summary: string;
  methodology_notes: MethodologyNotes;
}

/** POST /api/v1/models/viability-check (M-D1, api_docs.json bilan sinxron) */
export type ViabilityMoneyField = number | string;

export interface ViabilityCheckRequest {
  mcc_code: string;
  city?: string;
  niche?: string | null;
  plan_name?: string | null;
  lat?: number | null;
  lon?: number | null;
  radius_m?: number | null;
  initial_capital_uzs: ViabilityMoneyField;
  startup_capex_uzs?: ViabilityMoneyField | null;
  loan_amount_uzs?: ViabilityMoneyField;
  monthly_loan_payment_uzs?: ViabilityMoneyField;
  expected_monthly_revenue_uzs?: ViabilityMoneyField | null;
  avg_ticket_uzs?: ViabilityMoneyField | null;
  expected_monthly_transactions?: number | null;
  gross_margin_pct?: number | null;
  variable_cost_pct?: number | null;
  monthly_fixed_cost_uzs?: ViabilityMoneyField | null;
  monthly_rent_uzs?: ViabilityMoneyField;
  monthly_payroll_uzs?: ViabilityMoneyField;
  monthly_utilities_uzs?: ViabilityMoneyField;
  monthly_marketing_uzs?: ViabilityMoneyField;
  monthly_other_fixed_uzs?: ViabilityMoneyField;
  owner_draw_uzs?: ViabilityMoneyField;
  monthly_revenue_growth_pct?: number | null;
  revenue_volatility_pct?: number | null;
  annual_inflation_rate_pct?: number;
  annual_macro_growth_pct?: number;
  tax_rate_pct?: number;
  seasonality_profile?: Record<string, number> | null;
  risk_assumptions?: Record<string, unknown> | null;
  simulation_months?: number;
  monte_carlo_iterations?: number;
  random_seed?: number | null;
  clean_anomalies?: boolean;
}

export interface ViabilityCashflowMonthOut {
  month_index: number;
  expected_revenue_uzs: string;
  p10_revenue_uzs: string;
  p90_revenue_uzs: string;
  variable_cost_uzs: string;
  fixed_cost_uzs: string;
  loan_payment_uzs: string;
  tax_uzs: string;
  net_cashflow_uzs: string;
  cumulative_cash_p10_uzs: string;
  cumulative_cash_p50_uzs: string;
  cumulative_cash_p90_uzs: string;
  probability_negative_cash: number;
  is_break_even_month: boolean;
}

export interface ViabilityCheckResponse {
  run_id: number;
  assumption_id: number | null;
  niche: string;
  mcc_code: string;
  city: string;
  simulation_months: number;
  monte_carlo_iterations: number;
  break_even_month: number | null;
  runway_months: number;
  survival_probability_24m: number;
  cash_out_probability_24m: number;
  probability_break_even_24m: number;
  median_final_cash_uzs: string;
  p10_final_cash_uzs: string;
  p90_final_cash_uzs: string;
  worst_month_cash_uzs: string;
  min_required_capital_uzs: string;
  viability_score: number;
  recommendation: string;
  confidence_score: number;
  analysis_summary: string;
  methodology_notes: MethodologyNotes;
  cashflow_months: ViabilityCashflowMonthOut[];
}
