import { useMutation } from '@tanstack/react-query';
import { runViabilityCheck } from '../api/viabilityCheck.api';
import {
  ViabilityCheckRequest,
  ViabilityCheckResponse,
  HTTPValidationError,
} from '../types/api.types';

export const useViabilityCheck = () => {
  return useMutation<ViabilityCheckResponse, HTTPValidationError, ViabilityCheckRequest>({
    mutationFn: runViabilityCheck,
  });
};
