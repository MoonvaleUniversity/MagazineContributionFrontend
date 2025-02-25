import React from "react";
import clsx from "clsx";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export const MvCheckbox: React.FC<CheckboxProps> = ({ label, className, id, ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="checkbox"
        className={clsx(
          "appearance-none w-5 h-5 border-3 border-primary-500 dark:border-primary-dark-500 rounded-4xl checked:bg-accent-600  focus:outline-none cursor-pointer transition duration-200 ease-in-out",
          className
        )}
        {...props}
      />
      <label htmlFor={id} className="text-sm cursor-pointer ">
        {label}
      </label>
    </div>
  );
};