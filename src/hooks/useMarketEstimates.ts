import { useQuery } from '@tanstack/react-query';
import { getMarketEstimates, GetMarketEstimatesParams } from '../api/marketEstimates.api';
import { MarketEstimateOut } from '../types/api.types';

export const useMarketEstimates = (params: GetMarketEstimatesParams = {}, enabled: boolean = true) => {
  return useQuery<MarketEstimateOut[], Error>({
    queryKey: ['market-estimates', params],
    queryFn: () => getMarketEstimates(params),
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};
