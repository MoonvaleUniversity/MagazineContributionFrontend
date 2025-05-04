  // pages/MMUsers.tsx
  import { useState, useEffect } from "react";
  import { User } from "../../app/MvObjects/user";
  import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
  import { MvButton } from "../../components/MvButton";
  import { MvLoader } from "../../components/MvLoader";
  import { MvModal } from "../../components/MvModal";
  import { MvPagination } from "../../components/MvPlagination/MvPlagination";
  import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
  import {   createUser, deleteUser, updateUser } from "../../services/userService";
  import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import {  getAllCoordinators } from "../../services/CoordinatorServices";
import { IFaculty } from "../../app/MvObjects/faculty";
import { getAllFaculties } from "../../services/FacultyService";

  export const MMUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [faculties, setFaculties] = useState<IFaculty[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState<string>('');
    // Fetch users with role filter
    useEffect(() => { 
      fetchUsers();
    }, []);

    // Filter users
    useEffect(() => {
      const filtered = users.filter(user => {
        const searchMatch = [user.name, user.email].some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const facultyMatch = !selectedFaculty || 
          user.faculty_id?.toString() === selectedFaculty;
        
        return searchMatch && facultyMatch;
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }, [searchQuery, users, selectedFaculty]);
     // Add faculty filter handler
  const handleFilterChange = (filterName: string, value: string) => {
    if (filterName === 'faculty') {
      setSelectedFaculty(value);
    }
  };
    const fetchUsers = async () => {
      try {
        setLoading(true);
    const [coordinators, allFaculties] = await Promise.all([
      getAllCoordinators(),
      getAllFaculties()
    ]);
    setUsers(coordinators);
    setFaculties(allFaculties);
    
        setUsers(coordinators);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    // Add faculty name lookup function
const getFacultyName = (facultyId: number | string | null): string => {
  if (!facultyId) return 'N/A';
  const faculty = faculties.find(f => f.id === Number(facultyId));
  return faculty?.name || 'N/A';
};
    const handleUserAction = async (formData: {
      name: string;
      email: string;
      password?: string;
      confirmPassword?: string;
      faculty_id?: string;
      role: string;
    }) => {
      setIsSubmitting(true);
      try {
        if (editingUser) {
          await updateUser(editingUser.id, { 
            name: formData.name, 
            email: formData.email,
            faculty_id: formData.faculty_id, 
         
          });
        } else {
          await createUser({ 
            ...formData,  
            faculty_id: formData.faculty_id,
            role: "marketing_coordinator",
          });
        }
        closeModal();
        await fetchUsers();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Operation failed");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleDelete = async (id: number) => {
      if (window.confirm("Delete this Marketing Coordinator?")) {
        try {
          await deleteUser(id);
          await fetchUsers();
        } catch (error) {
          setError(error instanceof Error ? error.message : "Delete failed");
        }
      }
    };
    const getFacultyImage = (facultyId: number | string | null): string => {
      if (!facultyId) return '';
      const faculty = faculties.find(f => f.id === Number(facultyId));
      if(typeof faculty?.image_url === "string") {
      return faculty?.image_url || '';
    } else {
      return "/src/Assets/images/404.jpeg";
    }
    };
    // Modal management
    const openModal = (user?: User) => {
      setEditingUser(user || null);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setEditingUser(null);
      setError(null);
    };

    // Pagination
    const indexOfLastUser = currentPage * itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfLastUser - itemsPerPage, indexOfLastUser);

    return (
      <MarketingManagerLayout>
        {loading && <MvLoader />}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manage Marketing Coordinators</h1>
          <MvButton onClick={() => openModal()}>
            Create Marketing Coordinator
          </MvButton>
        </div>

        {error && <div className="text-red-500 w-full bg-red-300/30 py-2 rounded-md mb-4">{error}</div>}

        <SearchFilter
        placeholder="Search coordinators..."
        onSearch={setSearchQuery}
        onFilterChange={handleFilterChange}
        filters={[
          {
            name: 'faculty',
            label: 'Faculty',
            options: [
              { value: '', label: 'All Faculties' },
              ...faculties.map(faculty => ({
                value: faculty.id.toString(),
                label: faculty.name,
              }))
            ]
          }
        ]}
        className="px-4"
      />
    <div className="rounded-lg overflow-x-scroll border border-gray-200 dark:border-gray-700">
    <table className="w-full border-collapse mt-min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead className="bg-gray-50 dark:bg-primary-800">
    <tr>
      {["ID", "Name", "Email", "Faculty", "Actions"].map((header, index) => (
        <th key={index} className='px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
          {header}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
    {currentUsers.length > 0 ? (
      currentUsers.map(user => (
        <tr key={user.id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.id}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {user.faculty_id ? (
              <div className="flex items-center">
                <img 
                  src={getFacultyImage(user.faculty_id)} 
                  alt="Faculty" 
                  className="w-12 h-12 rounded-full object-cover mr-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/Assets/images/404.jpeg';
                  }}
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  {getFacultyName(user.faculty_id)}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">N/A</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap flex gap-2">
            <MvButton onClick={() => openModal(user)}>Edit</MvButton>
            <MvButton 
              onClick={() => handleDelete(user.id)}
              className="bg-red-500 dark:bg-red-300"
            >
              Delete
            </MvButton>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="text-center p-4 text-gray-500 dark:text-gray-400">
          {users.length === 0 ? "No coordinators found" : "No matching coordinators"}
        </td>
      </tr>
    )}
  </tbody>
</table>
          
            </div>
        <MvPagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          className="mt-4"
        />

        <MvModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingUser ? "Edit Coordinator" : "Create Marketing Coordinator"}
        >
          <AccountCreationForm
            fixedRole="Marketing Coordinator"
            onSubmit={handleUserAction}
            {...(error ? { error } : {})} 
            isSubmitting={isSubmitting}
            isFaculty= {true}
            initialValues={editingUser ? {
              name: editingUser.name,
              email: editingUser.email,
              faculty_id: editingUser.faculty_id?.toString(), // Convert to string
            } : undefined}
          />
        </MvModal>
      </MarketingManagerLayout>
    );
  };