import React, { useEffect, useState } from "react";
import { MvButton } from "../../components/MvButton";
import { MvInput } from "../../components/MvInput";
import AdminLayout from "../../layout/AdminLayout";
import { MvModal } from "../../components/MvModal";

// Define the Academic Year interface based on your PHP model.
export interface IAcademicYear {
  id: number;
  year_name: string;
  version: string;
  // Additional fields (created_by, updated_by, etc.) can be added as needed.
}

export const AdminAcademicYears: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IAcademicYear>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dummy fetch function to simulate loading academic years.
  const fetchAcademicYears = () => {
    const dummyData: IAcademicYear[] = [
      { id: 1, year_name: "2022-2023", version: "1.0" },
      { id: 2, year_name: "2023-2024", version: "1.0" },
    ];
    setAcademicYears(dummyData);
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Validate form data.
    if (!formData.year_name || !formData.version) {
      setError("All fields are required.");
      return;
    }

    if (editingId) {
      // Update the academic year in local state.
      setAcademicYears((prev) =>
        prev.map((ay) =>
          ay.id === editingId ? { ...ay, ...formData, id: editingId } : ay
        )
      );
    } else {
      // Create a new academic year (dummy).
      const newId =
        academicYears.length > 0
          ? Math.max(...academicYears.map((ay) => ay.id)) + 1
          : 1;
      const newAcademicYear: IAcademicYear = {
        id: newId,
        year_name: formData.year_name as string,
        version: formData.version as string,
      };
      setAcademicYears((prev) => [...prev, newAcademicYear]);
    }

    // Reset form and error state, then close the modal.
    setFormData({});
    setEditingId(null);
    setError(null);
    setModalOpen(false);
  };

  const handleEdit = (academicYear: IAcademicYear) => {
    setEditingId(academicYear.id);
    setFormData(academicYear);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setAcademicYears((prev) => prev.filter((ay) => ay.id !== id));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Academic Years</h1>
        <MvButton
          onClick={() => {
            setModalOpen(true);
            setEditingId(null);
            setFormData({});
          }}
        >
          Add Academic Year
        </MvButton>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Table displaying all academic years */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Year Name</th>
            <th className="border p-2">Version</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {academicYears.length > 0 ? (
            academicYears.map((ay) => (
              <tr key={ay.id} className="border">
                <td className="border p-2">{ay.year_name}</td>
                <td className="border p-2">{ay.version}</td>
                <td className="border p-2 flex gap-2">
                  <MvButton onClick={() => handleEdit(ay)}>Edit</MvButton>
                  <MvButton
                    onClick={() => handleDelete(ay.id)}
                    className="bg-red-500"
                  >
                    Delete
                  </MvButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No academic years available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for adding or editing an academic year */}
      <MvModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Academic Year" : "Add Academic Year"}
      >
        <div className="space-y-4">
          <MvInput
            type="text"
            name="year_name"
            label="Year Name"
            value={formData.year_name || ""}
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
            <MvButton onClick={handleSubmit}>
              {editingId ? "Update" : "Create"}
            </MvButton>
          </div>
        </div>
      </MvModal>
    </AdminLayout>
  );
};

export default AdminAcademicYears;
