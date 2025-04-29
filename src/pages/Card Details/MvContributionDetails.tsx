import { renderAsync } from "docx-preview";
import { useRef, useState, useEffect } from "react";
import { FiArrowLeft, FiThumbsUp, FiThumbsDown, FiBookmark, FiEdit, FiTrash, FiMessageSquare } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { IContribution } from "../../app/Types/objects/contribution";
import AdminLayout from "../../layout/AdminLayout";
import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import StudentLayout from "../../layout/StudentLayout";
import {  getUserData } from "../../services/AuthService";
import { MvContributionServices } from "../../services/ContributionService";
import MvHomeLayout from "../../layout/MvHomeLayout";
import { MvLoader } from "../../components/MvLoader";
import Modal from "react-modal";
import { toast } from "react-toastify";

const MvContributionDetailsPage: React.FC = () => {
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contribution, setContribution] = useState<IContribution>({} as IContribution);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  const [bookmarked, setBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [Layout, setLayout] = useState(() => StudentLayout);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      switch (userData.role.toLowerCase()) {
        case 'marketing coordinator': setLayout(() => MarketingCoordinatorLayout); break;
        case 'admin': setLayout(() => AdminLayout); break;
        case 'marketing manager': setLayout(() => MarketingManagerLayout); break;
        case 'guest': setLayout(() => MvHomeLayout); break;
        default: setLayout(() => StudentLayout);
      }
    }
  }, []);

  useEffect(() => {
    const fetchContribution = async () => {
      try {
        if (!id) return;
        const data = await MvContributionServices.getContributionById(id);
        setContribution(data);
        setVotes({ up: 0, down: 0 }); // Replace with actual votes from API
        setComments([]); // Replace with actual comments from API
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
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          if (docxContainerRef.current) renderAsync(arrayBuffer, docxContainerRef.current);
        })
        .catch(console.error);
    }
  }, [contribution]);

  const handleVote = (type: 'up' | 'down') => {
    setVotes(prev => ({ ...prev, [type]: prev[type] + (prev[type] > 0 ? -1 : 1) }));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [...prev, newComment]);
    setNewComment("");
    toast.success("Comment added!");
  };

  const handleDeleteContribution = async () => {
    try {
      // await MvContributionServices.deleteContribution(id!);
      console.log("Contribution deleted!");
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete contribution", error);
    }
  };

  const isApproved = contribution?.is_selected_for_publication === 1;
  const isOwner = true; // Replace with actual ownership check

  if (loading) return <Layout><MvLoader /></Layout>;
  if (error) return <Layout><div className="alert alert-error">{error}</div></Layout>;

  return (
    <Layout>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="btn btn-ghost text-primary">
            <FiArrowLeft className="mr-2" /> Back
          </button>
          {!isApproved && isOwner && (
            <div className="flex gap-2">
              <button className="btn btn-primary-outline">
                <FiEdit className="mr-2" /> Edit
              </button>
              <button className="btn btn-error-outline" onClick={() => setShowDeleteModal(true)}>
                <FiTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                {contribution.user.faculty.image_url && (
                  <img
                    src={contribution.user.faculty.image_url}
                    alt="Faculty"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {contribution.user.faculty.name}
                  </h2>
                  <p className="text-primary dark:text-primary-300">Faculty Contributions</p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {contribution.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
                <span>By {contribution.user.name}</span>
                <span>•</span>
                <span>{new Date(contribution.created_at).toLocaleDateString()}</span>
              </div>

              {contribution.image_url.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {contribution.image_url.map((img) => (
                    <div
                      key={img.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                      onClick={() => setSelectedImage(img.image_url)}
                    >
                      <img
                        src={img.image_url}
                        alt="Contribution"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Document Preview</h3>
                  <a
                    href={contribution.doc_url}
                    download
                    className="btn btn-primary btn-sm"
                  >
                    Download
                  </a>
                </div>
                <div ref={docxContainerRef} className="min-h-[400px] rounded-lg overflow-hidden" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {isApproved && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote('up')}
                      className={`p-2 rounded-lg ${votes.up ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-700'}`}
                    >
                      <FiThumbsUp className="text-xl" />
                    </button>
                    <span className="font-medium">{votes.up}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
 <button
                      onClick={() => handleVote('down')}
                      className={`p-2 rounded-lg ${votes.down ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-gray-700'}`}
                    >
                      <FiThumbsDown className="text-xl" />
                    </button>
                    <span className="font-medium">{votes.down}</span>
                  </div>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-lg ml-auto ${bookmarked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    <FiBookmark className="text-xl" />
                  </button>
                </div>
              </div>
            )}

            {isApproved ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiMessageSquare /> Comments ({comments.length})
                </h3>

                <div className="space-y-6 mb-6">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="font-medium text-primary mb-2">Anonymous User</div>
                      <p className="text-gray-700 dark:text-gray-300">{comment}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4"
                    placeholder="Add a comment..."
                    rows={3}
                  />
                  <button type="submit" className="btn btn-primary">
                    Post Comment
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  This contribution is pending approval. Comments and voting will be available once approved.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-h-[90vh] max-w-full object-contain"
          />
        )}
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="text-center p-6">
          <h3 className="text-xl font-bold mb-4">Delete Contribution?</h3>
          <p className="mb-6">Are you sure you want to delete this contribution? This action cannot be undone.</p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteContribution}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MvContributionDetailsPage;