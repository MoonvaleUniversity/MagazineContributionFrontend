import { useState, useEffect } from "react";

import { MvButton } from "../../components/MvButton";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import { MvContributionServices } from "../../services/ContributionService";
import { IContribution } from "../../app/Types/objects/contribution";

import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { MvStats } from "../../components/MvStats/MvStats";
import { getAllFaculties } from "../../services/FacultyService";

export const MmSubmissionsView = () => {
  const [allSubmissions, setAllSubmissions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [facultyFilter, setFacultyFilter] = useState<string>("all"); // Add faculty filter state
  const [faculties, setFaculties] = useState<Array<{ id: number; name: string }>>([]); // Add faculties state

  // Fetch faculties on component mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const facultiesData = await getAllFaculties();
        setFaculties(facultiesData);
      } catch (error) {
        console.error("Failed to load faculties:", error);
      }
    };
    fetchFaculties();
  }, []);

  const filteredSubmissions = allSubmissions.filter((submission) => {
    const matchesSearch = submission.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved"
        ? submission.is_selected_for_publication
        : !submission.is_selected_for_publication);
    const matchesFaculty =
      facultyFilter === "all" || submission.user.faculty_id?.toString() === facultyFilter;

    return matchesSearch && matchesStatus && matchesFaculty;
  });

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
    switch (filterName) {
      case "status":
        setStatusFilter(value);
        break;
      case "faculty":
        setFacultyFilter(value);
        break;
    }
    setCurrentPage(1);
  };
  const handleDownloadZip = () => {
    window.location.href = "http://127.0.0.1:8080/";
  };
  return (
    <MarketingManagerLayout>
      <div className="max-w-6xl mx-auto p-4">
        {/* Header with Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Contribution Management</h2>
          <div className="flex gap-4">
            <MvButton onClick={handleDownloadZip} variant="accent">
            Go to file Management
            </MvButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MvStats title="Total" value={allSubmissions.length} />
          <MvStats
            title="Approved"
            value={allSubmissions.filter((s) => s.is_selected_for_publication).length}
          />
        </div>

        {/* Search and Filters */}
        <SearchFilter
          placeholder="Search contributions..."
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filters={[
            {
              name: "status",
              label: "Status",
              options: [
                { value: "all", label: "All Statuses" },
                { value: "approved", label: "Approved" },
                { value: "pending", label: "Pending" },
              ],
            },
            {
              name: "faculty",
              label: "Faculty",
              options: [
                { value: "all", label: "All Faculties" },
                ...faculties.map((f) => ({ value: f.id.toString(), label: f.name })),
              ],
            },
          ]}
          className="my-4"
        />

        {/* Contribution Table */}
        <MvContributionTable
          contributions={currentSubmissions}
          onDownloadZip={handleDownloadZip}
          isMarketingManager
        />

        {/* Pagination */}
        <MvPagination
          currentPage={currentPage}
          totalItems={filteredSubmissions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </MarketingManagerLayout>
  );
};