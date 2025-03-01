import React from 'react';
import { Contribution } from '../../app/Types/objects/contribution';
import { MvButton } from '../MvButton';

interface MvContributionTableProps {
  contributions: Contribution[];
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

const MvContributionTable: React.FC<MvContributionTableProps> = ({ contributions, onPreview, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((contribution) => (
            <tr key={contribution.id} className="border-b">
              <td className="px-4 py-2">{contribution.title}</td>
              <td className="px-4 py-2">{contribution.description}</td>
              <td className="px-4 py-2">{contribution.type}</td>
              <td className="px-4 py-2 flex space-x-2">
                <MvButton
                  onClick={() => onPreview(contribution.id)}
              
                >
                  Preview
                </MvButton>
                <MvButton
                  onClick={() => onDelete(contribution.id)}
                  className="bg-red-500  hover:bg-red-600"
                >
                  Delete
                </MvButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MvContributionTable;
