import { useState, useEffect } from "react";
import { FiArchive, FiCheckCircle, FiXCircle, FiPlus, FiImage, FiUsers, FiList,  FiCalendar, FiFile } from "react-icons/fi";
import MvRoutes from "../../app/MvRoutes";
import { IContribution } from "../../app/Types/objects/contribution";
import StudentLayout from "../../layout/StudentLayout";
import { getClosureDateById } from "../../services/ClosureDateService";
import { MvContributionServices } from "../../services/ContributionService";
import { useNavigate } from "react-router-dom";
import { MvButton } from "../../components/MvButton";

export const MvStudentDashboard = () => {
  const [allSubmissions, setAllSubmissions] = useState<IContribution[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<IContribution[]>([]);
  const [closureDate, setClosureDate] = useState<string>("");
  const [lastLogin, setLastLogin] = useState<string>("");
  const getStatus = (contribution: IContribution) => {
    if (contribution.is_selected_for_publication === 1) return 'approved';
    const createdAt = new Date(contribution.created_at!);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
    return diffDays > 3 ? 'rejected' : 'pending';
  };
  console.log(closureDate);
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        const userData = storedUserData ? JSON.parse(storedUserData) : null;
        
        if (userData?.id) {
          // Get ALL submissions
          const submissions = await MvContributionServices.getContributions({ userId: userData.id });
          setAllSubmissions(submissions);
          // Get first 3 for recent display
          setRecentSubmissions(submissions.splice(-3));
          setLastLogin(new Date(userData.last_login).toLocaleString());
        }

        const closureDates = await getClosureDateById(1);
        setClosureDate(new Date(closureDates.final_closure_date).toLocaleDateString());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    
    loadData();
  }, []);

  // Status calculation using ALL submissions
  const approvedCount = allSubmissions.filter(c => c.is_selected_for_publication === 1).length;
  const rejectedCount = allSubmissions.filter(c => {
    const createdAt = new Date(c.created_at!);
    const diffDays = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 3600 * 24));
    return diffDays > 3 && c.is_selected_for_publication !== 1;
  }).length;
  

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-8">
         {/* Header Section */}
         <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {lastLogin ? `Last active: ${lastLogin}` : 'Welcome to Moonvale Magazine System'}
          </p>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <FiArchive className="w-5 h-5 text-blue-600 dark:text-blue-300"/>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Total</p>
                <p className="text-2xl font-bold">{allSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-300"/>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Approved</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-300"/>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate(MvRoutes.STUDENTS.CONTRIBUTION_FORM)}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
              <span className="font-medium">New Submission</span>
            </div>
          </button>

          <button
            onClick={() => navigate(MvRoutes.CANVAS_CORNER)}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <FiImage className="w-5 h-5 text-green-600 dark:text-green-400"/>
              <span className="font-medium">Canvas Corner</span>
            </div>
          </button>

          <button
          onClick={() => navigate(MvRoutes.PUBLIC_CONTRIBUTION)}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
              <span className="font-medium">View Public Work</span>
            </div>
          </button>

          <button
            onClick={() => navigate(MvRoutes.STUDENTS.SUBMISSIONS)}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <FiList className="w-5 h-5 text-orange-600 dark:text-orange-400"/>
              <span className="font-medium">My Submissions</span>
            </div>
          </button>
        </div>

        {/* Recent Contributions */}
      {/* Contributions Grid */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Contributions</h2>
            {recentSubmissions.length > 0 && (
              <MvButton
                onClick={() => navigate(MvRoutes.STUDENTS.SUBMISSIONS)}
                className="font-bold dark:font-bold text-sm" size="sm" variant="accent"
              >
                View All →
              </MvButton>
            )}
          </div>

          
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-full mx-auto">
                <FiFile className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Contributions Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Get started by submitting your first magazine contribution
                </p>
                <button
                  onClick={() => navigate(MvRoutes.STUDENTS.CONTRIBUTION_FORM)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-5 h-5 mr-2" />
                  Create First Submission
                </button>
              </div>
            </div>
          ) : (  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSubmissions.map((submission) => (
              <div 
              key={submission.id}
              onClick={() => navigate("/contributions/"+submission.id)}
              className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* Image Section */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={submission.image_url?.[0].image_url || '/src/Assets/images/404.jpeg'}
                  alt={submission.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-medium truncate"> {/* Added truncate */}
                    {submission.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                    getStatus(submission) === 'approved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                  }`}>
                    {getStatus(submission)}
                  </span>
                </div>

                {/* Date Only */}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="flex-shrink-0" />
                    <span>
                      {new Date(submission.created_at!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            ))}
             </div> )}
          </div>
        </div>
      
    </StudentLayout>
  );
};