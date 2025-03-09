import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";

interface SearchFilterProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-between w-full max-w-11/12 mx-auto p-4 mb-4 rounded-2xl">
      <div className="flex items-center w-full max-w-lg border-2 rounded-full p-2">
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="w-full outline-none bg-transparent px-2"
        />
        <AiOutlineSearch className="w-6 h-6 text-gray-500" />
      </div>
      <button className="p-2">
        <AiOutlineFilter className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SearchFilter;
