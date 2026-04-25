import { useQuery } from '@tanstack/react-query';
import { getCompetitors, GetCompetitorsParams } from '../api/competitors.api';
import { CompetitorListOut } from '../types/api.types';

export const useCompetitors = (params: GetCompetitorsParams, enabled: boolean = true) => {
  return useQuery<CompetitorListOut, Error>({
    queryKey: ['competitors', params],
    queryFn: () => getCompetitors(params),
    enabled: enabled && !!params.niche && !!params.lat && !!params.lon,
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
};
