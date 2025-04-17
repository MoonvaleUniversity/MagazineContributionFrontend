import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MvButton: React.FC<ButtonProps> = ({ 
  variant = "primary",
  className, 
  size = "md",
  children,
  disabled,
  ...props
}) => {
  const baseClasses = clsx(
      "font-semibold rounded-2xl border transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      
  );

  // Variant styles with Tailwind's built-in colors
  const variantClasses = clsx({
      // Primary (Indigo)
      'bg-gradient-to-r from-primary-600 to-indigo-800 text-white':
          variant === 'primary' && !disabled,
      'hover:from-primary-700 hover:to-indigo-900':
          variant === 'primary' && !disabled,
      'dark:from-indigo-700 dark:to-primary-dark-800 dark:hover:from-indigo-500 dark:hover:text-black dark:hover:to-primary-dark-300':
          variant === 'primary' && !disabled,

      // Secondary (Slate)
      'bg-gradient-to-r from-slate-600 to-secondary-700 text-white':
          variant === 'secondary' && !disabled,
      'hover:from-secondary-700 hover:to-slate-800':
          variant === 'secondary' && !disabled,
      'dark:from-secondary-dark-300 dark:to-slate-700 dark:hover:from-slate-800 dark:hover:to-slate-900':
          variant === 'secondary' && !disabled,

      // Accent (Emerald)
      'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white':
          variant === 'accent' && !disabled,
      'hover:from-emerald-700 hover:to-emerald-800':
          variant === 'accent' && !disabled,
      'dark:from-emerald-700 dark:to-emerald-800 dark:hover:from-emerald-800 dark:hover:to-emerald-900':
          variant === 'accent' && !disabled,

      // Disabled state gradients
      'bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700':
          disabled && variant === 'secondary',
      'bg-gradient-to-r from-indigo-300 to-indigo-400 dark:from-indigo-600 dark:to-indigo-700':
          disabled && variant === 'primary',
      'bg-gradient-to-r from-emerald-300 to-emerald-400 dark:from-emerald-600 dark:to-emerald-700':
          disabled && variant === 'accent',
  });

  // Size classes
  const sizeClasses = clsx({
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
  });

  const combinedClasses = clsx(
      baseClasses,
      variantClasses,
      sizeClasses,
      className
  );

  return (
      <button 
          className={combinedClasses} 
          disabled={disabled}
          {...props}
      >
          <span className="inline-block transform transition-transform">
              {children}
          </span>
      </button>
  );
};