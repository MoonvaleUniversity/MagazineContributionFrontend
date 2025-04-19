
import { useEffect, useState } from 'react';
import { MvButton } from '../../MvButton';
import { NavLink } from 'react-router-dom';
import MvRoutes from '../../../app/MvRoutes';
import {   FaChalkboardTeacher, FaRegCalendarAlt, FaUserCog } from 'react-icons/fa';
import {AiOutlineStop } from 'react-icons/ai';
import { FiX, FiMenu, FiChevronDown, FiLogOut, FiSettings, FiHome} from 'react-icons/fi';
import { getUserData } from '../../../services/AuthService';
import clsx from 'clsx';

interface MvAdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvAdminSidebar: React.FC<MvAdminSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
   setUserData(getUserData())
  }, []);
  const navItems = [
    { icon: <FiHome/>, label: 'Dashboard', to: MvRoutes.ADMIN.DASHBOARD},
    { icon: <FaUserCog  />, label: 'User Management', to: MvRoutes.ADMIN.USERS},
    { icon: <FaChalkboardTeacher />, label: 'Faculty' , to:MvRoutes.ADMIN.FACULTY},
    { icon: <FaChalkboardTeacher />, label: 'Contributions' , to:MvRoutes.ADMIN.CONTRIBUTION},
    { icon: <FaRegCalendarAlt />, label: 'Academic Year', to:MvRoutes.ADMIN.ACADEMIC_YEAR },
    { icon: <AiOutlineStop />, label: 'Closure Dates', to:MvRoutes.ADMIN.CLOSURE_DATES },
  ];

  const handleLogout = () => {
    // Perform logout logic (e.g., clear local storage and redirect to login page)
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="relative">
    {/* Toggle Button */}
    <MvButton
      size="sm"
      className="fixed z-50 pt-2 text-white transition-all shadow-lg lg:hidden left-4 top-4 rounded-4xl "
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
    </MvButton>

    {/* Sidebar Container */}
    <div
      className={`fixed top-0 left-0 w-64 h-screen p-6 bg-gradient-to-b from-secondary-300 to-indigo-200 dark:from-secondary-dark-500 dark:to-gray-800 border-r border-indigo-100 dark:border-gray-700 shadow-xl transition-all duration-300 z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
            <FiSettings className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1.5">
        {navItems.map((item, index ,isActive) => (
         <NavLink
         key={index}
         to={item.to}
         className={({ isActive }) =>  // Destructure here
           clsx(
             "flex items-center space-x-4 p-3 rounded-2xl transition-all",
             "hover:bg-white hover:shadow-md dark:hover:bg-gray-800",
             isActive
               ? "bg-white shadow-md dark:bg-gray-800 text-indigo-600 dark:text-purple-400"
               : "text-gray-600 dark:text-gray-300"
           )
         }
       >
         <span className={clsx(
           "text-lg",
           // Use isActive from parent NavLink
           isActive 
             ? "text-indigo-500 dark:text-purple-400" 
             : "text-gray-400 dark:text-gray-500"
         )}>
           {item.icon}
         </span>
         <span className="text-sm font-medium">{item.label}</span>
       </NavLink>
        ))}
      </nav>

      {/* Settings Dropdown */}
      <div className="pt-6 mt-8 border-t  border-indigo-100 dark:border-gray-700">
        <div
          className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center space-x-3">
            <FiSettings className="w-5 h-5 text-indigo-500 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Settings</span>
          </div>
          <FiChevronDown className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {isDropdownOpen && (
          <div className="pl-9 mt-2 space-y-2 animate-fade-in">
            <NavLink to={MvRoutes.ADMIN.PROFILE_EDIT} className="flex items-center p-2 space-x-2 text-gray-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800">
              <FiSettings className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </NavLink>
           
            <div
              className="flex items-center p-2 space-x-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <FiLogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-indigo-100 dark:bg-gray-800 border-t border-indigo-100 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="/src/Assets/images/404.jpeg"
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 border-indigo-100 dark:border-gray-700"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {userData?.name || 'Administrator'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userData?.email || 'admin@example.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
