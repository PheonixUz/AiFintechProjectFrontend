import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { DemandForecastRequest, DemandForecastResponse } from '../types/api.types';

export const runDemandForecast = async (
  data: DemandForecastRequest
): Promise<DemandForecastResponse> => {
  const response = await httpClient.post<DemandForecastResponse>(
    API_ENDPOINTS.DEMAND_FORECAST,
    data
  );
  return response.data;
};
