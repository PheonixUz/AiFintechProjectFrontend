import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { MCCCategoryOut } from '../types/api.types';

export interface GetNichesParams {
  active_only?: boolean;
  parent_category?: string | null;
}

export const getNiches = async (params?: GetNichesParams): Promise<MCCCategoryOut[]> => {
  const response = await httpClient.get<MCCCategoryOut[]>(API_ENDPOINTS.NICHES, { params });
  return response.data;
};
