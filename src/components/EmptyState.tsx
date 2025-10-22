import React from 'react';
import Button from './ui/Button'; // Assuming Button component exists

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  small?: boolean; // New prop for compact display
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actionText, onAction, small = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${small ? 'py-6 px-4' : 'py-16 px-6'} bg-surface rounded-xl border border-border shadow-card animate-fadeInUp`}>
      <h3 className={`font-bold ${small ? 'text-xl' : 'text-2xl'} text-text mb-3`}>{title}</h3>
      <p className={`${small ? 'text-sm' : 'text-base'} text-textSecondary mb-6 max-w-md`}>{message}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className={small ? 'text-sm px-4 py-2' : ''}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
