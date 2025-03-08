import React, { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import { MvInput } from "../../components/MvInput";
import AdminLayout from "../../layout/AdminLayout";
import { MvModal } from "../../components/MvModal";
import { getAllFaculties, updateFaculty, createFaculty, getFacultyById, deleteFaculty } from "../../services/FacultyService";
import { MvLoader } from "../../components/MvLoader";

export interface IFaculty {
  id: number;
  name: string;
  image_url: string;
}

export const AdminFaculties: React.FC = () => {
  const [faculties, setFaculties] = useState<IFaculty[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IFaculty>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for delete
  const [createLoading, setCreateLoading] = useState<boolean>(false); // Loading state for create

  // Fetch faculties from API on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const data = await getAllFaculties();
      setFaculties(data);
    } catch (err) {
      setError("Failed to load faculties.");
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setError("Faculty Name is required.");
      return;
    }

    setCreateLoading(true); // Start loading for create faculty
    try {
      if (editingId) {
        // Update faculty
        await updateFaculty(editingId, formData);
      } else {
        // Create new faculty
        await createFaculty(formData);
      }
      setModalOpen(false); // Close the modal
      fetchFaculties(); // Refresh faculty list
      setFormData({});
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError("Failed to save faculty.");
      console.error(err);
    } finally {
      setCreateLoading(false); // End loading for create faculty
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const faculty = await getFacultyById(id);
      setEditingId(id);
      setFormData(faculty);
      setModalOpen(true);
    } catch (err) {
      setError("Failed to fetch faculty details.");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true); // Start loading state
    try {
      const success = await deleteFaculty(id);
      
      if (success) {
        fetchFaculties();
        setError(null); // Clear any previous error
        alert("Faculty deleted successfully!");
      } else {
        throw new Error("Failed to delete faculty.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err + "Failed to delete faculty.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Faculties</h1>
        <MvButton
          onClick={() => {
            setModalOpen(true);
            setEditingId(null);
            setFormData({});
            setError(null); // Reset error when opening form
          }}
        >
          Add Faculty
        </MvButton>
      </div>

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
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
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
                    {loading ? <MvLoader /> : ""} Delete
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

      {/* Modal for adding/editing a faculty */}
      <MvModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Faculty" : "Add Faculty"}
      >
        <div className="space-y-4">
          {/* Display error message above the form */}
          {error && <div className="text-red-500">{error}</div>}

          <MvInput
            type="text"
            name="name"
            label="Faculty Name"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
          <MvInput
            type="text"
            name="image_url"
            label="Image URL"
            value={formData.image_url || ""}
            onChange={handleInputChange}
          />
          <div className="flex justify-end">
            <MvButton onClick={handleSubmit} disabled={createLoading}>
              {createLoading ? <MvLoader /> : editingId ? "Update" : "Create"}
            </MvButton>
          </div>
        </div>
      </MvModal>
    </AdminLayout>
  );
};

export default AdminFaculties;
