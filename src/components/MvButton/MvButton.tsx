import React from 'react'
import clsx from "clsx";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant? : "primary" | "secondary" | "accent";
    size? : "sm" | "md" | "lg";
    className?: string;
}

export const MvButton: React.FC<ButtonProps> = ({ variant="primary",className, size="md",children , ...props}) => {
    const baseClasses = "font-semibold rounded-4xl border-2 transition duration-150 focus:outline-none";
  
    //Define colors according to variants
    const variantClasses = {
        primary: "bg-primary-500 border-background-50 text-white hover:bg-primary-600  dark:text-primary-800 border- dark:bg-primary-dark-500 dark:border-background-dark-50 dark:hover:bg-primary-dark-600",
        secondary: "bg-secondary-500 border-background-50 text-white hover:bg-secondary-600 dark:bg-secondary-dark-500 dark:border-background-dark-50 dark:hover:bg-secondary-dark-600",
        accent: "bg-accent-500 border-background-50 text-white hover:bg-accent-600 dark:text-accent-900 dark:border-background-dark-50 dark:bg-accent-dark-500 dark:hover:bg-accent-dark-600",  // Accent class
     };
  
    // Define size-specific classes
    const sizeClasses = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };
  
    const combinedClasses = clsx(
        baseClasses, variantClasses[variant],
        sizeClasses[size] , className
    );
  return (
    <button className={combinedClasses} {...props}>{children}</button>
  )
}
