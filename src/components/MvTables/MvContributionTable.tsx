import React from "react";
import { IContribution } from "../../app/Types/objects/contribution";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaFileWord, FaImage, FaTrash, FaEye, FaLock,  } from "react-icons/fa";

interface MvContributionTableProps {
  contributions: IContribution[];
  onDelete: (id: string) => void;
  onDownloadZip?: (id: string) => void;
  isMarketingManager?: boolean;
  closureDates?: { [key: string]: { final_closure_date: string }}; // Added closure dates prop
};

const MvContributionTable: React.FC<MvContributionTableProps> = ({
  contributions,
  onDelete,
  onDownloadZip,
  closureDates = {},
  isMarketingManager = false,
}) => {
  const navigate = useNavigate();

  const getStatus = (contribution: IContribution) => {
    if (contribution.is_selected_for_publication === 1) return "Approved";
    const createdAt = new Date(contribution.created_at!);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24)
    );
    return diffDays > 3 ? "Rejected" : "Pending";
  };

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

  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension === "pdf" ? "PDF" : "DOC";
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="overflow-x-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            {isMarketingManager && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Closure Date
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Images
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Document Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {contributions.length === 0 ? (
            <tr>
              <td
                colSpan={isMarketingManager ? 7 : 6}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
              >
                No contributions available.
              </td>
            </tr>
          ) : (
            contributions.map((contribution) => (
              <tr
                key={contribution.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {contribution.name}
                </td>
                {isMarketingManager && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(closureDates[contribution.closure_date_id]?.final_closure_date)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(contribution.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <FaImage className="mr-2 text-blue-500" />
                    {contribution.image_url.length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    {getFileType(contribution.doc_url) === "PDF" ? (
                      <FaFilePdf className="mr-2 text-red-500" />
                    ) : (
                      <FaFileWord className="mr-2 text-blue-500" />
                    )}
                    {getFileType(contribution.doc_url)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-4">
                    {isMarketingManager && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadZip?.(contribution.id);
                        }}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                      >
                        <FaLock className="mr-1" />
                        ZIP
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/contributions/${contribution.id}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                      <FaEye className="mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(contribution.id);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MvContributionTable;