import React, { useState } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    className?: string;
}

export const MvInput: React.FC<InputProps> = ({
  label,
  className,
  id,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const baseClasses = 'w-full pt-4 px-3 pb-2 text-sm border-2 rounded-4xl focus:outline-none transition-colors duration-300';
  const variantClasses = clsx(
    'bg-background-50 border-primary-600 text-primary-600',
    'dark:bg-secondary-dark-500 dark:border-primary-dark-50 dark:text-primary-dark-200',
    {
      'opacity-50 cursor-not-allowed': disabled,
      'border-gray-300 dark:border-gray-600': disabled,
      'bg-gray-100 dark:bg-gray-700': disabled
    }
  );

  const combinedClasses = clsx(
    baseClasses,
    className,
    variantClasses
  );
  
  const handleFocus = () => {
    if (!disabled) setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!disabled) {
      setIsFocused(false);
      setIsFilled(!!e.target.value);
    }
  };
  
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        required
        autoComplete="off"
        placeholder=" "
        disabled={disabled}
        className={combinedClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <label
        htmlFor={id}
        className={clsx(
          "absolute left-4 top-3 text-sm transition-all duration-300 ease-in-out pointer-events-none",
          "text-primary-400 dark:text-primary-dark-300",
          {
            'transform -translate-y-3 scale-75': isFocused || isFilled,
            'text-gray-400 dark:text-gray-500': disabled
          }
        )}
      >
        {label}
      </label>
    </div>
  );
};