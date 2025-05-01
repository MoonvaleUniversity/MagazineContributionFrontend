import { useState, useEffect } from "react";
import { CreativeSpark } from "../app/MvObjects/creativesparks";
import { MvButton } from "../components/MvButton";
import { MvInput } from "../components/MvInput";
import { MvLoader } from "../components/MvLoader";
import { CreativeService } from "../services/CreativeService";

export const MvCreativeSparksPage = () => {
  const [sparks, setSparks] = useState<CreativeSpark[]>([]);
  const [filteredSparks, setFilteredSparks] = useState<CreativeSpark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Creative Sparks</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <MvInput
          label="Search sparks..."
          value={searchQuery}
          onChange={handleSearch}
         
        />
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <MvInput
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-100">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-100">
            Image {editMode ? "" : "*"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded-md"
            required={!editMode}
          />
        </div>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="flex gap-4 mt-6">
          <MvButton type="submit" variant="primary" disabled={loading}>
            {editMode ? "Update Spark" : "Create Spark"}
          </MvButton>
          {editMode && (
            <MvButton type="button" onClick={resetForm} variant="secondary">
              Cancel Edit
            </MvButton>
          )}
        </div>
      </form>

      {/* Sparks Grid */}
      {loading ? (
        <MvLoader />
      ) : filteredSparks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No creative sparks found. Create your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSparks.map((spark) => (
            <div
              key={spark.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
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
                <div className="flex gap-2">
                  <MvButton onClick={() => handleEdit(spark)} variant="secondary" size="sm">
                    Edit
                  </MvButton>
                  <MvButton
                    onClick={() => handleDelete(spark.id)}
                    className="bg-red-500 text-white"
                    size="sm"
                  >
                    Delete
                  </MvButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};