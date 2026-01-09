import express from 'express';
import { WalletController } from '../controllers/walletController.js';

export function createWalletRoutes(blockchainService) {
  const router = express.Router();
  const controller = new WalletController(blockchainService);

  // Get complete wallet info
  router.get('/:address', (req, res, next) => 
    controller.getWalletInfo(req, res, next)
  );

  // Get native balance only
  router.get('/:address/balance', (req, res, next) => 
    controller.getNativeBalance(req, res, next)
  );

  // Get token balances only
  router.get('/:address/tokens', (req, res, next) => 
    controller.getTokenBalances(req, res, next)
  );

  // Get transactions only
  router.get('/:address/transactions', (req, res, next) => 
    controller.getTransactions(req, res, next)
  );

  return router;
}