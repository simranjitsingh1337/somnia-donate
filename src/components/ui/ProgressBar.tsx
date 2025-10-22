import React from 'react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  progress: number // 0-100
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2.5 overflow-hidden', className)}>
      <div
        className="h-2.5 rounded-full bg-gradient-primary-to-blue transition-all duration-500 ease-out"
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar
