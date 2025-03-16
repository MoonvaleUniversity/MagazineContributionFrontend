import { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import { MvInput } from "../../components/MvInput";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import { getAllFaculties, updateFaculty, createFaculty, getFacultyById, deleteFaculty } from "../../services/FacultyService";
import { MvImageUpload } from "../../components/MvInput/MvImageUpload";
import { ResponseFaculty, IFaculty } from "../../app/MvObjects/faculty";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";


export const MMFaculty : React.FC = () => {
  const [faculties, setFaculties] = useState<ResponseFaculty[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<ResponseFaculty[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IFaculty>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    const filtered = faculties.filter((faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaculties(filtered);
  }, [searchQuery, faculties]);

  const fetchFaculties = async () => {
    try {
      const data = await getAllFaculties();
      setFaculties(data || []);
      setFilteredFaculties(data || []);
    } catch (err) {
      setError("Failed to load faculties.");
      console.error(err);
      setFaculties([]);
      setFilteredFaculties([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setFormData({ ...formData, image_url: file });
    }
  };

  const prepareFormData = (): FormData => {
    const data = new FormData();
  
    data.append("name", formData.name || "");
  
    // Append the image file if it exists
    if (formData.image_url && formData.image_url instanceof File) {
      data.append("image", formData.image_url);
    }
  
    return data;
  };
  
  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      setError("Faculty Name is required.");
      return;
    }
  
    setCreateLoading(true);
    try {
      const submitData = prepareFormData();
      console.log("FormData contents:", Array.from(submitData.entries()));
  
      if (editingId) {
        await updateFaculty(editingId, submitData);
      } else {
        await createFaculty(submitData);
      }
  
      setModalOpen(false);
      fetchFaculties();
      setFormData({});
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError("Failed to save faculty.");
      
        console.error("Server error details:", err);
     
    } finally {
      setCreateLoading(false);
    }
  };
  const handleEdit = async (id: number) => {
    try {
      const faculty = await getFacultyById(id);
      console.log("Fetched faculty:", faculty); // Debugging
      if (!faculty || !faculty.name) {
        setError("Faculty data is incomplete.");
        return;
      }
      setEditingId(id);
      setFormData(faculty);
    
      setModalOpen(true);
    } catch (err) {
      setError("Failed to fetch faculty details.");
      console.error(err);
    }
  };
  
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const success = await deleteFaculty(id);
      if (success) {
        fetchFaculties();
        setError(null);
        alert("Faculty deleted successfully!");
      } else {
        throw new Error("Failed to delete faculty.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete faculty.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingManagerLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Faculties</h1>
        <MvButton
          onClick={() => {
            setModalOpen(true);
            setEditingId(null);
            setFormData({});
            setError(null);
          }}
        >
          Add Faculty
        </MvButton>
      </div>

      <SearchFilter placeholder="Search faculties..." onSearch={setSearchQuery} />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaculties?.length > 0 ? (
            filteredFaculties.map((faculty) => (
              <tr key={faculty.id}>
                <td className="border p-2">
                  <img
                    src={faculty.image_url}
                    alt={faculty.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </td>
                <td className="border p-2">{faculty.name}</td>
                <td className="border p-2 flex gap-2">
                  <MvButton onClick={() => handleEdit(faculty.id)}>Edit</MvButton>
                  <MvButton onClick={() => handleDelete(faculty.id)} className="bg-red-500" disabled={loading}>
                    {loading ? <MvLoader /> : "Delete"}
                  </MvButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No faculties available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <MvModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Faculty" : "Add Faculty"}>
        <div className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}

          <MvInput type="text" name="name" label="Faculty Name" value={formData.name || ""} onChange={handleInputChange} />

          <MvImageUpload onUpload={handleFileUpload} />

          {/* {formData.image_url && type of formData.image_url== string (
            <img src={formData.image_url} alt="Uploaded" className="w-20 h-20 object-cover rounded-lg" />
          )} */}

          <div className="flex justify-end">
            <MvButton onClick={handleSubmit} disabled={createLoading}>
              {createLoading ? <MvLoader /> : editingId ? "Update" : "Create"}
            </MvButton>
          </div>
        </div>
      </MvModal>
    </MarketingManagerLayout>
  );
};

export default MMFaculty ;
