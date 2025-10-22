import React from 'react'
import Button from './ui/Button'
import ProgressBar from './ui/ProgressBar'
import { QuizQuestion, QuizAnswers } from '../types'
import { ArrowLeft, ArrowRight, RefreshCcw } from 'lucide-react'

interface QuizComponentProps {
  questions: QuizQuestion[]
  currentStep: number
  answers: QuizAnswers
  totalSteps: number
  handleAnswer: (questionId: string, value: string | string[] | number) => void
  nextStep: () => void
  prevStep: () => void
  resetQuiz: () => void
  progress: number
  isQuizComplete: boolean
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  currentStep,
  answers,
  totalSteps,
  handleAnswer,
  nextStep,
  prevStep,
  resetQuiz,
  progress,
  isQuizComplete,
}) => {
  const currentQuestion = questions[currentStep]

  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case 'select':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${answers[currentQuestion.id] === option.value
                    ? 'bg-gradient-primary-to-blue text-white border-blue-500 shadow-md'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
              >
                <span className="font-medium text-lg">{option.label}</span>
              </button>
            ))}
          </div>
        )
      // Add other question types (multiselect, range) if needed
      default:
        return <p>Question type not supported.</p>
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-card animate-fadeInUp">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {isQuizComplete ? 'Quiz Complete!' : `Question ${currentStep + 1} of ${totalSteps}`}
        </h2>
        <Button variant="ghost" size="sm" onClick={resetQuiz} className="text-gray-500 hover:text-red-500">
          <RefreshCcw size={18} className="mr-2" /> Reset Quiz
        </Button>
      </div>

      <ProgressBar progress={progress} className="mb-8" />

      {!isQuizComplete ? (
        <>
          <p className="text-xl text-gray-700 mb-8 font-semibold">{currentQuestion?.question}</p>
          {renderQuestion()}

          <div className="flex justify-between mt-8">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" /> Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!answers[currentQuestion?.id]}
              className="flex items-center"
            >
              {currentStep === totalSteps - 1 ? 'Finish Quiz' : 'Next'} <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            Thank you for completing the quiz!
          </p>
          <p className="text-lg text-gray-600 mb-8">
            We've used your preferences to find charities that align with your values.
          </p>
          <Button onClick={resetQuiz} className="bg-gradient-primary-to-blue">
            <RefreshCcw size={20} className="mr-2" /> Retake Quiz
          </Button>
        </div>
      )}
    </div>
  )
}

export default QuizComponent
