import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function WalletInput({ onSearch, loading }) {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('1');

  const chains = [
    { id: '1', name: 'Ethereum' },
    { id: '137', name: 'Polygon' },
    { id: '56', name: 'BSC' },
    { id: '42161', name: 'Arbitrum' },
    { id: '10', name: 'Optimism' },
    { id: '43114', name: 'Avalanche' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim(), chainId);
    }
  };

  const handleExampleClick = () => {
    const exampleAddress =
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    setAddress(exampleAddress);
    onSearch(exampleAddress, chainId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
      <div className="bg-white dark:bg-[#12132E] rounded-xl shadow-lg border border-gray-200 dark:border-[#2A2B5F] p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Wallet Activity Dashboard
        </h1>

        <p className="text-gray-600 dark:text-muted text-sm sm:text-base mb-4 sm:mb-6">
          Enter any EVM wallet address to view balance, transactions, and activity
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flexx-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x... (paste wallet address)"
                disabled={loading}
                className="
                  w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg outline-none transition-all
                  bg-white dark:bg-[#0A0B1C]
                  border border-gray-300 dark:border-[#2A2B5F]
                  text-gray-900 dark:text-white
                  placeholder:text-gray-400 dark:placeholder:text-muted
                  focus:ring-2 focus:ring-primary focus:border-transparent
                "
              />
            </div>

            <div className='flex gap-2 sm:gap-3'>
            <select
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              disabled={loading}
              className="
                flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg outline-none transition-all
                bg-white dark:bg-[#0A0B1C]
                border border-gray-300 dark:border-[#2A2B5F]
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-primary focus:border-transparent
              "
            >
              {chains.map((chain) => (
                <option
                  key={chain.id}
                  value={chain.id}
                  className="bg-white dark:bg-[#0A0B1C]"
                >
                  {chain.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="
                flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium flex items-center gap-2
                bg-primary hover:bg-primaryHover text-white
                disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-colors text-sm sm:text-base
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className='hidden sm:inline'>Loading</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          </div>
        </form>

        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-muted">
          <span>Try example:</span>
          <button
            onClick={handleExampleClick}
            disabled={loading}
            className="text-primary hover:underline"
          >
            Vitalik&apos;s Address
          </button>
        </div>
      </div>
    </div>
  );
}
