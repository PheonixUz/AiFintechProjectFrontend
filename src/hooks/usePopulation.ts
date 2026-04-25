import { useQuery } from '@tanstack/react-query';
import { getPopulation, GetPopulationParams } from '../api/population.api';
import { PopulationListOut } from '../types/api.types';

export const usePopulation = (params: GetPopulationParams, enabled: boolean = true) => {
  return useQuery<PopulationListOut, Error>({
    queryKey: ['population', params],
    queryFn: () => getPopulation(params),
    enabled: enabled && !!params.lat && !!params.lon,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};
