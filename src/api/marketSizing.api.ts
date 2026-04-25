import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { MarketSizingRequest, MarketSizingResponse } from '../types/api.types';

export const calculateMarketSizing = async (data: MarketSizingRequest): Promise<MarketSizingResponse> => {
  const response = await httpClient.post<MarketSizingResponse>(API_ENDPOINTS.MARKET_SIZING, data);
  return response.data;
};
