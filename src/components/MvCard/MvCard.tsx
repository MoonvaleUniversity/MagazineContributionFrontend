import { useNavigate } from "react-router-dom";
import { FiThumbsUp ,FiBookmark, FiTrash, FiMessageSquare, FiThumbsDown } from "react-icons/fi";
import { IContribution } from "../../app/Types/objects/contribution";
import { detect } from "detect-browser";
import { createBrowser } from "../../services/userService";
import { getUserData } from "../../services/AuthService";
import { useEffect } from "react";


interface MvCardProps {
  contribution: IContribution;
  onDelete?: () => void;
  onStatusChange?: (newStatus: 1 | 2) => void;
}

const statusStyles = {
  0: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  1: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  2: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};


export const MvCard: React.FC<MvCardProps> = ({ contribution, onDelete }) => {
  const navigate = useNavigate();
  const userData = getUserData();
  const isOwner = userData?.id === contribution.user_id;
  const imageUrl = contribution.image_url[0]?.image_url || "/src/Assets/images/404.jpeg";

  const handleCardClick = () => navigate(`/contributions/${contribution.id}`);
  const browser = detect();
  const users = getUserData();

  useEffect(() => {
    // Check if we've already recorded this browser info
    const storageKey = "browserTracked";
    const alreadyTracked = sessionStorage.getItem(storageKey);

    if (browser && users?.id && !alreadyTracked) {
      createBrowser({
        user_id: users?.id,
        browser_name: browser?.name,
        browser_version: browser?.version,
        os: browser?.os,
      })
        .then((res) => {
          console.log("View recorded successfully:", res);
          // Set a flag in localStorage to indicate we've tracked this browser
          sessionStorage.setItem(storageKey, "true");
        })
        .catch((err) => {
          console.error("Failed to record view:", err);
        });
    } else if (alreadyTracked) {
      console.log("Browser already tracked for this user");
    } else {
      console.log("Could not detect browser.");
    }
  }, [browser, users?.id]);
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
    <div 
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
                transition-all cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          onError={src => (src.currentTarget.src = "/src/Assets/images/404.jpeg")}
          alt={contribution.name}
          className="w-full h-full object-cover transition-transform duration-300 
                    group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 
                      rounded-full text-sm flex items-center">
          <span>{contribution.image_url.length} images</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
              {contribution.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(contribution.created_at)}
            </p>
          </div>
          
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full 
                          ${statusStyles[contribution.is_selected_for_publication]}`}>
            {contribution.is_selected_for_publication === 1 ? 'Approved' :  'Pending' }
          </span>
        </div>

        {/* Faculty Info */}
        <div className="flex items-center gap-3">
          {contribution.user.faculty?.image_url && (
            <img
              src={contribution.user.faculty.image_url}
              alt="Faculty"
              className="w-6 h-6 rounded-lg object-cover border-2 border-primary"

            />
          )}
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {contribution.user.faculty?.name} Faculty
            </p>
           
          </div>
        </div>
  
   
 {/* Engagement Section - Only show for unpublished contributions */}
 {contribution.is_selected_for_publication === 1 && (
       
        <div className="relative flex items-center justify-between text-gray-500 dark:text-gray-400">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <FiThumbsUp className="text-lg" />
              <span>{contribution.votes?.filter(v => v.type === 'upvote').length || 0}</span>

            </div>
            <div className="flex items-center gap-1">
              <FiThumbsDown className="text-lg" />
              <span>{contribution.votes?.filter(v => v.type === 'downvote').length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMessageSquare className="text-lg" />
              <span>{contribution.comments?.length || 0}</span>
            </div>
          </div>
          <FiBookmark className="text-lg hover:text-primary dark:hover:text-primary-400" />
        </div>
      )}
      </div>
      

      {/* Status Change Buttons (Owner only) */}
      {/* Delete Button (Owner only) */}
      {isOwner && (
        <button
          className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-700/90 rounded-full 
                    hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <FiTrash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};