import React, { useState, useEffect, useMemo } from 'react'
import { Donation } from '../types'
import { useWeb3 } from '../context/Web3Context'
import { formatAddress, getExplorerLink } from '../lib/utils'
import { ExternalLink, Wallet, History, DollarSign } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { INITIAL_DONATIONS } from '../constants'

const DashboardPage: React.FC = () => {
  const { address, connectWallet, loading: web3Loading } = useWeb3()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const storedDonations = JSON.parse(localStorage.getItem('donations') || '[]')
    // Add initial mock donations if localStorage is empty
    if (storedDonations.length === 0) {
      localStorage.setItem('donations', JSON.stringify(INITIAL_DONATIONS))
      setDonations(INITIAL_DONATIONS)
    } else {
      setDonations(storedDonations)
    }
    setLoading(false)
  }, [])

  const userDonations = useMemo(() => {
    if (!address) return []
    return donations.filter(d => d.donorAddress.toLowerCase() === address.toLowerCase())
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent
  }, [donations, address])

  if (loading || web3Loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-card animate-fadeInUp">
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </div>
    )
  }

  if (!address) {
    return (
      <EmptyState
        title="Connect Your Wallet"
        message="Please connect your MetaMask wallet to view your donation history and manage your profile."
        actionText="Connect Wallet"
        onAction={connectWallet}
      />
    )
  }

  return (
    <div className="animate-fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center">
        <LayoutDashboard className="mr-4 text-gradient-primary-to-blue" size={40} />
        Your Donation Dashboard
      </h1>

      <div className="bg-white rounded-xl shadow-card p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Wallet size={24} className="mr-3 text-blue-500" /> Wallet Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-medium">Connected Address:</p>
            <p className="font-mono text-blue-600 break-all">{address}</p>
          </div>
          <div>
            <p className="font-medium">Total Donations Made:</p>
            <p className="text-xl font-bold text-green-600">{userDonations.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <History size={24} className="mr-3 text-purple-500" /> Donation History
        </h2>

        {userDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (SOM)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/charities/${donation.charityId}`} className="text-blue-600 hover:underline font-medium">
                        {donation.charityName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                      {donation.amount.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={getExplorerLink(donation.txHash, 1389)} // Assuming Somnia Testnet chainId 1389
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {formatAddress(donation.txHash, 4)} <ExternalLink size={16} className="ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Donations Yet"
            message="You haven't made any donations with this wallet. Start by exploring our charities!"
            actionText="Browse Charities"
            onAction={() => window.location.href = '/charities'}
          />
        )}
      </div>
    </div>
  )
}

export default DashboardPage
