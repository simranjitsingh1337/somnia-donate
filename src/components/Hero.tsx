import React from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/Button'
import { Handshake, Heart, Globe, LayoutDashboard } from 'lucide-react'
import { CHARITIES } from '../constants'

const Hero: React.FC = () => {
  // Calculate some mock statistics
  const totalCharities = CHARITIES.length
  const totalRaised = CHARITIES.reduce((sum, charity) => sum + charity.raisedAmount, 0)
  const totalTarget = CHARITIES.reduce((sum, charity) => sum + charity.targetAmount, 0)
  const totalDonors = 12345; // Mock number
  const totalDonations = 67890; // Mock number

  return (
    <section className="relative bg-gradient-hero-neon text-text py-20 md:py-32 rounded-2xl shadow-neon-glow-lg shadow-primary overflow-hidden animate-fadeInUp">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-neon-glow animate-neon-pulse" style={{ '--tw-shadow-color': 'var(--tw-colors-secondary)' } as React.CSSProperties}>
          Empowering Change, Together.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90 text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-accent)' } as React.CSSProperties}>
          Discover and support verified charities on the Somnia Testnet. Our AI matches you with causes that truly matter to you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Button asChild size="lg" className="px-8 bg-primary text-white hover:bg-primary/90 shadow-neon-glow shadow-primary animate-slideInLeft">
            <Link to="/charities">
              <Handshake className="mr-2" size={24} />
              Browse Charities
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 border-secondary text-secondary hover:bg-secondary/10 hover:text-white shadow-neon-glow shadow-secondary animate-slideInRight">
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2" size={24} />
              My Donations
            </Link>
          </Button>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
          <div className="bg-surface bg-opacity-70 backdrop-blur-sm p-6 rounded-2xl shadow-neon-glow shadow-glow-primary border border-primary/50 animate-slideInLeft animate-border-pulse" style={{ '--tw-shadow-color': 'var(--tw-colors-primary)' } as React.CSSProperties}>
            <Heart size={40} className="text-accent mb-3 mx-auto text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-accent)' } as React.CSSProperties} />
            <h3 className="text-3xl font-bold mb-1 text-primary text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-primary)' } as React.CSSProperties}>{totalDonors.toLocaleString()}</h3>
            <p className="text-textSecondary">Total Donors</p>
          </div>
          <div className="bg-surface bg-opacity-70 backdrop-blur-sm p-6 rounded-2xl shadow-neon-glow shadow-glow-secondary border border-secondary/50 animate-fadeInUp animation-delay-200 animate-border-pulse" style={{ '--tw-shadow-color': 'var(--tw-colors-secondary)' } as React.CSSProperties}>
            <Globe size={40} className="text-secondary mb-3 mx-auto text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-secondary)' } as React.CSSProperties} />
            <h3 className="text-3xl font-bold mb-1 text-secondary text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-secondary)' } as React.CSSProperties}>{totalCharities.toLocaleString()}</h3>
            <p className="text-textSecondary">Charities Supported</p>
          </div>
          <div className="bg-surface bg-opacity-70 backdrop-blur-sm p-6 rounded-2xl shadow-neon-glow shadow-glow-accent border border-accent/50 animate-slideInRight animate-border-pulse" style={{ '--tw-shadow-color': 'var(--tw-colors-accent)' } as React.CSSProperties}>
            <Handshake size={40} className="text-primary mb-3 mx-auto text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-primary)' } as React.CSSProperties} />
            <h3 className="text-3xl font-bold mb-1 text-accent text-neon-glow" style={{ '--tw-shadow-color': 'var(--tw-colors-accent)' } as React.CSSProperties}>{totalDonations.toLocaleString()}</h3>
            <p className="text-textSecondary">Total Donations</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
