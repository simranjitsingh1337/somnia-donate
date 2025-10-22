import React, { useEffect, useState, useMemo, useRef } from 'react'
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
import { CharityEvent } from '../types' // Import the new type

const HomePage: React.FC = () => {
  const { questions, currentStep, answers, totalSteps, handleAnswer, nextStep, prevStep, resetQuiz, progress, isQuizComplete } = useQuiz()
  const matchedCharities = useCharityMatching(CHARITIES, answers)
  const [displayedCharities, setDisplayedCharities] = useState(CHARITIES.slice(0, 3)) // Default to first 3 if no quiz answers

  // Ref for the target section
  const matchedCharitiesRef = useRef<HTMLDivElement>(null);

  // New logic to extract and sort recent events from matched charities
  const recentEvents = useMemo(() => {
    if (!isQuizComplete || matchedCharities.length === 0) return [];

    const allEvents: CharityEvent[] = [];
    // Take events from top 3 matched charities
    matchedCharities.slice(0, 3).forEach(charity => {
      charity.updates.forEach(update => {
        allEvents.push({
          charityId: charity.id,
          charityName: charity.name,
          date: update.date,
          text: update.text,
        });
      });
    });

    // Sort by date descending and take top 5
    return allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [isQuizComplete, matchedCharities]);

  useEffect(() => {
    if (isQuizComplete && matchedCharities.length > 0) {
      setDisplayedCharities(matchedCharities.slice(0, 3)) // Show top 3 matched charities
    } else if (!isQuizComplete && Object.keys(answers).length === 0) {
      setDisplayedCharities(CHARITIES.slice(0, 3)) // Show some default charities if quiz not started
    } else if (isQuizComplete && matchedCharities.length === 0) {
      setDisplayedCharities([]) // No matches
    }
  }, [isQuizComplete, matchedCharities, answers])

  // Scroll to "Top Matched Charities" section when quiz is complete
  useEffect(() => {
    if (isQuizComplete && matchedCharitiesRef.current) {
      matchedCharitiesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isQuizComplete]);

  return (
    <div className="space-y-16">
      <Hero />

      <section className="py-12">
        <h2 className="text-4xl font-bold text-center text-text mb-10 animate-fadeInUp"> {/* Updated for neon theme */}
          Find Your Perfect Match
        </h2>
        <QuizComponent
          questions={questions} // Pass the shuffled questions from useQuiz
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

      <section ref={matchedCharitiesRef} id="top-matched-charities" className="py-12"> {/* Added ref and id */}
        <h2 className="text-4xl font-bold text-center text-text mb-10 animate-fadeInUp"> {/* Updated for neon theme */}
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

        {/* New section for recent events from matched charities */}
        {isQuizComplete && recentEvents.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center text-text mb-8 animate-fadeInUp">
              Recent Impact from Your Top Matches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event, index) => (
                <div key={index} className="bg-surface p-6 rounded-xl shadow-card border border-border hover:border-secondary transition-all duration-300">
                  <p className="text-sm text-textSecondary mb-2">{new Date(event.date).toLocaleDateString()}</p>
                  <h4 className="text-xl font-semibold text-primary mb-2">{event.charityName}</h4>
                  <p className="text-text leading-relaxed">{event.text}</p>
                  <Link to={`/charities/${event.charityId}`} className="text-secondary hover:underline mt-4 inline-block text-sm">
                    View Charity <ArrowRight size={16} className="inline-block ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="px-16 border-secondary text-secondary hover:bg-primary/10"> {/* Updated for neon theme */}
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
