
import { MvButton } from "../../components/MvButton";
import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaUser, FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { logo_dark, logo_light } from "../../app/MvConstants";
import MvRoutes from "../../app/MvRoutes";
import { getLogout } from "../../app/MvApi";
import { MvUrl } from "../../app/MvUrl";

export const MvNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Get user data
  const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData");
  const userName = userData ? JSON.parse(userData).name : "Guest";

  
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
      
       ["userData", "userToken", "username"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

      console.log("Successful logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  // Logout handler
  const handleLogout = () => {
   

    window.location.href = "/";
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

    <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to={MvRoutes.GUEST.DASHBOARD}className="flex items-center">
              <img
                src={logo_dark}
                alt="Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src={logo_light}
                alt="Logo"
                className="h-8 w-auto hidden dark:block"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaUser className="text-gray-600 dark:text-gray-300" />
                <span className="text-gray-800 dark:text-white font-medium">{userName}</span>
                <FaCaretDown className={`text-gray-600 dark:text-gray-300 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-t-lg"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white dark:bg-gray-800">
          <div className="pt-4 pb-3 px-4">
            <div className="flex items-center mb-3">
              <FaUser className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              <span className="ml-2 text-gray-800 dark:text-white font-medium">{userName}</span>
            </div>
            <div className="space-y-1">
              <Link
                to={MvRoutes.GUEST.PROFILE_EDIT}
                className="block px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};
