// pages/MarketingCoordinatorUsers.tsx
import { useState, useEffect } from "react";
import { User } from "../../app/MvObjects/user";
import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
import { MvButton } from "../../components/MvButton";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";

import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import { updateUser, createUser, deleteUser } from "../../services/userService";
import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";
import { approveGuest, getAllGuest } from "../../services/GuestService";
import { getUserData } from "../../services/AuthService";
import { FaCheck, FaClock } from "react-icons/fa";



export const McGuests = () => {
    const [guests, setGuests] = useState<User[]>([]);
    const [filteredGuests, setFilteredGuests] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch guests
  useEffect(() => { 
    fetchGuests();
  }, []);

  
  // Filter guests
  useEffect(() => {
    const filtered = guests.filter(guest => {
      const searchMatch = [guest.name, guest.email].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase()))
      return searchMatch && guest.role === "Guest";
    });
    setFilteredGuests(filtered);
    setCurrentPage(1);
  }, [searchQuery, guests]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const userdata = getUserData();
      const facultyid = userdata?.faculty_id;
      let data = []; // Initialize to an empty array
  
      if (facultyid) {
        data = await getAllGuest({ facultyId: facultyid.toString() });
      } else {
        console.warn("facultyid is undefined, fetching all guests (if applicable).");
        data = await getAllGuest({}); // Or handle differently if no facultyId means no guests
      }
  
      setGuests(data);
      setFilteredGuests(data); // Assuming you want to initialize filteredGuests with all guests
  
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch guests");
    } finally {
      setLoading(false);
    }
  };
  const handleGuestAction = async (formData: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingGuest) {
        await updateUser(editingGuest.id, { 
          name: formData.name, 
          email: formData.email 
        });
      } else {
        await createUser({ 
          ...formData, 
          role: 'guest' // Force role
        });
      }
      closeModal();
      await fetchGuests();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this guest?")) {
      try {
        await deleteUser(id);
        await fetchGuests();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Delete failed");
      }
    }
  };

  const handleApprove = async (id: number) => {
    if (window.confirm("Approve this guest?")) {
      try {
        await approveGuest(id);
        await fetchGuests();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Approval failed");
      }
    }
  };

  // Modal management
  const openModal = (guest?: User) => {
    setEditingGuest(guest || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGuest(null);
    setError(null);
  };

  // Pagination
  const indexOfLastGuest = currentPage * itemsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfLastGuest - itemsPerPage, 
    indexOfLastGuest
  );

  return (
    <MarketingCoordinatorLayout>
      {loading && <MvLoader />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Guests</h1>
        <MvButton onClick={() => openModal()}>
          Add New Guest
        </MvButton>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchFilter
        placeholder="Search Guests..."
        onSearch={setSearchQuery}
        className="px-4"
      />
      <div className="rounded-lg border overflow-x-scroll border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-primary-800">
            <tr>
              {["ID", "Name", "Email", "Faculty", "Status", "Actions"].map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentGuests.length > 0 ? (
              currentGuests.map(guest => (
                <tr key={guest.id}>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider">{guest.id}</td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider">{guest.name}</td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider">{guest.email}</td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider">{guest.faculty_id || "N/A"}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          guest.isApproved === 1 
            ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
        }`}>
          {guest.isApproved === 1 ? (
            <>
              <FaCheck className="mr-1.5 h-3 w-3" />
              Approved
            </>
          ) : (
            <>
              <FaClock className="mr-1.5 h-3 w-3" />
              Pending
            </>
          )}
        </div>
      </td>

      <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider flex gap-2">
        {guest.isApproved !== 1 && (
          <MvButton onClick={() => handleApprove(guest.id)}>Approve</MvButton>
        )}
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
        </table>
      </div>

      <MvPagination
        currentPage={currentPage}
        totalItems={filteredGuests.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        className="mt-4"
      />

      <MvModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGuest ? "Edit Guest" : "Create New Guest"}
      >
        <AccountCreationForm
          fixedRole="Guest"
          onSubmit={handleGuestAction}
          {...(error ? { error } : {})} 
          isSubmitting={isSubmitting}
          
          initialValues={editingGuest ? {
            name: editingGuest.name,
            email: editingGuest.email
          } : undefined}
        />
      </MvModal>
    </MarketingCoordinatorLayout>
  );
};