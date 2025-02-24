import React, { useState } from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string; // Required label prop
    className?: string;
}

export const MvTextarea: React.FC<TextareaProps> = ({
  label,
  className,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const baseClasses = 'w-full pt-5 px-3 pb-2 text-sm border-2 border-primary-600 text-primary-600 rounded-4xl focus:outline-none resize-y min-h-[100px]';
  const variantClasses = "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-500 dark:border-primary-dark-50 dark:text-primary-dark-200";

  const combinedClasses = clsx(
    baseClasses,
    className,
    variantClasses
  );

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setIsFilled(!!e.target.value);
  };

  return (
    <div className="relative">
      <textarea
        id={id}
        required
        autoComplete="off"
        placeholder=" "
        className={combinedClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <label
        htmlFor={id}
        className={clsx(
          "absolute left-4 top-4 text-sm text-primary-400 dark:text-primary-dark-300 transition-all duration-300 ease-in-out pointer-events-none",
          { 
            'transform -translate-y-3 scale-75': isFocused || isFilled,
            'top-2': isFocused || isFilled
          }
        )}
      >
        {label}
      </label>
    </div>
  );
};