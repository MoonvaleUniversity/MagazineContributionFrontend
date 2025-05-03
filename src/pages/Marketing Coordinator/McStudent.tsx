// pages/MarketingCoordinatorUsers.tsx
import { useState, useEffect } from "react";
import { User } from "../../app/MvObjects/user";
import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
import { MvButton } from "../../components/MvButton";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";

import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";

import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import {   getAllStudents, updateStudents } from "../../services/StudentServices";
import { getUserData } from "../../services/AuthService";
import { IUser } from "../../app/Types/objects/user";
import { createUser, deleteUser } from "../../services/userService";

export const McStudents  = () => {
  const [students, setStudents] = useState<User[]>([]);
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
    const filtered = students.filter(student => {
      const searchMatch = [student.name, student.email].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase()))
      return searchMatch && student.role === "Student";
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const userData = getUserData();
      if (userData?.faculty_id) {
      const data = await getAllStudents({facultyId: String(userData.faculty_id)});
 
      setStudents(data);
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
    comfirmPassword?: string;
    role: string;
  }) => {
    const userData: IUser | null = getUserData();

    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await updateStudents(editingStudent.id, { 
          name: formData.name, 
          email: formData.email,
        });
      } else {
        if (userData) {
          console.log("userData", userData, formData);
          await createUser({ 
            ...formData, 
            faculty_id: String(userData.faculty_id),
            role: 'student' // Force role
          });

         
        }
      }
      closeModal();
      await fetchStudents();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log("Error", (error as any)?.errors?.email?.[0] );
     
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.errors?.email?.[0] == "The email has already been taken.") {
        setError("Email already exists. Please use a different email.");
        return; // Don't close the modal
      }
      else {
        setError(error instanceof Error ? error.message : "Operation failed");    
      }
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
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <MvButton onClick={() => openModal()}>
          Add New Student
        </MvButton>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchFilter
        placeholder="Search students..."
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
            currentStudents.map(student => (
              <tr key={student.id} className="">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{student.id}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{student.name}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{student.email}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{student.faculty_id || "N/A"}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider flex gap-2">
                  <MvButton onClick={() => openModal(student)}>Edit</MvButton>
                  <MvButton 
                    onClick={() => handleDelete(student.id)}
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
                {students.length === 0 ? "No students found" : "No matching students"}
              </td>
            </tr>
          )}
        </tbody>
      </table></div>

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
        title={editingStudent ? "Edit Student" : "Create New Student"}
      >
        <AccountCreationForm
          fixedRole="Student"
          onSubmit={handleStudentAction}
          {...(error ? { error } : {})} 
          isSubmitting={isSubmitting}
          isAcademicYear= {true}
          initialValues={editingStudent ? {
            name: editingStudent.name,
            email: editingStudent.email,
          } : undefined}
        />
      </MvModal>
    </MarketingCoordinatorLayout>
  );
};