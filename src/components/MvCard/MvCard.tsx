import React from 'react';

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
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-4">{description}</p>
      
      {type === 'image' ? (
        <img src={file} alt={title} className="w-full h-auto rounded-md mb-4" />
      ) : (
        <a href={file} download className="text-blue-500 hover:underline">
          Download Article
        </a>
      )}
      
      <div className="flex gap-2 mt-4">
        <button 
          onClick={onPreview} 
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Preview
        </button>
        <button 
          onClick={onDelete} 
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MvContributionCard;
