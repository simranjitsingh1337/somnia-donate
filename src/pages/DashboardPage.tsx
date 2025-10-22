import React, { useState, useEffect, useMemo } from 'react'
import { Donation, QuizQuestion, QuizAnswers } from '../types'
import { useWeb3 } from '../context/Web3Context'
import { formatAddress, getExplorerLink } from '../lib/utils'
import { ExternalLink, Wallet, History, DollarSign, LayoutDashboard, Heart } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { INITIAL_DONATIONS, QUIZ_QUESTIONS } from '../constants'

const DashboardPage: React.FC = () => {
  const { address, connectWallet, loading: web3Loading } = useWeb3()
  const [donations, setDonations] = useState<Donation[]>([])
  const [userQuizAnswers, setUserQuizAnswers] = useState<QuizAnswers>({});
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

    // Load quiz answers from localStorage
    const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
    setUserQuizAnswers(storedAnswers);

    setLoading(false)
  }, [])

  const userDonations = useMemo(() => {
    if (!address) return []
    return donations.filter(d => d.donorAddress.toLowerCase() === address.toLowerCase())
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent
  }, [donations, address])

  // Calculate total amount donated
  const totalAmountDonated = useMemo(() => {
    return userDonations.reduce((sum, d) => sum + d.amount, 0)
  }, [userDonations])

  // Calculate most donated charity (by count)
  const mostDonatedCharity = useMemo(() => {
    if (userDonations.length === 0) return null;
    const charityCounts: { [key: string]: number } = {};
    userDonations.forEach(d => {
      charityCounts[d.charityName] = (charityCounts[d.charityName] || 0) + 1;
    });
    let topCharityName = '';
    let maxCount = 0;
    for (const name in charityCounts) {
      if (charityCounts[name] > maxCount) {
        maxCount = charityCounts[name];
        topCharityName = name;
      }
    }
    return topCharityName;
  }, [userDonations]);

  // Format quiz answers for display
  const formattedInterests = useMemo(() => {
    return QUIZ_QUESTIONS.map(q => {
      const answer = userQuizAnswers[q.id];
      if (!answer) return null;

      let displayValue: string | string[] = '';
      if (q.type === 'select' || q.type === 'multiselect') {
        const selectedOptions = Array.isArray(answer) ? answer : [answer];
        displayValue = selectedOptions.map(val => q.options?.find(opt => opt.value === val)?.label || val).join(', ');
      } else if (q.type === 'range') {
        displayValue = `${answer}`;
      }
      return { question: q.question, answer: displayValue };
    }).filter(Boolean);
  }, [userQuizAnswers]);

  if (loading || web3Loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-surface rounded-xl shadow-card animate-fadeInUp border border-border">
        <p className="text-xl text-textSecondary">Loading dashboard...</p>
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
    <div className="animate-fadeInUp space-y-8">
      <h1 className="text-4xl font-bold text-text mb-8 flex items-center text-gradient-primary-to-secondary">
        <LayoutDashboard className="mr-4 text-primary" size={40} />
        Your Donation Dashboard
      </h1>

      {/* Wallet Information */}
      <div className="bg-surface rounded-xl shadow-card p-8 border border-border">
        <h2 className="text-2xl font-semibold text-text mb-4 flex items-center">
          <Wallet size={24} className="mr-3 text-secondary" /> Wallet Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-textSecondary">
          <div>
            <p className="font-medium">Connected Address:</p>
            <p className="font-mono text-primary break-all">{address}</p>
          </div>
          <div>
            <p className="font-medium">Total Donations Made:</p>
            <p className="text-xl font-bold text-accent">{userDonations.length}</p>
          </div>
        </div>
      </div>

      {/* Donation Summary & Analytics */}
      <div className="bg-surface rounded-xl shadow-card p-8 border border-border">
        <h2 className="text-2xl font-semibold text-text mb-4 flex items-center">
          <DollarSign size={24} className="mr-3 text-success" /> Donation Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-textSecondary">
          <div>
            <p className="font-medium">Total Amount Donated:</p>
            <p className="text-xl font-bold text-success">{totalAmountDonated.toFixed(4)} SOM</p>
          </div>
          <div>
            <p className="font-medium">Most Donated Charity:</p>
            <p className="text-xl font-bold text-primary">{mostDonatedCharity || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium">Unique Charities Supported:</p>
            <p className="text-xl font-bold text-secondary">{new Set(userDonations.map(d => d.charityId)).size}</p>
          </div>
        </div>
      </div>

      {/* Your Interests (from Quiz) */}
      <div className="bg-surface rounded-xl shadow-card p-8 border border-border">
        <h2 className="text-2xl font-semibold text-text mb-4 flex items-center">
          <Heart size={24} className="mr-3 text-accent" /> Your Interests
        </h2>
        {formattedInterests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-textSecondary">
            {formattedInterests.map((item, index) => (
              <div key={index}>
                <p className="font-medium">{item?.question}:</p>
                <p className="text-primary">{item?.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Interests Recorded"
            message="Complete our quiz to help us understand your preferences and show them here!"
            actionText="Take the Quiz"
            onAction={() => window.location.href = '/'}
            small
          />
        )}
      </div>

      {/* Donation History */}
      <div className="bg-surface rounded-xl shadow-card p-8 border border-border">
        <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
          <History size={24} className="mr-3 text-purple-500" /> Donation History
        </h2>

        {userDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Charity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Amount (SOM)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {userDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-background transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/charities/${donation.charityId}`} className="text-primary hover:underline font-medium">
                        {donation.charityName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-success font-semibold">
                      {donation.amount.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-textSecondary">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                      <a
                        href={getExplorerLink(donation.txHash, 1389)} // Assuming Somnia Testnet chainId 1389
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline flex items-center"
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
