import { ArrowUpRight, ArrowDownLeft, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { shortenHash, shortenAddress, formatDate, formatTokenBalance, getExplorerUrl } from '../utils/formatters';

export default function TransactionList({ transactions, walletAddress, chainId }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1F2045] rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-[#2A2B5F]">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <p className="text-gray-500 dark:text-gray-300 text-center py-8 text-sm sm:text-base">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1F2045] rounded-xl shadow-lg border border-gray-200 dark:border-[#2A2B5F]">
      <div className='p-4 sm:p-6'>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {transactions.map((tx, index) => {
          const isOutgoing = tx.from.toLowerCase() === walletAddress.toLowerCase();
          const value = formatTokenBalance(tx.value, 18, 6);
          
          return (
            <div
              key={tx.hash + index}
              className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-[#2A2B5F] hover:bg-gray-50 dark:hover:bg-[#2C2D5A] transition-colors"
            >
              {/* Direction indicator */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                isOutgoing 
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-600 dark:text-orange-200' 
                  : 'bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-200'
              }`}>
                {isOutgoing ? (
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>

              {/* Transaction details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap:1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    {tx.method || 'Transfer'}
                  </span>
                  {tx.successful ? (
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-200" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <span className='truncate'>
                    {isOutgoing ? 'To' : 'From'}: {shortenAddress(isOutgoing ? tx.to : tx.from)}
                  </span>
                  <span className='hidden sm:inline'>•</span>
                  <span className='whitespace-nowrap'>{formatDate(tx.timestamp)}</span>
                </div>
              </div>

              {/* Value */}
              <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
              <div className="text-right">
                <p className={`font-semibold text-xs sm:text-sm whitespace-nowrap${
                  value !== '0' 
                    ? isOutgoing 
                      ? 'text-orange-600 dark:text-orange-200' 
                      : 'text-green-600 dark:text-green-200'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {value !== '0' && (isOutgoing ? '- ' : '+ ')}
                  {value} ETH
                </p>
              </div>

              {/* Explorer link */}
              <a
                href={getExplorerUrl(chainId, 'tx', tx.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                title="View on explorer"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
