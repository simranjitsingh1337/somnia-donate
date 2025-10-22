import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { getExplorerLink } from '../lib/utils'
import { useWeb3 } from '../context/Web3Context'
import Button from './ui/Button'

interface TransactionReceiptProps {
  txHash: string
  amount: number | null
  charityName: string
}

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({ txHash, amount, charityName }) => {
  const { chainId } = useWeb3()
  const [showConfetti, setShowConfetti] = useState(true)
  const { width, height } = useWindowSize()

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 10000) // Stop confetti after 10 seconds
    return () => clearTimeout(timer)
  }, [])

  const explorerLink = chainId ? getExplorerLink(txHash, chainId) : '#'

  return (
    <div className="text-center py-8 relative">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          tweenDuration={5000}
          gravity={0.1}
          initialVelocityY={20}
          colors={['#8B5CF6', '#3B82F6', '#f472b6', '#10b981']}
        />
      )}
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6 animate-bounce" />
      <h3 className="text-3xl font-bold text-gray-900 mb-3">Donation Successful!</h3>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your generous donation of <span className="font-semibold">{amount?.toFixed(4) || 'N/A'} SOM</span> to <span className="font-semibold">{charityName}</span>.
      </p>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-600 break-words">
        <p className="font-medium mb-2">Transaction Hash:</p>
        <a
          href={explorerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center justify-center"
        >
          {txHash} <ExternalLink size={16} className="ml-2" />
        </a>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Your transaction has been recorded on the blockchain.
      </p>
    </div>
  )
}

// Custom hook to get window size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

export default TransactionReceipt
