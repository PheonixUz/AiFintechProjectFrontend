import { create } from 'zustand';
import { ViabilityCheckResponse } from '../types/api.types';

export type ViabilitySimulationMonths = 12 | 24 | 36;

interface ViabilityCheckState {
  mcc_code: string;
  niche: string;
  city: string;
  plan_name: string;
  lat: number;
  lon: number;
  radius_m: number;
  send_location: boolean;
  initial_capital_uzs: string;
  startup_capex_uzs: string;
  loan_amount_uzs: string;
  monthly_loan_payment_uzs: string;
  expected_monthly_revenue_uzs: string;
  avg_ticket_uzs: string;
  expected_monthly_transactions: string;
  gross_margin_pct: string;
  variable_cost_pct: string;
  monthly_fixed_cost_uzs: string;
  monthly_rent_uzs: string;
  monthly_payroll_uzs: string;
  monthly_utilities_uzs: string;
  monthly_marketing_uzs: string;
  monthly_other_fixed_uzs: string;
  owner_draw_uzs: string;
  monthly_revenue_growth_pct: string;
  revenue_volatility_pct: string;
  annual_inflation_rate_pct: string;
  annual_macro_growth_pct: string;
  tax_rate_pct: string;
  simulation_months: ViabilitySimulationMonths;
  monte_carlo_iterations: number;
  random_seed: string;
  seasonality_json: string;
  risk_json: string;
  clean_anomalies: boolean;
  result: ViabilityCheckResponse | null;

  setMccCode: (v: string) => void;
  setNiche: (v: string) => void;
  setCity: (v: string) => void;
  setPlanName: (v: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (v: number) => void;
  setSendLocation: (v: boolean) => void;
  setInitialCapital: (v: string) => void;
  setStartupCapex: (v: string) => void;
  setLoanAmount: (v: string) => void;
  setMonthlyLoanPayment: (v: string) => void;
  setExpectedMonthlyRevenue: (v: string) => void;
  setAvgTicket: (v: string) => void;
  setExpectedMonthlyTransactions: (v: string) => void;
  setGrossMarginPct: (v: string) => void;
  setVariableCostPct: (v: string) => void;
  setMonthlyFixedCost: (v: string) => void;
  setMonthlyRent: (v: string) => void;
  setMonthlyPayroll: (v: string) => void;
  setMonthlyUtilities: (v: string) => void;
  setMonthlyMarketing: (v: string) => void;
  setMonthlyOtherFixed: (v: string) => void;
  setOwnerDraw: (v: string) => void;
  setMonthlyRevenueGrowthPct: (v: string) => void;
  setRevenueVolatilityPct: (v: string) => void;
  setAnnualInflationPct: (v: string) => void;
  setAnnualMacroGrowthPct: (v: string) => void;
  setTaxRatePct: (v: string) => void;
  setSimulationMonths: (v: ViabilitySimulationMonths) => void;
  setMonteCarloIterations: (v: number) => void;
  setRandomSeed: (v: string) => void;
  setSeasonalityJson: (v: string) => void;
  setRiskJson: (v: string) => void;
  setCleanAnomalies: (v: boolean) => void;
  setResult: (r: ViabilityCheckResponse | null) => void;
}

export const useViabilityCheckStore = create<ViabilityCheckState>((set) => ({
  mcc_code: '',
  niche: '',
  city: 'Toshkent',
  plan_name: '',
  lat: 41.2995,
  lon: 69.2401,
  radius_m: 1000,
  send_location: false,
  initial_capital_uzs: '',
  startup_capex_uzs: '',
  loan_amount_uzs: '',
  monthly_loan_payment_uzs: '',
  expected_monthly_revenue_uzs: '',
  avg_ticket_uzs: '',
  expected_monthly_transactions: '',
  gross_margin_pct: '',
  variable_cost_pct: '',
  monthly_fixed_cost_uzs: '',
  monthly_rent_uzs: '',
  monthly_payroll_uzs: '',
  monthly_utilities_uzs: '',
  monthly_marketing_uzs: '',
  monthly_other_fixed_uzs: '',
  owner_draw_uzs: '',
  monthly_revenue_growth_pct: '',
  revenue_volatility_pct: '',
  annual_inflation_rate_pct: '0.12',
  annual_macro_growth_pct: '0.03',
  tax_rate_pct: '0.04',
  simulation_months: 24,
  monte_carlo_iterations: 2000,
  random_seed: '',
  seasonality_json: '',
  risk_json: '',
  clean_anomalies: true,
  result: null,

  setMccCode: (mcc_code) => set({ mcc_code }),
  setNiche: (niche) => set({ niche }),
  setCity: (city) => set({ city }),
  setPlanName: (plan_name) => set({ plan_name }),
  setLocation: (lat, lon) => set({ lat, lon }),
  setRadius: (radius_m) => set({ radius_m }),
  setSendLocation: (send_location) => set({ send_location }),
  setInitialCapital: (initial_capital_uzs) => set({ initial_capital_uzs }),
  setStartupCapex: (startup_capex_uzs) => set({ startup_capex_uzs }),
  setLoanAmount: (loan_amount_uzs) => set({ loan_amount_uzs }),
  setMonthlyLoanPayment: (monthly_loan_payment_uzs) => set({ monthly_loan_payment_uzs }),
  setExpectedMonthlyRevenue: (expected_monthly_revenue_uzs) => set({ expected_monthly_revenue_uzs }),
  setAvgTicket: (avg_ticket_uzs) => set({ avg_ticket_uzs }),
  setExpectedMonthlyTransactions: (expected_monthly_transactions) =>
    set({ expected_monthly_transactions }),
  setGrossMarginPct: (gross_margin_pct) => set({ gross_margin_pct }),
  setVariableCostPct: (variable_cost_pct) => set({ variable_cost_pct }),
  setMonthlyFixedCost: (monthly_fixed_cost_uzs) => set({ monthly_fixed_cost_uzs }),
  setMonthlyRent: (monthly_rent_uzs) => set({ monthly_rent_uzs }),
  setMonthlyPayroll: (monthly_payroll_uzs) => set({ monthly_payroll_uzs }),
  setMonthlyUtilities: (monthly_utilities_uzs) => set({ monthly_utilities_uzs }),
  setMonthlyMarketing: (monthly_marketing_uzs) => set({ monthly_marketing_uzs }),
  setMonthlyOtherFixed: (monthly_other_fixed_uzs) => set({ monthly_other_fixed_uzs }),
  setOwnerDraw: (owner_draw_uzs) => set({ owner_draw_uzs }),
  setMonthlyRevenueGrowthPct: (monthly_revenue_growth_pct) => set({ monthly_revenue_growth_pct }),
  setRevenueVolatilityPct: (revenue_volatility_pct) => set({ revenue_volatility_pct }),
  setAnnualInflationPct: (annual_inflation_rate_pct) => set({ annual_inflation_rate_pct }),
  setAnnualMacroGrowthPct: (annual_macro_growth_pct) => set({ annual_macro_growth_pct }),
  setTaxRatePct: (tax_rate_pct) => set({ tax_rate_pct }),
  setSimulationMonths: (simulation_months) => set({ simulation_months }),
  setMonteCarloIterations: (monte_carlo_iterations) => set({ monte_carlo_iterations }),
  setRandomSeed: (random_seed) => set({ random_seed }),
  setSeasonalityJson: (seasonality_json) => set({ seasonality_json }),
  setRiskJson: (risk_json) => set({ risk_json }),
  setCleanAnomalies: (clean_anomalies) => set({ clean_anomalies }),
  setResult: (result) => set({ result }),
}));
