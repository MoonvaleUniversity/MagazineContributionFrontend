import { useEffect, useState } from "react";
import { FormDataClosureDate, IClosureDate } from "../../app/MvObjects/clousuredate";
import { MvButton } from "../../components/MvButton";
import { getAllClosureDates, updateClosureDate, createClosureDate, deleteClosureDate } from "../../services/ClosureDateService";
import AdminLayout from "../../layout/AdminLayout";
import { MvDateInput, MvDropdown } from "../../components/MvInput";
import { MvLoader } from "../../components/MvLoader";
import { MvModal } from "../../components/MvModal";
import SearchFilter, { Filter } from "../../components/MvSearchFilter/MvSearchFIlter";
import { MvPagination } from "../../components/MvPlagination/MvPlagination";
import {  getAllAcademicYears } from "../../services/AcademicYearService";
import { IAcademicYear } from "./AdminAcademicYear";
import { MvGlobalContributions } from "../../components/MvContributions/publishedContributions";

export const AdminClosureDates = () => {
    const [closureDates, setClosureDates] = useState<IClosureDate[]>([]);
    const [filteredDates, setFilteredDates] = useState<IClosureDate[]>([]);
    const [formData, setFormData] = useState<Partial<IClosureDate>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [academicYearMap, setAcademicYearMap] = useState<Record<number, string>>({});
    const [academicYear, setAcademicYear] = useState<IAcademicYear[]>([])
    const [errors, setErrors] = useState<{
        academic_year_id?: string;
        closure_date?: string;
        final_closure_date?: string;
        general?: string;
    }>({});

    const statusOptions: Filter[] = [
        {
            name: "status",
            label: "Status",
            options: [
                { value: "all", label: "All" },
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" }
            ]
        }
    ];

  
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [closureData, academicData] = await Promise.all([
                    getAllClosureDates(),
                    getAllAcademicYears()
                ]);
                
                // Create a map of academic year IDs to names
                const yearMap = academicData.reduce((acc: Record<number, string>, curr: IAcademicYear) => {
                    acc[curr.id] = curr.year_name;
                    return acc;
                }, {});
                
                setAcademicYearMap(yearMap);
                setAcademicYear(academicData)
                setClosureDates(Array.isArray(closureData) ? closureData : []);
            } catch (error) {
                console.error("Failed to fetch data", error);
                setErrors({ general: "Failed to load data. Please try again later." });
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        const filterDates = () => {
            const today = new Date();
            return closureDates.filter(date => {
                const matchesSearch = String(date.academic_year_id).includes(searchQuery) ||
                                      date.closure_date.includes(searchQuery) ||
                                      date.final_closure_date.includes(searchQuery);

                const finalDate = new Date(date.final_closure_date);
                const matchesStatus = statusFilter === "all" || 
                    (statusFilter === "open" && finalDate > today) ||
                    (statusFilter === "closed" && finalDate <= today);

                return matchesSearch && matchesStatus;
            });
        };
        setFilteredDates(filterDates());
        setCurrentPage(1); // Reset to first page on filter change
    }, [searchQuery, statusFilter, closureDates]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDates = filteredDates.slice(indexOfFirstItem, indexOfLastItem);
    // Replace the getAcademicYear function with this simple lookup
