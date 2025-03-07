import React from "react";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";


export const MvCard: React.FC = () => {
  return (
    <div className="max-w-2xs p-4 bg-secondary-400 dark:bg-secondary-dark-500 rounded-2xl shadow-lg">
      {/* Image */}
      <div className="flex justify-center rounded-xl">
        <img
          src="/src/Assets/images/404.jpeg"
          alt="Book Illustration"
          className="w-full aspect-4/3 -mt-1 rounded-xl transition-transform duration-300 hover:scale-110"
        />
      </div>
      
      {/* Title */}
      <h3 className="mt-4 text-lg font-bold  text-gray-800 dark:text-background-200">Lorem ipsum dolar blah blah blahsgh</h3>
      
      {/* Description */}
      <p className="text-sm text-justify text-gray-600  mt-1 dark:text-background-600">
        this is a paragraph. i was supposed to be a paragraph but i am so bored so i started yapping
      </p>
      
      {/* Icons Section */}
      <div className="mt-4 flex justify-between  items-center text-gray-500 dark:text-background-400 text-sm">
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
  );
};
