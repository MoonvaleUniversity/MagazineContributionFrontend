import React from "react";
import { AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";

const SearchFilter: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-full max-w-11/12 mx-auto p-4 mb-4 rounded-2xl ">
      <div className="flex items-center w-full max-w-lg dark:border-primary-dark-500 border-primary-500 border-2 rounded-full p-2">
        <input 
          type="text" 
          placeholder="Search articles" 
          className="w-full outline-none bg-transparent px-2 text-primary-700 dark:text-primary-dark-300"
        />
        <button className="p-2 bg-primary-500 dark:bg-primary-dark-500 rounded-full">
          <AiOutlineSearch className="w-6 h-6 text-purple-50 dark:text-purple-950" />
        </button>
      </div>
      <button className="p-2">
        <AiOutlineFilter className="w-6 h-6 text-primary-600 dark:text-primary-dark-300" />
      </button>
    </div>
  );
};

export default SearchFilter;
