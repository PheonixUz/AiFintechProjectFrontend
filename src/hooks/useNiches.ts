import { useQuery } from '@tanstack/react-query';
import { getNiches, GetNichesParams } from '../api/niches.api';
import { MCCCategoryOut } from '../types/api.types';

export const useNiches = (params?: GetNichesParams) => {
  return useQuery<MCCCategoryOut[], Error>({
    queryKey: ['niches', params],
    queryFn: () => getNiches(params),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};
