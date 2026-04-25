import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { CustomerSegmentListOut } from '../types/api.types';

export interface GetCustomerSegmentsParams {
  lat: number;
  lon: number;
  radius_m?: number;
  city?: string | null;
}

export const getCustomerSegments = async (params: GetCustomerSegmentsParams): Promise<CustomerSegmentListOut> => {
  const response = await httpClient.get<CustomerSegmentListOut>(API_ENDPOINTS.CUSTOMER_SEGMENTS, { params });
  return response.data;
};
