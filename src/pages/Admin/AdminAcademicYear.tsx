import { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import { MvInput } from "../../components/MvInput";
import { MvModal } from "../../components/MvModal";

import AdminLayout from "../../layout/AdminLayout";
import { getAllAcademicYears, updateAcademicYear, createAcademicYear, deleteAcademicYear } from "../../services/AcademicYearService";
import { MvLoader } from "../../components/MvLoader";
import SearchFilter  from "../../components/MvSearchFilter/MvSearchFIlter";

export interface IAcademicYear {
  id: number;
  year_name: string;
}

export const AdminAcademicYears: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [filteredYears, setFilteredYears] = useState<IAcademicYear[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IAcademicYear>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const data = await getAllAcademicYears();
      setAcademicYears(data);
      setFilteredYears(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch academic years.");
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    console.log("Fetched academic years:", academicYears);
  
    if (!Array.isArray(academicYears)) {
      console.error("academicYears is not an array!", academicYears);
      return;
    }
  
    const filtered = academicYears.filter((ay) =>
      ay.year_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    setFilteredYears(filtered);
  }, [searchQuery, academicYears]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.year_name) {
      setError("All fields are required.");
      return;
    }
  
    try {
      if (editingId) {
        // Update academic year
        await updateAcademicYear(editingId, formData);
      } else {
        // Create new academic year
        await createAcademicYear(formData);
      }
  
      await fetchAcademicYears(); // Refresh the data after submit
  
      setFormData({});
      setEditingId(null);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.log(error);
      setError("Failed to save academic year.");
    }
  };
  

  const handleEdit = (academicYear: IAcademicYear) => {
    setEditingId(academicYear.id);
    setFormData(academicYear);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const isDeleted = await deleteAcademicYear(id);
      if (isDeleted) {
        await fetchAcademicYears(); // Refresh the data after delete
      }
    } catch (error) {
      console.log(error);
      setError("Failed to delete academic year.");
    }
  };
  

  return (
    <AdminLayout>
       {loading ? <MvLoader /> : ""}
            
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Academic Years</h1>
        <MvButton onClick={() => {
          setModalOpen(true);
          setEditingId(null);
          setFormData({});
        }}>
          Add Academic Year
        </MvButton>
      </div>

      <SearchFilter
        placeholder="Search users..."
        onSearch={setSearchQuery}
        className="px-4"
      />


      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-secondary-400 dark:bg-secondary-dark-400">
            <th className="border p-2">Year Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredYears.length > 0 ? (
            filteredYears.map((ay) => (
              <tr key={ay.id} className="border">
                <td className="border p-2">{ay.year_name}</td>
                <td className="border p-2 flex gap-2">
                  <MvButton onClick={() => handleEdit(ay)}>Edit</MvButton>
                  <MvButton
                    onClick={() => handleDelete(ay.id)}
                  className="bg-red-500 dark:bg-red-300"
                  >
                    Delete
                  </MvButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No academic years found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <MvModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Academic Year" : "Add Academic Year"}
      >
        {error && <div className="text-red-500">{error}</div>}
        <div className="space-y-4">
          <MvInput
            type="text"
            name="year_name"
            label="Year Name"
            value={formData.year_name || ""}
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
