import { get } from './api';

/**
 * Fetch wallet balance from the API
 * @returns {Promise<string>} Wallet balance as string
 */
export async function fetchWalletBalance() {
  const data = await get('/api/wallet/balance');
  if (data && data.status === 'success' && data.balance) {
    return data.balance;
  }
  throw new Error(data?.message || 'Failed to fetch wallet balance');
}
