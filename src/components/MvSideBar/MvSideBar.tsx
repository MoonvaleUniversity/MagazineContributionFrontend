import React, { JSX, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUpload, 
  FiFileText, 
  FiEye, 
  FiStar, 
  FiImage, 
  FiUser ,
  FiClock,
  FiBook
} from 'react-icons/fi';

// Define the type for menu items
interface MenuItem {
  path: string;
  name: string;
  icon: JSX.Element;
  disabled?: boolean;
}

const StudentSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Placeholder for closure date; replace with actual data from context/API
  const closureDate = new Date('2023-12-31'); 
  const currentDate = new Date();
  
  // Mock last login; replace with actual data from authentication context
  const lastLogin = localStorage.getItem('lastLogin') || 'First login';

  // Define menu items
  const menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <FiHome />
    },
    {
      path: '/submit-work',
      name: 'Submit Work',
      icon: <FiUpload />,
      disabled: currentDate > closureDate
    },
    {
      path: '/my-submissions',
      name: 'My Submissions',
      icon: <FiFileText />,
      disabled: currentDate > closureDate
    },
    {
      path: '/submission-status',
      name: 'Submission Status',
      icon: <FiEye />
    },
    {
      path: '/creative-sparks',
      name: 'Creative Sparks',
      icon: <FiStar />
    },
    {
      path: '/canvas-corner',
      name: 'Canvas Corner',
      icon: <FiImage />
    },
    {
      path: '/profile',
      name: 'Profile Settings',
      icon: <FiUser  />
    },
    {
      path: '/terms',
      name: 'Terms & Conditions',
      icon: <FiBook />
    }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="mobile-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className="sidebar-header">
        <h3>Student Dashboard</h3>
        <div className="last-login">
          <FiClock />
          <span>Last login: {lastLogin}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.disabled ? '#' : item.path}
            className={({ isActive }) => 
              `menu-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
            {item.disabled && (
              <span className="tooltip">Disabled after {closureDate.toLocaleDateString()}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Closure Date: {closureDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default StudentSidebar;