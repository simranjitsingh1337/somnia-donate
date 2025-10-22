import { useMemo } from 'react'
import { Charity, QuizAnswers } from '../types'

// Weights for the matching algorithm
const WEIGHTS = {
  category: 0.40,
  budget: 0.20,
  impact: 0.15,
  geography: 0.10,
  transparency: 0.10,
  size: 0.05,
}

// Helper to normalize budget values for scoring
const BUDGET_SCORES: { [key: string]: number } = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  very_high: 1.0,
}

export const useCharityMatching = (charities: Charity[], quizAnswers: QuizAnswers) => {
  const matchedCharities = useMemo(() => {
    if (Object.keys(quizAnswers).length === 0) {
      return charities.map(charity => ({ ...charity, matchScore: 0 }))
    }

    return charities.map(charity => {
      let score = 0

      // 1. Category (40%)
      if (quizAnswers.category && charity.category === quizAnswers.category) {
        score += WEIGHTS.category
      }

      // 2. Budget (20%) - This is a bit abstract, assuming higher budget preference matches larger charities or those with higher targets
      // For simplicity, we'll match budget preference to charity size or target amount.
      // A more sophisticated approach might involve comparing user's typical donation to charity's average donation or funding needs.
      // Here, we'll use a simplified mapping:
      if (quizAnswers.budget) {
        const userBudgetScore = BUDGET_SCORES[quizAnswers.budget as string] || 0
        const charitySizeScore = BUDGET_SCORES[charity.size] || 0 // Reusing budget scores for charity size
        // If user prefers 'high' budget, they might prefer 'large' charities.
        // This is a simple linear match, could be improved.
        score += WEIGHTS.budget * (1 - Math.abs(userBudgetScore - charitySizeScore))
      }


      // 3. Impact (15%)
      if (quizAnswers.impact && charity.impact === quizAnswers.impact) {
        score += WEIGHTS.impact
      }

      // 4. Geography (10%)
      if (quizAnswers.geography && charity.geography === quizAnswers.geography) {
        score += WEIGHTS.geography
      }

      // 5. Transparency (10%)
      if (quizAnswers.transparency && charity.transparency === quizAnswers.transparency) {
        score += WEIGHTS.transparency
      }

      // 6. Size (5%)
      if (quizAnswers.size && (quizAnswers.size === 'any' || charity.size === quizAnswers.size)) {
        score += WEIGHTS.size
      } else if (quizAnswers.size === 'large' && charity.size === 'medium') {
        score += WEIGHTS.size * 0.5; // Partial match
      } else if (quizAnswers.size === 'small' && charity.size === 'medium') {
        score += WEIGHTS.size * 0.5; // Partial match
      }


      // Normalize score to 0-100
      const normalizedScore = Math.round(score * 100)
      return { ...charity, matchScore: normalizedScore }
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)) // Sort by match score descending
  }, [charities, quizAnswers])

  return matchedCharities
}
