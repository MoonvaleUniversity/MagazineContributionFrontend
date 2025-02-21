import React, { useState, useEffect } from 'react';

export const MvThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Effect to apply the theme to the body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark'); // Add dark class to body
    } else {
      document.body.classList.remove('dark'); // Remove dark class from body
    }
    
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed flex justify-center w-12 h-12 p-2 transition-colors duration-300 rounded-full shadow-md hover:shadow-xl dark:shadow-primary-500/50 bottom-10 right-10 align-center bg-accent-900 dark:bg-accent-300"
    >
      {isDarkMode ? (
        <img src='/src/Assets/icons/moon.svg'/>
            ) : (
        <img src='/src/Assets/icons/sun.svg'/>
      )}
    </button>
  );
};

