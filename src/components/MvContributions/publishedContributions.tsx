import { useState, useEffect } from "react";
import { IContribution } from "../../app/Types/objects/contribution";
import { MvContributionServices } from "../../services/ContributionService";

import { MvPagination } from "../MvPlagination/MvPlagination";
import { MvCard } from "../MvCard";
import { FiSearch } from "react-icons/fi";
import { getUserData } from "../../services/AuthService";
import AdminLayout from "../../layout/AdminLayout";
import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import MvHomeLayout from "../../layout/MvHomeLayout";
import StudentLayout from "../../layout/StudentLayout";


export const MvGlobalContributions = () => {
  const [contributions, setContributions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [Layout, setLayout] = useState(() => StudentLayout);
  const [facultyId, setFacultyId] = useState<string |number | null>(null);

  useEffect(() => {
    // Get user data and set layout
    const userData = getUserData();
    if (userData) {
    
      switch(userData.role.toLowerCase()) {
        case 'marketing coordinator':
          setLayout(() => MarketingCoordinatorLayout);
          break;
        case 'admin':
          setLayout(() => AdminLayout);
          break;
        case 'marketing manager':
          setLayout(() => MarketingManagerLayout);
          break;
        case 'guest':
          setFacultyId(userData.faculty_id);
          setLayout(() => MvHomeLayout);
          break;
        default:
          setLayout(() => StudentLayout);
      }
     
        
      
    }
  }, []);
  // Fetch all contributions
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await MvContributionServices.getContributions(facultyId ? { facultyId: facultyId.toString() , published : true } : { published : true});  
        setContributions(data);
      } catch (error) {
        console.error("Error loading contributions:", error);
      }
    };

    fetchContributions();
  }, []);

  // Filter contributions based on search query
  const filteredContributions = contributions.filter(contribution =>
    contribution.name.toLowerCase().includes(searchQuery.toLowerCase())
  
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContributions = filteredContributions.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <Layout>
    <div className="max-w-screen">
      {/* Page Header */}
     
        <section className="relative h-96 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    Moonvale Creative Gallery
                  </h1>
                  <p className="text-xl text-white opacity-90 mb-8">
                    Celebrating Student Creativity Across Faculties
                  </p>
                  
                  <div className="w-full max-w-2xl bg-white rounded-lg p-2 shadow-lg flex items-center">
                    <FiSearch className="text-gray-400 mx-4" size={20} />
                    <input
                      type="text"
                      placeholder="Search contributions..."
                      className="flex-1 outline-none"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </section>

      {/* Contributions Grid */}
      <div className="grid grid-cols-1 p-8  justify-center md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {currentContributions.map(contribution => (
          <MvCard
            key={contribution.id}
            contribution={contribution}
            // onDelete={(id:number) => console.log("Delete", id)} // Add your delete logic
          />
        ))}
      </div>

      {/* Empty State */}
      {currentContributions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 
              "No contributions match your search." : 
              "No contributions available yet."
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      <MvPagination
        currentPage={currentPage}
        totalItems={filteredContributions.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        className="mt-6 justify-center"
      />
    </div>
    </Layout>
  );
};