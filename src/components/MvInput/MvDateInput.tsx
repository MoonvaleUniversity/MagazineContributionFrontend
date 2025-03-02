import React from 'react';
import clsx from 'clsx';

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // Make label a required prop
  className?: string;
}

export const MvDateInput: React.FC<DateInputProps> = ({
  label,
  className,
  id,
  ...props
}) => {
  const baseClasses = 'w-full pt-4 px-3 pb-2 text-sm border-2 border-primary-600 text-primary-600 rounded-4xl focus:outline-none';
  const variantClasses = "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-500 dark:border-primary-dark-50 dark:text-primary-dark-200";

  const combinedClasses = clsx(
    baseClasses,
    className,
    variantClasses
  );

  return (
    <div className="relative">
      <input
        id={id}
        type="date"
        required
        autoComplete="off"
        placeholder=" "
        className={combinedClasses}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-0 text-xs text-primary-400 dark:text-primary-dark-300 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
};
