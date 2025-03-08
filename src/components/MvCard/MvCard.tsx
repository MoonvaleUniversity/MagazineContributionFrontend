import React from "react";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { IContribution } from "../../app/Types/objects/contribution";
import { useNavigate } from "react-router-dom";

interface MvCardProps {
  contribution: IContribution;
  onEdit: () => void;
  onDelete: () => void;
}

const MvCard: React.FC<MvCardProps> = ({ contribution, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      className="max-w-2xs p-4 bg-secondary-400 dark:bg-secondary-dark-500 rounded-2xl shadow-lg cursor-pointer"
      onClick={() => navigate(`/card-details/${contribution.id}`)}
    >
      {/* Image */}
      <div className="flex justify-center rounded-xl">
        {/* <img
          src={contribution.image_url.length > 0 ? contribution.image_url[0] : "/src/Assets/images/404.jpeg"}
          alt={contribution.name || "Contribution Image"}
          className="w-full aspect-4/3 -mt-1 rounded-xl transition-transform duration-300 hover:scale-110"
        /> */}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-background-200">
        {contribution.name}
      </h3>

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

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-sm font-semibold text-primary-700 hover:underline">
          Edit
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-sm text-red-500 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default MvCard;
