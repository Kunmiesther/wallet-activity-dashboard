/**
 * Format large numbers from wei to readable format
 * @param {string} balance - Balance in wei (smallest unit)
 * @param {number} decimals - Token decimals
 * @param {number} displayDecimals - Number of decimals to show
 */
export function formatTokenBalance(balance, decimals = 18, displayDecimals = 4) {
  if (!balance || balance === '0') return '0';
  
  try {
    const value = BigInt(balance);
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    
    // Format integer part with commas
    const integerStr = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Format fractional part
    if (displayDecimals === 0) {
      return integerStr;
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const truncated = fractionalStr.slice(0, displayDecimals);
    
    // Remove trailing zeros
    const trimmed = truncated.replace(/0+$/, '');
    
    if (trimmed.length === 0) {
      return integerStr;
    }
    
    return `${integerStr}.${trimmed}`;
  } catch (error) {
    console.error('Error formatting token balance:', error);
    return '0';
  }
}

/**
 * Format USD values
 */
export function formatUSD(value) {
  if (!value || value === 0) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format large USD values (abbreviate millions, billions)
 */
export function formatLargeUSD(value) {
  if (!value || value === 0) return '$0';
  
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  
  return formatUSD(value);
}

/**
 * Shorten address for display
 */
export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format transaction hash
 */
export function shortenHash(hash, chars = 6) {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  // Relative time for recent transactions
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // Absolute date for older transactions
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Format gas in Gwei
 */
export function formatGas(gasWei) {
  if (!gasWei || gasWei === '0') return '0 Gwei';
  
  try {
    const gwei = Number(BigInt(gasWei) / BigInt(1e9));
    return `${gwei.toFixed(2)} Gwei`;
  } catch {
    return 'N/A';
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Get block explorer URL
 */
export function getExplorerUrl(chainId, type, value) {
  const explorers = {
    '1': 'https://etherscan.io',
    '137': 'https://polygonscan.com',
    '56': 'https://bscscan.com',
    '42161': 'https://arbiscan.io',
    '10': 'https://optimistic.etherscan.io',
    '43114': 'https://snowtrace.io'
  };
  
  const baseUrl = explorers[chainId] || explorers['1'];
  
  if (type === 'address') {
    return `${baseUrl}/address/${value}`;
  } else if (type === 'tx') {
    return `${baseUrl}/tx/${value}`;
  }
  
  return baseUrl;
}