import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CHARITIES } from '../constants'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { ArrowLeft, CheckCircle, MapPin, Tag, DollarSign, Info, BarChart, FileText, Clock } from 'lucide-react'
import DonationModal from '../components/DonationModal'
import EmptyState from '../components/EmptyState'
import { formatAddress } from '../lib/utils'

const CharityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [charity, setCharity] = useState(CHARITIES.find((c) => c.id === id))
  const [activeTab, setActiveTab] = useState<'about' | 'impact' | 'financials' | 'updates'>('about')
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  useEffect(() => {
    // In a real app, you'd fetch this from an API or database
    const storedCharities = JSON.parse(localStorage.getItem('charities') || '[]')
    const foundCharity = storedCharities.find((c: any) => c.id === id) || CHARITIES.find((c) => c.id === id)
    setCharity(foundCharity)
  }, [id])

  if (!charity) {
    return (
      <EmptyState
        title="Charity Not Found"
        message="The charity you are looking for does not exist or has been removed."
        actionText="Back to Charities"
        onAction={() => window.history.back()}
      />
    )
  }

  const progress = (charity.raisedAmount / charity.targetAmount) * 100
  const formattedRaised = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(charity.raisedAmount)
  const formattedTarget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(charity.targetAmount)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <p className="text-gray-700 leading-relaxed">{charity.about}</p>
      case 'impact':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Our impact strategy focuses on <span className="font-semibold capitalize">{charity.impact}</span> results.
              We believe in creating lasting change through targeted interventions and community empowerment.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Specific examples of our work include: [Detailed impact metrics and stories would go here in a real application].
            </p>
          </div>
        )
      case 'financials':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We are committed to <span className="font-semibold capitalize">{charity.transparency}</span> financial transparency.
              {charity.financials}
            </p>
            <p className="text-gray-700 leading-relaxed">
              For detailed reports, please visit our official website or contact us directly.
            </p>
          </div>
        )
      case 'updates':
        return (
          <div className="space-y-4">
            {charity.updates.length > 0 ? (
              charity.updates.map((update, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 flex items-center mb-1">
                    <Clock size={16} className="mr-2" /> {update.date}
                  </p>
                  <p className="text-gray-700">{update.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No recent updates available.</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <Link to="/charities" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Charities
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Image and Quick Info */}
          <div className="lg:col-span-1">
            <img
              src={charity.imageUrl}
              alt={charity.name}
              className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
            />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{charity.name}</h1>
            <p className="text-gray-700 text-lg mb-6">{charity.description}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-600">
                <Tag size={20} className="mr-3 text-blue-500" />
                <span className="font-medium">Category:</span> <span className="ml-2">{charity.category}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-3 text-purple-500" />
                <span className="font-medium">Focus:</span> <span className="ml-2 capitalize">{charity.geography}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle size={20} className="mr-3 text-green-500" />
                <span className="font-medium">Status:</span> <span className="ml-2">{charity.verified ? 'Verified' : 'Unverified'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign size={20} className="mr-3 text-yellow-500" />
                <span className="font-medium">Blockchain Address:</span> <span className="ml-2 font-mono text-sm">{formatAddress(charity.address, 6)}</span>
              </div>
            </div>

            <div className="mb-8">
              <ProgressBar progress={progress} className="mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Raised: <span className="font-semibold">{formattedRaised}</span></span>
                <span>Target: <span className="font-semibold">{formattedTarget}</span></span>
              </div>
            </div>

            <Button
              onClick={() => setIsDonationModalOpen(true)}
              className="w-full bg-gradient-primary-to-blue text-white py-3 text-lg shadow-lg hover:opacity-90 transition-opacity duration-200"
            >
              <DollarSign size={24} className="mr-2" /> Donate Now
            </Button>
          </div>

          {/* Details Tabs */}
          <div className="lg:col-span-2">
            <div className="flex border-b border-gray-200 mb-6">
              <TabButton icon={Info} label="About" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
              <TabButton icon={BarChart} label="Impact" active={activeTab === 'impact'} onClick={() => setActiveTab('impact')} />
              <TabButton icon={FileText} label="Financials" active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} />
              <TabButton icon={Clock} label="Updates" active={activeTab === 'updates'} onClick={() => setActiveTab('updates')} />
            </div>
            <div className="prose max-w-none text-gray-700">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        charity={charity}
      />
    </div>
  )
}

interface TabButtonProps {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-lg font-medium transition-colors duration-200
      ${active
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
      }`}
  >
    <Icon size={20} className="mr-2" /> {label}
  </button>
)

export default CharityDetailsPage
