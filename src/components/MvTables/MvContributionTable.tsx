import React from "react";
import { IContribution } from "../../app/Types/objects/contribution";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaFileWord, FaImage, FaTrash, FaEye, FaLock } from "react-icons/fa";
import { IClosureDate } from "../../app/MvObjects/clousuredate";

interface MvContributionTableProps {
  contributions: IContribution[];
  closureDates?: Record<string, IClosureDate>;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: 'approved' | 'rejected') => void;
  onDownloadZip?: (id: string) => void;
  isMarketingCoordinator?: boolean;
  isMarketingManager?: boolean;
  isAdmin?: boolean;
}

const MvContributionTable: React.FC<MvContributionTableProps> = ({
  contributions,
  closureDates = {},
  onDelete,
  onStatusChange,
  onDownloadZip,
  isMarketingCoordinator = false,
  isMarketingManager = false,
  isAdmin = false,
}) => {
  const navigate = useNavigate();

  // Determine contribution status
  const getStatus = (contribution: IContribution) => {
    if (contribution.is_selected_for_publication === 1) return "Approved";
    const createdAt = new Date(contribution.created_at!);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
    return diffDays > 3 ? "Rejected" : "Pending";
  };

  // Format dates consistently
  const formatDate = React.useCallback((dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Determine file type from URL
  const getFileType = React.useCallback((url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension === "pdf" ? "PDF" : "DOC";
  }, []);

  // Check if closure date has passed
  const isClosureDatePassed = (contributionId: string) => {
    const closureDate = closureDates[contributionId]?.final_closure_date;
    return closureDate ? new Date(closureDate) < new Date() : false;
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Table Header */}
        <thead className="bg-gray-50 dark:bg-primary-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            {isMarketingCoordinator && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User ID
              </th>
            )}
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

        {/* Table Body */}
        <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
          {contributions.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                No contributions available.
              </td>
            </tr>
          ) : (
            contributions.map((contribution) => {
              const status = getStatus(contribution);
              const canDownload = isMarketingManager && isClosureDatePassed(contribution.closure_date_id);

              return (
                <tr
                  key={contribution.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {/* Contribution Title */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {contribution.name}
                  </td>

                  {/* User ID (Marketing Coordinator only) */}
                  {isMarketingCoordinator && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {contribution.user_id}
                    </td>
                  )}

                  {/* Closure Date (Marketing Manager only) */}
                  {isMarketingManager && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(closureDates[contribution.closure_date_id]?.final_closure_date)}
                    </td>
                  )}

                  {/* Creation Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(contribution.created_at)}
                  </td>

                  {/* Images Count */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <FaImage className="mr-2 text-blue-500" />
                      {contribution.image_url.length}
                    </div>
                  </td>

                  {/* Document Type */}
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

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isMarketingCoordinator && !isAdmin ? (
                      <select
                        value={status === "Approved" ? "approved" : "rejected"}
                        onChange={(e) => onStatusChange?.(contribution.id, e.target.value as 'approved' | 'rejected')}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          status === "Approved" 
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        } cursor-pointer`}
                      >
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        status === "Approved" 
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : status === "Rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      }`}>
                        {status}
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      {/* ZIP Download */}
                      {canDownload && (
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

                      {/* Preview Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/contributions/${contribution.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        <FaEye className="mr-1" />
                        Preview
                      </button>

                      {/* Delete Button */}
                      {!isAdmin && (
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
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(MvContributionTable);