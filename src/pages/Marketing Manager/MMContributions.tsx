import { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { MvButton } from "../../components/MvButton";
import MvContributionTable from "../../components/MvTables/MvContributionTable";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import { MvContributionServices } from "../../services/ContributionService";
import { IContribution } from "../../app/Types/objects/contribution";

import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { IClosureDate } from "../../app/MvObjects/clousuredate";
import { getClosureDateById } from "../../services/ClosureDateService";
import { MvStats } from "../../components/MvStats/MvStats";


export const MmSubmissionsView = () => {
  const [allSubmissions, setAllSubmissions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [closureFilter, setClosureFilter] = useState<string>("all");
  const [closureDates, setClosureDates] = useState<{[key: string]: IClosureDate}>({});
 // Fetch closure dates for all contributions
 useEffect(() => {
    const fetchClosureDates = async () => {
      const dates: {[key: string]: IClosureDate} = {};
      const uniqueIds = [...new Set(allSubmissions.map(c => c.closure_date_id))];
      
      await Promise.all(uniqueIds.map(async (id) => {
        try {
          const date = await getClosureDateById(id);
          dates[id] = date;
        } catch (error) {
          console.error(`Error fetching closure date ${id}:`, error);
        }
      }));
      
      setClosureDates(dates);
    };

    if (allSubmissions.length > 0) {
      fetchClosureDates();
    }
  }, [allSubmissions]);
  // Calculate open/closed status
   const isContributionOpen = (contribution: IContribution) => {
    const closureDate = closureDates[contribution.closure_date_id]?.final_closure_date;
    if (!closureDate) return false;
    return new Date(closureDate) > new Date();
  };

  // Filter submissions
  const filteredSubmissions = allSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "approved" ? submission.is_selected_for_publication : 
       !submission.is_selected_for_publication);
    const matchesClosure = closureFilter === "all" || 
      (closureFilter === "open" ? isContributionOpen(submission) : !isContributionOpen(submission));

    return matchesSearch && matchesStatus && matchesClosure;
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
    if (filterName === "status") {
      setStatusFilter(value);
    } else if (filterName === "closure") {
      setClosureFilter(value);
    }
    setCurrentPage(1);
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();

      // Filter only approved contributions from current filtered results
      const approvedSubmissions = filteredSubmissions.filter(
        (c) => c.is_selected_for_publication
      );

      if (approvedSubmissions.length === 0) {
        alert("No approved contributions available for download");
        return;
      }
  
      // Helper to fetch files with authentication
      const fetchFile = async (url: string): Promise<Blob> => {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return await response.blob();
      };

      // Process each approved contribution
      for (const contribution of approvedSubmissions) {
        const folderName = contribution.name.replace(/[^a-z0-9]/gi, "_");
        const folder = zip.folder(folderName);

        // Add document
        if (contribution.doc_url) {
          try {
            const docBlob = await fetchFile(contribution.doc_url);
            folder?.file(`document_${contribution.name}.pdf`, docBlob);
          } catch (error) {
            console.error("Error downloading document:", error);
          }
        }

        // Add images
        if (contribution.image_url?.length) {
          await Promise.all(
            contribution.image_url.map(async (url, index) => {
              try {
                const imageBlob = await fetchFile(url);
                const extension = url.split(".").pop() || "jpg";
                folder?.file(`image_${index + 1}.${extension}`, imageBlob);
              } catch (error) {
                console.error("Error downloading image:", error);
              }
            })
          );
        }
      }

      // Generate and save ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "approved_contributions.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("Failed to create download package. Please try again.");
    }
  };

  return (
    <MarketingManagerLayout>
      <div className="max-w-6xl mx-auto p-4">
        {/* Header with Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Contribution Management</h2>
          <div className="flex gap-4">
            <MvButton onClick={handleDownloadZip} variant="accent">
              Download as ZIP
            </MvButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MvStats title="Total" value={allSubmissions.length} />
          <MvStats title="Approved" value={allSubmissions.filter(s => s.is_selected_for_publication).length} />
          <MvStats title="Open" value={allSubmissions.filter(isContributionOpen).length} />
          <MvStats title="Closed" value={allSubmissions.filter(s => !isContributionOpen(s)).length} />
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
                { value: "pending", label: "Pending" }
              ]
            },
            {
              name: "closure",
              label: "Closure",
              options: [
                { value: "all", label: "All" },
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" }
              ]
            }
          ]}
          className="my-4"
        />

        {/* Contribution Table */}
        
        <MvContributionTable
  contributions={currentSubmissions}
  closureDates={closureDates}
  onDelete={()=>{}}
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