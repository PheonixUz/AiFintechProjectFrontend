export interface MCCCategoryOut {
  mcc_code: string;
  category_name_en: string;
  niche_name_uz: string;
  niche_name_ru: string;
  parent_category: string;
  is_active: boolean;
}

export interface MarketSizingRequest {
  niche: string;
  mcc_code: string;
  lat: number;
  lon: number;
  radius_m?: number;
  city?: string;
  capital_uzs: number | string;
  year?: number;
}

export interface MarketSizingResponse {
  niche: string;
  city: string;
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
  methodology_notes: Record<string, any>;
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
  niche: string;
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
