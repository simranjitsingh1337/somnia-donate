import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ethers } from 'ethers'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string | null | undefined, length = 4): string {
  if (!address) return 'N/A'
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`
}

export function formatBalance(balance: string | null | undefined): string {
  if (!balance) return '0.00'
  try {
    const ethBalance = ethers.formatEther(balance)
    return parseFloat(ethBalance).toFixed(4)
  } catch (error) {
    console.error('Error formatting balance:', error)
    return '0.00'
  }
}

export function getExplorerLink(txHash: string, chainId: number | null): string {
  // This needs to be updated with actual Somnia explorer URL
  // For now, using a placeholder or a common testnet explorer if Somnia isn't available
  let explorerBaseUrl = 'https://explorer.somnia.network/tx/' // Placeholder for Somnia
  if (chainId === 11155111) { // Sepolia
    explorerBaseUrl = 'https://sepolia.etherscan.io/tx/'
  }
  // Add more chainId mappings if needed
  return `${explorerBaseUrl}${txHash}`
}

export function getChainName(chainId: number | null): string {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet'
    case 11155111:
      return 'Sepolia Testnet'
    case 5:
      return 'Goerli Testnet'
    case 1389: // Example Somnia Chain ID
      return 'Somnia Testnet'
    default:
      return `Unknown Network (${chainId || 'N/A'})`
  }
}