const getAcademicYearName = (id: number|string) => {

    return academicYearMap[Number(id)] || "Unknown Year";
};

    const fetchClosureDates = async () => {
        try {
            setLoading(true);
            const data = await getAllClosureDates();
            const adata = await getAllAcademicYears();
            setAcademicYear(Array.isArray(adata) ? adata : [])
            setClosureDates(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch closure dates", error);
            setErrors({ general: "Failed to load closure dates. Please try again later." });
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        let isValid = true;

        if (!formData.academic_year_id) {
            newErrors.academic_year_id = "Academic Year ID is required";
            isValid = false;
        } else if (isNaN(Number(formData.academic_year_id))) {
            newErrors.academic_year_id = "Must be a valid number";
            isValid = false;
        }

        if (!formData.closure_date) {
            newErrors.closure_date = "Closure Date is required";
            isValid = false;
        } else if (isNaN(new Date(formData.closure_date).getTime())) {
            newErrors.closure_date = "Invalid date format (use YYYY-MM-DD)";
            isValid = false;
        }

        if (!formData.final_closure_date) {
            newErrors.final_closure_date = "Final Closure Date is required";
            isValid = false;
        } else {
            const finalDate = new Date(formData.final_closure_date);
            const closureDate = new Date(formData.closure_date as string);
            
            if (isNaN(finalDate.getTime())) {
                newErrors.final_closure_date = "Invalid date format (use YYYY-MM-DD)";
                isValid = false;
            } else if (finalDate < closureDate) {
                newErrors.final_closure_date = "Must be after Closure Date";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const formDataObj: FormDataClosureDate = {
                closure_date: formData.closure_date as string,
                final_closure_date: formData.final_closure_date as string,
                academic_year_id: String(formData.academic_year_id)
            };

            if (editingId) {
                await updateClosureDate(editingId, formDataObj);
            } else {
                await createClosureDate(formDataObj);
            }

            await fetchClosureDates();
            setFormData({});
            setEditingId(null);
            setErrors({});
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to save closure date", error);
            setErrors(
                
                  {  general:    "Failed to save closure date. Please try again."}
            );
        }
    };

    const handleEdit = (closureDate: IClosureDate) => {
        setEditingId(closureDate.id);
        setFormData(closureDate);
        setModalOpen(true);
        setErrors({});
    };
  
    const handleDelete = async (id: number) => {
        try {
            await deleteClosureDate(id);
            await fetchClosureDates();
        } catch (error) {
            console.error("Failed to delete closure date", error);
            setErrors({ general: "Failed to delete closure date. Please try again." });
        }
    };

    return (
        <AdminLayout>
            {loading && <MvLoader />}
            
            {errors.general && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{errors.general}</p>
                </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Manage Closure Dates</h1>
                <MvButton onClick={() => {
                    setModalOpen(true);
                    setEditingId(null);
                    setFormData({});
                }}>
                    Add Closure Date
                </MvButton>
            </div>

            <SearchFilter
                placeholder="Search by academic year or dates..."
                onSearch={setSearchQuery}
                onFilterChange={(name, value) => setStatusFilter(value)}
                filters={statusOptions}
                className="px-4"
            />
             <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-primary-800">
                    <tr >
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Academic Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Closure Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Final Closure Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-primary-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentDates.length > 0 ? (
                        currentDates.map((closureDate: IClosureDate) => {
                            const today = new Date();
                            const finalDate = new Date(closureDate.final_closure_date);
                            const status = finalDate > today ? "Open" : "Closed";

                            return (
                                <tr key={closureDate.id} className="">
                                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{getAcademicYearName(closureDate.academic_year_id)}</td>
                                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{closureDate.closure_date}</td>
                                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{closureDate.final_closure_date}</td>
                                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        <span className={`px-2 py-1 rounded ${
                                            status === "Open" 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        <MvButton className="mx-3 max-md:my-3" onClick={() => handleEdit(closureDate)}>Edit</MvButton>
                                        <MvButton 
                                            onClick={() => handleDelete(closureDate.id)} 
                                            className="bg-red-500 dark:bg-red-300"
                                        >
                                            Delete
                                        </MvButton>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center p-4">
                                No closure dates found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
            <MvGlobalContributions></MvGlobalContributions>
            {/* Pagination */}
            {filteredDates.length > itemsPerPage && (
                <MvPagination
                    currentPage={currentPage}
                    totalItems={filteredDates.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    className="mt-4"
                />
            )}

            <MvModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setErrors({});
                }}
                title={editingId ? "Edit Closure Date" : "Add Closure Date"}
            >
                <div className="space-y-4">
                    <div>
                         <MvDropdown
                                placeholder="Academic Year"
                                options={academicYear.map(f => ({ value: f.id, label: f.year_name }))}
                                value={formData.academic_year_id || ""}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleInputChange(e as any)} 
                                required
                              />
                       
                        {errors.academic_year_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.academic_year_id}</p>
                        )}
                    </div>

                    <div>
                        <MvDateInput
                            name="closure_date"
                            label="Closure Date"
                            value={formData.closure_date || ""}
                            onChange={handleInputChange}
                            className={errors.closure_date ? "border-red-500" : ""}
                        />
                        {errors.closure_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.closure_date}</p>
                        )}
                    </div>

                    <div>
                        <MvDateInput
                            name="final_closure_date"
                            label="Final Closure Date"
                            value={formData.final_closure_date || ""}
                            onChange={handleInputChange}
                            className={errors.final_closure_date ? "border-red-500" : ""}
                        />
                        {errors.final_closure_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.final_closure_date}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <MvButton 
                            onClick={() => setModalOpen(false)}
                            variant="secondary"
                        >
                            Cancel
                        </MvButton>
                        <MvButton onClick={handleSubmit}>
                            {editingId ? "Update" : "Create"}
                        </MvButton>
                    </div>
                </div>
            </MvModal>
        </AdminLayout>
    );
};