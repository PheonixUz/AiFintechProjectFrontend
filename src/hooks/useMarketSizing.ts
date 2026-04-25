import { useMutation } from '@tanstack/react-query';
import { calculateMarketSizing } from '../api/marketSizing.api';
import { MarketSizingRequest, MarketSizingResponse, HTTPValidationError } from '../types/api.types';

export const useMarketSizing = () => {
  return useMutation<MarketSizingResponse, HTTPValidationError, MarketSizingRequest>({
    mutationFn: calculateMarketSizing,
  });
};
