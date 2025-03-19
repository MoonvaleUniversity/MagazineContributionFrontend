import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MvButton } from "../../components/MvButton";
import MvCard from "../../components/MvCard/MvCard";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import StudentLayout from "../../layout/StudentLayout";
import { MvContributionServices } from "../../services/ContributionService";
import {IContribution } from "../../app/Types/objects/contribution"; // Import the service

export const MvStudentSubmissionsView = () => {
  const [submissions, setSubmissions] = useState<IContribution[]>([]);
  const [view, setView] = useState<'table' | 'card'>('table'); // Toggle between table and card views
  const navigate = useNavigate();

  // Fetch contributions when the component mounts
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await MvContributionServices.getContributions();
        setSubmissions(data); // Set contributions to the state
      } catch (error) {
        console.error("Error loading submissions:", error);
      }
    };

    fetchContributions(); // Call the service to load contributions
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/edit-submission/${id}`); // Navigate to edit page
  };

  const handleDelete = (id: string) => {
    const updatedSubmissions = submissions.filter((submission) => submission.id !== id);
    setSubmissions(updatedSubmissions);
  };

  const handleCreateNew = () => {
    navigate("/create-submission"); // Navigate to the create form
  };

  return (
    <StudentLayout>
      <div className="submission-view">
        {/* Header with title and create button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Student Submissions</h2>
          <MvButton
            onClick={handleCreateNew}
            className="py-2 px-4 font-extrabold"
            variant="accent"
          >
            Create New Submission
          </MvButton>
        </div>
        <hr />
        {/* Toggle view button */}
        <div className="my-10 mb-5 flex items-center justify-between">
          <h2>{view === "table" ? "Table" : "Card"} View</h2>
          <MvButton
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
            size="sm"
            variant="primary"
          >
            Switch to {view === 'table' ? 'Card View' : 'Table View'}
          </MvButton>
        </div>

        {/* Conditional rendering of the submissions list */}
        {view === 'table' ? (
          <MvContributionTable
            contributions={submissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.map((submission) => (
              <MvCard
                key={submission.id}
                contribution={submission}
                onEdit={()=>handleEdit}
                onDelete={()=>handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
