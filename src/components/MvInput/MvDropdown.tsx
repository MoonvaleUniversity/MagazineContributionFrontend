import clsx from "clsx";
import { ChangeEvent } from "react";

interface DropdownProps {
  options: Array<{ value: string | number; label: string }>;
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  name?: string;
  id?: string;
  required?: boolean;
}

export const MvDropdown: React.FC<DropdownProps> = ({
  options,
  className,
  id,
  placeholder = "Select Option",
  value,
  onChange,
  name,
  required,
}) => {
  const baseClasses = 'w-full pt-4 px-3 pb-2 text-sm border-2 border-primary-600 text-primary-600 rounded-4xl focus:outline-none';
  const variantClasses = "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-500 dark:border-primary-dark-50 dark:text-primary-dark-200";

  const combinedClasses = clsx(
    baseClasses,
    className,
    variantClasses,
    "appearance-none"
  );

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // Preserve numeric values if options contain numbers
    const numericValue = options.some(opt => typeof opt.value === "number")
      ? !isNaN(Number(selectedValue)) ? Number(selectedValue) : selectedValue
      : selectedValue;
      
    onChange?.(numericValue);
  };

  return (
    <div className="relative">
      <select
        id={id}
        className={combinedClasses}
        value={value}
        onChange={handleChange}
        name={name}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-2 transform">
        <svg className="h-5 w-5 text-primary-600 dark:text-primary-dark-200" 
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};