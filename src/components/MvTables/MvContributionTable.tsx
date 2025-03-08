import React from "react";
import { ApiContributionResponse} from "../../app/Types/objects/contribution";
import { useNavigate } from "react-router-dom";

interface MvContributionTableProps {
  contributions: ApiContributionResponse[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MvContributionTable: React.FC<MvContributionTableProps> = ({ contributions, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-secondary-400 border border-white dark:bg-secondary-dark-600 rounded">
        <thead>
          <tr className="bg-secondary-300 text-primary-900">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((contribution) => (
            <tr
              key={contribution.id}
              className="border-b cursor-pointer hover:bg-secondary-500 transition"
              onClick={() => navigate(`/card-details/${contribution.id}`)}
            >
              <td className="px-4 py-2">{contribution.name}</td>
              <td className="px-4 py-2">{contribution.user_id}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click from triggering navigation
                    onEdit(contribution.id);
                  }}
                  className="text-sm font-semibold text-primary-700 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(contribution.id);
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MvContributionTable;
