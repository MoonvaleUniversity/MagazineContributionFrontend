/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { createPageView } from "../../services/userService";
import { useLocation, useParams } from "react-router-dom";

export const MvGlobalContributions = () => {
  const [contributions, setContributions] = useState<IContribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [Layout, setLayout] = useState(() => StudentLayout);
  const [facultyId, setFacultyId] = useState<string |number | null>(null);
  


  const userData = getUserData();
  const { pageId } = useParams();
  const [view_count, setMinutesElapsed] = useState(0);

  const location = useLocation();
  const { name } = location.state || {};
  const ONE_MINUTE = 6000; // 1 minute in milliseconds

  // Track page view time
  useEffect(() => {
    // console.log(userData?.id, pageId)
    if (!userData || !pageId || !name) return; 
    let view_count = 0;  
    // console.log(userData,pageId,name)

    const intervalId = setInterval(() => {
      view_count = 1;
      const viewedKey = `viewed_${userData.id}_${pageId}`;
      // Check if already viewed in this session
      const alreadyViewed = sessionStorage.getItem(viewedKey);
      sessionStorage.removeItem(viewedKey);
      setMinutesElapsed(view_count);
      try{
        if(!alreadyViewed){
          createPageView({
          userId: userData.id,
          pageName : name,
          pageId: pageId,
          viewCount: 1,
        })
          .then((res) => {
            console.log("View recorded successfully:", res);
            sessionStorage.setItem(viewedKey, "true"); // Prevent duplicate views during session
          })
          .catch((err) => {
            console.error("Failed to record view:", err);
          });
      } else {
        console.log("User already viewed this page in this session.");
      }
        console.log("Successful Data Post")
      }catch(error){
        console.log("Error" , error)
      }
    }, ONE_MINUTE);


    return () => {
      clearInterval(intervalId);
    };
  }, [userData, pageId]);

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
                  
                  <div className="w-full max-w-2xl bg-white max-sm:w-11/12 rounded-lg p-2 shadow-lg flex items-center">
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