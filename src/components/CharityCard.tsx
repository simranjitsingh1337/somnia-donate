import React from 'react'
import { Link } from 'react-router-dom'
import { Charity } from '../types'
import Button from './ui/Button'
import ProgressBar from './ui/ProgressBar'
import { CheckCircle, MapPin, Tag, DollarSign } from 'lucide-react'
import DonationModal from './DonationModal'
import { formatAddress } from '../lib/utils'

interface CharityCardProps {
  charity: Charity
}

const CharityCard: React.FC<CharityCardProps> = ({ charity }) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = React.useState(false)

  const progress = (charity.raisedAmount / charity.targetAmount) * 100
  const formattedRaised = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(charity.raisedAmount)
  const formattedTarget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(charity.targetAmount)

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group animate-fadeInUp">
      <Link to={`/charities/${charity.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={charity.imageUrl}
            alt={charity.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {charity.verified && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
              <CheckCircle size={14} className="mr-1" /> Verified
            </span>
          )}
          {charity.matchScore !== undefined && (
            <span className="absolute top-3 right-3 bg-gradient-primary-to-blue text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              {charity.matchScore}% Match
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/charities/${charity.id}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {charity.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{charity.description}</p>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Tag size={16} className="mr-2 text-blue-500" />
          <span>{charity.category}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-2 text-purple-500" />
          <span>{charity.geography}</span>
        </div>

        <div className="mb-4">
          <ProgressBar progress={progress} />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Raised: <span className="font-semibold">{formattedRaised}</span></span>
            <span>Target: <span className="font-semibold">{formattedTarget}</span></span>
          </div>
        </div>

        <Button
          onClick={() => setIsDonationModalOpen(true)}
          className="w-full bg-gradient-primary-to-blue text-white hover:opacity-90 transition-opacity duration-200"
        >
          <DollarSign size={20} className="mr-2" /> Donate Now
        </Button>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        charity={charity}
      />
    </div>
  )
}

export default CharityCard
