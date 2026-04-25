import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { POIListOut } from '../types/api.types';

export interface GetPOIParams {
  lat: number;
  lon: number;
  radius_m?: number;
  poi_type?: string | null;
  city?: string | null;
}

export const getPOI = async (params: GetPOIParams): Promise<POIListOut> => {
  const response = await httpClient.get<POIListOut>(API_ENDPOINTS.POI, { params });
  return response.data;
};
