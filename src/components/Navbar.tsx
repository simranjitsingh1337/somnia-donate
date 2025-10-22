import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Wallet, Menu, X, Handshake, LayoutDashboard } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context'
import { formatAddress, formatBalance, getChainName } from '../lib/utils'
import Button from './ui/Button'
import { SOMNIA_TESTNET_CONFIG } from '../constants'

const Navbar: React.FC = () => {
  const { address, balance, chainId, connectWallet, disconnectWallet, switchNetwork, loading } = useWeb3()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleConnect = async () => {
    await connectWallet()
    setIsMobileMenuOpen(false)
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setIsMobileMenuOpen(false)
  }

  const handleSwitchToSomnia = async () => {
    if (chainId !== parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16)) {
      await switchNetwork(SOMNIA_TESTNET_CONFIG.chainId)
    }
  }

  const navLinks = [
    { name: 'Charities', path: '/charities', icon: Handshake },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ]

  return (
    <nav className="bg-surface bg-opacity-80 backdrop-blur-md sticky top-0 z-40 border-b border-border shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-text-gradient-primary-to-secondary animate-neon-pulse" style={{ '--tw-shadow-color': 'var(--tw-colors-primary)' } as React.CSSProperties}>
          <Handshake className="text-primary" size={32} />
          <span className="hidden sm:inline text-gradient-primary-to-secondary">SomniaDonate</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4"> {/* Adjusted space-x for better visual balance with new padding */}
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
            >
              {({ isActive }) => (
                <span
                  className={`text-lg font-medium transition-colors duration-200 relative group px-4 py-2 rounded-lg ${ /* Added padding and rounded corners */
                    isActive ? 'text-primary bg-primary/10' : 'text-text hover:text-primary hover:bg-surface/50' /* Brighter inactive text, subtle hover background */
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Wallet Connection & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {address ? (
            <div className="flex items-center space-x-2 bg-surface rounded-xl px-3 py-2 text-sm font-medium text-text shadow-neon-glow-sm shadow-glow-primary border border-border">
              <Wallet size={18} className="text-secondary" />
              <span className="hidden sm:inline">{formatAddress(address)}</span>
              <span className="hidden sm:inline">| {formatBalance(balance)} SOM</span>
              <span className="hidden lg:inline">| {getChainName(chainId)}</span>
              {chainId !== parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSwitchToSomnia}
                  className="ml-2 bg-warning/20 text-warning hover:bg-warning/30 shadow-neon-glow-sm shadow-warning"
                >
                  Switch to Somnia
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-error hover:bg-error/10 shadow-neon-glow-sm shadow-error">
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnect} isLoading={loading} className="animate-fadeInUp shadow-neon-glow-sm shadow-primary">
              <Wallet size={20} className="mr-2" />
              Connect Wallet
            </Button>
          )}

          <button
            className="md:hidden text-textSecondary hover:text-primary transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border py-4 px-4 animate-fadeInUp">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {({ isActive }) => (
                  <span
                    className={`flex items-center space-x-2 text-lg font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 ${ /* Increased mobile padding */
                      isActive ? 'bg-primary/20 text-primary shadow-neon-glow-sm shadow-primary' : 'text-text hover:bg-surface/50' /* Brighter inactive text */
                    }`}
                  >
                    <link.icon size={20} />
                    <span>{link.name}</span>
                  </span>
                )}
              </NavLink>
            ))}
            {address && (
              <div className="mt-4 pt-4 border-t border-border flex flex-col space-y-2 text-sm text-textSecondary">
                <p className="flex items-center space-x-2 text-primary">
                  <Wallet size={16} className="text-secondary" />
                  <span>{formatAddress(address, 6)}</span>
                </p>
                <p>Balance: <span className="text-text">{formatBalance(balance)} SOM</span></p>
                <p>Network: <span className="text-text">{getChainName(chainId)}</span></p>
                {chainId !== parseInt(SOMNIA_TESTNET_CONFIG.chainId, 16) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSwitchToSomnia}
                    className="mt-2 bg-warning/20 text-warning hover:bg-warning/30 shadow-neon-glow-sm shadow-warning"
                  >
                    Switch to Somnia
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-error hover:bg-error/10 mt-2 shadow-neon-glow-sm shadow-error">
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
