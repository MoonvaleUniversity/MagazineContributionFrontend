import React from "react";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";

export const MvCardH: React.FC = () => {
  return (
    <div className="max-w-2xs p-4 bg-secondary-400 dark:bg-secondary-dark-500 rounded-2xl shadow-lg flex flex-row">
      {/* Left: Image */}
      <div className="w-1/3 flex items-center justify-center">
        <img
          src="/src/Assets/images/404.jpeg"
          alt="Book Illustration"
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Right: Text and Icons */}
      <div className="w-2/3 pl-4 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-background-200">
            Lorem ipsum dolar blah blah blahsgh
          </h3>
          {/* Description */}
          <p className="text-sm text-justify text-gray-600 mt-1 dark:text-background-600">
            This is a paragraph. I was supposed to be a paragraph but I am so bored so I started yapping.
          </p>
        </div>
        {/* Icons Section */}
        <div className="mt-4 flex justify-between items-center text-gray-500 dark:text-background-400 text-sm">
          <div className="flex items-center gap-1">
            <AiOutlineLike className="w-5 h-5" />
            <span>100</span>
          </div>
          <div className="flex items-center gap-1">
            <AiOutlineDislike className="w-5 h-5" />
            <span>100</span>
          </div>
          <div className="flex items-center gap-1">
            <AiOutlineMessage className="w-5 h-5" />
            <span>100</span>
          </div>
          <div>
            <FaBookmark className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

