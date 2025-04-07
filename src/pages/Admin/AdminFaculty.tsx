import { useState, useEffect } from "react";
import { MvLoader } from "../../components/MvLoader";
import AdminLayout from "../../layout/AdminLayout";
import { getAllFaculties } from "../../services/FacultyService";
import { ResponseFaculty } from "../../app/MvObjects/faculty";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";


export const AdminFaculties: React.FC = () => {
  const [faculties, setFaculties] = useState<ResponseFaculty[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<ResponseFaculty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    const filtered = faculties.filter((faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaculties(filtered);
    setCurrentPage(1); // Reset to first page on search or data change
  }, [searchQuery, faculties]);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const data = await getAllFaculties();
      setFaculties(data || []);
      setFilteredFaculties(data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load faculties.");
      console.error(err);
      setFaculties([]);
      setFilteredFaculties([]);
    }
  };

  // Calculate current faculties to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaculties = filteredFaculties.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {loading ? <MvLoader /> : ""}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Faculties</h1>
      </div>
      <SearchFilter placeholder="Search faculties..." onSearch={setSearchQuery} />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-primary-800bg-gray-50 dark:bg-primary-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
          {currentFaculties.length > 0 ? (
            currentFaculties.map((faculty) => (
              <tr key={faculty.id}>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{faculty.id}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <img
                    src={faculty.image_url}
                    alt={faculty.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{faculty.name}</td>
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

      {/* Add Pagination */}
      {filteredFaculties.length > 0 && (
        <MvPagination
          currentPage={currentPage}
          totalItems={filteredFaculties.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      )}
    </AdminLayout>
  );
};

export default AdminFaculties;