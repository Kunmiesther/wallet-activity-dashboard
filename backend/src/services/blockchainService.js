import axios from 'axios';

/**
 * Blockchain data service using Covalent API
 * Docs: https://www.covalenthq.com/docs/api/
 */
export class BlockchainService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.covalenthq.com/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username: apiKey,
        password: ''
      },
      timeout: 15000
    });
  }

  /**
   * Get native balance and basic info
   * @param {string} address - Normalized wallet address
   * @param {string} chainId - Chain ID (e.g., '1' for Ethereum)
   */
  async getNativeBalance(address, chainId) {
    try {
      const response = await this.axiosInstance.get(
        `/${chainId}/address/${address}/balances_v2/`,
        {
          params: {
            'no-nft-fetch': true,
            'no-spam': true
          }
        }
      );

      const data = response.data.data;
      
      // Find native token (first item is usually native token)
      const nativeToken = data.items.find(
        token => token.native_token === true
      );

      if (!nativeToken) {
        return {
          balance: '0',
          symbol: 'ETH',
          decimals: 18,
          quote: 0
        };
      }

      return {
        balance: nativeToken.balance,
        symbol: nativeToken.contract_ticker_symbol,
        decimals: nativeToken.contract_decimals,
        quote: nativeToken.quote || 0
      };
    } catch (error) {
      console.error('Error fetching native balance:', error.message);
      throw new Error(`Failed to fetch native balance: ${error.message}`);
    }
  }

  /**
   * Get ERC-20 token balances
   * @param {string} address - Normalized wallet address
   * @param {string} chainId - Chain ID
   */
  async getTokenBalances(address, chainId) {
    try {
      const response = await this.axiosInstance.get(
        `/${chainId}/address/${address}/balances_v2/`,
        {
          params: {
            'no-nft-fetch': true,
            'no-spam': true
          }
        }
      );

      const data = response.data.data;
      
      // Filter out native token and zero balances
      const tokens = data.items
        .filter(token => 
          !token.native_token && 
          parseFloat(token.balance) > 0
        )
        .map(token => ({
          contractAddress: token.contract_address,
          name: token.contract_name,
          symbol: token.contract_ticker_symbol,
          decimals: token.contract_decimals,
          balance: token.balance,
          quote: token.quote || 0,
          logo: token.logo_url
        }))
        .sort((a, b) => b.quote - a.quote) // Sort by USD value
        .slice(0, 20); // Limit to top 20

      return tokens;
    } catch (error) {
      console.error('Error fetching token balances:', error.message);
      throw new Error(`Failed to fetch token balances: ${error.message}`);
    }
  }

  /**
   * Get recent transactions
   * @param {string} address - Normalized wallet address
   * @param {string} chainId - Chain ID
   * @param {number} limit - Number of transactions to fetch
   */
  async getTransactions(address, chainId, limit = 20) {
    try {
      const response = await this.axiosInstance.get(
        `/${chainId}/address/${address}/transactions_v3/`,
        {
          params: {
            'page-size': limit,
            'no-logs': true
          }
        }
      );

      const data = response.data.data;
      
      return data.items.map(tx => ({
        hash: tx.tx_hash,
        blockHeight: tx.block_height,
        timestamp: tx.block_signed_at,
        from: tx.from_address,
        to: tx.to_address,
        value: tx.value,
        gasSpent: tx.gas_spent,
        gasPrice: tx.gas_price,
        successful: tx.successful,
        method: this.extractMethod(tx)
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  /**
   * Extract method name from transaction
   */
  extractMethod(tx) {
    if (tx.log_events && tx.log_events.length > 0) {
      const event = tx.log_events[0];
      return event.decoded?.name || 'Contract Interaction';
    }
    return tx.value !== '0' ? 'Transfer' : 'Contract Call';
  }

  /**
   * Get activity metrics
   * @param {string} address - Normalized wallet address
   * @param {string} chainId - Chain ID
   */
  async getActivityMetrics(address, chainId) {
    try {
      // Fetch more transactions to calculate metrics
      const response = await this.axiosInstance.get(
        `/${chainId}/address/${address}/transactions_v3/`,
        {
          params: {
            'page-size': 100,
            'no-logs': true
          }
        }
      );

      const data = response.data.data;
      const transactions = data.items;

      if (transactions.length === 0) {
        return {
          totalTransactions: 0,
          firstActivity: null,
          lastActivity: null,
          totalGasSpent: '0'
        };
      }

      // Calculate total gas spent
      const totalGasSpent = transactions.reduce((sum, tx) => {
        return sum + BigInt(tx.gas_spent || 0) * BigInt(tx.gas_price || 0);
      }, BigInt(0));

      return {
        totalTransactions: data.pagination.total_count || transactions.length,
        firstActivity: transactions[transactions.length - 1].block_signed_at,
        lastActivity: transactions[0].block_signed_at,
        totalGasSpent: totalGasSpent.toString()
      };
    } catch (error) {
      console.error('Error fetching activity metrics:', error.message);
      throw new Error(`Failed to fetch activity metrics: ${error.message}`);
    }
  }

  /**
   * Get all wallet data in one call (optimized)
   * @param {string} address - Normalized wallet address
   * @param {string} chainId - Chain ID
   */
  async getWalletData(address, chainId) {
    try {
      const [nativeBalance, tokenBalances, transactions, metrics] = 
        await Promise.allSettled([
          this.getNativeBalance(address, chainId),
          this.getTokenBalances(address, chainId),
          this.getTransactions(address, chainId, 20),
          this.getActivityMetrics(address, chainId)
        ]);

      return {
        nativeBalance: nativeBalance.status === 'fulfilled' 
          ? nativeBalance.value 
          : null,
        tokenBalances: tokenBalances.status === 'fulfilled' 
          ? tokenBalances.value 
          : [],
        transactions: transactions.status === 'fulfilled' 
          ? transactions.value 
          : [],
        metrics: metrics.status === 'fulfilled' 
          ? metrics.value 
          : null,
        errors: {
          nativeBalance: nativeBalance.status === 'rejected' 
            ? nativeBalance.reason.message 
            : null,
          tokenBalances: tokenBalances.status === 'rejected' 
            ? tokenBalances.reason.message 
            : null,
          transactions: transactions.status === 'rejected' 
            ? transactions.reason.message 
            : null,
          metrics: metrics.status === 'rejected' 
            ? metrics.reason.message 
            : null
        }
      };
    } catch (error) {
      console.error('Error in getWalletData:', error);
      throw error;
    }
  }
}