import { useMutation } from '@tanstack/react-query';
import { runChurnPrediction } from '../api/churnPrediction.api';
import {
  ChurnPredictionRequest,
  ChurnPredictionResponse,
  HTTPValidationError,
} from '../types/api.types';

export const useChurnPrediction = () => {
  return useMutation<
    ChurnPredictionResponse,
    HTTPValidationError,
    ChurnPredictionRequest
  >({
    mutationFn: runChurnPrediction,
  });
};
