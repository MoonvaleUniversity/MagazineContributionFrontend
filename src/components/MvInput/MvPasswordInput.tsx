import React, { useState } from 'react';
import clsx from 'clsx';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string; 
    className?: string;
}

export const MvPasswordInput: React.FC<PasswordInputProps> = ({
  label,
  className,
  id,
  ...props
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (password != null) { setIsFilled(true); }
   
    console.log(newPassword); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseClasses = 'w-full p-4 text-base border-2 rounded-4xl focus:outline-none';

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
    <div className="relative my-4">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={password} // Bind the input value to the password state
        onChange={handlePasswordChange} // Update the password state on change
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
          "absolute left-3 top-4 text-base text-primary-400 dark:text-primary-dark-300 transition-all duration-300 ease-in-out pointer-events-none",
          { 'transform -translate-y-4 scale-75': isFocused || isFilled } // Floating effect
        )}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute text-primary-500 dark:text-primary-dark-200 right-3 top-4"
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};