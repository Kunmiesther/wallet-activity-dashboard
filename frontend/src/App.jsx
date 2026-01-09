import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import WalletInput from './components/WalletInput';
import WalletOverview from './components/WalletOverview';
import TransactionList from './components/TransactionList';
import TokenBalances from './components/TokenBalances';
import { walletApi } from './services/apiService';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleSearch = async (address, chainId) => {
    setLoading(true);
    setError(null);
    setWalletData(null);

    try {
      const response = await walletApi.getWalletInfo(address, chainId);

      if (response.success) {
        setWalletData(response.data);
      } else {
        setError(response.error || 'Failed to fetch wallet data');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-gray-900 dark:bg-[#0A0B1C] dark:text-white">
      {/* Theme toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 z-50 bg-card dark:bg-[#1F2045] border border-border dark:border-[#2A2B5F] rounded-lg px-3 py-2 text-sm"
      >
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <WalletInput onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
            <div className="bg-red-50 dark:bg-[#2A1620] border border-red-200 dark:border-[#FF49DB] rounded-lg sm:p-4 p-3 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-[#FF49DB] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-[#FF49DB] mb-1 text-sm sm:text-base">
                  Error
                </h3>
                <p className="text-red-700 dark:text-[#A0A0B2] sm:text-sm text-xs">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {walletData && (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <WalletOverview data={walletData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TokenBalances tokens={walletData.tokenBalances} />
              <TransactionList
                transactions={walletData.transactions}
                walletAddress={walletData.address}
                chainId={walletData.chainId}
              />
            </div>
          </div>
        )}

        {!loading && !error && !walletData && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-gray-400 dark:text-muted mb-4">
              <svg
                className="w-16 h-16 sm:w-24 sm:h-24 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-2">
              Ready to explore
            </h3>
            <p className="text-gray-500 dark:text-muted text-sm sm:text-base">
              Enter a wallet address to view activity and balances
            </p>
          </div>
        )}
      </div>

      <footer className="text-center py-6 sm:py-8 text-gray-500 dark:text-muted text-xs sm:text-sm">
        <p>Built by Estar Kunmi • Powered by Covalent API</p>
      </footer>
    </div>
  );
}

export default App;
