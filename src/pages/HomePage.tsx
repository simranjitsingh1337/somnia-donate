import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import QuizComponent from '../components/QuizComponent'
import CharityCard from '../components/CharityCard'
import { useQuiz } from '../hooks/useQuiz'
import { useCharityMatching } from '../hooks/useCharityMatching'
import { CHARITIES } from '../constants'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import EmptyState from '../components/EmptyState'

const HomePage: React.FC = () => {
  const { currentStep, answers, totalSteps, handleAnswer, nextStep, prevStep, resetQuiz, progress, isQuizComplete } = useQuiz()
  const matchedCharities = useCharityMatching(CHARITIES, answers)
  const [displayedCharities, setDisplayedCharities] = useState(CHARITIES.slice(0, 3)) // Default to first 3 if no quiz answers

  useEffect(() => {
    if (isQuizComplete && matchedCharities.length > 0) {
      setDisplayedCharities(matchedCharities.slice(0, 3)) // Show top 3 matched charities
    } else if (!isQuizComplete && Object.keys(answers).length === 0) {
      setDisplayedCharities(CHARITIES.slice(0, 3)) // Show some default charities if quiz not started
    } else if (isQuizComplete && matchedCharities.length === 0) {
      setDisplayedCharities([]) // No matches
    }
  }, [isQuizComplete, matchedCharities, answers])

  return (
    <div className="space-y-16">
      <Hero />

      <section className="py-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10 animate-fadeInUp">
          Find Your Perfect Match
        </h2>
        <QuizComponent
          questions={CHARITIES.map(c => ({ id: c.id, question: c.name, type: 'select' }))} // Dummy questions for QuizComponent type
          currentStep={currentStep}
          answers={answers}
          totalSteps={totalSteps}
          handleAnswer={handleAnswer}
          nextStep={nextStep}
          prevStep={prevStep}
          resetQuiz={resetQuiz}
          progress={progress}
          isQuizComplete={isQuizComplete}
        />
      </section>

      <section className="py-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10 animate-fadeInUp">
          {isQuizComplete ? 'Top Matched Charities' : 'Featured Charities'}
        </h2>
        {displayedCharities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCharities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Matches Yet!"
            message="Complete the quiz to find charities tailored to your preferences, or browse all charities."
            actionText="Browse All Charities"
            onAction={() => window.location.href = '/charities'}
          />
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link to="/charities">
              View All Charities <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
