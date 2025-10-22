import React, { useState } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Input from './ui/Input'
import { Charity } from '../types'
import { useWeb3 } from '../context/Web3Context'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { CONTRACT_ABI, CONTRACT_ADDRESS, SOMNIA_TESTNET_CONFIG } from '../constants'
import TransactionReceipt from './TransactionReceipt'
import { DollarSign, Zap } from 'lucide-react'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  charity: Charity
}

const quickAmounts = [0.01, 0.05, 0.1, 0.5, 1] // in SOM

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, charity }) => {
  const { signer, address, chainId, connectWallet, switchNetwork, loading: web3Loading } = useWeb3()
  const [amount, setAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txAmount, setTxAmount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) { // Only allow valid numbers
      setAmount(value)
      setError(null)
    }
  }

  const handleQuickSelect = (value: number) => {
    setAmount(value.toString())
    setError(null)
  }

  const handleDonate = async () => {
    if (!address) {
      toast.error('Please connect your wallet first.')
      await connectWallet()
      return
    }

    if (chainId !== parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16)) {
      toast.error(`Please switch to ${SOMNIA_TESTNET_CONFIG.chainName} to donate.`)
      const switched = await switchNetwork(SOMNIA_TESTNET_CONFIG.chainId)
      if (!switched) return
    }

    const donationAmount = parseFloat(amount)
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setError('Please enter a valid donation amount.')
      return
    }

    if (!signer) {
      toast.error('Wallet not connected or signer not available.')
      return
    }

    setIsLoading(true)
    setError(null)
    setTxHash(null)

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const value = ethers.parseEther(donationAmount.toString())

      toast.loading('Confirming transaction in MetaMask...')

      const tx = await contract.donate(charity.address, { value })
      toast.dismiss() // Dismiss loading toast

      toast.loading('Transaction submitted. Waiting for confirmation...')
      const receipt = await tx.wait()

      if (receipt && receipt.status === 1) {
        toast.success('Donation successful! 🎉')
        setTxHash(receipt.hash)
        setTxAmount(donationAmount)
        // Store donation in local storage
        const newDonation = {
          id: Date.now().toString(),
          charityId: charity.id,
          charityName: charity.name,
          donorAddress: address,
          amount: donationAmount,
          timestamp: Date.now(),
          txHash: receipt.hash,
        }
        const existingDonations = JSON.parse(localStorage.getItem('donations') || '[]')
        localStorage.setItem('donations', JSON.stringify([...existingDonations, newDonation]))

        // Optionally, update charity's raised amount (client-side simulation)
        const updatedCharities = JSON.parse(localStorage.getItem('charities') || '[]')
        const charityIndex = updatedCharities.findIndex((c: Charity) => c.id === charity.id)
        if (charityIndex > -1) {
          updatedCharities[charityIndex].raisedAmount += donationAmount
          localStorage.setItem('charities', JSON.stringify(updatedCharities))
        }

      } else {
        toast.error('Transaction failed.')
        setError('Transaction failed on blockchain.')
      }
    } catch (err: any) {
      console.error('Donation error:', err)
      toast.dismiss()
      if (err.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user.')
        setError('Transaction rejected by user.')
      } else {
        toast.error(`Donation failed: ${err.reason || err.message}`)
        setError(`Donation failed: ${err.reason || err.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setAmount('')
    setError(null)
    setTxHash(null)
    setTxAmount(null)
    setIsLoading(false)
    onClose()
  }

  if (txHash) {
    return (
      <Modal isOpen={isOpen} onClose={handleCloseModal} title="Donation Confirmed!">
        <TransactionReceipt txHash={txHash} amount={txAmount} charityName={charity.name} />
        <div className="mt-6 flex justify-end">
          <Button onClick={handleCloseModal} variant="secondary">
            Close
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title={`Donate to ${charity.name}`}>
      <div className="space-y-6">
        <p className="text-gray-700 text-base">
          Your contribution will directly support <span className="font-semibold">{charity.name}</span> in their mission.
        </p>

        <div>
          <Input
            label="Donation Amount (SOM)"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="e.g., 0.1"
            min="0.000001"
            step="0.01"
            error={error}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((val) => (
              <Button
                key={val}
                variant={parseFloat(amount) === val ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleQuickSelect(val)}
                className="min-w-[80px]"
              >
                {val} SOM
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start space-x-3">
          <Zap size={20} className="flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-lg">Transparent Donations</h4>
            <p className="text-sm">
              All donations are processed on the Somnia Testnet blockchain, ensuring full transparency and traceability.
            </p>
          </div>
        </div>

        <Button
          onClick={handleDonate}
          isLoading={isLoading || web3Loading}
          disabled={!amount || parseFloat(amount) <= 0 || !!error || !address || chainId !== parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16)}
          className="w-full bg-gradient-primary-to-blue text-white py-3 text-lg"
        >
          <DollarSign size={20} className="mr-2" />
          {address ? (chainId === parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16) ? 'Confirm Donation' : `Switch to Somnia (${SOMNIA_TESTNET_CONFIG.chainName})`) : 'Connect Wallet to Donate'}
        </Button>
      </div>
    </Modal>
  )
}

export default DonationModal
