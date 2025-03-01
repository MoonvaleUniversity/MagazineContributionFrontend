import { useState } from "react";

import MvContributionTable from "../../components/MvTables/MvContributionTable";
import { Contribution } from "../../app/Types/objects/contribution";
import MvContributionCard from "../../components/MvCard/MvCard";  // Assuming this is the card view component
import StudentLayout from "../../layout/StudentLayout";

const mockContributions: Contribution[] = [
  {
    id: '1',
    title: 'Article on Climate Change',
    description: 'An insightful article about the impact of climate change.',
    file: '/path/to/article.docx',
    type: 'article',
  },
  {
    id: '2',
    title: 'Nature Photography',
    description: 'A stunning landscape photograph of the mountains.',
    file: '/path/to/image.jpg',
    type: 'image',
  },
  // Add more contributions here
];

const Dashboard = () => {
  const [contributions, setContributions] = useState(mockContributions);
  const [view, setView] = useState<'table' | 'card'>('table'); // State to toggle between table and card views

  const handlePreview = (id: string) => {
    alert(`Previewing contribution with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    const filteredContributions = contributions.filter((contrib) => contrib.id !== id);
    setContributions(filteredContributions);
  };

  return (
    <StudentLayout>
      <div className="contribution-list-view">
        <h2>Contribution List</h2>

        {/* Toggle View Button */}
        <div className="mb-4">
          <button
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Switch to {view === 'table' ? 'Card View' : 'Table View'}
          </button>
        </div>

        {/* Conditional Rendering Based on View State */}
        {view === 'table' ? (
          <MvContributionTable contributions={contributions} onPreview={handlePreview} onDelete={handleDelete} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributions.map((contribution) => (
              <MvContributionCard
                key={contribution.id}
                title={contribution.title}
                description={contribution.description}
                file={contribution.file}
                type={contribution.type}
                onPreview={() => handlePreview(contribution.id)}
                onDelete={() => handleDelete(contribution.id)}
              />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Dashboard;
