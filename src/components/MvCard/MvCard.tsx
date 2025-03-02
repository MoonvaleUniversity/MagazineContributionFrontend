import React from 'react';
import { MvButton } from '../MvButton';

interface MvContributionCardProps {
  title: string;
  description: string;
  file: string; // This could be a URL or path to the uploaded file
  type: 'article' | 'image';
  onPreview: () => void;
  onDelete: () => void;
}

const MvContributionCard: React.FC<MvContributionCardProps> = ({ title, description, file, type, onPreview, onDelete }) => {
  return (
    <div className="bg-secondary-200 dark:bg-secondary-dark-400   p-4 rounded-2xl dark:shadow-accent-50/10 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm  text-primary-700 dark:text-primary-100 mb-4">{description}</p>
      
      {type === 'image' ? (
        <img src={file} alt={title} className="w-full h-auto rounded-md mb-4" />
      ) : (
        <a href={file} download className="text-blue-500 hover:underline">
          Download Article
        </a>
      )}
      
      <div className="flex gap-2 mt-4">
        <MvButton 
          onClick={onPreview} 
          className=" transition-colors"
        variant='accent' size='sm'
        >
          Preview
        </MvButton>
        <MvButton 
          onClick={onDelete} 
          variant='secondary' size='sm'
          className=" transition-colors"
        >
          Delete
        </MvButton>
      </div>
    </div>
  );
};

export default MvContributionCard;
