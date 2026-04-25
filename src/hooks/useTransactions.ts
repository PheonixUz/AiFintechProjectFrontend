import { useQuery } from '@tanstack/react-query';
import { getTransactions, GetTransactionsParams } from '../api/transactions.api';
import { TransactionSummaryOut } from '../types/api.types';

export const useTransactions = (params: GetTransactionsParams, enabled: boolean = true) => {
  return useQuery<TransactionSummaryOut, Error>({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(params),
    enabled: enabled && !!params.mcc_code,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};
