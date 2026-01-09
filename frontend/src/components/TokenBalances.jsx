import { Coins } from 'lucide-react';
import { formatTokenBalance, formatUSD } from '../utils/formatters';

export default function TokenBalances({ tokens }) {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1F2045] rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-[#2A2B5F]">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Token Balances</h2>
        <div className="text-center py-6 sm:py-8">
          <Coins className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">No tokens found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1F2045] rounded-xl shadow-lg border border-gray-200 dark:border-[#2A2B5F]">
      <div className='p-4 sm:p-6'>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
        Token Balances ({tokens.length})
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {tokens.map((token, index) => {
          const balance = formatTokenBalance(
            token.balance, 
            token.decimals, 
            token.decimals <= 6 ? token.decimals : 4
          );

          return (
            <div
              key={token.contractAddress + index}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-[#2A2B5F] hover:bg-gray-50 dark:hover:bg-[#2C2D5A] transition-colors"
            >
              {/* Token logo */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {token.logo ? (
                  <img 
                    src={token.logo} 
                    alt={token.symbol}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  className="text-white font-bold text-xs sm:text-sm"
                  style={{ display: token.logo ? 'none' : 'flex' }}
                >
                  {token.symbol.slice(0, 2)}
                </span>
              </div>

              {/* Token info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {token.symbol}
                  </span>
                  {token.name && token.name !== token.symbol && (
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 truncate">
                      {token.name}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-mono">
                  {balance}
                </p>
              </div>

              {/* USD value */}
              {token.quote > 0 && (
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {formatUSD(token.quote)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
