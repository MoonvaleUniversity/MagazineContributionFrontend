import { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import { MvInput } from "../../components/MvInput";
import { MvModal } from "../../components/MvModal";
import AdminLayout from "../../layout/AdminLayout";
import { getAllAcademicYears, updateAcademicYear, createAcademicYear, deleteAcademicYear } from "../../services/AcademicYearService";
import { MvLoader } from "../../components/MvLoader";
import SearchFilter  from "../../components/MvSearchFilter/MvSearchFIlter";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    const filtered = academicYears.filter(ay =>
      ay.year_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredYears(filtered);
    setCurrentPage(1); // Reset to first page on search/filter change
  }, [searchQuery, academicYears]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentYears = filteredYears.slice(indexOfFirstItem, indexOfLastItem);

  const validateYearFormat = (year: string) => {
    const yearRegex = /^\d{4}-\d{4}$/;
    if (!yearRegex.test(year)) return false;
    
    const [startYear, endYear] = year.split('-').map(Number);
    return startYear < endYear && endYear === startYear + 1;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user starts typing
  };
  
  const handleSubmit = async () => {
    if (!formData.year_name) {
      setError("Year field is required.");
      return;
    }
  
    if (!validateYearFormat(formData.year_name)) {
      setError("Invalid year format. Please use YYYY-YYYY format and ensure consecutive years.");
      return;
    }
  
    try {
      setLoading(true); // Prevent multiple submissions
      if (editingId) {
        await updateAcademicYear(editingId, formData);
      } else {
        await createAcademicYear(formData);
      }
  
      await fetchAcademicYears();
      setFormData({});
      setEditingId(null);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.log(error);
      setError("Failed to save academic year.");
    } finally {
      setLoading(false); // Re-enable the button
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
        await fetchAcademicYears();
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
        placeholder="Search academic years..."
        onSearch={setSearchQuery}
        className="px-4"
      />

      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-primary-800">
          <tr className="">
            <th colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year Name</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
          {currentYears.length > 0 ? (
            currentYears.map((ay) => (
              <tr key={ay.id} className="">
                <td colSpan={2} className="px-6 py-4  text-gray-500 dark:text-gray-300">{ay.year_name}</td>
                <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-300">
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
          </div>
      {filteredYears.length > 0 && (
        <MvPagination
          currentPage={currentPage}
          totalItems={filteredYears.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      )}

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
            label="Academic Year"
            value={formData.year_name || ""}
            onChange={handleInputChange}
            placeholder="Example: 2023-2024"
          />
          <div className="text-sm text-gray-500">
            Format must be YYYY-YYYY (consecutive years)
          </div>
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