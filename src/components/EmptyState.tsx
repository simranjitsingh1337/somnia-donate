import React from 'react'
import { Frown } from 'lucide-react'
import Button from './ui/Button'

interface EmptyStateProps {
  title?: string
  message?: string
  actionText?: string
  onAction?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Results Found',
  message = 'We couldn\'t find any items matching your criteria. Try adjusting your filters or search terms.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-card text-center animate-fadeInUp">
      <Frown size={64} className="text-gray-400 mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="bg-gradient-primary-to-blue">
          {actionText}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
