import React from "react";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { useNavigate } from "react-router-dom";
import MvRoutes from "../../app/MvRoutes";

const MvNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(MvRoutes.DASHBOARD); // Navigate back to the homepage
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center w-full max-w-xl gap-5 p-4 max-sm:w-11/12">
        
     
        {/* Title */}
        <h2 className="text-2xl font-bold text-center">Oops! 🎨</h2>

        {/* Fun Message */}
        <p className="text-center dark:text-white">
          We can’t seem to find the page you’re looking for. It might have taken a detour to the art gallery!
        </p>

        {/* Fun Illustration */}
        <img
          src="/src/assets/images/404.jpeg" // Replace with your fun illustration
          alt="Lost in Art"
          className="w-11/12 mx-auto mt-4"
        />

        {/* Go Home Button */}
        <MvButton className="w-1/2 mx-auto mt-4" onClick={handleGoHome}>
          Take Me Home
        </MvButton>

        {/* Theme Toggle */}
        <MvThemeToggle />
      </div>
    </div>
  );
};

export default MvNotFound;