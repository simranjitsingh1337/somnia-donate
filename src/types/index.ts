import { BigNumberish } from 'ethers'

export interface QuizQuestion {
  id: string
  question: string
  type: 'select' | 'multiselect' | 'range' // Extend as needed
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
}

export interface QuizAnswers {
  [questionId: string]: string | string[] | number | undefined
}

export interface Charity {
  id: string
  name: string
  category: string // e.g., 'Environment', 'Health', 'Education'
  description: string
  impact: 'direct' | 'systemic' | 'research' | 'community' // How impact is measured/focused
  geography: 'local' | 'national' | 'international'
  transparency: 'low' | 'medium' | 'high'
  size: 'small' | 'medium' | 'large' // Organization size
  verified: boolean // Whether the charity is verified by a third party
  imageUrl: string
  targetAmount: number // Target amount in ETH/STT
  raisedAmount: number // Raised amount in ETH/STT
  address: string // Ethereum address for donations
  about: string
  financials: string
  updates: { date: string; text: string }[] // Recent news or impact updates
}

export interface Donation {
  id: string
  charityId: string
  charityName: string
  donorAddress: string
  amount: number // Amount in ETH/STT
  timestamp: number // Unix timestamp
  txHash: string // Transaction hash
}

export interface CharityEvent {
  charityId: string;
  charityName: string;
  date: string;
  text: string;
}
