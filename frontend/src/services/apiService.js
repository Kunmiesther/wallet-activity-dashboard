import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * API Service for wallet data
 */
export const walletApi = {
  /**
   * Fetch complete wallet data
   * @param {string} address - Wallet address
   * @param {string} chainId - Chain ID (default: '1')
   */
  async getWalletInfo(address, chainId = '1') {
    try {
      const response = await apiClient.get(`/wallet/${address}`, {
        params: { chainId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Fetch native balance only
   */
  async getNativeBalance(address, chainId = '1') {
    try {
      const response = await apiClient.get(`/wallet/${address}/balance`, {
        params: { chainId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Fetch token balances only
   */
  async getTokenBalances(address, chainId = '1') {
    try {
      const response = await apiClient.get(`/wallet/${address}/tokens`, {
        params: { chainId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Fetch transactions only
   */
  async getTransactions(address, chainId = '1', limit = 20) {
    try {
      const response = await apiClient.get(`/wallet/${address}/transactions`, {
        params: { chainId, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      return new Error('Unable to reach server. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
};