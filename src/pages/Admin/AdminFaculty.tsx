import { useState, useEffect } from "react";
import { MvLoader } from "../../components/MvLoader";

import AdminLayout from "../../layout/AdminLayout";
import { getAllFaculties } from "../../services/FacultyService";
import { ResponseFaculty } from "../../app/MvObjects/faculty";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";


export const AdminFaculties: React.FC = () => {
  const [faculties, setFaculties] = useState<ResponseFaculty[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<ResponseFaculty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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


  

  return (
    <AdminLayout>
      
      {loading ? <MvLoader /> : ""}
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Faculties</h1>
       </div>
      <SearchFilter placeholder="Search faculties..." onSearch={setSearchQuery} />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
        <tr className="bg-secondary-400 dark:bg-secondary-dark-400">
          <th>Id</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
          
          </tr>
        </thead>
        <tbody>
          {filteredFaculties?.length > 0 ? (
            filteredFaculties.map((faculty) => (
              <tr key={faculty.id}>
                <td className="border p-2">{faculty.id}</td>
                <td className="border p-2">
                  <img
                    src={faculty.image_url}
                    alt={faculty.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </td>
                <td className="border p-2">{faculty.name}</td>
               
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

   
    </AdminLayout>
  );
};

export default AdminFaculties;
