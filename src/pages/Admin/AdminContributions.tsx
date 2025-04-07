import { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import MvCard from "../../components/MvCard/MvCard";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import AdminLayout from "../../layout/AdminLayout";
import { MvContributionServices } from "../../services/ContributionService";
import { IContribution } from "../../app/Types/objects/contribution";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { MvStats } from "../../components/MvStats/MvStats";

export const AdminSubmissionsView = () => {
  const [allSubmissions, setAllSubmissions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<'table' | 'card'>('table');

  const getStatus = (contribution: IContribution) => {
    if (contribution.is_selected_for_publication === 1) return 'approved';
    if (contribution.is_selected_for_publication === 0) return 'rejected';
    return 'pending';
  };

  const getDaysSinceCreation = (contribution: IContribution) => {
    const createdAt = new Date(contribution.created_at!);
    const now = new Date();
    return Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
  };

  const filteredSubmissions = allSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStatus(submission);
    const days = getDaysSinceCreation(submission);
    
    let matchesStatus = false;
    if (statusFilter === "all") {
      matchesStatus = true;
    } else if (statusFilter === "overdue") {
      matchesStatus = status === 'pending' && days > 14;
    } else {
      matchesStatus = status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const calculateStats = () => {
    const stats = { 
      approved: 0, 
      rejected: 0, 
      pending: 0,
      overdue: 0 
    };
    
    allSubmissions.forEach(sub => {
      const status = getStatus(sub);
      if (status === 'approved') stats.approved++;
      else if (status === 'rejected') stats.rejected++;
      else {
        stats.pending++;
        if (getDaysSinceCreation(sub) > 14) stats.overdue++;
      }
    });
    
    return stats;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch all submissions
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await MvContributionServices.getContributions();
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


  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
    <MvStats title="Total" value={allSubmissions.length} trend="neutral" />
    <MvStats title="Approved" value={calculateStats().approved} trend="positive" />
    <MvStats title="Rejected" value={calculateStats().rejected} trend="negative" />
    <MvStats title="Pending" value={calculateStats().pending} trend="neutral" />
    <MvStats title="Overdue" value={calculateStats().overdue} trend="negative" />
  </div>               

        {/* Search and Filter */}
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
                { value: "rejected", label: "Rejected" },
                { value: "overdue", label: "Without Comment (14+ days)" }
              ]
            }
          ]}
          className="my-4"
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between my-4">
          <h2 className="text-lg font-medium">{view === "table" ? "Table View" : "Card View"}</h2>
          <MvButton
            variant="secondary"
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
            className="border-none transition"
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
             isAdmin
        
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
    </AdminLayout>
  );
};