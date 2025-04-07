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
    return diffDays > 3 ? 'rejected' : 'pending';
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
          userId = userData?.id || '';
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
  
  const handleDelete = async (id: string) => {
    try {
      // Confirm deletion
      const confirmDelete = window.confirm("Are you sure you want to delete this submission?");
      if (!confirmDelete) return;

      // Call the delete service
      await MvContributionServices.deleteContribution(id);
      
      // Optimistic UI update
      setAllSubmissions(prev => prev.filter(sub => sub.id !== id));
      
      // Optional: Show success feedback
      alert("Submission deleted successfully!");
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission. Please try again.");
    }
  };

  const handleCreateNew = () => navigate(MvRoutes.STUDENTS.CONTRIBUTION_FORM);


  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto p-4">
        {/* Page Header */}
        <div className=" flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Student Submissions</h2>
          <MvButton onClick={handleCreateNew} className="py-2 px-4 font-extrabold" variant="accent">
            + New Submission
          </MvButton>
        </div>

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

        {/* View Toggle Button */}
        <div className="flex items-center justify-between my-4">
          <h2 className="text-lg font-medium">{view === "table" ? "Table View" : "Card View"}</h2>
          <MvButton
            variant="secondary"
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
            className="border-none  transition"
            size="sm"
          >
            {view === 'table' ? '📄 Switch to Card View' : '📋 Switch to Table View'}
          </MvButton>
        </div>

        {/* Content Display */}
        {view === 'table' ? (
          <MvContributionTable
            contributions={currentSubmissions}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubmissions.map((submission) => (
              <MvCard
                key={submission.id}
                contribution={submission}
               
                onDelete={() => handleDelete(submission.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
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