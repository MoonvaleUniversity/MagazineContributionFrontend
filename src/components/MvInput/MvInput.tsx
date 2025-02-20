import React, { useState } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string; // Make label a required prop
    className?: string;
}

export const MvInput: React.FC<InputProps> = ({
  label,
  className,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const baseClasses = 'w-full p-4 text-base border-2 border-primary-600 text-primary-600 rounded-4xl focus:outline-none';
  const variantClasses = "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-700 dark:border-primary-dark-50 dark:text-primary-dark-200";


  const combinedClasses = clsx(
    baseClasses,
    className,
    variantClasses
  );

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setIsFilled(!!e.target.value);
  };

  return (
    <div className="relative my-5">
      <input
        id={id}
        type="text"
        required
        autoComplete="off"
        placeholder=" " // Placeholder for floating label
        className={combinedClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <label
        htmlFor={id}
        className={clsx(
          "absolute left-4 top-4 text-base text-primary-400 dark:text-primary-dark-300 transition-all duration-300 ease-in-out pointer-events-none",
          { 'transform -translate-y-4 scale-75': isFocused || isFilled } // Floating effect
        )}
      >
        {label}
      </label>
    </div>
  );
};