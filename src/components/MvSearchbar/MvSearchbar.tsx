// components/SearchBar.tsx
import { useState, useEffect, useCallback } from 'react';


interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const DEBOUNCE_DELAY = 300;

export const SearchBar = ({ onSearch, initialQuery = '' }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
      setIsTyping(false);
    }, DEBOUNCE_DELAY),
    [onSearch]
  );

  useEffect(() => {
    if (inputValue.trim() !== initialQuery) {
      setIsTyping(true);
      debouncedSearch(inputValue);
    }
  }, [inputValue, debouncedSearch, initialQuery]);

  return (
    <div className="mb-8 relative">
      <div className="flex gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for artistic inspiration..."
          className="flex items-center w-full border-2 rounded-4xl p-2 border-primary-400 dark:border-primary-dark-500 bg-white/90 dark:bg-secondary-dark-900  outline-none px-5 text-black dark:text-white"
        />
        {isTyping && (
          <div className="absolute right-24 top-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        )}
      </div>
      {inputValue && (
        <p className="mt-2 ml-4 text-gray-500 text-sm">
          {isTyping ? 'Searching for...' : 'Showing results for:'}{' '}
          <span className="font-medium">{inputValue}</span>
        </p>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}