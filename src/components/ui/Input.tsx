import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark
          placeholder:text-muted
          focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none
          transition-all
          ${className}
        `}
        {...props}
      />
    </div>
  );
};