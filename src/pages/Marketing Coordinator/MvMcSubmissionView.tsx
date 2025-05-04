import { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import { MvContributionServices } from "../../services/ContributionService";
import { IContribution } from "../../app/Types/objects/contribution";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { MvStats } from "../../components/MvStats/MvStats";
import { MvModal } from "../../components/MvModal";
import { MvTextarea } from "../../components/MvInput";
import { useNavigate } from "react-router-dom";
import MvRoutes from "../../app/MvRoutes";

export const McSubmissionsView = () => {
  const [allSubmissions, setAllSubmissions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [reviewContent, setReviewContent] = useState("");

// Update the handleStatusChange and confirmApproval functions
const handleStatusChange = async (id: string) => {
  setSelectedSubmission(id);
  setShowApprovalModal(true);
};

const navigate = useNavigate();
const handleEdit = (id: number) => {
 
  navigate(`${MvRoutes.STUDENTS.CONTRIBUTION_FORM}/${id}`);
};
const confirmApproval = async () => {
  if (!selectedSubmission) return;
  
  try {
    // Call the publish endpoint
    await MvContributionServices.publishContribution(selectedSubmission);
    // Inside the component



    // Update local state
    setAllSubmissions(prev => prev.map(sub => 
      sub.id.toString() === selectedSubmission ? { 
        ...sub, 
        is_selected_for_publication: 1 // Set to approved status
      } : sub
    ));
  } catch (error) {
    console.error("Error updating status:", error);
  } finally {
    setShowApprovalModal(false);
    setSelectedSubmission(null);
  }
};
 // Calculate days since submission
 const getDaysPending = (createdAt: string) => {
  const createdDate = Date.parse(createdAt);
  const diffTime = Date.now() - createdDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const getStatus = (contribution: IContribution) => {
  if (contribution.is_selected_for_publication === 1) return 'approved';
  const daysPending = getDaysPending(contribution.created_at);
  return daysPending > 14 ? 'pending-overdue' : 'pending';
};
const calculateStats = () => {
  const stats = { approved: 0, pending: 0, overdue: 0 };
  allSubmissions.forEach(sub => {
    const status = getStatus(sub);
    if (status === 'approved') stats.approved++;
    if (status === 'pending') stats.pending++;
    if (status === 'pending-overdue') stats.overdue++;
  });
  return stats;
};
  // Review Functionality
  const handleReviewInit = (id: string) => {
    setSelectedSubmission(id);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedSubmission) return;

    try {
      await MvContributionServices.submitReview(
        parseInt(selectedSubmission),
        {
        
          review: reviewContent,
        
        }
      );
      alert("Review submitted successfully!");
      setReviewContent("");
      setShowReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };


  const filteredSubmissions = allSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStatus(submission);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchContributions = async () => {
      let facultyId = '';
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          facultyId = userData?.faculty_id || '';
        } catch (error) {
          console.error('Error parsing userData:', error);
        }
      }

      try {
        const data = await MvContributionServices.getContributions({facultyId});
        setAllSubmissions(data);
      } catch (error) {
        console.error("Error loading submissions:", error);
      }
    };

    fetchContributions();
  }, []);

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
      const confirmDelete = window.confirm("Are you sure you want to delete this submission?");
      if (!confirmDelete) return;
      await MvContributionServices.deleteContribution(id);
      setAllSubmissions(prev => prev.filter(sub => sub.id !== id));
      alert("Submission deleted successfully!");
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission. Please try again.");
    }
  };

  return (
    <MarketingCoordinatorLayout>
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2  gap-4 mb-6">
        <MvStats title="Total Submissions" value={allSubmissions.length} trend="neutral" />
          <MvStats title="Approved" value={calculateStats().approved} trend="positive" />
          <MvStats title="Pending (<14 days)" value={calculateStats().pending} trend="neutral" />
          <MvStats title="Pending (>14 days)" value={calculateStats().overdue} trend="negative" /> </div>

          <SearchFilter
          placeholder="Search submissions..."
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filters={[{
            name: "status",
            label: "Status",
            options: [
              { value: "all", label: "All" },
              { value: "pending", label: "Pending (<14 days)" },
              { value: "pending-overdue", label: "Pending (>14 days)" },
              { value: "approved", label: "Approved" }
            ]
          }]}
          className="my-4"
        />

        <MvContributionTable
          contributions={currentSubmissions}
          onDelete={(id) => handleDelete(id.toString())}
          onStatusChange={(id) => handleStatusChange(id.toString())}
          onReview={handleReviewInit}
          isEditing
          onEdit={handleEdit}
          isMarketingCoordinator
        />

        <MvPagination
          currentPage={currentPage}
          totalItems={filteredSubmissions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>

      <MvModal
        title="Confirm Approval"
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        className="max-w-md"
      >
        <div className="space-y-4">
          <p>Are you sure you want to approve this submission? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <MvButton variant="secondary" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </MvButton>
            <MvButton onClick={confirmApproval}>
              Confirm Approval
            </MvButton>
          </div>
        </div>
      </MvModal>

      <MvModal
        title="Submit Review"
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        className="max-w-md"
      >
        <div className="space-y-4">
          <MvTextarea
            label="Your Review"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className="min-h-[150px]"
          />
          <div className="flex justify-end gap-2">
            <MvButton variant="secondary" onClick={() => setShowReviewModal(false)}>
              Cancel
            </MvButton>
            <MvButton onClick={submitReview}>
              Submit Review
            </MvButton>
          </div>
        </div>
      </MvModal>
    </MarketingCoordinatorLayout>
  );
};