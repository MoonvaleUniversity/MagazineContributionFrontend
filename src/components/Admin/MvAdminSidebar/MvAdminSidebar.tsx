
import { useEffect, useState } from 'react';
import { MvButton } from '../../MvButton';
import { NavLink } from 'react-router-dom';
import MvRoutes from '../../../app/MvRoutes';
import {   FaChalkboardTeacher, FaRegCalendarAlt, FaUserCog } from 'react-icons/fa';
import {AiOutlineStop } from 'react-icons/ai';
import { FiX, FiMenu, FiChevronDown, FiLogOut, FiSettings, FiHome } from 'react-icons/fi';

interface MvAdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvAdminSidebar: React.FC<MvAdminSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')|| sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
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
      {/* Toggle Button for Small Screens */}
      <MvButton
        size="sm"
        className="fixed py-3 z-50 text-white transition-all left-2 rounded-4xl top-2 lg:hidden"
        variant="secondary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </MvButton>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 w-64 h-screen p-4 text-black dark:text-white border-r border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 dark:border-primary-dark-500 transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? 'transform-none' : 'max-lg:hidden'
        } lg:block`}
      >
        {/* Logo */}
        <div className="flex max-sm:items-end max-sm:justify-end justify-center mb-8 space-x-2">
          <span className="text-xl text-end font-bold">Moonvale University</span>
        </div>

       {/* Navigation Links */}
       <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-4 p-2 rounded-4xl ${
                  isActive
                    ? "bg-secondary-600 text-black font-bold"
                    : "text-primary-800 hover:bg-secondary-600 dark:text-secondary-dark-200 dark:hover:bg-secondary-dark-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Dropdown Section */}
        <div className="pt-4 mt-8 border-t border-primary-500 dark:border-primary-dark-500">
          <div
            className="flex items-center justify-between p-3 text-primary-800 dark:text-primary-dark-200 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>Settings</span>
            <FiChevronDown className={`text-primary-800 dark:text-primary-dark-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          {isDropdownOpen && (
            <div className="pl-4 text-primary-800 dark:text-primary-dark-200">
              <div className="p-2 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">General</div>
              <div className="p-2 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">Security</div>
              <div
                className="flex items-center p-2 space-x-2 text-red-500 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700 cursor-pointer"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-500 dark:border-primary-dark-500">
        <div className="flex items-center space-x-3">
            <img
              src="/src/Assets/images/404.jpeg"
              alt="Student avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{userData?.name || 'Unknown User'}</p>
              <p className="text-xs dark:text-primary-dark-200">{userData?.email || 'student@example.com'}</p>
            </div>
            <FiSettings className="ml-auto text-primary-700 dark:text-primary-dark-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
