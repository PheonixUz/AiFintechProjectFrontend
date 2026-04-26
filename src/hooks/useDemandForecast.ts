import { useMutation } from '@tanstack/react-query';
import { runDemandForecast } from '../api/demandForecast.api';
import {
  DemandForecastRequest,
  DemandForecastResponse,
  HTTPValidationError,
} from '../types/api.types';

export const useDemandForecast = () => {
  return useMutation<
    DemandForecastResponse,
    HTTPValidationError,
    DemandForecastRequest
  >({
    mutationFn: runDemandForecast,
  });
};
