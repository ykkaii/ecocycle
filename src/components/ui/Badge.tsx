import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'sage' | 'lime' | 'olive' | 'dark';
}

export const Badge = ({ children, variant = 'sage' }: BadgeProps) => {
  const variants = {
    sage: 'bg-sage-light text-sage-dark',
    lime: 'bg-lime/60 text-dark',
    olive: 'bg-olive/15 text-olive',
    dark: 'bg-dark text-white',
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-tight ${variants[variant]}`}
    >
      {children}
    </span>
  );
};