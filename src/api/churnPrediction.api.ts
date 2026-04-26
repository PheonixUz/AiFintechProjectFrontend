import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import {
  ChurnPredictionRequest,
  ChurnPredictionResponse,
} from '../types/api.types';

export const runChurnPrediction = async (
  data: ChurnPredictionRequest
): Promise<ChurnPredictionResponse> => {
  const response = await httpClient.post<ChurnPredictionResponse>(
    API_ENDPOINTS.CHURN_PREDICTION,
    data
  );
  return response.data;
};
