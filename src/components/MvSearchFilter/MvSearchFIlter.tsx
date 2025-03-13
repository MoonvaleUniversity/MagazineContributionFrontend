// components/SearchFilter.tsx
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export type Filter = {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
};

interface SearchFilterProps {
  placeholder: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filterName: string, value: string) => void;
  filters?: Filter[];
  className?: string;
}
const SearchFilter = ({ 
  onSearch, 
  onFilterChange = ()=>{},
  placeholder, 
  filters = [],
  className = "",
}: SearchFilterProps) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (filterName: string) => 
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange(filterName, e.target.value);
    };

  return (
    <div className={`flex flex-col items-center justify-between md:flex-row gap-4 mb-4 ${className}`}>
      <div className="flex items-center max-md:max-w-full w-full max-w-lg border-2 rounded-4xl p-2 border-primary-400 dark:border-primary-dark-500 bg-secondary-200 dark:bg-secondary-dark-900">
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          onChange={handleSearchChange}
          className="w-full outline-none bg-transparent px-2 text-black dark:text-white"
        />
        <AiOutlineSearch className="w-6 h-6  text-gray-500 dark:text-gray-400" />
      </div>
      
      {filters.map(filter => (
        <div key={filter.name} className="flex items-center gap-2">
          <label className="text-sm dark:text-white">{filter.label}:</label>
          <select
            onChange={handleFilterChange(filter.name)}
            className=" border-2 rounded-4xl p-2 border-primary-400 dark:border-primary-dark-500 bg-secondary-200 dark:bg-secondary-dark-900"
          >
            <option value="">All</option>
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default SearchFilter;