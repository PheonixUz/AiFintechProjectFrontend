import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { BenchmarkOut } from '../types/api.types';

export interface GetBenchmarksParams {
  city?: string;
  mcc_code?: string | null;
  niche?: string | null;
}

export const getBenchmarks = async (params: GetBenchmarksParams): Promise<BenchmarkOut[]> => {
  const response = await httpClient.get<BenchmarkOut[]>(API_ENDPOINTS.BENCHMARKS, { params });
  return response.data;
};
