import { FiHome, FiFileText, FiCheckCircle, FiUser, FiUsers, FiChevronDown, FiMenu, FiX} from "react-icons/fi";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MvButton } from "../../MvButton";
import MvRoutes from "../../../app/MvRoutes";
import { getUserData } from "../../../services/AuthService";

interface MarketingCoordinatorSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvMarketingCoordinatorSidebar: React.FC<MarketingCoordinatorSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    setUserData(getUserData())
  }, []);
  // Navigation items remain as defined
  const navItems = [
    { icon: <FiHome />, label: "Dashboard", to: MvRoutes.MARKET_COORDINATOR.DASHBOARD},
    { icon: <FiFileText />, label: "Submissions", to: MvRoutes.MARKET_COORDINATOR.CONTRIBUTIONS},
    { icon: <FiCheckCircle />, label: "Students", to: MvRoutes.MARKET_COORDINATOR.STUDENTS},
    { icon: <FiUsers />, label: "Guest Approvals", to: MvRoutes.MARKET_COORDINATOR.GUEST},
    { icon: <FiUser />, label: "Profile", to: MvRoutes.MARKET_COORDINATOR.PROFILE_EDIT},
  ];

  // Generate a random last login within the last 24 hours (for demo)
  const lastLogin = new Date();
  lastLogin.setHours(lastLogin.getHours() - Math.floor(Math.random() * 24));

 

  return (
    <div className="relative">
      <MvButton
        size="sm"
        className="fixed py-3 z-50 text-white transition-all left-2 rounded-4xl top-2 lg:hidden"
        variant="secondary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </MvButton>

      <div
        className={`absolute top-0 left-0 w-64 h-screen p-4 text-black dark:text-white border-r border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 dark:border-primary-dark-500 transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? "transform-none" : "max-lg:hidden"
        } lg:block`}
      >
        <div className="flex justify-center mb-8">
          <span className="text-xl font-bold">Marketing Coordinator</span>
        </div>

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

        <div className="pt-4 mt-8 border-t border-primary-500 dark:border-primary-dark-500">
          <div
            className="flex items-center justify-between p-3 text-primary-800 dark:text-primary-dark-200 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>Settings</span>
            <FiChevronDown
              className={`text-primary-800 font-bold dark:text-primary-dark-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isDropdownOpen && (
            <div className="pl-4 text-gray-600 dark:text-primary-dark-200">
              <div className="p-2 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">General</div>
              <div className="p-2 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">Account</div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 dark:border-primary-dark-500">
        <div className="flex items-center space-x-3">
            <img
              src="/src/Assets/images/404.jpeg"
              alt="Student avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{userData?.name || 'Unknown User'}</p>
              <p className="text-xs dark:text-primary-dark-200">{userData?.email || 'student@example.com'}</p>
              <p className="text-xs text-gray-500 dark:text-primary-dark-300">
              Last login: 
              </p>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
};
