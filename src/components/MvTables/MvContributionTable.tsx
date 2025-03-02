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
      <table className="min-w-full bg-secondary-400 border border-white dark:bg-secondary-dark-600 rounded">
        <thead>
          <tr className="bg-secondary-300 text-primary-900">
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
                 variant='accent' size='sm'
                >
                  Preview
                </MvButton>
                <MvButton
                  onClick={() => onDelete(contribution.id)}
                  className=" "
                  variant='secondary' size='sm'
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
