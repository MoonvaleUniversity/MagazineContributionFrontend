import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MvButton } from "../../components/MvButton";
import MvCard from "../../components/MvCard/MvCard";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import StudentLayout from "../../layout/StudentLayout";
import { MvContributionServices } from "../../services/ContributionService";
import {IContribution } from "../../app/Types/objects/contribution"; // Import the service
import MvRoutes from "../../app/MvRoutes";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";


export const MvStudentSubmissionsView = () => {
  const [allSubmissions, setAllSubmissions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<'table' | 'card'>('table');
  const navigate = useNavigate();

  // Calculate submission status
  const getStatus = (contribution: IContribution) => {
    if (contribution.is_selected_for_publication === 1) return 'approved';
    const createdAt = new Date(contribution.created_at!);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
    return diffDays > 14 ? 'rejected' : 'pending';
  };

  // Filter and search submissions
  const filteredSubmissions = allSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || getStatus(submission) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch all submissions
  useEffect(() => {
    const fetchContributions = async () => {
      let userId = '';
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          userId = userData?.id.p || '';
        } catch (error) {
          console.error('Error parsing userData:', error);
        }
      }

      try {
        const data = await MvContributionServices.getContributions({ userId });
        setAllSubmissions(data);
      } catch (error) {
        console.error("Error loading submissions:", error);
      }
    };

    fetchContributions();
  }, []);

  // Handlers
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  const handleFilterChange = (filterName: string, value: string) => {
    if (filterName === "status") {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };
  const handleEdit = (id: string) => navigate(`/edit-submission/${id}`);
  const handleDelete = (id: string) => {
    setAllSubmissions(prev => prev.filter(sub => sub.id !== id));
  };
  const handleCreateNew = () => navigate(MvRoutes.STUDENTS.CONTRIBUTION_FORM);
  const handlePreview = (contribution: IContribution) => {
    // Implement preview logic
    console.log("Preview:", contribution);
  };

  return (
    <StudentLayout>
      <div className="submission-view">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Student Submissions</h2>
          <MvButton onClick={handleCreateNew} className="py-2 px-4 font-extrabold" variant="accent">
            Create New Submission
          </MvButton>
        </div>
        <hr />

        <SearchFilter
          placeholder="Search submissions..."
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filters={[
            {
              name: "status",
              label: "Status",
              options: [
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" }
              ]
            }
          ]}
          className="my-4"
        />

        <div className="my-4 flex items-center justify-between">
          <h2 className="text-lg">{view === "table" ? "Table" : "Card"} View</h2>
          <MvButton
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
            size="sm"
            variant="primary"
          >
            Switch to {view === 'table' ? 'Card View' : 'Table View'}
          </MvButton>
        </div>

        {view === 'table' ? (
          <MvContributionTable
            contributions={currentSubmissions}
            onEdit={handleEdit}
            onPreview={handlePreview}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSubmissions.map((submission) => (
              <MvCard
                key={submission.id}
                contribution={submission}
                onEdit={() => handleEdit(submission.id)}
                onDelete={() => handleDelete(submission.id)}
              />
            ))}
          </div>
        )}

        <MvPagination
          currentPage={currentPage}
          totalItems={filteredSubmissions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </StudentLayout>
  );
};