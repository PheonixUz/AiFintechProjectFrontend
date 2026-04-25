export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  MARKET_SIZING: '/api/v1/models/market-sizing',
  NICHES: '/api/v1/data/niches',
  BENCHMARKS: '/api/v1/data/benchmarks',
  COMPETITORS: '/api/v1/data/competitors',
  TRANSACTIONS: '/api/v1/data/transactions',
  POPULATION: '/api/v1/data/population',
  POI: '/api/v1/data/poi',
  CUSTOMER_SEGMENTS: '/api/v1/data/customer-segments',
  MARKET_ESTIMATES: '/api/v1/data/market-estimates',
};
