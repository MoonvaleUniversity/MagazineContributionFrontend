import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { MvButton } from "../../components/MvButton";

import { Link } from "react-router-dom";
import { logo_dark, logo_light } from "../../app/MvConstants";
import { getLogout } from "../../app/MvApi";
import { MvUrl } from "../../app/MvUrl";

export const MvNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const data =
    localStorage.getItem("userData") || sessionStorage.getItem("userData");

  // Parse the JSON data and extract the user's name
  const userName = data ? JSON.parse(data).name : "Guest";

  const [buttonSize, setButtonSize] = useState<"sm" | "md">("md");
  const handleLogout = async () => {
    try {
      await getLogout(MvUrl.LOGOUT);
      // Remove user-related data
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      localStorage.removeItem("username");

      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("viewed");

      console.log("Successful logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Redirect to login page
    window.location.href = "/";
  };
  // Function to update button size based on screen width
  useEffect(() => {
    const updateButtonSize = () => {
      if (window.innerWidth < 768) {
        setButtonSize("sm");
      } else {
        setButtonSize("md");
      }
    };

    updateButtonSize(); // Set initial size
    window.addEventListener("resize", updateButtonSize); // Listen for window resize

    return () => window.removeEventListener("resize", updateButtonSize); // Cleanup
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 py-2 bg-secondary-100 bg-opacity-60 dark:bg-opacity-80 dark:bg-secondary-dark-800">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img src={logo_dark} alt="Logo" className="w-auto h-10 dark:hidden" />
        <img
          src={logo_light}
          alt="Logo"
          className="hidden w-auto h-10 dark:block"
        />
      </div>

      {/* Navigation Links */}
      <div
        className={`flex-col md:flex md:flex-row md:space-x-8 transition-opacity duration-300 ease-in-out ${
          isMenuOpen
            ? "flex absolute top-14 left-0 right-0 bg-opacity-60 bg-secondary-200 dark:bg-secondary-dark-700 p-4"
            : "hidden md:flex"
        }`}
      >
        <Link
          to="/"
          className={`p-2 m-2 font-bold text-center transition-all duration-300 rounded-2xl hover:text-background-800 dark:hover:text-background-700 ${
            isMenuOpen
              ? "shadow-sm bg-secondary-400 dark:bg-secondary-dark-500 dark:shadow-secondary-500 font-title-medium hover:bg-secondary-500 dark:hover:bg-secondary-dark-400 hover:shadow-md"
              : "bg-none"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`p-2 m-2 font-bold text-center transition-all duration-300 rounded-2xl hover:text-background-800 dark:hover:text-background-700 ${
            isMenuOpen
              ? "shadow-sm bg-secondary-400 dark:bg-secondary-dark-500 dark:shadow-secondary-500 font-title-medium hover:bg-secondary-500 dark:hover:bg-secondary-dark-400 hover:shadow-md"
              : "bg-none"
          }`}
        >
          About
        </Link>
        <Link
          to="/services"
          className={`p-2 m-2 font-bold text-center transition-all duration-300 rounded-2xl hover:text-background-800 dark:hover:text-background-700 ${
            isMenuOpen
              ? "shadow-sm bg-secondary-400 dark:bg-secondary-dark-500 dark:shadow-secondary-500 font-title-medium hover:bg-secondary-500 dark:hover:bg-secondary-dark-400 hover:shadow-md"
              : "bg-none"
          }`}
        >
          Services
        </Link>
        <Link
          to="/contact"
          className={`p-2 m-2 font-bold text-center transition-all duration-300 rounded-2xl hover:text-background-800 dark:hover:text-background-700 ${
            isMenuOpen
              ? "shadow-sm bg-secondary-400 dark:bg-secondary-dark-500 dark:shadow-secondary-500 font-title-medium hover:bg-secondary-500 dark:hover:bg-secondary-dark-400 hover:shadow-md"
              : "bg-none"
          }`}
        >
          Contact
        </Link>
      </div>
      <div className="flex gap-4 align-center">
        {/* Profile Section */}
        <div className="flex items-center gap-1">
          <div className="flex items-center space-x-4">
            <MvButton
              size={buttonSize}
              className="flex items-center space-x-2 text-black dark:text-gray-300"
            >
              <FaUser />
              <span>{userName}</span>
            </MvButton>
          </div>
          {/* Hamburger Menu for Mobile */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <FaTimes className="text-black dark:text-gray-300" />
              ) : (
                <FaBars className="text-black dark:text-gray-300" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <MvButton
              variant="primary"
              onClick={() => {
                handleLogout();
              }}
            >
              <span className="">Logout</span>
            </MvButton>
          </div>
        </div>
      </div>
    </nav>
  );
};
