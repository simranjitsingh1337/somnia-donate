export interface Charity {
  id: string
  name: string
  category: string
  description: string
  impact: string // e.g., 'direct', 'systemic', 'research', 'community'
  geography: string // e.g., 'local', 'national', 'international'
  transparency: string // e.g., 'high', 'medium', 'low'
  size: string // e.g., 'small', 'medium', 'large', 'any'
  verified: boolean
  imageUrl: string
  targetAmount: number
  raisedAmount: number
  address: string // Ethereum address for donations
  about: string
  financials: string
  updates: { date: string; text: string }[]
  matchScore?: number // Added for AI matching
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'select' | 'multiselect' | 'range' // Extend as needed
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
}

export interface QuizAnswers {
  [key: string]: string | string[] | number
}

export interface Donation {
  id: string
  charityId: string
  charityName: string
  donorAddress: string
  amount: number
  timestamp: number
  txHash: string
}

export interface Web3ContextType {
  provider: any | null
  signer: any | null
  address: string | null
  balance: string | null
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: string) => Promise<boolean>
  loading: boolean
  error: string | null
}
