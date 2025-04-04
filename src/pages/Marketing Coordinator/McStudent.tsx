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
import { createStudents, deleteStudents, getAllStudents, updateStudents } from "../../services/StudentServices";
import { getUserData } from "../../services/AuthService";
import { IUser } from "../../app/Types/objects/user";

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
      const data = await getAllStudents();
      // Filter to only show Students
      const students = data.filter(user => user.role === "Student");
      setStudents(students);
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
        await createStudents({ 
          ...formData, 
          faculty_id: String(userData.faculty_id),
          role: 'student' // Force role
        });
        }
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
        await deleteStudents(id);
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

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-secondary-400 dark:bg-secondary-dark-400">
            {["ID", "Name", "Email", "Faculty", "Actions"].map((header, index) => (
              <th key={index} className="border p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map(student => (
              <tr key={student.id} className="border hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border p-2">{student.id}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.faculty_id || "N/A"}</td>
                <td className="border p-2 flex gap-2">
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
      </table>

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