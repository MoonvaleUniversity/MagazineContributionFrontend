import { FiHome, FiFile, FiCheckCircle,  FiSettings, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MvButton } from '../../MvButton';
import MvRoutes from '../../../app/MvRoutes';

interface MvStudentSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvStudentSidebar: React.FC<MvStudentSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')|| sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', to: '/students/dashboard' },
    { icon: <FiFile />, label: 'My Submissions', to: '/students/submissions' },
    { icon: <FiCheckCircle />, label: 'Submit Contribution', to: '/students/contribution-form' },
    // { icon: <FiUser />, label: 'Profile', to: '/students/profile-edit' },
  ];

  
  
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
          isSidebarOpen ? 'transform-none' : 'max-lg:hidden'
        } lg:block`}
      >
        <div className="flex justify-center mb-8">
          <span className="text-xl font-bold">Moonvale University</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-4 p-2 rounded-4xl ${
                  isActive
                    ? 'bg-secondary-600 text-black font-bold'
                    : 'text-primary-800 hover:bg-secondary-600 dark:text-secondary-dark-200 dark:hover:bg-secondary-dark-700'
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
            <span>More Pages</span>
            <FiChevronDown
              className={`text-primary-800 font-bold dark:text-primary-dark-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {isDropdownOpen && (
            <div className="pl-4 flex flex-col text-gray-600 dark:text-primary-dark-200">
              <NavLink to={MvRoutes.CANVAS_CORNER} className="p-2 w-full rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">Canvas Corner</NavLink>
              <NavLink to={MvRoutes.STUDENTS.PROFILE_EDIT} className="p-2 w-full rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">Account</NavLink>
             
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
            </div>
            <FiSettings className="ml-auto text-primary-700 dark:text-primary-dark-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
