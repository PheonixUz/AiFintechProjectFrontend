import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { PopulationListOut } from '../types/api.types';

export interface GetPopulationParams {
  lat: number;
  lon: number;
  radius_m?: number;
  city?: string | null;
}

export const getPopulation = async (params: GetPopulationParams): Promise<PopulationListOut> => {
  const response = await httpClient.get<PopulationListOut>(API_ENDPOINTS.POPULATION, { params });
  return response.data;
};
