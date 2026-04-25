import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { CompetitorListOut } from '../types/api.types';

export interface GetCompetitorsParams {
  niche: string;
  lat: number;
  lon: number;
  radius_m?: number;
  active_only?: boolean;
}

export const getCompetitors = async (params: GetCompetitorsParams): Promise<CompetitorListOut> => {
  const response = await httpClient.get<CompetitorListOut>(API_ENDPOINTS.COMPETITORS, { params });
  return response.data;
};
