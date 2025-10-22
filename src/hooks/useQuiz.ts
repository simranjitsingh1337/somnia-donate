import { useState, useCallback } from 'react'
import { QuizAnswers } from '../types'
import { QUIZ_QUESTIONS } from '../constants'

export const useQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    try {
      const storedAnswers = localStorage.getItem('quizAnswers')
      return storedAnswers ? JSON.parse(storedAnswers) : {}
    } catch (error) {
      console.error("Failed to parse quiz answers from localStorage", error)
      return {}
    }
  })
  const totalSteps = QUIZ_QUESTIONS.length

  const handleAnswer = useCallback((questionId: string, value: string | string[] | number) => {
    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers, [questionId]: value }
      localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
      return newAnswers
    })
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0))
  }, [])

  const resetQuiz = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    localStorage.removeItem('quizAnswers')
  }, [])

  const progress = (currentStep / totalSteps) * 100

  return {
    currentStep,
    answers,
    totalSteps,
    handleAnswer,
    nextStep,
    prevStep,
    resetQuiz,
    progress,
    isQuizComplete: currentStep === totalSteps,
  }
}
