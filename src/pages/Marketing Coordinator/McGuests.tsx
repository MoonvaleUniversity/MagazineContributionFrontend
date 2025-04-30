// pages/MarketingCoordinatorUsers.tsx
import { useState, useEffect } from "react";
import { User } from "../../app/MvObjects/user";
import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
import { MvButton } from "../../components/MvButton";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";

import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import {  updateUser, createUser, deleteUser } from "../../services/userService";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { approveGuest, getAllGuest } from "../../services/GuestService";

export const McGuests = () => {
  const [guests, setGuests] = useState<User[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students with role filter
  useEffect(() => { 
    fetchStudents();
  }, []);

  // Filter students
  useEffect(() => {
    const filtered = guests.filter(guest => {
      const searchMatch = [guest.name, guest.email].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase()))
      return searchMatch && guest.role === "Guest";
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchQuery, guests]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllGuest();
      if (data) {
        setGuests(data);
      } else {
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAction = async (formData: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await updateUser(editingStudent.id, { 
          name: formData.name, 
          email: formData.email 
        });
      } else {
        await createUser({ 
          ...formData, 
          role: 'student' // Force role
        });
      }
      closeModal();
      await fetchStudents();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this student?")) {
      try {
        await deleteUser(id);
        await fetchStudents();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Delete failed");
      }
    }
  };

  const handleApprove = async (id: number) => {
    if (window.confirm("Approve this student?")) {
      try {
        await approveGuest(id);
        await fetchStudents();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Approval failed");
      }
    }
  };

  // Modal management
  const openModal = (student?: User) => {
    setEditingStudent(student || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setError(null);
  };

  // Pagination
  const indexOfLastStudent = currentPage * itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfLastStudent - itemsPerPage, 
    indexOfLastStudent
  );

  return (
    <MarketingCoordinatorLayout>
      {loading && <MvLoader />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Guests</h1>
        <MvButton onClick={() => openModal()}>
          Add New Student
        </MvButton>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchFilter
        placeholder="Search Guests..."
        onSearch={setSearchQuery}
        className="px-4"
      />
<div className="rounded-lg border border-gray-200 dark:border-gray-700">

<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
<thead className="bg-gray-50 dark:bg-primary-800">
          <tr className="">
            {["ID", "Name", "Email", "Faculty", "Actions"].map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
          {currentStudents.length > 0 ? (
            currentStudents.map(guest => (
              <tr key={guest.id} >
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  tracking-wider">{guest.id}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  tracking-wider">{guest.name}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  tracking-wider">{guest.email}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  tracking-wider">{guest.faculty_id || "N/A"}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  tracking-wider flex gap-2">
                  <MvButton onClick={() => handleApprove(guest.id)}>Approve</MvButton>
                  <MvButton 
                    onClick={() => handleDelete(guest.id)}
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
                {guests.length === 0 ? "No Guests found" : "No matching Guests"}
              </td>
            </tr>
          )}
        </tbody>
      </table> </div>

      <MvPagination
        currentPage={currentPage}
        totalItems={filteredStudents.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        className="mt-4"
      />

      <MvModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingStudent ? "Edit Guest" : "Create New Guest"}
      >
        <AccountCreationForm
          fixedRole="Student"
          onSubmit={handleStudentAction}
          {...(error ? { error } : {})} 
          isSubmitting={isSubmitting}
          initialValues={editingStudent ? {
            name: editingStudent.name,
            email: editingStudent.email
          } : undefined}
        />
      </MvModal>
    </MarketingCoordinatorLayout>
  );
};