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
                    ? 'bg-gradient-to-r from-primary to-secondary text-white border-secondary shadow-md' // Updated for neon theme
                    : 'bg-surface text-text border-border hover:border-secondary hover:shadow-sm' // Updated for neon theme
                  }`}
              >
                <span className="font-medium text-lg">{option.label}</span>
              </button>
            ))}
          </div>
        )
      // Add other question types (multiselect, range) if needed
      default:
        return <p className="text-text">Question type not supported.</p>; {/* Added semicolon here */}
    }
  }

  return (
    <div className="bg-surface p-8 rounded-xl shadow-card animate-fadeInUp"> {/* Updated for neon theme */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-text"> {/* Updated for neon theme */}
          {isQuizComplete ? 'Quiz Complete!' : `Question ${currentStep + 1} of ${totalSteps}`}
        </h2>
        <Button variant="ghost" size="sm" onClick={resetQuiz} className="text-textSecondary hover:text-error"> {/* Updated for neon theme */}
          <RefreshCcw size={18} className="mr-2" /> Reset Quiz
        </Button>
      </div>

      <ProgressBar progress={progress} className="mb-8" />

      {!isQuizComplete ? (
        <>
          <p className="text-xl text-text mb-8 font-semibold">{currentQuestion?.question}</p> {/* Updated for neon theme */}
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
          <p className="text-2xl font-semibold text-text mb-4"> {/* Updated for neon theme */}
            Thank you for completing the quiz!
          </p>
          <p className="text-lg text-textSecondary mb-8"> {/* Updated for neon theme */}
            We've used your preferences to find charities that align with your values.
          </p>
          <Button onClick={resetQuiz} className="bg-gradient-to-r from-primary to-secondary"> {/* Updated for neon theme */}
            <RefreshCcw size={20} className="mr-2" /> Retake Quiz
          </Button>
        </div>
      )}
    </div>
  )
}

export default QuizComponent
