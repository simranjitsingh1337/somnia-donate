import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Frown } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center p-8 animate-fadeInUp">
      <Frown size={96} className="text-gray-400 mb-8" />
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-700 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Button asChild className="bg-gradient-primary-to-blue text-white py-3 px-6 text-lg">
        <Link to="/">Go to Homepage</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
