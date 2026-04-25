import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import { TransactionSummaryOut } from '../types/api.types';

export interface GetTransactionsParams {
  mcc_code: string;
  city?: string;
  year?: number;
}

export const getTransactions = async (params: GetTransactionsParams): Promise<TransactionSummaryOut> => {
  const response = await httpClient.get<TransactionSummaryOut>(API_ENDPOINTS.TRANSACTIONS, { params });
  return response.data;
};
