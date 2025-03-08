import { useState } from "react";
import { FiBell, FiSearch } from "react-icons/fi";

import { MvButton } from "../../MvButton";

// Header Component for Marketing Coordinator (styled like student)
export const MvMarketingCoordinatorHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleLogout = () => {
    // Remove user-related data
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
  
    // Redirect to login page
    window.location.href = '/';
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 text-black dark:text-white border-b border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 transition-all duration-300 w-full z-20">
      <div className="relative ml-12 flex items-center w-full max-w-md max-sm:max-w-sm">
        <FiSearch className="absolute left-3 text-primary-900 font-bold" />
        <input
          type="text"
          className="font-semibold w-full py-2 pl-10 pr-4 bg-secondary-500 dark:bg-secondary-dark-400 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-dark-600"
          placeholder="Search Contribution..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative">
          <FiBell className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
                 <MvButton variant="primary" onClick={()=> {handleLogout()}} ><span className="">Logout</span></MvButton>
               
               </div>
      </div>
    </header>
  );
};
