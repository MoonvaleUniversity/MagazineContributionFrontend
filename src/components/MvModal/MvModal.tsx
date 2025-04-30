import React from "react";
import clsx from "clsx";

interface MvModelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export const MvModal: React.FC<MvModelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideCloseButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black/50">
      <div
        className={clsx(
          "bg-white dark:bg-secondary-dark-500 rounded-4xl shadow-lg p-6 w-full max-w-fit relative transition-all duration-300 max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-600 dark:text-primary-dark-50 hover:text-red-500"
          >
            &#10005;
          </button>
        )}
        <h2 className="mb-4 text-lg font-semibold text-primary-600 dark:text-primary-dark-50">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </div>
  );
};
