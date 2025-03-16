// pages/MMUsers.tsx
import { useState, useEffect } from "react";
import { User } from "../../app/MvObjects/user";
import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
import { MvButton } from "../../components/MvButton";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import { getAllUsers, updateUser, createUser, deleteUser } from "../../services/userService";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";

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

  // Fetch users with role filter
  useEffect(() => { 
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user => {
      const searchMatch = [user.name, user.email].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase()))
      return searchMatch && user.role === "Marketing Coordinator";
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      // Filter to only show Marketing Coordinators
      const coordinators = data.filter(user => user.role === "Marketing Coordinator");
      setUsers(coordinators);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
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
        await updateUser(editingUser.id, { 
          name: formData.name, 
          email: formData.email 
        });
      } else {
        await createUser({ 
          ...formData, 
          role: 'marketing_coordinator' 
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

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchFilter
        placeholder="Search coordinators..."
        onSearch={setSearchQuery}
        className="px-4"
      />

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-secondary-400 dark:bg-secondary-dark-400">
            {["ID", "Name", "Email", "Actions"].map((header, index) => (
              <th key={index} className="border p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <tr key={user.id} className="border hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 flex gap-2">
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
              <td colSpan={4} className="text-center p-4">
                {users.length === 0 ? "No coordinators found" : "No matching coordinators"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
          initialValues={editingUser ? {
            name: editingUser.name,
            email: editingUser.email
          } : undefined}
        />
      </MvModal>
    </MarketingManagerLayout>
  );
};