import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { FaBookmark, FaEye, FaFilePdf, FaFileWord, FaImage, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IContribution } from "../../app/Types/objects/contribution";
import { getClosureDateById } from "../../services/ClosureDateService";
import { IClosureDate } from "../../app/MvObjects/clousuredate";

interface MvCardProps {
  contribution: IContribution;
  
  onDelete: () => void;
}

const getStatus = (contribution: IContribution) => {
  if (contribution.is_selected_for_publication === 1) return "Approved";
  const createdAt = new Date(contribution.created_at!);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
  return diffDays > 14 ? "Rejected" : "Pending";
};

const MvCard: React.FC<MvCardProps> = ({ contribution, onDelete }) => {
  const navigate = useNavigate();
  const [closureDate, setClosureDate] = useState<IClosureDate | null>(null);
  const [loading, setLoading] = useState(true);

  // Get first image URL
  const imageUrl = contribution.image_url[0] || "/src/Assets/images/404.jpeg";

  // Get document type
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? 'PDF' : 'DOC';
  };

  // Fetch closure date
  useEffect(() => {
    const fetchClosureDate = async () => {
      try {
        const date = await getClosureDateById(contribution.closure_date_id);
        setClosureDate(date);
      } catch (error) {
        console.error('Error fetching closure date:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClosureDate();
  }, [contribution.closure_date_id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div
      className="max-w-xs p-4 bg-white dark:bg-secondary-dark-500 rounded-xl shadow-lg cursor-pointer"
      onClick={() => navigate(`/card-details/${contribution.id}`)}
    >
      {/* Image */}
      <div className="flex justify-center rounded-xl relative">
        <img
          src={imageUrl}
          alt={contribution.name || "Contribution Image"}
          className="w-full aspect-4/3 rounded-xl object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center">
          <FaImage className="mr-1" />
          <span>{contribution.image_url?.length || 0}</span>
        </div>
      </div>

      {/* Title and Metadata */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-background-200">
          {contribution.name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 dark:text-background-400">
          {getFileType(contribution.doc_url) === "PDF" ? (
            <FaFilePdf className="mr-2 text-red-500" />
          ) : (
            <FaFileWord className="mr-2 text-blue-500" />
          )}
          <span>{getFileType(contribution.doc_url)} Document</span>
        </div>

        <div className="text-sm text-gray-500 dark:text-background-400">
          {loading ? (
            "Loading dates..."
          ) : closureDate ? (
            <>
              <div>Final: {new Date(closureDate.final_closure_date).toLocaleDateString()}</div>
            </>
          ) : (
            "Date information unavailable"
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-background-400">
            {formatDate(contribution.created_at)}
          </span>
          <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${
      getStatus(contribution) === "Approved"
        ? "bg-green-600 text-white dark:bg-green-300 dark:text-green-900"
        : getStatus(contribution) === "Rejected"
        ? "bg-red-600 text-white dark:bg-red-300 dark:text-red-900"
        : "bg-yellow-600 text-white dark:bg-yellow-300 dark:text-yellow-900"
    }`}
  >
            {getStatus(contribution)}
          </span>
        </div>
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
      {/* Action Buttons */}
      <div className="mt-4 flex justify-between">
        <button
                             onClick={() =>
                               navigate(`/contributions/${contribution.id}`)
                             }
                             className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                           >
                             <FaEye className="mr-1" />
                             Preview
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               onDelete();
                             }}
                             className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                           >
                             <FaTrash className="mr-1" />
                             Delete
                           </button>
      </div>
    </div>
  );
};

export default MvCard;