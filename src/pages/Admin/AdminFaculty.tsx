import React, { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import { MvInput } from "../../components/MvInput";
import AdminLayout from "../../layout/AdminLayout";
import { MvModal } from "../../components/MvModal";

// Define the Faculty interface based on your PHP model.
export interface IFaculty {
  id: number;
  name: string;
  image_url: string;
  version: string;
  // Additional fields (e.g., created_by) can be added if needed.
}

export const AdminFaculties: React.FC = () => {
  const [faculties, setFaculties] = useState<IFaculty[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IFaculty>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dummy data for demonstration. Replace with actual API calls later.
  useEffect(() => {
    const dummyData: IFaculty[] = [
      {
        id: 1,
        name: "Faculty of Science",
        image_url: "https://via.placeholder.com/50",
        version: "1.0",
      },
      {
        id: 2,
        name: "Faculty of Arts",
        image_url: "https://via.placeholder.com/50",
        version: "1.0",
      },
    ];
    setFaculties(dummyData);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Basic validation: ensure required fields are provided.
    if (!formData.name || !formData.version) {
      setError("Faculty Name and Version are required.");
      return;
    }

    if (editingId) {
      // Update existing faculty
      setFaculties((prev) =>
        prev.map((faculty) =>
          faculty.id === editingId
            ? { ...faculty, ...formData, id: editingId } as IFaculty
            : faculty
        )
      );
    } else {
      // Create new faculty
      const newId = faculties.length > 0 ? Math.max(...faculties.map((f) => f.id)) + 1 : 1;
      const newFaculty: IFaculty = {
        id: newId,
        name: formData.name as string,
        image_url: (formData.image_url as string) || "https://via.placeholder.com/50",
        version: formData.version as string,
      };
      setFaculties((prev) => [...prev, newFaculty]);
    }

    // Reset form state and close modal
    setFormData({});
    setEditingId(null);
    setError(null);
    setModalOpen(false);
  };

  const handleEdit = (faculty: IFaculty) => {
    setEditingId(faculty.id);
    setFormData(faculty);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setFaculties((prev) => prev.filter((faculty) => faculty.id !== id));
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
            <th className="border p-2">Version</th>
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
                <td className="border p-2">{faculty.version}</td>
                <td className="border p-2 flex gap-2">
                  <MvButton onClick={() => handleEdit(faculty)}>Edit</MvButton>
                  <MvButton onClick={() => handleDelete(faculty.id)} className="bg-red-500">
                    Delete
                  </MvButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
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
          <MvInput
            type="text"
            name="version"
            label="Version"
            value={formData.version || ""}
            onChange={handleInputChange}
          />
          <div className="flex justify-end">
            <MvButton onClick={handleSubmit}>{editingId ? "Update" : "Create"}</MvButton>
          </div>
        </div>
      </MvModal>
    </AdminLayout>
  );
};

export default AdminFaculties;
