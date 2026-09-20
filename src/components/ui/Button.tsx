import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-sage text-white hover:bg-sage-dark shadow-soft hover:shadow-hover',
    secondary: 'bg-dark text-white hover:bg-opacity-90',
    outline: 'border border-line bg-white text-dark hover:border-sage hover:text-sage',
    ghost: 'text-text hover:bg-sage-light hover:text-dark',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};