import { renderAsync } from "docx-preview";
import { useRef, useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { IContribution } from "../../app/Types/objects/contribution";
import AdminLayout from "../../layout/AdminLayout";
import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import StudentLayout from "../../layout/StudentLayout";
import { getUserData } from "../../services/AuthService";
import { MvContributionServices } from "../../services/ContributionService";
import MvHomeLayout from "../../layout/MvHomeLayout";
import { MvLoader } from "../../components/MvLoader";

const MvContributionDetailsPage: React.FC = () => {
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contribution, setContribution] = useState<IContribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [Layout, setLayout] = useState(() => StudentLayout);

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
          setLayout(() => MvHomeLayout);
          break;
        default:
          setLayout(() => StudentLayout);
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const fetchContribution = async () => {
      try {
        const data = await MvContributionServices.getContributionById(id);
        setContribution(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contribution");
      } finally {
        setLoading(false);
      }
    };

    fetchContribution();
  }, [id]);

  useEffect(() => {
    if (contribution?.doc_url) {
      fetch(contribution.doc_url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          if (docxContainerRef.current) {
            renderAsync(arrayBuffer, docxContainerRef.current);
          }
        })
        .catch((error) => {
          console.error("Error rendering document:", error);
        });
    }
  }, [contribution]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page in history
  };

  if (loading) {
    return (
      <Layout>
        <MvLoader/>
        <div className="text-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading contribution details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-error max-w-2xl mx-auto mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </Layout>
    );
  }

  return (
<Layout>
  {/* Header with Back Button */}
  <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 border-b dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <button
        onClick={handleBack}
        className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <FiArrowLeft className="mr-2 h-5 w-5" />
        <span className="font-medium">Back to Contributions</span>
      </button>
    </div>
  </header>

  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {contribution?.name}
            </h1>
            
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Submitted by</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-200">
                  {contribution?.user.name}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Submitted at</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-200">
                  {contribution?.created_at ? 
                    new Date(contribution.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Faculty</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-200">
                  {contribution?.user.faculty.name}
                </dd>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {contribution?.image_url && contribution.image_url.length > 0 && (
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Images
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contribution.image_url.map((img) => (
                  <div 
                    key={img.id}
                    className="group relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={img.image_url}
                      alt={`Contribution image ${img.id}`}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Document Download
            </h2>
            {contribution?.doc_url ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        {/* Document icon */}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {contribution.name}.docx
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {contribution.user.faculty.name} •{' '}
                          {new Date(contribution.created_at).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = contribution.doc_url;
                      link.download = `${contribution.name}.docx`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No document available for download
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>

  );
};

export default MvContributionDetailsPage;