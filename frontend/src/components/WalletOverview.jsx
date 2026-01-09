import { Wallet, Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';
import { shortenAddress, formatTokenBalance, formatUSD, copyToClipboard, getExplorerUrl } from '../utils/formatters';

export default function WalletOverview({ data }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(data.address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const balance = data.nativeBalance;
  const formattedBalance = balance 
    ? formatTokenBalance(balance.balance, balance.decimals, 6)
    : '0';

  return (
    <div className="bg-white dark:bg-[#1F2045] border border-gray-200 dark:border-[#2A2B5F] rounded-xl text-gray-900 dark:text-white p-4 mb-4 sm:mb-6 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 dark:text-blue-200" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-blue-200 text-xs sm:text-sm mb-1">Wallet Address</p>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <code className="text-sm sm:text-lg font-mono text-gray-900 dark:text-white">
                {shortenAddress(data.address, 6)}
              </code>
              <button
                onClick={handleCopy}
                className="hover:bg-gray-200 dark:hover:bg-white/20 p-1 sm:p-1.5 rounded transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-white" />
                )}
              </button>
              <a
                href={getExplorerUrl(data.chainId, 'address', data.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-gray-200 dark:hover:bg-white/20 p-1.5 rounded transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-white" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-[#2A2B5F] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
          <p className="text-gray-500 dark:text-blue-200 text-xs sm:text-sm">Chain</p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{data.chainName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className="text-gray-500 dark:text-blue-200 text-xs sm:text-sm mb-1">Native Balance</p>
          <p className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
            {formattedBalance} {balance?.symbol || 'ETH'}
          </p>
          {balance?.quote > 0 && (
            <p className="text-gray-700 dark:text-blue-100 text-base sm:text-lg">
              ≈ {formatUSD(balance.quote)}
            </p>
          )}
        </div>

        {data.metrics && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-gray-500 dark:text-blue-200 text-xs sm:text-sm mb-1">Total Transactions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {data.metrics.totalTransactions?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-blue-200 text-xs sm:text-sm mb-1">First Activity</p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {data.metrics.firstActivity 
                  ? new Date(data.metrics.firstActivity).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
