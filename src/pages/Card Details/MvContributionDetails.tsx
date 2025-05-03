import { useState, useEffect } from "react";
import { FiArrowLeft, FiThumbsUp, FiThumbsDown, FiBookmark, FiEdit, FiTrash, FiMessageSquare, FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { IComment, IContribution } from "../../app/Types/objects/contribution";
import AdminLayout from "../../layout/AdminLayout";
import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import StudentLayout from "../../layout/StudentLayout";
import { getUserData } from "../../services/AuthService";
import { MvContributionServices } from "../../services/ContributionService";
import MvHomeLayout from "../../layout/MvHomeLayout";
import { MvLoader } from "../../components/MvLoader";
import { getUser } from "../../services/userService";
import { MvModal } from "../../components/MvModal";
import { MvButton } from "../../components/MvButton/MvButton";

const MvContributionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contribution, setContribution] = useState<IContribution>({} as IContribution);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [Layout, setLayout] = useState(() => StudentLayout);
  const userData = getUserData();

  useEffect(() => {
    if (userData) {
      switch (userData.role.toLowerCase()) {
        case 'marketing coordinator': setLayout(() => MarketingCoordinatorLayout); break;
        case 'admin': setLayout(() => AdminLayout); break;
        case 'marketing manager': setLayout(() => MarketingManagerLayout); break;
        case 'guest': setLayout(() => MvHomeLayout); break;
        default: setLayout(() => StudentLayout);
      }
    }
  }, [userData]);

  useEffect(() => {
    const fetchContribution = async () => {
      try {
        if (!id) return;
        const data = await MvContributionServices.getContributionById(id);
        setContribution(data);
        setComments(data.comments || []);

        if (userData) {
          const user = await getUser(userData.id);
          setBookmarked(user.saved_contributions?.some(sc => sc.id === data.id) || false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contribution");
      } finally {
        setLoading(false);
      }
    };

    fetchContribution();
  }, [id]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMsg || error) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, error]);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!userData || !id) return;
    try {
      await MvContributionServices.vote.add(Number(id), userData.id, type);
      const updated = await MvContributionServices.getContributionById(id);
      setContribution(updated);
      setSuccessMsg(`Vote ${type} submitted!`);
    } catch (error) {
      console.error(error);
      setError("Failed to submit vote");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userData || !id) return;

    try {
     await MvContributionServices.comment.add(
        Number(id),
        userData.id,
        newComment
      );
      const newdata:IComment = {
        id : userData.id,
        content : newComment,
        user_id : userData.id,
        contribution_id : Number(id),
        user: {
          id: userData.id,
          name: userData.name,
          role: userData.role,
          faculty_id: userData.faculty_id,
                 },
                 created_at: new Date().toISOString(),

      }
      setComments((prev) => [...prev, newdata]);
      setNewComment("");
      setSuccessMsg("Comment added!");
    } catch (error) {
      console.error(error);
      setError("Failed to add comment");
    }
  };

  const handleBookmark = async () => {
    if (!userData || !id) return;
    try {
      await MvContributionServices.toggleSave(Number(id), userData.id);
      const user = await getUser(userData.id);
      if(localStorage.getItem("userData")){
        localStorage.setItem("userData", JSON.stringify(user));
      }
      if(sessionStorage.getItem("userData")){
        sessionStorage.setItem("userData", JSON.stringify(user));
      }
      console.log(user.saved_contributions );
      setBookmarked(user.saved_contributions?.some(sc => sc.id === contribution.id) || false);
      setSuccessMsg(bookmarked ? "Removed from bookmarks" : "Bookmarked!");
    } catch (error) {
      console.error(error);
      setError("Failed to update bookmark");
    }
  };

  const handleDeleteContribution = async () => {
    try {
      if (!id) return;
      await MvContributionServices.deleteContribution(id);
      setSuccessMsg("Contribution deleted!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      setError("Failed to delete contribution");
    }
  };
  const handleCommentDelete = async (contributionid:number , commentId: number) => {
    try {
      await MvContributionServices.comment.delete( contributionid,commentId);
      setComments(prev => prev.filter(c => c.user_id !== commentId));
      setSuccessMsg("Comment deleted successfully");
    } catch (error) {
      console.error(error); 
      setError("Failed to delete comment");
    }
  };
  // Derived vote states
  const hasUpvoted = contribution.votes?.some(v => 
    v.type === 'upvote' && v.id === userData?.id
  );
  const hasDownvoted = contribution.votes?.some(v => 
    v.type === 'downvote' && v.id === userData?.id
  );
  const upvotes = contribution.votes?.filter(v => v.type === 'upvote').length || 0;
  const downvotes = contribution.votes?.filter(v => v.type === 'downvote').length || 0;

  const isApproved = contribution?.is_selected_for_publication === 1;
  const isOwner = userData?.id === contribution.user_id;

  if (loading) return <Layout><MvLoader /></Layout>;

  return (
    <Layout>
      <header className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
        <FiArrowLeft className="w-5 h-5" /> 
        <span className="font-medium">Back</span>
        </button>
        {!isApproved && isOwner && (
        <div className="flex gap-4">
          <button 
          className="flex items-center gap-2 px-4 py-2 border border-primary-700 text-primary-500 font-bold hover:text-white bg-secondary-300 rounded-3xl hover:bg-primary  hover:bg-purple-500  transition-colors"
          >
          <FiEdit className="w-5 h-5" /> 
          <span>Edit</span>
          </button>
          <button 
          className="flex items-center gap-2 px-4 py-2 border font-bold border-black text-red-200 dark:text-black rounded-4xl hover:bg-red-500 dark:bg-red-200 hover:text-white bg-rose-500 transition-colors"
          onClick={() => setShowDeleteModal(true)}
          >
          <FiTrash className="w-5 h-5" /> 
          <span>Delete</span>
          </button>
        </div>
        )}
      </div>
      </header>
       {/* Messages Container */}
{(successMsg || error) && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
    {successMsg && (
      <div className="mb-4 p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600">
        <div className="flex items-center">
          <FiCheckCircle className="h-5 w-5 text-green-500 dark:text-green-300 mr-3" />
          <div className="text-sm text-green-700 dark:text-green-300">
            {successMsg}
          </div>
        </div>
      </div>
    )}
    
    {error && (
      <div className="mb-4 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600">
        <div className="flex items-center">
          <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-300 mr-3" />
          <div className="text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        </div>
      </div>
    )}
  </div>
)}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
       

              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {contribution.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
                <span>By {contribution.user.name}</span>
                <span>•</span>
                <span>{new Date(contribution.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                {contribution.user.faculty?.image_url && (
                  <img
                    src={contribution.user.faculty.image_url}
                    alt="Faculty"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {contribution.user.faculty?.name}
                  </h2>
                  <p className="text-primary dark:text-primary-300">Faculty Contributions</p>
                </div>
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
              </div>
            </div>
          </div>

            <div className="space-y-8">
            {isApproved && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
              <button
              onClick={() => handleVote('upvote')}
              className={`p-2 rounded-lg transition-colors hover:bg-green-200 hover:text-black ${
              hasUpvoted ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
              }`}
              >
              <FiThumbsUp className="text-xl" />
              </button>
              <span className="font-medium">{upvotes}</span>
              </div>
              
              <div className="flex items-center gap-2">
              <button
              onClick={() => handleVote('downvote')}
              className={`p-2 rounded-lg transition-colors hover:bg-red-200 hover:text-black ${
              hasDownvoted ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
              }`}
              >
              <FiThumbsDown className="text-xl" />
              </button>
              <span className="font-medium">{downvotes}</span>
              </div>

              <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg ml-auto transition-colors hover:bg-purple-200 hover:text-black ${
              bookmarked ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
              }`}
              >
              <FiBookmark className="text-xl" />
              </button>
              </div>
              </div>
            )}

{isApproved ? (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FiMessageSquare className="text-primary" /> 
        Comments ({comments.length})
      </h3>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {comments.length === 0 && "Be the first to comment!"}
      </span>
    </div>

    <div className="space-y-4 mb-6">
      {comments.map((comment) => (
        <div key={comment.id} className="group relative">
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {comment.user.name[0]}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {comment.user.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {comment.content}
              </p>
            </div>
            {/* Delete button for comments */}
            {userData?.id == comment.user_id && (
              <button 
                onClick={() => handleCommentDelete(Number(contribution.id) ,comment.user_id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Delete comment"
              >
                <FiTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>

    <form onSubmit={handleCommentSubmit} className="relative">
      <textarea
      required
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 rounded-lg p-4 pr-16
                  border border-gray-200 dark:border-gray-600
                  focus:ring-2 focus:ring-primary/50 focus:border-primary
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        placeholder="Write your thoughts..."
        rows={3}
        disabled={!!comments.find(c => c.user_id === userData?.id)}
      />
      <MvButton 
        type="submit"
        className="absolute right-4 bottom-4 !flex
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all
                   items-center gap-1"
        disabled={ !!comments.find(c => c.user_id === userData?.id)}
      >
        {comments.find(c => c.user_id === userData?.id) ? (
          <div className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4" />
            Submitted
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <FiEdit className="w-4 h-4" />
            Post Comment
          </div>
        )}
      </MvButton>
    </form>
  </div>
) : (
  <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-6 text-center
                border border-amber-200 dark:border-amber-900/30">
    <div className="flex flex-col items-center">
      <FiClock className="w-6 h-6 text-amber-500 dark:text-amber-400 mb-2" />
      <p className="text-amber-700 dark:text-amber-300 font-medium">
        Pending Approval - Commenting and voting will be available once approved
      </p>
    </div>
  </div>
)}
          </div>
        </div>
      </main>

      <MvModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Image Preview"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-h-[70vh] rounded-lg max-w-full object-contain"
          />
        )}
      </MvModal>

      <MvModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contribution"
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
      </MvModal>
    </Layout>
  );
};

export default MvContributionDetailsPage;