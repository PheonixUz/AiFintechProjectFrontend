import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { ViabilityCheckRequest, ViabilityCheckResponse } from '../types/api.types';

export const runViabilityCheck = async (
  data: ViabilityCheckRequest
): Promise<ViabilityCheckResponse> => {
  const response = await httpClient.post<ViabilityCheckResponse>(
    API_ENDPOINTS.VIABILITY_CHECK,
    data
  );
  return response.data;
};
