import { useQuery } from '@tanstack/react-query';
import { getCustomerSegments, GetCustomerSegmentsParams } from '../api/customerSegments.api';
import { CustomerSegmentListOut } from '../types/api.types';

export const useCustomerSegments = (params: GetCustomerSegmentsParams, enabled: boolean = true) => {
  return useQuery<CustomerSegmentListOut, Error>({
    queryKey: ['customer-segments', params],
    queryFn: () => getCustomerSegments(params),
    enabled: enabled && !!params.lat && !!params.lon,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};
