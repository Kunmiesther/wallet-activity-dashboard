import { ValidationService } from '../services/validationService.js';
import { BlockchainService } from '../services/blockchainService.js';

export class WalletController {
  constructor(blockchainService) {
    this.blockchainService = blockchainService;
  }

  /**
   * GET /api/wallet/:address
   * Query params: chainId (default: '1')
   */
  async getWalletInfo(req, res, next) {
    try {
      const { address } = req.params;
      const { chainId = '1' } = req.query;

      // Validate address
      const addressValidation = ValidationService.validateAddress(address);
      if (!addressValidation.valid) {
        return res.status(400).json({
          success: false,
          error: addressValidation.error
        });
      }

      // Validate chain ID
      const chainValidation = ValidationService.validateChainId(chainId);
      if (!chainValidation.valid) {
        return res.status(400).json({
          success: false,
          error: chainValidation.error
        });
      }

      // Fetch wallet data
      const walletData = await this.blockchainService.getWalletData(
        addressValidation.normalized,
        chainValidation.chainId
      );

      // Return response
      res.json({
        success: true,
        data: {
          address: addressValidation.normalized,
          chainId: chainValidation.chainId,
          chainName: chainValidation.chainName,
          ...walletData
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/wallet/:address/balance
   */
  async getNativeBalance(req, res, next) {
    try {
      const { address } = req.params;
      const { chainId = '1' } = req.query;

      const addressValidation = ValidationService.validateAddress(address);
      if (!addressValidation.valid) {
        return res.status(400).json({
          success: false,
          error: addressValidation.error
        });
      }

      const chainValidation = ValidationService.validateChainId(chainId);
      if (!chainValidation.valid) {
        return res.status(400).json({
          success: false,
          error: chainValidation.error
        });
      }

      const balance = await this.blockchainService.getNativeBalance(
        addressValidation.normalized,
        chainValidation.chainId
      );

      res.json({
        success: true,
        data: balance
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/wallet/:address/tokens
   */
  async getTokenBalances(req, res, next) {
    try {
      const { address } = req.params;
      const { chainId = '1' } = req.query;

      const addressValidation = ValidationService.validateAddress(address);
      if (!addressValidation.valid) {
        return res.status(400).json({
          success: false,
          error: addressValidation.error
        });
      }

      const chainValidation = ValidationService.validateChainId(chainId);
      if (!chainValidation.valid) {
        return res.status(400).json({
          success: false,
          error: chainValidation.error
        });
      }

      const tokens = await this.blockchainService.getTokenBalances(
        addressValidation.normalized,
        chainValidation.chainId
      );

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/wallet/:address/transactions
   */
  async getTransactions(req, res, next) {
    try {
      const { address } = req.params;
      const { chainId = '1', limit = 20 } = req.query;

      const addressValidation = ValidationService.validateAddress(address);
      if (!addressValidation.valid) {
        return res.status(400).json({
          success: false,
          error: addressValidation.error
        });
      }

      const chainValidation = ValidationService.validateChainId(chainId);
      if (!chainValidation.valid) {
        return res.status(400).json({
          success: false,
          error: chainValidation.error
        });
      }

      const transactions = await this.blockchainService.getTransactions(
        addressValidation.normalized,
        chainValidation.chainId,
        parseInt(limit, 10)
      );

      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }
}