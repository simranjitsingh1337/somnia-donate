import { useState, useCallback, useEffect } from 'react'
import { QuizAnswers, QuizQuestion } from '../types'
import { QUIZ_QUESTIONS as ALL_QUIZ_QUESTIONS } from '../constants' // Renamed import to avoid conflict

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]; // Create a shallow copy to avoid modifying the original
  let currentIndex = newArray.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

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
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])

  // Initialize or re-shuffle questions on mount or if localStorage is empty
  useEffect(() => {
    const storedShuffledQuestions = localStorage.getItem('shuffledQuizQuestions');
    if (storedShuffledQuestions) {
      setShuffledQuestions(JSON.parse(storedShuffledQuestions));
    } else {
      const newShuffled = shuffleArray([...ALL_QUIZ_QUESTIONS]);
      setShuffledQuestions(newShuffled);
      localStorage.setItem('shuffledQuizQuestions', JSON.stringify(newShuffled));
    }
  }, []); // Run once on mount

  const totalSteps = shuffledQuestions.length

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
    localStorage.removeItem('shuffledQuizQuestions') // Clear shuffled questions
    const newShuffled = shuffleArray([...ALL_QUIZ_QUESTIONS]); // Re-shuffle
    setShuffledQuestions(newShuffled);
    localStorage.setItem('shuffledQuizQuestions', JSON.stringify(newShuffled));
  }, [])

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0; // Handle division by zero

  return {
    questions: shuffledQuestions, // Return shuffled questions
    currentStep,
    answers,
    totalSteps,
    handleAnswer,
    nextStep,
    prevStep,
    resetQuiz,
    progress,
    isQuizComplete: currentStep === totalSteps && totalSteps > 0, // Ensure totalSteps > 0
  }
}
