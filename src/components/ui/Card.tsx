import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = true }: CardProps) => {
  return (
    <div
      className={`
        bg-surface rounded-card border border-line p-6
        ${hover
          ? 'transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5 hover:border-sage-light'
          : 'shadow-soft'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};