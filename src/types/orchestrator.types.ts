export type ModuleVerdict = 'positive' | 'neutral' | 'negative';
export type BlockCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type OverallVerdict = 'GO' | 'CAUTION' | 'NO_GO';

export interface ModuleKeyMetric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface ModuleDetail {
  label: string;
  value: string;
}

export interface ModuleMockResult {
  code: string;
  name: string;
  algorithm: string;
  description: string;
  blockCode: BlockCode;
  score: number;
  verdict: ModuleVerdict;
  keyMetric: ModuleKeyMetric;
  summary: string;
  details?: ModuleDetail[];
}

export interface BlockMockResult {
  code: BlockCode;
  title: string;
  description: string;
  score: number;
  verdict: ModuleVerdict;
  modules: ModuleMockResult[];
}

export interface OrchestratorInput {
  niche: string;
  mcc_code: string;
  city: string;
  lat: number;
  lon: number;
  radius_m: number;
  capital_uzs: number;
  year: number;
}

export interface OrchestratorResult {
  input: OrchestratorInput;
  overallScore: number;
  verdict: OverallVerdict;
  blocks: BlockMockResult[];
  recommendations: string[];
  topRisks: string[];
  topOpportunities: string[];
  headline: string;
  generatedAt: string;
  runtimeMs: number;
}
