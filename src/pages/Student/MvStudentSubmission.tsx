import { useState } from "react";
import { Contribution } from "../../app/Types/objects/contribution";
import { MvButton } from "../../components/MvButton";
import MvContributionCard from "../../components/MvCard/MvCard";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import StudentLayout from "../../layout/StudentLayout";


 const mockSubmissions: Contribution[] = [
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
  // Add more submissions as needed
];

export const MvStudentSubmissionsView = () => {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [view, setView] = useState<'table' | 'card'>('table'); // Toggle between table and card views

  const handlePreview = (id: string) => {
    alert(`Previewing submission with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    const updatedSubmissions = submissions.filter((submission) => submission.id !== id);
    setSubmissions(updatedSubmissions);
  };

  const handleCreateNew = () => {
    // Handle create new submission action (e.g., navigate to a submission form)
    alert("Create new submission clicked");
  };

  return (
    <StudentLayout>
      <div className="submission-view">
        {/* Header with title and create button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Student Submission</h2>
          <MvButton 
            onClick={handleCreateNew} 
            className=" py-2 px-4 font-extrabold"
            variant="accent"
          >
            Create New Submission
          </MvButton>
        </div>
    <hr />
        {/* Toggle view button */}
        <div className="my-10 mb-5  flex items-center justify-between">
          <h2>{view== "table"? "Table": "Card"} View</h2> 
          <MvButton
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
           size="sm" variant="primary"
          >
            Switch to {view === 'table' ? 'Card View' : 'Table View'}
          </MvButton>
        </div>

        {/* Conditional rendering of the submissions list */}
        {view === 'table' ? (
          <MvContributionTable 
            contributions={submissions} 
            onPreview={handlePreview} 
            onDelete={handleDelete} 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.map((submission) => (
              <MvContributionCard
                key={submission.id}
                title={submission.title}
                description={submission.description}
                file={submission.file}
                type={submission.type}
                onPreview={() => handlePreview(submission.id)}
                onDelete={() => handleDelete(submission.id)}
              />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};


