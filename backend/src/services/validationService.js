import { isAddress, getAddress } from 'ethers';

/**
 * Validates and normalizes EVM addresses
 */
export class ValidationService {
  /**
   * Validates if a string is a valid Ethereum address
   * @param {string} address - Address to validate
   * @returns {Object} - { valid: boolean, normalized: string|null, error: string|null }
   */
  static validateAddress(address) {
    // Check if address exists
    if (!address || typeof address !== 'string') {
      return {
        valid: false,
        normalized: null,
        error: 'Address is required and must be a string'
      };
    }

    // Trim whitespace
    const trimmed = address.trim();

    // Check if it's a valid Ethereum address format
    if (!isAddress(trimmed)) {
      return {
        valid: false,
        normalized: null,
        error: 'Invalid Ethereum address format'
      };
    }

    // Normalize to checksum address
    try {
      const checksummed = getAddress(trimmed);
      return {
        valid: true,
        normalized: checksummed,
        error: null
      };
    } catch (error) {
      return {
        valid: false,
        normalized: null,
        error: 'Failed to normalize address'
      };
    }
  }

  /**
   * Validates chain ID
   * @param {string|number} chainId
   * @returns {Object}
   */
  static validateChainId(chainId) {
    const supportedChains = {
      '1': 'Ethereum Mainnet',
      '137': 'Polygon',
      '56': 'BSC',
      '42161': 'Arbitrum',
      '10': 'Optimism',
      '43114': 'Avalanche'
    };

    const chainIdStr = String(chainId);
    
    if (!supportedChains[chainIdStr]) {
      return {
        valid: false,
        chainId: null,
        chainName: null,
        error: `Chain ID ${chainId} not supported. Supported: ${Object.keys(supportedChains).join(', ')}`
      };
    }

    return {
      valid: true,
      chainId: chainIdStr,
      chainName: supportedChains[chainIdStr],
      error: null
    };
  }
}