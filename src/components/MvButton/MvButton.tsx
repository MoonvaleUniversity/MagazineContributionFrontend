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
        primary: "bg-primary-500 border-background-50 text-white hover:bg-primary-800  dark:text-primary-800 dark:bg-primary-dark-500 dark:border-background-dark-50 dark:hover:bg-primary-dark-300 hover:shadow-xl dark:shadow-primary-500/50",
        secondary: "bg-secondary-700 border-background-50 text-white hover:bg-secondary-800 dark:bg-secondary-dark-500 dark:border-background-dark-50 dark:hover:bg-secondary-dark-800 hover:shadow-xl dark:shadow-primary-500/50",
        accent: "bg-accent-800 border-background-50 font-bold text-white hover:bg-accent-900 dark:text-accent-900 dark:border-background-dark-50 dark:bg-accent-dark-500 dark:hover:bg-accent-dark-300 hover:shadow-xl dark:shadow-primary-500/50",  // Accent class
     };
  
    // Define size-specific classes
    const sizeClasses = {
      sm: "px-3 py-1 text-sm font-bold",
      md: "px-4 py-2 font-display-medium font-bold",
      lg: "px-5 py-3 text-lg font-bold",
    };
  
    const combinedClasses = clsx(
        baseClasses, variantClasses[variant],
        sizeClasses[size] , className
    );
  return (
    <button className={combinedClasses} {...props}>{children}</button>
  )
}
