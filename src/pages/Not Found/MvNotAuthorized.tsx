import React from "react";
import { useNavigate } from "react-router-dom";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import MvRoutes from "../../app/MvRoutes";

const MvNotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
  
         // Remove user-related data
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    
        navigate(MvRoutes.LOGIN); // Default dashboard
   
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center w-full max-w-xl gap-5 p-4 max-sm:w-11/12">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center">Access Denied 🚫</h2>

        {/* Message */}
        <p className="text-center dark:text-white">
          You don’t have permission to access this page. If you believe this is a mistake, please contact an administrator.
        </p>

        {/* Illustration */}
        <img
          src="/src/assets/images/404.jpeg" // Replace with an appropriate image
          alt="Not Authorized"
          className="w-11/12 mx-auto mt-4"
        />

        {/* Go Home Button */}
        <MvButton className="w-1/2 mx-auto mt-4" onClick={handleGoHome}>
          Return to Dashboard
        </MvButton>

        {/* Theme Toggle */}
        <MvThemeToggle />
      </div>
    </div>
  );
};

export default MvNotAuthorized;
