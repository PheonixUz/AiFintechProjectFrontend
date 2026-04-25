import { useQuery } from '@tanstack/react-query';
import { getPOI, GetPOIParams } from '../api/poi.api';
import { POIListOut } from '../types/api.types';

export const usePOI = (params: GetPOIParams, enabled: boolean = true) => {
  return useQuery<POIListOut, Error>({
    queryKey: ['poi', params],
    queryFn: () => getPOI(params),
    enabled: enabled && !!params.lat && !!params.lon,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};
