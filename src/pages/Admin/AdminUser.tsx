// pages/AdminUsers.tsx

import { useState, useEffect } from "react";
import { User } from "../../app/MvObjects/user";
import { MvLoader } from "../../components/MvLoader";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import SearchFilter, { Filter } from "../../components/MvSearchFilter/MvSearchFIlter";
import AdminLayout from "../../layout/AdminLayout";
import { getAllUsers } from "../../services/userService";
import { MvButton } from "../../components/MvButton";

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return user[key as keyof User]?.toString().toLowerCase() === value.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Dynamic role filter options
  const roleOptions = Array.from(new Set(users.map(user => user.role)))
    .filter(role => role !== null)
    .map(role => ({
      value: role!,
      label: role!
    }));

  const roleFilter: Filter = {
    name: "role",
    label: "Role",
    options: [{ value: "", label: "All Roles" }, ...roleOptions]
  };

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <AdminLayout>
      {loading && <MvLoader />}
      <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <MvButton> Create marketing manager</MvButton></div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchFilter
        placeholder="Search users..."
        onSearch={setSearchQuery}
        onFilterChange={handleFilterChange}
        filters={[roleFilter]}
        className="px-4"
      />

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-secondary-400 dark:bg-secondary-dark-400">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role || "N/A"}</td>
                <td className="border p-2 flex gap-2">
                  {/* Action buttons */}
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
      </table>

      <MvPagination
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        className="mt-4"
      />
    </AdminLayout>
  );
};