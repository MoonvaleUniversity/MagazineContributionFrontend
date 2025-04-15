// pages/AdminUsers.tsx
import { useState, useEffect } from "react";
import { User } from "../../app/MvObjects/user";
import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
import { MvButton } from "../../components/MvButton";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import AdminLayout from "../../layout/AdminLayout";
import { getAllUsers, deleteUser, updateUser, createUser } from "../../services/userService";
import SearchFilter, { Filter } from "../../components/MvSearchFilter/MvSearchFIlter";

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users
  useEffect(() => { fetchUsers(); }, []);

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user => {
      const searchMatch = [user.name, user.email].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filterMatch = Object.entries(filters).every(([key, value]) => 
        !value || user[key as keyof User]?.toString().toLowerCase() === value.toLowerCase()
      );
      return searchMatch && filterMatch;
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      
      setUsers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleUserAction = async (formData: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { name: formData.name, email: formData.email });
      } else {
        await createUser({ ...formData });
      }
      closeModal();
      await fetchUsers();
    } catch (error) {
      setError(
        error instanceof Error 
          ? `Something went wrong: ${error.message}` 
          : "An unexpected error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        await fetchUsers();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Delete failed");
      }
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

  // Role filter options
  const roleOptions = Array.from(new Set(users.map(u => u.role)))
    .filter(Boolean)
    .map(role => ({ value: role!, label: role! }));

  const roleFilter: Filter = {
    name: "role",
    label: "Role",
    options: [{ value: "", label: "All Roles" }, ...roleOptions]
  };

  // Pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfLastUser - itemsPerPage, indexOfLastUser);

  return (
    <AdminLayout>
      {loading && <MvLoader />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <MvButton onClick={() => openModal()}>Create Marketing Manager</MvButton>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchFilter
        placeholder="Search users..."
        onSearch={setSearchQuery}
        onFilterChange={handleFilterChange}
        filters={[roleFilter]}
        className="px-4"
      />
<div className="rounded-lg overflow-x-scroll max-w-screen border border-gray-200 dark:border-gray-700">

<table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
<thead className="bg-gray-50 dark:bg-primary-800bg-gray-50 dark:bg-primary-800">
          <tr className="">
            {["ID", "Name", "Email", "Role", "Actions"].map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
          {currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <tr key={user.id} className="">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{user.id}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{user.name}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{user.email}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{user.role || "N/A"}</td>
                <td className="px-6 py-3 gap-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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
              <td colSpan={5} className="text-center p-4">
                {users.length === 0 ? "No users found" : "No matching users found"}
              </td>
            </tr>
          )}
        </tbody>
      </table> </div>

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
        title={editingUser ? "Edit User" : "Create Marketing Manager"}
      >
        <AccountCreationForm
          fixedRole="Marketing Manager"
          onSubmit={handleUserAction}
          {...(error ? { error } : {})} 
          isSubmitting={isSubmitting}
          initialValues={editingUser ? {
            name: editingUser.name,
            email: editingUser.email
          } : undefined}
        />
      </MvModal>
    </AdminLayout>
  );
};