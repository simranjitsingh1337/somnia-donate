import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { Web3ContextType } from '../types'
import { SOMNIA_TESTNET_CONFIG } from '../constants'

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const updateAccountInfo = useCallback(async (currentProvider: ethers.BrowserProvider, currentAddress: string) => {
    try {
      const currentBalance = await currentProvider.getBalance(currentAddress)
      setBalance(currentBalance.toString())
      const network = await currentProvider.getNetwork()
      setChainId(Number(network.chainId))
    } catch (err) {
      console.error('Failed to update account info:', err)
      setError('Failed to fetch account details.')
    }
  }, [])

  const connectWallet = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!(window as any).ethereum) {
        toast.error('MetaMask is not installed. Please install it to connect.')
        setError('MetaMask not found.')
        setLoading(false)
        return
      }

      const newProvider = new ethers.BrowserProvider((window as any).ethereum)
      setProvider(newProvider)

      const accounts = await newProvider.send('eth_requestAccounts', [])
      const selectedAddress = accounts[0]
      setAddress(selectedAddress)

      const newSigner = await newProvider.getSigner()
      setSigner(newSigner)

      await updateAccountInfo(newProvider, selectedAddress)
      toast.success('Wallet connected successfully!')

      // Attempt to switch to Somnia Testnet
      await switchNetwork(SOMNIA_TESTNET_CONFIG.chainId)

    } catch (err: any) {
      console.error('Failed to connect wallet:', err)
      setError(err.message || 'Failed to connect wallet.')
      toast.error(err.message || 'Failed to connect wallet.')
      setAddress(null)
      setBalance(null)
      setChainId(null)
      setProvider(null)
      setSigner(null)
    } finally {
      setLoading(false)
    }
  }, [updateAccountInfo])

  const disconnectWallet = useCallback(() => {
    setAddress(null)
    setBalance(null)
    setChainId(null)
    setProvider(null)
    setSigner(null)
    toast.success('Wallet disconnected.')
    // Optionally, you might want to clear MetaMask connection here,
    // but MetaMask doesn't provide a direct 'disconnect' API for dApps.
    // Users typically disconnect from within MetaMask itself.
  }, [])

  const switchNetwork = useCallback(async (targetChainId: string): Promise<boolean> => {
    if (!provider) {
      toast.error('No wallet connected to switch networks.')
      return false
    }
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      })
      // Update state after successful switch
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
      toast.success(`Switched to ${getChainName(Number(network.chainId))}`)
      return true
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SOMNIA_TESTNET_CONFIG.chainId,
                chainName: SOMNIA_TESTNET_CONFIG.chainName,
                nativeCurrency: SOMNIA_TESTNET_CONFIG.nativeCurrency,
                rpcUrls: SOMNIA_TESTNET_CONFIG.rpcUrls,
                blockExplorerUrls: SOMNIA_TESTNET_CONFIG.blockExplorerUrls,
              },
            ],
          })
          // After adding, try switching again
          return await switchNetwork(targetChainId)
        } catch (addError: any) {
          console.error('Failed to add network:', addError)
          toast.error(`Failed to add ${SOMNIA_TESTNET_CONFIG.chainName}: ${addError.message}`)
          setError(`Failed to add network: ${addError.message}`)
          return false
        }
      }
      console.error('Failed to switch network:', switchError)
      toast.error(`Failed to switch network: ${switchError.message}`)
      setError(`Failed to switch network: ${switchError.message}`)
      return false
    }
  }, [provider])

  useEffect(() => {
    const ethereum = (window as any).ethereum

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (provider) {
        setAddress(accounts[0])
        updateAccountInfo(provider, accounts[0])
      }
    }

    const handleChainChanged = (newChainId: string) => {
      if (provider) {
        const newChainIdNum = Number(newChainId)
        setChainId(newChainIdNum)
        toast.success(`Network changed to ${getChainName(newChainIdNum)}`)
        if (address) {
          updateAccountInfo(provider, address)
        }
      }
    }

    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('chainChanged', handleChainChanged)

      // Check if already connected on load
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const newProvider = new ethers.BrowserProvider(ethereum)
            setProvider(newProvider)
            setAddress(accounts[0])
            newProvider.getSigner().then(setSigner)
            updateAccountInfo(newProvider, accounts[0])
          }
        })
        .catch((err: any) => console.error('Error checking existing connection:', err))
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
        ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [provider, address, disconnectWallet, updateAccountInfo])

  const value = {
    provider,
    signer,
    address,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    loading,
    error,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

function getChainName(chainId: number | null): string {
  switch (chainId) {
    case 1: return 'Ethereum Mainnet'
    case 11155111: return 'Sepolia Testnet'
    case 5: return 'Goerli Testnet'
    case parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16): return SOMNIA_TESTNET_CONFIG.chainName
    default: return `Unknown Network (${chainId || 'N/A'})`
  }
}
