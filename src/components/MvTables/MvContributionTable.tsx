import React from "react";
import { IContribution } from "../../app/Types/objects/contribution";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaFileWord, FaImage, FaTrash, FaEye } from "react-icons/fa";

interface MvContributionTableProps {
  contributions: IContribution[];
  onEdit: (contribution: string) => void;
  onPreview: (contribution: IContribution) => void;
  onDelete: (id: string) => void;
}


const MvContributionTable: React.FC<MvContributionTableProps> = ({
  contributions,
  onPreview,
  onDelete,
}) => {
  const navigate = useNavigate();
  const getStatus = (contribution: IContribution) => {
    if (contribution.is_selected_for_publication === 1) return "Approved";
    const createdAt = new Date(contribution.created_at!);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24)
    );
    return diffDays > 14 ? "Rejected" : "Pending";
  };
  // Helper function to get file type from URL
  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension === "pdf" ? "PDF" : "DOC";
  };

  return (
    <div className=" rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="overflow-x-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Closure Date
            </th>
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
          {contributions.map((contribution) => (
            <tr
              key={contribution.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate(`/contributions/${contribution.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {contribution.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {contribution.closure_date_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {contribution?.created_at}
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
                  className={`px-2 py-1 text-xs rounded-full ${
                    getStatus(contribution) === "Approved"
                      ? "bg-green-100 text-green-800"
                      : getStatus(contribution) === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {getStatus(contribution)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(contribution);
                    }}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MvContributionTable;
