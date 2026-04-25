import { useQuery } from '@tanstack/react-query';
import { getBenchmarks, GetBenchmarksParams } from '../api/benchmarks.api';
import { BenchmarkOut } from '../types/api.types';

export const useBenchmarks = (params: GetBenchmarksParams, enabled: boolean = true) => {
  return useQuery<BenchmarkOut[], Error>({
    queryKey: ['benchmarks', params],
    queryFn: () => getBenchmarks(params),
    enabled: enabled && !!params.city && (!!params.mcc_code || !!params.niche),
    staleTime: 1000 * 60 * 30, // 30 mins
  });
};
