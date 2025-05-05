import { useEffect, useState } from 'react';
import { MvButton } from '../../MvButton';
import { NavLink } from 'react-router-dom';
import MvRoutes from '../../../app/MvRoutes';
import { 
  FiHome, 
  FiFileText, 
  FiCheckCircle, 
  FiUser, 
  FiUsers, 
  FiChevronDown, 
  FiMenu, 
  FiX,
  FiSettings,
  FiBook,
  
  
} from 'react-icons/fi';
import { getUserData } from '../../../services/AuthService';
import { getFacultyById } from '../../../services/FacultyService';
import { IFaculty } from '../../../app/MvObjects/faculty';
import { IUser } from '../../../app/Types/objects/user';
import clsx from 'clsx';
import { FaGrinStars } from 'react-icons/fa';

import UserLastLogin from '../../../pages/Admin/UserLastLogin';


interface MarketingCoordinatorSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvMarketingCoordinatorSidebar: React.FC<MarketingCoordinatorSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [facultyData, setFacultyData] = useState<IFaculty | null>(null);

  useEffect(() => {
    const fetchFacultyData = async () => {
      const user = getUserData();
      setUserData(user);
      if (user?.faculty_id) {
        const faculty = await getFacultyById(user.faculty_id);
        setFacultyData(faculty);
      }
    };
    fetchFacultyData();
  }, []);

  const navItems = [
    { icon: <FiHome />, label: "Dashboard", to: MvRoutes.MARKET_COORDINATOR.DASHBOARD },
    { icon: <FiFileText />, label: "Submissions", to: MvRoutes.MARKET_COORDINATOR.CONTRIBUTIONS },
    { icon: <FiCheckCircle />, label: "Students", to: MvRoutes.MARKET_COORDINATOR.STUDENTS },
    { icon: <FiUsers />, label: "Guest Approvals", to: MvRoutes.MARKET_COORDINATOR.GUEST },
    { icon: <FaGrinStars />, label: 'Explore Contributions', to: MvRoutes.PUBLIC_CONTRIBUTION },
  
  ];

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <MvButton
        size="sm"
        className="fixed z-50 pt-2 text-white transition-all shadow-lg lg:hidden left-4 top-4 rounded-4xl bg-yellow-500 hover:bg-yellow-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </MvButton>

      {/* Sidebar Container */}
      <div
        className={clsx(
          "fixed top-0 left-0 w-64 h-screen p-6 bg-gradient-to-b",
          "from-secondary-300 to-indigo-200 dark:from-secondary-dark-500 dark:to-gray-800",
          "border-r border-amber-100 dark:border-gray-700 shadow-xl transition-all duration-300 z-40",
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500 rounded-lg shadow-md">
              <FiBook className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Coordinator
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center space-x-4 p-3 rounded-2xl transition-all",
                  "hover:bg-white hover:shadow-md dark:hover:bg-gray-800",
                  isActive
                    ? "bg-white shadow-md dark:bg-gray-800 text-yellow-600 dark:text-amber-400"
                    : "text-gray-600 dark:text-gray-300"
                )
              }
            >
              <span className={clsx(
                "text-lg",
                // isActive ? "text-yellow-500 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"
              )}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Settings Dropdown */}
        <div className="pt-6 mt-8 border-t border-amber-100 dark:border-gray-700">
          <div
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center space-x-3">
              <FiSettings className="w-5 h-5 text-yellow-500 dark:text-amber-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Settings</span>
            </div>
            <FiChevronDown className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isDropdownOpen && (
            <div className="pl-9 mt-2 space-y-2 animate-fade-in">
              <NavLink 
                to={MvRoutes.MARKET_COORDINATOR.PROFILE_EDIT} 
                className="flex items-center p-2 space-x-2 text-gray-500 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800"
              >
                <FiUser className="w-4 h-4" />
                <span className="text-sm">Profile Settings</span>
              </NavLink>

            </div>
          )}
        </div>

        {/* User Profile Section */}
          {/* User Profile Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-indigo-100 dark:bg-gray-800 border-t border-indigo-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={facultyData?.image_url instanceof File ? URL.createObjectURL(facultyData.image_url) : facultyData?.image_url || "/src/Assets/images/404.jpeg"}
                alt="Faculty"
                onError={src => (src.currentTarget.src = "/src/Assets/images/404.jpeg")}
                className="w-10 h-10 rounded-full border-2 border-indigo-100 dark:border-gray-700"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {userData?.name || 'Student User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userData?.email || 'student@example.com'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Faculty: <span className="font-medium text-gray-700 dark:text-gray-300">
                  {facultyData?.name || 'Unknown Faculty'}
                </span>
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">

                 <span className="font-medium text-gray-700 dark:text-gray-300">
                 {UserLastLogin ? <UserLastLogin /> : "..."}

                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};