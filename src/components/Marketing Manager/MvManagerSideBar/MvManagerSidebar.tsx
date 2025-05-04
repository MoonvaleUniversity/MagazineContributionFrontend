import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MvButton } from "../../MvButton";
import MvRoutes from "../../../app/MvRoutes";
import { getUserData } from "../../../services/AuthService";
import { FiHome, FiUsers, FiFile, FiUser,  FiMenu, FiX, FiSettings } from "react-icons/fi";
import clsx from "clsx";
import { FaGrinStars } from "react-icons/fa";

import UserLastLogin from "../../../pages/Admin/UserLastLogin";


interface MarketingManagerSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvMarketingManagerSidebar: React.FC<MarketingManagerSidebarProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {

  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  const navItems = [
    { icon: <FiHome />, label: "Dashboard", to: MvRoutes.MARKET_MANAGER.DASHBOARD },
    { icon: <FiUsers />, label: "Faculties", to: MvRoutes.MARKET_MANAGER.FACULTY },
    { icon: <FiFile />, label: "Contributions", to: MvRoutes.MARKET_MANAGER.SELECTED_CONTRIBUTIONS },
    { icon: <FiUsers />, label: "Users", to: MvRoutes.MARKET_MANAGER.USERS },
    { icon: <FiUser />, label: "Profile", to: MvRoutes.MARKET_MANAGER.PROFILE_EDIT },
    { icon: <FaGrinStars />, label: 'Explore Contributions', to: MvRoutes.PUBLIC_CONTRIBUTION },
  ];

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <MvButton
        size="sm"
        className="fixed z-50 pt-2 text-white transition-all shadow-lg lg:hidden left-4 top-4 rounded-4xl bg-purple-500 hover:bg-purple-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </MvButton>

      {/* Sidebar Container */}
      <div
        className={clsx(
          "fixed top-0 left-0 w-64 h-screen p-6 bg-gradient-to-b",
          "from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-900",
          "border-r border-violet-100 dark:border-gray-700 shadow-xl transition-all duration-300 z-40",
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header Section */}
        <div className="flex items-center mb-12 space-x-3">
          <div className="p-2 bg-purple-500 rounded-lg shadow-md">
            <FiSettings className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Manager
          </span>
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
                    ? "bg-white shadow-md dark:bg-gray-800 text-purple-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-300"
                )
              }
            >
              <span className={clsx(
                "text-lg",
             "text-purple-500 dark:text-violet-400" , "text-gray-400 dark:text-gray-500"
              )}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-violet-50 dark:bg-gray-800 border-t border-violet-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
          
            <div className="flex-1">
              <p className="text-md font-medium text-gray-700 dark:text-gray-200 ">
                {userData?.name || 'Marketing Manager'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userData?.email || 'manager@example.com'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">

                <span className="font-medium text-purple-600 dark:text-violet-400">
                {UserLastLogin ? <UserLastLogin /> : "..."}

              

                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};