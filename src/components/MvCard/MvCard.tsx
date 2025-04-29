import React, {  useState } from "react";
import { AiOutlineLike,  AiOutlineMessage, AiOutlineEllipsis } from "react-icons/ai";
import { FaBookmark, FaEye, FaFilePdf, FaFileWord, FaImage, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IContribution } from "../../app/Types/objects/contribution";


interface MvCardProps {
  contribution: IContribution;
  onStatusChange?: (newStatus: 1 | 2) => void; // Updated to match API status codes
  isMarketingCoordinator?: boolean;
  onDelete?: () => void;
}

const statusStyles = {
  0: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500",
  1: "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500",
  2: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500"
};

export const MvCard: React.FC<MvCardProps> = ({ 
  contribution, 
  onDelete = () => {}, 
  onStatusChange,
  isMarketingCoordinator = false  
}) => {
  const navigate = useNavigate();
 
  const [showMenu, setShowMenu] = useState(false);

  // Get first image URL
  const imageUrl = contribution.image_url[0]?.image_url || "/src/Assets/images/404.jpeg";

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? 'PDF' : 'DOC';
  };
  
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="relative place-self-center max-w-xs p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      {/* Context Menu */}
      <div className="absolute top-2 right-2 ">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <AiOutlineEllipsis className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {showMenu && (
          <div 
            className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10"
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/contributions/${contribution.id}`);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FaEye className="mr-2" />
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="rounded-xl overflow-hidden mt-4 relative">
        <img
          src={imageUrl}
          alt={contribution.name}
          className="w-full aspect-4/3 object-cover transition-transform duration-300 mt- hover:scale-105"
          onError={src => (src.currentTarget.src = "/src/Assets/images/404.jpeg")}
        />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center">
          <FaImage className="mr-1" />
          <span>{contribution.image_url.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {contribution.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          {getFileType(contribution.doc_url) === "PDF" ? (
            <FaFilePdf className="mr-2 text-red-500" />
          ) : (
            <FaFileWord className="mr-2 text-blue-500" />
          )}
          <span>{contribution.user.faculty.name} </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {formatDate(contribution.created_at)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[contribution.is_selected_for_publication]}`}>
            {contribution.is_selected_for_publication === 1 ? 'Approved' : 
             contribution.is_selected_for_publication === 2 ? 'Rejected' : 'Pending'}
          </span>
        </div>

        {isMarketingCoordinator && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange?.(contribution.is_selected_for_publication === 1 ? 2 : 1);
            }}
            className={`w-full mt-2 px-3 py-1.5 text-sm rounded-lg ${
              contribution.is_selected_for_publication === 1 
                ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/30 dark:hover:bg-red-800/40'
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/30 dark:hover:bg-green-800/40'
            }`}
          >
            {contribution.is_selected_for_publication === 1 ? 'Reject Contribution' : 'Approve Contribution'}
          </button>
        )}
      </div>

      {/* Engagement Metrics */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <AiOutlineLike className="mr-1" />
            <span>0</span>
          </div>
          <div className="flex items-center">
            <AiOutlineMessage className="mr-1" />
            <span>0</span>
          </div>
        </div>
        <FaBookmark className="hover:text-yellow-500 cursor-pointer" />
      </div>
    </div>
  );
};

