import { useState, useEffect } from "react";
import { CreativeSpark } from "../app/MvObjects/creativesparks";
import { MvButton } from "../components/MvButton";
import { MvInput } from "../components/MvInput";
import { MvLoader } from "../components/MvLoader";
import { CreativeService } from "../services/CreativeService";
import StudentLayout from "../layout/StudentLayout";
import AdminLayout from "../layout/AdminLayout";
import MarketingCoordinatorLayout from "../layout/MarketingCoordinatorLayout";
import MarketingManagerLayout from "../layout/MarketingManagerLayout";
import MvHomeLayout from "../layout/MvHomeLayout";
import { FiAlertCircle, FiX } from "react-icons/fi";

export const MvCreativeSparksPage = () => {
  const [sparks, setSparks] = useState<CreativeSpark[]>([]);
  const [filteredSparks, setFilteredSparks] = useState<CreativeSpark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [Layout, setLayout] = useState(() => StudentLayout);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedSpark, setSelectedSpark] = useState<CreativeSpark | null>(null);
  const [userRole, setUserRole] = useState("");
  

  const fetchSparks = async () => {
    try {
      setLoading(true);
      const response = await CreativeService.fetchSparks();
      setSparks(response);
      setFilteredSparks(response);
    } catch (err) {
      console.error(err);
      setError(`Failed to load creative sparks`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem("userData") || sessionStorage.getItem("userData");
        if (storedUser) {
          const user = JSON.parse(storedUser);
         
          setUserRole(user.role.toLowerCase());
          console.log(user.role.toLowerCase());
          switch(user.role.toLowerCase()) {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    fetchSparks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (files: File | File[] | null) => {
    const file = Array.isArray(files) ? files[0] : files;
    setFormData((prev) => ({ ...prev, image: file instanceof File ? file : null }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.content.trim()) return "Content is required";
    if (!editMode && !formData.image) return "Image is required for new entries";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      setLoading(true);
      setError(null);

      if (editMode && currentId) {
        data.append("_method", "PUT");
        await CreativeService.updateSpark(data, currentId);
      } else {
        await CreativeService.createSpark(data);
      }

      await fetchSparks();
      resetForm();
    } catch (err) {
      setError(`${editMode ? "Update failed" : "Creation failed"}: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (spark: CreativeSpark) => {
    setFormData({
      title: spark.title,
      content: spark.content,
      image: null,
    });
    setEditMode(true);
    setCurrentId(spark.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this spark?")) return;

    try {
      setLoading(true);
      await CreativeService.deleteSpark(id);
      await fetchSparks();
    } catch (err) {
      setError(`Deletion failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", image: null });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredSparks(
      sparks.filter(
        (spark) =>
          spark.title.toLowerCase().includes(query) ||
          spark.content.toLowerCase().includes(query)
      )
    );
  };

  const handleCardClick = (spark: CreativeSpark) => {
    setSelectedSpark(spark);
  };

  return (
    <Layout>
       {/* Hero Section */}
  <div className="relative isolate overflow-hidden pt-24 pb-16 sm:py-32 rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-300 dark:from-indigo-500 dark:to-purple-800">
    {/* Animated background pattern */}
    <div 
      className="absolute inset-0 -z-10 opacity-20 dark:opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    ></div>

    {/* Floating grid animation */}
    <div className="absolute inset-0 before:absolute before:left-1/2 before:top-0 before:h-[400px] before:w-[600px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-blue-200 before:to-transparent before:blur-3xl before:content-[''] dark:before:from-blue-900/30"></div>

    <div className="mx-auto max-w-3xl text-center relative z-10">
      {/* Main title with gradient text */}
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        Ignite Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:text-black bg-clip-text text-transparent">Creative Sparks</span>
      </h1>
      
      {/* Description */}
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        Share, explore, and collaborate on brilliant ideas that light up our community. 
        Discover innovative concepts and contribute your own flashes of inspiration.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex items-center justify-center gap-x-6">
        {userRole === "Admin" && (
          <MvButton
            variant="primary"
            onClick={() => document.getElementById('spark-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="group transition-all"
          >
            Create New Spark
            <span className="ml-2 opacity-70 group-hover:opacity-100 transition-opacity">✨</span>
          </MvButton>
        )}
        
        <MvButton
          variant="secondary"
          onClick={() => document.getElementById('sparks-grid')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explore Ideas
          <span className="ml-2">→</span>
        </MvButton>
      </div>
    </div>
 </div>

 {userRole === "admin" && (
  <form 
    onSubmit={handleSubmit} 
    className="mb-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
    id="spark-form"
  >
    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
      {editMode ? "Edit Spark" : "Create New Spark"}
    </h2>

    <div className="space-y-6">
      <MvInput
        label="Title *"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className="bg-gray-50 dark:bg-gray-700/50"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg 
                    bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-primary/50
                    focus:border-primary placeholder-gray-400 dark:placeholder-gray-500
                    text-gray-900 dark:text-gray-100 resize-none transition-all"
          rows={5}
          placeholder="Share your creative ideas..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Image {editMode ? "(Optional)" : "*"}
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-600 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4 file:rounded-lg
                        file:border-0 file:text-sm file:font-medium
                        file:bg-primary/10 file:text-primary hover:file:bg-primary/20
                        dark:file:bg-primary/20 dark:file:text-primary-light
                        transition-colors"
              required={!editMode}
            />
          </label>
          {formData.image && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formData.image.name}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-300">
          <FiAlertCircle className="flex-shrink-0 w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <MvButton 
          type="submit" 
          variant="primary" 
          disabled={loading}
          className="flex-1 justify-center py-3"
        >
          {loading ? (
            <MvLoader/>
          ) : editMode ? (
            "Update Spark"
          ) : (
            "Create Spark"
          )}
        </MvButton>
        
        {editMode && (
          <MvButton 
            type="button" 
            onClick={resetForm}
            variant="secondary"
            className="flex-1 justify-center py-3"
          >
            Cancel
          </MvButton>
        )}
      </div>
    </div>
  </form>
)}
        {selectedSpark && (
          <div className="fixed max-h-[100vh] overflow-y-scroll inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl p-6 transform transition-transform duration-300 translate-x-0 z-50">
            <div className="flex justify-between max-sm:pt-10  items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-gray-100">{selectedSpark.title}</h2>
              <button
                onClick={() => setSelectedSpark(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <img
              src={selectedSpark.image_url}
              alt={selectedSpark.title}
              className="w-full h-64 object-cover mb-6 rounded-lg bg-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-image.jpg";
              }}
            />
            <div className="prose  dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
              {selectedSpark.content}
            </div>
          </div>
        )}

        <div className="my-6">

          <MvInput
            label="Search sparks..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <MvLoader />
        ) : filteredSparks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No creative sparks found. {userRole === "admin" && "Create your first one!"}
          </div>
        ) : (
          <div id="sparks-grid" className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSparks.map((spark) => (
              <div
                key={spark.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
                  selectedSpark?.id === spark.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleCardClick(spark)}
              >
                <img
                  src={spark.image_url}
                  alt={spark.title}
                  className="w-full h-48 object-cover bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    {spark.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {spark.content}
                  </p>
                  {userRole === "admin" && (
                    <div className="flex gap-2">
                      <MvButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(spark);
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </MvButton>
                      <MvButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(spark.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                      >
                        Delete
                      </MvButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      
    </Layout>
  );
};