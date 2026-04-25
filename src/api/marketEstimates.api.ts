import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { MarketEstimateOut } from '../types/api.types';

export interface GetMarketEstimatesParams {
  niche?: string;
  city?: string | null;
  limit?: number;
}

export const getMarketEstimates = async (params?: GetMarketEstimatesParams): Promise<MarketEstimateOut[]> => {
  const response = await httpClient.get<MarketEstimateOut[]>(API_ENDPOINTS.MARKET_ESTIMATES, { params });
  return response.data;
};
